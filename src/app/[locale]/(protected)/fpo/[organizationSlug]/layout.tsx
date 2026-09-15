import { AppShell } from "@/components/shell/app-shell";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireLocale } from "@/lib/i18n/locale";
export default async function FpoOrganizationLayout({children,params}:LayoutProps<"/[locale]/fpo/[organizationSlug]">){const {locale:raw,organizationSlug}=await params;const locale=requireLocale(raw);await requirePermission(locale,organizationSlug,"lots.read");const items=[{label:"Dashboard",path:`/fpo/${organizationSlug}/dashboard`,icon:"overview" as const},{label:"Stock",path:"/fpo/stock",icon:"stock" as const},{label:"Orders",path:"/fpo/orders",icon:"orders" as const},{label:"Forecast",path:"/fpo/forecast",icon:"forecast" as const}];return <AppShell locale={locale} role="fpo" items={items}>{children}</AppShell>}
