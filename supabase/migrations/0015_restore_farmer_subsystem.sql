-- Restore the farmer registry, crop planning, contributor allocation and
-- farmer payout surfaces. This is intentionally forward-only so databases
-- that already applied 0014 can converge without rewriting migration history.

do $$
begin
  if exists (
    select 1 from pg_enum e join pg_type t on t.oid=e.enumtypid
    join pg_namespace n on n.oid=t.typnamespace
    where n.nspname='public' and t.typname='app_role' and e.enumlabel='retired_assisted_role'
  ) then
    alter type public.app_role rename value 'retired_assisted_role' to 'assisted_farmer';
  end if;
end
$$;

alter table public.orders rename column supplier_net_settlement_paise to net_farmer_payout_paise;
alter table public.order_price_snapshots rename column supplier_pool_paise to farmer_pool_paise;

create table public.consent_records (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  subject_profile_id uuid references public.profiles(id) on delete set null, purpose text not null, notice_version text not null,
  consented boolean not null, alternative_offered boolean not null default false, recorded_by uuid references public.profiles(id) on delete set null,
  recorded_at timestamptz not null default now(), withdrawn_at timestamptz
);
create table public.identity_verifications (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  provider text not null, verification_reference text not null, masked_identifier text not null check(char_length(masked_identifier)<=32),
  last_four char(4), status public.verification_status not null, verified_at timestamptz,
  consent_record_id uuid not null references public.consent_records(id) on delete restrict, created_at timestamptz not null default now(),
  unique(provider,verification_reference)
);
create table public.bank_account_references (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  provider text not null, verification_reference text not null, account_last_four char(4) not null, ifsc_masked text,
  status public.verification_status not null default 'pending', verified_at timestamptz, created_at timestamptz not null default now(),
  unique(provider,verification_reference)
);
create table public.farmers (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_code text not null, full_name text not null, phone_masked text, preferred_locale text not null default 'hi',
  village text not null, district text not null, state text not null,
  identity_verification_id uuid references public.identity_verifications(id) on delete restrict,
  bank_account_reference_id uuid references public.bank_account_references(id) on delete restrict,
  created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(organization_id,farmer_code)
);
create index farmers_org_name_idx on public.farmers(organization_id,full_name);
create index farmers_org_village_idx on public.farmers(organization_id,village);
create table public.land_parcels (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict, name text not null, area numeric(12,3) not null check(area>0),
  area_unit text not null check(area_unit in ('acre','hectare')), khatauni_reference_masked text, latitude numeric(9,6), longitude numeric(9,6),
  created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index land_parcels_farmer_idx on public.land_parcels(farmer_id);
alter table public.land_parcels add column location extensions.geography(point,4326);
create index land_parcels_location_idx on public.land_parcels using gist(location);
create table public.crop_cycles (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict, land_parcel_id uuid not null references public.land_parcels(id) on delete restrict,
  commodity text not null, variety text, sowing_date date, expected_harvest_start date not null, expected_harvest_end date not null check(expected_harvest_end>=expected_harvest_start),
  expected_quantity numeric(14,3) check(expected_quantity>0), quantity_unit public.quantity_unit not null default 'kg',
  status text not null default 'planned' check(status in ('planned','growing','harvest_ready','harvested','cancelled')),
  created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index crop_cycles_org_harvest_idx on public.crop_cycles(organization_id,expected_harvest_start);
create table public.lot_contributors (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  stock_lot_id uuid not null references public.stock_lots(id) on delete restrict, farmer_id uuid not null references public.farmers(id) on delete restrict,
  quantity numeric(14,3) not null check(quantity>0), quantity_unit public.quantity_unit not null default 'kg', created_at timestamptz not null default now(), unique(stock_lot_id,farmer_id)
);
create table public.land_documents (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict, land_parcel_id uuid references public.land_parcels(id) on delete restrict,
  file_asset_id uuid not null references public.file_assets(id) on delete restrict, document_type text not null, masked_reference text,
  verification_status public.verification_status not null default 'pending', created_at timestamptz not null default now()
);
create index land_documents_farmer_idx on public.land_documents(organization_id,farmer_id);
create table public.farmer_auth_methods (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict, method text not null check(method in ('mock_thumb_consent','facial_provider','operator_pin','voice_confirmation')),
  provider text not null, provider_reference text not null, status public.verification_status not null default 'pending',
  consent_record_id uuid references public.consent_records(id) on delete restrict, enrolled_at timestamptz, revoked_at timestamptz, created_at timestamptz not null default now(), unique(provider,provider_reference)
);
create table public.farmer_payouts (
  id uuid primary key default gen_random_uuid(), settlement_id uuid not null references public.settlements(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict, lot_contributor_id uuid not null references public.lot_contributors(id) on delete restrict,
  gross_paise bigint not null check(gross_paise>=0), deductions_paise bigint not null default 0 check(deductions_paise>=0), net_paise bigint not null check(net_paise>=0),
  bank_account_reference_id uuid references public.bank_account_references(id) on delete restrict,
  status text not null default 'pending' check(status in ('pending','processing','paid','failed','held')), provider_reference text, created_at timestamptz not null default now()
);

create trigger farmers_updated before update on public.farmers for each row execute function public.set_updated_at();
create trigger land_parcels_updated before update on public.land_parcels for each row execute function public.set_updated_at();
create trigger crop_cycles_updated before update on public.crop_cycles for each row execute function public.set_updated_at();

insert into public.permissions(key,description) values
('farmers.read','Read tenant-safe farmer records'),('farmers.write','Create and update farmer records'),('farmer_documents.read','Read private farmer documents')
on conflict(key) do update set description=excluded.description;
with grants(role_key,permission_key) as (values
 ('fpo_owner','farmers.read'),('fpo_owner','farmers.write'),('fpo_owner','farmer_documents.read'),
 ('fpo_admin','farmers.read'),('fpo_admin','farmers.write'),('fpo_admin','farmer_documents.read'),
 ('fpo_operator','farmers.read'),('fpo_operator','farmers.write'),('fpo_operator','farmer_documents.read')
)
insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from grants g join public.roles r on r.key=g.role_key join public.permissions p on p.key=g.permission_key on conflict do nothing;

alter table public.consent_records enable row level security;
alter table public.identity_verifications enable row level security;
alter table public.bank_account_references enable row level security;
alter table public.farmers enable row level security;
alter table public.land_parcels enable row level security;
alter table public.crop_cycles enable row level security;
alter table public.lot_contributors enable row level security;
alter table public.land_documents enable row level security;
alter table public.farmer_auth_methods enable row level security;
alter table public.farmer_payouts enable row level security;

do $$ declare table_name text; begin foreach table_name in array array['consent_records','identity_verifications','bank_account_references','land_parcels','crop_cycles','lot_contributors'] loop
  execute format('create policy "restored tenant select" on public.%I for select to authenticated using(organization_id=public.current_organization_id())',table_name);
  execute format('create policy "restored tenant insert" on public.%I for insert to authenticated with check(organization_id=public.current_organization_id())',table_name);
  execute format('create policy "restored tenant update" on public.%I for update to authenticated using(organization_id=public.current_organization_id()) with check(organization_id=public.current_organization_id())',table_name);
end loop; end $$;
create policy "permission reads farmers" on public.farmers for select to authenticated using((select public.has_organization_permission(organization_id,'farmers.read')));
create policy "permission inserts farmers" on public.farmers for insert to authenticated with check((select public.has_organization_permission(organization_id,'farmers.write')));
create policy "permission updates farmers" on public.farmers for update to authenticated using((select public.has_organization_permission(organization_id,'farmers.write'))) with check((select public.has_organization_permission(organization_id,'farmers.write')));
create policy "permission reads farmer documents" on public.land_documents for select to authenticated using((select public.has_organization_permission(organization_id,'farmer_documents.read')));
create policy "permission registers farmer documents" on public.land_documents for insert to authenticated with check((select public.has_organization_permission(organization_id,'farmer_documents.read')) and (select public.has_organization_permission(organization_id,'files.upload')));
create policy "authorized fpo reads farmer auth status" on public.farmer_auth_methods for select to authenticated using((select public.has_organization_permission(organization_id,'farmers.read')));
create policy "fpo reads farmer payouts" on public.farmer_payouts for select to authenticated using(exists(select 1 from public.settlements s join public.orders o on o.id=s.order_id where s.id=settlement_id and o.organization_id=public.current_organization_id()));

grant select,insert,update on public.consent_records,public.identity_verifications,public.bank_account_references,public.farmers,public.land_parcels,public.crop_cycles,public.lot_contributors,public.land_documents,public.farmer_auth_methods,public.farmer_payouts to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('farmer-documents','farmer-documents',false,10485760,array['application/pdf','image/jpeg','image/png'])
on conflict(id) do nothing;
create policy "document permission reads farmer objects" on storage.objects for select to authenticated using(bucket_id='farmer-documents' and (storage.foldername(name))[1] ~ '^[a-f0-9-]{36}$' and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'farmer_documents.read')));
create policy "document permission uploads farmer objects" on storage.objects for insert to authenticated with check(bucket_id='farmer-documents' and (storage.foldername(name))[1] ~ '^[a-f0-9-]{36}$' and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'farmer_documents.read')) and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'files.upload')));
