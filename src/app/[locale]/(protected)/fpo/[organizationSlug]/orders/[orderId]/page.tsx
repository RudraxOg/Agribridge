import OrderDetail from "@/app/[locale]/(fpo)/fpo/orders/[orderId]/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationOrderDetail({ params }: { params: Promise<{ locale: string; organizationSlug: string; orderId: string }> }) {
  const { locale: raw, organizationSlug, orderId } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "orders.read");
  return <OrderDetail params={Promise.resolve({ locale, orderId })} />;
}
