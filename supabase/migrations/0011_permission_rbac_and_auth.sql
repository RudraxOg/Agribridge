-- Permission-based tenant authorization and authentication audit model.
-- Existing enum columns remain temporarily for backwards-compatible demo fixtures;
-- role_id, user_id and membership status are authoritative for new code.

alter type public.organization_type add value if not exists 'logistics';

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists last_organization_id uuid references public.organizations(id) on delete set null;

update public.profiles set display_name = full_name where display_name is null;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('organization','platform')),
  key text not null unique check (key ~ '^[a-z][a-z0-9_]+$'),
  label text not null,
  description text not null,
  requires_mfa boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$'),
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

insert into public.roles(scope,key,label,description,requires_mfa) values
('organization','fpo_owner','FPO owner','Creates and manages an FPO and its members.',true),
('organization','fpo_admin','FPO administrator','Manages farmers, lots, orders and FPO operations.',false),
('organization','fpo_operator','FPO field operator','Runs assisted registry, stock intake and loading.',false),
('organization','fpo_finance','FPO finance','Reconciles settlements without editing farmer records.',true),
('organization','buyer_owner','Buyer owner','Manages a buyer organization, users and orders.',true),
('organization','buyer_procurement','Buyer procurement','Searches lots, requests inspections and creates orders.',false),
('organization','buyer_finance','Buyer finance','Reviews invoices and confirms payment events.',true),
('organization','logistics_owner','Logistics owner','Manages fleet, drivers, quotes and dispatch members.',true),
('organization','logistics_dispatcher','Logistics dispatcher','Creates quotes, assigns trips and dispatches vehicles.',false),
('organization','logistics_driver','Logistics driver','Reads assigned trips and submits constrained trip events.',false),
('platform','platform_admin','Platform administrator','Restricted platform configuration and support administration.',true),
('platform','compliance_auditor','Compliance auditor','Time-bounded access to explicitly assigned audit cases.',true),
('platform','support_agent','Support agent','Support metadata only; no implicit sensitive record access.',false)
on conflict(key) do update set label=excluded.label, description=excluded.description, requires_mfa=excluded.requires_mfa;

insert into public.permissions(key,description) values
('farmers.read','Read tenant-safe farmer records'),('farmers.write','Create and update farmer records'),
('lots.read','Read organization lots'),('lots.write','Create and update draft lots'),('lots.publish','Publish stock lots'),
('orders.read','Read participating orders'),('orders.create','Create buyer orders'),('orders.approve','Approve operational order changes'),
('shipments.read','Read participating shipments'),('shipments.dispatch','Assign and dispatch shipments'),
('shipment.position.write','Write a position for an assigned trip'),('settlements.read','Read settlement records'),
('settlements.reconcile','Record reconciliation actions'),('settlements.release.request','Request a regulated-provider release'),
('members.read','Read organization memberships'),('members.invite','Invite organization members'),
('members.manage','Suspend or revoke organization members'),('organization.manage','Manage organization settings'),
('files.upload','Request a scoped upload'),('files.read_private','Read authorized private files'),
('farmer_documents.read','Read private farmer documents'),('disputes.manage','Manage disputes'),
('platform.configure','Configure platform services'),('platform.audit_case.read','Read an explicitly assigned audit case'),
('support.metadata.read','Read non-sensitive support metadata')
on conflict(key) do update set description=excluded.description;

