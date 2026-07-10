import { NextResponse, userAgent, type NextRequest } from "next/server";

import { siteConfig } from "@/config/site";

// Universal download URL — the single target every QR code and store-agnostic
// CTA points at. Detects the platform from the User-Agent and redirects to the
// right store. Lives outside `app/[locale]/` on purpose: printed QR codes must
// never change, like the `/s/*` deep links.
//
// 307 (temporary) so the destination can change once the store URLs are filled
// in — nothing caches the pre-release fallback.

export function GET(request: NextRequest) {
  const { os } = userAgent(request);
  const name = os.name?.toLowerCase() ?? "";

  let target = "";
  if (name.includes("ios")) target = siteConfig.links.appStore;
  else if (name.includes("android")) target = siteConfig.links.googlePlay;

  // Desktop, unknown platform, or store URL not configured yet → the homepage
  // download section (the locale proxy forwards the fragment through).
  return NextResponse.redirect(
    target || new URL(`/${siteConfig.links.download}`, request.url),
    307,
  );
}
