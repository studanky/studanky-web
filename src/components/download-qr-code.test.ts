import { describe, expect, it } from "vitest";

import { resolveDownloadUrl } from "./download-qr-code";

describe("resolveDownloadUrl", () => {
  it("uses the canonical site when no development origin is supplied", () => {
    expect(resolveDownloadUrl(null)).toBe("https://studankyapp.cz/download");
  });

  it("uses the actual local origin and port in development", () => {
    expect(resolveDownloadUrl("http://localhost:3001")).toBe(
      "http://localhost:3001/download",
    );
  });
});
