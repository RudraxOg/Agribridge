insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('stock-media','stock-media',false,15728640,array['image/jpeg','image/png','image/webp','video/mp4']),
('grading-certificates','grading-certificates',false,10485760,array['application/pdf','image/jpeg','image/png']),
('farmer-documents','farmer-documents',false,10485760,array['application/pdf','image/jpeg','image/png']),
('delivery-proofs','delivery-proofs',false,15728640,array['application/pdf','image/jpeg','image/png']),
('dispute-evidence','dispute-evidence',false,15728640,array['application/pdf','image/jpeg','image/png','video/mp4'])
on conflict(id) do nothing;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.consent_records enable row level security;
alter table public.identity_verifications enable row level security;
alter table public.bank_account_references enable row level security;
alter table public.farmers enable row level security;
alter table public.land_parcels enable row level security;
alter table public.crop_cycles enable row level security;
alter table public.stock_lots enable row level security;
alter table public.lot_contributors enable row level security;
alter table public.lot_media enable row level security;
alter table public.grading_reports enable row level security;
alter table public.grading_parameters enable row level security;
alter table public.certificates enable row level security;
alter table public.buyer_requests enable row level security;
alter table public.video_calls enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.logistics_quotes enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.fee_rules enable row level security;
alter table public.order_charges enable row level security;
alter table public.settlements enable row level security;
alter table public.escrow_milestones enable row level security;
alter table public.farmer_payouts enable row level security;
alter table public.forecasts enable row level security;
alter table public.notifications enable row level security;
alter table public.disputes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "members read their organization" on public.organizations for select to authenticated
using(id=public.current_organization_id() or (type='fpo' and verification_status='verified'));
create policy "profiles read self" on public.profiles for select to authenticated using(id=auth.uid());
create policy "profiles update self" on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy "members read own membership" on public.organization_members for select to authenticated using(profile_id=auth.uid());

do $$ declare table_name text; begin foreach table_name in array array[
  'consent_records','identity_verifications','bank_account_references','land_parcels','crop_cycles','lot_contributors',
  'buyer_requests','forecasts','notifications','disputes'
] loop
  execute format('create policy "tenant select" on public.%I for select to authenticated using (organization_id=public.current_organization_id())',table_name);
  execute format('create policy "tenant insert" on public.%I for insert to authenticated with check (organization_id=public.current_organization_id())',table_name);
  execute format('create policy "tenant update" on public.%I for update to authenticated using (organization_id=public.current_organization_id()) with check (organization_id=public.current_organization_id())',table_name);
end loop; end $$;

create policy "fpo members read farmers" on public.farmers for select to authenticated using(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator','assisted_farmer']::public.app_role[]));
create policy "fpo operators insert farmers" on public.farmers for insert to authenticated with check(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]));
create policy "fpo operators update farmers" on public.farmers for update to authenticated using(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])) with check(organization_id=public.current_organization_id());

create policy "published lots or tenant" on public.stock_lots for select to authenticated using(
  organization_id=public.current_organization_id() or (status='published' and (expires_at is null or expires_at>now()) and public.has_org_role(array['buyer_admin','buyer_operator']::public.app_role[]))
);
create policy "fpo operators insert lots" on public.stock_lots for insert to authenticated with check(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]));
create policy "fpo operators update lots" on public.stock_lots for update to authenticated using(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])) with check(organization_id=public.current_organization_id());

create policy "lot participants read media" on public.lot_media for select to authenticated using(organization_id=public.current_organization_id() or exists(select 1 from public.stock_lots l where l.id=stock_lot_id and l.status='published'));
create policy "fpo operators add media" on public.lot_media for insert to authenticated with check(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]));
create policy "lot participants read grades" on public.grading_reports for select to authenticated using(organization_id=public.current_organization_id() or exists(select 1 from public.stock_lots l where l.id=stock_lot_id and l.status='published'));
create policy "fpo operators add grades" on public.grading_reports for insert to authenticated with check(organization_id=public.current_organization_id() and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[]));
create policy "published grade parameters" on public.grading_parameters for select to authenticated using(exists(select 1 from public.grading_reports r join public.stock_lots l on l.id=r.stock_lot_id where r.id=grading_report_id and (r.organization_id=public.current_organization_id() or l.status='published')));
create policy "published certificates" on public.certificates for select to authenticated using(organization_id=public.current_organization_id() or exists(select 1 from public.stock_lots l where l.id=stock_lot_id and l.status='published'));

