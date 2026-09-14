create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null, provider_event_id text not null, provider_payment_reference text,
  event_type text not null, status text not null check(status in ('created','pending','succeeded','failed','refunded','partially_refunded')),
  amount_paise bigint not null check(amount_paise>=0), currency char(3) not null default 'INR' check(currency='INR'),
  payload_hash text, occurred_at timestamptz not null, created_at timestamptz not null default now(), unique(provider,provider_event_id)
);
create index payment_transactions_order_idx on public.payment_transactions(order_id,occurred_at desc);

create table public.fee_rules (
  id uuid primary key default gen_random_uuid(), code text not null, label text not null, basis text not null check(basis in ('percentage','fixed')),
  value numeric(12,4) not null check(value>=0), bearer text not null check(bearer in ('buyer','seller','distribution')),
  effective_from timestamptz not null, effective_until timestamptz, active boolean not null default true, created_at timestamptz not null default now(),
  unique(code,effective_from)
);

create table public.order_charges (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  fee_rule_id uuid references public.fee_rules(id) on delete restrict, code text not null, label text not null,
  bearer text not null check(bearer in ('buyer','seller','distribution')), amount_paise bigint not null check(amount_paise>=0), created_at timestamptz not null default now(),
  unique(order_id,code,bearer)
);

create table public.settlements (
  id uuid primary key default gen_random_uuid(), order_id uuid not null unique references public.orders(id) on delete restrict,
  state text not null default 'AWAITING_PAYMENT' check(state in ('AWAITING_PAYMENT','SECURED','LOADING_PROOF_PENDING','FIRST_RELEASE_PENDING','FIRST_RELEASED','DELIVERY_PROOF_PENDING','SECOND_RELEASE_PENDING','SECOND_RELEASED','COMPLETED','HELD_FOR_DISPUTE','REFUNDED')),
  secured_paise bigint not null default 0 check(secured_paise>=0), first_release_paise bigint not null default 0 check(first_release_paise>=0),
  second_release_paise bigint not null default 0 check(second_release_paise>=0), provider_reference text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.escrow_milestones (
  id uuid primary key default gen_random_uuid(), settlement_id uuid not null references public.settlements(id) on delete restrict,
  milestone text not null check(milestone in ('funds_secured','loading_verified','first_release','delivery_confirmed','second_release','refund','dispute_hold')),
  status text not null check(status in ('pending','verified','released','held','refunded')), amount_paise bigint not null default 0 check(amount_paise>=0),
  evidence_reference text, occurred_at timestamptz not null, created_at timestamptz not null default now()
);

create table public.farmer_payouts (
  id uuid primary key default gen_random_uuid(), settlement_id uuid not null references public.settlements(id) on delete restrict,
  farmer_id uuid not null references public.farmers(id) on delete restrict, lot_contributor_id uuid not null references public.lot_contributors(id) on delete restrict,
  gross_paise bigint not null check(gross_paise>=0), deductions_paise bigint not null default 0 check(deductions_paise>=0), net_paise bigint not null check(net_paise>=0),
  bank_account_reference_id uuid references public.bank_account_references(id) on delete restrict, status text not null default 'pending' check(status in ('pending','processing','paid','failed','held')),
  provider_reference text, created_at timestamptz not null default now()
);

create function public.prevent_financial_mutation() returns trigger language plpgsql as $$ begin raise exception 'Financial event history is append-only'; end $$;
create trigger payment_transactions_immutable before update or delete on public.payment_transactions for each row execute function public.prevent_financial_mutation();
create trigger escrow_milestones_immutable before update or delete on public.escrow_milestones for each row execute function public.prevent_financial_mutation();
create trigger settlements_updated before update on public.settlements for each row execute function public.set_updated_at();