with grants(role_key, permission_key) as (values
  ('fpo_owner','farmers.read'),('fpo_owner','farmers.write'),('fpo_owner','lots.read'),('fpo_owner','lots.write'),('fpo_owner','lots.publish'),('fpo_owner','orders.read'),('fpo_owner','orders.approve'),('fpo_owner','shipments.read'),('fpo_owner','settlements.read'),('fpo_owner','settlements.release.request'),('fpo_owner','members.read'),('fpo_owner','members.invite'),('fpo_owner','members.manage'),('fpo_owner','organization.manage'),('fpo_owner','files.upload'),('fpo_owner','files.read_private'),('fpo_owner','farmer_documents.read'),('fpo_owner','disputes.manage'),
  ('fpo_admin','farmers.read'),('fpo_admin','farmers.write'),('fpo_admin','lots.read'),('fpo_admin','lots.write'),('fpo_admin','lots.publish'),('fpo_admin','orders.read'),('fpo_admin','orders.approve'),('fpo_admin','shipments.read'),('fpo_admin','settlements.read'),('fpo_admin','members.read'),('fpo_admin','members.invite'),('fpo_admin','files.upload'),('fpo_admin','files.read_private'),('fpo_admin','farmer_documents.read'),('fpo_admin','disputes.manage'),
  ('fpo_operator','farmers.read'),('fpo_operator','farmers.write'),('fpo_operator','lots.read'),('fpo_operator','lots.write'),('fpo_operator','orders.read'),('fpo_operator','shipments.read'),('fpo_operator','files.upload'),
  ('fpo_finance','orders.read'),('fpo_finance','settlements.read'),('fpo_finance','settlements.reconcile'),('fpo_finance','settlements.release.request'),('fpo_finance','members.read'),
  ('buyer_owner','lots.read'),('buyer_owner','orders.read'),('buyer_owner','orders.create'),('buyer_owner','orders.approve'),('buyer_owner','shipments.read'),('buyer_owner','settlements.read'),('buyer_owner','members.read'),('buyer_owner','members.invite'),('buyer_owner','members.manage'),('buyer_owner','organization.manage'),('buyer_owner','files.read_private'),('buyer_owner','disputes.manage'),
  ('buyer_procurement','lots.read'),('buyer_procurement','orders.read'),('buyer_procurement','orders.create'),('buyer_procurement','shipments.read'),('buyer_procurement','files.read_private'),('buyer_procurement','disputes.manage'),
  ('buyer_finance','orders.read'),('buyer_finance','settlements.read'),('buyer_finance','settlements.reconcile'),('buyer_finance','members.read'),
  ('logistics_owner','orders.read'),('logistics_owner','shipments.read'),('logistics_owner','shipments.dispatch'),('logistics_owner','members.read'),('logistics_owner','members.invite'),('logistics_owner','members.manage'),('logistics_owner','organization.manage'),('logistics_owner','files.upload'),('logistics_owner','files.read_private'),
  ('logistics_dispatcher','orders.read'),('logistics_dispatcher','shipments.read'),('logistics_dispatcher','shipments.dispatch'),('logistics_dispatcher','files.upload'),
  ('logistics_driver','shipments.read'),('logistics_driver','shipment.position.write'),('logistics_driver','files.upload'),
  ('platform_admin','platform.configure'),('platform_admin','platform.audit_case.read'),('platform_admin','support.metadata.read'),
  ('compliance_auditor','platform.audit_case.read'),('support_agent','support.metadata.read')
)
insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from grants g join public.roles r on r.key=g.role_key join public.permissions p on p.key=g.permission_key
on conflict do nothing;

