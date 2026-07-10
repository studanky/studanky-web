import { QrCode } from "@/components/qr-code";
import { StoreButtons } from "@/components/store-buttons";
import { downloadUrl, siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";

/**
 * Final call to action — light like the rest of the page, with water glows for
 * atmosphere. Phones get the single /get button (the QR makes no sense on the
 * device it would install to); desktop gets the big scannable QR + badges.
 */
export function DownloadSection({ dict }: { dict: Dictionary }) {
  const download = dict.download;

  return (
    <section className="relative flex flex-col justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:min-h-svh lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-[8%] size-96 rounded-full bg-water/20 blur-3xl motion-safe:animate-drift" />
        <div className="absolute right-[-10%] bottom-[-10rem] size-[26rem] rounded-full bg-primary/12 blur-3xl" />
      </div>

      <Reveal className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <h2 className="text-water-gradient text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {download.title}
        </h2>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">{download.description}</p>

        {/* Phones: one primary CTA — /get resolves the right store server-side. */}
        <a
          href={siteConfig.getPath}
          className="flex h-13 w-full max-w-sm items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px md:hidden"
        >
          {dict.hero.ctaMobile}
        </a>

        {/* Desktop: the QR is the hero. */}
        <div className="hidden flex-col items-center gap-4 md:flex">
          <span className="rounded-3xl border border-border/70 bg-white p-5 shadow-xl shadow-primary/10">
            <QrCode data={downloadUrl} label={download.qrAlt} className="size-44 text-black" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">{download.qrTitle}</span>
            <span className="text-sm text-muted-foreground">{download.qrNote}</span>
          </span>
          <StoreButtons labels={dict.storeBadges} width={168} className="justify-center" />
        </div>

        <p className="text-xs text-muted-foreground">{download.disclaimer}</p>
      </Reveal>
    </section>
  );
}
