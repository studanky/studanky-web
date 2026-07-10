import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

/** Three steps as linear columns — a water-blue rule and a number, no boxes. */
export function StepsSection({ dict }: { dict: Dictionary }) {
  const steps = dict.steps;

  return (
    <section
      id="jak-to-funguje"
      className="flex scroll-mt-20 flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 lg:min-h-svh lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <Reveal>
          <SectionIntro eyebrow={steps.eyebrow} title={steps.title} description={steps.description} />
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.items.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.12}>
              <article className="border-t-2 border-water/60 pt-6">
                <span className="text-sm font-semibold text-primary tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2.5 text-xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-72 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