alter table public.organization_members
  add column if not exists user_id uuid references public.profiles(id) on delete cascade,
  add column if not exists role_id uuid references public.roles(id) on delete restrict,
  add column if not exists status text not null default 'active' check(status in ('invited','active','suspended','revoked')),
  add column if not exists joined_at timestamptz,
  add column if not exists revoked_at timestamptz,
  add column if not exists invited_by uuid references public.profiles(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.organization_members alter column role drop not null;

update public.organization_members m set
  user_id=coalesce(m.user_id,m.profile_id),
  joined_at=coalesce(m.joined_at,m.created_at),
  status=case when m.active then 'active' else 'revoked' end,
  role_id=coalesce(m.role_id,(select r.id from public.roles r where r.key=case m.role::text
    when 'buyer_admin' then 'buyer_owner' when 'buyer_operator' then 'buyer_procurement'
    when 'assisted_farmer' then 'fpo_operator' else m.role::text end))
where m.user_id is null or m.role_id is null;

create unique index if not exists organization_members_active_user_idx
  on public.organization_members(organization_id,user_id) where status='active' and revoked_at is null;
create index if not exists organization_members_access_idx on public.organization_members(user_id,organization_id,role_id) where status='active' and revoked_at is null;

create table if not exists public.platform_role_assignments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict, status text not null default 'active' check(status in ('active','suspended','revoked')),
  assigned_by uuid references public.profiles(id) on delete set null, assigned_at timestamptz not null default now(), expires_at timestamptz, revoked_at timestamptz,
  check(expires_at is null or expires_at>assigned_at)
);
create unique index if not exists platform_role_active_user_idx on public.platform_role_assignments(user_id,role_id) where status='active' and revoked_at is null;

create table if not exists public.organization_invites (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  email_normalized text not null check(email_normalized=lower(trim(email_normalized))), role_id uuid not null references public.roles(id) on delete restrict,
  token_hash text not null unique check(char_length(token_hash)=64), invited_by uuid not null references public.profiles(id) on delete restrict,
  expires_at timestamptz not null, accepted_at timestamptz, revoked_at timestamptz, accepted_by uuid references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(), check(expires_at>created_at)
);
create index if not exists organization_invites_active_idx on public.organization_invites(organization_id,email_normalized) where accepted_at is null and revoked_at is null;

create table if not exists public.auth_events (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  event_type text not null check(event_type in ('sign_up','email_confirmed','sign_in','sign_out','password_reset_requested','password_reset_completed','invite_sent','invite_accepted','invite_revoked','membership_changed','mfa_enrolled','mfa_challenged','privileged_access')),
  outcome text not null default 'succeeded' check(outcome in ('succeeded','failed','denied')),
  ip_hash text, device_family text, metadata jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null, event_type text not null, severity text not null check(severity in ('info','warning','critical')),
  resource_type text, resource_id uuid, metadata jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now()
);

create or replace function public.is_active_organization_member(target_organization_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.organization_members m where m.organization_id=target_organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.revoked_at is null)
$$;

create or replace function public.has_organization_permission(target_organization_id uuid,required_permission text) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.organization_members m join public.role_permissions rp on rp.role_id=m.role_id join public.permissions p on p.id=rp.permission_id
    where m.organization_id=target_organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.revoked_at is null and p.key=required_permission)
$$;

create or replace function public.has_platform_permission(required_permission text) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.platform_role_assignments a join public.role_permissions rp on rp.role_id=a.role_id join public.permissions p on p.id=rp.permission_id
    where a.user_id=(select auth.uid()) and a.status='active' and a.revoked_at is null and (a.expires_at is null or a.expires_at>now()) and p.key=required_permission)
$$;

create or replace function public.current_user_has_verified_email() returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from auth.users u where u.id=(select auth.uid()) and u.email_confirmed_at is not null)
$$;

create or replace function public.current_user_has_recent_mfa() returns boolean
language sql stable security invoker set search_path='' as $$
  select coalesce((select auth.jwt()->>'aal'),'aal1')='aal2'
$$;

revoke execute on function public.is_active_organization_member(uuid) from public,anon;
revoke execute on function public.has_organization_permission(uuid,text) from public,anon;
revoke execute on function public.has_platform_permission(text) from public,anon;
revoke execute on function public.current_user_has_verified_email() from public,anon;
revoke execute on function public.current_user_has_recent_mfa() from public,anon;
grant execute on function public.is_active_organization_member(uuid), public.has_organization_permission(uuid,text), public.has_platform_permission(text), public.current_user_has_verified_email(), public.current_user_has_recent_mfa() to authenticated;

