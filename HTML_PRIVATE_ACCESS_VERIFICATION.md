# HTML LAB V4 verification — 5 November 2026

Verified implementation results:

- **47 Node tests passed**, including real RSA JWT signature/issuer/audience/expiry checks, CSRF, gateway fail-closed behavior, admin denial, protected response parsing and all existing lesson/project unit tests.
- **237 existing browser checks passed**: original 146, V2 projects 23, advanced HTML 54 and actual advanced React components 14.
- **12 private interface checks passed**, using clearly labeled local identity/transport fixtures. They cover student/admin separation, UI removal on revocation, pending/expired/rejected/unenrolled states, network outage, an HTML login response after session expiry and existing lesson rendering after authorization is restored. These are not Cloudflare OTP tests.
- **17 real hosted Supabase checks passed**, with disposable HTML records and no cleanup errors. These cover pending creation, separately observed verified identity, preset/custom duration, extension, suspension/resume, missing/stale revisions, admin denial, subject binding, HTML/JS isolation, actual private file upload/download, draft denial, stable server endpoints, next-request revocation, server expiry and audit persistence. Existing JS enrollment/resource metadata remained unchanged. Gateway identity was injected at the verified-identity boundary; the hosted database and Storage operations were real.
- Resource/enrollment SQL permission checks passed locally in PostgreSQL 18 and in the release's isolated PostgreSQL 17 CI job. Public and private TypeScript/Vite builds passed. The public GitHub Pages deployment was initially preserved and verified, then retired under the owner's subsequent instruction described below.
- Private artifacts include `_worker.js`, catch-all `_routes.json` with no exclusions and no offline lesson service worker/cache manifest. Frontend assets were scanned for privileged credential literals. Server secrets were configured in encrypted Pages bindings, not browser variables or tracked files.

Deployed private artifact URLs at verification:

| Destination | Observed unsigned behavior |
| --- | --- |
| `https://html-lab-private.pages.dev/` | Cloudflare Access redirect to the existing team's email PIN form |
| `https://4f193627.html-lab-private.pages.dev/` | Cloudflare Access redirect to the same HTML PIN application |
| `https://c639234d.html-lab-private.pages.dev/` | Cloudflare Access redirect to the same HTML PIN application |
| `https://security-check.html-lab-private.pages.dev/` | Cloudflare Access redirect to the same HTML PIN application |

**24 hosted unsigned-request checks passed** across these four destinations, covering documents, a real JavaScript asset path, session API, file API and PDF asset. Both production and preview project settings were re-read after deployment and retained `fail_open=false`. The actual production HTML AUD was read from its public Access redirect and verified to differ from JS LAB's AUD; it is installed in both environments' server bindings.

**Dashboard configuration verified:** the existing HTML Access application (`cc70c32d-09ae-43c5-b3a7-21dd98162ffb`) now contains the production destination and `*.html-lab-private.pages.dev`. The wildcard was added using the supported custom public-hostname input, saved and reopened; no duplicate production application was created. Attached policies are HTML Lab — Teacher Only (`e1863db7-38fa-4b6a-80eb-579b4ebd65f1`) and HTML Lab — Approved Students (`d157970a-19e4-492e-9ab8-9a8468efcc9a`). Both have exact email rules, with no Everyone, Bypass or broad email-domain rule. The pre-existing student email rule was preserved; no HTML student enrollment was granted. One-time PIN is the sole selected provider; accepting all providers and WARP authentication are off. The application session is one hour and both policies inherit it. Production and previews share this HTML application's AUD, already installed in both server environments; no additional audience or deployment was necessary.

**Real teacher sign-in verified:** the owner received/entered the teacher PIN in the Cloudflare form and the production classroom loaded with the Teacher role. Student Management loaded the live server data, showing zero students and actual verified identity/login audit events at 21:22 IST on 5 November 2026. The preview alias also loaded the classroom using that authenticated identity. This establishes successful Cloudflare authentication, real JWT validation, enrollment/admin authorization and protected asset loading for the teacher; it does not establish student PIN behavior.

The production teacher resource screen also loaded the existing seven managed resources (three published, four drafts) through the private gateway. No resource status/content was changed during this browser check. Student Management and its real audit data loaded on the authenticated preview alias as well.

**Remaining verification:** a real student PIN test was explicitly deferred by the owner. Pending/expired/suspended/revoked student enforcement was tested against the hosted backend and gateway as described above, not through real student Cloudflare sessions. Logout/re-login and expiration of a real browser session have not been verified end to end. A “code sent” notice alone is not proof of delivery. The deployment credential still cannot administer Access (provider HTTP 403); the configuration above was completed through the owner's authenticated dashboard.

On 5 November 2026 the owner requested that public GitHub Pages hosting be closed, matching JS LAB. The Pages publishing steps and write permissions were removed from the workflow while retaining the tests, SQL checks and both builds. The Pages site was unpublished separately. Source repository visibility and the existing public published-resource API were not changed, so other public copies are not made private by this hosting shutdown. Previously delivered/downloaded data cannot be recalled. No real HTML students were enrolled, JS students were not copied, JS records/settings were not modified, and unused empty enrollment tables in the alternate local-config project were left as the owner requested.

See [HTML_PRIVATE_ACCESS_SETUP.md](./HTML_PRIVATE_ACCESS_SETUP.md) for the saved production/preview configuration and future student-approval procedures.
