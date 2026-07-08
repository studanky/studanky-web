# Studánky Web

Landing page for the Studánky mobile app, built with Next.js App Router and Tailwind CSS.

## Documentation

Feature docs describing what the web app supports:

- [Deep Linking — Universal Links & App Links](docs/deep-linking.md) — how shared `/s/*` links open in the native app, with a platform-aware web fallback (download page + QR).
- [App Store / Play Store Banners](docs/app-banners.md) — site-wide native-app promotion: iOS Smart App Banner, custom Android banner, and the manifest `related_applications` signal.

## TODO (before production)

Deep linking (Universal Links / App Links) + `/s/*` fallback page:

- [ ] **Real store URLs** — in `src/config/site.ts` (`links.appStore`, `links.googlePlay`) replace the `#app-store` / `#google-play` placeholders with the real App Store and Google Play links. They propagate to the landing page badges and the fallback page.
- [ ] **Verify Android fingerprints** — `src/app/.well-known/assetlinks.json/route.ts` must include the **App signing key** SHA-256 from the Play Console (App integrity), not just the upload/debug key.
- [ ] **Verify iOS appID** — `TEAMID.BundleID` in `src/app/.well-known/apple-app-site-association/route.ts` must match the Apple Developer account and the `applinks:studankyapp.cz` entitlement.
- [ ] **iOS Smart App Banner** — set the **numeric App Store ID** (not the bundle ID) in `src/config/site.ts` (`appStoreId`) once the app is published. Empty = banner is not rendered.
- [ ] **Android app banner** — `src/config/site.ts` (`androidPackageId`) is pre-filled with `cz.studankyapp.studanky`; verify the **Play listing is live** (otherwise "Open" leads to a non-existent page). Empty = disables both the banner and the manifest `related_applications`.
- [ ] **Verify endpoints after deploy** (must return `200`, `application/json`, `redirs=0`):

  ```bash
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/apple-app-site-association
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/assetlinks.json
  ```

- [ ] **Coolify / Traefik** — ensure the apex `studankyapp.cz` serves `.well-known` **without redirecting** to `www` (otherwise deep links break); valid HTTPS cert; no basic-auth in front of `.well-known`.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm check
pnpm build
```

## Project Structure

```text
src/
├── app/                 # App Router; localized routes under app/[locale]/
├── components/
│   ├── landing/         # Marketing page composition and sections
│   ├── layout/          # Header, footer, mobile nav, app badges, language switcher
│   └── ui/              # shadcn/ui source components
├── config/              # Site URL, navigation, global links
├── i18n/                # Locale config, dictionary loading, request helpers
├── lib/                 # Shared utilities and server helpers
├── types/               # Shared TypeScript contracts
└── proxy.ts             # Locale detection + prefix redirects (Next.js proxy)

messages/                # Translation catalogs, one JSON per locale — see messages/README.md

public/
├── app/                 # Screenshots, store badges, QR code
├── brand/               # Logo and brand marks
└── social/              # Static social sharing assets

docs/                    # Feature documentation (deep linking, app banners)
```

Landing copy is localized: all user-facing text lives in `messages/<locale>.json` (typed by `Dictionary` in `src/i18n/`) and is rendered from Server Components, so catalogs never reach the client bundle. Dynamic Strapi-backed content can be added later from Server Components without exposing API tokens to the browser.
