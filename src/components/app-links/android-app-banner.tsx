"use client";

import { useSyncExternalStore } from "react";
import { DropletsIcon, XIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "studanky-android-banner-dismissed";
const DISMISS_EVENT = "studanky:android-banner-dismiss";

// In-memory fallback for contexts where localStorage is blocked (e.g. private
// mode): keeps the banner dismissed for the session even when persistence fails.
let dismissedInSession = false;

function subscribe(callback: () => void) {
  window.addEventListener(DISMISS_EVENT, callback);
  return () => window.removeEventListener(DISMISS_EVENT, callback);
}

function getSnapshot() {
  if (!siteConfig.androidPackageId) return false;
  if (!/android/i.test(navigator.userAgent)) return false;
  // User already "has" the site as an app (added to home screen / TWA) → banner is pointless.
  if (window.matchMedia("(display-mode: standalone)").matches) return false;
  // In-memory dismissal covers contexts where localStorage is blocked.
  if (dismissedInSession) return false;

  try {
    if (localStorage.getItem(DISMISS_KEY) === "1") return false;
  } catch {
    // localStorage unavailable (e.g. private mode) — rely on the session flag.
  }

  return true;
}

// Server (and the first client render during hydration) is always false → no
// hydration mismatch; the banner appears only in the browser after the platform check.
function getServerSnapshot() {
  return false;
}

/**
 * Android counterpart of the iOS Smart App Banner. Chrome/Android no longer
 * shows an automatic native banner, so we render our own. Client-only detection
 * via useSyncExternalStore keeps pages statically renderable.
 */
export function AndroidAppBanner() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!visible) return null;

  const playUrl = `https://play.google.com/store/apps/details?id=${siteConfig.androidPackageId}`;

  const dismiss = () => {
    // Set the in-memory flag first so the banner closes even if persistence fails.
    dismissedInSession = true;
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Persistence unavailable (e.g. private mode) — the session flag still closes it.
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  return (
    <div
      role="region"
      aria-label={`Nabídka mobilní aplikace ${siteConfig.name}`}
      className="w-full border-b bg-card text-card-foreground duration-300 animate-in fade-in-0 slide-in-from-top-4 motion-reduce:animate-none"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Zavřít nabídku aplikace"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <XIcon className="size-4" aria-hidden="true" />
        </button>

        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <DropletsIcon className="size-5" aria-hidden="true" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold tracking-tight">
            {siteConfig.name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            Zdarma na Google Play
          </span>
        </div>

        <a href={playUrl} className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
          Otevřít
        </a>
      </div>
    </div>
  );
}
