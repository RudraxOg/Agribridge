import { FarmersContent } from "@/features/navigation/fpo-page-content";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationFarmers({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "farmers.read");
  return <FarmersContent locale={locale} basePath={`/fpo/${organizationSlug}`} />;
}
