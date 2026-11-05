# HTML LAB V4 verification — 5 November 2026

Verified implementation results:

- **47 Node tests passed**, including real RSA JWT signature/issuer/audience/expiry checks, CSRF, gateway fail-closed behavior, admin denial, protected response parsing and all existing lesson/project unit tests.
- **237 existing browser checks passed**: original 146, V2 projects 23, advanced HTML 54 and actual advanced React components 14.
- **12 private interface checks passed**, using clearly labeled local identity/transport fixtures. They cover student/admin separation, UI removal on revocation, pending/expired/rejected/unenrolled states, network outage, an HTML login response after session expiry and existing lesson rendering after authorization is restored. These are not Cloudflare OTP tests.
- **17 real hosted Supabase checks passed**, with disposable HTML records and no cleanup errors. These cover pending creation, separately observed verified identity, preset/custom duration, extension, suspension/resume, missing/stale revisions, admin denial, subject binding, HTML/JS isolation, actual private file upload/download, draft denial, stable server endpoints, next-request revocation, server expiry and audit persistence. Existing JS enrollment/resource metadata remained unchanged. Gateway identity was injected at the verified-identity boundary; the hosted database and Storage operations were real.
- Resource/enrollment SQL permission checks passed locally in PostgreSQL 18 and in the release's isolated PostgreSQL 17 CI job. Public and private TypeScript/Vite builds passed. The public GitHub Pages deployment remained enabled and its workflow completed successfully.
- Private artifacts include `_worker.js`, catch-all `_routes.json` with no exclusions and no offline lesson service worker/cache manifest. Frontend assets were scanned for privileged credential literals. Server secrets were configured in encrypted Pages bindings, not browser variables or tracked files.

Deployed private artifact URLs at verification:

| Destination | Observed unsigned behavior |
| --- | --- |
| `https://html-lab-private.pages.dev/` | Cloudflare Access redirect to the existing team's email PIN form |
| `https://4f193627.html-lab-private.pages.dev/` | HTTP 401 from the server identity gate |
| `https://c639234d.html-lab-private.pages.dev/` | HTTP 401 from the server identity gate |
| `https://security-check.html-lab-private.pages.dev/` | HTTP 401 from the server identity gate |

**24 hosted unsigned-request checks passed** across these four destinations, covering documents, a real JavaScript asset path, session API, file API and PDF asset. Both production and preview project settings were re-read after deployment and retained `fail_open=false`. The actual production HTML AUD was read from its public Access redirect and verified to differ from JS LAB's AUD; it is installed in both environments' server bindings.

**Not yet verified/completed:** the available deployment credential cannot create/review Access applications or policies (provider HTTP 403). The production PIN page is observable, but its exact saved allow-policy rules and a successful teacher OTP session have not been verified. Preview/hash destinations are application-gated, but Cloudflare Access preview redirection/policies still need dashboard setup/verification. A real student PIN test was explicitly deferred by the owner. A “code sent” notice would not prove delivery, and no successful login is claimed without the completed flow.

The existing public GitHub Pages site still exposes its public curriculum and published resources. The private deployment does not make those public copies private. Previously delivered/downloaded data cannot be recalled. No real HTML students were enrolled, JS students were not copied, JS records/settings were not modified, and unused empty enrollment tables in the alternate local-config project were left as the owner requested.

See [HTML_PRIVATE_ACCESS_SETUP.md](./HTML_PRIVATE_ACCESS_SETUP.md) for the exact remaining production-policy review, preview Access setup, teacher sign-in and future student-approval procedures.
