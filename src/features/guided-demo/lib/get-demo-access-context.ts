import "server-only";
import { cookies } from "next/headers";
import { getAccessContext } from "@/lib/authorization/access";
import { createClient } from "@/lib/supabase/server";
import type { GuidedDemoState, TourStatus } from "../types";

type ProgressRow={guided_demo_status?:TourStatus;current_tour_key?:string|null;current_step_key?:string|null};
const mockCookie="agribridge_guided_demo";

export async function getDemoAccessContext(organizationSlug?:string):Promise<GuidedDemoState|null>{
  const access=await getAccessContext(organizationSlug);
  if(!access)return null;
  if(access.isDemo){const stored=(await cookies()).get(mockCookie)?.value;let progress:ProgressRow={guided_demo_status:"not_started"};try{progress=stored?JSON.parse(stored) as ProgressRow:progress}catch{}return {role:access.role,organization:access.organization,profile:access.profile,permissions:[...access.permissions],status:progress.guided_demo_status??"not_started",currentTourKey:progress.current_tour_key,currentStepKey:progress.current_step_key,isDemo:true,active:progress.guided_demo_status==="in_progress"};}
  const supabase=await createClient();
  const query=supabase.from("onboarding_progress").select("guided_demo_status,current_tour_key,current_step_key").eq("user_id",access.user.id);
  const {data}=access.organization?await query.eq("organization_id",access.organization.id).maybeSingle():await query.is("organization_id",null).maybeSingle();
  const progress=(data??{}) as ProgressRow;
  return {role:access.role,organization:access.organization,profile:access.profile,permissions:[...access.permissions],status:progress.guided_demo_status??"not_started",currentTourKey:progress.current_tour_key,currentStepKey:progress.current_step_key,isDemo:false,active:progress.guided_demo_status==="in_progress"};
}
export const guidedDemoCookie=mockCookie;
