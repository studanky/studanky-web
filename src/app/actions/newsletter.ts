"use server";

import "server-only";

import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { headers } from "next/headers";
import { z } from "zod";

import { siteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";

export type NewsletterState = {
  status: "idle" | "success" | "invalid" | "error";
};

type NewsletterSource = "prelaunch-page" | "website-hero" | "website-footer";
type RateLimitWindow = {
  name: string;
  limit: number;
  windowMs: number;
};
type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const NEWSLETTER_SOURCE_REFS = {
  top: `${siteConfig.url}/#top`,
  roadmap: `${siteConfig.url}/#roadmap`,
  download: `${siteConfig.url}/#download`,
} as const;

type NewsletterSourceRef = (typeof NEWSLETTER_SOURCE_REFS)[keyof typeof NEWSLETTER_SOURCE_REFS];

const STRAPI_API_BASE = process.env.STRAPI_API_BASE;
const CONSENT_VERSION = "2026-07-10";
const FETCH_TIMEOUT_MS = 5000;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60_000;
const NEWSLETTER_SOURCES = new Set<NewsletterSource>([
  "prelaunch-page",
  "website-hero",
  "website-footer",
]);
const NEWSLETTER_SOURCE_REFS_BY_SOURCE: Record<NewsletterSource, ReadonlySet<NewsletterSourceRef>> = {
  "prelaunch-page": new Set([NEWSLETTER_SOURCE_REFS.roadmap]),
  "website-hero": new Set([NEWSLETTER_SOURCE_REFS.top]),
  "website-footer": new Set([NEWSLETTER_SOURCE_REFS.download]),
};
const IP_RATE_LIMITS: RateLimitWindow[] = [
  { name: "minute", limit: 5, windowMs: 60_000 },
  { name: "day", limit: 100, windowMs: 86_400_000 },
];
const rateLimitBuckets = new Map<string, RateLimitBucket>();
let lastRateLimitCleanupAt = 0;

const emailSchema = z.email();

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getLocale(formData: FormData): Locale | null {
  const locale = getString(formData, "locale");
  return isLocale(locale) ? locale : null;
}

function getSource(formData: FormData): NewsletterSource | null {
  const source = getString(formData, "source");
  return NEWSLETTER_SOURCES.has(source as NewsletterSource) ? (source as NewsletterSource) : null;
}

function newsletterEndpoint(): string | null {
  if (!STRAPI_API_BASE) return null;

  try {
    const base = STRAPI_API_BASE.endsWith("/") ? STRAPI_API_BASE : `${STRAPI_API_BASE}/`;
    return new URL("newsletter/subscribe", base).toString();
  } catch {
    return null;
  }
}

function getSourceRef(formData: FormData, source: NewsletterSource): NewsletterSourceRef | null {
  const sourceRef = getString(formData, "sourceRef");
  return NEWSLETTER_SOURCE_REFS_BY_SOURCE[source].has(sourceRef as NewsletterSourceRef)
    ? (sourceRef as NewsletterSourceRef)
    : null;
}

function stripQuotes(value: string): string {
  return value.replace(/^"|"$/g, "");
}

function normalizeIp(value: string | null | undefined): string | null {
  if (!value) return null;

  const candidate = stripQuotes(value.trim());
  if (isIP(candidate)) return candidate;

  const bracketedIpv6 = candidate.match(/^\[([^\]]+)](?::\d+)?$/);
  if (bracketedIpv6 && isIP(bracketedIpv6[1])) return bracketedIpv6[1];

  const ipv4WithPort = candidate.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/);
  if (ipv4WithPort && isIP(ipv4WithPort[1])) return ipv4WithPort[1];

  return null;
}

function forwardedHeaderIp(value: string | null): string | null {
  if (!value) return null;

  const firstEntry = value.split(",")[0];
  const forPart = firstEntry
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith("for="));

  return normalizeIp(forPart?.slice(4));
}

function clientIpFromHeaders(requestHeaders: Headers): string {
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];

  return (
    normalizeIp(requestHeaders.get("cf-connecting-ip")) ??
    normalizeIp(requestHeaders.get("x-real-ip")) ??
    normalizeIp(forwardedFor) ??
    forwardedHeaderIp(requestHeaders.get("forwarded")) ??
    "unknown"
  );
}

function hashedRateLimitKey(scope: string, value: string): string {
  const digest = createHash("sha256").update(value).digest("hex");
  return `${scope}:${digest}`;
}

function cleanupRateLimitBuckets(now: number): void {
  if (now - lastRateLimitCleanupAt < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;
  lastRateLimitCleanupAt = now;

  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
  }
}

function consumeRateLimit(key: string, window: RateLimitWindow, now: number): boolean {
  const bucketKey = `${key}:${window.name}`;
  const bucket = rateLimitBuckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(bucketKey, { count: 1, resetAt: now + window.windowMs });
    return true;
  }

  if (bucket.count >= window.limit) return false;
  bucket.count += 1;
  return true;
}

function isNewsletterRateLimited(requestHeaders: Headers): boolean {
  const now = Date.now();
  cleanupRateLimitBuckets(now);

  const ipKey = hashedRateLimitKey("newsletter-ip", clientIpFromHeaders(requestHeaders));
  return IP_RATE_LIMITS.some((window) => !consumeRateLimit(ipKey, window, now));
}

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot: humans never see the "website" field, bots fill everything.
  // Pretend success so scripts don't retry with the field left empty.
  if (formData.get("website")) return { status: "success" };

  const requestHeaders = await headers();
  if (isNewsletterRateLimited(requestHeaders)) return { status: "error" };

  const locale = getLocale(formData);
  const source = getSource(formData);
  if (getString(formData, "consent") !== "true" || !locale || !source) {
    return { status: "error" };
  }

  const sourceRef = getSourceRef(formData, source);
  if (!sourceRef) {
    return { status: "error" };
  }

  const parsed = emailSchema.safeParse(
    String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
  );
  if (!parsed.success) return { status: "invalid" };

  const endpoint = newsletterEndpoint();
  if (!endpoint) {
    console.error("STRAPI_API_BASE is not set or is invalid — cannot subscribe to newsletter.");
    return { status: "error" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.data,
        consent: true,
        source,
        preferredLanguage: locale,
        consentVersion: CONSENT_VERSION,
        sourceRef,
        website: "",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.ok) return { status: "success" };

    console.error(`Newsletter subscribe failed: ${response.status}`);
    return { status: "error" };
  } catch (error) {
    console.error("Newsletter subscribe threw:", error);
    return { status: "error" };
  }
}
