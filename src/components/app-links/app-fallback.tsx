import { DropletsIcon } from "lucide-react";

import { DownloadPanel } from "@/components/app-links/download-panel";
import { ShareShell } from "@/components/app-links/share-shell";
import type { Dictionary } from "@/i18n/dictionary";
import type { Platform } from "@/lib/platform";

/**
 * Generic `/s/*` fallback when Strapi is unreachable: no spring data to show,
 * but the page still explains the link and converts to an install.
 */
export function AppFallback({
  platform,
  copy,
  storeBadges,
}: {
  platform: Platform;
  copy: Dictionary["deepLink"];
  storeBadges: Dictionary["storeBadges"];
}) {
  return (
    <ShareShell backHomeLabel={copy.backHome}>
      <div className="grid w-full items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div className="flex flex-col items-start gap-5">
          <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            {copy.badge}
          </span>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-b from-water to-primary text-white shadow-md shadow-water/25">
            <DropletsIcon aria-hidden="true" className="size-6" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            {copy.title}
          </h1>
          <p className="max-w-md text-base leading-7 text-muted-foreground">
            {copy.platform[platform]}
          </p>
        </div>

        <DownloadPanel
          platform={platform}
          storeBadges={storeBadges}
          qrTitle={copy.qrTitle}
          qrNote={copy.qrNote}
          qrAlt={copy.qrAlt}
          alreadyInstalled={copy.alreadyInstalled}
        />
      </div>
    </ShareShell>
  );
}
