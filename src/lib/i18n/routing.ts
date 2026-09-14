export const locales = ["en", "hi", "mr", "pa", "bn", "gu", "te", "ta", "kn", "or"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeNames: Record<Locale, string> = { en: "English", hi: "हिन्दी", mr: "मराठी", pa: "ਪੰਜਾਬੀ", bn: "বাংলা", gu: "ગુજરાતી", te: "తెలుగు", ta: "தமிழ்", kn: "ಕನ್ನಡ", or: "ଓଡ଼ିଆ" };
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
