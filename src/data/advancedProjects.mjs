import { documentHTML } from "./curriculum.mjs";
import { projectImage } from "./projectImage.mjs";
import { advancedImages } from "./advancedImages.mjs";
import { starterCSS } from "./v2Projects.mjs";
const text = (data) => ({ type: "text", data });
const page = (title, body, head = "") =>
  documentHTML(
    `<a href="#content">Skip to content</a><header><nav aria-label="Main"><a href="index.html">Home</a><a href="guide.html">Guide</a><a href="review.html">Review</a></nav></header><main id="content" tabindex="-1"><h1>${title}</h1>${body}</main><footer><p>Fictional HTML learning project. No service collects data.</p></footer>`,
    title,
  ).replace(
    "</head>",
    `<meta name="description" content="Fictional HTML standards learning project."><link rel="stylesheet" href="css/style.css">${head}</head>`,
  );
export const registrationBody =
  '<form method="get" action="review.html"><fieldset><legend>Applicant</legend><label for="name">Full name</label><input id="name" name="name" autocomplete="name" minlength="2" required><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-help"><p id="email-help">Use fictional data; this static demonstration puts fields in a URL to review.html. It does not create an account.</p><label for="phone">Phone (optional)</label><input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" enterkeyhint="next"></fieldset><fieldset><legend>Learning plan</legend><label for="course">Course</label><select id="course" name="course"><option value="html">HTML standards</option><option value="media">Accessible media</option></select><label for="hours">Weekly hours (2–10, step 2)</label><input id="hours" name="hours" type="number" min="2" max="10" step="2" required><label><input name="updates" type="checkbox" value="yes">Optional updates</label></fieldset><button>Review example application</button></form>';
const news =
  '<article><header><h2>Rain observations at North station</h2><p>Learning Desk · <time datetime="2026-10-31">31 October 2026</time></p></header><section><h3>Method</h3><p>Read the instrument at the same time each day.</p><p>Enter <kbd>12</kbd>; the instrument displays <samp>12 mm</samp>.</p></section><section><h3>Results</h3><table><caption>Two fictional daily observations</caption><thead><tr><th scope="col">Day</th><th scope="col">Rain (mm)</th></tr></thead><tbody><tr><th scope="row">Friday</th><td>12</td></tr><tr><th scope="row">Saturday</th><td>8</td></tr></tbody></table></section><figure><img src="images/diagram.png" width="240" height="140" alt="Three colored columns representing example observations"><figcaption>A schematic illustration, not measured weather data.</figcaption></figure><blockquote><p>Record the method as well as the result.</p></blockquote><p>Fictional quotation from <cite>Field Notes Handbook</cite>.</p><footer><address>Contact the <a href="mailto:desk@example.org">Learning Desk</a>.</address></footer></article>';
const faq =
  '<section><h2>Frequently asked questions</h2><details><summary>Is this a real account service?</summary><p>No. This is a static HTML demonstration.</p></details><details><summary>How do I keep the source?</summary><p>Export the project ZIP and keep a backup.</p></details></section><button popovertarget="backup-tip">Backup information</button><aside id="backup-tip" popover="auto"><h2>Keep a source copy</h2><p>Browser storage can be cleared.</p><button popovertarget="backup-tip" popovertargetaction="hide">Close backup tip</button></aside><button commandfor="review-dialog" command="show-modal">Open review dialog</button><dialog id="review-dialog" aria-labelledby="dialog-title"><h2 id="dialog-title">Review your work</h2><p>Test Tab, Shift+Tab, Escape and focus return.</p><form method="dialog"><button value="done" autofocus>Done</button></form></dialog><p>Invoker Commands need supporting browsers. If unavailable, read the <a href="review.html">ordinary review page</a>. Compare real modal behavior in HTML LAB’s trusted Native UI Lab.</p>';
const multilingual =
  '<section lang="en"><h2>Welcome</h2><p>Choose a language version by its real link.</p></section><section lang="hi" dir="ltr"><h2>नमस्ते</h2><p>यह एक सीखने का उदाहरण है।</p></section><section lang="kn" dir="ltr"><h2>ನಮಸ್ಕಾರ</h2><p>ಕಲಿಕೆಯ ಉದಾಹರಣೆ.</p></section><section lang="ar" dir="rtl"><h2>مرحبًا</h2><p>هذا مثال تعليمي.</p></section><section lang="ja"><h2>Reading practice</h2><p><ruby>漢<rp>(</rp><rt>かん</rt><rp>)</rp>字<rp>(</rp><rt>じ</rt><rp>)</rp></ruby></p></section><p>Contributor <bdi dir="auto">ليلى</bdi>: 12 notes.</p>';
