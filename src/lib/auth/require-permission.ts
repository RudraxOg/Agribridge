import "server-only";
import { redirect } from "next/navigation";
import { getAccessContext } from "@/lib/authorization/access";
import type { Permission } from "@/lib/authorization/permissions";

export async function requirePermission(locale: string, organizationSlug: string, permission: Permission, options?: { requireMfa?: boolean }) {
  const access = await getAccessContext(organizationSlug);
  if (!access?.organization || !access.permissions.has(permission)) redirect(`/${locale}/access-denied?reason=permission`);
  if (options?.requireMfa && access.mfaLevel !== "aal2" && !access.isDemo) redirect(`/${locale}/settings/security?step=mfa`);
  return access;
}
