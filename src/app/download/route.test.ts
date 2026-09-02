import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "./route";
import { resolveDownloadTarget } from "./resolve-download-target";

const APP_STORE_URL = "https://apps.apple.com/app/id123456789";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=cz.example.app";
const EMPTY_GOOGLE_PLAY_URL = "";

const USER_AGENTS = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) " +
    "AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
  ipad:
    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) " +
    "AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
  ipadDesktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) " +
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  mac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) " +
    "AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
} as const;

function downloadRequest({
  userAgent = USER_AGENTS.windows,
  acceptLanguage,
  cookie,
}: {
  userAgent?: string;
  acceptLanguage?: string;
  cookie?: string;
} = {}): NextRequest {
  const headers = new Headers({ "user-agent": userAgent });
  if (acceptLanguage) headers.set("accept-language", acceptLanguage);
  if (cookie) headers.set("cookie", cookie);

  return new NextRequest("http://localhost:3000/download", { headers });
}

const links = {
  appStore: APP_STORE_URL,
  googlePlay: EMPTY_GOOGLE_PLAY_URL,
};

describe("resolveDownloadTarget", () => {
  it.each([
    ["iPhone", USER_AGENTS.iphone],
    ["iPad", USER_AGENTS.ipad],
    ["iPadOS in desktop mode", USER_AGENTS.ipadDesktop],
  ])("redirects %s to the App Store", (_device, userAgent) => {
    expect(resolveDownloadTarget(downloadRequest({ userAgent }), links)).toBe(APP_STORE_URL);
  });

  it("does not mistake a real Mac for iPadOS", () => {
    expect(
      resolveDownloadTarget(downloadRequest({ userAgent: USER_AGENTS.mac }), links),
    ).toBe("/cs#download");
  });

  it("falls back to the localized landing page while Google Play is unavailable", () => {
    expect(
      resolveDownloadTarget(
        downloadRequest({
          userAgent: USER_AGENTS.android,
          acceptLanguage: "en-US,en;q=0.9",
        }),
        links,
      ),
    ).toBe("/en#download");
  });

  it("redirects Android to Google Play once its URL is configured", () => {
    expect(
      resolveDownloadTarget(downloadRequest({ userAgent: USER_AGENTS.android }), {
        ...links,
        googlePlay: GOOGLE_PLAY_URL,
      }),
    ).toBe(GOOGLE_PLAY_URL);
  });

  it.each(["play.google.com/store/apps/details?id=cz.example.app", "javascript:alert(1)"])(
    "falls back safely when a store URL is invalid: %s",
    (googlePlay) => {
      expect(
        resolveDownloadTarget(downloadRequest({ userAgent: USER_AGENTS.android }), {
          ...links,
          googlePlay,
        }),
      ).toBe("/cs#download");
    },
  );

  it("uses Accept-Language for a desktop visitor without a locale cookie", () => {
    expect(
      resolveDownloadTarget(
        downloadRequest({ acceptLanguage: "en-US,en;q=0.9,cs;q=0.8" }),
        links,
      ),
    ).toBe("/en#download");
  });

  it("prefers a valid locale cookie over Accept-Language", () => {
    expect(
      resolveDownloadTarget(
        downloadRequest({ acceptLanguage: "cs", cookie: "NEXT_LOCALE=en" }),
        links,
      ),
    ).toBe("/en#download");
  });

  it("ignores an invalid locale cookie", () => {
    expect(
      resolveDownloadTarget(
        downloadRequest({ acceptLanguage: "en", cookie: "NEXT_LOCALE=de" }),
        links,
      ),
    ).toBe("/en#download");
  });
});

describe("GET /download", () => {
  it("returns a temporary redirect to the configured App Store", () => {
    const response = GET(downloadRequest({ userAgent: USER_AGENTS.iphone }));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://apps.apple.com/app/id6778837458",
    );
  });

  it("keeps desktop fallback navigation on the current origin", () => {
    const response = GET(downloadRequest({ userAgent: USER_AGENTS.mac }));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("/cs#download");
  });

  it("prevents platform- and locale-dependent redirects from being cached", () => {
    const response = GET(downloadRequest());

    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("vary")).toBe("User-Agent, Accept-Language, Cookie");
  });
});
