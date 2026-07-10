import Image from "next/image";
import { QrCodeIcon } from "lucide-react";

import { StoreBadge } from "@/components/app-links/store-badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Dictionary } from "@/i18n/dictionary";
import type { Platform } from "@/lib/platform";

// Platform-aware store call-to-action, shared by the spring preview and the
// "spring not found" page: iOS → App Store, Android → Google Play, desktop/other
// → both badges plus a QR code. There is no auto-redirect (an installed app
// would have intercepted the link before this page ever loaded — see spec §1).
export function StoreCallToAction({
  platform,
  storeBadges,
  scan,
}: {
  platform: Platform;
  storeBadges: Dictionary["storeBadges"];
  scan: { title: string; note: string; qrAlt: string };
}) {
  if (platform === "ios") {
    return <StoreBadge platform="ios" labels={storeBadges} width={200} priority />;
  }
  if (platform === "android") {
    return <StoreBadge platform="android" labels={storeBadges} width={200} priority />;
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <StoreBadge platform="ios" labels={storeBadges} width={180} priority />
        <StoreBadge platform="android" labels={storeBadges} width={180} priority />
      </div>

      <Card className="w-full max-w-xs">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-xl bg-white p-3 ring-1 ring-foreground/10">
            <Image src="/app/download-qr.svg" alt={scan.qrAlt} width={148} height={148} />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <QrCodeIcon aria-hidden="true" className="size-4 text-primary" />
            {scan.title}
          </div>
          <p className="text-sm text-muted-foreground">{scan.note}</p>
        </CardContent>
      </Card>
    </div>
  );
}
