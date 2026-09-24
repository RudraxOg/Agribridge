import NewFarmerPage from "@/app/[locale]/(fpo)/fpo/farmers/new/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationNewFarmer({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "farmers.write");
  return <NewFarmerPage />;
}
