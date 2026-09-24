import LogisticsPage from "@/app/[locale]/(fpo)/fpo/logistics/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationLogistics({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "shipments.read");
  return <LogisticsPage />;
}
