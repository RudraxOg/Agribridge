create table public.buyer_requests (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  commodity text not null, quantity numeric(14,3) not null check (quantity > 0), quantity_unit public.quantity_unit not null,
  min_grade text, target_price_paise bigint check (target_price_paise > 0), delivery_district text, needed_by date,
  status text not null default 'open' check (status in ('draft','open','matched','closed','cancelled')),
  created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.video_calls (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  buyer_organization_id uuid not null references public.organizations(id) on delete restrict, stock_lot_id uuid not null references public.stock_lots(id) on delete restrict,
  provider text not null default 'mock', provider_room_reference text, scheduled_at timestamptz not null,
  status text not null default 'scheduled' check(status in ('requested','scheduled','active','completed','cancelled')), notes text,
  created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  buyer_organization_id uuid not null references public.organizations(id) on delete restrict,
  status text not null default 'DRAFT' check (status in ('DRAFT','QUOTED','PLACED','PAYMENT_PENDING','FUNDS_SECURED','TRUCK_ASSIGNED','LOADING','LOADING_VERIFIED','IN_TRANSIT','DELIVERED','DELIVERY_CONFIRMED','COMPLETED','CANCELLED','DISPUTED','PARTIALLY_REFUNDED','REFUNDED')),
  produce_value_paise bigint not null check (produce_value_paise >= 0), buyer_payable_paise bigint not null check (buyer_payable_paise >= 0),
  net_farmer_payout_paise bigint not null check (net_farmer_payout_paise >= 0), currency char(3) not null default 'INR' check(currency='INR'),
  placed_at timestamptz, created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index orders_fpo_status_idx on public.orders(organization_id,status);
create index orders_buyer_status_idx on public.orders(buyer_organization_id,status);

create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  stock_lot_id uuid not null references public.stock_lots(id) on delete restrict, quantity numeric(14,3) not null check(quantity>0),
  quantity_unit public.quantity_unit not null, unit_price_paise bigint not null check(unit_price_paise>0), line_total_paise bigint not null check(line_total_paise>0), created_at timestamptz not null default now()
);
create trigger buyer_requests_updated before update on public.buyer_requests for each row execute function public.set_updated_at();
create trigger orders_updated before update on public.orders for each row execute function public.set_updated_at();
