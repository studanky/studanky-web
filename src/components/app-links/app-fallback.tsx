import Image from "next/image";
import Link from "next/link";
import { DropletsIcon, QrCodeIcon } from "lucide-react";

import { StoreBadge } from "@/components/app-links/store-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Platform } from "@/lib/platform";

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
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center px-4 py-5 sm:px-6 lg:px-8">
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
          <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20">
            <DropletsIcon aria-hidden="true" className="size-8" />
          </span>

          <div className="flex flex-col items-center gap-4">
            <Badge variant="secondary">{copy.badge}</Badge>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {copy.title}
              </h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                {copy.platform[platform]}
              </p>
            </div>
          </div>

          <PlatformCta platform={platform} copy={copy} storeBadges={storeBadges} />

          <p className="text-sm text-muted-foreground">{copy.alreadyInstalled}</p>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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

function PlatformCta({
  platform,
  copy,
  storeBadges,
}: {
  platform: Platform;
  copy: Dictionary["deepLink"];
  storeBadges: Dictionary["storeBadges"];
}) {
  if (platform === "ios") {
    return <StoreBadge platform="ios" labels={storeBadges} width={200} priority />;
  }

  if (platform === "android") {
    return <StoreBadge platform="android" labels={storeBadges} width={200} priority />;
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <StoreBadge platform="ios" labels={storeBadges} width={180} priority />
        <StoreBadge platform="android" labels={storeBadges} width={180} priority />
      </div>

      <Card className="w-full max-w-xs">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-xl bg-white p-3 ring-1 ring-foreground/10">
            <Image
              src="/app/download-qr.svg"
              alt={copy.qrAlt}
              width={148}
              height={148}
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <QrCodeIcon aria-hidden="true" className="size-4 text-primary" />
            {copy.scanTitle}
          </div>
          <p className="text-sm text-muted-foreground">{copy.scanNote}</p>
        </CardContent>
      </Card>
    </div>
  );
}
