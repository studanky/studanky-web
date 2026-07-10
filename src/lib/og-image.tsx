import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const STATUS_TONE = {
  is_flowing: "#2f9e5f",
  is_not_flowing: "#d9822b",
  unknown: "rgba(255,255,255,0.22)",
} as const;

/**
 * Per-spring social card for `/s/{id}` shares. Uses the spring photo as the
 * background when available, otherwise a branded gradient — either way it ends
 * up 1200×630 with the spring name and a flow-status pill, so a shared link
 * renders a rich, consistent card in every chat app.
 */
export function renderSpringOgImage(opts: {
  name: string;
  statusLabel: string;
  status: keyof typeof STATUS_TONE;
  domain: string;
  photoUrl?: string;
}) {
  const tone = STATUS_TONE[opts.status];

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #2f6f4f, #1b3f2c)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {opts.photoUrl ? (
          // Rendered by Satori inside ImageResponse, not the DOM — next/image N/A.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={opts.photoUrl}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: opts.photoUrl
              ? "linear-gradient(180deg, rgba(12,28,18,0.25) 0%, rgba(12,28,18,0.82) 100%)"
              : "linear-gradient(180deg, rgba(12,28,18,0) 0%, rgba(12,28,18,0.35) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 72,
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#ffffff",
                color: "#2f6f4f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                fontWeight: 800,
              }}
            >
              S
            </div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Studánky</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 12,
                padding: "12px 24px",
                borderRadius: 999,
                background: tone,
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {opts.statusLabel}
            </div>
            <div style={{ display: "flex", maxWidth: 980, fontSize: 88, lineHeight: 1.02, fontWeight: 800, letterSpacing: -1 }}>
              {opts.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, color: "rgba(255,255,255,0.85)", fontSize: 28 }}>
              <div style={{ width: 16, height: 16, borderRadius: 999, background: "#9cd6a8" }} />
              {opts.domain}
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

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
