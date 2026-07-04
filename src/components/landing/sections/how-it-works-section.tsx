import { howItWorks } from "@/data/landing";
import { SectionHeading } from "../section-heading";

export function HowItWorksSection() {
  return (
    <section id="jak-to-funguje" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow="Jak to funguje"
          title="Tři kroky od mapy k užitečnému hlášení"
          description="Tahle kostra drží workflow, které bude potřeba ukázat nad screenshoty a mikrocopy."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((item) => (
            <article key={item.step} className="rounded-xl bg-card p-6 ring-1 ring-border">
              <p className="text-sm font-medium text-primary">{item.step}</p>
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
