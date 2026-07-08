import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import {
  defaultLocale,
  localeMeta,
  locales,
  localizedPathname,
  type Locale,
} from "@/i18n/config";

const lastModified = new Date("2026-07-04T00:00:00.000Z");

function absoluteUrl(locale: Locale): string {
  return `${siteConfig.url}${localizedPathname(locale)}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Shared hreflang map attached to every entry: each locale + an `x-default`
  // pointing at the redirecting root.
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeMeta[locale].hrefLang] = absoluteUrl(locale);
  }
  languages["x-default"] = siteConfig.url;

  return locales.map((locale) => ({
    url: absoluteUrl(locale),
    lastModified,
    changeFrequency: "weekly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}
