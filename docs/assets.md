# Web Assets

Source assets live in `public/`, but production-facing instructions should stay
in `docs/` because everything under `public/` is served as a static URL.

## App Icon

Source:

- `public/brand/app-icon/app-icon-1024.png` - square 1024x1024 PNG, no rounded
  corners baked in.

Generated web/PWA icons:

- `src/app/favicon.ico`
- `src/app/icon.png`
- `src/app/apple-icon.png`
- `public/brand/app-icon/icon-192.png`
- `public/brand/app-icon/icon-512.png`

The current PWA manifest exposes these icons as `purpose: "any"`. Do not mark
the pin-shaped transparent source as `maskable` unless a dedicated maskable
variant is prepared with the important artwork inside the safe zone.

If the source icon changes, regenerate the derived PNGs:

```bash
sips -z 512 512 public/brand/app-icon/app-icon-1024.png --out src/app/icon.png
sips -z 180 180 public/brand/app-icon/app-icon-1024.png --out src/app/apple-icon.png
sips -z 192 192 public/brand/app-icon/app-icon-1024.png --out public/brand/app-icon/icon-192.png
sips -z 512 512 public/brand/app-icon/app-icon-1024.png --out public/brand/app-icon/icon-512.png
ffmpeg -y -i public/brand/app-icon/app-icon-1024.png -vf scale=64:64 src/app/favicon.ico
```

## App Screenshots

Current source screenshots are iPhone portrait PNGs at 1320x2868:

- `public/app/screenshots/01-map.png`
- `public/app/screenshots/02-detail.png`
- `public/app/screenshots/03-history.png`

The shared ratio is `1320 / 2868`, and the UI frame uses that exact ratio to
avoid layout shift or cropping. If new screenshots use a different device size,
update `appScreenshotSize` in `src/config/assets.ts` together with the assets.

## Store Badges

Minimal localized badge assets:

- `public/app/store-badges/app-store/cs.svg`
- `public/app/store-badges/app-store/en.svg`
- `public/app/store-badges/google-play/cs.svg`
- `public/app/store-badges/google-play/en.svg`

Only the current web locales (`cs`, `en`) are kept. The original vendor bundles
contain many languages plus EPS files and should not be committed wholesale. If
a new web locale is added, add only that locale's SVG badge files and update
`storeBadgeAssets` in `src/config/assets.ts`.

The UI sizes store badges by height, not width. Apple and Google badges have
different aspect ratios, and equal visual height is the stable layout target.

## Update checklist

When replacing an asset:

1. Keep the source and derived files in their existing ownership directories.
2. Update `src/config/assets.ts` whenever a path, dimension, media type, or
   purpose changes.
3. Regenerate every derivative from the same source rather than editing
   generated files independently.
4. Preserve the screenshot aspect ratio in the UI and manifest metadata.
5. For a new locale, add only that locale's two store badge SVGs and register
   them in `storeBadgeAssets`.
6. Run `pnpm check` and `pnpm build`, then inspect the icon, manifest, landing
   screenshots, and store buttons in the production build.
