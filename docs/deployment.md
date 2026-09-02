# Deployment

Production is self-hosted through Coolify using Nixpacks and the Next.js
standalone server output. The committed configuration files are authoritative;
this document explains how they fit together and what must be verified around a
release.

## Build and runtime

`next.config.ts` enables `output: "standalone"`. `nixpacks.toml`:

1. installs Node.js 22;
2. activates the pnpm version pinned in `package.json` through Corepack;
3. installs dependencies with the frozen lockfile;
4. runs `pnpm build`;
5. copies `public/` and `.next/static/` into the standalone output; and
6. starts `node .next/standalone/server.js` on `0.0.0.0:3000`.

The copies in step 5 are required because Next.js does not include those asset
directories in standalone output automatically. `pnpm start` remains useful for
testing a regular production build locally, but it is not the deployed start
command.

Coolify settings:

| Setting | Value |
| --- | --- |
| Build pack | Nixpacks |
| Exposed port | `3000` |
| Static site | Disabled |
| Runtime environment | `STRAPI_API_BASE` set |

The deployment currently relies on process-local newsletter rate limiting and
the default Next.js cache. Before running multiple web replicas, add shared rate
limiting and review cache coordination so behavior does not vary by instance.

## Environment

`STRAPI_API_BASE` is the only application-specific environment variable. It is
server-only and must contain the public Strapi base URL including `/api`.

- Local development: copy `.env.example` to the git-ignored `.env.local`.
- Production: configure the value in Coolify; never commit credentials or
  environment-specific secrets.
- Missing or invalid value: newsletter signup returns its generic error state,
  while shared-spring pages degrade to their generic app fallback.

See [Strapi integrations](strapi-integrations.md) for endpoint behavior.

## Pre-deploy checks

1. Install from the committed lockfile and run:

   ```bash
   pnpm check
   pnpm build
   ```

2. Confirm `STRAPI_API_BASE` is present in the target environment.
3. Review `src/config/site.ts` for the canonical site URL, live store URLs, App
   Store ID, and Android package ID.
4. For a mobile release, confirm the AASA app ID and Android fingerprints match
   the actual release signing identities; see
   [Deep linking and app downloads](deep-linking.md).
5. Confirm the localized privacy policy, terms, data-sources page, and contact
   page are current and professionally reviewed. Their generic store-console
   URLs may remain unprefixed because the proxy performs locale selection.
6. Complete the [store privacy declaration](store-privacy-declarations.md)
   review against the release binary before submitting either mobile app.

If analytics, advertising, remarketing, non-technical cookies, accounts, user
reports, uploads, or new off-device data flows are introduced, update the legal
documents and store declarations before deployment.

## Post-deploy checks

- Verify `/` redirects to a supported locale and `/cs` and `/en` render.
- Verify each localized legal route and its unprefixed redirect.
- Submit a newsletter test and confirm the neutral success behavior.
- Open `/s/{knownPublishedDocumentId}` with a real published Spring and verify
  the preview, metadata, and generic fallback behavior during a backend outage.
- Verify `/download` with iOS, Android, and desktop user agents.
- Run both association checks; each must return `200`, JSON, and zero redirects:

  ```bash
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/apple-app-site-association
  curl -sS -o /dev/null -w "%{http_code} ct=%{content_type} redirs=%{num_redirects}\n" \
    https://studankyapp.cz/.well-known/assetlinks.json
  ```

The apex domain must serve `/.well-known/*` directly over valid HTTPS without a
redirect to `www` and without authentication in front of the files. Platform
cache inspection and device-testing details live in
[Deep linking and app downloads](deep-linking.md).
