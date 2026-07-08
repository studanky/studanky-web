import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Renders the shared OpenGraph image. Text is passed in so both the localized
 * route (`app/[locale]/opengraph-image`) and the default fallback
 * (`app/opengraph-image`, used by `/s/*`) stay visually identical.
 */
export function renderOgImage(strings: {
  name: string;
  subtitle: string;
  title: string;
  description: string;
  domain: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6fbf5",
          color: "#14251a",
          fontFamily: "Arial, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "2px solid #c5d8c2",
            borderRadius: 40,
            padding: 56,
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "#2f6f4f",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                fontWeight: 700,
              }}
            >
              S
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 34, fontWeight: 700 }}>{strings.name}</div>
              <div style={{ color: "#5c705f", fontSize: 24 }}>{strings.subtitle}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                maxWidth: 860,
                fontSize: 74,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              {strings.title}
            </div>
            <div style={{ maxWidth: 820, color: "#415442", fontSize: 32, lineHeight: 1.35 }}>
              {strings.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#2f6f4f",
              fontSize: 26,
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 999, background: "#78a66b" }} />
            {strings.domain}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
