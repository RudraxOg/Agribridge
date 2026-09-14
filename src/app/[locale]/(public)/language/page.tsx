import Link from "next/link";
import { ArrowRight, Languages } from "lucide-react";
import { Card } from "@/components/ui/card";
import { localeNames, locales } from "@/lib/i18n/routing";
export default function LanguagePage() { return <main id="main-content" className="mx-auto min-h-dvh max-w-4xl px-4 py-12"><Languages className="text-[var(--field)]" size={40} aria-hidden /><h1 className="mt-5 text-4xl font-black">Choose your language</h1><p className="mt-2 text-[var(--text-muted)]">You can change this anytime. English fills any translation gaps.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{locales.map((locale) => <Link key={locale} href={`/${locale}`}><Card className="flex min-h-16 items-center justify-between px-5 font-bold transition hover:border-[var(--field)] hover:bg-[var(--surface-muted)]">{localeNames[locale]}<ArrowRight aria-hidden size={18} /></Card></Link>)}</div></main>; }
