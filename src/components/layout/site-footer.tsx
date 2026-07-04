import { DropletsIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { mainNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Separator />
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex max-w-md flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <DropletsIcon aria-hidden="true" />
              </span>
              {siteConfig.name}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <nav className="flex flex-wrap gap-3" aria-label="Patička">
            {mainNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Studánky. Landing page skeleton pro mobilní aplikaci.
        </p>
      </div>
    </footer>
  );
}
