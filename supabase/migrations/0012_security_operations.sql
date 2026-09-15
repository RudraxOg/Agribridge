-- Durable security and ingestion controls. Binary content remains in Storage.

alter table public.file_assets
  add column if not exists quarantine_status text not null default 'pending' check(quarantine_status in ('pending','scanning','clean','rejected')),
  add column if not exists scan_provider text,
  add column if not exists scanned_at timestamptz,
  add column if not exists legal_hold boolean not null default false,
  add column if not exists retention_expires_at timestamptz,
  add column if not exists deleted_at timestamptz;

alter table public.identity_verifications
  add column if not exists protected_reference jsonb,
  add column if not exists protection_key_id text,
  add column if not exists protection_version text;
alter table public.bank_account_references
  add column if not exists protected_reference jsonb,
  add column if not exists protection_key_id text,
  add column if not exists protection_version text;

alter table public.shipments
  add column if not exists logistics_organization_id uuid references public.organizations(id) on delete restrict,
  add column if not exists assigned_driver_user_id uuid references public.profiles(id) on delete set null;
create index if not exists shipments_logistics_idx on public.shipments(logistics_organization_id,status);

create table if not exists public.shipment_positions (
  id uuid primary key default gen_random_uuid(), shipment_id uuid not null references public.shipments(id) on delete cascade,
  logistics_organization_id uuid not null references public.organizations(id) on delete restrict,
  recorded_by uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  position extensions.geography(point,4326) not null, heading_degrees smallint check(heading_degrees between 0 and 359),
  speed_kph numeric(6,2) check(speed_kph>=0), provider_recorded_at timestamptz not null, created_at timestamptz not null default now()
);
create index if not exists shipment_positions_route_idx on public.shipment_positions using gist(position);
create index if not exists shipment_positions_time_idx on public.shipment_positions(shipment_id,provider_recorded_at desc);

create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete cascade,
  file_asset_id uuid references public.file_assets(id) on delete cascade, job_type text not null check(job_type in ('mime_verify','malware_scan','image_derivatives','metadata_strip')),
  status text not null default 'queued' check(status in ('queued','processing','succeeded','failed','quarantined')),
  attempts integer not null default 0 check(attempts between 0 and 10), available_at timestamptz not null default now(), locked_at timestamptz,
  error_code text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists processing_jobs_active_asset_idx on public.processing_jobs(file_asset_id,job_type) where status in ('queued','processing');

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(), provider text not null, provider_event_id text not null,
  payload_sha256 text not null check(payload_sha256 ~ '^[a-f0-9]{64}$'), signature_verified boolean not null,
  processing_status text not null default 'received' check(processing_status in ('received','processed','ignored','failed')),
  error_code text, received_at timestamptz not null default now(), processed_at timestamptz,
  unique(provider,provider_event_id)
);

create table if not exists public.rate_limit_counters (
  namespace text not null, subject_hash text not null check(subject_hash ~ '^[a-f0-9]{64}$'), window_started_at timestamptz not null,
  hit_count integer not null default 1 check(hit_count>0), expires_at timestamptz not null,
  primary key(namespace,subject_hash,window_started_at), check(expires_at>window_started_at)
);

create table if not exists public.sensitive_access_events (
  id uuid primary key default gen_random_uuid(), actor_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null, permission_key text not null,
  resource_type text not null, resource_id uuid, purpose text not null, outcome text not null check(outcome in ('allowed','denied')),
  occurred_at timestamptz not null default now()
);

create table if not exists public.data_retention_policies (
  resource_type text primary key, retention_days integer not null check(retention_days between 1 and 3650),
  deletion_mode text not null check(deletion_mode in ('soft_delete','hard_delete','anonymize','manual_review')),
  legal_hold_supported boolean not null default true, updated_at timestamptz not null default now()
);
insert into public.data_retention_policies(resource_type,retention_days,deletion_mode) values
('auth_events',365,'anonymize'),('security_events',730,'manual_review'),('private_stock_originals',180,'hard_delete'),
('delivery_proofs',730,'manual_review'),('dispute_evidence',1095,'manual_review'),('rate_limit_counters',2,'hard_delete')
on conflict(resource_type) do update set retention_days=excluded.retention_days,deletion_mode=excluded.deletion_mode;

create or replace function public.prevent_security_event_mutation() returns trigger language plpgsql security definer set search_path='' as $$
begin raise exception 'security event records are append-only'; end $$;
create trigger auth_events_append_only before update or delete on public.auth_events for each row execute function public.prevent_security_event_mutation();
create trigger security_events_append_only before update or delete on public.security_events for each row execute function public.prevent_security_event_mutation();
create trigger sensitive_access_events_append_only before update or delete on public.sensitive_access_events for each row execute function public.prevent_security_event_mutation();

