import type { CtaLink, NavItem } from "@/types/landing";

export const siteConfig = {
  name: "Studánky",
  url: "https://studankyapp.cz",
  description:
    "Mobilní aplikace pro hledání studánek a sdílení aktuálního průtoku vody.",
  locale: "cs_CZ",
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

export const mainNav: NavItem[] = [
  { label: "Aplikace", href: "#aplikace" },
  { label: "Funkce", href: "#funkce" },
  { label: "Jak to funguje", href: "#jak-to-funguje" },
  { label: "FAQ", href: "#faq" },
];

export const primaryCtas: CtaLink[] = [
  {
    label: "Stáhnout pro iPhone",
    href: siteConfig.links.appStore,
    variant: "store",
    platform: "ios",
  },
  {
    label: "Stáhnout pro Android",
    href: siteConfig.links.googlePlay,
    variant: "store",
    platform: "android",
  },
];
