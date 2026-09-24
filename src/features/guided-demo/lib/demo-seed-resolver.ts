import "server-only";
import { getAccessContext } from "@/lib/authorization/access";
export async function ensureDemoScenario(organizationSlug?:string){const access=await getAccessContext(organizationSlug);if(!access?.organization)throw new Error("Active organization required");if(!access.isDemo)throw new Error("Interactive demo data requires an explicit separate demo workspace");return {organizationId:access.organization.id,simulated:true};}