create policy "call participants read" on public.video_calls for select to authenticated using(organization_id=public.current_organization_id() or buyer_organization_id=public.current_organization_id());
create policy "buyer requests grading call" on public.video_calls for insert to authenticated with check(buyer_organization_id=public.current_organization_id() and public.has_org_role(array['buyer_admin','buyer_operator']::public.app_role[]));
create policy "order participants read" on public.orders for select to authenticated using(organization_id=public.current_organization_id() or buyer_organization_id=public.current_organization_id());
create policy "buyer creates draft order" on public.orders for insert to authenticated with check(buyer_organization_id=public.current_organization_id() and status='DRAFT' and public.has_org_role(array['buyer_admin','buyer_operator']::public.app_role[]));
create policy "order participants read items" on public.order_items for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and (o.organization_id=public.current_organization_id() or o.buyer_organization_id=public.current_organization_id())));
create policy "order participants read quotes" on public.logistics_quotes for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and (o.organization_id=public.current_organization_id() or o.buyer_organization_id=public.current_organization_id())));
create policy "shipment participants read" on public.shipments for select to authenticated using(organization_id=public.current_organization_id() or buyer_organization_id=public.current_organization_id());
create policy "shipment participants read tracking" on public.tracking_events for select to authenticated using(exists(select 1 from public.shipments s where s.id=shipment_id and (s.organization_id=public.current_organization_id() or s.buyer_organization_id=public.current_organization_id())));

create policy "order participants read payments" on public.payment_transactions for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and (o.organization_id=public.current_organization_id() or o.buyer_organization_id=public.current_organization_id())));
create policy "active fees readable" on public.fee_rules for select to authenticated using(active and effective_from<=now() and (effective_until is null or effective_until>now()));
create policy "order participants read charges" on public.order_charges for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and (o.organization_id=public.current_organization_id() or o.buyer_organization_id=public.current_organization_id())));
create policy "order participants read settlement" on public.settlements for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and (o.organization_id=public.current_organization_id() or o.buyer_organization_id=public.current_organization_id())));
create policy "order participants read milestones" on public.escrow_milestones for select to authenticated using(exists(select 1 from public.settlements s join public.orders o on o.id=s.order_id where s.id=settlement_id and (o.organization_id=public.current_organization_id() or o.buyer_organization_id=public.current_organization_id())));
create policy "fpo reads farmer payouts" on public.farmer_payouts for select to authenticated using(exists(select 1 from public.settlements s join public.orders o on o.id=s.order_id where s.id=settlement_id and o.organization_id=public.current_organization_id()));

create policy "tenant reads audit" on public.audit_logs for select to authenticated using(organization_id=public.current_organization_id());
create policy "profile manages push subscriptions" on public.push_subscriptions for all to authenticated using(profile_id=auth.uid()) with check(profile_id=auth.uid());

create policy "organization reads private objects" on storage.objects for select to authenticated using(
  bucket_id in ('stock-media','grading-certificates','farmer-documents','delivery-proofs','dispute-evidence')
  and (storage.foldername(name))[1]=public.current_organization_id()::text
);
create policy "fpo operators upload private objects" on storage.objects for insert to authenticated with check(
  bucket_id in ('stock-media','grading-certificates','farmer-documents','delivery-proofs','dispute-evidence')
  and (storage.foldername(name))[1]=public.current_organization_id()::text
  and public.has_org_role(array['fpo_admin','fpo_operator']::public.app_role[])
);

revoke update,delete on public.payment_transactions from authenticated;
revoke update,delete on public.escrow_milestones from authenticated;
revoke insert,update,delete on public.audit_logs from authenticated;
revoke insert,update,delete on public.payment_transactions from authenticated;
revoke update on public.settlements from authenticated;
