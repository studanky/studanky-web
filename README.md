# Studánky Web

Landing page for the Studánky mobile app, built with Next.js App Router and Tailwind CSS.

## Documentation

Long-term project docs:

- [TODO](docs/todo.md) — release checklist and future work that must survive across sessions.
- [Deep Linking — Universal Links & App Links](docs/deep-linking.md) — how shared `/s/{id}` links open in the native app, with a platform-aware web fallback.
- [Strapi share endpoint (backend brief)](docs/strapi-share-endpoint.md) — the contract for the public Strapi `preview` endpoint that feeds the `/s/{id}` fallback; a handoff for the backend/Strapi team.
- [Newsletter signup](docs/newsletter.md) — frontend-to-Strapi contract for the public newsletter form and abuse-prevention notes.
- [Store privacy declarations](docs/store-privacy-declarations.md) — Apple App Privacy / Google Play Data Safety answers kept consistent with the published privacy policy.
- [Web assets](docs/assets.md) — source app icon, store badges, screenshot locations, and regeneration notes.

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
│   ├── layout/          # Shared layout primitives such as the language switcher
│   └── ui/              # shadcn/ui source components
├── config/              # Site URL, navigation, global links
├── i18n/                # Locale config, dictionary loading, request helpers
├── lib/                 # Shared utilities and server helpers
├── types/               # Shared TypeScript contracts
└── proxy.ts             # Locale detection + prefix redirects (Next.js proxy)

messages/                # Translation catalogs, one JSON per locale — see messages/README.md

public/
├── app/                 # Screenshots, store badges, QR code
└── brand/               # App icon and derived PWA icons

docs/                    # Long-term contracts, release notes, and TODOs
```

Landing copy is localized: all user-facing text lives in `messages/<locale>.json` (typed by `Dictionary` in `src/i18n/`) and is rendered from Server Components, so catalogs never reach the client bundle. Dynamic Strapi-backed content can be added later from Server Components without exposing API tokens to the browser.
