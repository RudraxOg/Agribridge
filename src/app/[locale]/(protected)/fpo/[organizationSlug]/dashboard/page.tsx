import { FpoDashboardContent } from "@/features/navigation/fpo-dashboard-content";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationDashboard({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  const access = await requirePermission(locale, organizationSlug, "lots.read");
  return <FpoDashboardContent locale={locale} organizationSlug={organizationSlug} displayName={access.profile.displayName} canWriteFarmers={access.permissions.has("farmers.write")} canWriteLots={access.permissions.has("lots.write")} />;
}
