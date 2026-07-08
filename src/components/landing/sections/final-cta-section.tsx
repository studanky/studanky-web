import Image from "next/image";

import { StoreBadges } from "@/components/layout/store-badges";
import type { Dictionary } from "@/i18n/dictionary";

export function FinalCtaSection({ dict }: { dict: Dictionary }) {
  const finalCta = dict.finalCta;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-2xl bg-primary p-6 text-primary-foreground md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium opacity-80">{finalCta.note}</p>
          <h2 className="text-3xl font-semibold tracking-tight">{finalCta.title}</h2>
          <p className="max-w-2xl text-sm leading-6 opacity-80">{finalCta.description}</p>
          <StoreBadges labels={dict.storeBadges} />
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-background p-4 text-foreground">
          <Image
            src="/app/download-qr.svg"
            alt={finalCta.qrAlt}
            width={112}
            height={112}
          />
          <p className="max-w-36 text-sm text-muted-foreground">{finalCta.qrNote}</p>
        </div>
      </div>
    </section>
  );
}
