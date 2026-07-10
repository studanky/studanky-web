import type { ComponentType, SVGProps } from "react";
import {
  ClockIcon,
  DropletIcon,
  DropletOffIcon,
  HistoryIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";

import { CopyCoordinates } from "@/components/app-links/copy-coordinates";
import { DownloadPanel } from "@/components/app-links/download-panel";
import { ShareShell } from "@/components/app-links/share-shell";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/format";
import type { Platform } from "@/lib/platform";
import { relativeTimeFromNow } from "@/lib/relative-time";
import { formatCoordinates, type SpringPreview as SpringPreviewData } from "@/lib/springs";

const STATUS_META: Record<
  SpringPreviewData["currentStatus"],
  {
    key: "isFlowing" | "isNotFlowing" | "unknown";
    dot: string;
    /** Tinted banner backing the status — the page's key fact gets the accent. */
    banner: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
  }
> = {
  is_flowing: { key: "isFlowing", dot: "bg-flowing", banner: "bg-flowing/10", Icon: DropletIcon },
  is_not_flowing: {
    key: "isNotFlowing",
    dot: "bg-not-flowing",
    banner: "bg-not-flowing/10",
    Icon: DropletOffIcon,
  },
  unknown: { key: "unknown", dot: "bg-stale", banner: "bg-stale/10", Icon: ClockIcon },
};

// Curiosity-hook icons, paired with the translated `hookItems` by index.
const hookIcons: ComponentType<SVGProps<SVGSVGElement>>[] = [
  SparklesIcon,
  HistoryIcon,
  MapPinIcon,
];

/**
 * `/s/{id}` fallback for a resolved spring. One viewport, no scrolling on
 * desktop: the spring's facts tease on the left, the download CTA dominates on
 * the right (QR on desktop, the platform's store button on phones). The photo
 * — when it exists — is atmosphere, not content: a soft backdrop and a small
 * thumbnail.
 */
export function SpringPreview({
  spring,
  platform,
  locale,
  copy,
  storeBadges,
}: {
  spring: SpringPreviewData;
  platform: Platform;
  locale: Locale;
  copy: Dictionary["springPreview"];
  storeBadges: Dictionary["storeBadges"];
}) {
  const status = STATUS_META[spring.currentStatus];
  const relative = relativeTimeFromNow(spring.statusUpdatedAt, locale);
  const updated = relative ? `${copy.updatedPrefix} ${relative}` : copy.updatedNever;
  const description = spring.description ?? copy.descriptionFallback;

  return (
    <ShareShell
      backHomeLabel={copy.backHome}
      footer={<p className="text-xs text-muted-foreground">{copy.disclaimer}</p>}
      backdrop={
        spring.photo ? (
          <div aria-hidden="true" className="absolute inset-0">
            {/* Atmospheric only — blurred, dimmed, decorative (hence plain img). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spring.photo.thumbnailUrl ?? spring.photo.url}
              alt=""
              className="size-full scale-110 object-cover opacity-20 blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/85 to-background" />
          </div>
        ) : undefined
      }
    >
      <div className="grid w-full items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        {/* Spring facts on an elevated card so they lead the page; the status
            banner inside carries the one fact everyone came for. */}
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-primary/10 sm:p-8">
          <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            {copy.badge}
          </span>

          <div className="flex items-center gap-4">
            {spring.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spring.photo.thumbnailUrl ?? spring.photo.url}
                alt={format(copy.photoAlt, { name: spring.name })}
                className="size-16 shrink-0 rounded-2xl object-cover ring-1 ring-border"
              />
            )}
            <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
              {spring.name}
            </h1>
          </div>

          <div
            className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 ${status.banner}`}
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-white/80 ${status.dot}`}
            >
              <status.Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-foreground">
                {copy.status[status.key]}
              </span>
              <span className="text-sm text-muted-foreground">{updated}</span>
            </span>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>

          <CopyCoordinates
            value={formatCoordinates(spring.latitude, spring.longitude)}
            label={copy.coordinatesLabel}
            copyLabel={copy.copy}
            copiedLabel={copy.copied}
            ariaLabel={copy.copyAria}
          />

          <div className="mt-1 flex flex-col gap-2.5">
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {copy.hookTitle}
            </p>
            <ul className="flex flex-col gap-2">
              {copy.hookItems.map((item, index) => {
                const Icon = hookIcons[index] ?? SparklesIcon;
                return (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Icon aria-hidden="true" className="size-4 shrink-0 text-water" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* The conversion panel — QR on desktop, the platform's button on phones. */}
        <DownloadPanel
          platform={platform}
          storeBadges={storeBadges}
          qrTitle={copy.qrTitle}
          qrNote={copy.qrNote}
          qrAlt={copy.qrAlt}
          storeTitle={copy.storeTitle}
          alreadyInstalled={copy.alreadyInstalled}
        />
      </div>
    </ShareShell>
  );
}
