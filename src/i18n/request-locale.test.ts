import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookiesMock, headersMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  headersMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
  headers: headersMock,
}));

import { getRequestLanguagePreference } from "./request-locale";

function mockRequestPreferences(cookieLocale: string | undefined, acceptLanguage: string) {
  cookiesMock.mockResolvedValue({
    get: (name: string) =>
      name === "NEXT_LOCALE" && cookieLocale ? { value: cookieLocale } : undefined,
  });
  headersMock.mockResolvedValue(new Headers({ "accept-language": acceptLanguage }));
}

describe("getRequestLanguagePreference", () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    headersMock.mockReset();
  });

  it("keeps a full matching browser tag when the UI locale comes from a cookie", async () => {
    mockRequestPreferences("en", "cs-CZ,en-AU;q=0.9,en;q=0.8");

    await expect(getRequestLanguagePreference()).resolves.toEqual({
      locale: "en",
      languageTag: "en-AU",
    });
  });

  it("keeps an explicit cookie locale when the browser has no matching tag", async () => {
    mockRequestPreferences("en", "cs-CZ");

    await expect(getRequestLanguagePreference()).resolves.toEqual({
      locale: "en",
      languageTag: "en",
    });
  });
});
