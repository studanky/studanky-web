# App Store / Play Store Banners

Site-wide promotion of the native mobile app from the website, using the right
mechanism per platform.

## Overview

The goal is the same across platforms — offer the native app to a web visitor —
but the implementation differs because iOS and Android provide different
capabilities.

| Platform | What the user sees | Implementation |
| --- | --- | --- |
| iOS (Safari) | Native **Smart App Banner** at the top of the page | `apple-itunes-app` meta tag via Next.js metadata |
| Android (Chrome) | Custom dismissible **in-page banner** at the top | [`AndroidAppBanner`](../src/components/app-links/android-app-banner.tsx) component |
| Any platform | — (signal only) | Web App Manifest `related_applications` |

A given user only ever sees **one** banner: iOS shows Apple's native bar,
Android shows our custom one. They never appear together.

## iOS Smart App Banner

Safari renders a native banner from the `apple-itunes-app` meta tag. It is not
related to Universal Links / AASA — it is a separate, opt-in mechanism.

- **Site-wide**: set via `metadata.itunes` in the [root layout](../src/app/layout.tsx),
  so it appears on every page.
- **Per-spring deep link**: the [`/s/*` page](../src/app/s/%5B%5B...slug%5D%5D/page.tsx)
  overrides `itunes` with an `app-argument` set to the specific spring URL, so
  tapping "Open" deep-links the app to the right content.
- **Gated on configuration**: renders only when
  [`siteConfig.appStoreId`](../src/config/site.ts) is set. Empty = no meta tag.

**Constraints:**

- Safari on iOS/iPadOS only — not Chrome on iOS, in-app webviews, or installed PWAs.
- Requires the **numeric App Store ID** (not the bundle ID), so the app must be
  published on the App Store.

## Android app banner

Chrome/Android no longer shows an automatic native install banner for related
apps, so we render our own: [`AndroidAppBanner`](../src/components/app-links/android-app-banner.tsx),
mounted site-wide in the [root layout](../src/app/layout.tsx).

- **Client-only detection** via `useSyncExternalStore`: the server snapshot is
  always `false`, so there is no hydration mismatch and pages stay statically
  renderable. The banner appears only in the browser, after checking the platform.
- **Shown when**: the user is on Android, `androidPackageId` is set, the site is
  not already running as an installed app (`display-mode: standalone`), and the
  banner has not been dismissed.
- **Dismissible**: closing persists to `localStorage`, with an in-memory
  session flag as a fallback so it also closes when storage is blocked
  (e.g. private mode).
- **Gated on configuration**: renders only when
  [`siteConfig.androidPackageId`](../src/config/site.ts) is set.

### Manifest signal

The [web app manifest](../src/app/manifest.ts) also declares the native app via
`related_applications` + `prefer_related_applications: true`. This is the
standards-based way to tell Chrome to prefer the native Google Play app (verified
through [`assetlinks.json`](../src/app/.well-known/assetlinks.json/route.ts)) over
installing the PWA. It is a signal only — it does not render a visible banner.

## Configuration

| Value | Location | Effect when empty |
| --- | --- | --- |
| `appStoreId` (numeric) | [`src/config/site.ts`](../src/config/site.ts) | iOS Smart App Banner is not rendered |
| `androidPackageId` | [`src/config/site.ts`](../src/config/site.ts) | Android banner **and** manifest `related_applications` are disabled |

Both banners are therefore feature-flagged by config: fill in the value to
enable, clear it to disable.

## Best-practice notes

- **Google intrusive-interstitial compliance**: the Android banner is a thin,
  dismissible top bar that pushes content down rather than covering it, and
  dismissal persists. This is the banner category Google explicitly exempts from
  its mobile intrusive-interstitial penalty. Keep it lightweight — do not turn it
  into a full-screen overlay.
- **Accessibility**: `role="region"` with an `aria-label`, a labelled close
  button, and `motion-reduce:animate-none` on the entrance animation.
- **Do not nag**: the standalone-display guard avoids showing the banner to users
  who already added the site as an app.
