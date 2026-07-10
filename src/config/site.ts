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
    // TODO: point at the real org/repo once it is public.
    github: "https://github.com/",
    // Store URLs. Empty = /get falls back to the homepage download section and
    // store badges keep pointing at the on-page anchor.
    appStore: "" as string,
    googlePlay: "" as string,
    // Same-page anchor of the hero download block.
    download: "#stahnout",
  },
  // Universal download URL: detects the platform server-side and redirects to
  // the right store (see `src/app/get/route.ts`). This is what QR codes encode,
  // so printed/rendered codes stay valid even before the store URLs exist.
  getPath: "/get",
} as const;

/** Absolute universal-download URL — the payload of every download QR code. */
export const downloadUrl = `${siteConfig.url}${siteConfig.getPath}`;

/**
 * Primary navigation. `id` keys into `dict.nav.items[id]` for the label; `href`
 * is a same-page anchor and identical across locales.
 */
export const mainNav = [
  // Ordered to match the actual section order on the page (bento features
  // come before the app showcase).
  { id: "features", href: "#funkce" },
  { id: "app", href: "#aplikace" },
  { id: "howItWorks", href: "#jak-to-funguje" },
  { id: "roadmap", href: "#roadmapa" },
  { id: "faq", href: "#faq" },
] as const;

export type NavItemId = (typeof mainNav)[number]["id"];

/**
 * Store call-to-actions. `platform` selects the badge asset and the localized
 * label (`dict.storeBadges`); `href` falls back to the on-page anchor until the
 * real store URL is configured.
 */
export const primaryCtas = [
  { platform: "ios", href: siteConfig.links.appStore || siteConfig.links.download },
  { platform: "android", href: siteConfig.links.googlePlay || siteConfig.links.download },
] as const;
