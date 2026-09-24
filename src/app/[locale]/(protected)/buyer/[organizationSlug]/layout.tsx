import { AppShell } from "@/components/shell/app-shell";
import { redirect } from "next/navigation";
import { requireOrganizationMember } from "@/lib/auth/require-organization-member";
import { requireLocale } from "@/lib/i18n/locale";
import type { NavItem } from "@/components/shell/desktop-sidebar";

export default async function BuyerOrganizationLayout({children,params}:LayoutProps<"/[locale]/buyer/[organizationSlug]">){
  const {locale:raw,organizationSlug}=await params;
  const locale=requireLocale(raw);
  const access=await requireOrganizationMember(locale,organizationSlug);
  const organization=access.organization;
  if(!organization||organization.type!=="buyer")redirect(`/${locale}/access-denied?reason=organization`);
  const base=`/buyer/${organizationSlug}`;
  const items:NavItem[]=[];
  if(access.permissions.has("lots.read"))items.push({label:"Marketplace",path:`${base}/marketplace`,icon:"marketplace"});
  if(access.permissions.has("orders.read"))items.push({label:"Orders",path:`${base}/orders`,icon:"orders"});
  if(access.permissions.has("shipments.read"))items.push({label:"Logistics",path:"/shipments/AB-260914-1072",icon:"logistics"});
  if(access.permissions.has("settlements.read"))items.push({label:"Payments",path:`${base}/payments`,icon:"payments"});
  return <AppShell locale={locale} role="buyer" items={items} organization={organization.name}>{children}</AppShell>;
}
