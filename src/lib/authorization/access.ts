import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Permission, RoleKey } from "./permissions";

export type AccessOrganization = { id: string; name: string; slug: string; type: "fpo" | "buyer" | "logistics" };
export type AccessMembership = { id: string; role: RoleKey; organization: AccessOrganization };
export type AccessContext = {
  user: { id: string; email: string | null; emailVerified: boolean };
  profile: { displayName: string; preferredLocale: string };
  organization: AccessOrganization | null;
  membership: AccessMembership | null;
  memberships: AccessMembership[];
  role: RoleKey;
  permissions: ReadonlySet<string>;
  mfaLevel: "aal1" | "aal2";
  isDemo: boolean;
};

const fpoPermissions: Permission[] = ["farmers.read","farmers.write","lots.read","lots.write","lots.publish","orders.read","orders.approve","shipments.read","settlements.read","members.read","members.invite","files.upload","files.read_private","farmer_documents.read","disputes.manage"];
const buyerPermissions: Permission[] = ["lots.read","orders.read","orders.create","shipments.read","settlements.read","members.read","files.read_private","disputes.manage"];

function demoContext(roleCookie: string | undefined, slug?: string): AccessContext {
  const selected=roleCookie??"fpo";const isPlatform=selected==="platform";const isLogistics=selected==="logistics"||selected==="driver";const buyer=selected==="buyer";
  const organization:AccessOrganization|null=isPlatform?null:buyer?{id:"20000000-0000-0000-0000-000000000001",name:"Lucknow Fresh Mart",slug:slug??"lucknow-fresh-mart",type:"buyer"}:isLogistics?{id:"80000000-0000-0000-0000-000000000001",name:"Gati Demo Logistics",slug:slug??"gati-demo-logistics",type:"logistics"}:{id:"10000000-0000-0000-0000-000000000001",name:"Awadh Pragati FPC",slug:slug??"awadh-pragati-fpc",type:"fpo"};
  const role:RoleKey=isPlatform?"platform_admin":selected==="driver"?"logistics_driver":isLogistics?"logistics_dispatcher":buyer?"buyer_procurement":"fpo_operator";
  const logisticsPermissions:Permission[]=["orders.read","shipments.read","shipments.dispatch","shipment.position.write","files.upload"];
  const platformPermissions:Permission[]=["platform.configure","platform.audit_case.read","support.metadata.read"];
  const membership=organization?{id:`demo-${role}`,role,organization}:null;
  const email=isPlatform?"platform-admin@demo.invalid":buyer?"procurement@demo.invalid":isLogistics?"dispatch@demo.invalid":"operator@demo.invalid";
  return {
    user:{id:"demo-user",email,emailVerified:true},profile:{displayName:`Demo ${role.replaceAll("_"," ")}`,preferredLocale:"en"},
    organization,membership,memberships:membership?[membership]:[],role,
    permissions:new Set(isPlatform?platformPermissions:isLogistics?logisticsPermissions:buyer?buyerPermissions:fpoPermissions),mfaLevel:isPlatform?"aal2":"aal1",isDemo:true,
  };
}

type MembershipRow = {
  id: string; role: { key: RoleKey } | null;
  organization: AccessOrganization | null;
  role_permissions: Array<{ permission: { key: string } | null }> | null;
};

export async function getAccessContext(organizationSlug?: string): Promise<AccessContext | null> {
  const cookieStore = await cookies();
  if ((process.env.INTEGRATION_MODE ?? "mock") === "mock") return demoContext(cookieStore.get("agribridge_demo_role")?.value, organizationSlug);

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;
  const [{ data: profile }, { data: membershipData }, { data: platformData }, assurance] = await Promise.all([
    supabase.from("profiles").select("display_name,full_name,preferred_locale").eq("id",user.id).maybeSingle(),
    supabase.from("organization_members").select("id,role:roles!role_id(key),organization:organizations!organization_id(id,name,slug,type),role_permissions:roles!role_id(role_permissions(permission:permissions!permission_id(key)))").eq("user_id",user.id).eq("status","active").is("revoked_at",null),
    supabase.from("platform_role_assignments").select("role:roles!role_id(key),role_permissions:roles!role_id(role_permissions(permission:permissions!permission_id(key)))").eq("user_id",user.id).eq("status","active").is("revoked_at",null),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);
  const rows = (membershipData ?? []) as unknown as MembershipRow[];
  const memberships = rows.flatMap((row) => row.organization && row.role ? [{ id: row.id, role: row.role.key, organization: row.organization }] : []);
  const selected = organizationSlug ? rows.find((row) => row.organization?.slug === organizationSlug) : rows.length === 1 ? rows[0] : undefined;
  const platform = (platformData?.[0] ?? null) as unknown as { role?: { key: RoleKey }; role_permissions?: Array<{ permission?: { key: string } }> } | null;
  if (!selected && !platform?.role && rows.length===0) return null;
  const fallbackMembership = rows[0];
  const permissionRows = selected?.role_permissions ?? platform?.role_permissions ?? fallbackMembership?.role_permissions ?? [];
  const role = selected?.role?.key ?? platform?.role?.key ?? fallbackMembership?.role?.key;
  if (!role) return null;
  return {
    user: { id: user.id, email: user.email ?? null, emailVerified: Boolean(user.email_confirmed_at) },
    profile: { displayName: String(profile?.display_name ?? profile?.full_name ?? "AgriBridge user"), preferredLocale: String(profile?.preferred_locale ?? "en") },
    organization: selected?.organization ?? null,
    membership: selected?.organization && selected.role ? { id: selected.id, role: selected.role.key, organization: selected.organization } : null,
    memberships, role, permissions: new Set(permissionRows.flatMap((item) => item.permission?.key ? [item.permission.key] : [])),
    mfaLevel: assurance.data?.currentLevel === "aal2" ? "aal2" : "aal1", isDemo: false,
  };
}
