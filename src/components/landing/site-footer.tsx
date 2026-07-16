import { DropletsIcon } from "lucide-react";

import { GithubIcon } from "@/components/icons/github-icon";
import { legalRoutes, localizedLegalPath } from "@/config/legal";
import { mainNav, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/format";

export function SiteFooter({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <footer className="border-t border-border/60 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-7 text-center">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-b from-water to-primary text-white">
            <DropletsIcon aria-hidden="true" className="size-4.5" />
          </span>
          {siteConfig.name}
        </div>
        <p className="text-sm text-muted-foreground">{dict.footer.tagline}</p>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label={dict.nav.footerAria}>
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {dict.nav.items[item.id]}
            </a>
          ))}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <GithubIcon aria-hidden="true" className="size-4" />
            {dict.footer.githubLabel}
          </a>
        </nav>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          aria-label={dict.footer.legalAria}
        >
          {legalRoutes.map((item) => (
            <a
              key={item.id}
              href={localizedLegalPath(locale, item.id)}
              className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {dict.footer.legalLinks[item.id]}
            </a>
          ))}
        </nav>

        <div className="flex max-w-xl flex-col gap-2">
          <p className="text-xs leading-5 text-muted-foreground">{dict.footer.disclaimer}</p>
          <p className="text-xs text-muted-foreground">
            {format(dict.footer.copyright, {
              year: new Date().getFullYear(),
              name: siteConfig.name,
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
