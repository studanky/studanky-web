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

/** Serializes JSON-LD safely for a native <script> tag (escapes `<` per docs). */
function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  // Structured data: the app entity (rich results for "app" queries) and the
  // FAQ — both localized, mirroring what the page itself shows.
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: siteConfig.name,
    description: dict.meta.description,
    url: `${siteConfig.url}${localizedPathname(locale)}`,
    applicationCategory: "TravelApplication",
    operatingSystem: "iOS, Android",
    inLanguage: localeMeta[locale].htmlLang,
    offers: { "@type": "Offer", price: "0", priceCurrency: "CZK" },
    isAccessibleForFree: true,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />
      <LandingPage dict={dict} locale={locale} />
    </>
  );
}
