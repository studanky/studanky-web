/**
 * Shape of a translation catalog. Every `messages/<locale>.json` file must
 * satisfy this type (see `messages/*.ts` wrappers), which guarantees that all
 * locales stay in sync — a missing key is a compile error.
 *
 * Strings containing `{placeholder}` tokens are templates; render them through
 * `format()` from `@/i18n/format`.
 */
export type Dictionary = {
  meta: {
    description: string;
    keywords: string[];
  };
  nav: {
    aria: string;
    footerAria: string;
    mobileAria: string;
    menuDescription: string;
    openMenu: string;
    close: string;
    download: string;
    items: {
      app: string;
      features: string;
      howItWorks: string;
      faq: string;
    };
  };
  languageSwitcher: {
    label: string;
    cs: string;
    en: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    viewApp: string;
    qrDownload: string;
    /** Template with `{domain}`. */
    domainNote: string;
  };
  stats: {
    aria: string;
    items: { value: string; label: string }[];
  };
  problem: {
    eyebrow: string;
    title: string;
    description: string;
    points: { title: string; description: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    cardNote: string;
    items: { title: string; description: string }[];
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    steps: { title: string; description: string }[];
  };
  screenshots: {
    eyebrow: string;
    title: string;
    description: string;
    prev: string;
    next: string;
    items: { title: string; description: string; imageAlt: string }[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    items: { quote: string; author: string; context: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: { question: string; answer: string }[];
  };
  finalCta: {
    note: string;
    title: string;
    description: string;
    qrNote: string;
    qrAlt: string;
  };
  footer: {
    /** Template with `{year}` and `{name}`. */
    copyright: string;
  };
  phonePreview: {
    aria: string;
    imageAlt: string;
  };
  storeBadges: {
    /** aria-label for the whole link (e.g. "Download for iPhone"). */
    iosLabel: string;
    androidLabel: string;
    /** alt text of the official badge image. */
    iosAlt: string;
    androidAlt: string;
  };
  deepLink: {
    metaTitle: string;
    metaDescription: string;
    badge: string;
    title: string;
    platform: { ios: string; android: string; other: string };
    alreadyInstalled: string;
    scanTitle: string;
    scanNote: string;
    qrAlt: string;
    backHome: string;
  };
  androidBanner: {
    /** Template with `{name}`. */
    regionAria: string;
    subtitle: string;
    dismissAria: string;
    open: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  og: {
    subtitle: string;
    title: string;
    description: string;
    alt: string;
  };
  manifest: {
    description: string;
    screenshotMap: string;
    screenshotDetail: string;
  };
};
