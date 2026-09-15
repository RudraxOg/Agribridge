begin;
select plan(14);

select hasnt_table('public','farmers','retired registry table is absent');
select has_table('public','payment_transactions','payment event table exists');
select has_table('public','file_assets','normalized file asset table exists');
select has_table('public','stock_lot_assets','ordered lot asset association exists');
select has_table('public','collection_centres','PostGIS collection centres exist');
select has_table('public','crop_catalog','crop catalog exists');
select has_table('public','order_price_snapshots','immutable order calculation snapshot exists');
select hasnt_table('public','land_documents','retired private document table is absent');
select policies_are('public','stock_lots',array['anonymous published lot read','permission inserts draft lots','permission or published lot read','permission updates lots'],'marketplace access is explicit');
select policies_are('public','orders',array['buyer permission creates draft order','permitted participants read orders'],'orders are participant-scoped and client insert is draft only');
select policies_are('public','shipments',array['permitted participants read shipments'],'shipment tracking is participant-scoped');
select policies_are('public','payment_transactions',array['order participants read payments'],'payment status has no browser mutation policy');
select policies_are('public','audit_logs',array['tenant reads audit'],'audit inserts require controlled function');
select policies_are('public','file_assets',array['permission registers file metadata','published derivative or permitted file read'],'file metadata is accepted-public-derivative or tenant scoped');

select * from finish();
rollback;
