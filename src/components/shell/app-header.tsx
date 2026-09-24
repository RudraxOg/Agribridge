import Link from "next/link";
import { Bell, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";
import { ReadAloudButton } from "@/components/accessibility/read-aloud-button";
import { VoiceCommandButton } from "@/components/accessibility/voice-command-button";
import { LargeTextToggle } from "@/components/accessibility/large-text-toggle";
import { SyncIndicator } from "@/components/shared/sync-indicator";
import { BrandLogo } from "@/components/shared/brand-logo";
import { AndroidAppDownloadButton } from "@/components/downloads/android-app-download-button";

export function AppHeader({
  locale,
  role,
}: {
  locale: Locale;
  role: "fpo" | "buyer";
}) {
  return (
    <header className="sticky top-0 z-40 flex min-h-18 items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--canvas)]/95 px-3 backdrop-blur md:gap-3 md:px-6">
      <Link
        href={`/${locale}`}
        aria-label="AgriBridge home"
        className="flex min-h-12 min-w-0 items-center"
      >
        <BrandLogo className="max-w-[7.75rem] sm:max-w-[11.5rem] lg:max-w-[13rem]" />
      </Link>
      <div className="hidden items-center gap-2 lg:flex">
        <ShieldCheck aria-hidden size={17} className="text-[var(--field)]" />
        <span className="text-xs font-bold">
          {role === "fpo" ? "FPO operator workspace" : "Verified bulk buyer"}
        </span>
        <SyncIndicator />
      </div>
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <span className="hidden sm:contents">
          <AndroidAppDownloadButton />
        </span>
        <span className="sm:hidden">
          <AndroidAppDownloadButton iconOnly />
        </span>
        <LargeTextToggle />
        <span className="hidden min-[420px]:contents">
          <VoiceCommandButton />
        </span>
        <span className="hidden sm:contents">
          <ReadAloudButton text="AgriBridge dashboard. Use the navigation to manage your work." />
        </span>
        <Link
          aria-label="Notifications"
          className="hidden size-12 place-items-center rounded-xl text-[var(--forest)] hover:bg-[var(--surface-muted)] min-[380px]:grid"
          href={`/${locale}/notifications`}
        >
          <Bell aria-hidden size={20} />
        </Link>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
