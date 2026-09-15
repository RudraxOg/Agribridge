import {randomBytes} from "node:crypto";
import {createClient} from "@supabase/supabase-js";

if(!process.argv.includes("--local-demo")){console.error("Refusing to create users without --local-demo.");process.exit(1)}
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!serviceKey||!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(url)){console.error("Demo users require local Supabase URL and a local service-role key.");process.exit(1)}
const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
const accounts=[
  {email:"fpo.owner@demo.invalid",name:"Demo FPO Owner",organization:"awadh-pragati-fpc",role:"fpo_owner"},
  {email:"fpo.operator@demo.invalid",name:"Demo FPO Operator",organization:"awadh-pragati-fpc",role:"fpo_operator"},
  {email:"fpo.finance@demo.invalid",name:"Demo FPO Finance",organization:"sahyadri-growers",role:"fpo_finance"},
  {email:"buyer.owner@demo.invalid",name:"Demo Buyer Owner",organization:"lucknow-fresh-mart",role:"buyer_owner"},
  {email:"buyer.procurement@demo.invalid",name:"Demo Buyer Procurement",organization:"northstar-exports",role:"buyer_procurement"},
  {email:"logistics.dispatch@demo.invalid",name:"Demo Dispatcher",organization:"gati-demo-logistics",role:"logistics_dispatcher"},
  {email:"logistics.driver@demo.invalid",name:"Demo Driver",organization:"gati-demo-logistics",role:"logistics_driver"},
  {email:"platform.admin@demo.invalid",name:"Demo Platform Admin",organization:null,role:"platform_admin"},
] as const;
const{data:list}=await admin.auth.admin.listUsers({page:1,perPage:1000});const output:Array<{email:string;password:string;role:string}>=[];
for(const account of accounts){const password=`Ab!${randomBytes(12).toString("base64url")}`;let user=list.users.find((candidate)=>candidate.email===account.email);if(user)await admin.auth.admin.updateUserById(user.id,{password,email_confirm:true,user_metadata:{display_name:account.name}});else{const created=await admin.auth.admin.createUser({email:account.email,password,email_confirm:true,user_metadata:{display_name:account.name}});if(created.error||!created.data.user)throw new Error(`Could not create ${account.email}`);user=created.data.user}await admin.from("profiles").upsert({id:user.id,full_name:account.name,display_name:account.name,preferred_locale:"en"});const{data:role}=await admin.from("roles").select("id").eq("key",account.role).single();if(!role?.id)throw new Error(`Missing role ${account.role}`);if(account.organization){const{data:organization}=await admin.from("organizations").select("id,type").eq("slug",account.organization).single();if(!organization?.id)throw new Error(`Missing organization ${account.organization}`);const legacyRole=account.role==="fpo_owner"?"fpo_admin":account.role==="fpo_operator"?"fpo_operator":account.role==="buyer_owner"?"buyer_admin":account.role==="buyer_procurement"?"buyer_operator":null;await admin.from("organization_members").upsert({organization_id:organization.id,profile_id:user.id,user_id:user.id,role:legacyRole,role_id:role.id,active:true,status:"active",joined_at:new Date().toISOString(),revoked_at:null},{onConflict:"organization_id,profile_id"});if(account.role==="logistics_driver")await admin.from("shipments").update({assigned_driver_user_id:user.id}).eq("id","62000000-0000-0000-0000-000000000001");}else await admin.from("platform_role_assignments").upsert({user_id:user.id,role_id:role.id,status:"active",revoked_at:null},{onConflict:"user_id,role_id"});output.push({email:account.email,password,role:account.role})}
console.log("LOCAL DEMO ONLY — temporary credentials rotate every run:");console.table(output);
