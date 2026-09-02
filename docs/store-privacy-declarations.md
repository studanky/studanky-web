# Store privacy declarations

Release runbook for Apple App Privacy and Google Play Data Safety. This file is
the canonical working copy in the web repository because the localized privacy
policy is published here, but it is not legal advice and does not by itself
verify the mobile binary.

| Metadata | Value |
| --- | --- |
| Owner | Mobile release owner |
| Last documentation review | 2026-09-02 |
| Required verification | Before every mobile release and after every data-flow, SDK, provider, or policy change |

Before entering these answers in a store console, compare them with the actual
release binary, mobile permissions and manifests, third-party SDKs, backend and
proxy logging, and both localized privacy policies. Store-console answers must
be updated when behavior changes; they are not permanently final.

## Declared application state

These answers describe the current read-only app: no user accounts, advertising,
analytics, crash reporting, camera or QR scanning, or user-generated content.
The website newsletter is outside the mobile store forms.

| Data flow | Destination | Retention described by the policy |
| --- | --- | --- |
| Device location | On device, for map centering only | Never leaves the device |
| Favourite Springs | On device | Until removed, app data is cleared, or the app is uninstalled |
| Map tiles, search, autocomplete, and viewport | Mapy.com / Seznam.cz | Real-time service processing plus any processing disclosed by Seznam.cz as independent controller |
| Spring API requests | Operator infrastructure in Czechia behind Cloudflare | No application-level request retention; infrastructure access logs for at most 30 days |

## Apple App Privacy

Do not select **Data Not Collected** while third-party map-service usage remains
within the app and the provider processes usage data beyond servicing a request
in real time.

| App Store Connect category | Declaration | Purpose |
| --- | --- | --- |
| Location — precise/coarse | Not collected | Location is processed on device; verify that no SDK or request sends it off device. |
| Search History | Collected, not linked to identity | App Functionality |
| Usage Data — Product Interaction | Collected, not linked to identity | App Functionality, Analytics |
| Identifiers, Contact Info, User Content, Diagnostics, and other categories | Not collected | Valid only while the binary contains none of these flows. |
| Tracking | No | No cross-app advertising linkage or data-broker sharing. |

The app's `PrivacyInfo.xcprivacy` must agree with the declared collected data,
contain no tracking domains, and include all required-reason API declarations
from the app and its dependencies.

## Google Play Data Safety

| Play Console category | Declaration | Purpose and handling |
| --- | --- | --- |
| App collects or shares required data types | Yes | Map-service data is covered below. |
| Location — approximate/precise | Not collected | Location remains on device; re-check network payloads and SDK behavior for every release. |
| App activity — in-app search history | Collected and shared; optional | App Functionality; user-initiated queries go to Seznam.cz as an independent controller. |
| Other personal info, photos, files, device IDs, and other categories | Not collected | Valid only while the release binary contains none of these flows. |
| Data encrypted in transit | Yes | Verify HTTPS for every production endpoint. |
| Account deletion | Not applicable | The current app has no accounts. |

On-device data can be removed in the app, by clearing app data, or by
uninstalling. Reassess the deletion-answer flow before collecting any
developer-retained mobile data or enabling accounts.

## Review sources

Use current primary guidance rather than relying on this document's previous
interpretation:

- [Apple App Privacy details](https://developer.apple.com/app-store/app-privacy-details/)
- [Google Play Data Safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)
- [Mapy.com privacy rules](https://o-seznam.cz/pravni-informace/ochrana-udaju/mapy-com/)
- [Mapy.com REST API terms](https://developer.mapy.com/terms-and-conditions/)

Record a new review date above after checking all four sources and the release
implementation. Obtain professional legal review for the policy and any
uncertain classification.

## Change triggers and update order

Re-open the declarations before releasing any change involving analytics,
advertising, crash reporting, accounts, authentication, reports, free-form
content, photo upload, camera or QR scanning, precise-location submission,
offline queues, new SDKs, new infrastructure processors, or changed retention.

For each triggered review:

1. Inventory the release binary, permissions, SDKs, network payloads, and data
   retention.
2. Update both localized privacy policies and increment the applicable
   `legalDocumentMeta` and `privacyConsentVersion` values in
   `src/config/legal.ts`.
3. Update the tables in this runbook from current Apple, Google, and provider
   guidance.
4. Enter the same answers in App Store Connect and Play Console.
5. Record the review date and have the result reviewed by the release owner and,
   where appropriate, legal counsel.
