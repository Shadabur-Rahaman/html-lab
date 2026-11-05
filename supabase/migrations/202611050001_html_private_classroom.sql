-- Independent HTML enrollments. No JS tables, grants, resources or policies change.
begin;
create table public.html_student_enrollments (
 id uuid primary key default gen_random_uuid(),
 student_name text not null check(length(student_name) between 1 and 120),
 email_normalized text not null unique check(email_normalized=lower(trim(email_normalized)) and length(email_normalized)<=254),
 role text not null default 'student' check(role in ('admin','student')),
 status text not null default 'pending' check(status in ('pending','active','suspended','rejected','expired','revoked')),
 approved_by uuid, approved_at timestamptz, starts_at timestamptz, expires_at timestamptz,
 suspended_at timestamptz, revoked_at timestamptz, access_subject text unique,
 email_verified_at timestamptz, last_verified_at timestamptz, last_activity_at timestamptz,
 last_token_iat bigint, last_login_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), version integer not null default 1,
 check(role='admin' or expires_at is null or starts_at<expires_at)
);
create index html_enrollment_expiry on public.html_student_enrollments(status,expires_at);
create table public.html_enrollment_audit (
 id bigint generated always as identity primary key, enrollment_id uuid, actor uuid,
 action text not null, at timestamptz not null default now(), detail jsonb not null default '{}'
);
create index html_enrollment_history on public.html_enrollment_audit(enrollment_id,id desc);
alter table public.html_student_enrollments enable row level security;
alter table public.html_enrollment_audit enable row level security;
revoke all on public.html_student_enrollments,public.html_enrollment_audit from public,anon,authenticated;
grant all on public.html_student_enrollments,public.html_enrollment_audit to service_role;
grant usage,select on sequence public.html_enrollment_audit_id_seq to service_role;
-- Reuse only already confirmed HTML admins, never JS students or first visitors.
insert into public.html_student_enrollments(id,student_name,email_normalized,role,status,approved_at)
 select u.id,'Teacher',lower(u.email),'admin','active',now() from auth.users u
 join public.html_authorized_teachers t on t.user_id=u.id
 where t.role='admin' and u.email_confirmed_at is not null and u.email is not null;

create function public.html_enrollment_view(e public.html_student_enrollments) returns jsonb
 language sql stable set search_path='' as $$
 select (to_jsonb(e)-'access_subject'-'last_token_iat') || jsonb_build_object(
 'name',e.student_name,'email',e.email_normalized,'revision',e.version,
 'effective_status',case when e.status='active' and e.role='student' and e.expires_at<=now() then 'expired' when e.status='active' and e.starts_at>now() then 'not_started' else e.status end,
 'remaining_seconds',case when e.expires_at is null then null else greatest(0,extract(epoch from e.expires_at-now())) end)
$$;
revoke all on function public.html_enrollment_view(public.html_student_enrollments) from public,anon,authenticated;
grant execute on function public.html_enrollment_view(public.html_student_enrollments) to service_role;

create function public.html_enrollment_authorize(verified_email text,verified_subject text,verified_issued_at bigint default 0) returns jsonb
 language plpgsql security definer set search_path='' as $$
declare m public.html_student_enrollments; reason text;
begin
 if verified_subject is null or length(verified_subject) not between 1 and 255 or verified_email is null or length(verified_email)>254 then return jsonb_build_object('allowed',false,'code','unauthenticated');end if;
 select * into m from public.html_student_enrollments where email_normalized=lower(trim(verified_email)) for update;
 if not found then reason:='unapproved';
 elsif m.access_subject is not null and m.access_subject<>verified_subject then reason:='identity_mismatch';
 elsif m.status<>'active' then reason:=m.status;
 elsif m.role='admin' and not exists(select 1 from public.html_authorized_teachers where user_id=m.id and role='admin') then reason:='revoked';
 elsif m.role='student' and (m.starts_at is null or m.expires_at is null) then reason:='pending';
 elsif m.role='student' and m.starts_at>now() then reason:='not_started';
 elsif m.role='student' and m.expires_at<=now() then
  reason:='expired';
  update public.html_student_enrollments set status='expired',version=version+1,updated_at=now() where id=m.id;
  insert into public.html_enrollment_audit(enrollment_id,action) values(m.id,'expired');
 end if;
 if reason is not null then
  if public.html_resource_rate('html-denied:'||md5(verified_email),1,60) then insert into public.html_enrollment_audit(enrollment_id,action,detail) values(m.id,'access_denied',jsonb_build_object('reason',reason));end if;
  return jsonb_build_object('allowed',false,'code',reason,'server_time',now());
 end if;
 if m.access_subject is null then insert into public.html_enrollment_audit(enrollment_id,action) values(m.id,'identity_verified');end if;
 if verified_issued_at>coalesce(m.last_token_iat,0) then insert into public.html_enrollment_audit(enrollment_id,action) values(m.id,'verified_login');end if;
 update public.html_student_enrollments set access_subject=coalesce(access_subject,verified_subject),email_verified_at=coalesce(email_verified_at,now()),
 last_token_iat=greatest(coalesce(last_token_iat,0),verified_issued_at),
 last_login_at=case when verified_issued_at>coalesce(last_token_iat,0) then now() else last_login_at end,
 last_verified_at=case when last_verified_at is null or last_verified_at<now()-interval '1 minute' then now() else last_verified_at end,
 last_activity_at=case when last_activity_at is null or last_activity_at<now()-interval '1 minute' then now() else last_activity_at end where id=m.id returning * into m;
 return jsonb_build_object('allowed',true,'member',public.html_enrollment_view(m),'server_time',now());
