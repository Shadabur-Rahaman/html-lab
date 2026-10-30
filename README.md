# HTML LAB — Learn HTML by Building

## V2: start from zero, then build a complete site

The original course and progress records are preserved. New optional entry points are **Start from Zero**, **Development toolkit**, and **Project Workspace**. V2 adds thirteen guides, a safe multi-file HTML/CSS workspace with IndexedDB and ZIPs, seven additional industry projects, seven debugging challenges, CSS/Git/deployment workshops, a beginner glossary, classroom materials, and opt-in offline lesson storage.

See [V2 implementation and limits](V2-IMPLEMENTATION.md) and [V2 verification](VERIFICATION-V2.md). Learner projects stay on the device; publication uses a real provider workflow outside the app. The existing single-file lab remains available.

A separate React + TypeScript + Vite educational application. The existing JS LAB source and deployment are unchanged. This directory can be copied into its own repository and run independently.

## Run

Requires Node.js 20.19+ or 22.12+ and npm.

```powershell
cd 'D:\Learn JS\html-lab'
npm ci
npm run dev
```

Open the Local URL printed by Vite (normally http://127.0.0.1:5174). If the port is occupied, use the next port printed by Vite.

```text
npm test
npm run build
npm run preview
```

## What is included

- Twelve chapters and 36 authored lessons, with explanations of what, why, and how; examples; common mistakes; advantages and limits; practice tasks; recaps; and teacher guidance.
- A syntax-highlighted HTML editor with line numbers, indentation, live/on-demand preview, desktop/mobile widths, reset, copy, download, hints, reference solutions, comparison, and an expanded coding view.
- Expandable DOM explorer with text nodes and attribute inspection; structure-based exercise checks; a deliberately limited HTML/accessibility learning checker.
- Homepage layer switches, structured/unstructured content, and six clickable website anatomy examples.
- Eight-era HTML Time Machine with primary-source links, historical warnings, editable examples, modern comparisons, and reflection questions.
- Searchable catalog of 89 HTML elements, with purpose, attributes, working contextual examples, related lessons, and compatibility documentation links. Historical elements are explicitly marked obsolete.
- Request-response walkthrough, nesting prediction, text-semantics comparison, path explorer, image debugger, list/table/span builders, live form builder, GET/POST illustration, semantic layout builder, native media builder, responsive image simulation, and attribute lab.
- Seven questions in each chapter checkpoint (three chapter-specific plus four applied HTML reasoning questions), a fill-tag bonus, coding checkpoints, and a 36-question final assessment with a practical task. Best scores are retained locally.
- Six project workspaces: portfolio, college, restaurant, product, registration, and historical reconstruction. Each has a brief, prerequisites, build plan, starter, preview, hints, structural checks, reference solution, debugging guidance, and extensions.
- Teacher mode: Explain, Demonstrate, Ask, Expected Answer, Common Mistake, Practice, Transition; a timer; presentation layout; first-class plan; and a flexible 12-session planner.
- Device-local completion, bookmarks, best scores, and practice/project drafts. Explicit reset. No accounts or student-data service.

## Architecture and curriculum

`src/App.tsx` owns navigation, progress, course pages, catalog, projects, and teacher views. Hash routes allow direct links and refreshes on static hosting, such as `#/lesson/controls` and `#/lesson/controls/quiz`.

`src/components/Lab.tsx` owns the editor, sandboxed preview, DOM explorer, and learning checks. `Quiz.tsx` owns feedback and scoring. `Experiments.tsx` and `MoreExperiments.tsx` contain the interactive teaching tools.

`src/data/curriculum.mjs` contains chapter and lesson content; `solutions.mjs` contains independent practice solutions; `resources.mjs` contains timelines, projects, and catalog groupings; `elements.mjs` contains contextual element examples. `src/lib.mjs` contains preview preparation, DOM checks, downloads, and storage recovery.

| Chapter | Three lessons                                    | Main practical experience                             |
| ------- | ------------------------------------------------ | ----------------------------------------------------- |
| 1       | Web requests; markup; HTML/CSS/JS                | Request flow, layer switches                          |
| 2       | Origins; versions/XHTML; Living Standard         | Eight-era Time Machine                                |
| 3       | Skeleton; syntax; parsed tree                    | Nesting prediction and DOM inspection                 |
| 4       | Headings; semantic text; character references    | Text comparison and article practice                  |
| 5       | Links; paths; images                             | Path explorer and image detective                     |
| 6       | Lists; accessible tables; spans                  | List and table builders                               |
| 7       | Controls; constraints; submission                | Form builder, native validation, request illustration |
| 8       | Landmarks; sections/articles; outline            | Semantic layout builder                               |
| 9       | Media; responsive images/embeds; modern elements | Working audio/video, art-direction simulation         |
| 10      | Attributes; nodes; parser repair                 | Attribute lab and nesting explorer                    |
| 11      | Native accessibility; metadata; audit            | Deliberately broken-page repair                       |
| 12      | Planning; integration; review/export             | Six guided projects and final assessment              |

## Preview isolation and practical boundaries

Learner code is never inserted into the application document. The preview iframe uses an empty `sandbox` permission set: no scripts, same-origin access, forms, popups, downloads, or top navigation. The iframe gets its own restrictive CSP. Preview preparation removes scripts, event attributes, nested documents, embedded objects, refresh metadata, base overrides, and external link navigation. HTTPS images/media and bundled local media are allowed. Learners can use native controls and constraint validation; actual form submission is blocked. The known bundled `captions.vtt` track is embedded as a data URL inside the preview because the opaque origin cannot read its relative caption file. The editor and export retain the original file reference; custom caption URLs need their own compatible delivery.

DOMParser creates a separate document for inspection. Checks examine parsed structure and attributes rather than exact source spelling. Parser recovery means these checks cannot prove source validity. The HTML checker does not establish WCAG conformance or complete SEO quality. Manual keyboard/content review and an external conformance checker remain necessary.

Documents are limited to 80,000 characters; the tree view is limited to 350 elements, 70 visible children per branch, and ten levels of nesting. Larger documents still render but their tree may be abbreviated.

Downloaded HTML is learner-authored source. It does not bundle assets, create multiple files, store accounts, send applications, process payments, or supply a backend. Put linked files beside it or change URLs appropriately. Nested iframe examples are shown as source because nested documents are blocked in the live lab. Homepage CSS/JavaScript switches and the responsive-image slider are explicit teaching simulations, not execution of learner scripts.

Session-planner notes are temporary while that view remains open. Centralized classroom rosters, authentication, and shared grade tracking are outside this frontend application. V2 adds a separate multi-file workspace and individual device-local result/rubric exports; it does not change the original single-document lab.

## GitHub Pages

Copy the contents of **this directory** into a new `html-lab` repository. Keep JS LAB in its existing repository. The included `.github/workflows/pages.yml` assumes this project is at that new repository’s root. Select **GitHub Actions** in Settings → Pages and push to `main`, or run the workflow manually.

Vite uses `base: './'`; assets use relative paths; the app uses hash routing. `dist/` is the production artifact. The public deployment target is [HTML LAB on GitHub Pages](https://shadabur-rahaman.github.io/html-lab/). See the repository’s [Actions page](https://github.com/Shadabur-Rahaman/html-lab/actions) for deployment status.

## Sources and assets

- [HTML Living Standard](https://html.spec.whatwg.org/multipage/), including its introduction/history and element definitions.
- [CERN’s first website](https://info.cern.ch/).
- [HTML 2.0, RFC 1866](https://www.rfc-editor.org/rfc/rfc1866).
- [HTML 3.2](https://www.w3.org/TR/REC-html32), [HTML 4.01](https://www.w3.org/TR/html401/), [XHTML 1.0](https://www.w3.org/TR/xhtml1/).
- [HTML5 Recommendation, 28 October 2014](https://www.w3.org/TR/2014/REC-html5-20141028/), [HTML 5.2 historical snapshot](https://www.w3.org/TR/2017/REC-html52-20171214/).
- [JS LAB reference repository](https://github.com/Shadabur-Rahaman/js-lab). Its local source and public repository informed the sister-platform structure; the reference live URL was unavailable to the web fetch tool during implementation.
- `public/flower.mp4`: [MDN CC0 flower video](https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4). A silent visual study; an accompanying description and WebVTT track are provided.
- `public/tone.wav`: generated one-second 440 Hz tone, with no speech.
- `small.svg` and `wide.svg`: original geometric landscape illustrations.
- Google Fonts supplies DM Sans and Manrope when online. Local sans-serif fallbacks keep the app usable if fonts cannot load. No API key or paid service is required.

See `VERIFICATION.md` for checks actually performed and their limits.
