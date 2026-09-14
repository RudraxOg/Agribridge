export function formatINR(paise: number | bigint, locale = "en-IN") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(paise) / 100);
}
