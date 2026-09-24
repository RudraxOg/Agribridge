import {randomBytes} from "node:crypto";
import {existsSync,readFileSync} from "node:fs";
import {createClient} from "@supabase/supabase-js";

for(const file of [".env.local",".env"]){if(existsSync(file))for(const line of readFileSync(file,"utf8").split(/\r?\n/)){if(!line||line.startsWith("#")||!line.includes("="))continue;const index=line.indexOf("=");const key=line.slice(0,index);if(process.env[key]===undefined)process.env[key]=line.slice(index+1);}}
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
const localDemo=process.argv.includes("--local-demo");const remoteDemo=process.argv.includes("--remote-demo");
const isLocal=Boolean(url&&/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(url));
const remoteHost=url&&!isLocal?new URL(url).host:null;
if(!url||!serviceKey||(!localDemo&&!remoteDemo)||(localDemo&&!isLocal)||(remoteDemo&&(!remoteHost||process.env.REMOTE_DEMO_SEED_CONFIRMATION!==remoteHost))){console.error("Use --local-demo with localhost, or --remote-demo with REMOTE_DEMO_SEED_CONFIRMATION set to the exact Supabase host.");process.exit(1)}
const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
type DemoAccount={email:string;name:string;organization:string|null;role:string;intent?:"fpo"|"buyer"|"logistics"};

const allAccounts:DemoAccount[]=[
  // These three accounts cover the complete FPO, buyer, and logistics setup
  // forms. They are local-only and their passwords rotate on every run.
  {email:"fpo.owner@demo.invalid",name:"Anita Singh",organization:"awadh-pragati-fpc",role:"fpo_owner",intent:"fpo"},
  {email:"fpo.operator@demo.invalid",name:"Demo FPO Operator",organization:"awadh-pragati-fpc",role:"fpo_operator"},
  {email:"fpo.finance@demo.invalid",name:"Demo FPO Finance",organization:"sahyadri-growers",role:"fpo_finance"},
  {email:"buyer.owner@demo.invalid",name:"Rohan Mehta",organization:"lucknow-fresh-mart",role:"buyer_owner",intent:"buyer"},
  {email:"buyer.procurement@demo.invalid",name:"Demo Buyer Procurement",organization:"northstar-exports",role:"buyer_procurement"},
  {email:"logistics.dispatch@demo.invalid",name:"Kavita Sharma",organization:"gati-demo-logistics",role:"logistics_dispatcher",intent:"logistics"},
  {email:"logistics.driver@demo.invalid",name:"Demo Driver",organization:"gati-demo-logistics",role:"logistics_driver"},
  {email:"platform.admin@demo.invalid",name:"Demo Platform Admin",organization:null,role:"platform_admin"},
] as const;
const accounts=remoteDemo?allAccounts.filter((account)=>Boolean(account.intent)):allAccounts;
const demoOrganizations:Record<string,{type:"fpo"|"buyer"|"logistics";name:string;state:string;district:string;address:string}>={
  "awadh-pragati-fpc":{type:"fpo",name:"Awadh Pragati Farmer Producer Company",state:"Uttar Pradesh",district:"Gonda",address:"Synthetic demo office, Mankapur Road, Gonda"},
  "lucknow-fresh-mart":{type:"buyer",name:"Lucknow Fresh Mart",state:"Uttar Pradesh",district:"Lucknow",address:"Synthetic demo office, Gomti Nagar, Lucknow"},
  "gati-demo-logistics":{type:"logistics",name:"Gati Demo Logistics",state:"Uttar Pradesh",district:"Lucknow",address:"Synthetic demo fleet office, Lucknow"},
};

const completedAt="2026-09-22T09:00:00.000Z";