create or replace function public.create_organization_with_owner(
  organization_name text, organization_slug text, organization_kind text, organization_state text, organization_district text
) returns uuid language plpgsql security definer set search_path='' as $$
declare created_id uuid; owner_role_id uuid; legacy_role public.app_role;
begin
  if (select auth.uid()) is null or not public.current_user_has_verified_email() then raise exception 'verified email required'; end if;
  if organization_kind not in ('fpo','buyer','logistics') or organization_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'invalid organization'; end if;
  if char_length(trim(organization_name)) not between 2 and 180 then raise exception 'invalid organization name'; end if;
  select r.id into owner_role_id from public.roles r where r.key=organization_kind||'_owner' and r.scope='organization';
  if owner_role_id is null then raise exception 'owner role unavailable'; end if;
  legacy_role := case organization_kind when 'fpo' then 'fpo_admin'::public.app_role when 'buyer' then 'buyer_admin'::public.app_role else null end;
  insert into public.organizations(type,name,slug,state,district) values(organization_kind::public.organization_type,trim(organization_name),organization_slug,trim(organization_state),trim(organization_district)) returning id into created_id;
  insert into public.organization_members(organization_id,profile_id,user_id,role,role_id,active,status,joined_at)
    values(created_id,(select auth.uid()),(select auth.uid()),legacy_role,owner_role_id,true,'active',now());
  update public.profiles set last_organization_id=created_id where id=(select auth.uid());
  insert into public.auth_events(user_id,organization_id,event_type,metadata) values((select auth.uid()),created_id,'membership_changed','{"source":"organization_onboarding"}'::jsonb);
  return created_id;
end $$;
revoke execute on function public.create_organization_with_owner(text,text,text,text,text) from public,anon;
grant execute on function public.create_organization_with_owner(text,text,text,text,text) to authenticated;

create or replace function public.accept_organization_invitation(invitation_token text) returns text language plpgsql security definer set search_path='' as $$
declare target public.organization_invites; current_email text; legacy_role public.app_role; organization_slug text;
begin
  if (select auth.uid()) is null or not public.current_user_has_verified_email() then raise exception 'verified email required'; end if;
  select lower(trim(u.email)) into current_email from auth.users u where u.id=(select auth.uid());
  select * into target from public.organization_invites i where i.token_hash=encode(public.digest(invitation_token,'sha256'),'hex') for update;
  if target.id is null or target.accepted_at is not null or target.revoked_at is not null or target.expires_at<=now() then raise exception 'invitation unavailable'; end if;
  if target.email_normalized<>current_email then raise exception 'invitation email mismatch'; end if;
  select case r.key when 'fpo_admin' then 'fpo_admin'::public.app_role when 'fpo_operator' then 'fpo_operator'::public.app_role when 'buyer_owner' then 'buyer_admin'::public.app_role when 'buyer_procurement' then 'buyer_operator'::public.app_role else null end into legacy_role from public.roles r where r.id=target.role_id;
  insert into public.organization_members(organization_id,profile_id,user_id,role,role_id,active,status,joined_at,invited_by)
    values(target.organization_id,(select auth.uid()),(select auth.uid()),legacy_role,target.role_id,true,'active',now(),target.invited_by)
    on conflict(organization_id,profile_id) do update set user_id=excluded.user_id,role_id=excluded.role_id,role=excluded.role,active=true,status='active',joined_at=now(),revoked_at=null,updated_at=now();
  update public.organization_invites set accepted_at=now(),accepted_by=(select auth.uid()) where id=target.id;
  insert into public.auth_events(user_id,organization_id,event_type,metadata) values((select auth.uid()),target.organization_id,'invite_accepted',jsonb_build_object('invite_id',target.id));
  select o.slug into organization_slug from public.organizations o where o.id=target.organization_id;
  return organization_slug;
end $$;
revoke execute on function public.accept_organization_invitation(text) from public,anon;
grant execute on function public.accept_organization_invitation(text) to authenticated;

