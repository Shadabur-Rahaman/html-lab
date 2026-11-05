# HTML LAB private classroom setup

The private application uses the existing HTML LAB codebase, a dedicated Cloudflare Pages project, Cloudflare Access email PIN authentication and a separate HTML enrollment database. The public GitHub Pages site remains at its existing URL.

## Release status and privacy boundary

Implementation date: **5 November 2026**. The HTML-only enrollment schema, server gateway, teacher Student Management screen and separate private build are implemented. The Pages project is `html-lab-private`; both production and preview project settings use **fail closed**. The worker protects every document, asset and API request.

**Access-policy review and preview Access setup still require an authorized dashboard session.** The available Wrangler deployment credential was explicitly rejected when creating an Access application (HTTP 403, code 1010). Deployment credentials do not imply Access administration rights. Live inspection subsequently found that the production hostname already has a separate Access application and an email PIN form. Its actual HTML audience was verified as different from JS LAB's and installed in the server bindings. No saved policy rules or successful PIN delivery are claimed from that form alone. Preview/hash endpoints remain protected by the server identity/enrollment gate, but they did not redirect to an Access application in the unsigned checks. Real student PIN testing was deferred at the owner's request; a real teacher PIN session still needs verification.

The GitHub Pages copy remains public, including the same lessons and published classroom resources through the existing public resource API. Protecting the private domain does **not** make those copies private. Draft/unpublished resources remain restricted. Already downloaded files, exported projects, screenshots or previously delivered code cannot be erased remotely. Moving to private-only later requires explicit approval to retire the public deployment and public published-resource delivery; that change is not part of this release.

## Architecture and audit

The existing 12 chapters/36 lessons, advanced workshops, hash routes, local progress, project stores, editor, DOM Explorer, quizzes, presentations and cloud-resource metadata are reused. Student Management is at **`#teacher/students`**, with a teacher shortcut in the private account bar. Classroom Teacher Mode remains a presentation feature and does not grant server privileges.

Public and private domains have separate browser storage under the browser's origin rules. Existing public progress/drafts are not deleted or overwritten; they stay available at the public URL. Use the existing project ZIP export/import to move project files when needed. No automatic cross-domain progress migration is claimed.

JS LAB's bounded JWT gateway, CSRF protection, private resource proxy and UI session checks were reviewed/adapted. Its entire app was not copied. HTML uses:

| Purpose | HTML-specific component |
| --- | --- |
| Hosting | `html-lab-private.pages.dev`, its deployment hashes and preview aliases |
| Identity | Its own HTML Cloudflare Access audience(s); never the JS audience |
| Enrollment | `html_student_enrollments` |
| Audit | `html_enrollment_audit` |
| Server commands | `html_enrollment_authorize`, `html_enrollment_command` |
| Teacher membership | Existing `html_authorized_teachers`; only confirmed HTML admins are bootstrapped |
| Resources | Existing `html_*` resource tables and private `html-lab-resources` bucket |
| Gateway | `server/worker.mjs`, `server/access.mjs`, `server/resources.mjs` |

The deployed public HTML site and private JS site use the existing shared Supabase project. That verified backend is reused for private HTML enrollment/resources. No JS students are imported, and no JS grants, enrollments, resource records or cleanup schedule are changed. The same approved teacher can administer both labs, with independent application membership and audience validation.

Local `.env.local` points at an alternate existing project, while the public GitHub build points at the shared deployed backend. The local file was preserved. Owner-terminal private scripts deliberately read ignored **`.env.private.local`** so this discrepancy cannot silently redirect the private release. Only its two public settings are stored there. A preparation of two empty enrollment tables in the alternate project was left unused, as requested by the owner; no records were created there and no pre-existing resource tables were changed. Production authorization does not use that alternate schema.

## Backend migration

Migrations: `supabase/migrations/202611050001_html_private_classroom.sql` and `202611050002_html_identity_observation.sql`.

It adds only the HTML enrollment/audit tables and service-only functions, enables RLS and denies anonymous/authenticated direct table access. It does not change the existing public resource policies. Enrollment fields include normalized email, name, role, status, approval actor/time, UTC start/expiry, suspension/revocation timestamps, a verified Access subject binding, observed verification/login/activity timestamps and an optimistic version.

Only existing confirmed `html_authorized_teachers` admins are mapped into HTML enrollment administration. No first-visitor bootstrap and no browser-supplied admin role exist. Removing the HTML admin grant also blocks that administrator at the enrollment gateway.

For a fresh setup, copy `.env.private.example` to ignored `.env.private.local`, using the **verified deployed backend's public** URL and publishable key. Use an owner terminal already signed in to the official Supabase CLI:

