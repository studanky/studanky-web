"use client";

import { useEffect, useRef, useState } from "react";
import { DropletsIcon } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { mainNav, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

/**
 * Floating liquid-glass navigation pill with smart-sticky behaviour: it slides
 * away while scrolling down (content first) and returns on the first scroll
 * up — the standard pattern for long marketing pages. On mobile it stays
 * minimal (logo, language, download); section links are desktop-only.
 */
export function GlassNav({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      // Hysteresis so tiny jitters don't toggle the bar.
      if (y > 140 && delta > 6) setHidden(true);
      else if (delta < -6 || y <= 140) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-300 sm:px-4",
        hidden && "-translate-y-[130%]",
      )}
    >
      {/* glass-strong (80% fill) + shadow so the bar reads as a surface, not air. */}
      <div className="glass-strong mx-auto flex h-13 w-full max-w-5xl items-center justify-between gap-2 rounded-full py-1 pr-1.5 pl-4 shadow-lg shadow-primary/10">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-full text-[15px] font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="inline-flex size-7.5 items-center justify-center rounded-full bg-gradient-to-b from-water to-primary text-white shadow-sm">
            <DropletsIcon aria-hidden="true" className="size-4" />
          </span>
          {siteConfig.name}
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={dict.nav.aria}>
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/70 outline-none transition-colors hover:bg-white/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {dict.nav.items[item.id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} labels={dict.languageSwitcher} />
          <a
            href={siteConfig.links.download}
            className="inline-flex h-10 items-center rounded-full bg-primary px-4.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 outline-none transition-transform hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
          >
            {dict.nav.download}
          </a>
        </div>
      </div>
    </header>
  );
}
