import { redirect } from "next/navigation";
import { resolveSignedInEntry } from "@/lib/auth/resolve-signed-in-entry";
export async function RoleHomeRedirect({locale,organizationSlug}:{locale:string;organizationSlug?:string}){const decision=await resolveSignedInEntry(locale,organizationSlug);redirect(decision?.href??`/${locale}/sign-in`);}
