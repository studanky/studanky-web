import { cookies, headers } from "next/headers";

import { isLocale, matchAcceptLanguage, type Locale } from "./config";

const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Resolves the best locale for routes that live **outside** the `[locale]`
 * segment (the `/s/*` deep-link fallback and its layout), where there is no
 * `params.locale` to read.
 *
 * Order of preference: the `NEXT_LOCALE` cookie (set by the proxy / the language
 * switcher) → the `Accept-Language` header → the default locale. Reading these
 * request APIs opts the caller into dynamic rendering, which is exactly what the
 * deep-link page already does via platform detection.
 */
export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const headerStore = await headers();
  return matchAcceptLanguage(headerStore.get("accept-language"));
}