```sh
npm ci
node scripts/deploy-html-enrollments.mjs --confirm-add-html-enrollment
```

The helper applies the migration only if absent and verifies an existing HTML administrator. It obtains the server key only in process memory using the owner's current CLI authorization; it never prints or saves that key. If no approved HTML teacher exists, authorize a confirmed HTML teacher through the existing resource setup procedure before proceeding. Never copy JS student records to bootstrap HTML access.

`supabase/tests/bootstrap.sql` creates mock Auth/Storage tables for disposable local/CI PostgreSQL only. **Do not run that file against hosted Supabase.** It is not the deployment migration.

## Create and protect the Pages project

The dedicated project uses production branch `main`, build output `dist-private`, and `wrangler.jsonc`. Keep the existing public build in `dist`.

```sh
npm run build:private
npx wrangler pages deploy dist-private --project-name html-lab-private --branch main
```

For an authenticated preview test, deploy the same protected artifact to a non-production branch such as `security-check` and retain its exact deployment-hash and branch-alias URLs. Never upload a bare static private build without `_worker.js` and the catch-all `_routes.json`.

In **Workers & Pages → html-lab-private → Settings → Runtime**, verify **fail closed**, not fail open, for both environments. This prevents Functions quota/runtime failure from falling back to unguarded static files. The project API field is `deployment_configs.production.fail_open=false` and likewise for preview. Verify it again after deployment.

The private `_routes.json` must contain exactly:

```json
{"version":1,"include":["/*"],"exclude":[]}
```

No asset, media, PDF worker/font/WASM or alternate document route is excluded. Authenticated responses use private/no-store browser and CDN headers, strip cache validators and deny framing. Offline lesson caching is disabled only for the private build; the public offline option remains. This minimizes new cached copies but cannot recall bytes already delivered.

## Cloudflare Access: production and previews

Use the same Zero Trust account/team as JS LAB, **without editing JS LAB applications or policies**. Open Cloudflare → **Zero Trust → Access → Applications**.

Cloudflare's Pages-specific workflow matters: **Workers & Pages → html-lab-private → Settings → General → Enable access policy** initially protects **previews only**. It does not by itself protect `html-lab-private.pages.dev`. This project's production hostname already redirects to the existing team's PIN form; **preserve that existing application and do not add a duplicate production destination**.

For the current project:

1. In Zero Trust Access applications, find the existing **`html-lab-private.pages.dev`** destination. Verify its AUD matches the observed production value `6e74faf7a9d459208cc5a96f6fc1f19b87beab9d96fd0229e400204265b94b46`. Name it **HTML LAB — Private Classroom** if needed, without replacing it or adding another production destination.
2. Review its exact-email teacher/student policies and PIN provider as described below.
3. In the Pages project's General settings, enable its access policy to generate preview protection if it is absent. If an HTML preview application already exists, inspect and reuse it instead. Name it **HTML LAB — Private Classroom Previews**.
4. Verify the preview application's destination is **`*.html-lab-private.pages.dev`**, including deployment hashes and branch aliases. Use Pages' supported hostname controls rather than forcing a wildcard into a dropdown. A wildcard alone does not cover the production apex.
5. Attach the HTML-only policies below to **both** applications. Review generated defaults; there must be no Everyone, Bypass, broad email-domain or service-token policy granting classroom access. Record the preview application's own AUD and add it to the server configuration.

For a different fresh project with no production application, follow the [Pages known-issues procedure](https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain): generate preview protection, convert that generated destination from wildcard to production, then enable Pages access policy again for a separate preview app. That conversion is unnecessary for this project's already existing production app.

Configure a **1 hour** application session initially. Under Login methods, select the existing **One-time PIN** provider. If it is not offered, enable it under the team's authentication/login-method settings first. Use PIN email authentication, not a Cloudflare-account login requirement. Disable acceptance of unrelated default providers for these HTML apps if the dashboard offers that option. Do not alter the shared provider's behavior for JS LAB.

## Teacher and student policies

Create **HTML LAB — Teacher Only**, decision **Allow**, including the **exact existing approved HTML teacher email address(es)**. The same address must match the separately approved HTML administrator record. Do not use a classroom code, Everyone or an entire email domain.

Create **HTML LAB — Approved Students**, decision **Allow**, including exact teacher-approved **HTML** student email addresses. With no HTML students enrolled, keep access teacher-only; create/attach the student policy when the first actual student is approved. Do not invent a placeholder student, copy the JS policy or add all JS students.

Verify the policies are attached to each HTML Access application, not merely saved as reusable policies. Reopen both apps after saving and check hostname, policy names, email spelling, PIN login method and session duration. Enrollment approval and Cloudflare policy approval are separate: both must permit the student.

