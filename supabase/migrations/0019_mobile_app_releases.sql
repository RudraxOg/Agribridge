create table public.mobile_app_releases (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('android')),
  channel text not null check (channel in ('stable','beta','internal')),
  version_name text not null check (char_length(version_name) between 1 and 40),
  version_code integer not null check (version_code > 0),
  status text not null default 'draft' check (status in ('draft','published','retired')),
  apk_storage_path text check (apk_storage_path is null or apk_storage_path ~ '^releases/android/agribridge-v[0-9][A-Za-z0-9.+-]*-release\\.apk$'),
  apk_download_url text check (apk_download_url is null or apk_download_url ~ '^https://'),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  file_size_bytes bigint not null check (file_size_bytes > 0),
  min_android_sdk integer not null check (min_android_sdk between 26 and 99),
  release_notes jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (platform, channel, version_code),
  check (apk_download_url is not null or apk_storage_path is not null),
  check ((status='published') = (published_at is not null))
);
create index mobile_app_releases_latest_stable_idx on public.mobile_app_releases(platform,channel,published_at desc,version_code desc) where status='published';

create table public.mobile_release_download_aggregates (
  release_id uuid not null references public.mobile_app_releases(id) on delete cascade,
  downloaded_on date not null default current_date,
  downloads bigint not null default 0 check (downloads >= 0),
  primary key(release_id,downloaded_on)
);

alter table public.mobile_app_releases enable row level security;
alter table public.mobile_release_download_aggregates enable row level security;
revoke all on public.mobile_app_releases, public.mobile_release_download_aggregates from anon, authenticated;
grant select on public.mobile_app_releases to anon, authenticated;
create policy "public reads published android stable metadata" on public.mobile_app_releases for select to anon, authenticated using(platform='android' and channel='stable' and status='published' and published_at is not null);
create policy "platform administrators manage mobile releases" on public.mobile_app_releases for all to authenticated using((select public.has_platform_permission('platform.configure'))) with check((select public.has_platform_permission('platform.configure')));

create or replace function public.record_mobile_release_download(target_release_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
begin
  if not exists(select 1 from public.mobile_app_releases r where r.id=target_release_id and r.platform='android' and r.channel='stable' and r.status='published' and r.published_at is not null) then return false; end if;
  insert into public.mobile_release_download_aggregates(release_id,downloaded_on,downloads) values(target_release_id,current_date,1)
  on conflict(release_id,downloaded_on) do update set downloads=public.mobile_release_download_aggregates.downloads+1;
  insert into public.security_events(event_type,severity,resource_type,resource_id,metadata) values('mobile_release_download_resolved','info','mobile_app_release',target_release_id,'{}'::jsonb);
  return true;
end $$;
revoke execute on function public.record_mobile_release_download(uuid) from public;
grant execute on function public.record_mobile_release_download(uuid) to anon,authenticated;
