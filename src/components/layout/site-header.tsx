import { DropletsIcon } from "lucide-react";

import { LanguageSwitcher } from "./language-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { buttonVariants } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

export function SiteHeader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <header className="sticky top-0 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DropletsIcon aria-hidden="true" />
          </span>
          {siteConfig.name}
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label={dict.nav.aria}>
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {dict.nav.items[item.id]}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher locale={locale} labels={dict.languageSwitcher} />
          <a
            href={siteConfig.links.download}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            {dict.nav.download}
          </a>
        </div>
        <div className="md:hidden">
          <MobileNavigation
            nav={dict.nav}
            languageSwitcher={dict.languageSwitcher}
            storeBadges={dict.storeBadges}
            locale={locale}
          />
        </div>
      </div>
    </header>
  );
}
