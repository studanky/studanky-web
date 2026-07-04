import { DropletsIcon } from "lucide-react";

import { MobileNavigation } from "./mobile-navigation";
import { buttonVariants } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DropletsIcon aria-hidden="true" />
          </span>
          {siteConfig.name}
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Hlavní navigace">
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <a
            href={siteConfig.links.download}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Stáhnout aplikaci
          </a>
        </div>
        <div className="md:hidden">
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
