import { SearchXIcon } from "lucide-react";

import { DownloadPanel } from "@/components/app-links/download-panel";
import { ShareShell } from "@/components/app-links/share-shell";
import type { Dictionary } from "@/i18n/dictionary";
import type { Platform } from "@/lib/platform";

/**
 * Shown when `/s/{id}` resolves to an unknown/deleted/malformed spring (Strapi
 * 404). It never dead-ends: even without a spring to show, the download CTA
 * keeps the share converting.
 */
export function SpringNotFound({
  platform,
  copy,
  storeBadges,
}: {
  platform: Platform;
  copy: Dictionary["springNotFound"];
  storeBadges: Dictionary["storeBadges"];
}) {
  return (
    <ShareShell backHomeLabel={copy.backHome}>
      <div className="grid w-full items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div className="flex flex-col items-start gap-5">
          <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            {copy.badge}
          </span>
          <SearchXIcon aria-hidden="true" strokeWidth={1.5} className="size-10 text-stale" />
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            {copy.title}
          </h1>
          <p className="max-w-md text-base leading-7 text-muted-foreground">{copy.description}</p>
        </div>

        <DownloadPanel
          platform={platform}
          storeBadges={storeBadges}
          qrTitle={copy.qrTitle}
          qrNote={copy.qrNote}
          qrAlt={copy.qrAlt}
          storeTitle={copy.storeTitle}
        />
      </div>
    </ShareShell>
  );
}