const product =
  '<article><h2>Field notebook</h2><figure class="product-figure"><picture><source media="(min-width: 600px)" srcset="images/product-640.png 640w, images/product-1280.png 1280w" sizes="(min-width: 848px) 800px, calc(100vw - 48px)"><img src="images/product-320.png" srcset="images/product-320.png 320w, images/product-640.png 640w, images/product-1280.png 1280w" sizes="(min-width: 848px) 800px, calc(100vw - 48px)" width="1280" height="720" loading="eager" decoding="async" alt="Three schematic observation bars, shown as a sample notebook diagram"></picture><figcaption>Original schematic diagrams at 320, 640 and 1280 pixels wide. Actual candidate choice depends on viewport, layout, density and browser conditions. This is resolution switching, not a change of composition.</figcaption></figure><p>A fictional educational product; no purchase is available. The diagram illustrates recorded observations and is not a product photograph.</p><details><summary>Materials and care</summary><p>Keep paper dry. Recycle appropriately.</p></details><p>Inspect the working captioned media example below after exporting. The safe workspace blocks remote media. Its video is a CC0 visual study rather than a demonstration of a real commercial product.</p><p>WebVTT structure: a header, blank line, timestamp interval and cue text.</p><pre>WEBVTT\n\n00:00.000 --> 00:02.000\n[Flowers move gently in the breeze]</pre></article>';
const review =
  "<section><h2>Manual evidence</h2><ol><li>Navigate every page by keyboard; check visible focus and logical order.</li><li>Test native validation with empty, malformed and valid fictional values.</li><li>Test modal opening, Tab/Escape, closing and focus return in a supporting browser.</li><li>Check every language/direction change and the purpose of each text alternative.</li><li>Inspect source and validate exported HTML at the Nu HTML Checker.</li><li>Check narrow/wide viewports, zoom, resource paths and loading assumptions.</li></ol><p>Record the browser, date, issue, fix and remaining limits in your project rubric. Automated checks do not establish complete accessibility.</p></section>";
const workingMedia =
  '<section><h2>Working media example after export</h2><video controls preload="metadata" crossorigin="anonymous" width="320"><source src="https://shadabur-rahaman.github.io/html-lab/flower.mp4" type="video/mp4"><track kind="captions" src="https://shadabur-rahaman.github.io/html-lab/captions.vtt" srclang="en" label="English" default><p><a href="https://shadabur-rahaman.github.io/html-lab/flower.mp4">Download the flower video</a></p></video><p>Text description: silent pink and white flowers move gently outdoors. No speech or music. CC0 flower sample from MDN, hosted with HTML LAB. This remote media requires a connection after export; the safe multi-file preview deliberately blocks it.</p></section>';
