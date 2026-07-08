/**
 * Locale-independent site configuration. All user-facing copy lives in
 * `messages/*.json`; this file only holds structural data (brand, URLs, nav
 * targets, store identifiers) that is the same in every language.
 */
export const siteConfig = {
  name: "Studánky",
  url: "https://studankyapp.cz",
  // Numeric App Store ID (not the bundle ID) for the iOS Smart App Banner.
  // Empty = banner is not rendered. Fill in once the app is on the App Store.
  appStoreId: "" as string,
  // Android package (must match package_name in assetlinks.json) for the
  // manifest related_applications + our own Android app banner.
  // Empty = disables both the manifest signal and the banner.
  androidPackageId: "cz.studankyapp.studanky" as string,
  links: {
    github: "https://github.com/",
    appStore: "#app-store",
    googlePlay: "#google-play",
    download: "#stahnout",
  },
} as const;

/**
 * Primary navigation. `id` keys into `dict.nav.items[id]` for the label; `href`
 * is a same-page anchor and identical across locales.
 */
export const mainNav = [
  { id: "app", href: "#aplikace" },
  { id: "features", href: "#funkce" },
  { id: "howItWorks", href: "#jak-to-funguje" },
  { id: "faq", href: "#faq" },
] as const;

export type NavItemId = (typeof mainNav)[number]["id"];

/**
 * Store call-to-actions. `platform` selects the badge asset and the localized
 * label (`dict.storeBadges`); `href` is the store link.
 */
export const primaryCtas = [
  { platform: "ios", href: siteConfig.links.appStore },
  { platform: "android", href: siteConfig.links.googlePlay },
] as const;
