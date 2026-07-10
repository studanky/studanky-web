# Deep Linking — Universal Links & App Links

How shared Studánky links open directly in the native mobile app, with a web
fallback when the app is not installed.

## What it does

A shared spring link has the shape `https://studankyapp.cz/s/<id>`.

- **App installed** → the OS intercepts the URL and opens it in the native app
  (iOS Universal Links / Android App Links). The website is never shown.
- **App not installed** → the browser loads the [`/s/*` fallback page](#fallback-page),
  which offers the right download options for the user's platform.

## How it works

| Platform | Mechanism | Association file |
| --- | --- | --- |
| iOS | Universal Links | `apple-app-site-association` (AASA) |
| Android | App Links | `assetlinks.json` (Digital Asset Links) |

Both files must be served over HTTPS from the domain's `/.well-known/` path,
return `Content-Type: application/json`, and must **not** redirect (no 3xx).

### Association files (route handlers)

The files are implemented as Next.js **route handlers**, not static files in
`public/`:

- [`src/app/.well-known/apple-app-site-association/route.ts`](../src/app/.well-known/apple-app-site-association/route.ts)
  - `appIDs`: `T8Z25PVJ78.cz.studankyapp.studanky` (`TeamID.BundleID`)
  - `components`: matches path pattern `/s/*`
- [`src/app/.well-known/assetlinks.json/route.ts`](../src/app/.well-known/assetlinks.json/route.ts)
  - `package_name`: `cz.studankyapp.studanky`
  - `sha256_cert_fingerprints`: signing-key fingerprints (Play App Signing +
    upload + debug)

**Why route handlers instead of `public/`:**

- `NextResponse.json()` guarantees `Content-Type: application/json` (a static
  file named `apple-app-site-association` has no extension, so it would be served
  as `application/octet-stream`).
- Status is always `200` with no redirect.
- They are part of the server bundle, so they survive an `output: "standalone"`
  Docker build without manually copying `public/` (relevant for the Coolify
  deployment).

### Endpoints

| URL | Must return |
| --- | --- |
| `https://studankyapp.cz/.well-known/apple-app-site-association` | `200`, `application/json`, no redirect |
| `https://studankyapp.cz/.well-known/assetlinks.json` | `200`, `application/json`, no redirect |

## Fallback page

Route: [`src/app/s/[documentId]/page.tsx`](../src/app/s/%5BdocumentId%5D/page.tsx).
A deep link is always `/s/{documentId}`, so the segment is a required dynamic one
(a metadata `opengraph-image` file can't live under an optional catch-all).

The page fetches a **teaser-level** payload for the shared spring from Strapi
([`fetchSpringPreview`](../src/lib/springs.ts)) and renders one of three states:

| `fetchSpringPreview` result | Renders | Notes |
| --- | --- | --- |
| `ok` | [`SpringPreview`](../src/components/app-links/spring-preview.tsx) | photo (or placeholder), flow status + "updated X ago", name, description, copyable coordinates, an "in the app you get more" teaser, and the store CTA |
| `not_found` (404 / unknown / malformed id) | [`SpringNotFound`](../src/components/app-links/spring-not-found.tsx) | friendly "spring not found" screen that still keeps the install CTA |
| `error` (Strapi unreachable) | [`AppFallback`](../src/components/app-links/app-fallback.tsx) | generic install page — the route never crashes on a backend outage |

- **Contract & data source:** the public Strapi endpoint is documented in
  [`docs/strapi-share-endpoint.md`](./strapi-share-endpoint.md); its base URL comes
  from the `STRAPI_API_BASE` env var. Fetches are cached (`revalidate: 300`) so
  preview crawlers don't hammer the backend.
- **OG card:** a per-spring social card is generated server-side at
  [`s/[documentId]/opengraph-image.tsx`](../src/app/s/%5BdocumentId%5D/opengraph-image.tsx)
  (spring photo as background when present, branded gradient otherwise) so shares
  render a rich card in every chat app.
- **Security:** untrusted spring `name`/`description` go through React
  auto-escaping; `photo.url` is validated as an absolute `http(s)` URL and the
  `documentId` against an alphanumeric format (see `src/lib/springs.ts`).
- **Platform detection is server-side** via [`detectPlatform()`](../src/lib/platform.ts):
  iOS → App Store badge, Android → Google Play, desktop → both + QR. There is no
  auto-redirect (an installed app would have intercepted the link already).
- The page is `robots: noindex, nofollow` (per-share links are not indexed) and,
  because it reads headers, renders dynamically per request.
- **Future `/r/{id}` (QR → report)** reuses the same `fetchSpringPreview` layer;
  only the fallback copy differs.

## Configuration

| Value | Location |
| --- | --- |
| iOS `TeamID.BundleID` | [`apple-app-site-association/route.ts`](../src/app/.well-known/apple-app-site-association/route.ts) |
| Matched path pattern (`/s/*`) | same file, `components` |
| Android package + fingerprints | [`assetlinks.json/route.ts`](../src/app/.well-known/assetlinks.json/route.ts) |
| Store links (badges) | [`src/config/site.ts`](../src/config/site.ts) → `links.appStore`, `links.googlePlay` |
| iOS App Store numeric ID (Smart App Banner) | [`src/config/site.ts`](../src/config/site.ts) → `appStoreId` (empty until published) |
| Strapi preview API base | `STRAPI_API_BASE` env var (e.g. Coolify) |

## Verification

Run after every deploy — all three must show `200`, `application/json`, `redirs=0`:

```bash
curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
  https://studankyapp.cz/.well-known/apple-app-site-association
curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
  https://studankyapp.cz/.well-known/assetlinks.json
```

Cross-check what the platforms actually see:

```bash
# What Apple's CDN has cached:
curl -s https://app-site-association.cdn-apple.com/a/v1/studankyapp.cz

# Google Digital Asset Links statement tester:
curl -s "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://studankyapp.cz&relation=delegate_permission/common.handle_all_urls"
```

## Caveats

- **AASA must be unsigned JSON** (iOS 9.3+) and the file has **no extension**.
- **Apple CDN cache**: Apple fetches the AASA via its CDN and caches it (up to
  ~24 h for production/TestFlight). For testing on an installed app, enable
  *Developer Mode → Associated Domains* on the device and use
  `applinks:studankyapp.cz?mode=developer` to bypass the CDN.
- **Android fingerprints**: must include the **App signing key** SHA-256 from the
  Play Console (App integrity), not just the upload/debug key.
- **Apex vs. `www` redirect**: the entitlement domain (`applinks:studankyapp.cz`)
  must serve `.well-known` **without** redirecting to `www` (or vice versa),
  otherwise the deep links break. On the Coolify/Traefik deployment, make sure the
  apex serves the files directly, with a valid HTTPS cert and no basic-auth in
  front of `.well-known`.
