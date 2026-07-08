import type { Metadata } from "next";

import { AppFallback } from "@/components/app-links/app-fallback";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestLocale } from "@/i18n/request-locale";
import { detectPlatform } from "@/lib/platform";

// Deep link target /s/* (see .well-known/apple-app-site-association).
// When the app is installed the OS intercepts and opens it; otherwise it lands here.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug?.length ? `/s/${slug.join("/")}` : "/s";
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${dict.deepLink.metaTitle} | ${siteConfig.name}`,
    description: dict.deepLink.metaDescription,
    // Per-share links are not indexed.
    robots: { index: false, follow: false },
    // iOS Smart App Banner (Safari) — only when the App Store ID is set.
    // app-argument = the specific spring URL, so "Open" deep-links into the app.
    ...(siteConfig.appStoreId
      ? {
          itunes: {
            appId: siteConfig.appStoreId,
            appArgument: `${siteConfig.url}${path}`,
          },
        }
      : {}),
  };
}

export default async function SpringDeepLinkPage() {
  const [platform, locale] = await Promise.all([
    detectPlatform(),
    getRequestLocale(),
  ]);
  const dict = await getDictionary(locale);

  return (
    <AppFallback
      platform={platform}
      copy={dict.deepLink}
      storeBadges={dict.storeBadges}
    />
  );
}
