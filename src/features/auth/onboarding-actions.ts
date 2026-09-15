"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { roleHome, type OrganizationRole } from "@/lib/authorization/permissions";
import type { AuthActionState } from "./actions";

const schema=z.object({locale:z.string().regex(/^[a-z]{2}$/),type:z.enum(["fpo","buyer","logistics"]),name:z.string().trim().min(2).max(180),slug:z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),state:z.string().trim().min(2).max(100),district:z.string().trim().min(2).max(100)});
export async function createOrganizationAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{const parsed=schema.safeParse(Object.fromEntries(formData));if(!parsed.success)return{status:"error",message:"Check the organization details and URL slug."};if((process.env.INTEGRATION_MODE??"mock")==="mock")return{status:"error",message:"Organization creation is simulated in mock mode. Use the guided demo organization."};const supabase=await createClient();const {error}=await supabase.rpc("create_organization_with_owner",{organization_name:parsed.data.name,organization_slug:parsed.data.slug,organization_kind:parsed.data.type,organization_state:parsed.data.state,organization_district:parsed.data.district});if(error)return{status:"error",message:"The organization could not be created. The URL slug may already be in use."};const role=`${parsed.data.type}_owner` as OrganizationRole;redirect(roleHome(parsed.data.locale,role,parsed.data.slug));}
