import Link from "next/link";
import { Bell, Leaf, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";
import { ReadAloudButton } from "@/components/accessibility/read-aloud-button";
import { VoiceCommandButton } from "@/components/accessibility/voice-command-button";
import { LargeTextToggle } from "@/components/accessibility/large-text-toggle";
import { SyncIndicator } from "@/components/shared/sync-indicator";

export function AppHeader({ locale, role }: { locale: Locale; role: "fpo" | "buyer" }) {
  return <header className="sticky top-0 z-40 flex min-h-18 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--canvas)]/95 px-4 backdrop-blur md:px-6">
    <Link href={`/${locale}`} className="flex min-h-12 items-center gap-2 font-extrabold text-[var(--forest)]"><span className="grid size-10 place-items-center rounded-xl bg-[var(--forest)] text-white"><Leaf aria-hidden size={22} /></span><span className="hidden sm:inline">AgriBridge</span></Link>
    <div className="hidden items-center gap-2 lg:flex"><ShieldCheck aria-hidden size={17} className="text-[var(--field)]" /><span className="text-xs font-bold">{role === "fpo" ? "FPO operator workspace" : "Verified bulk buyer"}</span><SyncIndicator /></div>
    <div className="flex items-center gap-1"><LargeTextToggle /><VoiceCommandButton /><ReadAloudButton text="AgriBridge dashboard. Use the navigation to manage your work." /><Link aria-label="Notifications" className="grid size-12 place-items-center rounded-xl text-[var(--forest)] hover:bg-[var(--surface-muted)]" href={`/${locale}/notifications`}><Bell aria-hidden size={20} /></Link><LanguageSwitcher locale={locale} /></div>
  </header>;
}
