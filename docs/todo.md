# TODO

Long-lived release checklist for the web and store-facing integration.

## Release

- [ ] Legal review: have a lawyer review privacy policy, terms of use, data
  sources, and contact pages before publishing the app.
- [ ] Store legal URLs: use the generic unprefixed URLs in App Store Connect /
  Play Console (`/privacy-policy`, `/terms-of-use`, `/contact`). The proxy
  redirects them by browser language.
- [ ] Enter store declarations: copy the final tables from
  `docs/store-privacy-declarations.md` into App Store Connect and Play Console.
- [ ] Permissions text: verify iOS and Android permission strings explain
  location use as map centering/current-position only.
- [ ] No analytics/cookie banner assumption: if analytics, ads, remarketing, or
  non-technical cookies are added, implement consent and update legal docs.

## Android Release

- [ ] Paste the public Google Play listing URL into
  `siteConfig.links.googlePlay`. This enables Android `/download` redirects, the
  landing-page CTAs and badges, Android banner, and manifest
  `related_applications`; it also automatically returns the landing page to
  static generation because User-Agent detection is no longer needed.
- [ ] After configuring Google Play, run `pnpm build` and verify that the route
  table reports `● /[locale]` (SSG), not `ƒ /[locale]` (dynamic rendering).
- [ ] Verify Android fingerprints in `assetlinks.json` use the Play App Signing
  SHA-256 certificate, not only upload/debug keys.
- [ ] Verify the Android package id still matches `cz.studankyapp.studanky`.

## Deep Links And Backend

- [ ] Verify the iOS appID in AASA matches the Apple Developer Team ID and
  bundle ID used by the released app.
- [ ] Verify deployed association endpoints return `200`, `application/json`,
  and `redirs=0`:

  ```bash
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/apple-app-site-association
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/assetlinks.json
  ```

- [ ] Ensure the apex `studankyapp.cz` serves `.well-known/*` without redirect,
  with a valid HTTPS certificate and no basic auth.
- [ ] Set `STRAPI_API_BASE` in production to the public Strapi API base,
  including `/api`.
- [ ] Confirm the Strapi newsletter endpoint stores consent evidence and has a
  working unsubscribe mechanism.

## Future Features

- [ ] Before enabling reports, QR scanning, photo upload, offline queue, or
  GPS-backed submissions, update privacy policy, terms, App Privacy, and Data
  Safety with the exact payload, retention, deletion process, and user-content
  licence.
- [ ] Before enabling accounts/login, add in-app account deletion and update the
  legal/store declarations.
- [ ] Before caching Mapy.com suggest/autocomplete results, verify the API terms
  explicitly allow it.
