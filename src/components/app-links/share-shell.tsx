import type { ReactNode } from "react";
import Link from "next/link";
import { DropletsIcon } from "lucide-react";

import { siteConfig } from "@/config/site";

/**
 * Light "daylight water" shell for every `/s/*` page — same world as the
 * landing page. Drifting water glows (and an optional blurred spring photo as
 * atmosphere), a minimal brand header, content vertically centred so the page
 * works without scrolling on desktop, and a one-line footer.
 */
export function ShareShell({
  children,
  backdrop,
  footer,
  backHomeLabel,
}: {
  children: ReactNode;
  /** Optional full-bleed backdrop (e.g. blurred spring photo). */
  backdrop?: ReactNode;
  /** Extra footer line (e.g. potability disclaimer). */
  footer?: ReactNode;
  backHomeLabel: string;
}) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      {backdrop}
      {/* Water glows above the backdrop, below the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-[-12%] size-[38rem] rounded-full bg-water/20 blur-3xl motion-safe:animate-drift" />
        <div className="absolute right-[-16%] bottom-[-16rem] size-[40rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center px-4 pt-5 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-b from-water to-primary text-white">
            <DropletsIcon aria-hidden="true" className="size-4" />
          </span>
          {siteConfig.name}
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-8 sm:px-6">
        {children}
      </main>

      <footer className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-1 px-4 pb-5 text-center sm:px-6">
        {footer}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name} ·{" "}
          <Link
            href="/"
            className="rounded outline-none underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {backHomeLabel}
          </Link>
        </p>
      </footer>
    </div>
  );
}
