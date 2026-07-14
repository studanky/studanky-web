# Newsletter signup

Public landing-page signup is handled by a Next.js Server Action. The browser
does not post to Strapi directly. The action validates the form, rate-limits by
the visitor IP hash, and posts top-level camelCase JSON to Strapi:

```text
POST {STRAPI_API_BASE}/newsletter/subscribe
```

`STRAPI_API_BASE` includes the `/api` suffix, for example
`https://api.studankyapp.cz/api`.

## Request payload

```json
{
  "email": "user@example.com",
  "consent": true,
  "source": "prelaunch-page",
  "preferredLanguage": "cs",
  "consentVersion": "2026-07-10",
  "sourceRef": "https://studankyapp.cz/#roadmap",
  "website": ""
}
```

- `website` is the honeypot field. Real users leave it empty; filled values are
  treated as a neutral success without storing anything.
- `consent` is sent as `true`; missing or tampered consent is rejected before
  Strapi is called.
- `preferredLanguage` is the active locale (`cs`, `en`).
- `source` is whitelisted in the action. The current landing-page form uses
  `prelaunch-page`.
- `sourceRef` is whitelisted in the action. The current landing-page form uses
  `https://studankyapp.cz/#roadmap`. Do not put secrets, tokens, session data,
  or free user text into it.
- `consentVersion` is pinned to `2026-07-10`; update it whenever the consent
  wording materially changes.
- The Strapi request is a plain top-level object, never a REST envelope such as
  `{ "data": { ... } }`.

## Response handling

Strapi returns a neutral success for stored, duplicate, reactivated, and
honeypot-neutral submissions:

```json
{ "data": { "ok": true } }
```

The UI always shows the same localized success message for any 2xx response and
does not expose whether the email already exists. Local email validation maps to
the localized invalid-input state. Strapi `400`, Strapi `429`, Next rate limits,
and other failures map to the generic retry state.

## Abuse prevention

The web layer reduces casual abuse, but both public entry points must remain
protected: the Next Server Action can be called directly, and the Strapi endpoint
can also be called directly if it is publicly routable.

- Keep browser traffic on the Next.js Server Action and do not expose any API
  token to the client.
- The Next action applies an in-memory fixed-window IP limiter using a hashed
  IP key: 5 attempts/minute and 100 attempts/day. This is per process and resets
  on restart.
- Keep edge/proxy rate limiting in front of the deployed web/Strapi services;
  use the real client IP from a trusted proxy chain.
- Rate-limit in Strapi by normalized email hash as a second layer, especially
  because the Strapi endpoint is public.
- Keep Strapi validation strict: email length/format, `consent === true`,
  valid optional metadata lengths, and empty `website`.
- Add a unique constraint on normalized email and keep duplicate responses
  idempotent.
- Keep request body limits small at every layer. The Next Server Action parser
  limit is configured to 32 KB.
- Consider Turnstile/hCaptcha only after suspicious velocity, verified
  server-side before writing.
- Use double opt-in before sending newsletter campaigns; store unconfirmed
  signups separately or mark them as unconfirmed.
- Limit CORS origins to the production web domains, while remembering CORS does
  not stop server-to-server or curl abuse.
- Add cleanup/monitoring for disposable domains, high-bounce domains, and spikes
  from one network.
