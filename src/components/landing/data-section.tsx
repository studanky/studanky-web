import { DropletIcon } from "lucide-react";

import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

/**
 * ČHMÚ provenance section — light like the rest of the page (the credibility
 * comes from the numbers, not a dark backdrop). Stats sit as linear columns
 * over hairlines; the potability disclaimer is a left-rule note.
 */
export function DataSection({ dict }: { dict: Dictionary }) {
  const data = dict.data;

  return (
    <section className="flex flex-col justify-center border-y border-border/60 bg-secondary/25 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-svh lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <Reveal>
          <SectionIntro eyebrow={data.eyebrow} title={data.title} description={data.description} />
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="grid grid-cols-2 gap-y-10 border-y border-border/60 py-10 lg:grid-cols-4">
            {data.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col gap-1.5 px-5 sm:px-8 ${
                  index > 0 ? "border-l border-border/60" : ""
                }`}
              >
                <dd className="order-1 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="order-2 text-sm leading-5 text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto flex max-w-2xl items-start gap-3 border-l-2 border-sun pl-4 text-sm leading-6 text-muted-foreground">
            <DropletIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sun" />
            {data.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
