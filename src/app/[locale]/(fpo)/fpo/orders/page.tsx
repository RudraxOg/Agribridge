import { OrdersContent } from "@/features/navigation/fpo-page-content";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  return <OrdersContent locale={locale} />;
}
