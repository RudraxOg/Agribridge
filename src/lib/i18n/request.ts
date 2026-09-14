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
  return { ...english, ...localized, nav: { ...english.nav, ...localized.nav }, actions: { ...english.actions, ...localized.actions }, status: { ...english.status, ...localized.status }, errors: { ...english.errors, ...localized.errors } };
}
