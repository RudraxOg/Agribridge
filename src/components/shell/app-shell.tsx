import type { Locale } from "@/lib/i18n/routing";
import { AppHeader } from "./app-header";
import { DesktopSidebar, type NavItem } from "./desktop-sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";

export function AppShell({ children, locale, role, items }: { children: React.ReactNode; locale: Locale; role: "fpo" | "buyer"; items: NavItem[] }) {
  return <div className="flex min-h-dvh"><DesktopSidebar locale={locale} items={items} organization={role === "fpo" ? "Awadh Pragati FPC" : "Lucknow Fresh Mart"} /><div className="min-w-0 flex-1"><AppHeader locale={locale} role={role} /><main id="main-content" className="mx-auto w-full max-w-[1440px] px-4 py-6 pb-24 md:px-6 md:py-8 lg:px-8 lg:pb-10">{children}</main></div><MobileBottomNav locale={locale} items={items} /></div>;
}
