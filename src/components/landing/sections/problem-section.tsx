import type { Dictionary } from "@/i18n/dictionary";
import { SectionHeading } from "../section-heading";

export function ProblemSection({ dict }: { dict: Dictionary }) {
  const problem = dict.problem;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading
          align="left"
          eyebrow={problem.eyebrow}
          title={problem.title}
          description={problem.description}
        />
        <div className="grid gap-4">
          {problem.points.map((point) => (
            <article key={point.title} className="rounded-xl bg-card p-5 ring-1 ring-border">
              <h3 className="font-medium text-foreground">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