const configs = [
  {
    id: "registration",
    title: "Accessible registration form",
    body: registrationBody,
    focus:
      "Native constraints, label/description associations, autofill, mobile hints and successful-control data.",
    requirements: [
      "Group related controls with fieldset/legend; provide visible labels and descriptions.",
      "Use email, required, autocomplete and numeric min/max/step appropriately.",
      "Explain disabled versus readonly, validation bypasses and the server boundary.",
      "Build three alternate briefs: a job application, student admission and a product order. For a file upload use a real POST multipart endpoint only outside this static exercise.",
    ],
    checks: [
      "form fieldset legend",
      'input[type="email"][required][autocomplete]',
      'input[type="number"][min][max][step]',
      "input[aria-describedby]",
    ],
  },
  {
    id: "news",
    title: "Accessible news & documentation",
    body: news,
    focus:
      "Article architecture, dates/citations, documentation input/output, structured data and tables.",
    requirements: [
      "Use article, section and explicit heading levels.",
      "Include time, cite, a captioned table and documentation with kbd/samp.",
      "Add accurate metadata and explain optional canonical/social relationships.",
      "Keep headings, navigation and text meaningful without CSS.",
    ],
    checks: [
      "article time[datetime]",
      "section h3",
      "table caption",
      "th[scope]",
      "kbd",
      "samp",
    ],
  },
  {
    id: "product",
    title: "Responsive multimedia product page",
    body: product,
    focus:
      "Responsive image markup, loading decisions, truthful Product data and accessible media.",
    requirements: [
      "Use picture/source/img with meaningful alt, width and height.",
      "Explain slot/DPR choices, art direction and eager versus lazy loading.",
      "Create WebVTT cues and a transcript; use the original media lab for actual playback.",
      "After export, add your own real licensed media files and distinct image candidates; measure transfers in browser tools.",
    ],
    checks: [
      "picture source[srcset]",
      "picture img[alt][width][height]",
      "details > summary",
      'script[type="application/ld+json"]',
    ],
  },
  {
    id: "help",
    title: "Native FAQ & help center",
    body: faq,
    focus:
      "Native disclosure, popover, modal interaction and a usable ordinary-page fallback.",
    requirements: [
      "Build two details/summary FAQs and a nonmodal information popover.",
      'Name a dialog, provide a method="dialog" close button and a supported invocation.',
      "Verify actual browser focus/keyboard behavior in the trusted Native UI Lab.",
      "Provide a review-page fallback when a browser lacks declarative invocation; explain the general preview limits.",
    ],
    checks: [
      "details > summary",
      '[popover="auto"]',
      "button[popovertarget]",
      'dialog[aria-labelledby] form[method="dialog"]',
      "button[commandfor]",
    ],
  },
  {
    id: "multilingual",
    title: "Multilingual education page",
    body: multilingual,
    focus:
      "Encoding, language boundaries, independent text direction, bidi isolation and ruby.",
    requirements: [
      "Use actual authored English, Hindi, Kannada and Arabic content with accurate lang/dir.",
      "Isolate an unknown-direction contributor name with bdi.",
      "Include Japanese ruby with rt/rp.",
      "Explain that Unicode and lang do not translate content; peer-review language quality before real publication.",
    ],
    checks: [
      '[lang="hi"][dir="ltr"]',
      '[lang="kn"]',
      '[lang="ar"][dir="rtl"]',
      "bdi",
      "ruby rt",
    ],
  },
  {
    id: "capstone",
    title: "Professional HTML standards showcase",
    body: news + registrationBody + faq + multilingual,
    focus:
      "A complete multi-page demonstration backed by source-validation and manual-review evidence.",
    requirements: [
      "Home: article/documentation, appropriate metadata and a real captioned image.",
      "Guide: responsive product/media plan, multilingual explanations and native help.",
      "Review: accessible advanced form, security/validation checklist and recorded evidence.",
      "Explain every external resource/origin/capability decision; no secrets or real user information.",
      "Add a reusable template/profile-card source and explain trusted cloning versus inert markup.",
      "Validate all exported pages; test keyboard, mobile, loading and fallbacks in a real browser.",
    ],
    checks: [
      "article",
      "form fieldset legend",
      'input[type="email"][required]',
      "[popover]",
      "dialog[aria-labelledby]",
      "picture img[alt]",
      '[lang="ar"][dir="rtl"]',
      "template",
    ],
  },
];
export const advancedProjects = configs.map((c) => {
  const metadata =
    c.id === "product"
      ? '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Field notebook","description":"A fictional learning product"}</script>'
      : c.id === "news"
        ? '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Rain observations at North station","author":{"@type":"Organization","name":"Learning Desk"}}</script>'
        : "";
  const solution = {
    "index.html": text(
      page(
        c.title,
        c.body +
          (c.id === "product" ? workingMedia : "") +
          (c.id === "capstone"
            ? product +
              workingMedia +
              '<template id="profile"><article><h2>Reusable profile</h2><p>Inert source; trusted JavaScript cloning is a separate enhancement.</p></article></template>'
            : ""),
        metadata,
      ),
    ),
    "guide.html": text(
      page(
        "Implementation guide",
        c.id === "capstone"
          ? product + multilingual + faq
          : `<section><h2>Why these decisions?</h2><p>${c.focus}</p><ol>${c.requirements.map((r) => `<li>${r}</li>`).join("")}</ol></section>`,
      ),
    ),
    "review.html": text(
      page(
        "Review and validation",
        review + (c.id === "capstone" ? registrationBody : ""),
      ),
    ),
    "css/style.css": text(
      starterCSS +
        "\ndialog { max-width: min(90vw, 35rem); } .product-figure { max-width: 800px; margin: 1rem 0; }\n",
    ),
    "images/diagram.png": { ...projectImage },
    ...structuredClone(advancedImages),
    "README.md": text(
      `# ${c.title}\n\nFictional educational reference. No backend and no real purchases/accounts. Native dialogs/popovers require supporting browsers and are restricted in the safe workspace preview. Export to test real behavior, or use the trusted Native UI Lab.\n\n${c.requirements.join("\n")}\n\nValidate exported HTML at https://validator.w3.org/nu/ by your explicit choice. Document browser/date, keyboard, screen-reader, mobile, media and fallback evidence. Project rubrics are stored separately from website ZIPs.\n`,
    ),
  };
  const starter = {
    ...solution,
    "index.html": text(
      page(
        c.title,
        "<section><h2>Your implementation</h2><p>Start with the brief, then build and justify your choices.</p></section>",
      ),
    ),
  };
  return {
    ...c,
    starter,
    solution,
    walkthrough: [
      "Write the audience, task and document outline before adding controls.",
      "Build one requirement at a time; inspect the parsed DOM and resource paths.",
      "Use the relevant advanced native/inspector lab to predict and test behavior.",
      "Compare the reference’s choices, then implement a different subject independently.",
      "Export, validate source, manually test and fill the project review rubric.",
    ],
  };
});
