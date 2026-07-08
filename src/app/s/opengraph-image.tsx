import { siteConfig } from "@/config/site";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

// Colocated OpenGraph image for the `/s/*` deep-link shares. Kept in the default
// locale for a stable social card (the page itself is per-share and noindex).
// Resolves against the `metadataBase` set in `s/layout.tsx`.

export async function generateImageMetadata() {
  const dict = await getDictionary(defaultLocale);
  return [{ id: "s-og", alt: dict.og.alt, size: OG_SIZE, contentType: OG_CONTENT_TYPE }];
}

export default async function Image() {
  const dict = await getDictionary(defaultLocale);

  return renderOgImage({
    name: siteConfig.name,
    subtitle: dict.og.subtitle,
    title: dict.og.title,
    description: dict.og.description,
    domain: siteConfig.url.replace("https://", ""),
  });
}
