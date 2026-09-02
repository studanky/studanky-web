import type { NextRequest } from "next/server";

import { resolveDownloadTarget } from "./resolve-download-target";

// Universal download URL — the single target every QR code and store-agnostic
// CTA points at. Detects the platform from the User-Agent and redirects to the
// right store. Lives outside `app/[locale]/` on purpose: printed QR codes must
// never change, like the `/s/*` deep links.
//
// 307 (temporary) so the destination can change once the store URLs are filled
// in. Explicit response headers prevent intermediaries from reusing a redirect
// chosen for another platform or locale. Next adds its own RFC-compatible Vary
// field for RSC request headers.

export function GET(request: NextRequest) {
  // Desktop, unknown platform, or store URL not configured yet → the localized
  // download section on the same origin. A relative Location keeps localhost,
  // preview deployments, and production on their respective hosts.
  return new Response(null, {
    status: 307,
    headers: {
      Location: resolveDownloadTarget(request),
      "Cache-Control": "no-store",
      Vary: "User-Agent, Accept-Language, Cookie",
    },
  });
}
