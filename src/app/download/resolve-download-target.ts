import type { NextRequest } from "next/server";

import { siteConfig } from "@/config/site";
import { isLocale, localizedPathname, matchAcceptLanguage } from "@/i18n/config";
import { platformFromUserAgent } from "@/lib/platform";

const LOCALE_COOKIE = "NEXT_LOCALE";

type DownloadLinks = Pick<typeof siteConfig.links, "appStore" | "googlePlay">;

function fallbackLandingPath(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : matchAcceptLanguage(request.headers.get("accept-language"));

  return `${localizedPathname(locale)}#download`;
}

function validStoreUrl(target: string): string | null {
  if (!target) return null;

  try {
    const url = new URL(target);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function resolveDownloadTarget(
  request: NextRequest,
  links: DownloadLinks = siteConfig.links,
): string {
  const platform = platformFromUserAgent(request.headers.get("user-agent") ?? "");

  let target = "";
  if (platform === "ios") target = links.appStore;
  else if (platform === "android") target = links.googlePlay;

  return validStoreUrl(target) ?? fallbackLandingPath(request);
}
