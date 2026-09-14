import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { requireLocale } from "@/lib/i18n/locale";

export default async function FpoLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const role = (await cookies()).get("agribridge_demo_role")?.value;
  if (role !== "fpo" && process.env.INTEGRATION_MODE !== "mock") redirect(`/${locale}/login`);
  const items = [
    { label: "Overview", path: "/fpo/overview", icon: "overview" as const }, { label: "Farmers", path: "/fpo/farmers", icon: "farmers" as const },
    { label: "Crop calendar", path: "/fpo/crop-calendar", icon: "crop-calendar" as const }, { label: "Stock", path: "/fpo/stock", icon: "stock" as const },
    { label: "Orders", path: "/fpo/orders", icon: "orders" as const }, { label: "Logistics", path: "/fpo/logistics", icon: "logistics" as const },
    { label: "Forecast", path: "/fpo/forecast", icon: "forecast" as const }, { label: "Payments", path: "/fpo/payments", icon: "payments" as const },
  ];
  return <AppShell locale={locale} role="fpo" items={items}>{children}</AppShell>;
}
