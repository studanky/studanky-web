export type LegalDocumentId = "privacy" | "terms" | "dataSources" | "contact";

export type LegalExternalLinkId =
  | "chmiGroundwaterNowData"
  | "chmiGroundwaterNowMetadata"
  | "creativeCommonsBy40"
  | "mapyAttribution"
  | "mapyCopyright"
  | "mapyHome"
  | "mapyPrivacy"
  | "uoou"
  | "coi";

export type LegalDocument = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  description: string;
  sections: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    items?: {
      label: string;
      text: string;
    }[];
    links?: {
      id: LegalExternalLinkId;
      label: string;
    }[];
  }[];
};

/**
 * Shape of a translation catalog. Every `messages/<locale>.json` file must
 * satisfy this type (see `messages/validate.ts`), which guarantees that all
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
    download: string;
    items: {
      app: string;
      features: string;
      howItWorks: string;
      roadmap: string;
      faq: string;
    };
  };
  languageSwitcher: {
    label: string;
    cs: string;
    en: string;
  };
  /** Labels inside the hand-crafted app UI mocks (map + detail sheet). */
  mock: {
    mapAria: string;
    detailAria: string;
    searchPlaceholder: string;
    disclaimerPill: string;
    callout: { name: string; status: string; updated: string };
    detail: {
      name: string;
      status: string;
      updated: string;
      navigate: string;
      share: string;
      save: string;
      historyTitle: string;
      history: { date: string; value: string }[];
    };
  };
  hero: {
    /** Small kicker above the H1 — platform info, not a section label. */
    eyebrow: string;
    titleLine1: string;
    /** Second headline line, rendered as a water-gradient accent. */
    titleLine2: string;
    description: string;
    /** Single primary CTA on phones — links to the /get platform redirect. */
    ctaMobile: string;
    chips: string[];
    qrTitle: string;
    qrNote: string;
    qrAlt: string;
    disclaimer: string;
  };
  /** Narrative problem section — a sequence of big statements + the punchline. */
  story: {
    lines: string[];
    punch: string;
  };
  /** Feature bento grid; named tiles because each has a bespoke visual. */
  bento: {
    title: string;
    description: string;
    map: { title: string; text: string };
    freshness: { title: string; text: string; value: string };
    history: { title: string; text: string };
    navigate: { title: string; text: string };
    favorites: { title: string; text: string };
    share: { title: string; text: string };
    states: {
      flowing: string;
      notFlowing: string;
      stale: string;
    };
  };
  /** App showcase — two phone mocks with captions. */
  showcase: {
    title: string;
    description: string;
    note: string;
    screens: {
      map: { title: string; caption: string };
      detail: { title: string; caption: string };
    };
  };
  steps: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  /** ČHMÚ data band with stat tiles + full potability disclaimer. */
  data: {
    title: string;
    description: string;
    stats: { value: string; label: string }[];
    disclaimer: string;
  };
  roadmap: {
    title: string;
    description: string;
    phases: { status: string; title: string; description: string }[];
    newsletter: {
      title: string;
      description: string;
      emailLabel: string;
      emailPlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      errorInvalid: string;
      errorServer: string;
      privacyNote: string;
    };
  };
  community: {
    title: string;
    description: string;
    points: { title: string; description: string }[];
    githubCta: string;
  };
  faq: {
    title: string;
    description: string;
    items: { question: string; answer: string }[];
  };
  /** Final download section — QR-dominant. */
  download: {
    title: string;
    description: string;
    qrTitle: string;
    qrNote: string;
    qrAlt: string;
    disclaimer: string;
  };
  footer: {
    tagline: string;
    /** Template with `{year}` and `{name}`. */
    copyright: string;
    disclaimer: string;
    githubLabel: string;
    legalAria: string;
    legalLinks: Record<LegalDocumentId, string>;
  };
  legal: {
    common: {
      eyebrow: string;
      home: string;
      effectiveDateLabel: string;
      versionLabel: string;
      documentsAria: string;
      externalLinksTitle: string;
      disclaimer: string;
    };
    nav: Record<LegalDocumentId, string>;
    documents: Record<LegalDocumentId, LegalDocument>;
  };
  storeBadges: {
    /** aria-label for the whole link (e.g. "Download for iPhone"). */
    iosLabel: string;
    androidLabel: string;
    /** alt text of the official badge image. */
    iosAlt: string;
    androidAlt: string;
  };
  /** Generic `/s/*` fallback when Strapi is unreachable. */
  deepLink: {
    metaTitle: string;
    metaDescription: string;
    badge: string;
    title: string;
    platform: { ios: string; android: string; other: string };
    alreadyInstalled: string;
    qrTitle: string;
    qrNote: string;
    qrAlt: string;
    backHome: string;
  };
  springPreview: {
    /** Template with `{name}`. */
    metaTitle: string;
    badge: string;
    status: { isFlowing: string; isNotFlowing: string; unknown: string };
    /** Prefixes the relative time, e.g. "Aktualizováno " + "před 3 dny". */
    updatedPrefix: string;
    updatedNever: string;
    descriptionFallback: string;
    coordinatesLabel: string;
    copy: string;
    copied: string;
    copyAria: string;
    /** Template with `{name}`. */
    photoAlt: string;
    /** Curiosity hook: what the app reveals beyond this preview. */
    hookTitle: string;
    hookItems: string[];
    qrTitle: string;
    qrNote: string;
    qrAlt: string;
    /** CTA heading shown on mobile above the store button. */
    storeTitle: string;
    alreadyInstalled: string;
    disclaimer: string;
    backHome: string;
  };
  springNotFound: {
    metaTitle: string;
    badge: string;
    title: string;
    description: string;
    qrTitle: string;
    qrNote: string;
    qrAlt: string;
    storeTitle: string;
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

type LegalSectionCatalog = Omit<LegalDocument["sections"][number], "links"> & {
  links?: {
    id: string;
    label: string;
  }[];
};

export type DictionaryCatalog = Omit<Dictionary, "legal"> & {
  legal: Omit<Dictionary["legal"], "documents"> & {
    documents: Record<
      LegalDocumentId,
      Omit<LegalDocument, "sections"> & {
        sections: LegalSectionCatalog[];
      }
    >;
  };
};
