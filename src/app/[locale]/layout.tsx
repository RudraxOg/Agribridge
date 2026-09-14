import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n/request";
import { isLocale, locales } from "@/lib/i18n/routing";
import { LocaleAttribute } from "@/components/shared/locale-attribute";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);
  return <NextIntlClientProvider locale={locale} messages={messages}><LocaleAttribute locale={locale}/><div lang={locale} data-locale={locale}>{children}</div></NextIntlClientProvider>;
}
