begin;
select plan(12);

select has_table('public','onboarding_progress','onboarding progress is persisted');
select has_table('public','guided_demo_runs','guided demo runs are persisted');
select has_table('public','guided_demo_events','guided demo events are append-only');
select has_table('public','demo_data_bindings','demo data remains tenant scoped');
select policies_are('public','onboarding_progress',array['users cannot delete onboarding progress','users read their onboarding progress','users start their onboarding progress','users update their onboarding progress'],'onboarding progress policies are explicit');
select policies_are('public','guided_demo_runs',array['users cannot delete guided demo runs','users create their guided demo runs','users read their guided demo runs','users update their guided demo runs'],'demo runs policies are explicit');
select policies_are('public','guided_demo_events',array['users add their guided demo events','users cannot delete guided demo events','users read their guided demo events'],'demo events are owner scoped and append-only');
select policies_are('public','demo_data_bindings',array['members read their tenant demo bindings','users cannot delete demo bindings'],'demo bindings are tenant scoped');
select ok(not exists(select 1 from public.role_permissions rp join public.roles r on r.id=rp.role_id join public.permissions p on p.id=rp.permission_id where r.key='logistics_driver' and p.key='settlements.read'),'drivers cannot access finance walkthrough data');
select ok(not exists(select 1 from public.role_permissions rp join public.roles r on r.id=rp.role_id join public.permissions p on p.id=rp.permission_id where r.key like 'buyer_%' and p.key='farmer_documents.read'),'buyers cannot access private farmer documents');
select ok(not exists(select 1 from pg_policies where schemaname='public' and tablename in ('onboarding_progress','guided_demo_runs','guided_demo_events','demo_data_bindings') and roles @> array['anon']::name[]),'anonymous clients receive no onboarding/demo policy');
select ok(exists(select 1 from pg_constraint where conrelid='public.guided_demo_events'::regclass and pg_get_constraintdef(oid) like '%aadhaar%'),'tour event metadata rejects sensitive keys');

select * from finish();
rollback;
