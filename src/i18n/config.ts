/**
 * Central i18n configuration. Framework-agnostic and safe to import from
 * anywhere (proxy, server components, client components) — it holds no secrets
 * and pulls in no server-only APIs.
 */

export const locales = ["cs", "en"] as const;

export type Locale = (typeof locales)[number];

/**
 * Fallback locale. Every locale is prefixed in the URL (`/cs`, `/en`), so the
 * default is *not* privileged in the routing — it is only the locale that the
 * bare `/` redirects to when nothing else is known. Changing it is therefore a
 * one-line change with no URL migration.
 */
export const defaultLocale: Locale = "cs";

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (locales as readonly string[]).includes(value);
}

/**
 * Per-locale metadata used across the app: the `<html lang>` value, the
 * OpenGraph locale, and the hreflang tag. Kept here so adding a language is a
 * single-file change.
 */
export const localeMeta: Record<
  Locale,
  { htmlLang: string; ogLocale: string; hrefLang: string }
> = {
  cs: { htmlLang: "cs", ogLocale: "cs_CZ", hrefLang: "cs-CZ" },
  en: { htmlLang: "en", ogLocale: "en_US", hrefLang: "en" },
};

/**
 * Builds the public URL path for a locale under the "always-prefix" scheme:
 * every locale (including the default) is prefixed — `/cs`, `/en`, `/en/foo`.
 * The bare `/` is not a content URL; it redirects (see the proxy).
 */
export function localizedPathname(locale: Locale, pathname = "/"): string {
  const rest = pathname === "/" ? "" : pathname;
  return `/${locale}${rest}`;
}

/**
 * Splits a public pathname into its (optional) locale prefix and the remainder.
 * `/en/foo` -> { locale: "en", pathname: "/foo" }, `/foo` -> { locale: default,
 * pathname: "/foo" }.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  pathname: string;
} {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (isLocale(maybeLocale)) {
    const rest = "/" + segments.slice(2).join("/");
    return { locale: maybeLocale, pathname: rest === "/" ? "/" : rest.replace(/\/$/, "") };
  }
  return { locale: defaultLocale, pathname };
}

/**
 * Zero-dependency `Accept-Language` matcher. Parses the header, respects quality
 * order, and returns the first supported locale (matching either the full tag or
 * its primary subtag), falling back to the default locale. Pure and
 * framework-agnostic so it is safe to import from the proxy.
 */
export function matchAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    // Drop entries with q=0 — per RFC 9110 that means "not acceptable".
    .filter((entry) => entry.tag.length > 0 && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    const match = locales.find((locale) => locale === tag || locale === primary);
    if (match) return match;
  }

  return defaultLocale;
}
