import { StockContent } from "@/features/navigation/fpo-page-content";
import { requireLocale } from "@/lib/i18n/locale";

export default async function StockPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  return <StockContent locale={locale} />;
}
