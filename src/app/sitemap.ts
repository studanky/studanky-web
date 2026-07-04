import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

const lastModified = new Date("2026-07-04T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
