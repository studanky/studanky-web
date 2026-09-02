# Localization

The site uses always-prefixed content URLs and typed JSON message catalogs.
All user-facing copy, including accessible names and image alternative text,
lives in `messages/<locale>.json`.

## Sources of truth

- `src/i18n/config.ts` defines supported locales, locale metadata, the default
  fallback, and language matching.
- `src/i18n/dictionary.ts` defines the complete `Dictionary` shape.
- `src/i18n/dictionaries.ts` lazily loads catalogs for Server Components.
- `messages/validate.ts` makes TypeScript validate every catalog at compile
  time.
- `src/i18n/format.ts` renders strings containing `{placeholder}` tokens.

Only localized prose belongs in catalogs. URLs, icon names, image paths, store
identifiers, and other locale-independent structure belong in `src/config/` or
the component that owns the behavior.

## Add or change copy

1. Add or change the key in the `Dictionary` type.
2. Update the same key in every `messages/*.json` catalog.
3. Pass the smallest relevant dictionary subtree from the Server Component to
   the component that renders it.
4. Render template placeholders with `format()` rather than manual replacement.
5. Run `pnpm typecheck`; a missing, misspelled, or structurally incompatible key
   fails in `messages/validate.ts`.

Do not hardcode visible strings, `aria-label` values, or `alt` text in
components. Brand names, protocol values, identifiers, and deliberately hidden
form-control names are structural data rather than translated copy.

## Add a locale

1. Add the locale to `locales` and its HTML, Open Graph, and `hreflang` metadata
   to `localeMeta` in `src/i18n/config.ts`.
2. Add `messages/<locale>.json` with the complete `Dictionary` shape.
3. Import and register the catalog in `src/i18n/dictionaries.ts` and
   `messages/validate.ts`.
4. Add localized App Store and Google Play badge assets and register them in
   `src/config/assets.ts`; see [Web assets](assets.md).
5. Run `pnpm check` and `pnpm build` to verify catalog typing and generated
   routes.

Static params, canonical and alternate metadata, the sitemap, the language
switcher, and proxy matching derive from the locale configuration. They should
not maintain separate locale lists.

## Routing and language negotiation

Localized content always has a prefix: `/cs`, `/en`, and their child routes.
The bare `/` and unprefixed localizable pages redirect according to this order:

1. A valid `NEXT_LOCALE` preference cookie.
2. The best supported `Accept-Language` value.
3. `defaultLocale`.

The following stable integration routes are deliberately outside
`app/[locale]/` and must not gain locale prefixes:

- `/s/*` resolves its UI language from the cookie and `Accept-Language`, while
  preserving a compatible complete language tag for Strapi.
- `/download` uses the same request preferences only when it needs a localized
  landing-page fallback.
- `/.well-known/*` serves machine-readable association documents.

Keep `src/proxy.ts` in `src/` beside the App Router. Moving it to the repository
root would prevent this project layout from applying the proxy convention.
