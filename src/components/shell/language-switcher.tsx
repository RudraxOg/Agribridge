"use client";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n/routing";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  function change(next: string) {
    document.cookie = `agribridge_locale=${next};path=/;max-age=31536000;samesite=lax`;
    const parts = pathname.split("/"); parts[1] = next;
    router.push(parts.join("/") || `/${next}`);
  }
  return <label className="relative inline-flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-sm font-bold"><Languages aria-hidden size={18} /><span className="sr-only">Language</span><select aria-label="Language" value={locale} onChange={(event) => change(event.target.value)} className="cursor-pointer bg-transparent outline-none">{locales.map((code) => <option key={code} value={code}>{localeNames[code]}</option>)}</select></label>;
}
