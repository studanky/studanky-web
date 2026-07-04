import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start"
      )}
    >
      <Badge variant="secondary">{eyebrow}</Badge>
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
