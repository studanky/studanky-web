import { cookies, headers } from "next/headers";
import { cache } from "react";

import {
  isLocale,
  matchAcceptLanguagePreference,
  matchLanguageTagForLocale,
  type LanguagePreference,
  type Locale,
} from "./config";

const LOCALE_COOKIE = "NEXT_LOCALE";

async function resolveRequestLanguagePreference(): Promise<LanguagePreference> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");

  if (isLocale(cookieLocale)) {
    return {
      locale: cookieLocale,
      languageTag: matchLanguageTagForLocale(acceptLanguage, cookieLocale),
    };
  }

  return matchAcceptLanguagePreference(acceptLanguage);
}

/**
 * Resolves the best UI locale and its complete matching language tag for routes
 * outside the `[locale]` segment, where there is no `params.locale` to read.
 *
 * A valid `NEXT_LOCALE` cookie (set by the proxy or language switcher) chooses
 * the UI locale. `Accept-Language` then supplies the best complete tag with the
 * same primary language; without a cookie it chooses both values. The result is
 * memoized once per request so `generateMetadata`, layouts, and page rendering
 * use the same preference. Reading these request APIs opts the caller into
 * dynamic rendering.
 */
export const getRequestLanguagePreference = cache(
  resolveRequestLanguagePreference,
);

export async function getRequestLocale(): Promise<Locale> {
  return (await getRequestLanguagePreference()).locale;
}
