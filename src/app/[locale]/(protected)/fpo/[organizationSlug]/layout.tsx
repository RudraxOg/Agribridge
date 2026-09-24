import { AppShell } from "@/components/shell/app-shell";
import { redirect } from "next/navigation";
import { requireOrganizationMember } from "@/lib/auth/require-organization-member";
import { requireLocale } from "@/lib/i18n/locale";
import type { NavItem } from "@/components/shell/desktop-sidebar";

export default async function FpoOrganizationLayout({children,params}:LayoutProps<"/[locale]/fpo/[organizationSlug]">){
  const {locale:raw,organizationSlug}=await params;
  const locale=requireLocale(raw);
  const access=await requireOrganizationMember(locale,organizationSlug);
  const organization=access.organization;
  if(!organization||organization.type!=="fpo")redirect(`/${locale}/access-denied?reason=organization`);
  const base=`/fpo/${organizationSlug}`;
  const items:NavItem[]=[];
  if(access.permissions.has("lots.read"))items.push({label:"Dashboard",path:`${base}/dashboard`,icon:"overview"},{label:"Stock",path:`${base}/stock`,icon:"stock"},{label:"Forecast",path:`${base}/forecast`,icon:"forecast"});
  if(access.permissions.has("farmers.read"))items.splice(1,0,{label:"Farmers",path:`${base}/farmers`,icon:"farmers"},{label:"Crop calendar",path:`${base}/crop-calendar`,icon:"crop-calendar"});
  if(access.permissions.has("orders.read"))items.push({label:"Orders",path:`${base}/orders`,icon:"orders"});
  if(access.permissions.has("shipments.read"))items.push({label:"Logistics",path:`${base}/logistics`,icon:"logistics"});
  if(access.permissions.has("settlements.read"))items.push({label:"Settlements",path:`${base}/settlements`,icon:"payments"});
  return <AppShell locale={locale} role="fpo" items={items} organization={organization.name}>{children}</AppShell>;
}
