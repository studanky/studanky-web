import type { Locale } from "./config";
import type { Dictionary } from "./dictionary";

/**
 * Lazily loads a translation catalog for the given locale. Catalogs are plain
 * JSON so they can later be handed to a translation-management system; the cast
 * is validated at compile time by `messages/validate.ts`.
 *
 * Because this only runs in Server Components, the JSON never reaches the client
 * bundle — only the rendered HTML does.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  cs: () => import("../../messages/cs.json").then((m) => m.default as Dictionary),
  en: () => import("../../messages/en.json").then((m) => m.default as Dictionary),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
