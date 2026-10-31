# HTML LAB Advanced Edition 3.0

## Scope and integration

The [coverage audit](ADVANCED-AUDIT.md) distinguishes complete foundations from partial/missing advanced applications. Eleven optional workshops cover semantics/content models, forms, native interactions, responsive media, metadata, multilingual HTML, parsing, resource loading, templates/Shadow DOM, security, and accessibility/conformance. Foundation lesson pages have contextual onward links. The existing sidebar gains one Advanced HTML entry; the homepage, original chapter order, routes, projects and editor remain intact.

Each workshop includes purpose, standards context, use/avoid guidance, authored examples, visual/native investigation, prediction/reasoning, editable source, a debugging task, independent work, quiz explanations, recap, references, and ten teacher-note prompts. A flexible 60–90 minute schedule, teacher timer and downloadable notes complement the existing presenter/teacher workflow.

The existing Quiz accepts an optional question bank, fragment and matching exercises; original chapter/final banks remain defaults. Advanced scores, bookmarks, drafts and completion markers use `advanced-` identifiers in the unchanged `html-lab-progress-v1` schema. Advanced bookmarks appear in Saved & revision. Original 36-lesson percentages do not include advanced markers.

Six advanced project briefs/starters/references reuse ProjectWorkspace, its ZIP handling, IndexedDB saves and filled review rubrics. Additional checks inspect project-specific selectors across pages. These are structural requirements, not automatic mastery certification. Projects include manual evidence and Nu validation instructions, independent assignments and downloadable briefs/source. The product reference contains three distinct original PNG resolutions plus a working remote CC0 media/track example after export; blocked-preview behavior is explained.

## Security and behavioral boundaries

- General Lab remains `sandbox=""`; its script/submission CSP is unchanged. The multi-file workspace retains its opaque origin and fixed nonce-authorized navigation bridge. No learner execution capability was added.
- Native form controls use fixed trusted JSX, native constraints and actual FormData. All submissions are prevented. Arbitrary expensive patterns are not executed; the demo provides two bounded native patterns and explains the limit.
- Dialog/popover/inert demonstrations use actual browser elements/APIs. Ordinary template cloning uses a real template.content fragment; named slots use a real shadow root. A separate fixed, script-free opaque iframe demonstrates initial-parser declarative Shadow DOM. Learner HTML never enters these trusted application regions.
- Parser, metadata and audit inputs are inspected as detached source data. They are not inserted into the application DOM. JSON-LD is parsed as JSON, not evaluated. Reports do not claim full vocabulary, accessibility or conformance validation.
- Responsive selection and loading timelines are explicitly illustrative models. Exact fetch choices, byte savings, execution timings and accessibility exposure require real browser measurement/testing.
- Popover hint recognition is not a guarantee of consistent hint semantics. Invoker Commands are newer than dialog; trusted showModal and an ordinary review-page fallback remain available. Core feature recognition does not replace target-browser tests.
- `scripts/validate-advanced.mjs` requires an explicit `--send-authored-examples` flag and only imports authored curriculum/reference files. It never reads student storage or drafts and is not invoked automatically by CI.
- axe-core is a development-only dependency; the testing harness is excluded from the production build. A small contrast correction brightens existing muted navigation labels without changing the design system/layout.

## Executed verification — 31 October 2026

- Node suite: 21 tests covering original authored content, progress parsing, ZIP/path/security behavior, advanced content/quiz integrity, real distinct PNG dimensions and advanced project round trips.
- Original browser suite: 146 checks.
- V2 browser suite: 23 checks.
- Advanced browser suite: 54 checks, including all repair/reference selectors, project baseline audits, real parser recovery/modes, metadata/JSON errors, planted accessibility/security findings, constraint validation, FormData, modal/nonmodal behavior, Invoker Commands, popovers, inert focus, slots and unchanged preview restrictions.
- Actual React component suite: 14 checks, including the template-content regression, cloning/reset, shadow distribution, native form data, disabled controls, modal/focus return and all six advanced references passing through the existing workspace.
- Nu HTML Checker: explicitly submitted the 11 authored repair references and 18 project reference pages. All 29 returned no errors or warnings. This is a source-check result for those versions, not a guarantee of runtime behavior or complete accessibility.
- axe-core 4.14.0: selected WCAG A/AA/2.1 AA rules on integrated native-form and native-UI experiment views. Both returned no violations, with one incomplete result each requiring manual review. Initial muted-navigation contrast findings were corrected and rechecked.
- Manual UI: native modal Escape returned focus to its opener; popover opening/explicit closing and inert region behavior; form reference value disappeared from actual FormData when disabled; forms quiz 3/3 persisted as 100% after reload; advanced bookmark appeared in Saved & revision; teacher notes/timer worked; real cloned profile rendered.
- Phone viewport: 390px viewport (375px document client area), forms Learn/Experiment and the capstone project route had document scrollWidth equal to clientWidth; responsive screenshot inspected. Temporary viewport override was reset.
- Production TypeScript/Vite build and GitHub Pages route checks are recorded with the release/deployment result.

## Limits requiring further manual evidence

Browser checks used the available Chromium in-app browser. Firefox/Safari, multiple mobile OS keyboards, real screen readers, translations, zoom/high-contrast and every interaction state need target-audience review. No claim of complete WCAG coverage, universal browser support or whole-platform standards certification is made. Nu/axe findings apply only to tested source/views; parser repair does not make arbitrary learner source conforming.

A native confirmation in a temporary manual workspace-reference test stalled browser automation; the controlled React/workspace integration suite separately verified all six references. This did not change existing confirmation behavior or reduce its protections.

Standards references are linked within each workshop; compatibility/status guidance was checked against current WHATWG/MDN documentation on the date above. External documentation and real provider/media resources require connectivity. Offline bundle generation continues to include all emitted lazy chunks; a newly disconnected-device scenario was not retested for this release.
