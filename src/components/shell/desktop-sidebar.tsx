"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, CalendarDays, CircleHelp, IndianRupee, LayoutDashboard, ShoppingBasket, Sprout, Truck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = { overview: LayoutDashboard, farmers: Users, "crop-calendar": CalendarDays, stock: Boxes, orders: ShoppingBasket, logistics: Truck, forecast: BarChart3, payments: IndianRupee, marketplace: Sprout, help: CircleHelp };

export type NavItem = { label: string; path: string; icon: keyof typeof icons };
export function DesktopSidebar({ locale, items, organization }: { locale: string; items: NavItem[]; organization: string }) {
  const pathname = usePathname();
  return <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--forest)] text-white lg:flex"><div className="field-lines grain p-6"><p className="text-xs font-bold tracking-[.18em] text-white/65">WORKSPACE</p><p className="mt-2 leading-snug font-extrabold">{organization}</p></div><nav className="grid gap-1 p-3" aria-label="Primary">{items.map((item) => { const Icon = icons[item.icon]; const href = `/${locale}${item.path}`; const active = pathname === href || pathname.startsWith(`${href}/`); return <Link key={item.path} href={href} aria-current={active ? "page" : undefined} className={cn("flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold text-white/75 transition-colors hover:bg-white/10 hover:text-white", active && "bg-white text-[var(--forest)] hover:bg-white hover:text-[var(--forest)]")}><Icon aria-hidden size={20} />{item.label}</Link>; })}</nav><div className="mt-auto border-t border-white/15 p-4"><Link href={`/${locale}/demo-role`} className="flex min-h-12 items-center rounded-xl px-3 text-sm font-bold text-white/80 hover:bg-white/10">Switch demo role</Link></div></aside>;
}
