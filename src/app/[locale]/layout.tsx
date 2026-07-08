import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { AndroidAppBanner } from "@/components/app-links/android-app-banner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}

/**
 * Locale-level metadata shared by every page under `[locale]` — including the
 * catch-all 404. Page-identity metadata (canonical, hreflang, robots, OpenGraph
 * URL) deliberately lives in `page.tsx`, not here, so the 404 doesn't inherit a
 * homepage canonical or an `index, follow` directive that fights Next's
 * automatic `noindex`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: dict.meta.description,
    applicationName: siteConfig.name,
    generator: "Next.js",
    keywords: dict.meta.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
    // iOS Smart App Banner site-wide (Safari). Only when the App Store ID is set.
    ...(siteConfig.appStoreId ? { itunes: { appId: siteConfig.appStoreId } } : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#2f6f4f",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html lang={localeMeta[locale].htmlLang} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AndroidAppBanner messages={dict.androidBanner} appName={siteConfig.name} />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
