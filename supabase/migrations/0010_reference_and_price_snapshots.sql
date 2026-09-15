create schema if not exists extensions;
create extension if not exists postgis with schema extensions;

create table public.collection_centres (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  district text not null,
  state text not null,
  location extensions.geography(point,4326) not null,
  cold_storage_available boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,name)
);
create index collection_centres_location_idx on public.collection_centres using gist(location);

alter table public.land_parcels add column location extensions.geography(point,4326);
update public.land_parcels set location=extensions.st_setsrid(extensions.st_makepoint(longitude,latitude),4326)::extensions.geography where latitude is not null and longitude is not null;
create index land_parcels_location_idx on public.land_parcels using gist(location);

create table public.crop_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check(slug ~ '^[a-z0-9-]+$'),
  name jsonb not null,
  default_quantity_unit public.quantity_unit not null default 'kg',
  quality_parameters jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.land_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict,
  land_parcel_id uuid references public.land_parcels(id) on delete restrict,
  file_asset_id uuid not null references public.file_assets(id) on delete restrict,
  document_type text not null,
  masked_reference text,
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index land_documents_farmer_idx on public.land_documents(organization_id,farmer_id);

create table public.farmer_auth_methods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict,
  method text not null check(method in ('mock_thumb_consent','facial_provider','operator_pin','voice_confirmation')),
  provider text not null,
  provider_reference text not null,
  status public.verification_status not null default 'pending',
  consent_record_id uuid references public.consent_records(id) on delete restrict,
  enrolled_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique(provider,provider_reference)
);

create table public.order_price_snapshots (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete restrict,
  produce_subtotal_paise bigint not null check(produce_subtotal_paise>=0),
  fpo_share_paise bigint not null check(fpo_share_paise>=0),
  agribridge_share_paise bigint not null check(agribridge_share_paise>=0),
  logistics_paise bigint not null check(logistics_paise>=0),
  insurance_paise bigint not null default 0 check(insurance_paise>=0),
  statutory_charges_paise bigint not null default 0 check(statutory_charges_paise>=0),
  adjustments_paise bigint not null default 0,
  buyer_payable_paise bigint not null check(buyer_payable_paise>=0),
  farmer_pool_paise bigint not null check(farmer_pool_paise>=0),
  first_release_paise bigint not null check(first_release_paise>=0),
  second_release_paise bigint not null check(second_release_paise>=0),
  calculator_version text not null,
  calculation_inputs jsonb not null,
  created_at timestamptz not null default now(),
  check(first_release_paise+second_release_paise=farmer_pool_paise)
);
create trigger order_price_snapshots_immutable before update or delete on public.order_price_snapshots for each row execute function public.prevent_financial_mutation();
create trigger collection_centres_updated before update on public.collection_centres for each row execute function public.set_updated_at();

alter table public.collection_centres enable row level security;
alter table public.crop_catalog enable row level security;
alter table public.land_documents enable row level security;
alter table public.farmer_auth_methods enable row level security;
alter table public.order_price_snapshots enable row level security;

create policy "tenant reads collection centres" on public.collection_centres for select to authenticated using(organization_id=public.current_organization_id());
create policy "fpo operators manage collection centres" on public.collection_centres for all to authenticated using(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])) with check(organization_id=public.current_organization_id());
create policy "active crop catalog is readable" on public.crop_catalog for select to anon,authenticated using(active);
create policy "authorized fpo reads land documents" on public.land_documents for select to authenticated using(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]));
create policy "authorized fpo registers land documents" on public.land_documents for insert to authenticated with check(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]));
create policy "authorized fpo reads farmer auth status" on public.farmer_auth_methods for select to authenticated using(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]));
create policy "order participants read immutable snapshot" on public.order_price_snapshots for select to authenticated using(exists(select 1 from public.orders orders where orders.id=order_id and (orders.organization_id=public.current_organization_id() or orders.buyer_organization_id=public.current_organization_id())));

revoke update,delete on public.land_documents from authenticated;
revoke update,delete on public.farmer_auth_methods from authenticated;
revoke insert,update,delete on public.order_price_snapshots from authenticated;
