import { getRequestConfig } from "next-intl/server";
import { getMessages } from "@/lib/i18n/request";
import { defaultLocale, isLocale } from "@/lib/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;
  return { locale, messages: await getMessages(locale), timeZone: "Asia/Kolkata" };
});
