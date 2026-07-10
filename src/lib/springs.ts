import "server-only";

import type { Locale } from "@/i18n/config";

// Data access for the public Strapi "share/preview" endpoint that backs the
// `/s/{documentId}` deep-link fallback (and, later, `/r/{documentId}`).
//
//   GET {STRAPI_API_BASE}/springs/:documentId/preview?locale=cs
//
// The endpoint returns a deliberately minimal, teaser-level payload (name,
// coordinates, description, photo, current flow status + when it was updated).
// It withholds flow strength, water quality and report history — those stay
// app-only. See docs/strapi-share-endpoint.md for the contract.

const STRAPI_API_BASE = process.env.STRAPI_API_BASE;

// How long a fetched spring stays in Next's Data Cache. Preview crawlers hit
// these URLs repeatedly, so caching protects Strapi and cuts latency (spec C.4).
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

function normalize(data: Record<string, unknown>, strapiOrigin: string | undefined): SpringPreview | null {
  const name = toNullableString(data.name);
  const latitude = toNullableNumber(data.lat);
  const longitude = toNullableNumber(data.lng);
  // name/lat/lng/current_status are required per the contract; bail if malformed.
  if (name === null || latitude === null || longitude === null) return null;

  return {
    documentId: toNullableString(data.documentId) ?? "",
    name,
    latitude,
    longitude,
    currentStatus: toStatus(data.current_status),
    statusUpdatedAt: toNullableString(data.status_updated_at),
    description: toNullableString(data.description),
    photo: normalizePhoto(data.photo, strapiOrigin),
  };
}

/**
 * Fetches the share/preview payload for a spring. Never throws — resolves to a
 * discriminated result so callers can render the right page for every case.
 */
export async function fetchSpringPreview(
  documentId: string | undefined,
  locale: Locale,
): Promise<SpringPreviewResult> {
  if (!isValidDocumentId(documentId)) return { status: "not_found" };
  if (!STRAPI_API_BASE) {
    console.error("STRAPI_API_BASE is not set — cannot fetch spring preview.");
    return { status: "error" };
  }

  const strapiOrigin = (() => {
    try {
      return new URL(STRAPI_API_BASE).origin;
    } catch {
      return undefined;
    }
  })();

  const url = `${STRAPI_API_BASE}/springs/${encodeURIComponent(documentId)}/preview?locale=${encodeURIComponent(locale)}`;

  try {
    const response = await fetch(url, {
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

    const spring = normalize(body.data, strapiOrigin);
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

/** `"50.18000, 17.05000"` — a decimal pair that pastes into any map's search. */
export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}
