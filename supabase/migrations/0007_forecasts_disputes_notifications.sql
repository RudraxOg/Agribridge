create table public.forecasts (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  commodity text not null, district text not null, horizon_days integer not null check(horizon_days in (15,30)), expected_demand text not null,
  expected_min_price_paise bigint not null check(expected_min_price_paise>=0), expected_max_price_paise bigint not null check(expected_max_price_paise>=expected_min_price_paise),
  confidence numeric(5,2) not null check(confidence between 0 and 100), supply_pressure text not null, recommended_harvest_window daterange,
  buyer_segment text, drivers jsonb not null default '[]', source_date date not null, synced_at timestamptz not null, created_at timestamptz not null default now()
);
create index forecasts_org_crop_idx on public.forecasts(organization_id,commodity,district,source_date desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade, type text not null, title text not null, body text not null,
  action_path text, read_at timestamptz, created_at timestamptz not null default now()
);
create index notifications_profile_unread_idx on public.notifications(profile_id,created_at desc) where read_at is null;

create table public.disputes (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  buyer_organization_id uuid not null references public.organizations(id) on delete restrict, order_id uuid not null references public.orders(id) on delete restrict,
  category text not null check(category in ('quality','quantity','delivery','payment','other')), summary text not null,
  status text not null default 'open' check(status in ('open','evidence_requested','under_review','resolved','closed')),
  resolution text, raised_by uuid references public.profiles(id) on delete set null, resolved_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete restrict,
  actor_id uuid references public.profiles(id) on delete set null, entity_type text not null, entity_id uuid, action text not null,
  previous_state jsonb, new_state jsonb, request_id text, occurred_at timestamptz not null default now()
);
create index audit_logs_entity_idx on public.audit_logs(entity_type,entity_id,occurred_at desc);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profiles(id) on delete cascade,
  endpoint_hash text not null unique, encrypted_subscription jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create function public.append_audit_event(p_organization_id uuid,p_entity_type text,p_entity_id uuid,p_action text,p_previous jsonb,p_new jsonb)
returns uuid language plpgsql security definer set search_path=public as $$ declare new_id uuid; begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_organization_id is distinct from public.current_organization_id() then raise exception 'Organization mismatch'; end if;
  insert into public.audit_logs(organization_id,actor_id,entity_type,entity_id,action,previous_state,new_state)
  values(p_organization_id,auth.uid(),p_entity_type,p_entity_id,p_action,p_previous,p_new) returning id into new_id; return new_id;
end $$;
revoke all on function public.append_audit_event(uuid,text,uuid,text,jsonb,jsonb) from public;
grant execute on function public.append_audit_event(uuid,text,uuid,text,jsonb,jsonb) to authenticated;
create trigger disputes_updated before update on public.disputes for each row execute function public.set_updated_at();
create trigger push_subscriptions_updated before update on public.push_subscriptions for each row execute function public.set_updated_at();
create trigger audit_logs_immutable before update or delete on public.audit_logs for each row execute function public.prevent_financial_mutation();
