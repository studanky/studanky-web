import { statistics } from "@/data/landing";

export function StatsSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8" aria-label="Rychlá fakta">
      <div className="mx-auto grid w-full max-w-6xl gap-3 sm:grid-cols-3">
        {statistics.map((item) => (
          <div key={item.label} className="rounded-xl bg-card p-5 ring-1 ring-border">
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
