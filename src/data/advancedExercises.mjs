export const advancedFragments = {
  semantics: {
    prompt: '<time ____="2026-10-31">31 October 2026</time>',
    answer: "datetime",
    reason:
      "datetime provides a machine-readable value without replacing readable content.",
  },
  forms: {
    prompt: '<input type="email" ____="email" name="email"> (autofill purpose)',
    answer: "autocomplete",
    reason:
      "autocomplete communicates a recognized field purpose; inputmode only suggests a keyboard.",
  },
  native: {
    prompt: '<form method="____"> inside a dialog',
    answer: "dialog",
    reason:
      'A method="dialog" form closes its containing dialog rather than making a network submission.',
  },
  media: {
    prompt:
      '<img srcset="small.jpg 400w, large.jpg 800w" ____="50vw" alt="Field station">',
    answer: "sizes",
    reason:
      "sizes estimates the layout slot for width-based candidate selection, not the actual CSS width.",
  },
  metadata: {
    prompt: '<link rel="____" href="https://example.org/preferred">',
    answer: "canonical",
    reason:
      "A canonical link identifies an intentional preferred URL; it does not guarantee ranking.",
  },
  language: {
    prompt: '<____ dir="auto">ليلى</____> (one element name)',
    answer: "bdi",
    reason: "bdi isolates an embedded name from surrounding bidi context.",
  },
  parsing: {
    prompt:
      "An HTML parser commonly inserts ____ around a run of tr elements inside table.",
    answer: "tbody",
    reason:
      "The HTML tree builder inserts a tbody when parsing ordinary table rows in this context.",
  },
  loading: {
    prompt:
      '<script src="ordered.js" ____></script> (classic external, after parsing, source order)',
    answer: "defer",
    reason:
      "defer provides ordered deferred classic execution; async does not guarantee source order.",
  },
  components: {
    prompt:
      '<template ____="open"><slot></slot></template> (declarative shadow root)',
    answer: "shadowrootmode",
    reason:
      "An appropriate initial document parser can attach a declarative shadow root to the template parent.",
  },
  security: {
    prompt:
      '<a target="_blank" rel="____" href="https://example.org">Reference</a> (explicitly prevent opener)',
    answer: "noopener",
    reason:
      "noopener makes the no-opener relationship explicit; modern _blank behavior often already supplies it.",
  },
  accessibility: {
    prompt: '<td ____="north rain">12</td> (explicit table header IDs)',
    answer: "headers",
    reason:
      "headers lists IDs of actual associated header cells; it is not a CSS class list.",
  },
};
export const advancedMatches = {
  forms: [
    ["autocomplete", "Field purpose for autofill"],
    ["inputmode", "Suggested keyboard"],
    ["pattern", "Whole-value constraint"],
  ],
  native: [
    ["inert", "Visible but excluded from interaction"],
    ["popover", "Nonmodal top-layer content"],
    ["details", "In-place disclosure"],
  ],
  media: [
    ["sizes", "Estimated layout slot"],
    ["srcset", "Candidate resources"],
    ["alt", "Purposeful text alternative"],
  ],
  loading: [
    ["preconnect", "Prepare an origin connection"],
    ["preload", "Fetch a current-page resource early"],
    ["prefetch", "Hint a possible future resource"],
  ],
  security: [
    ["sandbox", "Restrict iframe capabilities"],
    ["referrerpolicy", "Control referrer information"],
    ["integrity", "Check expected resource digest"],
  ],
};
