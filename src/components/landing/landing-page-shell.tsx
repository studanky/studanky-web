import type { ReactNode } from "react";

export function LandingPageShell({ children }: { children: ReactNode }) {
  return <main className="flex flex-1 flex-col">{children}</main>;
}
