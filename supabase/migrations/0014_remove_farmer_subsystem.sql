-- Retire the farmer registry and its private-document surface while preserving
-- FPO organizations, collection centres, stock lots, orders and settlements.

drop policy if exists "authorized fpo reads farmer documents" on storage.objects;
drop policy if exists "document permission reads farmer objects" on storage.objects;
drop policy if exists "document permission uploads farmer objects" on storage.objects;

drop table if exists public.farmer_auth_methods;
drop table if exists public.land_documents;

-- Supabase Storage blocks direct SQL deletion from storage.objects and buckets.
-- Object cleanup must be performed through the Storage API before this schema
-- migration in a populated deployment. The following migration recreates this
-- bucket, so preserving an empty bucket is correct for a fresh project.

delete from public.stock_lot_assets
where file_asset_id in (
  select id from public.file_assets where bucket = 'farmer-documents'
);
delete from public.file_assets where bucket = 'farmer-documents';

drop table if exists public.farmer_payouts;
drop table if exists public.lot_contributors;
drop table if exists public.crop_cycles;
drop table if exists public.land_parcels;
drop table if exists public.farmers;
drop table if exists public.identity_verifications;
drop table if exists public.bank_account_references;
drop table if exists public.consent_records;

delete from public.role_permissions
where permission_id in (
  select id from public.permissions
  where key in ('farmers.read', 'farmers.write', 'farmer_documents.read')
);
delete from public.permissions
where key in ('farmers.read', 'farmers.write', 'farmer_documents.read');

alter table public.orders
  rename column net_farmer_payout_paise to supplier_net_settlement_paise;
alter table public.order_price_snapshots
  rename column farmer_pool_paise to supplier_pool_paise;

do $$
begin
  if exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'app_role'
      and e.enumlabel = 'assisted_farmer'
  ) then
    alter type public.app_role rename value 'assisted_farmer' to 'retired_assisted_role';
  end if;
end
$$;

comment on column public.orders.supplier_net_settlement_paise is
  'Immutable net settlement amount owed to the supplying FPO, stored in integer paise.';
comment on column public.order_price_snapshots.supplier_pool_paise is
  'Produce subtotal after platform/FPO distribution deductions, stored in integer paise.';
