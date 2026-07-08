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
import type { Dictionary } from "@/i18n/dictionary";
import { SectionHeading } from "../section-heading";

// Icons are structural (locale-independent) and paired with the translated
// feature copy by index.
const featureIcons: ComponentType<SVGProps<SVGSVGElement>>[] = [
  MapIcon,
  DropletIcon,
  FilterIcon,
  MessageSquarePlusIcon,
];

export function FeaturesSection({ dict }: { dict: Dictionary }) {
  const features = dict.features;

  return (
    <section id="funkce" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow={features.eyebrow}
          title={features.title}
          description={features.description}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((feature, index) => {
            const Icon = featureIcons[index] ?? MapIcon;

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
                  <p className="text-sm text-muted-foreground">{features.cardNote}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
