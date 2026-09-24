import { redirect } from "next/navigation";
import { getAccessContext } from "@/lib/authorization/access";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const access = await getAccessContext();
  redirect(access?.organization ? `/${locale}/fpo/${access.organization.slug}/dashboard` : `/${locale}/organizations`);
}
