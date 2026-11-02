-- HTML-only grant correction and expired request-counter housekeeping.
-- This never touches resource records or stored files and installs no schedule.
grant usage,select on sequence public.html_resource_audit_log_id_seq to service_role;
create index if not exists html_rate_expiry on public.html_resource_rate_limits(expires_at);
create or replace function public.html_resource_rate(key_value text, maximum integer, seconds integer) returns boolean
 language plpgsql security definer set search_path='' as $$
declare count_value integer;
begin
 if key_value='public-links-total' then
  delete from public.html_resource_rate_limits where expires_at < now();
 end if;
 insert into public.html_resource_rate_limits(key,hits,expires_at) values(key_value,1,now()+make_interval(secs=>seconds))
 on conflict(key) do update set hits=case when public.html_resource_rate_limits.expires_at<now() then 1 else public.html_resource_rate_limits.hits+1 end,
 expires_at=case when public.html_resource_rate_limits.expires_at<now() then now()+make_interval(secs=>seconds) else public.html_resource_rate_limits.expires_at end
 returning hits into count_value;
 return count_value<=maximum;
end $$;
revoke all on function public.html_resource_rate(text,integer,integer) from public,anon,authenticated;
grant execute on function public.html_resource_rate(text,integer,integer) to service_role;
