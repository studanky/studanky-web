import "server-only";

import { cache } from "react";

import { canonicalLanguageTag, defaultLocale } from "@/i18n/config";

// Data access for the public Strapi "share/preview" endpoint that backs the
// `/s/{documentId}` deep-link fallback (and, later, `/r/{documentId}`).
//
//   GET {STRAPI_API_BASE}/springs/:documentId/preview?locale=en-AU
//
// The endpoint returns a deliberately minimal, teaser-level payload (name,
// coordinates, description, photo, current flow status + when it was updated).
// It withholds flow strength, water quality and report history — those stay
// app-only. See docs/strapi-integrations.md for the contract.

const STRAPI_API_BASE = process.env.STRAPI_API_BASE;

// How long a fetched spring stays in Next's Data Cache. Preview crawlers hit
// these URLs repeatedly, so caching protects Strapi and cuts latency.
const REVALIDATE_SECONDS = 300;
const FETCH_TIMEOUT_MS = 5000;

// Strapi v5 documentIds are alphanumeric. Anything else is treated as unknown so
// untrusted path input never reaches a network call or the markup unvalidated.
const DOCUMENT_ID_RE = /^[A-Za-z0-9]{1,255}$/;

export type SpringStatus = "is_flowing" | "is_not_flowing" | "unknown";

export type SpringPhoto = {
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  thumbnailUrl: string | null;
};

export type SpringPreview = {
  documentId: string;
  /**
   * Locale actually served by Strapi after its whole-document fallback, or
   * `null` when Strapi omits it or returns an invalid value.
   */
  locale: string | null;
  name: string;
  latitude: number;
  longitude: number;
  currentStatus: SpringStatus;
  statusUpdatedAt: string | null;
  description: string | null;
  photo: SpringPhoto | null;
};

/**
 * Discriminated result so the page can tell three cases apart:
 * - `ok`        → render the spring preview,
 * - `not_found` → unknown / deleted / malformed id → the "spring not found" page,
 * - `error`     → Strapi unreachable / misconfigured → generic fallback (never crash).
 */
export type SpringPreviewResult =
  | { status: "ok"; spring: SpringPreview }
  | { status: "not_found" }
  | { status: "error" };

export function isValidDocumentId(id: string | undefined): id is string {
  return typeof id === "string" && DOCUMENT_ID_RE.test(id);
}

