import { CompareContent } from "@/features/navigation/buyer-page-content";
import { requireLocale } from "@/lib/i18n/locale";

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  return <CompareContent locale={locale} />;
}
