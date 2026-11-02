# HTML LAB cloud study materials

## Audit and implementation map

HTML LAB has a static React/Vite frontend, original and advanced curriculum, hash routes and local progress/projects. `src/data/resources.mjs` is authored teaching content and is not a cloud resource store. It remains unchanged.

The locally available JS LAB resource feature already supplies Supabase Auth, private Storage reservations, TUS progress/cancellation, byte/signature/hash verification, an authenticated Edge API, optimistic revisions, PDF.js rendering and security/integration tests. We reuse that bounded feature, not the JS application. Its previous deployment is not evidence that HTML is configured correctly; HTML gets separate tests and deployment evidence.

Selected architecture: reuse the configured Supabase project and existing confirmed owner identity where authorized; use an independent `html_authorized_teachers` mapping, `html_*` tables/functions/view, private `html-lab-resources` bucket and hardcoded `html-resource-api` Edge Function. The API never accepts a table, bucket or application scope from a client. HTML code must not modify the JS schema, resources, grants or cleanup schedule. Separate browser Auth/TUS keys avoid collisions but are not security boundaries: both GitHub Pages applications share an origin.

Implementation map:

1. Generate chapter/lesson/project associations from the existing authored data; validate them in Edge and SQL.
2. Apply the additive HTML migration; verify RLS, no arbitrary signing, private objects and separate role mapping.
3. Adapt the resource UI to existing HTML styling; add public library, teacher management and subtle lesson-related materials.
4. Preserve real upload progress and finalization; metadata changes do not upload bytes; replacements use fresh paths and stable IDs.
5. Keep Trash restorable until an explicit permanent-delete action. **No HTML cron, retention schedule or automatic permanent deletion is enabled.**
6. Run original regressions plus HTML-specific unit, SQL and real cloud tests before publishing.

## Deployed architecture

The existing Supabase project is reused, with an independently approved HTML owner. Shared Auth avoids a duplicate account/project; all resource authorization uses the separate HTML membership table. The classroom Teacher Mode code does not grant cloud access. An HTML teacher can manage their own materials; an HTML admin can manage all HTML materials, categories, settings and exports. Category administration is intentionally restricted to admins.

| Component | HTML-specific implementation |
| --- | --- |
| Metadata | `html_learning_resources`, `html_resource_versions` |
| Membership | `html_authorized_teachers` |
| Supporting tables | `html_resource_categories`, `html_resource_settings`, `html_resource_audit_log`, `html_resource_rate_limits` |
| Curriculum catalogs | `html_resource_chapters`, `html_resource_lessons`, `html_resource_projects` |
| Public metadata | `html_published_resources`, security-invoker view |
| Private files | `html-lab-resources`, `html-resources/{resource UUID}/{version UUID}.{extension}` |
| Trusted actions | `html-resource-api`, `html_resource_command` |
| Frontend | `src/cloudResources/`, lazy-loaded public and teacher routes |

Chapter and lesson keys come from the existing 12-chapter/36-lesson curriculum. Project keys include the original, industry and advanced catalogs. General, beginner, intermediate, advanced, project and assessment collections are supported. The existing authored resource catalog stays separate.

## Database and Storage setup

The migrations are additive and HTML-specific:

- `202611020001_html_resources.sql`: tables, catalogs, 14 initial categories, constraints, private bucket, RLS, service-only commands and explicit permanent deletion.
- `202611020002_html_rate_housekeeping.sql`: grants the HTML audit sequence and removes expired HTML request counters on public-link requests. This housekeeping never deletes materials or objects and creates no scheduled job.

The initial migration's audit-sequence reference was corrected before release so a fresh installation does not require a JS table. The second migration supplies the correct grant to the already configured project. Existing JS grants were not revoked or replaced.

Use an owner terminal already signed in through the official Supabase CLI. Copy `.env.example` to ignored `.env.local` and supply only the public URL and publishable key. Never put a service key into a `VITE_` variable.

For the existing shared project with exactly one confirmed approved JS admin:

