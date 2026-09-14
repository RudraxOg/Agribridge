create table public.farmers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_code text not null,
  full_name text not null,
  phone_masked text,
  preferred_locale text not null default 'hi',
  village text not null,
  district text not null,
  state text not null,
  identity_verification_id uuid references public.identity_verifications(id) on delete restrict,
  bank_account_reference_id uuid references public.bank_account_references(id) on delete restrict,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, farmer_code)
);
create index farmers_org_name_idx on public.farmers(organization_id, full_name);
create index farmers_org_village_idx on public.farmers(organization_id, village);

create table public.land_parcels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict,
  name text not null,
  area numeric(12,3) not null check (area > 0),
  area_unit text not null check (area_unit in ('acre','hectare')),
  khatauni_reference_masked text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index land_parcels_farmer_idx on public.land_parcels(farmer_id);

create table public.crop_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict,
  land_parcel_id uuid not null references public.land_parcels(id) on delete restrict,
  commodity text not null,
  variety text,
  sowing_date date,
  expected_harvest_start date not null,
  expected_harvest_end date not null check (expected_harvest_end >= expected_harvest_start),
  expected_quantity numeric(14,3) check (expected_quantity > 0),
  quantity_unit public.quantity_unit not null default 'kg',
  status text not null default 'planned' check (status in ('planned','growing','harvest_ready','harvested','cancelled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index crop_cycles_org_harvest_idx on public.crop_cycles(organization_id, expected_harvest_start);

create trigger farmers_updated before update on public.farmers for each row execute function public.set_updated_at();
create trigger land_parcels_updated before update on public.land_parcels for each row execute function public.set_updated_at();
create trigger crop_cycles_updated before update on public.crop_cycles for each row execute function public.set_updated_at();
