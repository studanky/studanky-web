import type { Dictionary } from "@/i18n/dictionary";

export function StatsSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8" aria-label={dict.stats.aria}>
      <div className="mx-auto grid w-full max-w-6xl gap-3 sm:grid-cols-3">
        {dict.stats.items.map((item, index) => (
          <div key={index} className="rounded-xl bg-card p-5 ring-1 ring-border">
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
