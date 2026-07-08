import Image from "next/image";

import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { StorePlatform } from "@/types/landing";
import { cn } from "@/lib/utils";

const badgeSrc: Record<StorePlatform, string> = {
  ios: "/app/app-store-badge.svg",
  android: "/app/google-play-badge.svg",
};

const badgeHref: Record<StorePlatform, string> = {
  ios: siteConfig.links.appStore,
  android: siteConfig.links.googlePlay,
};

// Official store badge = the recommended (and store-guidelines-compliant) way to link.
const BADGE_RATIO = 48 / 160;

export function StoreBadge({
  platform,
  labels,
  width = 200,
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
