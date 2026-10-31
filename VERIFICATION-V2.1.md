# HTML LAB 2.1 continuation

Added a five-round closing-tag game with first-answer scoring and explanations, plus a parent–child DOM practice builder with immutable tree operations and a deliberately limited content model.

Project review rubrics now hold five 0–4 scores and evidence notes in the existing project record. Save on device persists them; reopening restores them. Editing or undoing website files marks existing reviews as needing another check. Filled reviews export separately as text; website ZIP contents are unchanged. Scores are self/peer assessments, not automatic certification.

CSS diagnostics check local url() references relative to the stylesheet and offer advisory feedback for static selectors that match no element in linked pages, including grouped rules. Dynamic pseudo selectors, nested selectors, imports and complete CSS syntax validation are outside these checks. Unsupported browsers receive a fallback notice. The stylesheet is never adopted into the application. Preview security remains unchanged. Uppercase CSS extensions now preview correctly.

Local path checks additionally validate linked-page fragments and resource types. Empty fragment links point to the page top. Fragment names are decoded before lookup.

Verification on 31 October 2026:

- Node suite: 16 passing tests, including immutable DOM nesting, invalid parent relationships, and void-element exercise coverage.
- Browser suite: 23 passing checks, including new CSS path/selector diagnostics, uppercase stylesheet rendering, saved rubric round trip, original progress preservation and preview isolation.
- Original course browser regression suite: 146 passing checks.
- Manual browser flow: completed tag game at 5/5; built body → main → ul and confirmed a paragraph child is rejected; saved a filled 15/20 rubric with notes, reloaded, reopened the named project and verified all scores and notes restored.
- Manual follow-up: editing a reopened reviewed project showed the stale-review notice; confirming refreshed it. A link to a missing fragment in another page appeared in the project check report.
- Production build passed.

CSSOM behavior reference: [MDN replaceSync](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replaceSync). CSSOM can discard invalid rules, so these diagnostics do not claim complete syntax coverage.
