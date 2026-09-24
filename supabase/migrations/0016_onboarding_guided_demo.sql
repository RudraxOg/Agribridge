-- Persisted first-time setup and guided-demo progress. The records contain
-- navigation state only; no financial, identity, document or GPS payloads.

create table public.onboarding_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  profile_complete_at timestamptz,
  organization_complete_at timestamptz,
  selected_experience text check (selected_experience in ('guided_demo','setup','skip')),
  guided_demo_status text not null default 'not_started' check (guided_demo_status in ('not_started','in_progress','completed','skipped')),
  guided_demo_role_key text,
  current_tour_key text,
  current_step_key text,
  completed_at timestamptz,
  skipped_at timestamptz,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, organization_id)
);

create table public.guided_demo_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  tour_key text not null,
  mode text not null default 'interactive' check (mode in ('interactive','preview')),
  status text not null default 'in_progress' check (status in ('in_progress','completed','exited')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  exited_at timestamptz
);

create table public.guided_demo_events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.guided_demo_runs(id) on delete cascade,
  step_key text not null,
  event_type text not null check (event_type in ('started','viewed','next','back','skipped','exited','completed','fallback')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (not (metadata ?| array['aadhaar','bank_account','payment_credentials','private_gps','signed_url']))
);

create table public.demo_data_bindings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  demo_scenario_key text not null,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique(organization_id, demo_scenario_key, entity_type, entity_id)
);

create index onboarding_progress_user_org_idx on public.onboarding_progress(user_id, organization_id);
create index guided_demo_runs_user_org_idx on public.guided_demo_runs(user_id, organization_id, started_at desc);
create index guided_demo_events_run_idx on public.guided_demo_events(run_id, created_at);
create index demo_data_bindings_org_scenario_idx on public.demo_data_bindings(organization_id, demo_scenario_key);

create trigger onboarding_progress_updated before update on public.onboarding_progress for each row execute function public.set_updated_at();

alter table public.onboarding_progress enable row level security;
alter table public.guided_demo_runs enable row level security;
alter table public.guided_demo_events enable row level security;
alter table public.demo_data_bindings enable row level security;

revoke all on public.onboarding_progress, public.guided_demo_runs, public.guided_demo_events, public.demo_data_bindings from anon, authenticated;
grant select, insert, update on public.onboarding_progress to authenticated;
grant select, insert, update on public.guided_demo_runs to authenticated;
grant select, insert on public.guided_demo_events to authenticated;
grant select on public.demo_data_bindings to authenticated;

create policy "users read their onboarding progress" on public.onboarding_progress for select to authenticated
  using (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))));
create policy "users start their onboarding progress" on public.onboarding_progress for insert to authenticated
  with check (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))));
create policy "users update their onboarding progress" on public.onboarding_progress for update to authenticated
  using (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))))
  with check (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))));

create policy "users read their guided demo runs" on public.guided_demo_runs for select to authenticated
  using (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))));
create policy "users create their guided demo runs" on public.guided_demo_runs for insert to authenticated
  with check (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))));
create policy "users update their guided demo runs" on public.guided_demo_runs for update to authenticated
  using (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))))
  with check (user_id = (select auth.uid()) and (organization_id is null or (select public.is_active_organization_member(organization_id))));

create policy "users read their guided demo events" on public.guided_demo_events for select to authenticated
  using (exists(select 1 from public.guided_demo_runs r where r.id=run_id and r.user_id=(select auth.uid()) and (r.organization_id is null or (select public.is_active_organization_member(r.organization_id)))));
create policy "users add their guided demo events" on public.guided_demo_events for insert to authenticated
  with check (exists(select 1 from public.guided_demo_runs r where r.id=run_id and r.user_id=(select auth.uid()) and (r.organization_id is null or (select public.is_active_organization_member(r.organization_id)))));

create policy "members read their tenant demo bindings" on public.demo_data_bindings for select to authenticated
  using ((select public.is_active_organization_member(organization_id)));

-- Deletes are intentionally denied. Progress is retained as minimal navigation
-- history, and clearing/restarting is represented by append-only run events.
create policy "users cannot delete onboarding progress" on public.onboarding_progress for delete to authenticated using (false);
create policy "users cannot delete guided demo runs" on public.guided_demo_runs for delete to authenticated using (false);
create policy "users cannot delete guided demo events" on public.guided_demo_events for delete to authenticated using (false);
create policy "users cannot delete demo bindings" on public.demo_data_bindings for delete to authenticated using (false);

-- A safe, idempotent resolver for existing synthetic seed records. It never
-- creates live business data and only runs for organizations with memberships.
create or replace function public.ensure_demo_scenario(target_organization_id uuid, scenario_key text default 'guided-demo') returns void
language plpgsql security definer set search_path='' as $$
begin
  if not public.is_active_organization_member(target_organization_id) then raise exception 'membership required'; end if;
  insert into public.demo_data_bindings(organization_id,demo_scenario_key,entity_type,entity_id)
  select target_organization_id, scenario_key, 'stock_lot', l.id
  from public.stock_lots l where l.organization_id=target_organization_id
  on conflict do nothing;
  insert into public.demo_data_bindings(organization_id,demo_scenario_key,entity_type,entity_id)
  select target_organization_id, scenario_key, 'farmer', f.id
  from public.farmers f where f.organization_id=target_organization_id
  on conflict do nothing;
end $$;
revoke execute on function public.ensure_demo_scenario(uuid,text) from public, anon;
grant execute on function public.ensure_demo_scenario(uuid,text) to authenticated;
