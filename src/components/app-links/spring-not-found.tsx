import Link from "next/link";
import { DropletsIcon, SearchXIcon } from "lucide-react";

import { StoreCallToAction } from "@/components/app-links/store-cta";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Platform } from "@/lib/platform";

// Shown when `/s/{id}` resolves to an unknown/deleted/malformed spring (Strapi
// 404). It never dead-ends: even without a spring to show, it keeps the app
// install CTA so a share still converts.
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

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 text-center duration-500 animate-in fade-in-0 slide-in-from-bottom-4 motion-reduce:animate-none">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border">
            <SearchXIcon aria-hidden="true" className="size-8" />
          </span>

          <div className="flex flex-col items-center gap-4">
            <Badge variant="secondary">{copy.badge}</Badge>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {copy.title}
              </h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                {copy.description}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">{copy.ctaTitle}</h2>
            <StoreCallToAction
              platform={platform}
              storeBadges={storeBadges}
              scan={{ title: copy.scanTitle, note: copy.scanNote, qrAlt: copy.qrAlt }}
            />
          </div>
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
