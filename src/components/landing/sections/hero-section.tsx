import { ArrowRightIcon, QrCodeIcon } from "lucide-react";

import { StoreBadges } from "@/components/layout/store-badges";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { heroContent } from "@/data/landing";
import { cn } from "@/lib/utils";
import { PhonePreview } from "../phone-preview";

export function HeroSection() {
  return (
    <section id="top" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <Badge variant="secondary">{heroContent.eyebrow}</Badge>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {heroContent.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              {heroContent.description}
            </p>
          </div>
          <div className="flex flex-col gap-4" id="stahnout">
            <StoreBadges />
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#aplikace"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Prohlédnout aplikaci
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </a>
              <a
                href="/app/download-qr.svg"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                <QrCodeIcon data-icon="inline-start" aria-hidden="true" />
                QR kód ke stažení
              </a>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Doména: {siteConfig.url.replace("https://", "")}. Odkazy na obchody jsou zatím připravené jako placeholdery.
          </p>
        </div>
        <PhonePreview />
      </div>
    </section>
  );
}
