import { DropletIcon } from "lucide-react";

import { DetailMock } from "@/components/mock/detail-mock";
import { MapMock } from "@/components/mock/map-mock";
import { PhoneFrame } from "@/components/mock/phone-frame";
import { QrCode } from "@/components/qr-code";
import { StoreButtons } from "@/components/store-buttons";
import { downloadUrl, siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";

export function Hero({ dict }: { dict: Dictionary }) {
  const hero = dict.hero;

  return (
    <section
      id="top"
      className="relative flex flex-col justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:min-h-svh lg:px-8"
    >
      {/* Ambient water scene behind the whole hero. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[36rem] bg-gradient-to-b from-secondary/70 via-background to-background" />
        <div className="absolute -top-48 right-[-14%] size-[38rem] rounded-full bg-water/25 blur-3xl motion-safe:animate-drift" />
        <div className="absolute top-64 left-[-16%] size-[30rem] rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col items-start gap-7">
          <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            {hero.eyebrow}
          </span>

          <h1 className="text-[2.75rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
            <span className="block text-foreground">{hero.titleLine1}</span>
            <span className="text-water-gradient block">{hero.titleLine2}</span>
          </h1>

          <p className="max-w-xl text-lg leading-8 text-pretty text-muted-foreground">
            {hero.description}
          </p>

          <div id="stahnout" className="flex w-full scroll-mt-24 flex-col items-start gap-4">
            {/* Phones: one primary CTA — /get resolves the right store server-side. */}
            <a
              href={siteConfig.getPath}
              className="flex h-13 w-full max-w-sm items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px md:hidden"
            >
              {hero.ctaMobile}
            </a>

            {/* Desktop: official badges + live QR (dark-on-white for scanning). */}
            <div className="hidden items-center gap-6 md:flex">
              <StoreButtons labels={dict.storeBadges} priority />
              <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-white p-3 pr-5 shadow-sm">
                <QrCode data={downloadUrl} label={hero.qrAlt} className="size-18 text-black" />
                <span className="flex max-w-36 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{hero.qrTitle}</span>
                  <span className="text-xs text-muted-foreground">{hero.qrNote}</span>
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              {hero.chips.join(" · ")}
            </p>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DropletIcon aria-hidden="true" className="size-3.5 shrink-0 text-water" />
            {hero.disclaimer}
          </p>
        </div>

        {/* Crafted app mocks — the map screen front, detail sheet peeking behind. */}
        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute -inset-10 -z-10 rounded-full bg-water/20 blur-3xl"
          />
          <div className="relative flex justify-center">
            <PhoneFrame
              label={dict.mock.detailAria}
              className="absolute top-10 -right-2 hidden max-w-[240px] rotate-6 opacity-90 sm:block"
            >
              <DetailMock copy={dict.mock} />
            </PhoneFrame>
            <PhoneFrame
              label={dict.mock.mapAria}
              className="relative z-10 -rotate-2 motion-safe:animate-float sm:-translate-x-8"
            >
              <MapMock copy={dict.mock} />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
