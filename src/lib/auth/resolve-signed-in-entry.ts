import "server-only";
import { cookies } from "next/headers";

import { getAccessContext } from "@/lib/authorization/access";
import { createClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server";
import { demoRoleForMembership, roleHome, type RoleKey } from "@/lib/authorization/permissions";
import { usesLiveWorkspace } from "./auth-mode";
import { decideSignedInEntry, type SignedInEntryDecision } from "./signed-in-entry-decision";

/** Resolves only server-derived account, membership and persisted onboarding state. */
export async function resolveSignedInEntry(locale: string, organizationSlug?: string): Promise<SignedInEntryDecision | null> {
  const access = await getAccessContext(organizationSlug);
  if (!access) return null;

  if (access.isDemo) {
    const { getDemoAccessContext } = await import("@/features/guided-demo/lib/get-demo-access-context");
    const demo = await getDemoAccessContext(organizationSlug);
    return decideSignedInEntry(locale, {
      emailVerified: access.user.emailVerified,
      profileComplete: true,
      role: access.role,
      memberships: access.memberships.length,
      activeOrganizationSlug: access.organization?.slug,
      organizationComplete: true,
      guidedDemoStatus: demo?.status ?? "not_started",
    });
  }

  const supabase = await createClient();
  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", access.user.id).maybeSingle(),
    access.organization
      ? supabase.from("onboarding_progress").select("organization_complete_at,guided_demo_status").eq("user_id", access.user.id).eq("organization_id", access.organization.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const liveProfile = profile as { full_name?: string | null } | null;
  const liveProgress = progress as { organization_complete_at?: string | null; guided_demo_status?: "not_started" | "in_progress" | "completed" | "skipped" | null } | null;
  const profileComplete = Boolean(liveProfile?.full_name?.trim());
  const organizationComplete = !access.organization || Boolean(liveProgress?.organization_complete_at);
  return decideSignedInEntry(locale, {
    emailVerified: access.user.emailVerified,
    profileComplete,
    role: access.role,
    memberships: access.memberships.length,
    activeOrganizationSlug: access.organization?.slug,
    organizationComplete,
    guidedDemoStatus: liveProgress?.guided_demo_status ?? "not_started",
  });
}

/** Auth-only deployments use Supabase for identity and onboarding records, while
 * operational screens remain mock-backed. This resolver never trusts URL intent. */
export async function resolveAuthOnboardingEntry(locale: string): Promise<string | null> {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  if (!user.email_confirmed_at) return `/${locale}/verify-email`;
  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("signup_intent").eq("id", user.id).maybeSingle(),
    supabase.from("organization_members").select("role:roles!role_id(key),organization:organizations!organization_id(slug)").eq("user_id", user.id).eq("status", "active").is("revoked_at", null),
  ]);
  const membership = (memberships ?? [])[0] as unknown as { role?: { key?: RoleKey } | null; organization?: { slug?: string } | null } | undefined;
  if (membership?.role?.key && membership.organization?.slug) {
    if (!usesLiveWorkspace()) {
      (await cookies()).set("agribridge_demo_role", demoRoleForMembership(membership.role.key), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
    }
    return roleHome(locale, membership.role.key, membership.organization.slug);
  }
  const intent = (profile as { signup_intent?: string | null } | null)?.signup_intent;
  if (intent === "fpo" || intent === "buyer" || intent === "logistics") return `/${locale}/onboarding/${intent}`;
  return `/${locale}/onboarding/organization`;
}
