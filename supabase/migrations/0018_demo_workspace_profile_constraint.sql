-- A logistics service area is identified by its tenant, state and district.
-- This lets the local-only demo account seeder safely rerun without duplicating
-- the completed logistics onboarding form data.

create unique index if not exists logistics_service_areas_organization_state_district_key
  on public.logistics_service_areas(organization_id, state, district);
