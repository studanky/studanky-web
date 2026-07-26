# Landing page — internal state, asset checklist & phase roadmap

Non-public working notes. The product specs live with the mobile app; this file
tracks the *web's* state and obligations.

## Current design direction (v2 — greenfield, 2026-07-10)

The v1 skeleton (basic shadcn cards) was scrapped entirely on the owner's
request. v2 is an Apple-like **liquid glass** design:

- Water-blue palette mirroring the Flutter app schemes (kept from v1 — the one
  approved decision that carried over).
- Glass utilities in `globals.css` (`glass`, `glass-deep`): translucent fill +
  `backdrop-filter: blur/saturate`, hairline light border, inset top highlight.
  Readability rules: glass only for nav/chips/highlight tiles; solid surfaces
  for long text and forms; `prefers-reduced-transparency` fallback to opaque;
  `prefers-reduced-motion` disables reveal/float animations.
- Real iOS screenshots are used in the hero, showcase, and manifest. The source
  screenshots are `1320x2868` PNGs in `public/app/screenshots/`; the display
  frame uses that exact aspect ratio.
- QR codes are generated live (`uqr`) from `https://studankyapp.cz/get`;
  `/get` is a platform redirect excluded from the locale proxy.
- Share page `/s/{id}`: dark "night water", **no scrolling on desktop** —
  spring facts left, dominant QR / store CTA right, curiosity teaser list.
- Newsletter: UI posts through a Next.js Server Action to the public Strapi
  signup endpoint — see `docs/newsletter.md`.

## Assets and release configuration

- [x] **App icon source** (`1024x1024 PNG`) → available in
      `public/brand/app-icon/`; generated `192` and `512` manifest icons.
- [x] **Real app screenshots** (`1320x2868 PNG`) → used in hero, showcase, and
      manifest screenshots.
- [x] **App Store ID** (numeric) → `siteConfig.appStoreId` (enables the iOS
      Smart App Banner) + `siteConfig.links.appStore` URL.
- [ ] **Google Play URL** → `siteConfig.links.googlePlay` (the `/get` redirect
      and store buttons pick both up automatically; QR codes never change).
- [x] **GitHub org/repo URL** → `siteConfig.links.github`.
- [ ] **Contact email** for the footer once there is one.
- [ ] **Lawyer-reviewed disclaimer wording** — copy follows the spec
      ("Tekoucí voda neznamená pitná voda…"), final ToS phrasing pending.
- [ ] **Strapi newsletter production controls** — public endpoint, no API token;
      confirm rate limiting, CORS origins, duplicate handling, and monitoring.
- [ ] Optional: real spring photo, screen-capture video, real tester quotes.

## Phase-driven page updates

The page currently describes **Phase 1 (MVP: read-only ČHMÚ data)**.

### When community reporting ships (QR codes, Phase 2)

- Roadmap section: move "Hlášení od lidí" to the "Nyní" chip; promote
  gamification to "Připravujeme".
- Bento: add reporting (QR scan, offline queue) as a real tile.
- FAQ: rewrite "Můžu přidat vlastní hlášení?" + the offline answer.
- Stats: add community-report counts once real numbers exist.
- Newsletter: send the launch announcement.

### When accounts/gamification ship (Phase 3)

- Roadmap → changelog-style block; explain points/leaderboard.
- Privacy policy is already live for store release; update it before enabling
  accounts, gamification, reporting, sync, analytics, or any new off-device data
  flow.

## SEO backlog

- [x] JSON-LD `MobileApplication` + `FAQPage` (localized, homepage).
- [x] hreflang / canonical / sitemap / robots.
- [x] Meta targeting "mapa studánek", "studánky v okolí".
- [ ] Submit to Google Search Console + Bing Webmaster after deploy.
- [ ] Later: small notes/blog section for long-tail queries ("kde doplnit vodu
      na výletě") — biggest realistic organic lever in this niche.
- [ ] Once stores are live: UTM parameters on store links; if analytics, prefer
      cookieless (Plausible/Umami) to avoid a consent banner.
