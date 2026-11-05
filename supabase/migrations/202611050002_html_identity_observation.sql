-- Keep verified Cloudflare authentication distinct from enrollment authorization.
-- No JS data or public resource policies change.
begin;
create or replace function public.html_enrollment_authorize(verified_email text,verified_subject text,verified_issued_at bigint default 0) returns jsonb
 language plpgsql security definer set search_path='' as $$
declare m public.html_student_enrollments; reason text;
begin
 if verified_subject is null or length(verified_subject) not between 1 and 255 or verified_email is null or length(verified_email)>254 then return jsonb_build_object('allowed',false,'code','unauthenticated');end if;
 select * into m from public.html_student_enrollments where email_normalized=lower(trim(verified_email)) for update;
 if found and (m.access_subject is null or m.access_subject=verified_subject) then
  if m.access_subject is null then insert into public.html_enrollment_audit(enrollment_id,action) values(m.id,'identity_verified');end if;
  if verified_issued_at>coalesce(m.last_token_iat,0) then insert into public.html_enrollment_audit(enrollment_id,action) values(m.id,'verified_login');end if;
  update public.html_student_enrollments set access_subject=coalesce(access_subject,verified_subject),email_verified_at=coalesce(email_verified_at,now()),
   last_token_iat=greatest(coalesce(last_token_iat,0),verified_issued_at),last_login_at=case when verified_issued_at>coalesce(last_token_iat,0) then now() else last_login_at end,
   last_verified_at=case when last_verified_at is null or last_verified_at<now()-interval '1 minute' then now() else last_verified_at end where id=m.id returning * into m;
 end if;
 if m.id is null then reason:='unapproved';
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
 update public.html_student_enrollments set last_activity_at=case when last_activity_at is null or last_activity_at<now()-interval '1 minute' then now() else last_activity_at end where id=m.id returning * into m;
 return jsonb_build_object('allowed',true,'member',public.html_enrollment_view(m),'server_time',now());
end $$;

commit;
