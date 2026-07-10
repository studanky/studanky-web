import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { defaultLocale, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// A web app manifest is single-language; we render it in the default locale.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const dict = await getDictionary(defaultLocale);

  return {
    id: "/",
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: dict.manifest.description,
    lang: localeMeta[defaultLocale].hrefLang,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F0F4F8",
    theme_color: "#0B97D2",
    categories: ["navigation", "travel", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    screenshots: [
      {
        src: "/app/screenshot-map.svg",
        sizes: "390x844",
        type: "image/svg+xml",
        form_factor: "narrow",
        label: dict.manifest.screenshotMap,
      },
      {
        src: "/app/screenshot-detail.svg",
        sizes: "390x844",
        type: "image/svg+xml",
        form_factor: "narrow",
        label: dict.manifest.screenshotDetail,
      },
    ],
    // Android equivalent of the Smart App Banner: tells Chrome to prefer the
    // native Google Play app (verified via assetlinks.json) over installing the PWA.
    ...(siteConfig.androidPackageId
      ? {
          prefer_related_applications: true,
          related_applications: [
            {
              platform: "play",
              id: siteConfig.androidPackageId,
              url: `https://play.google.com/store/apps/details?id=${siteConfig.androidPackageId}`,
            },
          ],
        }
      : {}),
  };
}
