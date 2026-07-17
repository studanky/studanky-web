import type { MetadataRoute } from "next";

import { legalRoutes } from "@/config/legal";
import { siteConfig } from "@/config/site";
import {
  defaultLocale,
  localeMeta,
  locales,
  localizedPathname,
  type Locale,
} from "@/i18n/config";

// Bump when page content changes meaningfully (incl. the legal documents).
const lastModified = new Date("2026-07-16T00:00:00.000Z");

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

  const entries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: absoluteUrl(locale),
    lastModified,
    changeFrequency: "weekly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));

  for (const route of legalRoutes) {
    const routeLanguages: Record<string, string> = {};
    for (const locale of locales) {
      routeLanguages[localeMeta[locale].hrefLang] =
        `${siteConfig.url}${localizedPathname(locale, route.path)}`;
    }
    routeLanguages["x-default"] = `${siteConfig.url}${route.path}`;

    for (const locale of locales) {
      entries.push({
        url: `${siteConfig.url}${localizedPathname(locale, route.path)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: { languages: routeLanguages },
      });
    }
  }

  return entries;
}
