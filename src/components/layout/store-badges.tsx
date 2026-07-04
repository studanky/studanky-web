import Image from "next/image";

import { primaryCtas } from "@/config/site";

const badgeAssets = {
  ios: {
    src: "/app/app-store-badge.svg",
    alt: "Stáhnout v App Store",
  },
  android: {
    src: "/app/google-play-badge.svg",
    alt: "Stáhnout na Google Play",
  },
} as const;

export function StoreBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {primaryCtas.map((cta) => {
        if (!cta.platform) {
          return null;
        }

        const asset = badgeAssets[cta.platform];

        return (
          <a
            key={cta.platform}
            href={cta.href}
            aria-label={cta.label}
            className="inline-flex min-h-12 items-center rounded-lg outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Image
              src={asset.src}
              alt={asset.alt}
              width={compact ? 136 : 160}
              height={compact ? 41 : 48}
            />
          </a>
        );
      })}
    </div>
  );
}
