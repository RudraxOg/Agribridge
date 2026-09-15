"use client";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import type { AccessMembership } from "@/lib/authorization/access";
import { roleHome } from "@/lib/authorization/permissions";
export function OrganizationSwitcher({locale,currentSlug,memberships}:{locale:string;currentSlug?:string;memberships:AccessMembership[]}){const router=useRouter();if(memberships.length<2)return null;return <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-sm font-bold"><Building2 aria-hidden size={18}/><span className="sr-only">Organization</span><select aria-label="Organization" value={currentSlug} onChange={(event)=>{const membership=memberships.find((item)=>item.organization.slug===event.target.value);if(membership)router.push(roleHome(locale,membership.role,membership.organization.slug));}} className="max-w-44 bg-transparent outline-none">{memberships.map((item)=><option key={item.id} value={item.organization.slug}>{item.organization.name}</option>)}</select></label>}
