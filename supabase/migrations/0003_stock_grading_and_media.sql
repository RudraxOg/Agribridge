create table public.stock_lots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  lot_code text not null,
  commodity text not null,
  variety text,
  quantity numeric(14,3) not null check (quantity > 0),
  quantity_unit public.quantity_unit not null default 'kg',
  available_quantity numeric(14,3) not null check (available_quantity >= 0),
  unit_price_paise bigint not null check (unit_price_paise > 0),
  status text not null default 'draft' check (status in ('draft','published','reserved','sold','expired','withdrawn')),
  harvest_date date,
  expires_at timestamptz,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, lot_code),
  check (available_quantity <= quantity)
);
create index stock_lots_marketplace_idx on public.stock_lots(status, commodity, harvest_date) where status = 'published';
create index stock_lots_org_status_idx on public.stock_lots(organization_id, status);

create table public.lot_contributors (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  stock_lot_id uuid not null references public.stock_lots(id) on delete restrict, farmer_id uuid not null references public.farmers(id) on delete restrict,
  quantity numeric(14,3) not null check (quantity > 0), quantity_unit public.quantity_unit not null default 'kg', created_at timestamptz not null default now(),
  unique(stock_lot_id, farmer_id)
);

create table public.lot_media (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  stock_lot_id uuid not null references public.stock_lots(id) on delete cascade, storage_path text not null,
  media_type text not null check (media_type in ('image','video','360_frame')), angle_degrees integer check (angle_degrees between 0 and 359),
  created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now()
);

create table public.grading_reports (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  stock_lot_id uuid not null references public.stock_lots(id) on delete restrict,
  source text not null check (source in ('ai_estimate','fpo_declared','lab_verified')), suggested_grade text not null check (suggested_grade in ('A','B','C','REJECT')),
  confidence numeric(5,2) check (confidence between 0 and 100), warnings jsonb not null default '[]', human_override text,
  model_version text, analyzed_at timestamptz, created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now()
);

create table public.grading_parameters (
  id uuid primary key default gen_random_uuid(), grading_report_id uuid not null references public.grading_reports(id) on delete cascade,
  parameter text not null check (parameter in ('moisture','size','colour','defect_percentage','foreign_matter','damage','packaging','residue_status')),
  numeric_value numeric(12,3), text_value text, unit text, created_at timestamptz not null default now(), unique(grading_report_id, parameter)
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict,
  stock_lot_id uuid not null references public.stock_lots(id) on delete restrict, certificate_type text not null, issuer text not null,
  certificate_reference text not null, storage_path text not null, issued_at date, expires_at date,
  verification_status public.verification_status not null default 'pending', created_at timestamptz not null default now()
);
create trigger stock_lots_updated before update on public.stock_lots for each row execute function public.set_updated_at();
