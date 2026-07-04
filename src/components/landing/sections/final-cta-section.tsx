import Image from "next/image";

import { StoreBadges } from "@/components/layout/store-badges";

export function FinalCtaSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-2xl bg-primary p-6 text-primary-foreground md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium opacity-80">Připraveno pro release CTA</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Stáhněte si Studánky do telefonu
          </h2>
          <p className="max-w-2xl text-sm leading-6 opacity-80">
            Finální verze doplní ostré odkazy do App Store a Google Play, QR kód a měření kliknutí.
          </p>
          <StoreBadges />
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-background p-4 text-foreground">
          <Image
            src="/app/download-qr.svg"
            alt="QR kód pro stažení aplikace Studánky"
            width={112}
            height={112}
          />
          <p className="max-w-36 text-sm text-muted-foreground">
            QR placeholder pro rychlé otevření odkazu v mobilu.
          </p>
        </div>
      </div>
    </section>
  );
}
