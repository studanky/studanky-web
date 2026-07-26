/* eslint-disable @next/next/no-img-element */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Matches the app's spring-status palette (flowing blue / not-flowing warm red).
const STATUS_TONE = {
  is_flowing: "#0B97D2",
  is_not_flowing: "#EE5521",
  unknown: "rgba(255,255,255,0.22)",
} as const;

function getAppIconDataUrl() {
  try {
    const icon = readFileSync(join(process.cwd(), "public/brand/app-icon/icon-192.png"));
    return `data:image/png;base64,${icon.toString("base64")}`;
  } catch {
    return "";
  }
}

const appIconDataUrl = getAppIconDataUrl();

function OgAppIcon({
  size,
  radius,
  background,
}: {
  size: number;
  radius: number;
  background: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {appIconDataUrl ? (
        <img
          src={appIconDataUrl}
          alt=""
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      ) : (
        <div
          style={{
            color: "#0B97D2",
            fontSize: Math.round(size * 0.58),
            fontWeight: 800,
          }}
        >
          S
        </div>
      )}
    </div>
  );
}

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
          background: "linear-gradient(135deg, #255C83, #0A1628)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {opts.photoUrl ? (
          // Rendered by Satori inside ImageResponse, not the DOM — next/image N/A.
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
              ? "linear-gradient(180deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.82) 100%)"
              : "linear-gradient(180deg, rgba(10,22,40,0) 0%, rgba(10,22,40,0.35) 100%)",
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
            <OgAppIcon size={64} radius={18} background="#ffffff" />
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
              <div style={{ width: 16, height: 16, borderRadius: 999, background: "#60C1EE" }} />
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
          background: "#F0F4F8",
          color: "#12212E",
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
            border: "2px solid #CCE6F1",
            borderRadius: 40,
            padding: 56,
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <OgAppIcon size={72} radius={20} background="#E7F5FB" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 34, fontWeight: 700 }}>{strings.name}</div>
              <div style={{ color: "#4A6478", fontSize: 24 }}>{strings.subtitle}</div>
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
            <div style={{ maxWidth: 820, color: "#41586B", fontSize: 32, lineHeight: 1.35 }}>
              {strings.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#255C83",
              fontSize: 26,
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 999, background: "#0B97D2" }} />
            {strings.domain}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
