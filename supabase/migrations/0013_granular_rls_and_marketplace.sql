-- Replace legacy first-membership/enum checks with explicit target-tenant permissions.

drop policy if exists "members read their organization" on public.organizations;
create policy "member or marketplace organization read" on public.organizations for select to authenticated
using((select public.is_active_organization_member(id)) or (type='fpo' and verification_status='verified'));
create policy "anonymous verified marketplace organization read" on public.organizations for select to anon using(type='fpo' and verification_status='verified');

drop policy if exists "fpo members read farmers" on public.farmers;
drop policy if exists "fpo operators insert farmers" on public.farmers;
drop policy if exists "fpo operators update farmers" on public.farmers;
create policy "permission reads farmers" on public.farmers for select to authenticated using((select public.has_organization_permission(organization_id,'farmers.read')));
create policy "permission inserts farmers" on public.farmers for insert to authenticated with check((select public.has_organization_permission(organization_id,'farmers.write')));
create policy "permission updates farmers" on public.farmers for update to authenticated using((select public.has_organization_permission(organization_id,'farmers.write'))) with check((select public.has_organization_permission(organization_id,'farmers.write')));

drop policy if exists "published lots or tenant" on public.stock_lots;
drop policy if exists "fpo operators insert lots" on public.stock_lots;
drop policy if exists "fpo operators update lots" on public.stock_lots;
create policy "permission or published lot read" on public.stock_lots for select to authenticated using((select public.has_organization_permission(organization_id,'lots.read')) or (status='published' and (expires_at is null or expires_at>now())));
create policy "anonymous published lot read" on public.stock_lots for select to anon using(status='published' and (expires_at is null or expires_at>now()));
create policy "permission inserts draft lots" on public.stock_lots for insert to authenticated with check((select public.has_organization_permission(organization_id,'lots.write')) and status='draft');
create policy "permission updates lots" on public.stock_lots for update to authenticated using((select public.has_organization_permission(organization_id,'lots.write'))) with check((select public.has_organization_permission(organization_id,case when status='published' then 'lots.publish' else 'lots.write' end)));

create policy "anonymous published grading summary read" on public.grading_reports for select to anon using(exists(select 1 from public.stock_lots l where l.id=stock_lot_id and l.status='published' and (l.expires_at is null or l.expires_at>now())));

drop policy if exists "authorized fpo reads land documents" on public.land_documents;
drop policy if exists "authorized fpo registers land documents" on public.land_documents;
create policy "permission reads farmer documents" on public.land_documents for select to authenticated using((select public.has_organization_permission(organization_id,'farmer_documents.read')));
create policy "permission registers farmer documents" on public.land_documents for insert to authenticated with check((select public.has_organization_permission(organization_id,'farmer_documents.read')) and (select public.has_organization_permission(organization_id,'files.upload')));

drop policy if exists "order participants read" on public.orders;
drop policy if exists "buyer creates draft order" on public.orders;
create policy "permitted participants read orders" on public.orders for select to authenticated using((select public.has_organization_permission(organization_id,'orders.read')) or (select public.has_organization_permission(buyer_organization_id,'orders.read')));
create policy "buyer permission creates draft order" on public.orders for insert to authenticated with check(status='DRAFT' and (select public.has_organization_permission(buyer_organization_id,'orders.create')));

drop policy if exists "shipment participants read" on public.shipments;
create policy "permitted participants read shipments" on public.shipments for select to authenticated using((select public.has_organization_permission(organization_id,'shipments.read')) or (select public.has_organization_permission(buyer_organization_id,'shipments.read')) or (logistics_organization_id is not null and (select public.has_organization_permission(logistics_organization_id,'shipments.read'))));
drop policy if exists "shipment participants read tracking" on public.tracking_events;
create policy "permitted participants read tracking" on public.tracking_events for select to authenticated using(exists(select 1 from public.shipments s where s.id=shipment_id and ((select public.has_organization_permission(s.organization_id,'shipments.read')) or (select public.has_organization_permission(s.buyer_organization_id,'shipments.read')))));

drop policy if exists "public or tenant files are readable" on public.file_assets;
drop policy if exists "fpo operators register files" on public.file_assets;
drop policy if exists "fpo operators update processing metadata" on public.file_assets;
create policy "published derivative or permitted file read" on public.file_assets for select to anon,authenticated using(
  (visibility='public' and processing_status='ready' and quarantine_status='clean' and exists(select 1 from public.stock_lot_assets a join public.stock_lots l on l.id=a.stock_lot_id where a.file_asset_id=id and l.status='published'))
  or (auth.role()='authenticated' and owner_organization_id is not null and (select public.has_organization_permission(owner_organization_id,'files.read_private')))
);
create policy "permission registers file metadata" on public.file_assets for insert to authenticated with check(owner_organization_id is not null and (select public.has_organization_permission(owner_organization_id,'files.upload')) and quarantine_status='pending' and processing_status in ('queued','processing'));

