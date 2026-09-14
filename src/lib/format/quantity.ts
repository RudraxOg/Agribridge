export function formatQuantity(value: number, unit: "kg" | "quintal" | "tonne", locale = "en-IN") {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)} ${unit}`;
}
