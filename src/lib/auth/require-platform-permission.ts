import "server-only";
import { redirect } from "next/navigation";
import { getAccessContext } from "@/lib/authorization/access";
import type { Permission } from "@/lib/authorization/permissions";
export async function requirePlatformPermission(locale:string,permission:Permission,{requireMfa=false}={}){const access=await getAccessContext();if(!access?.permissions.has(permission))redirect(`/${locale}/access-denied?reason=platform-permission`);if(requireMfa&&access.mfaLevel!=="aal2"&&!access.isDemo)redirect(`/${locale}/settings/security?step=mfa`);return access;}
