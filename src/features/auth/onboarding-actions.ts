"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthClient } from "@/lib/supabase/server";
import type { AuthActionState } from "./action-state";
import { getAccessContext } from "@/lib/authorization/access";
import { isSupabaseAuthEnabled, usesLiveWorkspace } from "@/lib/auth/auth-mode";
import { resolveAuthOnboardingEntry } from "@/lib/auth/resolve-signed-in-entry";

const optionalInteger = z.preprocess((value) => value === "" || value === undefined ? undefined : value, z.coerce.number().int().min(0).max(10_000_000).optional());
const schema=z.object({locale:z.string().regex(/^[a-z]{2}$/),type:z.enum(["fpo","buyer","logistics"]),name:z.string().trim().min(2).max(180),slug:z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),state:z.string().trim().min(2).max(100),district:z.string().trim().min(2).max(100),address:z.string().trim().max(500).optional(),primaryCrops:z.string().trim().max(500).optional(),farmerCount:optionalInteger,buyerType:z.enum(["supermarket","exporter","processor","hotel_restaurant","institutional"]).optional(),monthlyQuantity:optionalInteger,serviceDistricts:z.string().trim().max(500).optional(),fleetSize:optionalInteger,coldStorage:z.enum(["true","false"]).optional(),operatingHours:z.string().trim().max(160).optional()});
export async function createOrganizationAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success)return{status:"error",message:"Check the organization details and URL slug."};if(!isSupabaseAuthEnabled())return{status:"error",message:"Organization setup is available after signing in with Supabase."};const value=parsed.data;const crops=value.primaryCrops?.split(",").map((crop)=>crop.trim()).filter(Boolean)??[];const sourcingRegions=value.serviceDistricts?.split(",").map((district)=>district.trim()).filter(Boolean)??[];const supabase=await createAuthClient();const {error}=await supabase.rpc("create_organization_from_signup_intent",{p_signup_intent:value.type,p_organization_name:value.name,p_slug:value.slug,p_onboarding_data:{state:value.state,district:value.district,address:value.address,primary_crops:crops,farmer_count_estimate:value.farmerCount,buyer_type:value.buyerType,expected_monthly_quantity_kg:value.monthlyQuantity,sourcing_regions:sourcingRegions,fleet_size:value.fleetSize,cold_storage_available:value.coldStorage === "true",operating_hours:value.operatingHours}});if(error)return{status:"error",message:"The workspace could not be created. Confirm your verified account and choose a unique slug."};redirect((await resolveAuthOnboardingEntry(value.locale))??`/${value.locale}/onboarding/welcome`);}

export async function completeOrganizationSetupAction(locale: string) {
  const access = await getAccessContext();
  if (!access?.organization) redirect(`/${locale}/organizations`);
  if (usesLiveWorkspace()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const timestamp = new Date().toISOString();
    const { error } = await supabase.from("onboarding_progress").upsert({ user_id: access.user.id, organization_id: access.organization.id, organization_complete_at: timestamp, last_seen_at: timestamp }, { onConflict: "user_id,organization_id" });
    if (error) redirect(`/${locale}/onboarding/checklist?error=save`);
  }
  redirect(`/${locale}/onboarding/welcome`);
}
