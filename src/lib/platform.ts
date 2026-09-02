import { headers } from "next/headers";
import { userAgent } from "next/server";

export type Platform = "ios" | "android" | "other";

const IPADOS_DESKTOP_USER_AGENT = /\bMacintosh\b.*\bMobile\/[\w.]+/i;

/** Pure platform detection shared by pages and the universal download route. */
export function platformFromUserAgent(value: string): Platform {
  const { os } = userAgent({
    headers: new Headers({ "user-agent": value }),
  });
  const name = os.name?.toLowerCase() ?? "";

  if (name.includes("ios") || IPADOS_DESKTOP_USER_AGENT.test(value)) return "ios";
  if (name.includes("android")) return "android";
  return "other";
}

/**
 * Detects the platform on the server from the User-Agent header.
 *
 * Server-side on purpose: the user gets the correct variant immediately (no
 * flash or layout shift like client-side detection) and the page works without
 * JS. Using `headers()` also correctly opts the route into dynamic rendering.
 */
export async function detectPlatform(): Promise<Platform> {
  const requestHeaders = await headers();
  return platformFromUserAgent(requestHeaders.get("user-agent") ?? "");
}