```sh
npm ci
node scripts/deploy-html-resources.mjs --confirm-add-html-library
node scripts/configure-html-auth.mjs --confirm-append-html-redirects
```

The deployment script refuses an ambiguous owner selection. It applies the initial schema only when absent, applies the idempotent second migration, adds the same confirmed owner to the separate HTML grant table, and deploys only `html-resource-api`. On a new project without JS membership, apply the migrations in order using the SQL editor or `supabase db query --remote=PROJECT_REF --file PATH --yes`, then explicitly assign a confirmed Auth UID as described below. Do not run `db reset` on the shared project.

`supabase/tests/bootstrap.sql` is exclusively for disposable local PostgreSQL/CI. It creates mock Auth/Storage schemas. **Never execute it against hosted Supabase.**

The private bucket has a 50 MiB hard ceiling. The application setting starts at 25 MiB; admins can lower/raise it within that ceiling. Provider plan limits, storage, bandwidth and fair-use quotas also apply. Dashboard totals count current managed files, not retained versions or unfinished uploads.

## Authentication and teacher approval

Use the existing approved account's email and password at `#teacher/resources`. The existing confirmed owner has been mapped separately as an HTML admin. Public signup remains disabled; students need no account.

To approve another teacher, the project owner creates/invites and confirms the intended Supabase Auth account, verifies its UID, and performs this bounded SQL in the trusted SQL editor:

```sql
insert into public.html_authorized_teachers(user_id,role)
values ('CONFIRMED_AUTH_USER_UUID', 'teacher')
on conflict(user_id) do update set role=excluded.role;
```

Use `admin` only when that person should administer all HTML materials, categories and settings. A separate JS membership is required for JS administration. Removing a row from `html_authorized_teachers` revokes future HTML mutations/signing of private materials; it does not delete uploaded files. Never use localStorage, a client flag or the classroom access code to approve teachers.

Recovery uses `?html-resource-recovery=1`. The append-only setup script pulls the current shared config, checks that the only proposed change adds HTML recovery URLs, pushes, verifies, and deletes the temporary config. It preserves the JS redirects, site URL and provider settings. **Do not run `config push` with the minimal tracked `supabase/config.toml`**: it intentionally contains only the HTML function setting. Recovery email delivery and an actual owner password reset require the owner's inbox/browser; they were not exercised by sending mail during release checks.

## Authorization and signed delivery

RLS is enabled. Anonymous/authenticated clients can read only approved public columns for published, nondeleted, finalized resources. They cannot write metadata or roles, call privileged commands, inspect version paths, or directly read/delete/overwrite Storage objects. Teachers can insert bytes only at a matching active upload reservation; arbitrary paths and upserts are denied. Admin/service credentials exist only in trusted server/owner processes.

The function is deployed with gateway JWT verification disabled to support anonymous published downloads and modern public keys. Every privileged action explicitly verifies the Supabase user and the HTML role; SQL repeats authorization and ownership checks. Request revisions are mandatory for editing/replacing/deleting and missing/null/stale revisions fail. Request IDs make upload retry idempotent.

The signing endpoint accepts a resource ID, not an arbitrary bucket/path. It checks publication or teacher ownership, deletion, the current ready version, matching paths, the hardcoded HTML bucket and exact HTML resource prefix. Links last **60 seconds**. Public link requests have per-IP and overall limits. Unpublishing/Trash prevents new public links; an already issued URL may work until expiry and a downloaded copy cannot be recalled. Students may need to refresh metadata in another browser before a card disappears. Signing still checks current server state immediately.

Downloads fetch a fresh authorized URL, verify the returned size and save a browser blob with the original readable filename. Retry obtains a new URL. There is no third-party Office preview service and no public draft bucket. GitHub Pages paths and separate browser keys are not security boundaries because HTML LAB and JS LAB share an origin.

## File validation and previews

