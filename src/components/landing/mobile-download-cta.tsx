import { cache, type ReactNode } from "react";

import { StoreButton } from "@/components/store-buttons";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { detectPlatform } from "@/lib/platform";
import { StickyDownload } from "./sticky-download";

type Variant = "primary" | "nav";

const variantClassName: Record<Variant, string> = {
  primary:
    "flex h-13 w-full max-w-sm items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px md:hidden",
  nav: "inline-flex h-10 items-center rounded-full bg-primary px-4.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 outline-none transition-transform hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px md:hidden",
};

/**
 * Request-scoped and shared by every landing CTA. Once Google Play is
 * configured, the left side short-circuits and `headers()` is never called, so
 * the landing page automatically becomes statically renderable again.
 */
const isMobileDownloadAvailable = cache(async (): Promise<boolean> => {
  return (
    Boolean(siteConfig.links.googlePlay) || (await detectPlatform()) !== "android"
  );
});

/** Server-rendered mobile CTA with a consistent Android pre-release state. */
export async function MobileDownloadCta({
  label,
  labels,
  locale,
  variant = "primary",
  renderComingSoonBadge = true,
}: {
  label: string;
  labels: Dictionary["storeBadges"];
  locale: Locale;
  variant?: Variant;
  renderComingSoonBadge?: boolean;
}) {
  if (!(await isMobileDownloadAvailable())) {
    if (!renderComingSoonBadge) return null;

    return (
      <StoreButton
        platform="android"
        labels={labels}
        locale={locale}
        height={52}
        className="md:hidden"
      />
    );
  }

  return (
    <a href={siteConfig.downloadPath} className={variantClassName[variant]}>
      {label}
    </a>
  );
}

/** Keeps the interactive sticky bar client-side while deciding availability on the server. */
export async function MobileStickyDownload({
  label,
}: {
  label: string;
}): Promise<ReactNode> {
  if (!(await isMobileDownloadAvailable())) return null;

  return <StickyDownload label={label} href={siteConfig.downloadPath} />;
}
