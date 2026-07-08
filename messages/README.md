# Messages (translations)

All user-facing copy lives here as one JSON catalog per locale (`cs.json`, `en.json`). Components never hardcode strings — they receive them, typed by `Dictionary` (`src/i18n/dictionary.ts`), through props.

## Add or change a string

1. Add the key to the `Dictionary` type **and to every** `*.json` catalog.
2. `validate.ts` makes `pnpm typecheck` fail if any catalog is missing a key, so translations can't drift.
3. Templates use `{placeholder}` tokens — render them with `format()` (`src/i18n/format.ts`).

Structural data (hrefs, icon names, image paths) stays out of the catalogs — see `src/config/site.ts` and the section components.

## Add a locale

1. Add the code to `locales` and `localeMeta` in `src/i18n/config.ts` (TypeScript then forces you to wire it in `dictionaries.ts`).
2. Copy `cs.json` to `messages/<code>.json` and translate it; import it in `dictionaries.ts` and `validate.ts`.

Static params, the proxy, hreflang, the sitemap and the language switcher all derive from `locales` — nothing else changes.

## Routing

Always-prefixed: `/cs`, `/en`. The bare `/` is **not** a content URL — `src/proxy.ts` redirects it to the visitor's locale (`NEXT_LOCALE` cookie → `Accept-Language` → `defaultLocale`). Changing `defaultLocale` therefore migrates no URLs.

`src/proxy.ts` must stay in `src/` (next to `app/`) or it silently never runs. Deep-link routes (`/s/*`) and `.well-known/*` live outside `app/[locale]/` so their paths — registered in the native apps — never change.
