insert into public.organizations(id,type,name,slug,verification_status,state,district,address) values
('10000000-0000-0000-0000-000000000001','fpo','Awadh Pragati Farmer Producer Company','awadh-pragati-fpc','verified','Uttar Pradesh','Gonda','Mankapur Road, Gonda'),
('10000000-0000-0000-0000-000000000002','fpo','Sahyadri Growers Collective','sahyadri-growers','verified','Maharashtra','Nashik','Pimpalgaon Road, Nashik'),
('20000000-0000-0000-0000-000000000001','buyer','Lucknow Fresh Mart','lucknow-fresh-mart','verified','Uttar Pradesh','Lucknow','Gomti Nagar, Lucknow'),
('20000000-0000-0000-0000-000000000002','buyer','NorthStar Exports','northstar-exports','verified','Maharashtra','Nashik','Satpur, Nashik'),
('20000000-0000-0000-0000-000000000003','buyer','Bharat Institutional Foods','bharat-institutional-foods','verified','Uttar Pradesh','Kanpur','Panki, Kanpur'),
('80000000-0000-0000-0000-000000000001','logistics','Gati Demo Logistics','gati-demo-logistics','verified','Uttar Pradesh','Lucknow','Synthetic demo fleet office');

-- Complete, synthetic onboarding records for the three primary local accounts.
-- Auth users themselves are created by `pnpm demo:users` after a local reset.
insert into public.fpo_profiles(organization_id,farmer_count_estimate,primary_crops,settlement_preferences) values
('10000000-0000-0000-0000-000000000001',248,'["Potato","Onion","Tomato"]','{"release_schedule":"50-50","payout_method":"verified_bank_reference"}')
on conflict (organization_id) do update set farmer_count_estimate=excluded.farmer_count_estimate,primary_crops=excluded.primary_crops,settlement_preferences=excluded.settlement_preferences;
insert into public.buyer_profiles(organization_id,buyer_type,expected_monthly_quantity_kg,sourcing_regions,procurement_preferences) values
('20000000-0000-0000-0000-000000000001','supermarket',85000,'["Gonda","Barabanki","Nashik"]','{"commodities":["Potato","Onion","Tomato"],"quality_grade":"A","delivery_window":"morning"}')
on conflict (organization_id) do update set buyer_type=excluded.buyer_type,expected_monthly_quantity_kg=excluded.expected_monthly_quantity_kg,sourcing_regions=excluded.sourcing_regions,procurement_preferences=excluded.procurement_preferences;
insert into public.logistics_profiles(organization_id,fleet_size,cold_storage_available,operating_hours) values
('80000000-0000-0000-0000-000000000001',18,true,'06:00–22:00')
on conflict (organization_id) do update set fleet_size=excluded.fleet_size,cold_storage_available=excluded.cold_storage_available,operating_hours=excluded.operating_hours;
insert into public.logistics_service_areas(organization_id,state,district,latitude,longitude) values
('80000000-0000-0000-0000-000000000001','Uttar Pradesh','Lucknow',26.846700,80.946200),
('80000000-0000-0000-0000-000000000001','Uttar Pradesh','Gonda',27.133900,81.961900)
on conflict (organization_id,state,district) do update set latitude=excluded.latitude,longitude=excluded.longitude;

insert into public.consent_records(id,organization_id,purpose,notice_version,consented,alternative_offered) values
('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Assisted farmer registration and payout','2026-08',true,true);
insert into public.identity_verifications(id,organization_id,provider,verification_reference,masked_identifier,last_four,status,verified_at,consent_record_id) values
('31000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','mock-offline-identity','MOCK-UIDAI-OFFLINE-4821','•••• •••• 4821','4821','verified','2026-08-08T10:00:00Z','30000000-0000-0000-0000-000000000001');
insert into public.bank_account_references(id,organization_id,provider,verification_reference,account_last_four,ifsc_masked,status,verified_at) values
('32000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','mock-bank-verify','BANK-MOCK-1902','1902','SBIN0•••••','verified','2026-08-08T10:10:00Z');

