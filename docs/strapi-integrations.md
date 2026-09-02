# Strapi integrations

The web uses the public Strapi API for shared-spring previews and newsletter
subscriptions. Both integrations run on the server and share
`STRAPI_API_BASE`, which includes the `/api` suffix:

```text
https://api.studankyapp.cz/api
```

The browser never calls Strapi directly and no Strapi token is exposed to
client code.

## Spring Preview

The `/s/{documentId}` page and its generated Open Graph image use a public,
teaser-level endpoint. The backend intentionally omits report history, flow
rate, water quality, private coordinates, device identifiers, and other
app-only data.

### Wire request

```http
GET {STRAPI_API_BASE}/springs/:documentId/preview?locale=en-AU
Accept: application/json
```

- The endpoint requires no authentication.
- `documentId` is the stable alphanumeric Strapi document identifier, not a
  numeric database ID.
- The web makes one request with the complete selected BCP 47 language tag. It
  does not retry with alternate locales.
- An invalid incoming identifier returns the web's not-found state without a
  backend request.
- The request has a five-second timeout and a 300-second Next.js revalidation
  policy.

### Wire response

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
      "url": "/uploads/spring.jpg",
      "alternativeText": null,
      "width": 1600,
      "height": 1200,
      "thumbnail_url": "/uploads/thumbnail_spring.jpg"
    },
    "locale": "cs"
  }
}
```

The response is a flat custom object under `data`; it has no Strapi
`attributes` wrapper.

| Field | Wire type | Required for useful preview | Notes |
| --- | --- | ---: | --- |
| `documentId` | string | No | The web logs inconsistent metadata and keeps the requested ID. |
| `name` | string | Yes | Canonical display name. |
| `lat`, `lng` | number | Yes | WGS-84 coordinates. |
| `current_status` | string | No | `is_flowing`, `is_not_flowing`, or normalized to `unknown`. |
| `status_updated_at` | ISO-8601 string or null | No | Passed through as optional presentation data. |
| `description` | string or null | No | Text from the localization served by Strapi. |
| `photo` | object or null | No | A valid `http(s)` URL is required for the photo to be used. |
| `locale` | string | No | Complete locale actually served after backend fallback. |

Relative photo URLs are resolved against the Strapi origin. Invalid URLs and
malformed optional photo metadata are treated as a missing photo.

### Locale and result handling

Strapi owns whole-localization fallback. A request for `en-AU` may therefore
return `data.locale: "cs"`; the web accepts a valid returned locale and applies
it to the backend-provided description's `lang` attribute. If the requested
language tag is invalid, the web logs a warning and uses `defaultLocale` for its
single request.

The wire response is normalized into `SpringPreviewResult` in
`src/lib/springs.ts`:

| Condition | Web result |
| --- | --- |
| Valid payload with `name`, `lat`, and `lng` | `ok` with a normalized `SpringPreview` |
| Invalid document ID, HTTP `404`, or absent/null `data` | `not_found` |
| Timeout, transport failure, other non-success response, invalid JSON, or malformed required presentation fields | `error` |

All three results are renderable; backend failure must not crash the deep-link
route.

## Newsletter subscription

The public landing-page form invokes the Server Action in
`src/app/actions/newsletter.ts`. The action validates browser input, adds
server-owned metadata, and calls:

```http
POST {STRAPI_API_BASE}/newsletter/subscribe
Accept: application/json
Content-Type: application/json
```

### Request payload

```json
{
  "email": "user@example.com",
  "consent": true,
  "source": "prelaunch-page",
  "preferredLanguage": "cs",
  "consentVersion": "<privacyConsentVersion>",
  "sourceRef": "https://studankyapp.cz/#roadmap",
  "website": ""
}
```

- `email`, `consent`, `preferredLanguage`, and the honeypot value originate in
  the form and are validated by the Server Action.
- `source` and `sourceRef` come from `src/config/newsletter.ts`; the browser
  cannot override them.
- `consentVersion` comes from `privacyConsentVersion` in
  `src/config/legal.ts`. Update that source value when the privacy policy or
  consent wording materially changes; do not copy a date into this document.
- `website` is a honeypot. A non-empty value receives neutral success without a
  Strapi write.
- The payload is a top-level object, never `{ "data": { ... } }`.

Any Strapi `2xx` response maps to the same localized success state, including
stored, duplicate, or reactivated subscriptions. Invalid local email input maps
to `invalid`; rate limits, Strapi errors, timeouts, and misconfiguration map to
the generic `error` state. The UI does not reveal whether an address already
exists.

### Protection enforced by this web

- Email normalization and Zod validation.
- Explicit consent and supported-locale validation.
- Honeypot-neutral handling.
- Hashed-IP, process-local fixed windows of 5 attempts per minute and 100 per
  day.
- A five-second backend timeout and `no-store` fetch policy.
- A 32 KB Server Action body limit configured in `next.config.ts`.

The proxy chain must be trusted before forwarded IP headers are used for
security decisions. Process-local limiting resets on restart and is not shared
between replicas.

### Required backend controls

The following are Strapi/infrastructure responsibilities and are not guaranteed
by this repository:

- Validate and normalize every field independently of the web.
- Enforce a unique normalized email and idempotent duplicate responses.
- Rate-limit by normalized email or another backend-owned key.
- Store consent evidence and provide a working unsubscribe mechanism.
- Keep request-size limits small and protect both public services at the edge.
- Use double opt-in before sending campaigns.
- Monitor abuse, disposable domains, and bounce spikes.

CORS may reduce accidental browser access but is not an abuse-prevention or
authentication boundary.
