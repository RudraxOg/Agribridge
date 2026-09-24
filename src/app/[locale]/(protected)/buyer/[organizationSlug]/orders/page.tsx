import { BuyerOrdersContent } from "@/features/navigation/buyer-page-content";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationBuyerOrders({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "orders.read");
  return <BuyerOrdersContent locale={locale} basePath={`/buyer/${organizationSlug}`} />;
}
