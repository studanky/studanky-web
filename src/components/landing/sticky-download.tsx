"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Mobile-only glass download bar that slides in once the visitor scrolls past
 * the hero, keeping the primary CTA in thumb reach for the rest of the page.
 */
export function StickyDownload({ label, href }: { label: string; href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-[120%]",
      )}
    >
      <div className="glass rounded-full p-1.5">
        <a
          href={href}
          tabIndex={visible ? 0 : -1}
          className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
