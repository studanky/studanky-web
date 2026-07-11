import { MailIcon } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "./newsletter-form";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

// Phase chip styling by index: now / in the works / vision.
const phaseChip = [
  "bg-water text-water-foreground",
  "bg-sun/15 text-sun ring-1 ring-sun/30",
  "bg-muted text-muted-foreground",
];

export function RoadmapSection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const roadmap = dict.roadmap;

  return (
    <section
      id="roadmapa"
      className="flex flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 min-h-svh lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <Reveal>
          <SectionIntro
            align="left"
            title={roadmap.title}
            description={roadmap.description}
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <ol className="relative flex flex-col gap-10 border-l border-border pl-7">
            {roadmap.phases.map((phase, index) => (
              <Reveal key={phase.title} delay={index * 0.1}>
                <li className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1.5 -left-[33px] size-2.5 rounded-full ring-4 ring-background",
                      index === 0 ? "bg-water" : "bg-stale/50",
                    )}
                  />
                  <div className="flex flex-col items-start gap-2.5">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-semibold",
                        phaseChip[index] ?? phaseChip[2],
                      )}
                    >
                      {phase.status}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {phase.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      {phase.description}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* Newsletter — a solid card on purpose: forms don't sit on glass. */}
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-2.5">
                <MailIcon aria-hidden="true" className="size-5 text-primary" />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {roadmap.newsletter.title}
                </h3>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {roadmap.newsletter.description}
              </p>
              <NewsletterForm copy={roadmap.newsletter} locale={locale} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
