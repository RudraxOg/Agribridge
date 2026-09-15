import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/request";

export default async function FpoLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const messages = await getMessages(locale);
  const role = (await cookies()).get("agribridge_demo_role")?.value;
  if (role !== "fpo" && process.env.INTEGRATION_MODE !== "mock") redirect(`/${locale}/login`);
  const items = [
    { label: messages.nav.overview, path: "/fpo/overview", icon: "overview" as const }, { label: messages.nav.farmers, path: "/fpo/farmers", icon: "farmers" as const },
    { label: "Crop calendar", path: "/fpo/crop-calendar", icon: "crop-calendar" as const }, { label: messages.nav.stock, path: "/fpo/stock", icon: "stock" as const },
    { label: messages.nav.orders, path: "/fpo/orders", icon: "orders" as const }, { label: messages.nav.logistics, path: "/fpo/logistics", icon: "logistics" as const },
    { label: messages.nav.forecast, path: "/fpo/forecast", icon: "forecast" as const }, { label: messages.nav.payments, path: "/fpo/payments", icon: "payments" as const },
  ];
  return <AppShell locale={locale} role="fpo" items={items}>{children}</AppShell>;
}
