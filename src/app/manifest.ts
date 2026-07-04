import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "cs-CZ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6fbf5",
    theme_color: "#2f6f4f",
    categories: ["navigation", "travel", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    screenshots: [
      {
        src: "/app/screenshot-map.svg",
        sizes: "390x844",
        type: "image/svg+xml",
        form_factor: "narrow",
        label: "Mapa studánek v okolí",
      },
      {
        src: "/app/screenshot-detail.svg",
        sizes: "390x844",
        type: "image/svg+xml",
        form_factor: "narrow",
        label: "Detail studánky s průtokem vody",
      },
    ],
  };
}
