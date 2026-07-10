import { siteConfig } from "@/config/site";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage, renderSpringOgImage } from "@/lib/og-image";
import { fetchSpringPreview } from "@/lib/springs";

// Per-share social card for `/s/{documentId}`. Crawlers fetch this separately
// from the HTML and never run JS, so the card is fully generated server-side.
// Kept in the default locale for a stable image; resolves against the
// `metadataBase` set in `s/layout.tsx`.

const domain = siteConfig.url.replace("https://", "");

export async function generateImageMetadata() {
  const dict = await getDictionary(defaultLocale);
  return [{ id: "spring", alt: dict.og.alt, size: OG_SIZE, contentType: OG_CONTENT_TYPE }];
}

export default async function Image({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const dict = await getDictionary(defaultLocale);
  const result = await fetchSpringPreview(documentId, defaultLocale);

  if (result.status === "ok") {
    const { spring } = result;
    const statusKey =
      spring.currentStatus === "is_flowing"
        ? "isFlowing"
        : spring.currentStatus === "is_not_flowing"
          ? "isNotFlowing"
          : "unknown";

    return renderSpringOgImage({
      name: spring.name,
      statusLabel: dict.springPreview.status[statusKey],
      status: spring.currentStatus,
      domain,
      photoUrl: spring.photo?.url,
    });
  }

  // Unknown spring / Strapi down → generic brand card.
  return renderOgImage({
    name: siteConfig.name,
    subtitle: dict.og.subtitle,
    title: dict.og.title,
    description: dict.og.description,
    domain,
  });
}