alter table public.processing_jobs enable row level security;
alter table public.shipment_positions enable row level security;
alter table public.webhook_events enable row level security;
alter table public.rate_limit_counters enable row level security;
alter table public.sensitive_access_events enable row level security;
alter table public.data_retention_policies enable row level security;
revoke all on public.processing_jobs,public.webhook_events,public.rate_limit_counters,public.sensitive_access_events,public.data_retention_policies from anon,authenticated;
grant select,insert on public.shipment_positions to authenticated;
grant select on public.data_retention_policies to authenticated;
create policy "platform reads retention policy" on public.data_retention_policies for select to authenticated using((select public.has_platform_permission('platform.configure')));
create policy "auditor reads assigned sensitive events" on public.sensitive_access_events for select to authenticated using((select public.has_platform_permission('platform.audit_case.read')));
create policy "participants read shipment positions" on public.shipment_positions for select to authenticated using(exists(select 1 from public.shipments s where s.id=shipment_id and ((select public.has_organization_permission(s.organization_id,'shipments.read')) or (select public.has_organization_permission(s.buyer_organization_id,'shipments.read')) or (s.logistics_organization_id is not null and (select public.has_organization_permission(s.logistics_organization_id,'shipments.read'))))));
create policy "assigned driver writes own positions" on public.shipment_positions for insert to authenticated with check(recorded_by=(select auth.uid()) and exists(select 1 from public.shipments s where s.id=shipment_id and s.logistics_organization_id=logistics_organization_id and s.assigned_driver_user_id=(select auth.uid()) and (select public.has_organization_permission(logistics_organization_id,'shipment.position.write'))));

create or replace function public.consume_rate_limit(limit_namespace text,limit_subject_hash text,max_hits integer,window_seconds integer) returns boolean
language plpgsql security definer set search_path='' as $$
declare window_start timestamptz; current_hits integer;
begin
  if limit_namespace !~ '^[a-z][a-z0-9-]{1,40}$' or limit_subject_hash !~ '^[a-f0-9]{64}$' or max_hits not between 1 and 100 or window_seconds not between 10 and 86400 then return false; end if;
  window_start:=to_timestamp(floor(extract(epoch from now())/window_seconds)*window_seconds);
  insert into public.rate_limit_counters(namespace,subject_hash,window_started_at,hit_count,expires_at)
    values(limit_namespace,limit_subject_hash,window_start,1,window_start+make_interval(secs=>window_seconds))
  on conflict(namespace,subject_hash,window_started_at) do update set hit_count=public.rate_limit_counters.hit_count+1
  returning hit_count into current_hits;
  return current_hits<=max_hits;
end $$;
revoke execute on function public.consume_rate_limit(text,text,integer,integer) from public;
grant execute on function public.consume_rate_limit(text,text,integer,integer) to anon,authenticated;

create or replace function public.record_sensitive_access(target_organization_id uuid,required_permission text,target_resource_type text,target_resource_id uuid,access_purpose text) returns boolean
language plpgsql security definer set search_path='' as $$
declare allowed boolean;
begin
  allowed:=public.has_organization_permission(target_organization_id,required_permission) or public.has_platform_permission('platform.audit_case.read');
  insert into public.sensitive_access_events(actor_user_id,organization_id,permission_key,resource_type,resource_id,purpose,outcome)
    values((select auth.uid()),target_organization_id,required_permission,left(target_resource_type,80),target_resource_id,left(access_purpose,240),case when allowed then 'allowed' else 'denied' end);
  return allowed;
end $$;
revoke execute on function public.record_sensitive_access(uuid,text,text,uuid,text) from public,anon;
grant execute on function public.record_sensitive_access(uuid,text,text,uuid,text) to authenticated;

create or replace function public.claim_processing_jobs(max_jobs integer default 5) returns setof public.processing_jobs
language sql volatile security definer set search_path='' as $$
  update public.processing_jobs jobs set status='processing',locked_at=now(),attempts=jobs.attempts+1,updated_at=now()
  where jobs.id in (select pending.id from public.processing_jobs pending where pending.status='queued' and pending.available_at<=now() and pending.attempts<10 order by pending.available_at for update skip locked limit least(greatest(max_jobs,1),20))
  returning jobs.*
$$;
revoke execute on function public.claim_processing_jobs(integer) from public,anon,authenticated;
grant execute on function public.claim_processing_jobs(integer) to service_role;

create or replace function public.run_retention_maintenance() returns jsonb language plpgsql security definer set search_path='' as $$
declare removed_limits integer; anonymized_auth integer; removed_jobs integer;
begin
  delete from public.rate_limit_counters where expires_at<now()-interval '1 day'; get diagnostics removed_limits=row_count;
  update public.auth_events set ip_hash=null,device_family=null,metadata=metadata-'network' where occurred_at<now()-interval '365 days' and (ip_hash is not null or device_family is not null); get diagnostics anonymized_auth=row_count;
  delete from public.processing_jobs where status in ('succeeded','failed','quarantined') and updated_at<now()-interval '180 days'; get diagnostics removed_jobs=row_count;
  return jsonb_build_object('rate_limit_rows_removed',removed_limits,'auth_events_anonymized',anonymized_auth,'processing_jobs_removed',removed_jobs);
end $$;
revoke execute on function public.run_retention_maintenance() from public,anon,authenticated;
grant execute on function public.run_retention_maintenance() to service_role;

revoke execute on function public.prevent_security_event_mutation() from public,anon,authenticated;
