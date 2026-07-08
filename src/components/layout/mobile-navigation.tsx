"use client";

import { MenuIcon } from "lucide-react";

import { LanguageSwitcher } from "./language-switcher";
import { StoreBadges } from "@/components/layout/store-badges";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";

// Only the slices this client component actually needs are passed in, so the
// full catalog is never serialized across the RSC boundary.
export function MobileNavigation({
  nav,
  languageSwitcher,
  storeBadges,
  locale,
}: {
  nav: Dictionary["nav"];
  languageSwitcher: Dictionary["languageSwitcher"];
  storeBadges: Dictionary["storeBadges"];
  locale: Locale;
}) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" />}>
        <MenuIcon />
        <span className="sr-only">{nav.openMenu}</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(22rem,calc(100vw-2rem))]"
        closeLabel={nav.close}
      >
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
          <SheetDescription>{nav.menuDescription}</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label={nav.mobileAria}>
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {nav.items[item.id]}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-4 px-4 pb-4">
          <LanguageSwitcher locale={locale} labels={languageSwitcher} />
          <StoreBadges labels={storeBadges} compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
