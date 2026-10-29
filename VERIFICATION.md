# Verification — 29 October 2026

## Automated checks

- `npm test`: seven Node tests covering curriculum integrity, project structure, timeline coverage, unique catalog entries, safe progress recovery, restrictive preview policy, and per-lesson worked explanations and independent tasks.
- `tests/browser-checks.html`: **146 passed, 0 failed**. Browser-native DOM checks cover all 36 lesson reference solutions and six project solutions; parser repair; element/text-node relationships; equivalent valid markup; preview sanitization; audit feedback; embedded SVG syntax; local resource delivery; all 89 catalog examples and descriptions; detectable invalid nesting; caption embedding; and opaque-origin preview isolation.
- `npm run build`: TypeScript checking followed by the Vite production build. Output is in `dist/`.

Run the browser checks with the development server running by opening `/tests/browser-checks.html`. They are development files and are not included in `dist/`.

## Interactive browser checks performed

- Homepage rendering and the HTML editor’s sandboxed output.
- Navigation through all twelve chapter entries and their corresponding lesson headings.
- Practice → Reveal solution → Check work; structural feedback and lesson completion.
- Bookmark and completion persistence after a reload.
- A full seven-question Chapter 1 quiz: 7/7 feedback, 100% score, and best-score persistence after a reload.
- Element catalog search for progress, its purpose text, and its contextual example.
- Time Machine navigation to the Living Standard and switching to the modern example.
- Project Studio access; all six project solutions checked in the browser DOM suite.
- Form Builder adding a control; List Builder adding an item; Semantic Builder adding an article; malformed-nesting prediction feedback.
- Teacher mode, teaching notes, first-class plan, and starting the lesson timer.
- Phone-width homepage and playground at a 390px browser viewport (375px content width after the scrollbar): no horizontal document overflow in those views; mobile navigation; editor/preview stacking; live-preview off followed by Run HTML; expanded editor view and exit.
- Native bundled video loading: readyState 4. Captions initially failed under the opaque sandbox; the bundled track is now embedded as data in the preview, and its native readyState is 2 (loaded). Sandbox permissions remain empty.
- Matching exercise: all three correct element/purpose pairs produce success feedback.
- Production preview: the complete app loads from `dist/`; a direct `#/lesson/document` link and refresh show the correct lesson and its worked explanation.

## Limits of verification

The browser suite checks defined structures and security properties; it is not a full standards conformance checker or exhaustive end-to-end coverage of every control combination. The app has not been audited with a screen reader or tested across all browser engines and physical devices. A wider accessibility review and classroom learner feedback would still be useful before broad classroom adoption.

The GitHub Pages workflow uses the static-compatible routing/build configuration. Live deployment status is available in [GitHub Actions](https://github.com/Shadabur-Rahaman/html-lab/actions); the public target is [HTML LAB](https://shadabur-rahaman.github.io/html-lab/). Historical views are educational recreations rendered by a modern browser, not old-browser emulation. Form submissions and nested preview embeds are intentionally blocked. No account, payment, registration backend, or persistent server storage is implemented or implied.