end $$;

create function public.html_enrollment_command(admin_id uuid,command text,body jsonb default '{}') returns jsonb
 language plpgsql security definer set search_path='' as $$
declare a public.html_student_enrollments;m public.html_student_enrollments;before_row jsonb;start_time timestamptz;end_time timestamptz;days_value integer;email_value text;
begin
 select * into a from public.html_student_enrollments where id=admin_id for update;
 if not found or a.role<>'admin' or a.status<>'active' or not exists(select 1 from public.html_authorized_teachers where user_id=a.id and role='admin') then raise exception 'Administrator required' using errcode='42501';end if;
 if command='list' then
  with changed as(update public.html_student_enrollments set status='expired',version=version+1,updated_at=now() where role='student' and status='active' and expires_at<=now() returning id)
   insert into public.html_enrollment_audit(enrollment_id,action) select id,'expired' from changed;
  return coalesce((select jsonb_agg(public.html_enrollment_view(e) order by e.created_at desc) from public.html_student_enrollments e),'[]');
 elsif command='audit' then
  return coalesce((select jsonb_agg(to_jsonb(l) order by l.id desc) from(select * from public.html_enrollment_audit where not(body ? 'id') or enrollment_id=(body->>'id')::uuid order by id desc limit 200)l),'[]');
 elsif command='create' then
  email_value:=lower(trim(body->>'email'));
  if email_value is null or length(email_value)>254 or email_value!~'^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(trim(coalesce(body->>'name',''))) not between 1 and 120 then raise exception 'Invalid student details' using errcode='22023';end if;
  if(select count(*) from public.html_student_enrollments)>=1000 then raise exception 'Enrollment limit reached' using errcode='22023';end if;
  insert into public.html_student_enrollments(student_name,email_normalized) values(trim(body->>'name'),email_value) returning * into m;
 else
  select * into m from public.html_student_enrollments where id=(body->>'id')::uuid for update;
  if not found or m.role<>'student' then raise exception 'Student not found' using errcode='22023';end if;
  if m.version is distinct from (body->>'revision')::integer then raise exception 'Record changed. Refresh first' using errcode='40001';end if;
  before_row:=public.html_enrollment_view(m);
  if command in('approve','extend') then
   if command='extend' and m.status not in('active','expired','suspended') then raise exception 'Approve this enrollment first' using errcode='22023';end if;
   start_time:=case when command='extend' then coalesce(m.starts_at,now()) else coalesce((body->>'starts_at')::timestamptz,now()) end;
   if body ? 'days' then
    if jsonb_typeof(body->'days')<>'number' or (body->>'days')::numeric<>trunc((body->>'days')::numeric) then raise exception 'Invalid duration' using errcode='22023';end if;
    days_value:=(body->>'days')::integer;if days_value not between 1 and 1825 then raise exception 'Invalid duration' using errcode='22023';end if;
    end_time:=case when command='extend' then greatest(now(),coalesce(m.expires_at,now())) else start_time end+make_interval(days=>days_value);
   else end_time:=(body->>'expires_at')::timestamptz;end if;
   if end_time is null or end_time<=start_time or end_time<=now() or end_time>now()+interval '5 years' then raise exception 'Invalid enrollment dates' using errcode='22023';end if;
   update public.html_student_enrollments set status=case when command='extend' and status='suspended' then 'suspended' else 'active' end,starts_at=start_time,expires_at=end_time,
    approved_by=a.id,approved_at=case when command='approve' then now() else approved_at end,
    revoked_at=null,suspended_at=case when command='approve' then null else suspended_at end where id=m.id;
  elsif command='resume' then
   if m.status<>'suspended' or m.expires_at is null or m.expires_at<=now() then raise exception 'Extend expired access before resuming' using errcode='22023';end if;
   update public.html_student_enrollments set status='active',suspended_at=null where id=m.id;
  elsif command in('suspend','revoke','reject') then
   update public.html_student_enrollments set status=case command when 'suspend' then 'suspended' when 'revoke' then 'revoked' else 'rejected' end,
    suspended_at=case when command='suspend' then now() else suspended_at end,revoked_at=case when command='revoke' then now() else revoked_at end where id=m.id;
  else raise exception 'Unknown command' using errcode='22023';end if;
  update public.html_student_enrollments set version=version+1,updated_at=now() where id=m.id returning * into m;
 end if;
 insert into public.html_enrollment_audit(actor,enrollment_id,action,detail) values(a.id,m.id,command,jsonb_build_object('before',before_row,'after',public.html_enrollment_view(m)));
 return public.html_enrollment_view(m);
end $$;
revoke all on function public.html_enrollment_authorize(text,text,bigint),public.html_enrollment_command(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.html_enrollment_authorize(text,text,bigint),public.html_enrollment_command(uuid,text,jsonb) to service_role;
grant select on public.html_published_resources to service_role;
commit;
