import Image from "next/image";

import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { StorePlatform } from "@/types/landing";
import { cn } from "@/lib/utils";

const badgeSrc: Record<StorePlatform, string> = {
  ios: "/app/app-store-badge.svg",
  android: "/app/google-play-badge.svg",
};

// Until the real store URLs are configured, fall back to the universal /get
// redirect (which itself lands on the homepage download section for now).
const badgeHref: Record<StorePlatform, string> = {
  ios: siteConfig.links.appStore || siteConfig.getPath,
  android: siteConfig.links.googlePlay || siteConfig.getPath,
};

const BADGE_RATIO = 48 / 160;

/** One official store badge (the store-guidelines-compliant way to link). */
export function StoreButton({
  platform,
  labels,
  width = 180,
  priority = false,
  className,
}: {
  platform: StorePlatform;
  labels: Dictionary["storeBadges"];
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  const alt = platform === "ios" ? labels.iosAlt : labels.androidAlt;
  const label = platform === "ios" ? labels.iosLabel : labels.androidLabel;

  return (
    <a
      href={badgeHref[platform]}
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Image
        src={badgeSrc[platform]}
        alt={alt}
        width={width}
        height={Math.round(width * BADGE_RATIO)}
        priority={priority}
      />
    </a>
  );
}

/** Both store badges side by side. */
export function StoreButtons({
  labels,
  width = 168,
  priority = false,
  className,
}: {
  labels: Dictionary["storeBadges"];
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <StoreButton platform="ios" labels={labels} width={width} priority={priority} />
      <StoreButton platform="android" labels={labels} width={width} priority={priority} />
    </div>
  );
}
