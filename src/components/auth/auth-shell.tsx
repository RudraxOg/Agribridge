import Link from "next/link";
import { ShieldCheck, Sprout } from "lucide-react";
import type { Locale } from "@/lib/i18n/routing";
import { LanguageSwitcher } from "@/components/shell/language-switcher";

export function AuthShell({ locale, eyebrow, title, description, children }: { locale: Locale; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main id="main-content" className="grid min-h-dvh lg:grid-cols-[.9fr_1.1fr]">
    <section className="field-lines grain hidden bg-[var(--forest-deep)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <Link href={`/${locale}`} className="flex min-h-12 items-center gap-2 text-xl font-black"><span className="grid size-11 place-items-center rounded-xl bg-white/10"><Sprout aria-hidden /></span>AgriBridge</Link>
      <div><p className="text-xs font-black tracking-[.18em] text-white/65 uppercase">Secure farm commerce</p><h2 className="mt-4 max-w-lg text-5xl leading-[1.05] font-black">One accountable workspace from harvest to settlement.</h2><div className="mt-8 flex max-w-md gap-3 rounded-2xl border border-white/15 bg-white/8 p-4 text-sm text-white/75"><ShieldCheck className="mt-0.5 shrink-0" aria-hidden /><p>Roles are verified on the server and enforced again by database row-level security.</p></div></div>
      <p className="text-sm text-white/55">Demo mode never processes real identity, bank, biometric, or payment credentials.</p>
    </section>
    <section className="relative grid place-items-center px-4 py-20 md:px-8"><div className="absolute top-4 right-4"><LanguageSwitcher locale={locale} /></div><div className="w-full max-w-lg"><Link href={`/${locale}`} className="mb-8 inline-flex min-h-12 items-center gap-2 font-black text-[var(--forest)] lg:hidden"><Sprout aria-hidden />AgriBridge</Link><p className="text-xs font-black tracking-[.16em] text-[var(--field)] uppercase">{eyebrow}</p><h1 className="mt-2 text-3xl leading-tight font-black tracking-tight md:text-4xl">{title}</h1><p className="mt-3 text-[var(--text-muted)]">{description}</p><div className="mt-7">{children}</div></div></section>
  </main>;
}
