# V2 verification — 31 October 2026

## Executed checks

- The seven original Node tests and seven new project/security tests passed (14 total). New tests exercise path confinement, malicious ZIP names, unsupported executables, binary/text/folder ZIP round trips, file-count and size bounds, extension/content mismatches, project fixtures, and additive guide content.
- The original browser suite passed **146/146** checks against the upgraded app. The V2 suite passed **19/19**, covering local CSS/image/link resolution, restricted CSP, removal of active source (including templates and image-map areas), seven reference project audits, IndexedDB save/list/delete, ZIP round trip, preservation of the original progress key, and hostile-frame isolation.
- Production builds have succeeded with the separate lazy toolkit chunk and generated offline manifest/worker.
- Dependency audit after selecting fflate 0.8.3 reported zero vulnerabilities.

## Interactive browser evidence

- Created MyWebsite, created MyWebsite/index.html, typed a heading in the editor, saved it, selected it in the browser page list, and rendered it in the isolated preview. After a reload, the saved project was present in Open saved project.
- Followed an About link inside the multi-file iframe; the parent loaded about.html through the fixed bridge.
- Edited the external CSS and verified the rendered h1’s computed color changed to `rgb(155, 79, 32)`.
- Exported a project ZIP through the UI, imported that downloaded ZIP into a new project, saved it, reloaded, reopened the saved copy, and verified the About page and CSS value survived.
- Opened deletion confirmation and canceled; the selected file remained editable.
- Repaired a broken stylesheet reference in Bug Hunter and obtained passing structural/resource feedback.
- The overflow challenge reported a genuine 320px viewport overflow and blocked a passing check while it remained.
- Production offline-download activation completed, confirming that the service worker installed the bundled lessons and assets. A fully disconnected browser session was not automated.
- Production Start from Zero and Project Workspace were checked at a 390px browser viewport (375px content width after its scrollbar); both had equal document width and scroll width. The project’s own 320px preview also reported no overflow for the starter. Temporary viewport overrides were reset.

## Scope of assurance

These checks cover the stated contracts and observed workflows, not every combination of file edits, ZIP encoding, CSS syntax, browser engine, screen reader, or real device. Manual classroom and accessibility review remains appropriate. Simulated Git push and deployment are not evidence of real external publication. Learner site hosting is a guided external workflow.

The existing GitHub Pages workflow is unchanged. It runs the Node tests and production build before publishing. See [GitHub Actions](https://github.com/Shadabur-Rahaman/html-lab/actions) for the released commit’s live deployment status; a local build alone is not proof of publication.