insert into public.farmers(id,organization_id,farmer_code,full_name,phone_masked,preferred_locale,village,district,state,identity_verification_id,bank_account_reference_id) values
('40000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','AP-0001','Ram Kishan Verma','••••••4821','hi','Mankapur','Gonda','Uttar Pradesh','31000000-0000-0000-0000-000000000001','32000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','AP-0002','Sunita Devi','••••••6614','hi','Colonelganj','Gonda','Uttar Pradesh',null,null),
('40000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','AP-0003','Mohd. Irfan','••••••7728','hi','Tarabganj','Gonda','Uttar Pradesh',null,null),
('40000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','AP-0004','Geeta Maurya','••••••1033','hi','Katra Bazar','Gonda','Uttar Pradesh',null,null),
('40000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','AP-0005','Asha Tiwari','••••••2044','hi','Rupaidih','Gonda','Uttar Pradesh',null,null),
('40000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','AP-0006','Vijay Pal','••••••3055','hi','Wazirganj','Gonda','Uttar Pradesh',null,null),
('40000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','AP-0007','Rekha Singh','••••••4066','hi','Paraspur','Gonda','Uttar Pradesh',null,null),
('40000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','AP-0008','Imran Ali','••••••5077','hi','Jhanjhari','Gonda','Uttar Pradesh',null,null),
('40000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000002','SG-0001','Meera Jadhav','••••••6088','mr','Niphad','Nashik','Maharashtra',null,null),
('40000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000002','SG-0002','Santosh Patil','••••••7099','mr','Dindori','Nashik','Maharashtra',null,null),
('40000000-0000-0000-0000-000000000011','10000000-0000-0000-0000-000000000002','SG-0003','Farida Shaikh','••••••8011','mr','Yeola','Nashik','Maharashtra',null,null),
('40000000-0000-0000-0000-000000000012','10000000-0000-0000-0000-000000000002','SG-0004','Deepak More','••••••9022','mr','Sinnar','Nashik','Maharashtra',null,null);
insert into public.land_parcels(id,organization_id,farmer_id,name,area,area_unit,khatauni_reference_masked,latitude,longitude) values
('41000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','North field',3.2,'acre','KH-••••-1902',27.1381,82.0365),
('41000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','Canal field',2.1,'acre','KH-••••-6622',27.1350,81.6950);
insert into public.collection_centres(id,organization_id,name,district,state,location,cold_storage_available) values
('43000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Gonda collection centre','Gonda','Uttar Pradesh',extensions.st_setsrid(extensions.st_makepoint(81.9660,27.1340),4326)::extensions.geography,true),
('43000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Niphad aggregation centre','Nashik','Maharashtra',extensions.st_setsrid(extensions.st_makepoint(73.7930,20.0770),4326)::extensions.geography,false);
insert into public.crop_catalog(id,slug,name,quality_parameters) values
('44000000-0000-0000-0000-000000000001','tomato','{"en":"Tomato","hi":"टमाटर"}','["size","colour","defect_percentage"]'),
('44000000-0000-0000-0000-000000000002','onion','{"en":"Onion","hi":"प्याज"}','["size","moisture","damage"]'),
('44000000-0000-0000-0000-000000000003','potato','{"en":"Potato","hi":"आलू"}','["size","damage","foreign_matter"]'),
('44000000-0000-0000-0000-000000000004','paddy','{"en":"Rice paddy","hi":"धान"}','["moisture","foreign_matter","damage"]'),
('44000000-0000-0000-0000-000000000005','green-peas','{"en":"Green peas","hi":"हरी मटर"}','["size","colour","defect_percentage"]'),
('44000000-0000-0000-0000-000000000006','mango','{"en":"Mango","hi":"आम"}','["size","colour","damage"]');
insert into public.crop_cycles(id,organization_id,farmer_id,land_parcel_id,commodity,variety,sowing_date,expected_harvest_start,expected_harvest_end,expected_quantity,quantity_unit,status) values
('42000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','41000000-0000-0000-0000-000000000001','Potato','Kufri Bahar','2026-06-10','2026-09-20','2026-09-26',8500,'kg','harvest_ready'),
('42000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','41000000-0000-0000-0000-000000000002','Tomato','Abhinav','2026-06-20','2026-09-16','2026-09-24',4100,'kg','growing');

