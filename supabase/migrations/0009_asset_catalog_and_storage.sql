create table public.asset_sources (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  source_page_url text,
  source_asset_url text,
  title text,
  author text,
  license_code text not null,
  license_url text,
  attribution_text text,
  retrieved_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table public.file_assets (
  id uuid primary key default gen_random_uuid(),
  owner_organization_id uuid references public.organizations(id) on delete restrict,
  source_id uuid references public.asset_sources(id) on delete set null,
  bucket text not null,
  object_path text not null check (object_path !~* '(aadhaar|phone|bank|cvv|token|secret)'),
  original_filename text,
  mime_type text not null,
  byte_size bigint not null check (byte_size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  visibility text not null check (visibility in ('public','private')),
  purpose text not null,
  processing_status text not null default 'ready' check (processing_status in ('queued','processing','ready','failed','quarantined')),
  is_synthetic boolean not null default false,
  alt_text jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (bucket, object_path),
  unique (checksum_sha256, bucket)
);
create index file_assets_owner_idx on public.file_assets(owner_organization_id, purpose);
create index file_assets_source_idx on public.file_assets(source_id);

create table public.stock_lot_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  stock_lot_id uuid not null references public.stock_lots(id) on delete cascade,
  file_asset_id uuid not null references public.file_assets(id) on delete restrict,
  position integer not null default 0 check (position >= 0),
  view_angle integer check (view_angle between 0 and 359),
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  unique(stock_lot_id, file_asset_id),
  unique(stock_lot_id, position)
);
create index stock_lot_assets_lot_idx on public.stock_lot_assets(stock_lot_id, position);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('public-brand-assets','public-brand-assets',true,5242880,array['image/svg+xml','image/png','image/webp','image/avif']),
('public-listing-media','public-listing-media',true,15728640,array['image/svg+xml','image/jpeg','image/png','image/webp','image/avif']),
('private-stock-originals','private-stock-originals',false,83886080,array['image/jpeg','image/png','image/webp','image/heic','image/heif','video/mp4','video/webm'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

alter table public.asset_sources enable row level security;
alter table public.file_assets enable row level security;
alter table public.stock_lot_assets enable row level security;

drop policy if exists "organization reads private objects" on storage.objects;
drop policy if exists "fpo operators upload private objects" on storage.objects;

create policy "asset attribution is readable" on public.asset_sources for select to anon,authenticated using(true);
create policy "public or tenant files are readable" on public.file_assets for select to anon,authenticated using(
  visibility='public' or (auth.role()='authenticated' and owner_organization_id=public.current_organization_id())
);
create policy "fpo operators register files" on public.file_assets for insert to authenticated with check(
  owner_organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])
);
create policy "fpo operators update processing metadata" on public.file_assets for update to authenticated
using(owner_organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]))
with check(owner_organization_id=public.current_organization_id());
create policy "published or tenant lot assets are readable" on public.stock_lot_assets for select to anon,authenticated using(
  organization_id=public.current_organization_id() or exists(
    select 1 from public.stock_lots lot join public.file_assets file on file.id=file_asset_id
    where lot.id=stock_lot_id and lot.status='published' and file.visibility='public' and file.processing_status='ready'
  )
);
create policy "fpo operators bind lot assets" on public.stock_lot_assets for insert to authenticated with check(
  organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])
  and exists(select 1 from public.file_assets file where file.id=file_asset_id and file.owner_organization_id=public.current_organization_id())
);

create policy "public objects are readable" on storage.objects for select to anon,authenticated using(bucket_id in ('public-brand-assets','public-listing-media'));
create policy "tenant uploads private originals" on storage.objects for insert to authenticated with check(
  bucket_id='private-stock-originals'
  and (storage.foldername(name))[1]=public.current_organization_id()::text
  and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])
);
create policy "tenant reads private originals" on storage.objects for select to authenticated using(
  bucket_id='private-stock-originals'
  and (storage.foldername(name))[1]=public.current_organization_id()::text
  and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])
);
create policy "authorized fpo reads farmer documents" on storage.objects for select to authenticated using(
  bucket_id='farmer-documents'
  and (storage.foldername(name))[1]=public.current_organization_id()::text
  and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])
);
create policy "tenant reads scoped private evidence" on storage.objects for select to authenticated using(
  bucket_id in ('grading-certificates','delivery-proofs','dispute-evidence')
  and exists(select 1 from public.file_assets file where file.bucket=bucket_id and file.object_path=name and file.owner_organization_id=public.current_organization_id())
);
create policy "fpo operators upload scoped private evidence" on storage.objects for insert to authenticated with check(
  bucket_id in ('farmer-documents','grading-certificates','delivery-proofs','dispute-evidence')
  and (storage.foldername(name))[1]=public.current_organization_id()::text
  and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])
);

revoke insert,update,delete on public.asset_sources from anon,authenticated;
revoke delete on public.file_assets from authenticated;
revoke update,delete on public.stock_lot_assets from authenticated;
