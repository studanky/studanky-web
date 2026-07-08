import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

/**
 * Locale toggle. Each link points at the *prefixed* path (`/cs`, `/en`); the
 * proxy then persists the choice in the `NEXT_LOCALE` cookie and redirects the
 * default locale back to the clean URL. That keeps this a plain server component
 * that also works without JavaScript.
 *
 * (For a multi-page site the links would preserve the current sub-path; the
 * landing page is a single route, so linking to each locale root is correct.)
 */
export function LanguageSwitcher({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Dictionary["languageSwitcher"];
}) {
  return (
    <div
      role="group"
      aria-label={labels.label}
      className="inline-flex items-center rounded-lg border border-border p-0.5"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <a
            key={code}
            href={`/${code}`}
            hrefLang={code}
            aria-label={labels[code]}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-semibold uppercase outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {code}
          </a>
        );
      })}
    </div>
  );
}
