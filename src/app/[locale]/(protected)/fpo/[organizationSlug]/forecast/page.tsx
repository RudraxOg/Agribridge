import ForecastPage from "@/app/[locale]/(fpo)/fpo/forecast/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationForecast({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "lots.read");
  return <ForecastPage />;
}
