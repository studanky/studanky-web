import { siteConfig } from "./site";

/** Server-owned attribution values sent by the current newsletter action. */
export const newsletterSource = {
  id: "prelaunch-page",
  ref: `${siteConfig.url}/#roadmap`,
} as const;
