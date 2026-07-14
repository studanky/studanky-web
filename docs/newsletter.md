# Newsletter signup

Public landing-page signup is handled by a Next.js Server Action, not directly
from the browser. The action validates the form, derives `sourceUrl` from the
request headers, and posts JSON to Strapi:

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
  "sourceUrl": "https://studankyapp.cz/cs",
  "website": ""
}
```

- `website` is the honeypot field. Real users leave it empty; filled values are
  treated as a neutral success without storing anything.
- `consent` is sent as `true`; missing or tampered consent is rejected before
  Strapi is called.
- `preferredLanguage` is the active locale (`cs`, `en`, later more).
- `source` is whitelisted in the action. The current landing-page form uses
  `prelaunch-page`.
- `consentVersion` is pinned to `2026-07-10`; update it whenever the consent
  wording materially changes.

## Response handling

Strapi returns a neutral success for stored, duplicate, reactivated, and
honeypot-neutral submissions:

```json
{ "data": { "ok": true } }
```

The UI always shows the same localized success message for any 2xx response and
does not expose whether the email already exists. A `400` maps to the localized
invalid-input state; other failures map to the generic retry state.

## Abuse prevention

The frontend can reduce casual abuse, but a public write endpoint must be
protected server-side. Recommended production controls:

- Keep browser traffic on the Next.js Server Action and do not expose any API
  token to the client.
- Rate-limit in front of Strapi by IP/subnet and by normalized email hash.
- Keep Strapi validation strict: email length/format, `consent === true`,
  whitelisted `source`, valid absolute `sourceUrl`, and empty `website`.
- Add a unique constraint on normalized email and keep duplicate responses
  idempotent.
- Consider Turnstile/hCaptcha only after suspicious velocity, verified
  server-side before writing.
- Use double opt-in before sending newsletter campaigns; store unconfirmed
  signups separately or mark them as unconfirmed.
- Limit CORS origins to the production web domains, while remembering CORS does
  not stop server-to-server or curl abuse.
- Add cleanup/monitoring for disposable domains, high-bounce domains, and spikes
  from one network.
