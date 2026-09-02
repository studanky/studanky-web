<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Localization

All user-facing copy lives in `messages/<locale>.json`, typed by `Dictionary` (`src/i18n/`). Never hardcode strings — including `aria-label` and `alt` — in components; add a key and pass it in via props. See `messages/README.md`.

Routing is always-prefixed (`/cs`, `/en`); `src/proxy.ts` (must stay in `src/`) redirects the bare `/`. Deep-link routes (`/s/*`) and `.well-known/*` stay outside `app/[locale]/` — don't move them.
