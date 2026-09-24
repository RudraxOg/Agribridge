import CropCalendarPage from "@/app/[locale]/(fpo)/fpo/crop-calendar/page";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationCropCalendar({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  const { locale: raw, organizationSlug } = await params;
  const locale = requireLocale(raw);
  await requirePermission(locale, organizationSlug, "farmers.read");
  return <CropCalendarPage />;
}
