import {
  getRedirectUrl,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "./proxy";

describe("proxy matcher", () => {
  it.each(["/get", "/get/legacy"])("localizes the retired path %s like any unknown route", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(true);
  });

  it("still localizes regular unprefixed pages", () => {
    expect(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/privacy" }),
    ).toBe(true);
  });
});

describe("unprefixed unknown routes", () => {
  it("redirects /get into the regular localized 404 flow", () => {
    const response = proxy(
      new NextRequest("https://studankyapp.cz/get", {
        headers: { "accept-language": "cs" },
      }),
    );

    expect(response.status).toBe(307);
    expect(getRedirectUrl(response)).toBe("https://studankyapp.cz/cs/get");
  });
});