insert into public.stock_lots(id,organization_id,lot_code,commodity,variety,quantity,quantity_unit,available_quantity,unit_price_paise,status,harvest_date,published_at) values
('50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','LOT-POT-GONDA-018','Potato','Kufri Bahar',42000,'kg',42000,1850,'published','2026-09-12','2026-09-13T06:00:00Z'),
('50000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','LOT-ONI-NASHIK-011','Red onion','Nashik Red',38000,'kg',38000,2600,'published','2026-09-10','2026-09-11T06:00:00Z'),
('50000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','LOT-TOM-VNS-022','Tomato','Abhinav',18000,'kg',18000,2200,'published','2026-09-14','2026-09-14T06:00:00Z'),
('50000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','LOT-PAD-KAN-007','Basmati paddy','Pusa 1509',75000,'kg',75000,3850,'published','2026-09-28','2026-09-14T06:00:00Z'),
('50000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','LOT-PEA-LKO-004','Green peas','Arkel',12000,'kg',12000,4400,'published','2026-10-02','2026-09-14T06:00:00Z'),
('50000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','LOT-MAN-MAL-002','Malihabadi mango','Dasheri',25000,'kg',25000,6200,'published','2027-06-10','2026-09-14T06:00:00Z'),
('50000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000002','LOT-ONI-NAS-012','Red onion','Nashik Red',32000,'kg',24000,2550,'published','2026-09-11','2026-09-12T06:00:00Z'),
('50000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000002','LOT-TOM-NAS-003','Tomato','Abhinav',14000,'kg',14000,2150,'published','2026-09-15','2026-09-15T06:00:00Z');
insert into public.lot_contributors(id,organization_id,stock_lot_id,farmer_id,quantity,quantity_unit) values
('51000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',8500,'kg'),
('51000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002',6200,'kg');
insert into public.lot_media(organization_id,stock_lot_id,storage_path,media_type,angle_degrees) values
('10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001/lots/potato/front.webp','image',0);
insert into public.grading_reports(id,organization_id,stock_lot_id,source,suggested_grade,confidence,warnings,model_version,analyzed_at) values
('52000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','ai_estimate','A',94,'["Mock estimate; human review required"]','mock-grade-v1','2026-09-14T00:42:00Z'),
('52000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','lab_verified','A',null,'[]',null,'2026-09-13T10:00:00Z');
insert into public.grading_parameters(grading_report_id,parameter,numeric_value,unit) values
('52000000-0000-0000-0000-000000000001','moisture',78.2,'%'),('52000000-0000-0000-0000-000000000001','size',54,'mm'),('52000000-0000-0000-0000-000000000001','defect_percentage',1.8,'%');
insert into public.certificates(organization_id,stock_lot_id,certificate_type,issuer,certificate_reference,storage_path,issued_at,verification_status) values
('10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','Quality assay','Gonda Agri Lab','AB-LAB-882','10000000-0000-0000-0000-000000000001/certificates/AB-LAB-882.pdf','2026-09-13','verified');

insert into public.orders(id,order_number,organization_id,buyer_organization_id,status,produce_value_paise,buyer_payable_paise,net_farmer_payout_paise,placed_at) values
('60000000-0000-0000-0000-000000000001','AB-260914-1072','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','IN_TRANSIT',20000000,21842000,18850000,'2026-09-14T05:30:00Z'),
('60000000-0000-0000-0000-000000000002','AB-260831-0974','10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000002','COMPLETED',20400000,21640000,19278000,'2026-08-31T05:30:00Z');
insert into public.order_items(order_id,stock_lot_id,quantity,quantity_unit,unit_price_paise,line_total_paise) values
('60000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001',1000,'kg',20000,20000000),
('60000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000007',8000,'kg',2550,20400000);
insert into public.logistics_quotes(id,order_id,provider,provider_reference,vehicle_type,capacity,capacity_unit,freight_paise,estimated_pickup,estimated_delivery,refrigerated,insurance_included,rating,available_count) values
('61000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','mock-logistics','MOCK-MGV-82','Medium goods vehicle',7.5,'tonne',1820000,'2026-09-14T06:00:00Z','2026-09-14T14:30:00Z',false,true,4.6,4),
('61000000-0000-0000-0000-000000000002','60000000-0000-0000-0000-000000000001','mock-logistics','MOCK-PICKUP-17','Pickup truck',1.7,'tonne',680000,'2026-09-14T07:00:00Z','2026-09-15T11:00:00Z',false,true,4.8,2),
('61000000-0000-0000-0000-000000000003','60000000-0000-0000-0000-000000000001','mock-logistics','MOCK-MINI-07','Mini cargo truck',750,'kg',420000,'2026-09-14T08:00:00Z','2026-09-15T09:00:00Z',false,true,4.7,3),
('61000000-0000-0000-0000-000000000004','60000000-0000-0000-0000-000000000001','mock-logistics','MOCK-REEFER-60','Refrigerated truck',6,'tonne',2480000,'2026-09-15T05:00:00Z','2026-09-15T19:00:00Z',true,true,4.9,1);
insert into public.shipments(id,organization_id,buyer_organization_id,order_id,logistics_quote_id,provider,tracking_reference,status,driver_name,driver_phone_masked,vehicle_number,current_latitude,current_longitude,gps_updated_at,estimated_delivery) values
('62000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','61000000-0000-0000-0000-000000000001','mock-logistics','MOCK-GPS-2186','in_transit','Ravi Kumar','••••••2186','UP 43 AT 2186',26.94,81.02,'2026-09-14T08:30:00Z','2026-09-14T10:55:00Z');
update public.shipments set logistics_organization_id='80000000-0000-0000-0000-000000000001' where id='62000000-0000-0000-0000-000000000001';
insert into public.tracking_events(shipment_id,event_type,label,latitude,longitude,provider_recorded_at) values
('62000000-0000-0000-0000-000000000001','departed','Truck departed Gonda',27.134,81.966,'2026-09-14T06:28:00Z'),
('62000000-0000-0000-0000-000000000001','checkpoint','Crossed Barabanki toll',26.94,81.02,'2026-09-14T08:30:00Z');

