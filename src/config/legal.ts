import type { Locale } from "@/i18n/config";
import type { LegalDocumentId, LegalExternalLinkId } from "@/i18n/dictionary";

export const legalRoutes = [
  {
    id: "privacy",
    path: "/privacy-policy",
  },
  {
    id: "terms",
    path: "/terms-of-use",
  },
  {
    id: "dataSources",
    path: "/data-sources",
  },
  {
    id: "contact",
    path: "/contact",
  },
] as const satisfies readonly { id: LegalDocumentId; path: string }[];

export const legalRouteById = Object.fromEntries(
  legalRoutes.map((route) => [route.id, route]),
) as Record<LegalDocumentId, (typeof legalRoutes)[number]>;

export function localizedLegalPath(locale: Locale, id: LegalDocumentId): string {
  return `/${locale}${legalRouteById[id].path}`;
}

/**
 * Locale-independent document facts, shown in every locale's header. Once the
 * documents take effect, `effectiveDate` holds an ISO `YYYY-MM-DD` date that is
 * localized at render time; until then the bracketed placeholder renders
 * verbatim. Bump `version` and `effectiveDate` together on every change.
 */
export const legalDocumentMeta = {
  privacy: { version: "1.0", effectiveDate: "[EFFECTIVE DATE]" },
  terms: { version: "1.0", effectiveDate: "[EFFECTIVE DATE]" },
  dataSources: { version: "1.0", effectiveDate: "[EFFECTIVE DATE]" },
  contact: { version: "1.0", effectiveDate: "[EFFECTIVE DATE]" },
} as const satisfies Record<LegalDocumentId, { version: string; effectiveDate: string }>;

/**
 * Consent version stored with every newsletter subscription. Lives next to
 * `legalDocumentMeta` so a privacy-policy change and the consent tag get
 * bumped in one place — update it whenever `legalDocumentMeta.privacy` changes.
 */
export const privacyConsentVersion = "2026-07-10";

export const legalExternalLinks = {
  chmiGroundwaterNowData:
    "https://opendata.chmi.cz/hydrology/groundwater/now/data/",
  chmiGroundwaterNowMetadata:
    "https://opendata.chmi.cz/hydrology/groundwater/now/metadata/",
  creativeCommonsBy40: "https://creativecommons.org/licenses/by/4.0/",
  mapyAttribution: "https://developer.mapy.com/rest-api-mapy-cz/atribution/",
  mapyCopyright: "https://api.mapy.com/copyright",
  mapyHome: "https://mapy.com/",
  mapyPrivacy: "https://o-seznam.cz/pravni-informace/ochrana-udaju/mapy-com/",
  uoou: "https://www.uoou.cz/",
  coi: "https://www.coi.cz/",
} as const satisfies Record<LegalExternalLinkId, string>;
