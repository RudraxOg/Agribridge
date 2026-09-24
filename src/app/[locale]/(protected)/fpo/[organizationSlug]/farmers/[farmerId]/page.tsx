import FarmerDetail from "@/app/[locale]/(fpo)/fpo/farmers/[farmerId]/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationFarmerDetail({ params }: { params: Promise<{ locale: string; organizationSlug: string; farmerId: string }> }) {
  const { locale: raw, organizationSlug, farmerId } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "farmers.read");
  return <FarmerDetail params={Promise.resolve({ farmerId })} />;
}
