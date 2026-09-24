import { ProductContent } from "@/features/navigation/buyer-page-content";
import { requireLocale } from "@/lib/i18n/locale";

export default async function ProductPage({ params }: { params: Promise<{ locale: string; lotId: string }> }) {
  const { locale: raw, lotId } = await params;
  return <ProductContent locale={requireLocale(raw)} lotId={lotId} />;
}
