import Image from "next/image";

import { storeBadgeAssets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import type { StorePlatform } from "@/types/landing";
import { cn } from "@/lib/utils";

// Until the real store URLs are configured, fall back to the universal /get
// redirect for iOS. Android stays explicitly disabled until the Play listing is
// live; once `siteConfig.links.googlePlay` is filled in, it becomes a normal
// store badge automatically.
const badgeHref: Record<StorePlatform, string | null> = {
  ios: siteConfig.links.appStore || siteConfig.getPath,
  android: siteConfig.links.googlePlay || null,
};

/** One official store badge (the store-guidelines-compliant way to link). */
export function StoreButton({
  platform,
  labels,
  locale = defaultLocale,
  height = 50,
  priority = false,
  className,
}: {
  platform: StorePlatform;
  labels: Dictionary["storeBadges"];
  locale?: Locale;
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const alt = platform === "ios" ? labels.iosAlt : labels.androidAlt;
  const label = platform === "ios" ? labels.iosLabel : labels.androidLabel;
  const href = badgeHref[platform];
  const asset = storeBadgeAssets[platform][locale];
  const width = Math.round(height * (asset.width / asset.height));

  if (!href && platform === "android") {
    return (
      <span
        role="img"
        aria-label={labels.androidComingSoonAria}
        className={cn(
          "inline-flex shrink-0 flex-col justify-center rounded-xl border border-border bg-card px-4 text-left shadow-sm",
          className,
        )}
        style={{ width, height }}
      >
        <span className="text-[0.62rem] leading-none font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {labels.androidStoreName}
        </span>
        <span className="mt-1 text-sm leading-none font-semibold text-foreground">
          {labels.androidComingSoon}
        </span>
      </span>
    );
  }

  return (
    <a
      href={href ?? siteConfig.getPath}
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Image
        src={asset.src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
      />
    </a>
  );
}

/** Both store badges side by side. */
export function StoreButtons({
  labels,
  locale = defaultLocale,
  height = 50,
  priority = false,
  className,
}: {
  labels: Dictionary["storeBadges"];
  locale?: Locale;
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <StoreButton
        platform="ios"
        labels={labels}
        locale={locale}
        height={height}
        priority={priority}
      />
      <StoreButton
        platform="android"
        labels={labels}
        locale={locale}
        height={height}
        priority={priority}
      />
    </div>
  );
}
