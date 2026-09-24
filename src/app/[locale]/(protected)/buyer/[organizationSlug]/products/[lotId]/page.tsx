import { ProductContent } from "@/features/navigation/buyer-page-content";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationProduct({ params }: { params: Promise<{ locale: string; organizationSlug: string; lotId: string }> }) {
  const { locale: raw, organizationSlug, lotId } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "lots.read");
  return <ProductContent locale={locale} lotId={lotId} basePath={`/buyer/${organizationSlug}`} />;
}
