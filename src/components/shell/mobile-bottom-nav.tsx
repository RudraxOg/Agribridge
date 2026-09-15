"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, IndianRupee, LayoutDashboard, ShoppingBasket, Sprout, Truck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./desktop-sidebar";
const icons = { overview: LayoutDashboard, farmers: Users, stock: Boxes, orders: ShoppingBasket, marketplace: Sprout, logistics: Truck, payments: IndianRupee };
export function MobileBottomNav({ locale, items }: { locale: string; items: NavItem[] }) { const pathname = usePathname(); return <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-[var(--border)] bg-white px-2 pb-[max(.35rem,env(safe-area-inset-bottom))] lg:hidden" aria-label="Mobile primary">{items.slice(0, 4).map((item) => { const Icon = icons[item.icon as keyof typeof icons] ?? LayoutDashboard; const href = `/${locale}${item.path}`; const active = pathname === href || pathname.startsWith(`${href}/`); return <Link key={item.path} href={href} aria-current={active ? "page" : undefined} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold text-[var(--text-muted)]", active && "text-[var(--forest)]")}><Icon aria-hidden size={21} />{item.label}</Link>; })}</nav>; }
