import type { Locale } from "@/i18n/config";
import type { StorePlatform } from "@/types/landing";

export const appScreenshotSize = {
  width: 1320,
  height: 2868,
} as const;

export const appBrandIcon = {
  src: "/brand/app-icon/app-icon-1024.png",
  width: 1024,
  height: 1024,
} as const;

export const appScreenshots = {
  map: {
    src: "/app/screenshots/01-map.png",
    ...appScreenshotSize,
  },
  detail: {
    src: "/app/screenshots/02-detail.png",
    ...appScreenshotSize,
  },
  history: {
    src: "/app/screenshots/03-history.png",
    ...appScreenshotSize,
  },
} as const;

export const appIcons = {
  pwa192: {
    src: "/brand/app-icon/icon-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  pwa512: {
    src: "/brand/app-icon/icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
} as const;

export const storeBadgeAssets = {
  ios: {
    cs: {
      src: "/app/store-badges/app-store/cs.svg",
      width: 120,
      height: 40,
    },
    en: {
      src: "/app/store-badges/app-store/en.svg",
      width: 120,
      height: 40,
    },
  },
  android: {
    cs: {
      src: "/app/store-badges/google-play/cs.svg",
      width: 239,
      height: 71,
    },
    en: {
      src: "/app/store-badges/google-play/en.svg",
      width: 239,
      height: 71,
    },
  },
} as const satisfies Record<
  StorePlatform,
  Record<Locale, { src: string; width: number; height: number }>
>;
