import { headers } from "next/headers";
import { userAgent } from "next/server";

export type Platform = "ios" | "android" | "other";

/**
 * Detects the platform on the server from the User-Agent header.
 *
 * Server-side on purpose: the user gets the correct variant immediately (no
 * flash or layout shift like client-side detection) and the page works without
 * JS. Using `headers()` also correctly opts the route into dynamic rendering.
 */
export async function detectPlatform(): Promise<Platform> {
  const { os } = userAgent({ headers: await headers() });
  const name = os.name?.toLowerCase() ?? "";

  if (name.includes("ios")) return "ios";
  if (name.includes("android")) return "android";
  return "other";
}