## Set the real HTML audience and server bindings

In each HTML Access application's Overview/Basic information, copy **Application Audience (AUD) Tag**. This is a public identifier, not an API token. It must differ from the JS application audience. If production and previews use separate generated apps, retain both HTML AUD tags.

Once the applications exist, run this owner-terminal command with the actual team domain and HTML audience(s):

```sh
node scripts/configure-private-cloud.mjs YOUR_TEAM.cloudflareaccess.com HTML_PRODUCTION_AUD,HTML_PREVIEW_AUD
```

The script places these values into encrypted Pages server bindings for **both production and preview**:

- `ACCESS_TEAM_DOMAIN`: trusted HTTPS Zero Trust team origin.
- `ACCESS_AUD`: only the actual HTML application audience tag(s).
- `PROTECTED_HOSTS`: production plus single-label project preview hosts.
- `SUPABASE_URL`: verified shared backend URL.
- `SUPABASE_SERVICE_ROLE_KEY`: obtained in process memory and sent over child stdin, never a command argument/file/browser variable.

For preliminary deployment, the helper supports `--prepare-server-bindings` in place of the AUD. That configures the other server bindings but deliberately leaves `ACCESS_AUD` absent. **It cannot enable login.** This release has progressed beyond preparation: both environments now contain the actual observed HTML production AUD. Add the separate HTML preview AUD when its Access application is configured. Do not substitute the JS audience.

Redeploy production and preview after setting bindings so each deployment receives the new environment. Do not set privileged bindings in `VITE_` variables, GitHub public variables, `wrangler.jsonc`, browser code or committed `.env` files. No Cloudflare administrative token is required in the running app; policy synchronization remains manual.

## Server authorization and revocation

The worker verifies `Cf-Access-Jwt-Assertion` with `jose` against the trusted team's published JWKS. It validates RSA signature, issuer, HTML audience, expiry, required subject/email/issued-at claims and a nonfuture issued-at. An unverified email header or decoded JWT payload is never sufficient.

Every protected request calls `html_enrollment_authorize` using that verified identity. SQL checks its independent HTML status, starts/expiry against the **database clock**, and the first verified subject binding. Students cannot change their role, dates or status. Errors, missing settings, unavailable keys/database, unknown hosts and nonactive enrollments deny access before `ASSETS.fetch` or file access.

Admin operations require verified HTML admin identity, a same-origin request and matching secure HttpOnly host-cookie/CSRF header, then SQL repeats admin checks. The browser cannot choose the acting administrator. Revision checks prevent a stale or missing version from overwriting another change.

**Revoke Access** updates the server status and audit record. The next protected document, asset, API or file request is denied even with the same still-valid Access cookie. No application bearer session bypasses the fresh database check. A page already loaded polls permission every 15 seconds and rechecks on focus/visibility; its UI closes on denial. This UX timer is not the enforcement boundary. The application does not revoke the entire shared Cloudflare identity session, which could affect JS LAB. In-flight/delivered data and exported/downloaded copies cannot be recalled.

Private file links point only to `/api/files/{HTML resource UUID}`. The gateway verifies enrollment, publication/teacher permission, matching ready version and exact HTML bucket/prefix before proxying bytes. It does not give students a reusable Supabase signed URL. The legacy public deployment can still download **published** resources until an explicitly approved privacy cutover. Unpublished resources remain denied to students in both modes.

## Teacher workflow

1. Sign in to the private URL with the exact approved teacher email and emailed PIN.
2. Open **Student Management** in the private account bar (`#teacher/students`).
3. Add the name/email. The record is **pending**; caller-supplied approval/role fields cannot activate it.
4. Select 1, 3, 7, 14 or 30 days; enter a custom whole number of days; or choose exact local expiration/start times. The server stores UTC and validates future dates. Press **Approve**.
5. Separately add the exact student email to the HTML Approved Students policy on production **and preview** applications. Verify the attachment and saved policy. No automatic synchronization is claimed.
6. **Extend** adds days from the later of current expiry/server now, or accepts an exact new end time. It preserves a suspension. **Resume** explicitly restores a suspended student only while their dates are valid; extend expired dates first.
7. **Suspend**, **Reject** and **Revoke Access** use accessible confirmation dialogs. Successful messages appear only after server confirmation. Refresh stale records before retrying a conflict.
8. Filter/search students and inspect the latest server-backed security/enrollment events. UI status and remaining days come from server results, not the student's computer clock. Dates display in the viewing browser's local timezone.

