# Brief for the Strapi team — public "share" endpoint for deep links

Handoff for the backend/Strapi team. It is self-contained. The goal is a single
**public, minimal, safe** endpoint the web reads when a user shares a
`https://studankyapp.cz/s/{documentId}` link, to render a preview card (Open
Graph) in chat apps plus a visible preview on the fallback page.

> **Core principle:** the endpoint returns **only hand-picked (whitelisted)
> fields** — not the whole entity. It is public (no auth), so anything it returns
> is public on the internet. Do **not** expose the standard `spring.findOne` to
> the Public role; add a dedicated controller that assembles exactly the DTO
> below.

---

## 1. Endpoint

```http
GET {STRAPI_API_BASE}/springs/:documentId/preview?locale=cs
```

- Method: `GET`, no authentication (public role, this endpoint only).
- `:documentId` = the spring's Strapi v5 documentId (alphanumeric).
- `locale` (optional) selects which localized `name`/`description` to return;
  defaults to the i18n default.
- Pick the final path to match your conventions
  (`/springs/:documentId/preview`, `/springs/:documentId/share-card`, …) — just
  give us the **exact URL**.

---

## 2. Response 200 (published spring)

```jsonc
{
  "data": {
    "documentId": "abc123",
    "name": "Ostružná",                       // string, required
    "lat": 50.18,                              // number, required
    "lng": 17.05,                              // number, required
    "current_status": "is_flowing",            // enum: is_flowing | is_not_flowing | unknown
    "status_updated_at": "2026-05-31T05:00:00.000Z", // ISO 8601 | null
    "description": "Spring by the blue trail…", // string | null
    "photo": {                                 // whole object null when no photo
      "url": "https://cdn.studankyapp.cz/uploads/ostruzna.jpg", // ABSOLUTE https
      "alternativeText": null,                 // string | null
      "width": 1600,                           // number
      "height": 900,                           // number
      "thumbnail_url": "https://cdn.studankyapp.cz/uploads/thumbnail_ostruzna.jpg" // string | null
    }
  }
}
```

These fields are the **minimal set for a preview card**. If any field does not
make sense to expose publicly, say so and we drop it. Nothing "extra" (internal
status, owner/B2B fields, moderation, `createdBy`, audit) belongs in the DTO.

---

## 3. Response 404 / errors

- **Unknown / unpublished / deleted spring** → `404` (not 200-with-empty, not 500):

```jsonc
{ "error": { "status": 404, "name": "NotFoundError", "message": "Spring not found" } }
```

- **Malformed `:documentId`** (bad format) → also `404` (not 500).
- **Internal error** → `500` with the consistent JSON shape above. The web renders
  a generic page on both 404 and 500, so above all **don't fail without JSON**.

---

## 4. `current_status` vocabulary

The web maps each value to a localized label + colour/icon on the card. The
values in use are `is_flowing`, `is_not_flowing`, `unknown`. **If more states can
be returned, send us the full list** so we don't guess. If you'd rather not
expose the status at all, let us know — we'll build the card from name +
description + photo only.

---

## 5. Security requirements (mandatory)

- **Public role for this endpoint only.** Do not enable public `find`/`findOne`
  over the whole spring entity.
- **Published entries only.** Draft / unpublished / soft-deleted → 404. No leaking
  of in-progress springs.
- **Field whitelist.** The controller builds the DTO explicitly; never spread the
  whole entity into the response.
- **No PII / B2B / internal fields** in the output (spring owner, contacts,
  internal notes, moderation…).

---

## 6. Photo — absolute https URL

- `photo.url` **must be an absolute `https://` URL** (an OG image with a relative
  URL does not work). If the provider stores a relative path (local uploads),
  prefix it with the public Strapi/CDN host in the controller.
- Include `width` + `height` (the card renders better and doesn't reflow).
- Ideally return a reasonably sized image (the original or `formats.large`,
  ~1200 px wide is plenty). The web generates the final 1200×630 card itself, so
  it doesn't need exactly 1200×630 — just a decently sized source.

---

## 7. Decision to confirm: `lat`/`lng` coordinates

Are you OK returning the spring's exact coordinates in the public DTO? The app
shares them anyway (finding nearby springs is its whole point), so from a product
standpoint it's probably fine, and it lets us show a copyable coordinate pair /
mini map on the card. But it's **your call** — if not, we drop coordinates from
what we display. Please confirm what is OK to expose.

---

## 8. Caching and performance

- Preview bots (WhatsApp, iMessage, Telegram…) fetch these URLs **repeatedly**.
  The endpoint should be **cache-friendly**: `Cache-Control: public, max-age=300`
  (5 min is enough), ideally with `ETag` / conditional-request support.
- **One query, no N+1.** Populate only `photo` + location, nothing else.
- The endpoint must be cheap — it can be hit in bursts by crawlers.

---

## 9. CORS (optional)

The web fetches **server-side** (from Next.js), so browser CORS does not apply.
Still, allow the `https://studankyapp.cz` origin just in case we ever fetch from
the browser.

---

## 10. Acceptance criteria (how we'll verify)

- [ ] `GET …/springs/{real-published-id}/preview` → `200`, JSON exactly per §2,
      `photo.url` an absolute `https://`.
- [ ] `GET …/springs/{nonexistent-id}/preview` → `404` with the JSON error, not
      500, not 200.
- [ ] `GET …/springs/{unpublished-id}/preview` → `404` (no draft leakage).
- [ ] Spring **without a photo** → `photo: null`, endpoint doesn't crash.
- [ ] The response contains **no** internal/owner/moderation fields.
- [ ] The `Cache-Control` header is set.
- [ ] The `current_status` vocabulary (§4) is confirmed.

Verification command:

```bash
curl -s "{STRAPI_API_BASE}/springs/<id>/preview" | jq .
```

---

## 11. What we need back from you (summary)

1. The **exact URL** of the finished endpoint + `STRAPI_API_BASE` (prod, ideally
   staging too).
2. The **`current_status` vocabulary** (all possible values).
3. **Field confirmation** for coordinates (yes/no — §7) and anything you don't
   want to expose.
4. The **photo format** we should treat as the card image (original vs.
   `formats.large`).
5. Store links are unrelated to this — the data endpoint is independent of the app
   being live in the stores.
