"use client";

import { MenuIcon } from "lucide-react";

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

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" />}>
        <MenuIcon />
        <span className="sr-only">Otevřít navigaci</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(22rem,calc(100vw-2rem))]">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
          <SheetDescription>
            Navigace landing page a odkazy ke stažení aplikace.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label="Mobilní navigace">
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-4">
          <StoreBadges compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
