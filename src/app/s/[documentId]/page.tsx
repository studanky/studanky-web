import type { Metadata } from "next";

import { AppFallback } from "@/components/app-links/app-fallback";
import { SpringNotFound } from "@/components/app-links/spring-not-found";
import { SpringPreview } from "@/components/app-links/spring-preview";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { format } from "@/i18n/format";
import { getRequestLocale } from "@/i18n/request-locale";
import { detectPlatform } from "@/lib/platform";
import { fetchSpringPreview } from "@/lib/springs";

// Deep link target `/s/{documentId}` (see .well-known/apple-app-site-association).
// When the app is installed the OS intercepts and opens it; otherwise it lands
// here and we render a teaser preview of the shared spring + an install CTA.

type PageProps = { params: Promise<{ documentId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { documentId } = await params;
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const result = await fetchSpringPreview(documentId, locale);

  // Per-share links are never indexed.
  const base: Metadata = { robots: { index: false, follow: false } };

  if (result.status === "ok") {
    const { spring } = result;
    const title = format(dict.springPreview.metaTitle, { name: spring.name });
    const description = spring.description ?? dict.springPreview.descriptionFallback;
    const url = `${siteConfig.url}/s/${documentId}`;

    return {
      ...base,
      title,
      description,
      openGraph: { type: "website", title, description, url, siteName: siteConfig.name },
      twitter: { card: "summary_large_image", title, description },
      // iOS Smart App Banner — only once the App Store ID is set. app-argument is
      // the specific spring URL so "Open" deep-links straight into the app.
      ...(siteConfig.appStoreId
        ? { itunes: { appId: siteConfig.appStoreId, appArgument: url } }
        : {}),
    };
  }

  if (result.status === "not_found") {
    return { ...base, title: dict.springNotFound.metaTitle, description: dict.springNotFound.description };
  }

  // Strapi unreachable — generic fallback metadata.
  return { ...base, title: dict.deepLink.metaTitle, description: dict.deepLink.metaDescription };
}

export default async function SpringDeepLinkPage({ params }: PageProps) {
  const { documentId } = await params;

  const [platform, locale] = await Promise.all([detectPlatform(), getRequestLocale()]);
  const dict = await getDictionary(locale);
  const result = await fetchSpringPreview(documentId, locale);

  if (result.status === "ok") {
    return (
      <SpringPreview
        spring={result.spring}
        platform={platform}
        locale={locale}
        copy={dict.springPreview}
        storeBadges={dict.storeBadges}
      />
    );
  }

  if (result.status === "not_found") {
    return (
      <SpringNotFound
        platform={platform}
        copy={dict.springNotFound}
        storeBadges={dict.storeBadges}
      />
    );
  }

  // Strapi temporarily unavailable — never crash; show the generic install page.
  return <AppFallback platform={platform} copy={dict.deepLink} storeBadges={dict.storeBadges} />;
}
