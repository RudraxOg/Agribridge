import LotDetail from "@/app/[locale]/(fpo)/fpo/stock/[lotId]/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationLotDetail({ params }: { params: Promise<{ locale: string; organizationSlug: string; lotId: string }> }) {
  const { locale: raw, organizationSlug, lotId } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "lots.read");
  return <LotDetail params={Promise.resolve({ lotId })} />;
}
