# Deep linking and app downloads

Shared Spring URLs open the native app when it is installed and provide a
localized web fallback otherwise. A separate stable download URL sends visitors
to the appropriate store without coupling QR codes to a store listing.

## URL flows

| URL | Native app installed | Native app unavailable |
| --- | --- | --- |
| `https://studankyapp.cz/s/{documentId}` | iOS Universal Links or Android App Links open the Spring detail. | The Next.js fallback renders a Spring preview or a resilient app-download state. |
| `https://studankyapp.cz/download` | Not intercepted by the app. | The route redirects to the platform store when configured, or to the localized landing-page download section. |

There is no browser-side auto-redirect from `/s/*`. If the operating system did
not intercept the Universal/App Link, the web fallback remains usable.

## Platform association

| Platform | Mechanism | Route Handler |
| --- | --- | --- |
| iOS | Universal Links / AASA | `src/app/.well-known/apple-app-site-association/route.ts` |
| Android | App Links / Digital Asset Links | `src/app/.well-known/assetlinks.json/route.ts` |

The association endpoints must be served from the apex domain over HTTPS with
status `200`, `Content-Type: application/json`, and no redirect. They are Route
Handlers rather than files in `public/` so the extensionless AASA response has
the correct media type and remains part of the standalone server bundle.

The AASA document matches `/s/*` and contains the Apple
`TeamID.BundleID`. The Digital Asset Links document contains the Android package
and SHA-256 signing-certificate fingerprints. Release values must be copied
from the actual Apple Developer and Play App Signing identities, not inferred
from upload or debug builds.

## Web fallback

`src/app/s/[documentId]/page.tsx` lives outside the localized route group so the
URL registered with both mobile platforms never changes. It:

1. resolves UI language from `NEXT_LOCALE` and `Accept-Language`;
2. fetches a teaser-level Spring Preview from Strapi;
3. renders preview, not-found, or backend-error UI; and
4. detects the platform on the server to choose App Store, Google Play, or both
   store options with a QR code.

The page is dynamically rendered because it reads request headers and cookies.
It is marked `noindex, nofollow`; per-Spring Open Graph images are generated in
`src/app/s/[documentId]/opengraph-image.tsx`.

The Strapi request and normalization rules are documented in
[Strapi integrations](strapi-integrations.md).

## Download and native-app promotion

`src/app/download/route.ts` returns a temporary `307` redirect selected from the
request's user agent:

- iOS goes to `siteConfig.links.appStore` when valid.
- Android goes to `siteConfig.links.googlePlay` when valid.
- Desktop, unknown platforms, and missing store URLs go to the localized
  `#download` section.

The response is not cached and varies by user agent, language, and locale
cookie. QR codes use this stable URL, so deployed store destinations can change
without regenerating printed codes.

Additional native promotion is configuration-gated:

- iOS Safari uses Next.js `metadata.itunes`; `/s/*` adds the current Spring URL
  as the app argument.
- Android uses the dismissible in-page `AndroidAppBanner` when the package and
  live Play URL are configured.
- The web manifest adds `related_applications` and
  `prefer_related_applications` only when Android configuration is complete.

## Configuration ownership

| Value | Source |
| --- | --- |
| Canonical site and store URLs | `src/config/site.ts` |
| iOS App Store numeric ID | `src/config/site.ts` |
| Android package ID | `src/config/site.ts` and the Digital Asset Links Route Handler |
| iOS `TeamID.BundleID` and `/s/*` match | AASA Route Handler |
| Android certificate fingerprints | Digital Asset Links Route Handler |
| Spring Preview API | `STRAPI_API_BASE`; see [Strapi integrations](strapi-integrations.md) |

Keep identifiers synchronized with the mobile release configuration. An empty
Play URL intentionally disables Android store promotion and preserves the
localized web fallback.

## Production verification

Run after every deployment. Both endpoints must report `200`, JSON, and zero
redirects:

```bash
curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
  https://studankyapp.cz/.well-known/apple-app-site-association
curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
  https://studankyapp.cz/.well-known/assetlinks.json
```

Inspect platform caches when diagnosing a mismatch:

```bash
curl -sS https://app-site-association.cdn-apple.com/a/v1/studankyapp.cz
curl -sS "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://studankyapp.cz&relation=delegate_permission/common.handle_all_urls"
```

Also test a known published `/s/{documentId}` on physical iOS and Android
devices with the release app installed, then test the same URL without the app.
Apple's CDN can cache AASA changes; Android must use the Play App Signing
certificate fingerprint. The apex domain must serve `/.well-known/*` directly,
without a `www` redirect or authentication layer.

See [Deployment](deployment.md) for the complete release checklist.