Allowlist: PDF; DOC/DOCX, PPT/PPTX, XLS/XLSX; TXT/CSV/MD; JPG/JPEG/PNG/GIF/WebP; ZIP containing allowed classroom HTML/CSS/text/documents/images. Direct HTML, JS, SVG, executable and macro-enabled Office extensions are rejected. ZIPs reject traversal/absolute/backslash paths, encryption, nested archives, unsupported active/executable entries, excessive entry counts and excessive declared expanded size. Archives are not extracted or executed by HTML LAB.

Client and server validate size, filename, extension/MIME, signatures and checksum. Finalization reads the actual stored bytes before publishing. OOXML checks expected package names and rejects macro packages. These are structural checks, **not a malware scanner**; legacy Office signatures cannot prove absence of macros. Teachers should upload trusted classroom files and students should keep document software protected.

PDF.js is locally bundled and renders canvases with page navigation, fit-width/zoom, accessible extracted text, fullscreen and original download. PDF actions and XFA are not executed. Images provide fit, zoom and fullscreen. Text/Markdown/CSV previews are escaped text, including literal HTML. Office and ZIP use metadata plus download. Fullscreen availability depends on the browser.

## Teacher workflow

1. Open Teacher Mode → **Manage Study Materials**, or go directly to `#teacher/resources`, and sign in with an approved cloud account.
2. Browse or drop one/multiple files. Expand each queue item to edit title, description, category, chapter, optional matching lesson, collection/project, tags, display order and draft/published status.
3. Upload the queue. Progress reflects actual byte transfer through TUS; larger files use 6 MiB chunks. Success appears only after cloud finalization. Retry reuses the reservation; cancel prevents publication. Select the file again after a full browser restart if necessary; file bytes are not persisted locally. Duplicate names get separate UUID/version paths; the same selected file is deduplicated within a queue.
4. **Edit details** changes metadata without reuploading. **Replace file** preserves the stable resource ID and creates a new object path/version. Old versions remain retained until explicit permanent deletion. Optimistic revision errors require refreshing and reviewing the latest record.
5. **Unpublish** returns a published item to draft. Publish from draft to share again. Archive through Edit details when it should be kept privately outside the active collection.
6. **Move to trash** uses a confirmation dialog and removes public access. Filter Status → deleted to restore as draft or explicitly **Delete permanently**. Permanent deletion removes every HTML object version and then metadata; it cannot be restored by this application. Partial deletion remains hidden in Trash and can be retried after refresh. No automatic retention cutoff or destructive cleanup schedule is enabled.
7. Admins can create/rename/archive categories, change the file-size setting and export a metadata manifest. Archived categories remain readable on already associated materials.

An interrupted upload may leave a private pending object/reservation. It is never presented as a published file. The manager includes unfinished records so the owner/admin can move them to Trash and explicitly remove them. No destructive cleanup is scheduled.

## Student workflow and refresh

Open **Study Materials** at `#resources`; search and filter by chapter, lesson, category, format, collection/project and sort. Preview supported files or download originals. Lesson Learn pages show **Additional Study Materials** only where published records match the chapter and optional lesson.

Metadata is fetched dynamically. Opening a library, manual refresh, returning focus after 30 seconds, and successful teacher changes invalidate/reload the short metadata cache. Same-origin tabs receive a BroadcastChannel notification. Other devices use open/focus/manual refresh; this is not a Realtime subscription. Uploading/publishing files requires no Git commit, Vite build or Pages deployment.

Cloud errors stay inside the resource feature. Existing local lessons, sandbox, quizzes, presentations, projects and progress continue independently. Cloud previews/downloads require a working network; they are not promised offline.

## GitHub Pages configuration and deployment

Set these repository **Actions variables**, not privileged secrets:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
```

The Pages build reads these public variables. `.env.local` is ignored; `.env.example` contains placeholders. Never add service-role keys, access tokens, passwords or private credentials to the repository, browser code, build output or workflow variables. The SDK configuration rejects service/secret keys. Uploaded classroom materials are not committed into Git.

Run `npm test` and `npm run build`, then push to `main`. The existing workflow builds/deploys Pages and now verifies SQL permissions in isolated PostgreSQL 17 before deployment. The public URL remains `https://shadabur-rahaman.github.io/html-lab/`. Future frontend/config changes need a new build; everyday file CRUD does not.

