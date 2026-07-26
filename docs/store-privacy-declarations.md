# Store privacy declarations — Apple App Privacy & Google Play Data Safety

Single source of truth for filling in the **Apple App Privacy** ("nutrition
label") and **Google Play Data Safety** forms so they never contradict the
published privacy policy (`/cs/privacy-policy`, `/en/privacy-policy`). Store
reviewers cross-check the forms against the policy and the app binary; every
change to data flows must update the policy first (bump `legalDocumentMeta`
and `privacyConsentVersion` in `src/config/legal.ts`), then both forms.

Scope: **MVP** — read-only app, no user accounts, no ads, no analytics, no
crash reporting, no camera/QR scanning, no user-generated content. The website
newsletter is **out of scope** for both forms (they cover the app only).

## Data flows the declarations are based on

| Flow | Where it goes | Retained? |
| --- | --- | --- |
| Device location | Stays on device (map centering only) | Never leaves the device |
| Favourite springs | Stays on device | Local storage only |
| Map tiles, search, autocomplete | Mapy.com / Seznam.cz servers (IP address, request parameters, queries, viewport) | Served in real time; Seznam.cz additionally processes statistical, technical, and user-activity data as an independent controller |
| Spring data requests | Operator's backend (own infrastructure in CZ, behind Cloudflare) | Not logged by the backend; Cloudflare and the operator's reverse proxy keep technical access logs for at most 30 days |

## Apple — App Privacy (App Store Connect)

**Do not declare "Data Not Collected".** Apple's definition of collection
includes data collected by third parties through the app, and the privacy
policy itself discloses that Seznam.cz processes statistical/technical/user
data for its map services.

| Label question | Answer | Rationale |
| --- | --- | --- |
| Location (precise/coarse) | **Not collected** | Processed on-device only; tile serving is real-time request servicing, which Apple's definition exempts |
| Search History | **Collected** — Not linked to identity — App Functionality | In-app place search queries are processed by the map provider |
| Usage Data → Product Interaction | **Collected** — Not linked to identity — App Functionality, Analytics | Seznam.cz's own statistical processing of map service usage |
| Identifiers, Contact Info, User Content, Diagnostics, all others | **Not collected** | No accounts, no UGC, no crash reporting |
| Used for tracking (ATT) | **No** | No cross-app/advertising linkage; no ATT prompt needed |

Privacy manifest (`PrivacyInfo.xcprivacy`) in the Flutter app:

- `NSPrivacyCollectedDataTypes`: mirror the two collected rows above.
- `NSPrivacyTrackingDomains`: empty.
- Required-reason APIs: covered by the manifests of the Flutter plugins in
  use (verify each plugin ships one).

## Google Play — Data Safety (Play Console)

| Form question | Answer | Rationale |
| --- | --- | --- |
| Collects or shares required data types? | **Yes** | See rows below |
| Location (approximate/precise) | **Not collected** | On-device processing; ephemeral serving of tiles falls under Google's ephemeral exemption |
| App activity → In-app search history | **Collected & shared** — purpose App Functionality — optional (user-initiated) | Queries are transmitted to Seznam.cz, which acts as an independent controller (an independent controller does not qualify for the service-provider carve-out from "sharing") |
| All other data types (personal info, photos, files, device IDs…) | **Not collected** | No accounts, no UGC, no analytics |
| Data encrypted in transit | **Yes** | HTTPS everywhere |
| Deletion request mechanism | **N/A for developer-collected data** | The operator retains nothing; on-device data is deleted by uninstalling |

Account deletion requirement: **not applicable** (the app has no accounts).

## Verification of the judgment calls (July 2026) — CLOSED

Both formerly open rows were verified against the Seznam.cz documentation in
force in July 2026 and are **final as declared above**. Sources reviewed:

- Mapy.com privacy rules — <https://o-seznam.cz/pravni-informace/ochrana-udaju/mapy-com/>
- REST API Mapy.com Terms and Conditions (in force since 2025-06-01) —
  <https://developer.mapy.com/terms-and-conditions/>
- Developer FAQ — <https://developer.mapy.com/frequently-asked-questions/> (no privacy content)
- Seznam.cz privacy index and business-partner rules —
  <https://o-seznam.cz/pravni-informace/ochrana-udaju/> (no API/end-user document exists)

**1. Apple "Usage Data" / "Search History" — rows stay (required, not merely
cautious).** The privacy rules describe processing of "statistické, technické
a uživatelské údaje" for map services but state no retention periods and claim
anonymization only for navigation tracks/traffic data — not for service usage
statistics. Apple's collection definition exempts only real-time request
servicing; Seznam's own documentation gives no basis for that exemption, so
declaring these categories is the only accurate option.

**2. Google "shared" flag on search queries — stays.** The service-provider
carve-out is ruled out: the API Terms contain **no data processing agreement
and no GDPR Art. 28 processor commitments**; Art. 7.2 covers only the
Customer's own account data, and Art. 5.6 reserves logging/monitoring of
Service usage for Seznam's *own* purposes. The privacy rules declare Seznam an
independent controller ("Správce"). The only alternative would be the
*user-initiated action* exemption (the user types the query and Mapy.com
attribution is visible on the map) — defensible, but it depends on a
"reasonable expectation" judgment by a Play reviewer, so we keep the
declaration; over-declaring costs nothing.

Supporting note: API Terms Art. 7.5 obliges the Customer to inform individuals
about processing connected with the Service — the Mapy.com disclosures in our
privacy policy fulfil exactly this obligation, and the Art. 4.6.2 prohibitions
(no caching, storing, scraping, pre-caching, exporting of tiles/API results)
match the wording of our Terms of Use and Data Sources pages.

Re-open this section only if Seznam.cz publishes an API-specific DPA or
documents anonymization/retention of its API statistics.

## When Phase 2 (QR scanning, community reports) ships

Before release, in this order:

1. Extend the privacy policy: camera (on-device QR decoding, nothing stored or
   transmitted), submitted reports (user content), and — if added — GPS
   capture with geofencing.
2. Bump `legalDocumentMeta.privacy` and `privacyConsentVersion`.
3. Update both store forms: Apple *User Content*; Google *App activity /
   App info and performance* as applicable; camera stays undeclared in both
   as long as frames are decoded on-device and discarded.
