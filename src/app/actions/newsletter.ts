"use server";

import "server-only";

import { headers } from "next/headers";
import { z } from "zod";

import { siteConfig } from "@/config/site";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export type NewsletterState = {
  status: "idle" | "success" | "invalid" | "error";
};

type NewsletterSource = "prelaunch-page" | "website-hero" | "website-footer";

const STRAPI_API_BASE = process.env.STRAPI_API_BASE;
const CONSENT_VERSION = "2026-07-10";
const FETCH_TIMEOUT_MS = 5000;
const MAX_SOURCE_URL_LENGTH = 2048;
const NEWSLETTER_SOURCES = new Set<NewsletterSource>([
  "prelaunch-page",
  "website-hero",
  "website-footer",
]);

const emailSchema = z.email();

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getLocale(formData: FormData): Locale {
  const locale = getString(formData, "locale");
  return isLocale(locale) ? locale : defaultLocale;
}

function getSource(formData: FormData): NewsletterSource {
  const source = getString(formData, "source");
  return NEWSLETTER_SOURCES.has(source as NewsletterSource)
    ? (source as NewsletterSource)
    : "prelaunch-page";
}

function safeHttpUrl(value: string | null): string | null {
  if (!value || value.length > MAX_SOURCE_URL_LENGTH) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
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

function sourceUrlFromHeaders(requestHeaders: Headers): string {
  return (
    safeHttpUrl(requestHeaders.get("referer")) ??
    safeHttpUrl(requestHeaders.get("origin")) ??
    siteConfig.url
  );
}

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot: humans never see the "website" field, bots fill everything.
  // Pretend success so scripts don't retry with the field left empty.
  if (formData.get("website")) return { status: "success" };

  if (getString(formData, "consent") !== "true") return { status: "invalid" };

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
    const requestHeaders = await headers();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.data,
        consent: true,
        source: getSource(formData),
        preferredLanguage: getLocale(formData),
        consentVersion: CONSENT_VERSION,
        sourceUrl: sourceUrlFromHeaders(requestHeaders),
        website: "",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.ok) return { status: "success" };
    if (response.status === 400) return { status: "invalid" };

    console.error(`Newsletter subscribe failed: ${response.status}`);
    return { status: "error" };
  } catch (error) {
    console.error("Newsletter subscribe threw:", error);
    return { status: "error" };
  }
}
