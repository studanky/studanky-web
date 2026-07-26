import { NextResponse, userAgent, type NextRequest } from "next/server";

import { siteConfig } from "@/config/site";
import { isLocale, localizedPathname, matchAcceptLanguage } from "@/i18n/config";

// Universal download URL — the single target every QR code and store-agnostic
// CTA points at. Detects the platform from the User-Agent and redirects to the
// right store. Lives outside `app/[locale]/` on purpose: printed QR codes must
// never change, like the `/s/*` deep links.
//
// 307 (temporary) so the destination can change once the store URLs are filled
// in — nothing caches the pre-release fallback.

const LOCALE_COOKIE = "NEXT_LOCALE";

function fallbackDownloadUrl(request: NextRequest): URL {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : matchAcceptLanguage(request.headers.get("accept-language"));

  return new URL(
    `${localizedPathname(locale)}${siteConfig.links.download}`,
    siteConfig.url,
  );
}

export function GET(request: NextRequest) {
  const { os } = userAgent(request);
  const name = os.name?.toLowerCase() ?? "";

  let target = "";
  if (name.includes("ios")) target = siteConfig.links.appStore;
  else if (name.includes("android")) target = siteConfig.links.googlePlay;

  // Desktop, unknown platform, or store URL not configured yet → the homepage
  // download section on the canonical domain. Do not derive this from
  // request.url: behind a reverse proxy the internal host can be 0.0.0.0:3000.
  return NextResponse.redirect(target || fallbackDownloadUrl(request), 307);
}
