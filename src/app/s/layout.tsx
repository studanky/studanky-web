import type { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";
import { localeMeta } from "@/i18n/config";
import { getRequestLocale } from "@/i18n/request-locale";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Second root layout, for the deep-link fallback tree (`/s/*`). It lives outside
// the `[locale]` segment so the deep-link paths registered in the native apps
// (apple-app-site-association / assetlinks.json) stay unchanged. The locale is
// resolved from the request instead of a URL prefix.

// This tree has no `[locale]` layout to inherit `metadataBase` from, so set it
// here — otherwise social image URLs (incl. the colocated opengraph-image) would
// resolve against the request host instead of the canonical site URL.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#2f6f4f",
};

export default async function DeepLinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();

  return (
    <html lang={localeMeta[locale].htmlLang} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
