# Studánky Web

Landing page for the Studánky mobile app, built with Next.js App Router and Tailwind CSS.

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
├── app/                 # App Router entrypoints and metadata routes
├── components/
│   ├── landing/         # Marketing page composition and sections
│   ├── layout/          # Header, footer, mobile nav, app badges
│   └── ui/              # shadcn/ui source components
├── config/              # Site URL, navigation, global links
├── data/                # Typed static marketing content
├── lib/                 # Shared utilities and server helpers
└── types/               # Shared TypeScript contracts

public/
├── app/                 # Screenshots, store badges, QR code
├── brand/               # Logo and brand marks
└── social/              # Static social sharing assets
```

Current landing content is static and typed in `src/data/landing.ts`. Dynamic Strapi-backed content can be added later from Server Components without exposing API tokens to the browser.
