import { BrandLogo } from "@/components/shared/brand-logo";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import type { Locale } from "@/lib/i18n/routing";

export function OnboardingShell({ locale, eyebrow, title, description, children }: { locale: Locale; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main id="main-content" className="relative min-h-dvh overflow-hidden bg-[var(--canvas)] px-4 py-5 md:px-8 md:py-8">
    <div aria-hidden className="absolute inset-x-0 top-0 h-[27rem] bg-[radial-gradient(ellipse_at_15%_20%,rgb(103_169_92_/_22%),transparent_54%),radial-gradient(ellipse_at_88%_0%,rgb(46_139_87_/_16%),transparent_42%)]" />
    <div className="relative mx-auto max-w-5xl"><header className="flex items-center justify-between"><BrandLogo className="max-w-[10rem]" /><LanguageSwitcher locale={locale} /></header><section className="mt-12 grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start"><div className="lg:pt-10"><p className="text-xs font-black tracking-[.16em] text-[var(--field)] uppercase">{eyebrow}</p><h1 className="mt-3 max-w-md text-4xl leading-[.98] font-black tracking-[-.045em] text-[var(--forest-deep)] md:text-5xl">{title}</h1><p className="mt-5 max-w-md text-base text-[var(--text-muted)]">{description}</p></div><div className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[var(--shadow-md)] backdrop-blur-sm md:p-8">{children}</div></section></div>
  </main>;
}
