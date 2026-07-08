import Image from "next/image";

import { primaryCtas } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";

const badgeSrc = {
  ios: "/app/app-store-badge.svg",
  android: "/app/google-play-badge.svg",
} as const;

export function StoreBadges({
  labels,
  compact = false,
}: {
  labels: Dictionary["storeBadges"];
  compact?: boolean;
}) {
  const badgeMeta = {
    ios: { src: badgeSrc.ios, alt: labels.iosAlt, label: labels.iosLabel },
    android: { src: badgeSrc.android, alt: labels.androidAlt, label: labels.androidLabel },
  } as const;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {primaryCtas.map((cta) => {
        const badge = badgeMeta[cta.platform];

        return (
          <a
            key={cta.platform}
            href={cta.href}
            aria-label={badge.label}
            className="inline-flex min-h-12 items-center rounded-lg outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Image
              src={badge.src}
              alt={badge.alt}
              width={compact ? 136 : 160}
              height={compact ? 41 : 48}
            />
          </a>
        );
      })}
    </div>
  );
}
