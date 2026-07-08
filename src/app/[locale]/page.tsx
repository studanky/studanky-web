import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPage } from "@/components/landing";
import { siteConfig } from "@/config/site";
import {
  isLocale,
  localeMeta,
  locales,
  localizedPathname,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * hreflang map for `alternates.languages`. Each locale points at its prefixed
 * URL (`/cs`, `/en`); `x-default` points at the bare `/`, which the proxy
 * redirects to the visitor's best locale — the pattern Google recommends for a
 * language-agnostic entry point.
 */
function languageAlternates(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeMeta[locale].hrefLang] = localizedPathname(locale);
  }
  languages["x-default"] = "/";
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const canonical = localizedPathname(locale);

  return {
    alternates: {
      canonical,
      languages: languageAlternates(),
    },
    openGraph: {
      title: siteConfig.name,
      description: dict.meta.description,
      url: canonical,
      siteName: siteConfig.name,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return <LandingPage dict={dict} locale={locale} />;
}
