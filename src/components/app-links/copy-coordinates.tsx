"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon, MapPinIcon } from "lucide-react";

// Client island: shows the spring's coordinates and copies them to the clipboard
// so the reader can paste them into any map app. Linear styling — a single
// hairline row, no box. The rest of the preview page stays server-rendered.
export function CopyCoordinates({
  value,
  label,
  copyLabel,
  copiedLabel,
  ariaLabel,
}: {
  value: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
  ariaLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — value stays visible to copy manually.
    }
  }, [value]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5 text-left">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <MapPinIcon aria-hidden="true" className="size-4 shrink-0 text-water" />
        <code className="flex-1 truncate font-mono text-sm text-foreground tabular-nums">
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={ariaLabel}
          className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground outline-none transition-colors hover:bg-secondary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {copied ? (
            <CheckIcon aria-hidden="true" className="size-3.5 text-primary" />
          ) : (
            <CopyIcon aria-hidden="true" className="size-3.5" />
          )}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}
