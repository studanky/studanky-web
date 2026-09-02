import { describe, expect, it } from "vitest";

import { matchAcceptLanguagePreference, matchLanguageTagForLocale } from "./config";

describe("matchAcceptLanguagePreference", () => {
  it("canonicalizes and keeps the complete matching language tag for APIs", () => {
    expect(matchAcceptLanguagePreference("EN-au,en;q=0.9,cs;q=0.8")).toEqual({
      locale: "en",
      languageTag: "en-AU",
    });
  });

  it("uses the highest-ranked tag that has a supported UI locale", () => {
    expect(matchAcceptLanguagePreference("de-DE,en-US;q=0.9,en;q=0.8")).toEqual({
      locale: "en",
      languageTag: "en-US",
    });
  });

  it("falls back safely when no supported well-formed tag is present", () => {
    expect(matchAcceptLanguagePreference("*,en-,en_US;q=0.9")).toEqual({
      locale: "cs",
      languageTag: "cs",
    });
  });

  it("preserves source order when quality values are equal", () => {
    expect(matchAcceptLanguagePreference("en-AU;q=0.8,cs-CZ;q=0.8")).toEqual({
      locale: "en",
      languageTag: "en-AU",
    });
  });

  it("discards an out-of-range qvalue instead of letting it outrank valid entries", () => {
    expect(matchAcceptLanguagePreference("en-AU;q=1.5,cs-CZ;q=0.9")).toEqual({
      locale: "cs",
      languageTag: "cs-CZ",
    });
  });

  it("bounds the number of Accept-Language entries parsed in the proxy hot path", () => {
    const header = [...Array.from({ length: 20 }, () => "de-DE"), "en-AU"].join(",");

    expect(matchAcceptLanguagePreference(header)).toEqual({
      locale: "cs",
      languageTag: "cs",
    });
  });
});

describe("matchLanguageTagForLocale", () => {
  it("finds a full browser tag matching an explicitly selected UI locale", () => {
    expect(matchLanguageTagForLocale("cs-CZ,en-AU;q=0.9,en;q=0.8", "en")).toBe(
      "en-AU",
    );
  });

  it("falls back to the selected locale when no matching browser tag exists", () => {
    expect(matchLanguageTagForLocale("cs-CZ", "en")).toBe("en");
  });
});