## Backup, export and recovery

The manager's admin export is a **metadata manifest, not a file backup**. Keep original teacher files separately. Provider database backups do not automatically imply backups of Storage object bytes; check the project's actual backup and retention plan.

For an approved private local export, an already signed-in owner can run:

```sh
node scripts/backup-html-resources.mjs --confirm-private-backup
```

This read-only script exports only hardcoded HTML tables and version objects into ignored `.deployment/backups/`, checks exact HTML prefixes and SHA-256, and never prints/saves the server key. The resulting manifest contains private metadata and approved user IDs: encrypt/restrict access, keep an offline copy, and never publish it. Uploading versions with no completed object are marked unavailable. Full private export was supplied as an owner procedure but not executed during release verification.

Restore is an owner operation: restore the database and corresponding object versions together into a controlled target, preserve resource/version IDs and paths, verify hashes and RLS, then test draft/public delivery before reopening access. Do not automatically replay a manifest into the shared production project. The application Trash action restores existing resources as drafts; it does not restore permanently deleted objects. Revert a frontend release through Git if necessary; an additive database migration should not be dropped to roll back UI code.

## Tests and troubleshooting

```sh
npm test
npm run build
node scripts/test-html-resource-cloud.mjs --confirm-disposable-tests
```

The cloud command needs the owner's existing CLI sign-in. It creates temporary confirmed users and HTML-only grants/files, tests real hosted Auth/Storage/API behavior, and removes its test data. It snapshots existing JS resource metadata and checks it is unchanged. Do not substitute local transport tests for this integration run. No owner password is requested or printed.

Browser regression pages under `/tests/` exercise the original curriculum/sandbox, V2 projects, advanced workshops and actual React components. `cloud-live.html` plus `scripts/test-html-cloud-browser.mjs --confirm-disposable-tests` is a **development-only** live Auth test harness on port 5178. Its loopback session bridge on 5181 serves only that local origin, uses disposable credentials in memory and never ships in the production entry. Finish it by creating `.deployment/finish-cloud-browser`; it removes only that test user's HTML resources/account. The optional fixture-queue button drives the real upload input handler when the browser automation provider cannot set native chooser files.

Release verification includes unit/transport checks, real PDF/PPTX/DOCX/image/ZIP upload/download, a multi-chunk TUS transfer, checksum verification, replacement, publication, Trash/restore/purge, unauthorized access and HTML/JS isolation. Browser checks cover real PDF/image/text previews, filters and the manager. Check the release result for the final check counts; recovery email delivery is owner-dependent and was not sent during tests.

| Symptom | Action |
| --- | --- |
| Setup screen | Check the two public build variables, rebuild once and refresh the site. |
| Signed in but unauthorized | Owner must approve the confirmed Auth UID in `html_authorized_teachers`; classroom mode alone is insufficient. |
| Invalid login/recovery | Check the account, email provider/delivery and exact HTML redirect; use the same browser for PKCE recovery. |
| Upload needs attention | Read the error, verify format/size/network, retry; a file must pass actual-byte finalization before publication. |
| Resource changed | Refresh, reopen the item and review changes before retrying. |
| Download/preview expired | Retry obtains a fresh one-minute link; unpublished/deleted materials cannot get new public links. |
| File missing externally | The preview/download reports failure. Restore the object from backup or unpublish/replace the resource; provider-console deletion bypasses application consistency controls. |
| File absent on another device | Open/refresh Study Materials; check published status and the active filters. No deployment is needed. |
| Provider unavailable/quota reached | Retry later and inspect the Supabase dashboard. Local teaching features remain available. |
| Storage keeps increasing | Retained replacements/Trash are deliberate. Back up first and explicitly delete selected HTML resources; do not enable broad shared cleanup. |