async function ensureCompletedWorkspace(account:DemoAccount,userId:string,organization:{id:string;slug:string}){
  if(account.intent==="fpo"){
    const {error}=await admin.from("fpo_profiles").upsert({organization_id:organization.id,farmer_count_estimate:248,primary_crops:["Potato","Onion","Tomato"],settlement_preferences:{release_schedule:"50-50",payout_method:"verified_bank_reference"}});
    if(error)throw new Error(`Could not seed FPO profile: ${error.message}`);
  }
  if(account.intent==="buyer"){
    const {error}=await admin.from("buyer_profiles").upsert({organization_id:organization.id,buyer_type:"supermarket",expected_monthly_quantity_kg:85000,sourcing_regions:["Gonda","Barabanki","Nashik"],procurement_preferences:{commodities:["Potato","Onion","Tomato"],quality_grade:"A",delivery_window:"morning"}});
    if(error)throw new Error(`Could not seed buyer profile: ${error.message}`);
  }
  if(account.intent==="logistics"){
    const {error:profileError}=await admin.from("logistics_profiles").upsert({organization_id:organization.id,fleet_size:18,cold_storage_available:true,operating_hours:"06:00–22:00"});
    if(profileError)throw new Error(`Could not seed logistics profile: ${profileError.message}`);
    const areas=[
      {organization_id:organization.id,state:"Uttar Pradesh",district:"Lucknow",latitude:26.8467,longitude:80.9462},
      {organization_id:organization.id,state:"Uttar Pradesh",district:"Gonda",latitude:27.1339,longitude:81.9619},
    ];
    for(const area of areas){const existing=await admin.from("logistics_service_areas").select("id").eq("organization_id",organization.id).eq("state",area.state).eq("district",area.district).maybeSingle();if(existing.error)throw new Error(`Could not read logistics service areas: ${existing.error.message}`);if(!existing.data){const created=await admin.from("logistics_service_areas").insert(area);if(created.error)throw new Error(`Could not seed logistics service area: ${created.error.message}`);}}
  }
  const {error}=await admin.from("onboarding_progress").upsert({user_id:userId,organization_id:organization.id,profile_complete_at:completedAt,organization_complete_at:completedAt,selected_experience:"setup",guided_demo_status:"skipped",skipped_at:completedAt,last_seen_at:completedAt},{onConflict:"user_id,organization_id"});
  if(error)throw new Error(`Could not mark demo onboarding complete: ${error.message}`);
}
const listResult=await admin.auth.admin.listUsers({page:1,perPage:1000});
if(listResult.error||!listResult.data)throw new Error("Could not list local demo users");
const existingUsers=listResult.data.users as Array<{id:string;email?:string}>;
const output:Array<{email:string;password:string;role:string}>=[];
for(const account of accounts){
  const password=`Ab!${randomBytes(12).toString("base64url")}`;
  let user=existingUsers.find((candidate)=>candidate.email===account.email);
  if(user)await admin.auth.admin.updateUserById(user.id,{password,email_confirm:true,user_metadata:{display_name:account.name,signup_intent:account.intent}});
  else{
    const created=await admin.auth.admin.createUser({email:account.email,password,email_confirm:true,user_metadata:{display_name:account.name,signup_intent:account.intent}});
    if(created.error||!created.data.user)throw new Error(`Could not create ${account.email}`);
    user={id:created.data.user.id,email:created.data.user.email};
  }
  await admin.from("profiles").upsert({id:user.id,full_name:account.name,display_name:account.name,preferred_locale:"en",signup_intent:null});
  const{data:role}=await admin.from("roles").select("id").eq("key",account.role).single();
  if(!role?.id)throw new Error(`Missing role ${account.role}`);
  if(account.organization){
    let{data:organization}=await admin.from("organizations").select("id,type,slug").eq("slug",account.organization).maybeSingle();
    if(!organization&&account.intent){const details=demoOrganizations[account.organization];const created=await admin.from("organizations").insert({...details,slug:account.organization,verification_status:"verified"}).select("id,type,slug").single();if(created.error)throw new Error(`Could not create demo organization ${account.organization}: ${created.error.message}`);organization=created.data;}
    if(!organization?.id)throw new Error(`Missing organization ${account.organization}`);
    const legacyRole=account.role==="fpo_owner"?"fpo_admin":account.role==="fpo_operator"?"fpo_operator":account.role==="buyer_owner"?"buyer_admin":account.role==="buyer_procurement"?"buyer_operator":null;
    await admin.from("organization_members").upsert({organization_id:organization.id,profile_id:user.id,user_id:user.id,role:legacyRole,role_id:role.id,active:true,status:"active",joined_at:new Date().toISOString(),revoked_at:null},{onConflict:"organization_id,profile_id"});
    if(account.intent)await ensureCompletedWorkspace(account,user.id,organization);
    if(account.role==="logistics_driver")await admin.from("shipments").update({assigned_driver_user_id:user.id}).eq("id","62000000-0000-0000-0000-000000000001");
  }else await admin.from("platform_role_assignments").upsert({user_id:user.id,role_id:role.id,status:"active",revoked_at:null},{onConflict:"user_id,role_id"});
  output.push({email:account.email,password,role:account.role});
}
console.log(`${remoteDemo?"REMOTE SYNTHETIC DEMO":"LOCAL DEMO ONLY"} — temporary credentials rotate every run:`);console.table(output);
