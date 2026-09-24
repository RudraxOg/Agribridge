import { CheckoutContent } from "@/features/navigation/buyer-page-content";
import { requireLocale } from "@/lib/i18n/locale";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string; orderId: string }> }) {
  const { locale: raw, orderId } = await params;
  return <CheckoutContent locale={requireLocale(raw)} orderId={orderId} />;
}
