import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";
import { legalRouteById, localizedLegalPath } from "@/config/legal";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { LegalDocumentId } from "@/i18n/dictionary";

type LegalRouteProps = {
  params: Promise<{ locale: string }>;
};

function languageAlternates(documentId: LegalDocumentId): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeMeta[locale].hrefLang] = localizedLegalPath(locale, documentId);
  }
  languages["x-default"] = legalRouteById[documentId].path;
  return languages;
}

async function localeFromParams(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateLegalMetadata(
  { params }: LegalRouteProps,
  documentId: LegalDocumentId,
): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const dict = await getDictionary(locale);
  const document = dict.legal.documents[documentId];
  const canonical = localizedLegalPath(locale, documentId);

  return {
    title: document.metaTitle,
    description: document.metaDescription,
    alternates: {
      canonical,
      languages: languageAlternates(documentId),
    },
    openGraph: {
      title: document.metaTitle,
      description: document.metaDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      type: "article",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function LegalRoutePage({
  params,
  documentId,
}: LegalRouteProps & {
  documentId: LegalDocumentId;
}) {
  const locale = await localeFromParams(params);
  const dict = await getDictionary(locale);

  return <LegalPage dict={dict} locale={locale} documentId={documentId} />;
}
