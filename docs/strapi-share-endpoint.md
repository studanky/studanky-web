# Spring preview API

Client contract for the public Strapi endpoint used by the `/s/{documentId}`
fallback page and its Open Graph image. The endpoint returns teaser data only;
full flow details and report history remain app-only.

## Request

```http
GET {STRAPI_API_BASE}/springs/:documentId/preview?locale=en-AU
Accept: application/json
```

With the production base URL this resolves to:

```text
https://api.studankyapp.cz/api/springs/:documentId/preview
```

- The endpoint is public and requires no authentication.
- `documentId` is the stable alphanumeric Strapi v5 document identifier, not a
  numeric database ID.
- `locale` is optional at the API level. The web always sends the complete active
  language tag, such as `cs`, `en`, `en-US`, or `en-AU`; it does not shorten
  regional variants before sending them.
- The request has no body and the client sends only one locale request.

## Successful response

```json
{
  "data": {
    "documentId": "k9f2a7b3c1d0e8",
    "name": "Ostružná",
    "lat": 50.18,
    "lng": 17.05,
    "current_status": "is_flowing",
    "status_updated_at": "2026-05-31T05:00:00.000Z",
    "description": "A spring near the marked trail…",
    "photo": {
      "url": "https://api.studankyapp.cz/uploads/spring.jpg",
      "alternativeText": null,
      "width": 1600,
      "height": 1200,
      "thumbnail_url": "https://api.studankyapp.cz/uploads/thumbnail_spring.jpg"
    },
    "locale": "cs"
  }
}
```

This is a flat custom response under `data`; there is no Strapi `attributes`
wrapper.

| Field | Type | Nullable | Notes |
| --- | --- | ---: | --- |
| `documentId` | string | no | Stable Spring identifier |
| `name` | string | no | Canonical official name |
| `lat` / `lng` | number | no | WGS-84 coordinates |
| `current_status` | string | no | `is_flowing`, `is_not_flowing`, or `unknown` |
| `status_updated_at` | ISO-8601 string | yes | Latest status update |
| `description` | string | yes | Description from the served localization |
| `photo` | object | yes | Original and optional thumbnail metadata |
| `locale` | string | no | Locale actually served after backend fallback |

`photo.url` is required when `photo` is present. `alternativeText`, `width`,
`height`, and `thumbnail_url` are nullable. Relative media URLs are resolved
against the Strapi API origin, for example `/uploads/photo.jpg` becomes
`https://api.studankyapp.cz/uploads/photo.jpg`.

## Locale fallback

Fallback is owned entirely by Strapi and applies to a whole localization. It
tries the exact requested tag, compatible configured variants, the configured
base language, the Strapi default locale, and finally the Spring's immutable
source locale.

Consequently, a request for `en-AU` may validly return `data.locale: "cs"`. The
web stores a valid served locale and applies it as `lang` to the Strapi-provided
description. It does not retry with `en`, `cs`, or another locale. A null
localized `description` is valid; the localized UI fallback is then rendered
without the Strapi locale attribute.

## Errors

- `404` means there is no published Spring in the backend fallback chain and is
  rendered as the dedicated not-found state.
- `400`, `500`, other non-success responses, timeouts, invalid JSON, and success
  payloads without the presentational `name`/`lat`/`lng` fields produce the
  retryable generic fallback.
- `photo: null`, `description: null`, and `status_updated_at: null` are valid.

Although `documentId` and `locale` are required by the API contract, the web
keeps an otherwise useful preview working if either is missing or malformed. It
logs one metadata warning, falls back to the requested document ID, and leaves
the served locale unknown rather than assigning a potentially incorrect `lang`.

If the requested language tag itself is malformed, the web logs a warning and
uses its default locale for the single API request instead of dropping the
preview.

The web validates an incoming `documentId` before making a request and applies a
five-second timeout. GET responses are cached by Next.js for 300 seconds; because
the requested language tag is part of the URL, cache entries are locale-aware.

## Deliberately omitted data

The endpoint does not expose flow scale/rate, report history, water clarity,
odor, private capture coordinates, device identifiers, or `source_locale`.

## Implementation

- API client and response normalization: [`src/lib/springs.ts`](../src/lib/springs.ts)
- Language-tag selection: [`src/i18n/request-locale.ts`](../src/i18n/request-locale.ts)
- Deep-link page: [`src/app/s/[documentId]/page.tsx`](../src/app/s/%5BdocumentId%5D/page.tsx)
- Open Graph image: [`src/app/s/[documentId]/opengraph-image.tsx`](../src/app/s/%5BdocumentId%5D/opengraph-image.tsx)
