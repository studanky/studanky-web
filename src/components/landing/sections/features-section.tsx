import type { ComponentType, SVGProps } from "react";
import {
  DropletIcon,
  FilterIcon,
  MapIcon,
  MessageSquarePlusIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features } from "@/data/landing";
import type { Feature } from "@/types/landing";
import { SectionHeading } from "../section-heading";

const featureIcons: Record<Feature["icon"], ComponentType<SVGProps<SVGSVGElement>>> = {
  map: MapIcon,
  droplet: DropletIcon,
  filter: FilterIcon,
  report: MessageSquarePlusIcon,
};

export function FeaturesSection() {
  return (
    <section id="funkce" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow="Funkce"
          title="Všechno důležité před zastávkou u pramene"
          description="Sekce zatím funguje jako kostra pro finální obsah, screenshoty a napojení na reálná data."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = featureIcons[feature.icon];

            return (
              <Card key={feature.title}>
                <CardHeader>
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon aria-hidden="true" />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Připraveno pro rozšíření o konkrétní UI stav aplikace.
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