insert into public.fee_rules(id,code,label,basis,value,bearer,effective_from) values
('70000000-0000-0000-0000-000000000001','fpo_share','FPO operational share','percentage',4,'distribution','2026-01-01'),
('70000000-0000-0000-0000-000000000002','agribridge_share','AgriBridge share','percentage',1,'distribution','2026-01-01'),
('70000000-0000-0000-0000-000000000003','assaying','Seller-borne assaying','fixed',150000,'seller','2026-01-01');
insert into public.order_charges(order_id,fee_rule_id,code,label,bearer,amount_paise) values
('60000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000001','fpo_share','FPO operational share','distribution',800000),
('60000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000002','agribridge_share','AgriBridge share','distribution',200000),
('60000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000003','assaying','Assaying','seller',150000),
('60000000-0000-0000-0000-000000000001',null,'freight','Medium goods vehicle freight','buyer',1820000),
('60000000-0000-0000-0000-000000000001',null,'insurance','Transit insurance','buyer',22000);
insert into public.order_price_snapshots(id,order_id,produce_subtotal_paise,fpo_share_paise,agribridge_share_paise,logistics_paise,insurance_paise,statutory_charges_paise,adjustments_paise,buyer_payable_paise,farmer_pool_paise,first_release_paise,second_release_paise,calculator_version,calculation_inputs) values
('70500000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001',20000000,800000,200000,1820000,22000,0,0,21842000,18850000,9425000,9425000,'money-v1','{"fpoBasisPoints":400,"agribridgeBasisPoints":100,"releaseRule":"50-balance"}');
insert into public.payment_transactions(order_id,provider,provider_event_id,provider_payment_reference,event_type,status,amount_paise,payload_hash,occurred_at) values
('60000000-0000-0000-0000-000000000001','mock','mock_evt_1072_secured','mock_pay_1072','payment.succeeded','succeeded',21842000,'demo-sha256','2026-09-14T05:32:00Z');
insert into public.settlements(id,order_id,state,secured_paise,first_release_paise,second_release_paise,provider_reference) values
('71000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','FIRST_RELEASED',21842000,9425000,9425000,'mock_settlement_1072');
insert into public.escrow_milestones(settlement_id,milestone,status,amount_paise,evidence_reference,occurred_at) values
('71000000-0000-0000-0000-000000000001','funds_secured','verified',21842000,'mock_evt_1072_secured','2026-09-14T05:32:00Z'),
('71000000-0000-0000-0000-000000000001','loading_verified','verified',0,'delivery-proofs/mock-loading-1072','2026-09-14T07:15:00Z'),
('71000000-0000-0000-0000-000000000001','first_release','released',9425000,'mock_release_1_1072','2026-09-14T07:20:00Z');
insert into public.farmer_payouts(settlement_id,farmer_id,lot_contributor_id,gross_paise,deductions_paise,net_paise,bank_account_reference_id,status,provider_reference) values
('71000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','51000000-0000-0000-0000-000000000001',4025000,32000,3993000,'32000000-0000-0000-0000-000000000001','paid','mock_payout_ram_1072');

insert into public.forecasts(organization_id,commodity,district,horizon_days,expected_demand,expected_min_price_paise,expected_max_price_paise,confidence,supply_pressure,recommended_harvest_window,buyer_segment,drivers,source_date,synced_at) values
('10000000-0000-0000-0000-000000000001','Potato','Gonda',15,'high',1900,2300,82,'balanced','[2026-09-20,2026-09-25]','Institutional kitchens','["Recent modal-price average","Seasonal factor","Seeded buyer demand"]','2026-09-13','2026-09-14T00:30:00Z');
insert into public.notifications(organization_id,type,title,body,action_path) values
('10000000-0000-0000-0000-000000000001','shipment','Shipment on schedule','UP 43 AT 2186 is 64 km from Lucknow','/shipments/AB-260914-1072'),
('10000000-0000-0000-0000-000000000001','settlement','First release recorded','₹94,250 allocated across farmer payouts','/settlements/AB-260914-1072');
insert into public.disputes(organization_id,buyer_organization_id,order_id,category,summary,status) values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','quality','Buyer reported two damaged crates; evidence requested before final release.','evidence_requested');
