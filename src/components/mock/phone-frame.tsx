import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Device frame for the hand-crafted app mocks. Metallic gradient body, deep
 * shadow, notch — the app UI renders inside as plain markup, so the whole
 * "screenshot" is code until real captures replace it (see docs/landing-roadmap.md).
 */
export function PhoneFrame({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <figure
      role="img"
      aria-label={label}
      className={cn("relative m-0 w-full max-w-[300px]", className)}
    >
      <div className="rounded-[3rem] bg-gradient-to-b from-[oklch(0.38_0.03_252)] via-[oklch(0.26_0.04_256)] to-[oklch(0.2_0.04_258)] p-2.5 shadow-2xl shadow-deep/40 ring-1 ring-white/25">
        <div className="relative aspect-9/19 overflow-hidden rounded-[2.35rem] bg-background">
          {children}
          {/* Notch */}
          <div
            aria-hidden="true"
            className="absolute top-2.5 left-1/2 z-20 h-5 w-22 -translate-x-1/2 rounded-full bg-deep/95"
          />
        </div>
      </div>
    </figure>
  );
}
