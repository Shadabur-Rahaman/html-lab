import { documentHTML } from "./curriculum.mjs";
const q = (
  question,
  options,
  reason,
  type = "APPLY & EXPLAIN",
  answer = 0,
) => ({ question, options, reason, type, answer });
const doc = (body, head = "") =>
  documentHTML(body, "Advanced HTML practice").replace(
    "</head>",
    head + "\n</head>",
  );
export const standardsChecked = "31 October 2026";
export const advancedLessons = [
  {
    id: "semantics",
    title: "Semantics & content models",
    existing: [
      "sections",
      "landmarks",
      "meaning",
      "syntax",
      "attributes",
      "outline",
    ],
    intro:
      "A page can look correct while describing the wrong relationships. Learn to justify the structure, not just recognize element names.",
    why: "Content models give authors and tools shared rules. Semantics let headings, landmarks, quotations and data remain meaningful through visual redesigns.",
    context:
      "Modern HTML is a Living Standard. Categories overlap; they are not CSS display modes and do not form a simple block-versus-inline rule.",
    use: "Use this when designing articles, documentation, navigation and reusable page regions.",
    avoid:
      "Do not replace every div with section. A generic styling wrapper is appropriate when there is no extra semantic relationship.",
    sections: [
      [
        "Categories are overlapping sets",
        "Flow content covers most body content; phrasing content builds runs of text, such as em inside p. Sectioning content includes article, aside, nav and section. Heading content supplies headings; interactive content includes controls and links with href. Embedded content imports another resource, such as img. Metadata content belongs in head contexts. An element can be in several categories. Read both its permitted contexts and its content model.",
        "<main><section><h2>Results</h2><p>A <strong>useful</strong> result.</p></section></main>",
      ],
      [
        "Parents, transparency and interaction",
        "The a element has a transparent content model: permitted content depends on its surrounding context, with additional restrictions. It cannot contain another a, interactive descendants such as button, or descendants with tabindex. p accepts phrasing content; ul expects li (plus script-supporting elements), not arbitrary paragraphs. Void elements such as img and input have no end tag. Boolean attributes are true by presence; data-* holds author-defined strings and does not create behavior. IDs must be unique in a document.",
        '<a href="story.html"><article><h2>Read the story</h2><p>A summary.</p></article></a>\n<!-- Place a separate action button outside the link. -->',
      ],
      [
        "Architecture is contextual",
        'main is the dominant content. article is independently reusable; section is a thematic grouping, usually headed. aside is tangential; nav is major navigation. A header/footer within article describes that article rather than automatically being the page banner/contentinfo. search groups search/filter controls in supporting browsers; a form with role="search" is an alternative. Explicit h1–h6 levels still matter; section does not reset heading rank.',
        '<search><form><label for="find">Find a topic</label><input id="find" name="q" type="search"><button>Search</button></form></search>',
      ],
      [
        "Precise vocabulary",
        "figure groups self-contained content and figcaption supplies its caption. address contains contact information for its nearest article or body, not every postal address. time uses datetime for a machine-readable date; data associates readable content with a machine value. mark highlights relevance, dfn marks a term being defined, abbr expands abbreviations, cite names a work, q is an inline quotation and blockquote a quotation block. code is code, kbd user input, samp program output and var a variable. Choose by meaning, not font.",
        '<p><dfn>Latency</dfn> is a delay. Press <kbd>Enter</kbd>; <samp>Ready</samp> appears. In <code>x + 1</code>, <var>x</var> varies.</p>\n<p><time datetime="2026-10-31">31 October 2026</time>: <data value="SKU-42">Field notebook</data></p>',
      ],
    ],
    example: doc(
      '<main><article><header><h1>River research notes</h1><p><time datetime="2026-10-31">31 October 2026</time></p></header><section><h2>Findings</h2><p><dfn>Runoff</dfn> is water flowing over land. <mark>Heavy rain</mark> increased it.</p><blockquote cite="https://example.org/report"><p>Measure before drawing conclusions.</p></blockquote><p>Adapted from <cite>River Field Guide</cite>.</p></section><footer><address>Research desk: <a href="mailto:desk@example.org">Email the desk</a></address></footer></article></main>',
    ),
    broken: doc(
      '<main><h1>News</h1><p>Report<section><h2>Findings</h2><p>Rain increased.</p></section></p><a href="#report"><button>Read report</button></a></main>',
    ),
    task: "Repair the paragraph/section nesting, replace the button inside the link with link text, and structure the report as an article with a time element. Then build a documentation section with code, kbd and samp.",
    checks: "main article; article time[datetime]; a[href]; section > h2",
    predict: "Does section inside p remain a child of that paragraph?",
    prediction:
      "No. The HTML parser closes the paragraph before the section. The source still needs repair.",
    mistake:
      "A semantic element is not automatically valid in every parent, and generic containers are not automatically wrong.",
    recap:
      "Meaning first; permitted parent and content second; appearance later.",
    discussion:
      "When can an article-wide link be appropriate, and where must its other interactive controls go?",
    references: [
      "https://html.spec.whatwg.org/multipage/dom.html#content-models",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements",
    ],
    quiz: [
      q(
        "Which statement about content categories is accurate?",
        [
          "An element may belong to several categories",
          "Every flow element is permitted in a paragraph",
          "Categories set CSS display",
        ],
        "Categories describe HTML relationships. Each element still has its own permitted contexts and content model.",
      ),
      q(
        'Repair: <a href="story.html"><button>Read</button></a>',
        [
          "Use link text inside a; move any separate action button outside",
          'Add role="button" to the anchor',
          "Keep it because it looks clickable",
        ],
        "An anchor with href cannot contain interactive descendants. Nesting competing controls creates invalid and confusing interaction.",
      ),
      q(
        "A wrapper exists only for layout. What should you choose?",
        ["A div can be appropriate", "Always article", "Always nav"],
        "Use a generic container when no more specific semantic relationship describes the content.",
      ),
    ],
  },
  {
    id: "forms",
    title: "Professional native forms",
    existing: ["controls", "validation", "submission"],
    intro:
      "A professional form is a labeled conversation with useful defaults, clear constraints and an honest processing boundary.",
    why: "Browser validation catches common mistakes early; form association and successful-control rules determine the actual submitted data.",
    context:
      "Native controls have evolved across desktop and mobile browsers. Widgets, validation wording and keyboard layouts vary.",
    use: "Use native controls for applications, admission, registration and orders; request only needed information.",
    avoid:
      "Do not treat a valid-looking browser value as trusted server data, or collect real credentials in this teaching lab.",
    sections: [
      [
        "Types and input assistance",
        'text, search, tel, url, email and password handle text; number, range and color have different value models; date, month, week, time and datetime-local describe dates/times with varying widgets. checkbox/radio represent choices; file chooses files; hidden stores submitted values without showing a control; submit/image/reset/button have distinct activation purposes. tel does not validate a phone format. number is unsuitable for postal codes and card identifiers. autocomplete="section-applicant shipping given-name", email and postal-code identify purposes; inputmode and enterkeyhint suggest keyboards/actions without validation. autofocus can move focus unexpectedly, especially on phones.',
        '<label for="postal">Postal code</label><input id="postal" name="postal" autocomplete="shipping postal-code" inputmode="numeric" enterkeyhint="next">',
      ],
      [
        "Constraints and states",
        "required rejects a missing required value. pattern matches the whole non-empty value using current Unicode v-mode syntax; do not add /slashes/. min/max/step constrain supported numeric/date values; minlength/maxlength constrain user-edited text. multiple is supported by email/file, not all types. checkValidity returns a Boolean; validity exposes states such as valueMissing, typeMismatch, patternMismatch, rangeUnderflow and stepMismatch. reportValidity requests browser feedback. Programmatically assigned values do not receive every user-input length check. novalidate/formnovalidate bypass interactive validation, not server requirements.",
        '<label for="quantity">Quantity, 2–10 in steps of 2</label><input id="quantity" name="quantity" type="number" min="2" max="10" step="2" required>',
      ],
      [
        "Names, groups and successful controls",
        'Use visible labels, not placeholders as replacements. aria-describedby can connect instructions/errors; keep an error summary and move focus thoughtfully after a failed custom workflow. fieldset and legend name a group. readonly fields usually submit and remain focusable; disabled fields do not submit and skip constraint validation. checked/selected describe default choices; unchecked checkbox/radio values are absent. A control may associate with a form using form="id" even outside it. datalist suggests rather than restricts; output represents a result but does not calculate itself. progress is task completion; meter is a measurement.',
        '<form id="application"><fieldset><legend>Contact</legend><label for="mail">Email</label><input id="mail" name="email" type="email" autocomplete="email" aria-describedby="mail-help" required><p id="mail-help">Use an address you check.</p></fieldset></form><button form="application">Submit application</button>',
      ],
      [
        "Submission, uploads and overrides",
        'GET adds encoded values to a URL and suits retrieval; POST puts values in the request body but still needs HTTPS. Default application/x-www-form-urlencoded encodes name/value pairs. multipart/form-data carries file content; let the browser generate its boundary. text/plain is ambiguous and unsuitable for robust processing. Submit buttons may override action/method/enctype/target/validation with formaction, formmethod, formenctype, formtarget and formnovalidate. method="dialog" closes a containing dialog without a network submission. accept is a file-picker hint; capture may request a camera on supporting devices, not enforce safety or compatibility. Validate all uploads on the server.',
        '<form method="post" enctype="multipart/form-data"><label for="cv">CV, PDF preferred</label><input id="cv" name="cv" type="file" accept=".pdf,application/pdf"><button>Send</button><button formaction="/draft" formmethod="post" formnovalidate>Save draft</button></form>',
      ],
    ],
    example: doc(
      '<main><h1>Learning registration</h1><form id="join" method="post"><fieldset><legend>Your contact</legend><label for="full">Full name</label><input id="full" name="name" autocomplete="name" minlength="2" required><label for="mail">Email</label><input id="mail" name="email" type="email" autocomplete="email" required aria-describedby="mail-help"><p id="mail-help">Example only. No messages are sent.</p></fieldset><fieldset><legend>Course choice</legend><label for="course">Course</label><select id="course" name="course"><option value="html">HTML standards</option><option value="media">Accessible media</option></select></fieldset><button>Review application</button></form></main>',
    ),
    broken: doc(
      '<main><h1>Apply</h1><form><input placeholder="Email" name="email"><input name="reference" disabled value="COURSE-42"><button>Apply</button></form></main>',
    ),
    task: "Add visible associated labels, email type, required and autocomplete. Make the reference readonly if it must be submitted. Add a fieldset/legend and instructions linked by aria-describedby. Build a second order form using quantity min/max/step and an upload with accept; explain the server checks.",
    checks:
      'form fieldset > legend; label[for]; input[type="email"][required][autocomplete]; input[readonly][name]',
    predict: 'Does disabled="false" submit a field?',
    prediction:
      "No. disabled is Boolean: its presence disables the control and normally excludes its value from submission.",
    mistake:
      "Browser autofill and keyboard hints improve input; neither proves identity or makes unsafe data trustworthy.",
    recap:
      "Label → help → constrain → inspect data → validate again on the server.",
    discussion:
      "Why does form.submit() bypass interactive validation while requestSubmit() follows a submitter workflow?",
    references: [
      "https://html.spec.whatwg.org/multipage/forms.html",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/pattern",
    ],
    quiz: [
      q(
        "A field must be visible, uneditable and included in form data. Choose:",
        [
          "readonly on a supported text input",
          'disabled="false"',
          "Remove name",
        ],
        "Readonly text fields are normally included; disabled controls and controls without a name are normally omitted.",
      ),
      q(
        "Match the attributes to purposes:",
        [
          "inputmode hints a keyboard; pattern constrains a value",
          "accept securely validates uploaded bytes",
          "autocomplete encrypts a password",
        ],
        "Hints guide the browser UI. Servers must validate input and file content independently.",
      ),
      q(
        "Which encoding suits a form uploading a file?",
        [
          "multipart/form-data with a browser-generated boundary",
          "text/plain for reliable parsing",
          "GET encrypts file content",
        ],
        "Multipart encoding represents files and fields. HTTPS provides transport protection; request method alone does not.",
      ),
    ],
  },
  {
    id: "native",
    title: "Native interactions & focus",
    existing: ["modern", "accessible"],
    intro:
      "Disclosure, dialog and popover solve different interaction problems. Compare their real browser behavior with keyboard and focus tests.",
    why: "Native behavior reduces the custom code needed for disclosure, top-layer rendering and modal focus management.",
    context:
      "details/dialog are established. Popover and newer Invoker Commands need feature-specific compatibility checks; hint popovers still vary.",
    use: "Use details for in-place disclosure, dialog for a focused task, and a nonmodal popover for supplementary content.",
    avoid:
      "Do not use a modal for ordinary navigation or assume a popover is a tooltip or an accessible menu widget.",
    sections: [
      [
        "Disclosure versus a task",
        'details contains a summary toggle and additional content. A disclosure expands within the document; it does not make the page inert or trap focus. dialog open or show() is nonmodal. showModal() places a dialog in the top layer and makes other content in that document inert. Provide a name via aria-labelledby, a meaningful initial focus target and an explicit close control; test return focus and Escape. A form with method="dialog" closes its dialog and sets a return value, without posting data.',
        '<dialog id="confirm" aria-labelledby="confirm-title"><h2 id="confirm-title">Review your choice</h2><form method="dialog"><button value="done">Done</button></form></dialog>',
      ],
      [
        "Declarative invocation",
        'Supporting browsers allow button commandfor="confirm" command="show-modal" and command="close" or "request-close". Invoker Commands are newer than dialog itself. Feature-test support and retain a trusted showModal/close fallback or an ordinary page for the task. The general learner preview still blocks learner scripts; the trusted demonstration below uses fixed application handlers.',
        '<button commandfor="confirm" command="show-modal">Review</button>',
      ],
      [
        "Popover is not modal",
        'popover="auto" participates in light dismissal (outside click/Escape) and generally dismisses another auto popover, with nesting exceptions. manual allows independent popovers and requires explicit closing. hint is a newer, unevenly implemented state; use auto as a practical fallback and test actual behavior. popovertarget and popovertargetaction="show|hide|toggle" connect buttons. The top layer avoids ordinary stacking/clipping conflicts but does not supply the content’s semantics. Tooltips need appropriate focus/hover exposure and should not contain interactive tasks.',
        '<button popovertarget="help-note">Help</button><div id="help-note" popover="auto"><p>Keep your source copy.</p><button popovertarget="help-note" popovertargetaction="hide">Close help</button></div>',
      ],
      [
        "Hidden, inert and focus",
        "hidden is an enumerated attribute: the ordinary hidden state removes content from presentation, while until-found has specialized find/reveal behavior with varying support. inert leaves content visible but removes descendants from focus, click interaction and accessibility exposure. A visually hidden CSS technique can keep text exposed to assistive technology; it is different from both. Do not put needed instructions only in inert or hidden content. Modal dialogs make the rest of their document inert; a nonmodal dialog does not.",
        "<section inert><button>This visible button cannot be activated while inert</button></section>",
      ],
    ],
    example: doc(
      '<main><h1>Help center</h1><details><summary>Where is my project?</summary><p>Use Save on device, then export a backup.</p></details><button popovertarget="tip">Backup tip</button><aside id="tip" popover="auto"><p>Keep an exported copy.</p><button popovertarget="tip" popovertargetaction="hide">Close tip</button></aside><button commandfor="review-dialog" command="show-modal">Review</button><dialog id="review-dialog" aria-labelledby="review-title"><h2 id="review-title">Review checklist</h2><form method="dialog"><button value="done">Done</button></form></dialog></main>',
    ),
    broken: doc(
      "<main><h1>Help</h1><dialog open><p>Do something</p></dialog><div>Hidden instructions</div></main>",
    ),
    task: 'Give the dialog an accessible name and a form method="dialog" close button. Add a details FAQ and an auto popover with an explicit close button. Test actual modal versus nonmodal behavior in the trusted lab.',
    checks:
      'dialog[aria-labelledby]; dialog form[method="dialog"] button; details > summary; [popover="auto"]; button[popovertarget]',
    predict: "Does dialog open make the background inert?",
    prediction:
      "No. open alone displays a nonmodal dialog. Modal behavior comes from showModal or supported declarative show-modal invocation.",
    mistake:
      "A role or a large overlay does not supply native modal behavior. Test interaction and focus, not just appearance.",
    recap:
      "Disclosure expands; popover supplements; modal dialog focuses a task.",
    discussion:
      "Which behavior must a fallback preserve when a browser lacks Invoker Commands?",
    references: [
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover",
      "https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API",
    ],
    quiz: [
      q(
        "Predict: dialog has only the open attribute.",
        [
          "It is nonmodal",
          "It automatically makes the page inert",
          "It submits every form",
        ],
        "The open attribute exposes the dialog without the showModal top-layer/modal algorithm.",
      ),
      q(
        "Which popover assumption is safe?",
        [
          "An auto popover is nonmodal and supports light dismissal in supporting browsers",
          "All popovers trap focus",
          "Popover creates a complete ARIA menu automatically",
        ],
        "Popover supplies showing/dismissal behavior, while content semantics and keyboard tasks still need careful design.",
      ),
      q(
        "A visible region must temporarily stop interaction. Choose:",
        [
          "inert, after considering access to its content",
          'hidden="false"',
          'tabindex="99" on every child',
        ],
        "Inert suppresses interaction and accessibility exposure while remaining visible. Do not use it on content people still need.",
      ),
    ],
  },
  {
    id: "media",
    title: "Responsive media & image decisions",
    existing: ["images", "responsive", "media"],
    intro:
      "Supply the right image for the available space while preserving meaning and a stable layout.",
    why: "Large transfers waste bandwidth; missing dimensions can shift content. Good alternatives and timed text keep media useful beyond sight and hearing.",
    context:
      "Image selection is a browser decision. Priority, preload, lazy loading and decoding are hints with device/network-dependent effects.",
    use: "Use resolution switching for the same composition, picture for art direction or format alternatives.",
    avoid:
      "Do not lazy-load the likely above-the-fold LCP image or claim a file-size saving without measurement.",
    sections: [
      [
        "Slot width and density",
        "With w descriptors, sizes estimates the image’s layout slot before loading. It does not set CSS width. A 400 CSS-pixel slot at DPR 2 suggests about 800 physical pixels, but browser choices may differ with cache/network heuristics. x descriptors express density for a fixed intended size; do not mix w and x in the same list. In picture, the first suitable source provides its candidates; img is required for fallback and alt.",
        '<picture><source media="(min-width: 700px)" srcset="wide-800.webp 800w, wide-1600.webp 1600w" sizes="80vw"><img src="crop-400.jpg" srcset="crop-400.jpg 400w, crop-800.jpg 800w" sizes="100vw" width="800" height="600" alt="Students testing a river sample"></picture>',
      ],
      [
        "Stable layout and priorities",
        'width and height communicate intrinsic aspect-ratio information so browsers can reserve space; CSS can adapt the actual rendered size. Layout shifts contribute to CLS, but a width/height pair alone is not a full performance guarantee. loading="eager" is the default; lazy delays eligible offscreen loading. decoding="async" is a decoding hint; fetchpriority="high" suggests relative fetch priority, not a guaranteed sequence. Measure real resources with browser Network/Performance tools.',
        '<img src="hero.webp" width="1200" height="800" alt="River research station" loading="eager" fetchpriority="high" decoding="async">',
      ],
      [
        "Formats and safe vectors",
        "JPEG often suits photos, PNG lossless graphics/transparency, WebP and AVIF efficient modern encodings; quality and support guide selection. SVG can be referenced by img or included inline for shapes/viewBox and accessible title where needed. Inline SVG and imported SVG can contain active or external content: use trusted assets and sanitization. This app’s learner project importer deliberately accepts raster assets, and its general preview restricts SVG. A trusted bundled vector is different from arbitrary uploaded markup.",
        '<svg viewBox="0 0 100 100" role="img" aria-labelledby="chart-label"><title id="chart-label">One highlighted observation</title><circle cx="50" cy="50" r="20" /></svg>',
      ],
      [
        "Media alternatives and embeds",
        'audio/video controls expose native playback; source provides format fallbacks. Fallback text alone does not replace a transcript. track kind="captions" includes dialogue and relevant sounds; subtitles usually translate speech. WebVTT begins with WEBVTT, a blank line, timing cues and text. preload="none|metadata|auto" is a hint. Avoid autoplay assumptions. Give iframe a title, restrict its sandbox/allow permissions, and consider lazy loading when appropriate. External providers can refuse embedding.',
        '<video controls preload="metadata"><source src="lesson.mp4" type="video/mp4"><track kind="captions" src="lesson.en.vtt" srclang="en" label="English" default><p><a href="lesson.mp4">Download video</a></p></video>\n<!-- WEBVTT\n\n00:00.000 --> 00:02.000\n[Water flowing] -->',
      ],
    ],
    example: doc(
      '<main><h1>Responsive illustration</h1><figure><picture><source media="(min-width: 600px)" srcset="./wide.svg"><img src="./small.svg" width="320" height="180" alt="Coral hills below a pale sun" decoding="async"></picture><figcaption>A wide composition on larger viewports.</figcaption></figure><p>Use the existing media lesson to play bundled audio/video and inspect captions.</p></main>',
    ),
    broken: doc(
      '<main><h1>Product</h1><img src="./small.svg" loading="lazy"></main>',
    ),
    task: "Provide purposeful alt text and width/height. Treat this image as the hero: use eager loading. Add picture/source with a fallback img; explain whether your source changes composition or resolution. Write a two-cue WebVTT sample in your notes.",
    checks:
      'picture source[srcset]; picture img[alt][width][height][loading="eager"]',
    predict:
      "If sizes says 50vw, does it force the image’s rendered CSS width?",
    prediction:
      "No. It informs candidate selection. CSS/layout controls the displayed width.",
    mistake:
      "A candidate-selection formula is a teaching model, not a promise of the exact URL every browser fetches.",
    recap: "Composition → slot → density → alternatives → measured loading.",
    discussion:
      "Why might a cached larger image be reused even when a smaller candidate appears sufficient?",
    references: [
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img",
      "https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API",
    ],
    quiz: [
      q(
        "Model: 400 CSS-pixel slot, DPR 2. Approximate desired width?",
        ["800 source pixels", "200 source pixels", "DPR has no effect"],
        "Slot × DPR estimates desired resource width. Actual browser selection also considers other conditions.",
      ),
      q(
        "Which image should usually avoid lazy loading?",
        [
          "The likely initial hero/LCP image",
          "An image far below the fold",
          "Every decorative footer image",
        ],
        "Delaying a critical initial image can delay useful rendering.",
      ),
      q(
        "Where does the text alternative belong in picture?",
        ["On the fallback img", "Only on source", "Only in sizes"],
        "The img element supplies the alternative text for the selected visual resource.",
      ),
    ],
  },
  {
    id: "metadata",
    title: "Document metadata & discoverability",
    existing: ["metadata", "document"],
    intro:
      "A document’s head describes its identity, relationships and intended presentation beyond the visible page.",
    why: "Accurate metadata helps browsers, language tools, search crawlers and social previews interpret a document consistently.",
    context:
      "Search engines and social services apply their own evolving policies. JSON-LD and Schema.org are related metadata technologies, not HTML elements.",
    use: "Use metadata suited to the page: an article’s author/date, a product’s truthful offer, and an appropriate canonical URL.",
    avoid:
      "Do not add every optional field mechanically or promise rankings and rich results.",
    sections: [
      [
        "Identity and relationships",
        "Keep the UTF-8 charset declaration early (within the first 1024 bytes), a useful title, language and viewport. A description may influence snippets but is not guaranteed. A canonical link signals a preferred URL for similar pages; use an intentional absolute URL. Robots directives such as noindex affect cooperating crawlers, not access control; blocking crawling can prevent discovery of a noindex. Descriptive stable paths and actual links matter. An HTML sitemap helps people navigate; an XML sitemap helps communicate URLs to crawlers.",
        '<link rel="canonical" href="https://example.org/articles/river-study"><meta name="robots" content="index,follow">',
      ],
      [
        "Sharing, alternates and link policies",
        'Open Graph og:title/og:type/og:url/og:image describe a share object; social cards such as twitter:card are platform-specific conventions. Use a real publicly fetchable image, not a device-local path. rel="icon" declares a favicon. rel="alternate" hreflang="hi" signals another-language URL; provide reciprocal valid alternates and distinguish language from direction. author identifies authorship. nofollow is a crawler relationship hint; noopener prevents an opener relationship; noreferrer suppresses referrer information and also implies noopener behavior.',
        '<link rel="alternate" hreflang="hi" href="https://example.org/hi/river-study"><link rel="icon" href="/favicon.png"><meta property="og:type" content="article"><meta name="twitter:card" content="summary_large_image">',
      ],
      [
        "Structured data with evidence",
        'script type="application/ld+json" carries JSON-LD data, not executable JavaScript. Schema.org supplies types such as Article, Product and BreadcrumbList. Article can name a headline, author and publication date; Product can describe truthful offers; breadcrumb items describe navigation positions. Keep metadata consistent with visible content, escape safely when generating it, and validate against the intended consumer’s rules. Parsing JSON is not semantic validation or proof of rich-result eligibility.',
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"River field notes","datePublished":"2026-10-31","author":{"@type":"Organization","name":"Learning Desk"}}</script>',
      ],
    ],
    example: doc(
      '<main><article><h1>River field notes</h1><p>Learning Desk · <time datetime="2026-10-31">31 October 2026</time></p><p>A fictional report for metadata practice.</p></article></main>',
      '<meta name="description" content="A fictional river field report for HTML practice."><link rel="canonical" href="https://example.org/river-notes"><meta name="author" content="Learning Desk"><meta property="og:title" content="River field notes"><meta property="og:type" content="article"><meta property="og:url" content="https://example.org/river-notes"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"River field notes"}</script>',
    ),
    broken: doc(
      "<main><h1>River news</h1><p>A field report.</p></main>",
      '<link rel="canonical" href="relative-copy.html">',
    ),
    task: "Give this page a specific title, description and absolute canonical URL. Add truthful article metadata and a language alternate only if a corresponding page exists. Inspect your source; JSON-LD remains inert data and is removed from the safe visual preview.",
    checks:
      'head meta[name="description"]; head link[rel="canonical"][href^="https://"]; head meta[property="og:title"]',
    predict: "Does valid JSON-LD guarantee a rich result?",
    prediction:
      "No. Visible evidence, vocabulary constraints, policies, indexing and search engine decisions also matter.",
    mistake:
      "Optional metadata is contextual. A missing canonical or social image is not automatically an HTML conformance error.",
    recap:
      "Identity → relationships → sharing → evidence; no ranking guarantees.",
    discussion:
      "How would conflicting visible price and Product offer metadata mislead both people and automated consumers?",
    references: [
      "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
      "https://schema.org/",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta",
    ],
    quiz: [
      q(
        "A canonical URL is best described as:",
        [
          "A preferred-URL signal for related duplicate content",
          "A password for a private page",
          "A guaranteed ranking improvement",
        ],
        "Canonicalization is an indexing signal, not authorization or a ranking promise.",
      ),
      q(
        "JSON-LD and Schema.org are:",
        [
          "Related metadata syntax/vocabulary used within a data script",
          "New HTML elements",
          "A replacement for visible accurate content",
        ],
        "HTML can carry a data block; the JSON-LD syntax and vocabulary have their own rules.",
      ),
      q(
        "Which metadata is universally mandatory for rich rankings?",
        [
          "No metadata guarantees rankings or rich results",
          "An arbitrary Product type on every page",
          "A repeated keyword list",
        ],
        "Metadata should accurately describe the actual page and meet applicable consumer policies.",
      ),
    ],
  },
  {
    id: "language",
    title: "Multilingual HTML & text direction",
    existing: ["attributes", "entities"],
    intro:
      "Encoding, language and text direction solve different problems. A page can support Unicode and still lack translation or correct language markup.",
    why: "Language declarations assist pronunciation and language-sensitive tools. Direction controls bidi layout; isolation protects mixed-direction boundaries.",
    context:
      "Unicode covers scripts and characters. HTML supplies lang/dir and inline language/direction mechanisms; neither automatically translates text.",
    use: "Use language changes and bidi isolation in international content, names, comments and educational annotations.",
    avoid:
      "Do not assume every non-English language is right-to-left or use bdo to reorder ordinary prose.",
    sections: [
      [
        "Encoding is not translation",
        "UTF-8 encodes Unicode text, including English, Hindi, Kannada, Arabic/Urdu and Japanese. lang uses a language tag such as en, hi, kn, ar or ja. Set the page language on html, then override an element when its content changes language. A Hindi or Kannada paragraph normally uses left-to-right direction. Language attributes describe actual content, not a language switch that translates it.",
        '<p lang="hi">नमस्ते</p><p lang="kn">ನಮಸ್ಕಾರ</p><p lang="ar" dir="rtl">مرحبًا</p>',
      ],
      [
        "Direction and isolation",
        'dir="ltr|rtl|auto" sets base direction independently of lang; auto derives it from content. bdi isolates unknown embedded text so punctuation and adjacent numbers do not unexpectedly join its bidi context. bdo overrides directional ordering and is suitable only when an explicit override is intended. Keep logical source order; use CSS logical properties later for layout instead of reversing the source text.',
        '<p>User <bdi dir="auto">ليلى</bdi>: 12 observations</p><p><bdo dir="rtl">ABC</bdo> demonstrates a deliberate override.</p>',
      ],
      [
        "Pronunciation, annotations and forms",
        "ruby groups a base with pronunciation annotations in rt; rp provides parentheses fallback. Mark language changes for assistive technology. Locale conventions differ for names, dates, addresses and numbers: avoid one-country assumptions or forced numeric postal codes. datetime-local has no timezone. Input UI can follow locale while the submitted value uses a defined machine format. Language alternates need real URLs and appropriate lang values on each destination.",
        '<ruby lang="ja">漢<rp>(</rp><rt>かん</rt><rp>)</rp>字<rp>(</rp><rt>じ</rt><rp>)</rp></ruby>',
      ],
    ],
    example: doc(
      '<main><h1>Welcome / नमस्ते</h1><p lang="hi">नमस्ते</p><p lang="kn">ನಮಸ್ಕಾರ</p><p lang="ar" dir="rtl">مرحبًا</p><p>Contributor: <bdi dir="auto">ليلى</bdi> — 12 notes.</p><p><ruby lang="ja">漢<rp>(</rp><rt>かん</rt><rp>)</rp>字<rp>(</rp><rt>じ</rt><rp>)</rp></ruby></p></main>',
    ),
    broken: doc(
      '<main><h1>Welcome</h1><p lang="hi" dir="rtl">नमस्ते</p><p>Contributor: ليلى — 12 notes.</p></main>',
    ),
    task: "Correct the Hindi direction, isolate the Arabic contributor name with bdi, add a Kannada language change and Japanese ruby annotation. Explain why this is multilingual content rather than automatic translation.",
    checks: 'p[lang="hi"][dir="ltr"]; bdi[dir="auto"]; [lang="kn"]; ruby rt',
    predict: 'Does lang="ar" automatically set dir="rtl"?',
    prediction:
      "No. Set direction explicitly when needed; language and direction are independent.",
    mistake:
      "Visual ordering and logical source order differ; use isolation for mixed content rather than reversing strings.",
    recap: "charset encodes; lang identifies; dir orders; bdi isolates.",
    discussion:
      "How would you design a name/address form without assuming one naming system or postal-code format?",
    references: [
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdi",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ruby",
    ],
    quiz: [
      q(
        "A Kannada paragraph normally needs which base direction?",
        [
          "ltr",
          "rtl because it is not English",
          "Language always decides direction automatically",
        ],
        "Kannada is normally written left-to-right. Direction depends on the writing system/content, not whether a language is English.",
      ),
      q(
        "Insert an unknown contributor name into mixed-direction prose:",
        [
          "Use bdi with appropriate dir, often auto",
          "Reverse the text string",
          "Use bdo everywhere",
        ],
        "Bidi isolation contains the inserted text’s directional effect without overriding ordinary character ordering.",
      ),
    ],
  },
  {
    id: "parsing",
    title: "Parser detective & document modes",
    existing: ["nesting", "dom", "repair", "versions"],
    intro:
      "Source is a sequence of characters. The browser tokenizes it and constructs a DOM using context-sensitive rules.",
    why: "Understanding repair rules explains why DevTools can show nodes you never typed and why successful rendering does not prove validity.",
    context:
      "HTML recovery is specified; XML parsing follows well-formedness rules. The response MIME type, not an XHTML-looking slash, determines parsing on the web.",
    use: "Use a real parser to investigate unexpected nesting and compare source with the resulting DOM.",
    avoid:
      "Do not implement HTML parsing with regular expressions or trust a recovered tree as evidence of source conformance.",
    sections: [
      [
        "From characters to nodes",
        "Tokenization recognizes start/end tags, attributes, comments and text; tree construction responds to the current context. Optional html/head/body or some end tags may be omitted only under defined conditions. Void elements cannot have children/end tags. Character references decode in normal text; script/style use raw-text-like parsing contexts where ordinary text rules differ (script has additional states). textarea/title are escapable raw text (RCDATA), where character references are handled.",
        "<p>&lt;button&gt; is text.</p><textarea>&lt;button&gt;</textarea>",
      ],
      [
        "Repair, tables and interaction",
        "Starting h2 closes an open p. Missing li end tags can be implied. Parsing table rows can insert tbody. Text placed in a table in an inappropriate position may be foster-parented outside it. Nested anchors/buttons have specialized recovery rules; do not infer that the intended source nesting survives. Predict first, inspect the DOM, then repair the source and validate it.",
        "<table>Stray text<tr><td>Observation</td></tr></table>",
      ],
      [
        "MIME types and modes",
        "text/html invokes HTML parsing. application/xhtml+xml invokes XML parsing, where malformed markup produces a parser error. XML also needs correct namespaces for XHTML semantics. <!DOCTYPE html> requests standards mode; an absent/legacy doctype can trigger quirks or limited-quirks behavior. document.compatMode distinguishes BackCompat (quirks) from CSS1Compat (standards or limited quirks), not every mode detail. View Source shows received markup; Elements shows a live DOM that scripts may later change.",
        "<!DOCTYPE html>\n<!-- Standards-oriented HTML document; this is not an HTML version number. -->",
      ],
    ],
    example: doc(
      '<main><h1>Parser observations</h1><p>Before</p><h2>Heading</h2><p>After &amp; beyond.</p><table><caption>Observation</caption><tbody><tr><th scope="col">Result</th></tr><tr><td>Explicit grouping</td></tr></tbody></table></main>',
    ),
    broken: doc(
      "<main><h1>Parser puzzle</h1><p>Before<h2>Inside?</h2>After</p><table>Stray text<tr><td>One</td></tr></table></main>",
    ),
    task: "Predict the tree before inspecting it. Make the paragraphs and heading explicit siblings, move the stray text out of table, and add caption, tbody and an appropriate header. Compare text/html with XML parsing in Parser Detective.",
    checks: "main > h2; main > p; table caption; table tbody; th[scope]",
    predict:
      "Will DOMParser preserve tr directly under table in an HTML document?",
    prediction:
      "It normally inserts a tbody for this source. Source and DOM are distinct representations.",
    mistake:
      "Browser recovery is useful interoperability behavior, not permission to author invalid structures.",
    recap: "Source → tokens → context → DOM; inspect, explain, then fix.",
    discussion:
      "Why might a DOM-only validator be unable to report every original source error?",
    references: [
      "https://html.spec.whatwg.org/multipage/parsing.html",
      "https://developer.mozilla.org/en-US/docs/Web/API/DOMParser",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Quirks_mode_and_standards_mode",
    ],
    quiz: [
      q(
        "Predict: <p>Before<h2>Heading</h2>After</p>",
        [
          "h2 is not a child of the original p",
          "h2 stays inside p",
          "The browser must refuse the entire document",
        ],
        "The HTML tree builder closes the paragraph before inserting the heading; later recovery can create additional nodes.",
      ),
      q(
        "An XHTML-looking file served as text/html uses:",
        [
          "The HTML parser",
          "The XML parser because tags self-close",
          "No parser",
        ],
        "The MIME type selects the parser; source style alone does not.",
      ),
      q(
        "An inserted tbody means:",
        [
          "The parser applied HTML tree-construction rules",
          "The source was automatically certified conforming",
          "A server inserted JavaScript",
        ],
        "DOM insertion is specified recovery/construction behavior and does not certify the source.",
      ),
    ],
  },
  {
    id: "loading",
    title: "Resource loading & progressive enhancement",
    existing: ["web", "layers", "responsive"],
    intro:
      "Resource declarations influence when the browser can parse, fetch, execute and render. Learn ordering guarantees separately from timing guesses.",
    why: "A misplaced blocking script or an unnecessary preload can delay the content people need.",
    context:
      "Browsers schedule around network, cache, priority and device limits. The timeline below is an illustrative ordering model, not a measured waterfall.",
    use: "Use loading attributes and hints only when they address a measured discovery or scheduling need.",
    avoid:
      "Do not preload every resource or assume async executes in source order.",
    sections: [
      [
        "Classic, deferred, async and module scripts",
        'A parser-inserted classic external script without async/defer normally pauses parsing for fetch and execution. defer downloads alongside parsing, then executes deferred classic scripts in document order after parsing and before DOMContentLoaded. async executes when ready, without source-order guarantees, interrupting parsing if necessary. type="module" is deferred by default and fetches dependencies; async modules change scheduling. defer on an inline classic script does not provide this external-script behavior. nomodule is a historical legacy fallback pattern, not a default requirement for modern-only sites.',
        '<script src="app.js" defer></script>\n<script type="module" src="enhancement.js"></script>',
      ],
      [
        "Styles, render blocking and source order",
        "A matching stylesheet commonly blocks rendering while it is fetched/processed, although HTML parsing can continue. Some script execution waits for stylesheets, so script/CSS interactions complicate simple diagrams. Put essential meaningful HTML early, give controls an honest fallback, and enhance without destroying native semantics. Script placement near the body end changes discovery and available DOM, but defer often states intent more clearly.",
        '<link rel="stylesheet" href="site.css">\n<main><h1>Useful content before enhancements</h1></main>',
      ],
      [
        "Hints spend real resources",
        'preload fetches a needed current-page resource early and needs a correct as/type and matching credentials mode. modulepreload prepares module resources. prefetch is a lower-priority possible-future-navigation hint, not a current critical fetch. preconnect may establish a connection to a likely origin; dns-prefetch requests name resolution. Font preloads normally need as="font", an appropriate type and crossorigin matching the eventual fetch. Unused or mismatched preloads compete for bandwidth. fetchpriority suggests relative priority; lazy images defer eligible offscreen work.',
        '<link rel="preload" href="headline.woff2" as="font" type="font/woff2" crossorigin>\n<!-- Add this only if this font really is immediately needed. -->',
      ],
    ],
    example: doc(
      '<main><h1>Progressive document</h1><p>Useful content and links remain available without enhancements.</p><a href="help.html">Read help</a></main>',
      '<script src="enhancement.js" defer></script>',
    ),
    broken: doc(
      "<main><h1>Research</h1><p>Useful content.</p></main>",
      '<script async src="first.js"></script><script async src="depends-on-first.js"></script><link rel="preload" href="unused.png" as="image">',
    ),
    task: "For two order-dependent external classic scripts, use defer and keep their source order. Remove the unused preload. Explain which fallback works if scripts fail. This safe preview shows markup only and never executes learner scripts.",
    checks:
      'script[src="first.js"][defer]:not([async]); script[src="depends-on-first.js"][defer]:not([async])',
    predict:
      "Which async script executes first if both are discovered together?",
    prediction:
      "You cannot tell from source order alone. Fetch readiness and scheduling decide.",
    mistake:
      "Preload fetches a resource; it does not automatically apply CSS or execute a script.",
    recap: "Guarantees concern order; timings require measurement.",
    discussion:
      "When could an early font preload compete with the hero image and make the page feel slower?",
    references: [
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link",
      "https://html.spec.whatwg.org/multipage/semantics.html#the-link-element",
    ],
    quiz: [
      q(
        "Two classic external scripts depend on their order. Choose:",
        [
          "defer on both, in dependency order",
          "async on both guarantees source order",
          "preload executes them sequentially",
        ],
        "Deferred classic scripts execute in document order after parsing; async scripts execute when ready.",
      ),
      q(
        "Match the hint to its purpose:",
        [
          "preconnect prepares an origin connection",
          "prefetch guarantees immediate execution",
          "dns-prefetch downloads a font",
        ],
        "Resource hints target different stages. They are not interchangeable and can spend unnecessary resources.",
      ),
      q(
        "A module script without async is normally:",
        [
          "Deferred by default",
          "A parser-blocking classic script",
          "An HTML element definition",
        ],
        "Module scripts have deferred default scheduling and a dependency graph. Their JavaScript behavior belongs in JS LAB.",
      ),
    ],
  },
  {
    id: "components",
    title: "Templates, slots & shadow trees",
    existing: ["dom", "modern"],
    intro:
      "A template stores reusable markup without rendering it. Shadow DOM creates a separate DOM tree with slot-based composition.",
    why: "These platform primitives explain reusable components without requiring a framework course.",
    context:
      "template and core Shadow DOM are established; declarative shadowrootmode is available in modern engines. Newer extensions still require checking support.",
    use: "Use templates for repeated authored structures, and shadow trees where encapsulated composition is justified.",
    avoid:
      "Do not treat Shadow DOM as a security boundary or assume template automatically repeats itself.",
    sections: [
      [
        "Inert content and cloning",
        "An ordinary template stores nodes in a DocumentFragment at template.content. Its contents are not ordinary rendered children. Limited trusted JavaScript can clone the fragment, fill its text using textContent, and append it. A custom element name has a hyphen; defining behavior with customElements.define requires JavaScript. HTML alone does not register a component class.",
        '<template id="card-template"><article><h2 class="name"></h2><p>Reusable profile</p></article></template>\n<!-- JS concept: template.content.cloneNode(true), then populate textContent. -->',
      ],
      [
        "Host, shadow tree and slots",
        "A host is an element that owns a shadow root. Light DOM remains in the ordinary tree. A slot is a distribution point in the shadow tree; named slots match light children’s slot attributes. A default slot receives unmatched slottable children; fallback content is used when a slot has no assigned nodes. Distribution changes presentation/composition, not the child’s actual light-DOM parent. Shadow styles are scoped but inheritance and explicit APIs can cross boundaries.",
        '<profile-card><span slot="name">Asha</span><p>Field researcher</p></profile-card>',
      ],
      [
        "Declarative shadow DOM and safety",
        'During appropriate initial HTML document parsing, template shadowrootmode="open" can become a shadow root on its parent; the template is replaced by the root. DOMParser and ordinary innerHTML do not instantiate declarative shadow roots by default. Our trusted example creates a fixed shadow root and clones a fixed template. It never inserts learner markup into the application. Unsupported browsers need useful light-DOM fallback. Even a closed root is not a protection for secrets.',
        '<div><template shadowrootmode="open"><article><h2><slot name="name">Profile</slot></h2><slot></slot></article></template><span slot="name">Asha</span><p>Field researcher</p></div>',
      ],
    ],
    example: doc(
      '<main><h1>Profile-card source</h1><template id="profile-template"><article><h2>Profile name</h2><p>A reusable structure, inert until cloned.</p></article></template><p>The ordinary template is not displayed. Use the trusted anatomy demo to clone it.</p><div><template shadowrootmode="open"><article><h2><slot name="name">Profile</slot></h2><slot></slot></article></template><span slot="name">Asha</span><p>Research volunteer</p></div></main>',
    ),
    broken: doc(
      '<main><h1>Profile source</h1><template id="profile"><article><h2>Profile</h2></article></template><p>Why is the template not visible?</p></main>',
    ),
    task: "Keep the inert template. Add a declarative host with a named slot and matching light-DOM child, plus useful default light content. Explain where JavaScript is required for ordinary cloning or custom-element registration.",
    checks: 'template#profile; template[shadowrootmode="open"]; [slot="name"]',
    predict: "Does adding an ordinary template render its content?",
    prediction:
      "No. It is inert stored markup. It needs to be used, for example by trusted cloning, or a supported declarative shadow-root mechanism.",
    mistake:
      "A custom tag without registration is not an automatically functioning component.",
    recap: "Template stores; clone repeats; host owns; slot distributes.",
    discussion:
      "How can a useful light-DOM fallback preserve content if shadow-root enhancement is unsupported?",
    references: [
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template",
      "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM",
      "https://webkit.org/blog/13851/declarative-shadow-dom/",
    ],
    quiz: [
      q(
        "Named slot assignment changes:",
        [
          "Where light-DOM content is presented, not its original parent",
          "The content into an external iframe",
          "The page origin",
        ],
        "Slot distribution composes trees without reparenting the assigned light-DOM nodes.",
      ),
      q(
        "Which is a secure assumption?",
        [
          "Shadow DOM is encapsulation, not a security boundary",
          "Closed roots can securely hide API keys",
          "Learner HTML may safely execute in an open shadow root",
        ],
        "Application code and delivered source cannot securely hide client-side secrets. Isolation requires actual security boundaries.",
      ),
    ],
  },
  {
    id: "security",
    title: "Safe documents & embedding",
    existing: ["links", "responsive", "audit"],
    intro:
      "HTML connects documents and imports resources. Every connection has an origin, capability and trust decision.",
    why: "Untrusted markup can navigate, submit data, load resources or execute code when inserted into an active document.",
    context:
      "Browsers enforce origins, CSP and iframe permissions. Headers and meta policies have different capabilities.",
    use: "Use restricted embeds and clear trust boundaries when integrating authored content and third parties.",
    avoid:
      "Do not run untrusted learner HTML in the application origin or place passwords/API secrets in shipped source.",
    sections: [
      [
        "Links, origins and URLs",
        'An origin is the scheme/host/port tuple. A same-origin relationship grants powerful script access; URL paths alone do not create isolation. Use needed schemes such as https; do not accept arbitrary javascript URLs from untrusted text. Modern target="_blank" links generally imply noopener; explicit rel="noopener" documents intent. noreferrer suppresses referrer information. download suggests downloading in supported cases, often limited for cross-origin URLs; inspect files and source before opening.',
        '<a href="https://example.org/reference" target="_blank" rel="noopener noreferrer">Read the reference (new tab)</a>',
      ],
      [
        "Embedding grants capabilities",
        "Start iframe sandbox with no tokens and add only what the use case needs. allow is a Permissions Policy allowlist for features such as camera; it does not bypass permission prompts or other restrictions. referrerpolicy controls referrer information. A title identifies the frame. Combining scripts and same-origin for same-origin untrusted content can defeat the intended boundary; keep learner frames opaque and never expose app storage. Third-party embeds can track or change independently.",
        '<iframe title="Read-only lesson" src="https://example.org/lesson" sandbox referrerpolicy="no-referrer" loading="lazy"></iframe>',
      ],
      [
        "Injection and policy defense",
        "Use textContent for untrusted text instead of concatenating it into innerHTML. Escaping depends on context: HTML text, attributes, URLs and scripts need different handling. A sanitizer must understand HTML and be maintained. CSP limits resource/execution capabilities as defense in depth. Header CSP can express frame-ancestors, sandbox and report-only policies; meta CSP cannot supply those, and applies only after it is encountered. frame-src controls what this page embeds; frame-ancestors controls who may embed it.",
        "<!-- Server header concept: Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self' -->",
      ],
      [
        "Resource integrity and boundaries",
        "integrity supplies an expected cryptographic digest for a fetched script/stylesheet; cross-origin SRI requires suitable CORS response permission and crossorigin settings. Compute the real digest for the exact resource; do not invent hashes. crossorigin controls credential/CORS mode, not general trust. A CSP or SRI declaration is not a substitute for reviewing code. Everything delivered to a browser can be read by its user; backend-only secrets belong on a server.",
        '<!-- Example shape only: add integrity="sha384-REAL_DIGEST" crossorigin="anonymous" to a reviewed, versioned external resource. -->',
      ],
    ],
    example: doc(
      '<main><h1>Embedding review</h1><a href="https://example.org/guide" target="_blank" rel="noopener noreferrer">External guide (new tab)</a><p>Inspect the following source; nested frames remain blocked by this lab.</p><iframe title="Read-only reference" src="https://example.org/reference" sandbox referrerpolicy="no-referrer" loading="lazy"></iframe></main>',
    ),
    broken: doc(
      '<main><h1>External content</h1><a href="https://example.org" target="_blank">Click here</a><iframe src="https://example.org" sandbox="allow-scripts allow-same-origin" allow="camera; microphone"></iframe></main>',
    ),
    task: "Make the link’s purpose clear, state its new-tab behavior, restrict the iframe to the minimum capabilities with a title and referrer policy, and explain how you would insert untrusted text safely. No external resource is fetched by the inspector.",
    checks:
      'a[rel~="noopener"]; iframe[title][sandbox=""][referrerpolicy="no-referrer"]',
    predict:
      "Does a different URL path isolate two pages from same-origin script access?",
    prediction:
      "No. Origin normally depends on scheme, host and port, not path.",
    mistake:
      "A security example’s code must remain data during inspection. Our inspector never inserts it into the app DOM.",
    recap: "Source → trust → origin → least capability → verify.",
    discussion:
      "Why can a meta CSP not replace a frame-ancestors response header?",
    references: [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe",
      "https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity",
    ],
    quiz: [
      q(
        "Which distinguishes frame-src from frame-ancestors?",
        [
          "What I embed versus who may embed me",
          "Two spellings of the same rule",
          "Both are supported identically in meta CSP",
        ],
        "frame-ancestors controls embedding of this document and must be delivered through a suitable response header.",
      ),
      q(
        "Display an untrusted comment safely as text:",
        [
          "Assign textContent",
          "Concatenate it into innerHTML",
          "Put it in a closed shadow root",
        ],
        "Text insertion avoids treating markup as active elements. Other contexts require appropriate validation/escaping.",
      ),
      q(
        "Why cannot a static HTML file securely hide an API secret?",
        [
          "Delivered source and browser requests can be inspected",
          "Comments are always encrypted",
          "A hidden input provides server-only storage",
        ],
        "Secrets required by privileged services must not be shipped to the client.",
      ),
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility, conformance & evidence",
    existing: ["accessible", "audit", "tables", "spans", "outline"],
    intro:
      "A conforming document can still be hard to use. Combine source checks, native behavior, keyboard tests and human judgment.",
    why: "Names, relationships and focus behavior determine whether people can understand and complete the page’s task.",
    context:
      "The accessibility tree is derived from rendered semantics and platform mappings; a DOM tree is not an accessibility tree. Automated tools cover only a subset.",
    use: "Use native elements, meaningful names, logical reading order, and explicit manual testing evidence.",
    avoid:
      "Do not declare WCAG conformance or full HTML validity from the educational checker alone.",
    sections: [
      [
        "Names, descriptions and structure",
        'A visible label is a strong source of a control’s accessible name; aria-labelledby references name text and aria-describedby adds description. A placeholder is not a durable label. Preserve visible name wording in the accessible name. Use purposeful links, heading hierarchy and distinguishable landmarks when there are multiple regions of the same type. Alt text depends on purpose; alt="" suits decoration, not an informative image. ARIA adds semantics; it does not add native keyboard behavior.',
        '<label for="email">Email</label><input id="email" name="email" type="email" aria-describedby="email-help"><p id="email-help">Use an address you check.</p>',
      ],
      [
        "Focus, errors and interaction",
        'DOM order normally drives reading and tab order. tabindex="0" adds a sequential stop; -1 allows programmatic focus; positive values usually damage predictable order. Never remove visible focus. A visually hidden text technique can remain available to assistive technology; hidden/inert remove content from accessibility exposure in different ways. For errors, provide text near the field and an actionable summary; focus it appropriately after a failed workflow. Test dialog initial/return focus, Escape, popover behavior and keyboard dismissal. Use native controls before custom ARIA widgets.',
        '<a href="#content">Skip to content</a><main id="content" tabindex="-1"><h1>Application</h1></main>',
      ],
      [
        "Tables and complex associations",
        "Use tables for data, not layout. caption identifies the table; th and scope describe ordinary row/column headers. For truly complex relationships, give headers unique IDs and reference those IDs with headers on data cells. Group headers with colgroup/rowgroup scope only when the grid supports those groups. Simplifying the table often helps more than adding attributes. Fieldsets/legends express form groups; textual units and explanations remain necessary.",
        '<table><caption>Observations</caption><tr><th id="place" scope="col">Place</th><th id="rain" scope="col">Rain (mm)</th></tr><tr><th id="north" scope="row">North</th><td headers="north rain">12</td></tr></table>',
      ],
      [
        "Validation and manual workflow",
        "Download your source, then explicitly choose File Upload or Text Input in the Nu HTML Checker. Review source line messages, fix causes and rerun. Files/code are sent to that external service only when you choose to submit them there. Local checks are educational, not a complete standards validator. Use browser accessibility inspection and tools such as axe/WAVE as additional evidence; manual keyboard, zoom/reflow, screen-reader and task tests remain necessary. WPT tests browser-platform behavior, not your entire page’s usability.",
        "<!-- Review: source conformance + keyboard + accessible names + reading order + narrow screens + actual tasks. -->",
      ],
    ],
    example: doc(
      '<a href="#content">Skip to content</a><main id="content" tabindex="-1"><h1>Course observations</h1><form><fieldset><legend>Receive the report</legend><label for="email">Email</label><input id="email" name="email" type="email" required aria-describedby="email-help"><p id="email-help">Example form; no data is sent.</p><button>Review request</button></fieldset></form><table><caption>Rain observations</caption><tr><th id="site" scope="col">Site</th><th id="rain" scope="col">Rain (mm)</th></tr><tr><th id="north" scope="row">North</th><td headers="north rain">12</td></tr></table></main>',
    ),
    broken: doc(
      '<div><h1>Course</h1><h3>Apply</h3><input placeholder="Email"><a href="#">Click here</a><table><tr><td>Site</td><td>Rain</td></tr><tr><td>North</td><td>12</td></tr></table><button tabindex="5">Continue</button></div>',
    ),
    task: "Repair the planted page: add main, correct the heading level, associate a label, explain link purpose, add caption and table headers, remove positive tabindex. Then document a manual keyboard test and submit your exported source to Nu yourself if appropriate.",
    checks:
      "main; h2; label[for]; input[id]; table caption; th[scope]; button:not([tabindex])",
    predict:
      'If an element has role="button", will the browser automatically add Space activation?',
    prediction:
      "No. ARIA does not supply event handling or native keyboard behavior. A real button is usually the better starting point.",
    mistake:
      "A screen-reader simulation or DOM list is not a real assistive-technology test.",
    recap: "Check structure; test the task; record evidence; validate source.",
    discussion:
      "How can a document pass a conformance checker yet still have an unhelpful accessible name?",
    references: [
      "https://validator.w3.org/nu/",
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
      "https://www.w3.org/WAI/tutorials/tables/",
      "https://web-platform-tests.org/",
    ],
    quiz: [
      q(
        "Which is a complete accessibility claim?",
        [
          "No single automated check proves complete accessibility",
          "A missing-alt scan proves WCAG conformance",
          "A DOM tree is exactly the accessibility tree",
        ],
        "Automated checks find a subset. Manual interaction, content judgment and assistive-technology testing remain necessary.",
      ),
      q(
        'A complex cell references headers="north rain". What must exist?',
        [
          "Unique header cells with those exact IDs and correct relationships",
          "Two CSS classes named north and rain",
          "A hidden password field",
        ],
        "headers connects the cell to actual header IDs. Correct associations still require a sensible table structure.",
      ),
      q(
        "Use the Nu checker by:",
        [
          "Explicitly uploading or pasting exported source and reviewing messages",
          "Assuming a rendered page has no errors",
          "Silently sending every saved draft",
        ],
        "Validation should be intentional. The educational app does not upload learner source automatically.",
      ),
    ],
  },
];
export const advancedFor = (id) =>
  advancedLessons.filter((l) => l.existing.includes(id));
export function advancedReference(lesson) {
  if (lesson.id === "accessibility")
    return lesson.example.replace(
      "<form>",
      "<h2>Receive the report</h2><form>",
    );
  if (lesson.id === "forms")
    return lesson.example.replace(
      "</form>",
      '<label for="reference">Course reference</label><input id="reference" name="reference" readonly value="COURSE-42"></form>',
    );
  if (lesson.id === "media")
    return lesson.example.replace(
      'decoding="async"',
      'decoding="async" loading="eager"',
    );
  if (lesson.id === "language")
    return lesson.example.replace('lang="hi"', 'lang="hi" dir="ltr"');
  if (lesson.id === "loading")
    return doc(
      "<main><h1>Progressive content</h1><p>This text remains if enhancements fail.</p></main>",
      '<script src="first.js" defer></script><script src="depends-on-first.js" defer></script>',
    );
  if (lesson.id === "components")
    return lesson.example.replace('id="profile-template"', 'id="profile"');
  return lesson.example;
}
export const advancedQuestions = advancedLessons.flatMap((l) =>
  l.quiz.map((q) => ({ ...q, type: `${l.title.toUpperCase()} · ${q.type}` })),
);
