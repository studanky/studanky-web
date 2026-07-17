import { DropletsIcon } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import {
  legalDocumentMeta,
  legalExternalLinks,
  legalRouteById,
  legalRoutes,
  localizedLegalPath,
} from "@/config/legal";
import { siteConfig } from "@/config/site";
import { localizedPathname, type Locale } from "@/i18n/config";
import type { Dictionary, LegalDocumentId } from "@/i18n/dictionary";

/** Localizes ISO `YYYY-MM-DD` dates; anything else (a placeholder) renders verbatim. */
function formatEffectiveDate(value: string, locale: Locale): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(value),
  );
}

export function LegalPage({
  dict,
  locale,
  documentId,
}: {
  dict: Dictionary;
  locale: Locale;
  documentId: LegalDocumentId;
}) {
  const document = dict.legal.documents[documentId];
  const meta = legalDocumentMeta[documentId];
  const pathname = legalRouteById[documentId].path;

  return (
    <>
      <header className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={localizedPathname(locale)}
            className="inline-flex items-center gap-2 rounded-full font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-b from-water to-primary text-white">
              <DropletsIcon aria-hidden="true" className="size-4.5" />
            </span>
            {siteConfig.name}
          </a>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={localizedPathname(locale)}
              className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {dict.legal.common.home}
            </a>
            <LanguageSwitcher
              locale={locale}
              labels={dict.languageSwitcher}
              pathname={pathname}
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-4 pt-10 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <p className="text-sm font-semibold text-primary">
              {dict.legal.common.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
              {document.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              {document.description}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              {dict.legal.common.effectiveDateLabel}:{" "}
              {formatEffectiveDate(meta.effectiveDate, locale)} ·{" "}
              {dict.legal.common.versionLabel}: {meta.version}
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <article className="max-w-3xl">
            <div className="space-y-9">
              {document.sections.map((section) => (
                <section key={section.title} className="scroll-mt-8">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {section.title}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 text-base leading-7 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.items ? (
                    <dl className="mt-5 grid gap-4">
                      {section.items.map((item) => (
                        <div key={item.label} className="border-l border-border pl-4">
                          <dt className="font-medium text-foreground">{item.label}</dt>
                          <dd className="mt-1 text-base leading-7 text-muted-foreground">
                            {item.text}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {section.bullets ? (
                    <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}

                  {section.links ? (
                    <div className="mt-5">
                      <p className="text-sm font-medium text-foreground">
                        {dict.legal.common.externalLinksTitle}
                      </p>
                      <ul className="mt-2 space-y-2 text-sm">
                        {section.links.map((link) => {
                          const href = legalExternalLinks[link.id];
                          if (!href) return null;

                          return (
                            <li key={`${link.id}-${link.label}`}>
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                              >
                                {link.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            <p className="mt-12 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
              {dict.legal.common.disclaimer}
            </p>
          </article>
        </div>
      </main>

      <footer className="border-t border-border/70 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <nav
            aria-label={dict.legal.common.documentsAria}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            {legalRoutes.map((route) => (
              <a
                key={route.id}
                href={localizedLegalPath(locale, route.id)}
                aria-current={route.id === documentId ? "page" : undefined}
                className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-current:text-foreground"
              >
                {dict.legal.nav[route.id]}
              </a>
            ))}
          </nav>
          <p className="text-xs leading-5 text-muted-foreground">
            {dict.footer.disclaimer}
          </p>
        </div>
      </footer>
    </>
  );
}
