import type { RoleKey } from "@/lib/authorization/permissions";
import { roleHome } from "@/lib/authorization/permissions";

export type SignedInEntryDecision =
  | { kind: "verify-email"; href: string }
  | { kind: "complete-profile"; href: string }
  | { kind: "select-organization"; href: string }
  | { kind: "complete-organization"; href: string }
  | { kind: "guided-demo"; href: string }
  | { kind: "role-home"; href: string };

export type SignedInEntrySnapshot = {
  emailVerified: boolean;
  profileComplete: boolean;
  role: RoleKey;
  memberships: number;
  activeOrganizationSlug?: string | null;
  organizationComplete: boolean;
  guidedDemoStatus: "not_started" | "in_progress" | "completed" | "skipped";
};

const platformRoles = new Set<RoleKey>(["platform_admin", "compliance_auditor", "support_agent"]);

export function decideSignedInEntry(locale: string, snapshot: SignedInEntrySnapshot): SignedInEntryDecision {
  if (!snapshot.emailVerified) return { kind: "verify-email", href: `/${locale}/verify-email` };
  if (!snapshot.profileComplete) return { kind: "complete-profile", href: `/${locale}/onboarding/profile` };
  if (platformRoles.has(snapshot.role)) return { kind: "role-home", href: roleHome(locale, snapshot.role) };
  if (!snapshot.memberships || !snapshot.activeOrganizationSlug) return { kind: "select-organization", href: `/${locale}/organizations` };
  if (snapshot.memberships > 1 && !snapshot.activeOrganizationSlug) return { kind: "select-organization", href: `/${locale}/organizations` };
  if (!snapshot.organizationComplete) return { kind: "complete-organization", href: `/${locale}/onboarding/checklist` };
  if (snapshot.guidedDemoStatus !== "completed" && snapshot.guidedDemoStatus !== "skipped") return { kind: "guided-demo", href: `/${locale}/onboarding/welcome` };
  return { kind: "role-home", href: roleHome(locale, snapshot.role, snapshot.activeOrganizationSlug) };
}
