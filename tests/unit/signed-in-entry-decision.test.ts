import { describe, expect, it } from "vitest";
import { decideSignedInEntry, type SignedInEntrySnapshot } from "@/lib/auth/signed-in-entry-decision";

const ready: SignedInEntrySnapshot = { emailVerified: true, profileComplete: true, role: "fpo_operator", memberships: 1, activeOrganizationSlug: "awadh", organizationComplete: true, guidedDemoStatus: "completed" };

describe("signed-in entry decisions", () => {
  it("orders verification, profile, membership, setup and demo before role home", () => {
    expect(decideSignedInEntry("en", { ...ready, emailVerified: false })).toEqual({ kind: "verify-email", href: "/en/verify-email" });
    expect(decideSignedInEntry("en", { ...ready, profileComplete: false })).toEqual({ kind: "complete-profile", href: "/en/onboarding/profile" });
    expect(decideSignedInEntry("en", { ...ready, memberships: 0, activeOrganizationSlug: null })).toEqual({ kind: "select-organization", href: "/en/organizations" });
    expect(decideSignedInEntry("en", { ...ready, organizationComplete: false })).toEqual({ kind: "complete-organization", href: "/en/onboarding/checklist" });
    expect(decideSignedInEntry("en", { ...ready, guidedDemoStatus: "not_started" })).toEqual({ kind: "guided-demo", href: "/en/onboarding/welcome" });
  });

  it("uses canonical homes and keeps platform access separate", () => {
    expect(decideSignedInEntry("hi", ready)).toEqual({ kind: "role-home", href: "/hi/fpo/awadh/dashboard" });
    expect(decideSignedInEntry("en", { ...ready, role: "platform_admin", memberships: 0, activeOrganizationSlug: null })).toEqual({ kind: "role-home", href: "/en/platform/admin" });
  });
});