create or replace function public.manage_organization_member(target_organization_id uuid,target_membership_id uuid,member_action text,target_role_key text default null) returns boolean
language plpgsql security definer set search_path='' as $$
declare target public.organization_members; next_role_id uuid; next_role_key text;
begin
  if not public.has_organization_permission(target_organization_id,'members.manage') then raise exception 'permission denied'; end if;
  select * into target from public.organization_members m where m.id=target_membership_id and m.organization_id=target_organization_id for update;
  if target.id is null or target.user_id=(select auth.uid()) then raise exception 'membership cannot be changed'; end if;
  select r.key into next_role_key from public.roles r where r.id=target.role_id;
  if next_role_key in ('fpo_owner','buyer_owner','logistics_owner') then raise exception 'ownership transfer requires a dedicated workflow'; end if;
  if member_action='suspend' then update public.organization_members set status='suspended',active=false where id=target.id;
  elsif member_action='revoke' then update public.organization_members set status='revoked',active=false,revoked_at=now() where id=target.id;
  elsif member_action='change_role' then
    select r.id into next_role_id from public.roles r where r.key=target_role_key and r.scope='organization' and r.key not in ('fpo_owner','buyer_owner','logistics_owner');
    if next_role_id is null then raise exception 'role unavailable'; end if;
    update public.organization_members set role_id=next_role_id where id=target.id;
  else raise exception 'unsupported membership action'; end if;
  insert into public.auth_events(user_id,organization_id,event_type,metadata) values((select auth.uid()),target_organization_id,'membership_changed',jsonb_build_object('membership_id',target.id,'action',member_action));
  return true;
end $$;
revoke execute on function public.manage_organization_member(uuid,uuid,text,text) from public,anon;
grant execute on function public.manage_organization_member(uuid,uuid,text,text) to authenticated;

create or replace function public.handle_new_auth_user() returns trigger language plpgsql security definer set search_path='' as $$
declare safe_name text;
begin
  safe_name := left(coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'),''),nullif(split_part(coalesce(new.email,''),'@',1),''),'AgriBridge user'),120);
  insert into public.profiles(id,full_name,display_name,preferred_locale) values(new.id,safe_name,safe_name,'en') on conflict(id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();
revoke execute on function public.handle_new_auth_user() from public,anon,authenticated;

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.platform_role_assignments enable row level security;
alter table public.organization_invites enable row level security;
alter table public.auth_events enable row level security;
alter table public.security_events enable row level security;

revoke all on public.roles,public.permissions,public.role_permissions,public.platform_role_assignments,public.organization_invites,public.auth_events,public.security_events from anon,authenticated;
grant select on public.roles,public.permissions,public.role_permissions to authenticated;
grant select on public.organization_members to authenticated;

create policy "authenticated read role catalog" on public.roles for select to authenticated using(true);
create policy "authenticated read permission catalog" on public.permissions for select to authenticated using(true);
create policy "authenticated read role grants" on public.role_permissions for select to authenticated using(true);
create policy "read own active platform assignment" on public.platform_role_assignments for select to authenticated using(user_id=(select auth.uid()) and status='active' and revoked_at is null);
create policy "authorized member reads invites" on public.organization_invites for select to authenticated using((select public.has_organization_permission(organization_id,'members.read')));
create policy "user reads own auth events" on public.auth_events for select to authenticated using(user_id=(select auth.uid()));
create policy "platform auditor reads security events" on public.security_events for select to authenticated using((select public.has_platform_permission('platform.audit_case.read')));

create trigger organization_members_updated before update on public.organization_members for each row execute function public.set_updated_at();

drop policy if exists "members read own membership" on public.organization_members;
create policy "member reads self or authorized roster" on public.organization_members for select to authenticated
using(user_id=(select auth.uid()) or (select public.has_organization_permission(organization_id,'members.read')));
