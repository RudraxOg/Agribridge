import "server-only";
import { redirect } from "next/navigation";
import { getAccessContext } from "@/lib/authorization/access";

export async function requireOrganizationMember(locale: string, organizationSlug: string) {
  const access = await getAccessContext(organizationSlug);
  if (!access) redirect(`/${locale}/access-denied?reason=membership`);
  if (!access.organization || !access.membership) redirect(`/${locale}/access-denied?reason=organization`);
  return access;
}
