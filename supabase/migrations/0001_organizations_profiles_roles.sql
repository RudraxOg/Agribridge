create extension if not exists pgcrypto;

create type public.organization_type as enum ('fpo','buyer');
create type public.app_role as enum ('fpo_admin','fpo_operator','buyer_admin','buyer_operator','assisted_farmer');
create type public.verification_status as enum ('pending','verified','failed','expired');
create type public.quantity_unit as enum ('kg','quintal','tonne');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  type public.organization_type not null,
  name text not null check (char_length(name) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  verification_status public.verification_status not null default 'pending',
  state text not null,
  district text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone_masked text,
  preferred_locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);
create index organization_members_profile_idx on public.organization_members(profile_id) where active;

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  subject_profile_id uuid references public.profiles(id) on delete set null,
  purpose text not null,
  notice_version text not null,
  consented boolean not null,
  alternative_offered boolean not null default false,
  recorded_by uuid references public.profiles(id) on delete set null,
  recorded_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create table public.identity_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  provider text not null,
  verification_reference text not null,
  masked_identifier text not null check (char_length(masked_identifier) <= 32),
  last_four char(4),
  status public.verification_status not null,
  verified_at timestamptz,
  consent_record_id uuid not null references public.consent_records(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(provider, verification_reference)
);

create table public.bank_account_references (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  provider text not null,
  verification_reference text not null,
  account_last_four char(4) not null,
  ifsc_masked text,
  status public.verification_status not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(provider, verification_reference)
);

create function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger organizations_updated before update on public.organizations for each row execute function public.set_updated_at();
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

create function public.current_organization_id() returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from public.organization_members where profile_id = auth.uid() and active order by created_at limit 1
$$;

create function public.has_org_role(allowed public.app_role[]) returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.organization_members where profile_id = auth.uid() and active and role = any(allowed))
$$;
