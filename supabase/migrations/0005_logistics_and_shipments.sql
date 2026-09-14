create table public.logistics_quotes (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null, provider_reference text, vehicle_type text not null, capacity numeric(14,3) not null check(capacity>0), capacity_unit public.quantity_unit not null,
  freight_paise bigint not null check(freight_paise>=0), estimated_pickup timestamptz not null, estimated_delivery timestamptz not null,
  refrigerated boolean not null default false, insurance_included boolean not null default false, rating numeric(2,1) check(rating between 0 and 5),
  available_count integer not null default 0 check(available_count>=0), expires_at timestamptz, created_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  buyer_organization_id uuid not null references public.organizations(id) on delete restrict, order_id uuid not null unique references public.orders(id) on delete restrict,
  logistics_quote_id uuid references public.logistics_quotes(id) on delete restrict, provider text not null default 'mock', tracking_reference text,
  status text not null default 'assigned' check(status in ('assigned','at_pickup','loading','in_transit','delayed','delivered','cancelled')),
  driver_name text, driver_phone_masked text, vehicle_number text, current_latitude numeric(9,6), current_longitude numeric(9,6), gps_updated_at timestamptz,
  temperature_celsius numeric(5,2), estimated_delivery timestamptz, delivery_proof_path text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index shipments_participants_idx on public.shipments(organization_id,buyer_organization_id,status);

create table public.tracking_events (
  id uuid primary key default gen_random_uuid(), shipment_id uuid not null references public.shipments(id) on delete restrict,
  event_type text not null, label text not null, latitude numeric(9,6), longitude numeric(9,6), temperature_celsius numeric(5,2),
  provider_recorded_at timestamptz, created_at timestamptz not null default now()
);
create index tracking_events_shipment_time_idx on public.tracking_events(shipment_id,created_at desc);
create trigger shipments_updated before update on public.shipments for each row execute function public.set_updated_at();
