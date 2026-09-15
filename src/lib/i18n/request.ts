import type { Locale } from "./routing";

const loaders = {
  en: () => import("../../../messages/en.json").then((m) => m.default), hi: () => import("../../../messages/hi.json").then((m) => m.default),
  mr: () => import("../../../messages/mr.json").then((m) => m.default), pa: () => import("../../../messages/pa.json").then((m) => m.default),
  bn: () => import("../../../messages/bn.json").then((m) => m.default), gu: () => import("../../../messages/gu.json").then((m) => m.default),
  te: () => import("../../../messages/te.json").then((m) => m.default), ta: () => import("../../../messages/ta.json").then((m) => m.default),
  kn: () => import("../../../messages/kn.json").then((m) => m.default), or: () => import("../../../messages/or.json").then((m) => m.default),
};

export async function getMessages(locale: Locale) {
  const english = await loaders.en();
  if (locale === "en") return english;
  const localized = await loaders[locale]();
  return deepMerge(english, localized);
}

/** Keep complete English copy available whenever a locale only translates a subset. */
type DeepPartial<T> = { [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K] };

function deepMerge<T extends Record<string, unknown>>(base: T, override: DeepPartial<T>): T {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key];
    if (isRecord(baseValue) && isRecord(value)) {
      result[key] = deepMerge(baseValue, value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
