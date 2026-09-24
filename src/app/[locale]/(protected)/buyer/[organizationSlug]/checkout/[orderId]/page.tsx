import { CheckoutContent } from "@/features/navigation/buyer-page-content";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationCheckout({ params }: { params: Promise<{ locale: string; organizationSlug: string; orderId: string }> }) {
  const { locale: raw, organizationSlug, orderId } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "orders.create");
  return <CheckoutContent locale={locale} orderId={orderId} basePath={`/buyer/${organizationSlug}`} />;
}
