import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/request";

export default async function BuyerLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const messages = await getMessages(locale);
  const role = (await cookies()).get("agribridge_demo_role")?.value;
  if (role !== "buyer" && process.env.INTEGRATION_MODE !== "mock") redirect(`/${locale}/login`);
  const items = [
    { label: messages.nav.marketplace, path: "/buyer/marketplace", icon: "marketplace" as const }, { label: messages.nav.orders, path: "/buyer/orders", icon: "orders" as const },
    { label: messages.nav.logistics, path: "/shipments/AB-260914-1072", icon: "logistics" as const }, { label: messages.nav.payments, path: "/buyer/payments", icon: "payments" as const },
  ];
  return <AppShell locale={locale} role="buyer" items={items}>{children}</AppShell>;
}
