# Layout Components

Only the locale switcher lives here — the landing page's chrome (glass nav,
footer, sticky download bar) is in `src/components/landing/`, and the `/s/*`
share pages have their own shell in `src/components/app-links/share-shell.tsx`.

Keep structural navigation data (ids, hrefs) in `src/config/site.ts`; all
user-facing copy lives in `messages/<locale>.json` (see `messages/README.md`).
