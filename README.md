# Studánky Web

Landing page for the Studánky mobile app, built with Next.js App Router and Tailwind CSS.

## Documentation

Feature docs describing what the web app supports:

- [Deep Linking — Universal Links & App Links](docs/deep-linking.md) — how shared `/s/{id}` links open in the native app, with a platform-aware web fallback that previews the shared spring (fetched from Strapi) and links to the stores.
- [App Store / Play Store Banners](docs/app-banners.md) — site-wide native-app promotion: iOS Smart App Banner, custom Android banner, and the manifest `related_applications` signal.
- [Strapi share endpoint (backend brief)](docs/strapi-share-endpoint.md) — the contract for the public Strapi `preview` endpoint that feeds the `/s/{id}` fallback; a handoff for the backend/Strapi team.
- [Newsletter signup](docs/newsletter.md) — frontend-to-Strapi contract for the public newsletter form and abuse-prevention notes.
- [Store privacy declarations](docs/store-privacy-declarations.md) — verified Apple App Privacy / Google Play Data Safety answers, kept consistent with the published privacy policy (Mapy.com judgment calls closed July 2026).
- [Web assets](docs/assets.md) — source app icon and screenshot locations, generated PWA icon sizes, and screenshot aspect-ratio notes.

## TODO (before production)

Legal, privacy, and store submission:

- [x] **Replace legal placeholders** — done 2026-07-17: operator identity and contact filled in, retention periods set (technical logs 30 days, consent evidence 3 years), recipients rewritten to match production infrastructure (operator's own CZ server behind Cloudflare; USA transfer under DPF + SCCs), effective date and newsletter consent version centralized in `src/config/legal.ts`.
- [ ] **Legal review** — have a lawyer review `https://studankyapp.cz/privacy-policy`, `https://studankyapp.cz/terms-of-use`, `https://studankyapp.cz/data-sources`, and `https://studankyapp.cz/contact` before publishing the app.
- [ ] **Store URLs** — use the generic unprefixed URLs in App Store Connect / Play Console. The proxy redirects them by browser language: privacy policy `https://studankyapp.cz/privacy-policy`, terms `https://studankyapp.cz/terms-of-use`, contact `https://studankyapp.cz/contact`.
- [x] **App Privacy / Data Safety classification** — resolved; the final, verified declarations live in [docs/store-privacy-declarations.md](docs/store-privacy-declarations.md) (July 2026: Seznam.cz privacy rules and REST API terms reviewed — no DPA in the API terms, so Mapy.com traffic is declared as third-party collection; location and camera not collected).
- [ ] **Enter store declarations** — during submission, copy the tables from [docs/store-privacy-declarations.md](docs/store-privacy-declarations.md) into App Store Connect (App Privacy) and Play Console (Data Safety) exactly as written.
- [ ] **Mapy.com data handling** — before release, resolve the known risk around any in-memory cache of Mapy.com suggest/autocomplete results. Mapy.com terms prohibit caching/storing map tiles and API function results unless explicitly allowed. Also verify tile caching is disabled, API keys are restricted to the app identifiers, and attribution is visible exactly as required.
- [ ] **Permissions text** — verify iOS and Android permission strings clearly explain location use: showing current position and centering the map. Do not include camera permission in the public build unless QR scanning becomes reachable.
- [ ] **Reports / QR flow** — before enabling a QR scanner, report form, photo upload, offline queue, timestamp/GPS submission, or QR-based report submission, update privacy policy, terms, App Privacy, and Data Safety with the exact payload, legal basis, retention, deletion process, anonymity/pseudonymity, and licence to user reports.
- [ ] **Accounts and auth stack** — if account creation or login becomes reachable from UI, add in-app account deletion and update privacy policy, terms, App Privacy, and Data Safety. If auth code stays unreachable, do not claim that the public app has accounts.
- [ ] **Newsletter backend** — confirm the Strapi backend stores consent evidence (the web now sends `consentVersion` = privacy-policy effective date, `2026-07-17`) and provides a working unsubscribe mechanism; the published policy promises 3-year consent-evidence retention after unsubscribe. If newsletter tracking or analytics is added later, update privacy/cookie disclosures.
- [ ] **No analytics/cookie banner assumption** — the current web uses only technical preference storage (`NEXT_LOCALE`, Android banner dismissal) plus newsletter submission. If analytics, ads, remarketing, or non-technical cookies are added, implement consent and update the legal documents.

Deep linking (Universal Links / App Links) + `/s/*` fallback page:

- [ ] **Android Play URL** — `src/config/site.ts` already contains the live App Store URL. Keep `links.googlePlay` empty until Android is public; then paste the public Google Play listing URL there. It propagates to `/get`, store badges, the Android banner, and the manifest signal.
- [ ] **Verify Android fingerprints** — `src/app/.well-known/assetlinks.json/route.ts` must include the **App signing key** SHA-256 from the Play Console (App integrity), not just the upload/debug key.
- [ ] **Verify iOS appID** — `TEAMID.BundleID` in `src/app/.well-known/apple-app-site-association/route.ts` must match the Apple Developer account and the `applinks:studankyapp.cz` entitlement.
- [x] **iOS Smart App Banner** — numeric App Store ID `6778837458` is set in `src/config/site.ts`.
- [ ] **Android app banner** — `src/config/site.ts` (`androidPackageId`) is pre-filled with `cz.studankyapp.studanky`, but the banner and manifest signal stay disabled while `links.googlePlay` is empty.
- [ ] **Verify endpoints after deploy** (must return `200`, `application/json`, `redirs=0`):

  ```bash
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/apple-app-site-association
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/assetlinks.json
  ```

- [ ] **Coolify / Traefik** — ensure the apex `studankyapp.cz` serves `.well-known` **without redirecting** to `www` (otherwise deep links break); valid HTTPS cert; no basic-auth in front of `.well-known`.
- [ ] **`STRAPI_API_BASE` env** — set it in Coolify to the public Strapi API base (incl. `/api`) so newsletter signup works and the `/s/{id}` fallback shows real spring data. Confirm the endpoint contracts with the Strapi team ([docs/newsletter.md](docs/newsletter.md), [docs/strapi-share-endpoint.md](docs/strapi-share-endpoint.md)).

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm

## Environment variables

Local values go in `.env.local` (git-ignored). Copy the template and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `STRAPI_API_BASE` | Yes | Base URL of the public Strapi API (incl. `/api`). Used by newsletter signup and by the deep-link preview page — see [docs/newsletter.md](docs/newsletter.md) and [docs/strapi-share-endpoint.md](docs/strapi-share-endpoint.md). Without it, newsletter signup fails and `/s/{id}` degrades to a generic install page. |

Production values are configured in Coolify, not in a committed file. See
[`.env.example`](.env.example) for the documented shape.

## Deployment

The production build uses Next.js standalone output and starts the traced server
with `node .next/standalone/server.js`.

Coolify Nixpacks settings:

- `Build Pack`: `Nixpacks`
- `Ports Exposes`: `3000`
- `Is it a static site?`: disabled
- `STRAPI_API_BASE`: set as a runtime environment variable

The repository `nixpacks.toml` pins Node.js 22, activates pnpm 11 via Corepack,
copies the standalone static assets, and overrides the start command.

## Development

```bash
cp .env.example .env.local   # first time only
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
