\set ON_ERROR_STOP on
begin;
insert into auth.users(id,email,email_confirmed_at) values('aaaaaaaa-1111-4111-8111-111111111111','html-admin@example.test',now());
insert into public.html_authorized_teachers values('aaaaaaaa-1111-4111-8111-111111111111','admin');
insert into public.html_student_enrollments(id,student_name,email_normalized,role,status) values('aaaaaaaa-1111-4111-8111-111111111111','Teacher','html-admin@example.test','admin','active');
set role anon;
do $$begin
 begin perform * from public.html_student_enrollments;raise exception 'Student directory exposed';exception when insufficient_privilege then null;end;
 begin perform public.html_enrollment_authorize('html-admin@example.test','forged');raise exception 'Unverified authorize RPC exposed';exception when insufficient_privilege then null;end;
 begin perform public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','list','{}');raise exception 'Admin RPC exposed';exception when insufficient_privilege then null;end;
end $$;
reset role;
set role service_role;
do $$declare m jsonb;p jsonb;prior integer;
begin
 m:=public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','create','{"name":"Disposable student","email":" HTML-Student@example.test ","role":"admin","status":"active"}');
 if m->>'role'<>'student' or m->>'status'<>'pending' or m->>'email'<>'html-student@example.test' then raise exception 'Caller controlled approval or role';end if;
 p:=public.html_enrollment_authorize('html-student@example.test','html-subject',100);
 if p->>'code'<>'pending' then raise exception 'Pending allowed';end if;
 if not exists(select 1 from public.html_student_enrollments where id=(m->>'id')::uuid and email_verified_at is not null and last_activity_at is null) then raise exception 'Authentication confused with active enrollment';end if;
 m:=public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','approve',jsonb_build_object('id',m->>'id','revision',m->'revision','days',1));
 p:=public.html_enrollment_authorize('html-student@example.test','html-subject',100);
 if(p->>'allowed')::boolean is not true or p->'member' ? 'access_subject' then raise exception 'Active permission invalid';end if;
 if(public.html_enrollment_authorize('html-student@example.test','other-subject',100)->>'code')<>'identity_mismatch' then raise exception 'Subject mismatch allowed';end if;
 if(public.html_enrollment_authorize('js-only@example.test','js-subject',100)->>'code')<>'unapproved' then raise exception 'Unknown identity allowed';end if;
 begin perform public.html_enrollment_command((m->>'id')::uuid,'list','{}');raise exception 'Student became admin';exception when insufficient_privilege then null;end;
 begin perform public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','revoke',jsonb_build_object('id',m->>'id'));raise exception 'Missing revision allowed';exception when serialization_failure then null;end;
 m:=public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','suspend',jsonb_build_object('id',m->>'id','revision',m->'revision'));
 if(public.html_enrollment_authorize('html-student@example.test','html-subject',100)->>'code')<>'suspended' then raise exception 'Suspension bypassed';end if;
 m:=public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','extend',jsonb_build_object('id',m->>'id','revision',m->'revision','days',3));
 if m->>'status'<>'suspended' then raise exception 'Extension silently resumed suspension';end if;
 m:=public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','resume',jsonb_build_object('id',m->>'id','revision',m->'revision'));
 if(public.html_enrollment_authorize('html-student@example.test','html-subject',100)->>'allowed')::boolean is not true then raise exception 'Resume failed';end if;
 m:=public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','revoke',jsonb_build_object('id',m->>'id','revision',m->'revision'));
 if(public.html_enrollment_authorize('html-student@example.test','html-subject',100)->>'code')<>'revoked' then raise exception 'Old identity bypassed revocation';end if;
 m:=public.html_enrollment_command('aaaaaaaa-1111-4111-8111-111111111111','approve',jsonb_build_object('id',m->>'id','revision',m->'revision','days',7));
 update public.html_student_enrollments set starts_at=now()-interval '2 days',expires_at=now()-interval '1 day' where id=(m->>'id')::uuid;
 if(public.html_enrollment_authorize('html-student@example.test','html-subject',100)->>'code')<>'expired' then raise exception 'Server expiry bypassed';end if;
 if not exists(select 1 from public.html_enrollment_audit where enrollment_id=(m->>'id')::uuid and action='expired') then raise exception 'Missing expiry audit';end if;
end $$;
reset role;
rollback;
\echo 'HTML enrollment authorization, expiry, revocation, isolation and audit checks passed.'
