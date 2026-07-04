import type { CtaLink, NavItem } from "@/types/landing";

export const siteConfig = {
  name: "Studánky",
  url: "https://studankyapp.cz",
  description:
    "Mobilní aplikace pro hledání studánek a sdílení aktuálního průtoku vody.",
  locale: "cs_CZ",
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
