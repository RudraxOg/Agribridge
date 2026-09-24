import BuyerOrder from "@/app/[locale]/(buyer)/buyer/orders/[orderId]/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationBuyerOrder({ params }: { params: Promise<{ locale: string; organizationSlug: string; orderId: string }> }) {
  const { locale: raw, organizationSlug, orderId } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "orders.read");
  return <BuyerOrder params={Promise.resolve({ locale, orderId })} />;
}
