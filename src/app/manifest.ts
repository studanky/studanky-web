import type { MetadataRoute } from "next";

import { appIcons, appScreenshots } from "@/config/assets";
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
        src: appIcons.pwa192.src,
        sizes: appIcons.pwa192.sizes,
        type: appIcons.pwa192.type,
        purpose: appIcons.pwa192.purpose,
      },
      {
        src: appIcons.pwa512.src,
        sizes: appIcons.pwa512.sizes,
        type: appIcons.pwa512.type,
        purpose: appIcons.pwa512.purpose,
      },
    ],
    screenshots: [
      {
        src: appScreenshots.map.src,
        sizes: `${appScreenshots.map.width}x${appScreenshots.map.height}`,
        type: "image/png",
        form_factor: "narrow",
        label: dict.manifest.screenshotMap,
      },
      {
        src: appScreenshots.detail.src,
        sizes: `${appScreenshots.detail.width}x${appScreenshots.detail.height}`,
        type: "image/png",
        form_factor: "narrow",
        label: dict.manifest.screenshotDetail,
      },
      {
        src: appScreenshots.history.src,
        sizes: `${appScreenshots.history.width}x${appScreenshots.history.height}`,
        type: "image/png",
        form_factor: "narrow",
        label: dict.manifest.screenshotHistory,
      },
    ],
    // Android equivalent of the Smart App Banner: tells Chrome to prefer the
    // native Google Play app (verified via assetlinks.json) over installing the PWA.
    ...(siteConfig.androidPackageId && siteConfig.links.googlePlay
      ? {
          prefer_related_applications: true,
          related_applications: [
            {
              platform: "play",
              id: siteConfig.androidPackageId,
              url: siteConfig.links.googlePlay,
            },
          ],
        }
      : {}),
  };
}
