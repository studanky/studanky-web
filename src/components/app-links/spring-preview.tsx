import Link from "next/link";
import {
  ArrowRightIcon,
  DropletsIcon,
  DropletOffIcon,
  HelpCircleIcon,
  ImageIcon,
  InfoIcon,
} from "lucide-react";

import { CopyCoordinates } from "@/components/app-links/copy-coordinates";
import { StoreCallToAction } from "@/components/app-links/store-cta";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/format";
import type { Platform } from "@/lib/platform";
import { relativeTimeFromNow } from "@/lib/relative-time";
import { cn } from "@/lib/utils";
import { formatCoordinates, type SpringPreview as SpringPreviewData } from "@/lib/springs";

const STATUS_META = {
  is_flowing: { key: "isFlowing", Icon: DropletsIcon, className: "border-primary/25 bg-primary/10 text-primary" },
  is_not_flowing: { key: "isNotFlowing", Icon: DropletOffIcon, className: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  unknown: { key: "unknown", Icon: HelpCircleIcon, className: "border-border bg-muted text-muted-foreground" },
} as const;

// The web fallback for `/s/{id}` when the app is NOT installed: a teaser-level
// preview of the shared spring (basics only) whose job is to pull the reader
// into the app for the rest.
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
  const StatusIcon = status.Icon;
  const statusLabel = copy.status[status.key];

  const relative = relativeTimeFromNow(spring.statusUpdatedAt, locale);
  const updatedLabel = relative ? `${copy.updatedPrefix} ${relative}` : copy.updatedNever;

  const description = spring.description ?? copy.descriptionFallback;

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />

      <header className="mx-auto flex w-full max-w-3xl items-center px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DropletsIcon aria-hidden="true" />
          </span>
          {siteConfig.name}
        </Link>
      </header>

      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6">
        <div className="flex w-full max-w-xl flex-col gap-6 duration-500 animate-in fade-in-0 slide-in-from-bottom-4 motion-reduce:animate-none">
          {/* Spring card: photo (or placeholder), status, name, description, coords. */}
          <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <SpringPhoto spring={spring} altTemplate={copy.photoAlt} />

            <div className="flex flex-col gap-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
                    status.className,
                  )}
                >
                  <StatusIcon aria-hidden="true" className="size-4" />
                  {statusLabel}
                </span>
                <span className="text-xs text-muted-foreground">{updatedLabel}</span>
              </div>

              <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="w-fit">
                  {copy.sharedBadge}
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {spring.name}
                </h1>
                <p className="text-base leading-7 text-muted-foreground">{description}</p>
              </div>

              <CopyCoordinates
                value={formatCoordinates(spring.latitude, spring.longitude)}
                label={copy.coordinatesLabel}
                copyLabel={copy.copy}
                copiedLabel={copy.copied}
                ariaLabel={copy.copyAria}
              />
            </div>
          </article>

          {/* Lead magnet: what the app adds on top of these basics. */}
          <section className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
            <h2 className="text-sm font-semibold text-foreground">{copy.teaserTitle}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {copy.teaserItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowRightIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Store call to action. */}
          <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center">
            <h2 className="text-lg font-semibold text-foreground">{copy.ctaTitle}</h2>
            <p className="max-w-sm text-sm text-muted-foreground">{copy.ctaText}</p>
            <StoreCallToAction
              platform={platform}
              storeBadges={storeBadges}
              scan={{ title: copy.scanTitle, note: copy.scanNote, qrAlt: copy.qrAlt }}
            />
            <p className="text-xs text-muted-foreground">{copy.alreadyInstalled}</p>
          </section>

          <p className="flex items-start justify-center gap-1.5 px-2 text-center text-xs text-muted-foreground">
            <InfoIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            {copy.disclaimer}
          </p>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name} ·{" "}
          <Link
            href="/"
            className="rounded outline-none underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {copy.backHome}
          </Link>
        </p>
      </footer>
    </div>
  );
}

function SpringPhoto({
  spring,
  altTemplate,
}: {
  spring: SpringPreviewData;
  altTemplate: string;
}) {
  if (!spring.photo) {
    // Photo is optional (often absent for now) — show a branded placeholder.
    return (
      <div
        aria-hidden="true"
        className="flex aspect-[16/9] w-full items-center justify-center bg-[radial-gradient(120%_120%_at_50%_0%,color-mix(in_oklch,var(--primary)_22%,var(--card)),var(--card))]"
      >
        <ImageIcon className="size-10 text-primary/40" />
      </div>
    );
  }

  return (
    // Plain <img>: the Strapi/CDN host is deployment-configured and may vary, so
    // we avoid coupling next.config `images.remotePatterns` to it.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={spring.photo.url}
      alt={spring.photo.alternativeText ?? format(altTemplate, { name: spring.name })}
      width={spring.photo.width ?? undefined}
      height={spring.photo.height ?? undefined}
      className="aspect-[16/9] w-full object-cover"
    />
  );
}
