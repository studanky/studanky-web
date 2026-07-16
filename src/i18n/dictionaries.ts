import type { Locale } from "./config";
import { legalExternalLinks } from "@/config/legal";

import type {
  Dictionary,
  DictionaryCatalog,
  LegalExternalLinkId,
} from "./dictionary";

const legalExternalLinkIds = new Set(Object.keys(legalExternalLinks));

function isLegalExternalLinkId(id: string): id is LegalExternalLinkId {
  return legalExternalLinkIds.has(id);
}

function normalizeDictionary(catalog: DictionaryCatalog): Dictionary {
  for (const [documentId, document] of Object.entries(catalog.legal.documents)) {
    for (const section of document.sections) {
      for (const link of section.links ?? []) {
        if (!isLegalExternalLinkId(link.id)) {
          throw new Error(
            `Unknown legal external link "${link.id}" in ${documentId}.`,
          );
        }
      }
    }
  }

  return catalog as Dictionary;
}

/**
 * Lazily loads a translation catalog for the given locale. Catalogs are plain
 * JSON so they can later be handed to a translation-management system; the cast
 * is validated at compile time by `messages/validate.ts`.
 *
 * Because this only runs in Server Components, the JSON never reaches the client
 * bundle — only the rendered HTML does.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  cs: () =>
    import("../../messages/cs.json").then((m) =>
      normalizeDictionary(m.default as DictionaryCatalog),
    ),
  en: () =>
    import("../../messages/en.json").then((m) =>
      normalizeDictionary(m.default as DictionaryCatalog),
    ),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
