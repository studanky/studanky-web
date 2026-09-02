import { headers } from "next/headers";

import { QrCode } from "@/components/qr-code";
import { siteConfig } from "@/config/site";

function firstHeaderValue(value: string | null): string | null {
  return value?.split(",", 1)[0]?.trim() || null;
}

async function developmentOrigin(): Promise<string | null> {
  // Host-derived QR data is allowed only in local development. Production and
  // preview builds must never let request headers alter the canonical QR URL.
  if (process.env.NODE_ENV !== "development") return null;

  const requestHeaders = await headers();
  const host =
    firstHeaderValue(requestHeaders.get("x-forwarded-host")) ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const forwardedProtocol = firstHeaderValue(
    requestHeaders.get("x-forwarded-proto"),
  );
  const protocol = forwardedProtocol === "https" ? "https" : "http";

  return `${protocol}://${host}`;
}

export function resolveDownloadUrl(localOrigin: string | null): string {
  return new URL(siteConfig.downloadPath, localOrigin ?? siteConfig.url).toString();
}

/**
 * Server-rendered QR for the stable universal download URL. Production and
 * preview builds always encode the canonical domain so printed codes never
 * change; local development derives its origin from the current request.
 */
export async function DownloadQrCode({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const localOrigin = await developmentOrigin();
  const data = resolveDownloadUrl(localOrigin);

  return <QrCode data={data} label={label} className={className} />;
}