drop policy if exists "published or tenant lot assets are readable" on public.stock_lot_assets;
drop policy if exists "fpo operators bind lot assets" on public.stock_lot_assets;
create policy "published or permitted association read" on public.stock_lot_assets for select to anon,authenticated using(
  (exists(select 1 from public.stock_lots l join public.file_assets f on f.id=file_asset_id where l.id=stock_lot_id and l.status='published' and f.visibility='public' and f.processing_status='ready' and f.quarantine_status='clean'))
  or (auth.role()='authenticated' and (select public.has_organization_permission(organization_id,'lots.read')))
);
create policy "permission binds accepted lot assets" on public.stock_lot_assets for insert to authenticated with check((select public.has_organization_permission(organization_id,'lots.write')) and exists(select 1 from public.file_assets f where f.id=file_asset_id and f.owner_organization_id=organization_id and f.processing_status='ready' and f.quarantine_status='clean'));

create or replace view public.marketplace_listings with (security_invoker=true) as
select l.id,l.lot_code,l.commodity,l.variety,l.available_quantity,l.quantity_unit,l.unit_price_paise,l.harvest_date,l.expires_at,
  o.id as fpo_organization_id,o.name as fpo_name,o.state,o.district,g.suggested_grade as grade,g.confidence as grading_confidence
from public.stock_lots l join public.organizations o on o.id=l.organization_id
left join lateral (select r.suggested_grade,r.confidence from public.grading_reports r where r.stock_lot_id=l.id order by (r.source='lab_verified') desc,r.analyzed_at desc limit 1) g on true
where l.status='published' and (l.expires_at is null or l.expires_at>now()) and o.verification_status='verified';
revoke all on public.marketplace_listings from public,anon,authenticated;
grant select on public.marketplace_listings to anon,authenticated;
revoke all on public.stock_lots,public.organizations,public.grading_reports from anon;
grant select(id,lot_code,organization_id,commodity,variety,available_quantity,quantity_unit,unit_price_paise,harvest_date,expires_at,status) on public.stock_lots to anon;
grant select(id,name,state,district,type,verification_status) on public.organizations to anon;
grant select(id,stock_lot_id,suggested_grade,confidence,source,analyzed_at) on public.grading_reports to anon;

update storage.buckets set public=false where id='public-listing-media';
drop policy if exists "public objects are readable" on storage.objects;
drop policy if exists "tenant uploads private originals" on storage.objects;
drop policy if exists "tenant reads private originals" on storage.objects;
drop policy if exists "authorized fpo reads farmer documents" on storage.objects;
drop policy if exists "tenant reads scoped private evidence" on storage.objects;
drop policy if exists "fpo operators upload scoped private evidence" on storage.objects;
create policy "brand objects public read" on storage.objects for select to anon,authenticated using(bucket_id='public-brand-assets');
create policy "published listing derivative public read" on storage.objects for select to anon,authenticated using(bucket_id='public-listing-media' and exists(select 1 from public.file_assets f join public.stock_lot_assets a on a.file_asset_id=f.id join public.stock_lots l on l.id=a.stock_lot_id where f.bucket=bucket_id and f.object_path=name and f.visibility='public' and f.processing_status='ready' and f.quarantine_status='clean' and l.status='published'));
create policy "tenant permission uploads organization files" on storage.objects for insert to authenticated with check(
  bucket_id in ('public-listing-media','private-stock-originals','grading-certificates','dispute-evidence')
  and (storage.foldername(name))[1] ~ '^[a-f0-9-]{36}$'
  and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'files.upload'))
);
create policy "tenant permission reads private originals" on storage.objects for select to authenticated using(bucket_id='private-stock-originals' and (storage.foldername(name))[1] ~ '^[a-f0-9-]{36}$' and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'files.read_private')));
create policy "tenant permission reads grading objects" on storage.objects for select to authenticated using(bucket_id='grading-certificates' and (storage.foldername(name))[1] ~ '^[a-f0-9-]{36}$' and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'files.read_private')));
create policy "document permission reads farmer objects" on storage.objects for select to authenticated using(bucket_id='farmer-documents' and (storage.foldername(name))[1] ~ '^[a-f0-9-]{36}$' and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'farmer_documents.read')));
create policy "document permission uploads farmer objects" on storage.objects for insert to authenticated with check(bucket_id='farmer-documents' and (storage.foldername(name))[1] ~ '^[a-f0-9-]{36}$' and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'farmer_documents.read')) and (select public.has_organization_permission(((storage.foldername(name))[1])::uuid,'files.upload')));
create policy "shipment participant uploads delivery proof" on storage.objects for insert to authenticated with check(bucket_id='delivery-proofs' and exists(select 1 from public.shipments s where s.order_id::text=(storage.foldername(name))[1] and s.id::text=(storage.foldername(name))[2] and ((s.assigned_driver_user_id=(select auth.uid()) and s.logistics_organization_id is not null and (select public.has_organization_permission(s.logistics_organization_id,'files.upload'))) or (select public.has_organization_permission(s.organization_id,'files.upload')))));

update public.file_assets set quarantine_status='clean',scan_provider='deterministic-local-generator',scanned_at=now() where is_synthetic and processing_status='ready';