Cloudflare verification/login fields are populated only after the server validates a matching Cloudflare identity, including when enrollment is still pending or otherwise denied. Authorized activity is recorded only when enrollment permits access. A “code sent” screen alone populates neither and is not proof of email delivery. JWTs, PINs, passwords, cookies and raw verified subject identifiers are not displayed in the dashboard or saved in audit details.

## Tests and acceptance

```sh
npm test
npm run build
npm run build:private
node scripts/test-html-private-cloud.mjs --confirm-disposable-tests
node scripts/test-private-deployment.mjs https://html-lab-private.pages.dev/ https://EXACT_DEPLOYMENT_HASH.html-lab-private.pages.dev/ https://security-check.html-lab-private.pages.dev/
```

The live-backend command creates only marked disposable HTML enrollment/resource records and removes them. It checks actual hosted persistence, durations, ownership/admin denial, status transitions, subject binding, expiry, audit, private file bytes and revocation on the next gateway request, plus unchanged JS records. Its gateway identity is injected at the already-verified identity boundary; **it does not test Cloudflare OTP**. Separate cryptographic unit tests exercise real signed JWTs, wrong issuer/audience/signature/expiry, CSRF, direct assets, outages and the legitimate cross-site OTP return navigation.

The unsigned deployment test proves blocked production, deployment hashes and branch aliases; it does not prove authenticated success, PIN delivery or that Cloudflare Access itself is configured. A missing-audience 503 is fail-closed preparation, not a functioning Access login.

Browser fixtures exercise private gate lockout and the real existing lesson/management components. Original browser regression pages remain under `tests/`. `npm run build:private` verifies the catch-all routes, required worker checks, absence of offline caches and privileged-key literals in frontend assets. CI also runs the resource/enrollment SQL permission checks in disposable PostgreSQL 17.

Before declaring the classroom ready, use real owner-approved identities to verify teacher OTP, a separately enrolled student, fresh production/preview documents and assets, pending/unapproved/expired/suspended/revoked access, logout/re-login and all learning tools. No real student PIN test was run in this release because the owner chose to defer it. Never change a real JS student's state for HTML testing.

## PIN and login troubleshooting

| Symptom | Check |
| --- | --- |
| Setup Required / HTTP 503 | Real HTML AUD is missing, bindings are wrong or infrastructure is unavailable. Finish setup; never bypass the gateway to serve the SPA. |
| Code allegedly sent but no email | Check spam, exact email spelling, PIN provider selection, saved policy and policy attachment. Cloudflare may show “code sent” for an address not permitted by the policy. Do not assume delivery. |
| Cloudflare account login offered | Select One-time PIN as the HTML application's login provider, rather than requiring Cloudflare-account authentication. |
| Teacher can deploy but cannot edit Access | Wrangler's Pages write permission is separate. Use an authorized Zero Trust dashboard session or an owner-scoped Access API credential through appropriate tooling; never paste secrets into chat. |
| OTP succeeds but application denies access | Check the separate HTML enrollment status/start/expiry, verified email/subject binding, trusted issuer and HTML AUD. JS enrollment alone is insufficient. |
| Awaiting Approval / Not Enrolled | Teacher must create/approve the HTML record and check the independent HTML allow policy. |
| Expired / Suspended / Revoked / Rejected | Teacher must explicitly change the server enrollment; modifying localStorage, hash routes or computer time cannot fix it. |
| Signed Out page | Intentional sign-out. Use the clean sign-in link. A leftover `__cf_access_message=logged_out` query is informational and is removed only after successful real authorization; do not repeatedly log out to fix enrollment. |
| Preview is blocked while production works | Check the preview Access application/AUD, exact project hostname, preview bindings and fail-closed settings; never reuse the JS audience or exclude assets. |
| Duplicate destination / wildcard rejected | Follow the Pages-generated production/preview flow above; reopen the saved applications and remove duplicate production entries. |

## Data retention, rollback and maintenance

Store only names, normalized emails, enrollment dates/status and necessary verification/activity/audit metadata. Restrict Supabase/Cloudflare administration, define school-approved retention/export/deletion procedures, and review provider logs/settings. No automatic student deletion, resource cleanup or retention cron is enabled by this upgrade. Enrollment logs are not classroom learning analytics; last activity is a throttled server access observation, not a full browser history.

To roll back UI changes, deploy the last known good **protected** private artifact and retain the server gateway/fail-closed configuration. Never publish `dist` to the private project to recover from an error. Public GitHub Pages continues through its existing workflow. Do not drop enrollment tables or reset the shared database as a frontend rollback.

Official references: [Pages preview protection](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [Pages production-domain Access setup](https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain), [Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/), [Pages Access plugin](https://developers.cloudflare.com/pages/functions/plugins/cloudflare-access/), [Pages routing](https://developers.cloudflare.com/pages/functions/routing/).
