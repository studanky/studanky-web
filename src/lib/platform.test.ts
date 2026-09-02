import { describe, expect, it } from "vitest";

import { platformFromUserAgent } from "./platform";

const USER_AGENTS = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) " +
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
} as const;

describe("platformFromUserAgent", () => {
  it.each([
    ["iPhone", USER_AGENTS.iphone, "ios"],
    ["iPadOS in desktop mode", USER_AGENTS.ipadDesktop, "ios"],
    ["Android", USER_AGENTS.android, "android"],
    ["a real Mac", USER_AGENTS.mac, "other"],
  ] as const)("detects %s", (_device, userAgent, expected) => {
    expect(platformFromUserAgent(userAgent)).toBe(expected);
  });
});