/** Ensures an absolute `http(s)` URL; rejects `javascript:`/`data:`/relative junk. */
function safeAbsoluteUrl(value: unknown, base: string | undefined): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    const url = new URL(value, base);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function toStatus(value: unknown): SpringStatus {
  return value === "is_flowing" || value === "is_not_flowing" ? value : "unknown";
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizePhoto(raw: unknown, strapiOrigin: string | undefined): SpringPhoto | null {
  if (!raw || typeof raw !== "object") return null;
  const photo = raw as Record<string, unknown>;
  const url = safeAbsoluteUrl(photo.url, strapiOrigin);
  if (!url) return null; // a photo with no usable URL is treated as "no photo".
  return {
    url,
    alternativeText: toNullableString(photo.alternativeText),
    width: toNullableNumber(photo.width),
    height: toNullableNumber(photo.height),
    thumbnailUrl: safeAbsoluteUrl(photo.thumbnail_url, strapiOrigin),
  };
}

function responseMetadata(
  data: Record<string, unknown>,
  requestedDocumentId: string,
): Pick<SpringPreview, "documentId" | "locale"> {
  const issues: string[] = [];
  const responseDocumentId = toNullableString(data.documentId);
  const responseLocale = toNullableString(data.locale);
  const locale = responseLocale ? canonicalLanguageTag(responseLocale) : null;

  if (responseDocumentId !== requestedDocumentId) {
    issues.push(responseDocumentId === null ? "missing documentId" : "unexpected documentId");
  }
  if (!locale) issues.push("missing or invalid locale");

  if (issues.length > 0) {
    console.warn(
      `Spring preview metadata fallback for ${requestedDocumentId}: ${issues.join("; ")}.`,
    );
  }

  return {
    documentId: requestedDocumentId,
    locale,
  };
}

function normalize(
  data: Record<string, unknown>,
  strapiOrigin: string,
  requestedDocumentId: string,
): SpringPreview | null {
  const name = toNullableString(data.name);
  const latitude = toNullableNumber(data.lat);
  const longitude = toNullableNumber(data.lng);
  // Only fields required to render a useful preview make the whole payload fail.
  if (name === null || latitude === null || longitude === null) return null;

  return {
    ...responseMetadata(data, requestedDocumentId),
    name,
    latitude,
    longitude,
    currentStatus: toStatus(data.current_status),
    statusUpdatedAt: toNullableString(data.status_updated_at),
    description: toNullableString(data.description),
    photo: normalizePhoto(data.photo, strapiOrigin),
  };
}

function previewRequest(
  documentId: string,
  requestedLanguageTag: string,
): { url: string; strapiOrigin: string } | null {
  if (!STRAPI_API_BASE) return null;

  const canonicalRequestedLanguageTag = canonicalLanguageTag(requestedLanguageTag);
  const effectiveLanguageTag = canonicalRequestedLanguageTag ?? defaultLocale;
  if (!canonicalRequestedLanguageTag) {
    const loggedLanguageTag = JSON.stringify(requestedLanguageTag.slice(0, 64));
    console.warn(
      `Invalid Spring preview language tag ${loggedLanguageTag} for ${documentId}; using the default locale ${defaultLocale}.`,
    );
  }

  try {
    // STRAPI_API_BASE includes `/api`. Keep a trailing slash so URL resolution
    // appends the endpoint instead of replacing that path segment.
    const apiBase = new URL(
      STRAPI_API_BASE.endsWith("/") ? STRAPI_API_BASE : `${STRAPI_API_BASE}/`,
    );
    const url = new URL(`springs/${encodeURIComponent(documentId)}/preview`, apiBase);
    url.searchParams.set("locale", effectiveLanguageTag);
    return {
      url: url.toString(),
      strapiOrigin: apiBase.origin,
    };
  } catch {
    return null;
  }
}

async function fetchSpringPreviewUncached(
  documentId: string | undefined,
  requestedLanguageTag: string,
): Promise<SpringPreviewResult> {
  if (!isValidDocumentId(documentId)) return { status: "not_found" };
  const request = previewRequest(documentId, requestedLanguageTag);
  if (!request) {
    console.error("STRAPI_API_BASE is missing or invalid — cannot fetch spring preview.");
    return { status: "error" };
  }

  try {
    const response = await fetch(request.url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (response.status === 404) return { status: "not_found" };
    if (!response.ok) {
      console.error(`Spring preview fetch failed: ${response.status} for ${documentId}`);
      return { status: "error" };
    }

    const body = (await response.json()) as { data?: Record<string, unknown> | null };
    if (!body?.data) return { status: "not_found" };

    const spring = normalize(body.data, request.strapiOrigin, documentId);
    if (!spring) {
      console.error(`Spring preview payload was malformed for ${documentId}`);
      return { status: "error" };
    }
    return { status: "ok", spring };
  } catch (error) {
    console.error("Spring preview fetch threw:", error);
    return { status: "error" };
  }
}

/**
 * Fetches the share/preview payload for a spring.
 *
 * React's request-scoped cache shares the complete loader—including response
 * parsing, normalization, and diagnostics—between `generateMetadata` and the
 * page render. The underlying request retains its timeout and five-minute Data
 * Cache policy. Never throws, so callers receive a discriminated result for
 * each renderable outcome.
 */
export const fetchSpringPreview = cache(fetchSpringPreviewUncached);

/** `"50.18000, 17.05000"` — a decimal pair that pastes into any map's search. */
export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}
