import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n/routing";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { BrandLogo } from "@/components/shared/brand-logo";
import { AndroidAppDownloadButton } from "@/components/downloads/android-app-download-button";

export function AuthShell({
  locale,
  eyebrow,
  title,
  description,
  children,
  logoSize = "default",
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  logoSize?: "default" | "large";
}) {
  const logoClass =
    logoSize === "large" ? "max-w-[19rem] md:max-w-[22rem]" : "max-w-[14rem]";
  const mobileLogoClass =
    logoSize === "large" ? "max-w-[18rem]" : "max-w-[13rem]";
  return (
    <main
      id="main-content"
      className="grid min-h-dvh lg:grid-cols-[.9fr_1.1fr]"
    >
      <section className="field-lines grain hidden bg-[var(--forest-deep)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link
          href={`/${locale}`}
          aria-label="AgriBridge home"
          className="flex min-h-12 items-center"
        >
          <BrandLogo onDark className={logoClass} />
        </Link>
        <div>
          <p className="text-xs font-black tracking-[.18em] text-white/65 uppercase">
            Secure farm commerce
          </p>
          <h2 className="mt-4 max-w-lg text-5xl leading-[1.05] font-black">
            One accountable workspace from harvest to settlement.
          </h2>
          <div className="mt-8 flex max-w-md gap-3 rounded-2xl border border-white/15 bg-white/8 p-4 text-sm text-white/75">
            <ShieldCheck className="mt-0.5 shrink-0" aria-hidden />
            <p>
              Roles are verified on the server and enforced again by database
              row-level security.
            </p>
          </div>
        </div>
        <p className="text-sm text-white/55">
          Demo mode never processes real bank or payment credentials.
        </p>
      </section>
      <section className="relative grid place-items-center px-4 py-20 md:px-8">
        <div className="absolute top-4 right-4 flex gap-2">
          <AndroidAppDownloadButton iconOnly />
          <LanguageSwitcher locale={locale} />
        </div>
        <div className="w-full max-w-lg">
          <Link
            href={`/${locale}`}
            aria-label="AgriBridge home"
            className="mb-8 inline-flex min-h-12 items-center"
          >
            <BrandLogo className={`${mobileLogoClass} lg:hidden`} />
          </Link>
          <p className="text-xs font-black tracking-[.16em] text-[var(--field)] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-black tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-[var(--text-muted)]">{description}</p>
          <div className="mt-7">{children}</div>
        </div>
      </section>
    </main>
  );
}
