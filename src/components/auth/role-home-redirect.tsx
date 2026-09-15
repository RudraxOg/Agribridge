import { redirect } from "next/navigation";
import { roleHome } from "@/lib/authorization/permissions";
import { getAccessContext } from "@/lib/authorization/access";
export async function RoleHomeRedirect({locale,organizationSlug}:{locale:string;organizationSlug?:string}){const access=await getAccessContext(organizationSlug);if(!access)redirect(`/${locale}/sign-in`);if(!access.organization)redirect(`/${locale}/organizations`);redirect(roleHome(locale,access.role,access.organization.slug));}
