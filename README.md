# Studánky Web

Public web frontend for the Studánky mobile app. It provides the localized
marketing and legal pages, native-app download flow, shared-spring previews,
and newsletter signup.

The application uses the Next.js App Router, React, TypeScript, Tailwind CSS,
and pnpm. `package.json` is the source of truth for framework and dependency
versions.

## Documentation

- [Architecture](docs/architecture.md) — route families, component boundaries,
  data flows, and source-code ownership.
- [Localization](docs/localization.md) — typed dictionaries, adding copy or a
  locale, and locale-aware routing.
- [Strapi integrations](docs/strapi-integrations.md) — Spring Preview and
  newsletter API contracts and failure handling.
- [Deep linking and app downloads](docs/deep-linking.md) — Universal Links,
  App Links, association files, `/s/*`, and `/download`.
- [Deployment](docs/deployment.md) — standalone build, Coolify/Nixpacks
  configuration, and release checks.
- [Web assets](docs/assets.md) — source icons, generated icons, screenshots, and
  localized store badges.
- [Store privacy declarations](docs/store-privacy-declarations.md) — release
  runbook for Apple App Privacy and Google Play Data Safety.

Keep durable contracts, operational procedures, and non-obvious architectural
decisions in these documents. Active work belongs in the issue tracker, and
implementation details that are clear from the code should stay in the code.

## Requirements

- Node.js `>=20.19.0`
- pnpm 11, pinned by the `packageManager` field in `package.json`
- Corepack, recommended for activating the pinned pnpm version

## Local development

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The bare `/` redirects to
the preferred localized route, such as `/cs` or `/en`.

## Environment

Local values belong in `.env.local`, which is git-ignored. Production values
are configured in Coolify.

| Variable | Production requirement | Purpose |
| --- | --- | --- |
| `STRAPI_API_BASE` | Required for complete functionality | Public Strapi base URL including `/api`. Newsletter signup fails without it; shared-spring pages fall back to the generic app screen. |

See [`.env.example`](.env.example) and the
[Strapi integration contracts](docs/strapi-integrations.md) for the expected
shape and behavior.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Run a regular production build locally. |
| `pnpm lint` | Run ESLint. |
| `pnpm typecheck` | Run TypeScript without emitting files. |
| `pnpm test` | Run the Vitest suite once. |
| `pnpm docs:check` | Validate relative links in project Markdown files. |
| `pnpm check` | Run lint, type checking, tests, and documentation validation. |

The deployed standalone server uses a different start command; see
[Deployment](docs/deployment.md).

## Architecture at a glance

- `src/app/` owns routes, layouts, metadata, route handlers, and the newsletter
  Server Action.
- Server Components are the default. Small Client Component islands own browser
  interactions such as forms, dialogs, navigation, and banner dismissal.
- `src/components/` is organized by subsystem rather than by route file.
- `src/config/`, `src/i18n/`, and `src/lib/` hold structural configuration,
  localization, and shared server/domain logic respectively.
- `messages/` contains one typed JSON catalog per supported locale.
- `public/` contains source and generated web assets.

See [Architecture](docs/architecture.md) for the route map, dependency
boundaries, and documentation rules.
