-- Auth-owned signup intent and role-constrained organization creation.
-- Intent is onboarding metadata, never an authorization claim.

alter table public.profiles
  add column if not exists signup_intent text check (signup_intent in ('fpo','buyer','logistics'));

create table if not exists public.fpo_profiles (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  farmer_count_estimate integer check (farmer_count_estimate is null or farmer_count_estimate >= 0),
  primary_crops jsonb not null default '[]'::jsonb,
  settlement_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.buyer_profiles (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  buyer_type text check (buyer_type in ('supermarket','exporter','processor','hotel_restaurant','institutional')),
  procurement_preferences jsonb not null default '{}'::jsonb,
  expected_monthly_quantity_kg integer check (expected_monthly_quantity_kg is null or expected_monthly_quantity_kg >= 0),
  sourcing_regions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.logistics_profiles (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  fleet_size integer check (fleet_size is null or fleet_size >= 0),
  cold_storage_available boolean not null default false,
  operating_hours text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.logistics_service_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  state text not null, district text not null,
  latitude numeric(9,6), longitude numeric(9,6),
  created_at timestamptz not null default now(),
  check ((latitude is null and longitude is null) or (latitude between -90 and 90 and longitude between -180 and 180))
);
create index if not exists logistics_service_areas_organization_idx on public.logistics_service_areas(organization_id,state,district);

create trigger fpo_profiles_updated before update on public.fpo_profiles for each row execute function public.set_updated_at();
create trigger buyer_profiles_updated before update on public.buyer_profiles for each row execute function public.set_updated_at();
create trigger logistics_profiles_updated before update on public.logistics_profiles for each row execute function public.set_updated_at();

alter table public.fpo_profiles enable row level security;
alter table public.buyer_profiles enable row level security;
alter table public.logistics_profiles enable row level security;
alter table public.logistics_service_areas enable row level security;
revoke all on public.fpo_profiles, public.buyer_profiles, public.logistics_profiles, public.logistics_service_areas from anon, authenticated;
grant select on public.fpo_profiles, public.buyer_profiles, public.logistics_profiles, public.logistics_service_areas to authenticated;
create policy "members read fpo profile" on public.fpo_profiles for select to authenticated using((select public.is_active_organization_member(organization_id)));
create policy "members read buyer profile" on public.buyer_profiles for select to authenticated using((select public.is_active_organization_member(organization_id)));
create policy "members read logistics profile" on public.logistics_profiles for select to authenticated using((select public.is_active_organization_member(organization_id)));
create policy "members read logistics service areas" on public.logistics_service_areas for select to authenticated using((select public.is_active_organization_member(organization_id)));

create or replace function public.handle_new_auth_user() returns trigger language plpgsql security definer set search_path='' as $$
declare safe_name text; safe_intent text;
begin
  safe_name := left(coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'),''),nullif(split_part(coalesce(new.email,''),'@',1),''),'AgriBridge user'),120);
  safe_intent := case when new.raw_user_meta_data->>'signup_intent' in ('fpo','buyer','logistics') then new.raw_user_meta_data->>'signup_intent' else null end;
  insert into public.profiles(id,full_name,display_name,preferred_locale,signup_intent)
  values(new.id,safe_name,safe_name,coalesce(nullif(new.raw_user_meta_data->>'preferred_locale',''),'en'),safe_intent)
  on conflict(id) do nothing;
  return new;
end $$;

create or replace function public.create_organization_from_signup_intent(
  p_signup_intent text, p_organization_name text, p_slug text, p_onboarding_data jsonb default '{}'::jsonb
) returns table(organization_id uuid, organization_slug text, role_key text)
language plpgsql security definer set search_path='' as $$
declare
  current_user_id uuid := auth.uid(); created_id uuid; owner_role_id uuid; legacy_role public.app_role;
  intent text; organization_state text; organization_district text; address_value text;
begin
  if current_user_id is null or not public.current_user_has_verified_email() then raise exception 'verified email required'; end if;
  if p_signup_intent not in ('fpo','buyer','logistics') or p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'invalid onboarding request'; end if;
  if char_length(trim(p_organization_name)) not between 2 and 180 then raise exception 'invalid organization name'; end if;
  select signup_intent into intent from public.profiles where id=current_user_id for update;
  if intent is distinct from p_signup_intent then raise exception 'signup intent mismatch'; end if;
  if exists(select 1 from public.organization_members where user_id=current_user_id and status='active' and revoked_at is null) then raise exception 'active membership already exists'; end if;
  organization_state := left(coalesce(nullif(trim(p_onboarding_data->>'state'),''),'Not specified'),100);
  organization_district := left(coalesce(nullif(trim(p_onboarding_data->>'district'),''),'Not specified'),100);
  address_value := nullif(left(trim(coalesce(p_onboarding_data->>'address','')),500),'');
  select id into owner_role_id from public.roles where key=(p_signup_intent || '_owner') and scope='organization';
  if owner_role_id is null then raise exception 'owner role unavailable'; end if;
  insert into public.organizations(type,name,slug,state,district,address) values(p_signup_intent::public.organization_type,trim(p_organization_name),p_slug,organization_state,organization_district,address_value) returning id into created_id;
  legacy_role := case p_signup_intent when 'fpo' then 'fpo_admin'::public.app_role when 'buyer' then 'buyer_admin'::public.app_role else null end;
  insert into public.organization_members(organization_id,profile_id,user_id,role,role_id,active,status,joined_at)
  values(created_id,current_user_id,current_user_id,legacy_role,owner_role_id,true,'active',now());
  if p_signup_intent='fpo' then
    insert into public.fpo_profiles(organization_id,farmer_count_estimate,primary_crops,settlement_preferences)
    values(created_id,nullif(p_onboarding_data->>'farmer_count_estimate','')::integer,coalesce(p_onboarding_data->'primary_crops','[]'::jsonb),coalesce(p_onboarding_data->'settlement_preferences','{}'::jsonb));
  elsif p_signup_intent='buyer' then
    insert into public.buyer_profiles(organization_id,buyer_type,procurement_preferences,expected_monthly_quantity_kg,sourcing_regions)
    values(created_id,nullif(p_onboarding_data->>'buyer_type',''),coalesce(p_onboarding_data->'procurement_preferences','{}'::jsonb),nullif(p_onboarding_data->>'expected_monthly_quantity_kg','')::integer,coalesce(p_onboarding_data->'sourcing_regions','[]'::jsonb));
  else
    insert into public.logistics_profiles(organization_id,fleet_size,cold_storage_available,operating_hours)
    values(created_id,nullif(p_onboarding_data->>'fleet_size','')::integer,coalesce((p_onboarding_data->>'cold_storage_available')::boolean,false),nullif(p_onboarding_data->>'operating_hours',''));
    insert into public.logistics_service_areas(organization_id,state,district) values(created_id,organization_state,organization_district);
  end if;
  insert into public.onboarding_progress(user_id,organization_id,profile_complete_at,selected_experience,last_seen_at)
  values(current_user_id,created_id,now(),'setup',now()) on conflict(user_id,organization_id) do nothing;
  insert into public.audit_logs(organization_id,actor_id,entity_type,entity_id,action,new_state)
  values(created_id,current_user_id,'organization',created_id,'signup_organization_created',jsonb_build_object('intent',p_signup_intent));
  update public.profiles set last_organization_id=created_id, signup_intent=null where id=current_user_id;
  return query select created_id,p_slug,(p_signup_intent || '_owner');
end $$;
revoke execute on function public.create_organization_from_signup_intent(text,text,text,jsonb) from public,anon;
grant execute on function public.create_organization_from_signup_intent(text,text,text,jsonb) to authenticated;
