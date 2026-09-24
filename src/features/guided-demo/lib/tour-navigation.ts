import type { RoleKey } from "@/lib/authorization/permissions";
import { roleHome } from "@/lib/authorization/permissions";
export function tourHome(locale:string,role:RoleKey,slug?:string){return roleHome(locale,role,slug);}
