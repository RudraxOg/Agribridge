begin;
select plan(8);

select has_table('public','farmers','farmers exists');
select has_table('public','payment_transactions','payment event table exists');
select policies_are('public','farmers',array['fpo members read farmers','fpo operators insert farmers','fpo operators update farmers'],'farmer policies are explicit');
select policies_are('public','stock_lots',array['published lots or tenant','fpo operators insert lots','fpo operators update lots'],'marketplace access is explicit');
select policies_are('public','orders',array['order participants read','buyer creates draft order'],'orders are participant-scoped and client insert is draft only');
select policies_are('public','shipments',array['shipment participants read'],'shipment tracking is participant-scoped');
select policies_are('public','payment_transactions',array['order participants read payments'],'payment status has no browser mutation policy');
select policies_are('public','audit_logs',array['tenant reads audit'],'audit inserts require controlled function');

select * from finish();
rollback;
