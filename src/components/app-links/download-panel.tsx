import { QrCode } from "@/components/qr-code";
import { StoreButton, StoreButtons } from "@/components/store-buttons";
import { downloadUrl } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Platform } from "@/lib/platform";

/**
 * The conversion block shared by every `/s/*` page. Phones get one big store
 * button for their (server-detected) platform — no QR, you can't scan the
 * device you're holding; desktop gets a large scannable QR with badges
 * beneath. Linear layout: separated by a hairline, not boxed in.
 */
export function DownloadPanel({
  platform,
  storeBadges,
  qrTitle,
  qrNote,
  qrAlt,
  storeTitle,
  alreadyInstalled,
}: {
  platform: Platform;
  storeBadges: Dictionary["storeBadges"];
  qrTitle: string;
  qrNote: string;
  qrAlt: string;
  storeTitle?: string;
  alreadyInstalled?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5 border-t border-border/70 pt-8 text-center md:border-t-0 md:border-l md:pt-0 md:pl-12">
      {platform === "other" ? (
        <>
          {/* Desktop: the QR is the hero. Dark-on-white for reliable scanning. */}
          <span className="rounded-3xl border border-border/70 bg-white p-4 shadow-xl shadow-primary/10">
            <QrCode data={downloadUrl} label={qrAlt} className="size-40 text-black sm:size-48" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-foreground">{qrTitle}</p>
            <p className="text-sm text-muted-foreground">{qrNote}</p>
          </div>
          <StoreButtons labels={storeBadges} width={140} />
        </>
      ) : (
        <>
          {storeTitle && <p className="text-lg font-semibold text-foreground">{storeTitle}</p>}
          <StoreButton platform={platform} labels={storeBadges} width={210} priority />
        </>
      )}
      {alreadyInstalled && <p className="text-xs text-muted-foreground">{alreadyInstalled}</p>}
    </div>
  );
}
