# HTML LAB V2 — additive implementation

This release extends the original React/TypeScript/Vite application. It retains the twelve chapters, 36 lesson IDs, original six projects, quizzes, history and element explorers, simple HTML lab, teacher timer, and existing hash routes. Existing curriculum and reference solutions were not replaced.

## Architecture and delivery map

| Area                    | Implemented behavior                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beginner foundation     | `#zero` offers four starting points and a non-blocking placement question. Three file/computer units, Windows/macOS/Linux instructions, keyboard practice, and a guided virtual folder → file → editor → save → browser sequence use the real project engine.                                                 |
| Editor school           | File/tree/tab editing, explicit save, copy, rename/move, deletion confirmation, syntax highlighting, indentation, find counts, and real VS Code setup guidance. The simulator does not run a terminal or install applications.                                                                                |
| Project Workspace       | `#workspace` creates and reopens independent projects in IndexedDB, edits multiple HTML/CSS/text files, imports raster images, follows relative page links, resolves CSS image paths, previews widths, reports current-page overflow, checks structure/resources, and imports/exports ZIPs.                   |
| Additional learning     | Thirteen optional guides contain 28 learning units with why, explanation, analogy, practical task, debugging advice, and downloadable original revision notes.                                                                                                                                                |
| Interactive toolkit     | Network journey/status outcomes, CSS painting and box model, Flexbox and Grid practice, planning canvas and wireframes, simulated Git versions, deployment outcomes, DevTools simulation, contrast/manual review, design comparison, load-size model, security detective, and controlled JavaScript examples. |
| Industry projects       | Seven additional project briefs and complete multi-page reference fixtures: mechanical, civil, electrical, department, local business, job portfolio, and independent capstone. Existing six projects remain unchanged. Guided/practice/independent modes share the workspace.                                |
| Bug Hunter              | Seven editable mini-site challenges: stylesheet, labels, case sensitivity, extension, nested paths, overflow, and image path. Each has three staged investigation hints, a hypothesis field, checks, and a reference fixture.                                                                                 |
| Assistance and revision | A searchable 26-term beginner glossary, examples and analogies, original HTML cheat sheet, links into the existing tag-matching/nesting/semantic tools, individual progress export, local achievements, and a staged roadmap. No generative model is represented or required.                                 |
| Classroom               | Existing teacher controls/timer stay intact. Added guides expose 60-minute pacing, prediction/practice/homework instructions, printable text practice sheets, and project review rubrics. Records remain individual and device-local.                                                                         |
| Offline                 | Explicit production-only offline download caches the built app, its lazy toolkit chunk, and bundled sample assets through a scope-limited service worker. Notes and exported source also work independently offline. First installation and external documentation require a connection.                      |

The original application shell imports the new `Academy` lazily. New components live in `src/components/Academy.tsx`, `AcademyTools.tsx`, `ProjectWorkspace.tsx`, and `OfflineLessons.tsx`; new lesson/fixture data lives separately from V1. Additional styles use `src/v2.css` and the existing design tokens and classes.

## Progress and storage strategy

The `html-lab-progress-v1` key and original parser/schema remain unchanged. New local achievement and guide-recap strings use a `v2-` prefix in the existing completion array. Original lesson completion percentages still count only the original 36 lesson IDs. Bookmarks, scores, and single-file drafts are preserved.

Projects use a separate IndexedDB database, `html-lab-projects-v2`, with explicit Save and Open saved project controls. Unsaved edits are identified; navigation through app buttons prompts before abandoning them. Reload/closing also gets a browser warning for unsaved work. Save or export before using browser-history navigation or following a direct hash link. Storage failures are shown with an export fallback. A project reset clears this database only, after confirmation. The existing Reset Progress action remains an intentional learner operation, not an upgrade migration.

A public deployment achievement requires a real HTTPS address and the learner’s explicit confirmation that they visited the site after provider success. It is always labeled **self-reported**, never provider-verified. Structural capstone checks are separated from learner-confirmed manual review.

## Project security contract

The original `Lab.tsx` preview and its empty sandbox permission set are unchanged. The separate multi-file preview has an opaque origin (`sandbox="allow-scripts"` without `allow-same-origin`) and a restrictive CSP. Its only permitted script is a fixed, application-generated nonce-authorized bridge for local navigation and overflow reporting. Learner script elements, event attributes, supplied nonces, metadata refresh, nested embeds, SVG/MathML, templates, noscript content, and image-map areas are removed from the rendered preview.

The parent accepts bridge messages only from that frame’s window with the current random token, and only opens an existing supported HTML file. The bridge does not evaluate learner source or expose storage. Forms, remote resources, external CSS imports, and network connections are blocked in this preview. CSS and supported images are resolved from the virtual project; they do not require a server endpoint.

ZIP imports use patched fflate 0.8.3 streaming decompression with input-size, declared-size, actual decompressed-size, entry-count, and path checks. Parent traversal, absolute paths, backslashes, hidden files, special path characters, deep paths, duplicate entries, file/folder conflicts, unsupported types, invalid image signatures, and oversized contents are rejected before being accepted as a project.

Supported project files: `.html`, `.htm`, `.css`, `.txt`, `.md`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`. Limits: 60 entries, 2 MB per file, 8 MB total and compressed ZIP, seven path segments, 80,000 characters per text file. Imported archives become new projects instead of silently replacing saved copies. Export preserves raw source; preview sanitization does not certify that source as safe outside the lab.

## Deliberate limits and future work

- The workspace is a supported static-file subset, not a full browser, VS Code, filesystem, terminal, Git client, or server emulator. It does not execute arbitrary project JavaScript or import scripts/SVG/PDF/font/media files. The original single-document media lessons remain available.
- CSS resolution handles ordinary relative stylesheet and `url(...)` image references. It does not implement a complete CSS bundler, nested imports, preprocessors, arbitrary encodings, or external dependencies.
- The DevTools, network, Git, deployment, performance, and JavaScript demonstrations are explicitly identified as controlled models. Real computed styles and requests should be inspected with actual browser tools as instructed.
- Projects are saved explicitly; there is no cloud sync, account, roster, centralized grading, or automatic upload. There is no integrated provider publishing API for learner sites. Students export and perform the real provider workflow themselves.
- Structural checks accept different valid markup, but cannot judge audience suitability, evidence quality, all CSS behavior, complete accessibility, SEO ranking, or legal compliance. Manual review is required. Current-page overflow is measured; other pages and widths need separate checks.
- Offline storage is opt-in, browser-scoped, and subject to quota or eviction. External links, provider workflows, and first-time setup require connectivity. There is no claim of a permanent offline installation.
- Optional future enhancements include deeper CSS parsing, more challenge fixtures, richer project rubrics, accessibility testing across assistive technologies, and explicitly consented provider integrations. None is presented as implemented.

## External instructions

Provider/editor guidance was checked against official documentation on 31 October 2026: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [VS Code](https://code.visualstudio.com/docs/setup/setup-overview), [Netlify](https://docs.netlify.com/deploy/create-deploys/), [Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/direct-upload/), and [Vercel](https://vercel.com/docs/deployments). Follow the current official source for changed interface wording, eligibility, and plans; no perpetual free allowance or fixed price is promised.

See `VERIFICATION-V2.md` for executed checks and verification limits.
