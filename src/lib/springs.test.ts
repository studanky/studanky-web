import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const API_BASE = "https://api.studankyapp.cz/api";
const DOCUMENT_ID = "k9f2a7b3c1d0e8";

const previewData = {
  documentId: DOCUMENT_ID,
  name: "Ostružná",
  lat: 50.18,
  lng: 17.05,
  current_status: "is_flowing",
  status_updated_at: null,
  description: null,
  photo: {
    // Cover a relative media path both without (original) and with (thumbnail)
    // a leading slash; both must resolve against the Strapi origin.
    url: "uploads/spring.jpg",
    alternativeText: null,
    width: 1600,
    height: 1200,
    thumbnail_url: "/uploads/thumbnail_spring.jpg",
  },
  locale: "cs",
};

async function loadModule() {
  return import("./springs");
}

describe("fetchSpringPreview", () => {
  beforeEach(() => {
    vi.stubEnv("STRAPI_API_BASE", API_BASE);
    vi.resetModules();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("canonicalizes the complete language tag and stores the locale actually served", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({ data: previewData }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { fetchSpringPreview } = await loadModule();

    const result = await fetchSpringPreview(DOCUMENT_ID, "EN-au");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/springs/${DOCUMENT_ID}/preview?locale=en-AU`,
      expect.objectContaining({
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
        signal: expect.any(AbortSignal),
      }),
    );
    expect(result).toEqual({
      status: "ok",
      spring: {
        documentId: DOCUMENT_ID,
        locale: "cs",
        name: "Ostružná",
        latitude: 50.18,
        longitude: 17.05,
        currentStatus: "is_flowing",
        statusUpdatedAt: null,
        description: null,
        photo: {
          url: "https://api.studankyapp.cz/uploads/spring.jpg",
          alternativeText: null,
          width: 1600,
          height: 1200,
          thumbnailUrl: "https://api.studankyapp.cz/uploads/thumbnail_spring.jpg",
        },
      },
    });
  });

  it("keeps rendering when non-presentational response metadata is missing", async () => {
    const withoutMetadata: Record<string, unknown> = { ...previewData };
    delete withoutMetadata.documentId;
    delete withoutMetadata.locale;
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json({ data: withoutMetadata })),
    );
    const { fetchSpringPreview } = await loadModule();

    const result = await fetchSpringPreview(DOCUMENT_ID, "en-AU");

    expect(result).toMatchObject({
      status: "ok",
      spring: { documentId: DOCUMENT_ID, locale: null, name: "Ostružná" },
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/documentId.*locale/),
    );
  });

  it("falls back safely when response metadata is malformed or mismatched", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({
          data: { ...previewData, documentId: "anotherId", locale: "en_au" },
        }),
      ),
    );
    const { fetchSpringPreview } = await loadModule();

    const result = await fetchSpringPreview(DOCUMENT_ID, "en-AU");

    expect(result).toMatchObject({
      status: "ok",
      spring: { documentId: DOCUMENT_ID, locale: null, name: "Ostružná" },
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/documentId.*locale/),
    );
  });

  it("handles a valid preview without a photo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({ data: { ...previewData, photo: null } }),
      ),
    );
    const { fetchSpringPreview } = await loadModule();

    await expect(fetchSpringPreview(DOCUMENT_ID, "cs")).resolves.toMatchObject({
      status: "ok",
      spring: { photo: null },
    });
  });

  it("normalizes a trailing slash in STRAPI_API_BASE", async () => {
    vi.stubEnv("STRAPI_API_BASE", `${API_BASE}/`);
    vi.resetModules();
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({ data: previewData }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { fetchSpringPreview } = await loadModule();

    await fetchSpringPreview(DOCUMENT_ID, "cs");

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/springs/${DOCUMENT_ID}/preview?locale=cs`,
      expect.any(Object),
    );
  });

  it("maps a 404 to not_found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({ data: null, error: { status: 404 } }, { status: 404 }),
      ),
    );
    const { fetchSpringPreview } = await loadModule();

    await expect(fetchSpringPreview(DOCUMENT_ID, "cs")).resolves.toEqual({
      status: "not_found",
    });
  });

  it.each([400, 500])("maps HTTP %i to error", async (status) => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({ data: null, error: { status } }, { status }),
      ),
    );
    const { fetchSpringPreview } = await loadModule();

    await expect(fetchSpringPreview(DOCUMENT_ID, "cs")).resolves.toEqual({
      status: "error",
    });
  });

  it.each(["", "not a URL"])(
    "does not call fetch when STRAPI_API_BASE is missing or invalid: %j",
    async (apiBase) => {
      vi.stubEnv("STRAPI_API_BASE", apiBase);
      vi.resetModules();
      const fetchMock = vi.fn<typeof fetch>();
      vi.stubGlobal("fetch", fetchMock);
      const { fetchSpringPreview } = await loadModule();

      await expect(fetchSpringPreview(DOCUMENT_ID, "cs")).resolves.toEqual({
        status: "error",
      });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("falls back to the default locale for a malformed language tag", async () => {
    const invalidLanguageTag = `en-\n${"x".repeat(80)}`;
    const loggedLanguageTag = JSON.stringify(invalidLanguageTag.slice(0, 64));
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({ data: previewData }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { fetchSpringPreview } = await loadModule();

    await expect(fetchSpringPreview(DOCUMENT_ID, invalidLanguageTag)).resolves.toMatchObject({
      status: "ok",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/springs/${DOCUMENT_ID}/preview?locale=cs`,
      expect.any(Object),
    );
    expect(console.warn).toHaveBeenCalledWith(
      `Invalid Spring preview language tag ${loggedLanguageTag} for ${DOCUMENT_ID}; using the default locale cs.`,
    );
  });

  it("does not call Strapi for a malformed documentId", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    const { fetchSpringPreview } = await loadModule();

    await expect(fetchSpringPreview("not/valid", "cs")).resolves.toEqual({
      status: "not_found",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
