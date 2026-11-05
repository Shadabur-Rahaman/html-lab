-- LOCAL TEST DATABASE ONLY. Never run this file in a Supabase project.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to anon,authenticated,service_role;
grant execute on function auth.uid() to anon,authenticated,service_role;
create schema storage;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
alter table storage.objects enable row level security;
grant usage on schema public,storage to anon,authenticated,service_role;
grant all on storage.objects to anon,authenticated,service_role;
\ir ../migrations/202611020001_html_resources.sql
\ir ../migrations/202611020002_html_rate_housekeeping.sql
\ir ../migrations/202611050001_html_private_classroom.sql
\ir ../migrations/202611050002_html_identity_observation.sql
