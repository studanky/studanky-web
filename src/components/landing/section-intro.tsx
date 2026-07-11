import { cn } from "@/lib/utils";

/**
 * Shared section opener: display-size title + muted lead. No eyebrow labels —
 * sections introduce themselves through the heading alone.
 */
export function SectionIntro({
  title,
  description,
  align = "center",
}: {
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
      )}
    >
      <h2 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-lg leading-8 text-pretty text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
