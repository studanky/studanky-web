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
 * Locale-independent document facts, shown in every locale's header.
 * `effectiveDate` is an ISO `YYYY-MM-DD` date localized at render time.
 * Bump `version` and `effectiveDate` together on every change.
 */
export const legalDocumentMeta = {
  privacy: { version: "1.0", effectiveDate: "2026-07-17" },
  terms: { version: "1.0", effectiveDate: "2026-07-17" },
  dataSources: { version: "1.0", effectiveDate: "2026-07-17" },
  contact: { version: "1.0", effectiveDate: "2026-07-17" },
} as const satisfies Record<LegalDocumentId, { version: string; effectiveDate: string }>;

/**
 * Consent version stored with every newsletter subscription. Lives next to
 * `legalDocumentMeta` so a privacy-policy change and the consent tag get
 * bumped in one place — update it whenever `legalDocumentMeta.privacy` changes.
 */
export const privacyConsentVersion = "2026-07-17";

export const legalExternalLinks = {
  chmiGroundwaterNowData:
    "https://opendata.chmi.cz/hydrology/groundwater/now/data/",
  chmiGroundwaterNowMetadata:
    "https://opendata.chmi.cz/hydrology/groundwater/now/metadata/",
  cloudflarePrivacy: "https://www.cloudflare.com/privacypolicy/",
  creativeCommonsBy40: "https://creativecommons.org/licenses/by/4.0/",
  mapyAttribution: "https://developer.mapy.com/rest-api-mapy-cz/atribution/",
  mapyCopyright: "https://api.mapy.com/copyright",
  mapyHome: "https://mapy.com/",
  mapyPrivacy: "https://o-seznam.cz/pravni-informace/ochrana-udaju/mapy-com/",
  uoou: "https://www.uoou.cz/",
  coi: "https://www.coi.cz/",
} as const satisfies Record<LegalExternalLinkId, string>;
