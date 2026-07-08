import type { Dictionary } from "@/i18n/dictionary";
import { SectionHeading } from "../section-heading";

export function HowItWorksSection({ dict }: { dict: Dictionary }) {
  const howItWorks = dict.howItWorks;

  return (
    <section id="jak-to-funguje" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          description={howItWorks.description}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.steps.map((item, index) => (
            <article key={item.title} className="rounded-xl bg-card p-6 ring-1 ring-border">
              <p className="text-sm font-medium text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
