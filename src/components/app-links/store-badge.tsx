import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const storeBadges = {
  ios: {
    src: "/app/app-store-badge.svg",
    alt: "Stáhnout v App Store",
    href: siteConfig.links.appStore,
  },
  android: {
    src: "/app/google-play-badge.svg",
    alt: "Stáhnout na Google Play",
    href: siteConfig.links.googlePlay,
  },
} as const;

// Official store badge = the recommended (and store-guidelines-compliant) way to link.
const BADGE_RATIO = 48 / 160;

export function StoreBadge({
  platform,
  width = 200,
  priority = false,
  className,
}: {
  platform: "ios" | "android";
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  const badge = storeBadges[platform];

  return (
    <a
      href={badge.href}
      aria-label={badge.alt}
      className={cn(
        "inline-flex items-center rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Image
        src={badge.src}
        alt={badge.alt}
        width={width}
        height={Math.round(width * BADGE_RATIO)}
        priority={priority}
      />
    </a>
  );
}
