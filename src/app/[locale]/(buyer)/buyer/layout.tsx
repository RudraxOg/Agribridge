import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { requireLocale } from "@/lib/i18n/locale";

export default async function BuyerLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const role = (await cookies()).get("agribridge_demo_role")?.value;
  if (role !== "buyer" && process.env.INTEGRATION_MODE !== "mock") redirect(`/${locale}/login`);
  const items = [
    { label: "Marketplace", path: "/buyer/marketplace", icon: "marketplace" as const }, { label: "Orders", path: "/buyer/orders", icon: "orders" as const },
    { label: "Logistics", path: "/shipments/AB-260914-1072", icon: "logistics" as const }, { label: "Payments", path: "/buyer/payments", icon: "payments" as const },
  ];
  return <AppShell locale={locale} role="buyer" items={items}>{children}</AppShell>;
}
