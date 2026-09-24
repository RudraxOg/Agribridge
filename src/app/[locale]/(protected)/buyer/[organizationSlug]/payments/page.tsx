import BuyerPayments from "@/app/[locale]/(buyer)/buyer/payments/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function BuyerPaymentsPage({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "settlements.read");
  return <BuyerPayments />;
}
