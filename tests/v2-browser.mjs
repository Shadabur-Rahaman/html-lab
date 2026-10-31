import { projectPreview } from "../src/projectPreview.mjs";
import {
  projectStore,
  exportProject,
  importProject,
} from "../src/projectModel.mjs";
import { starterFiles, industryProjects } from "../src/data/v2Projects.mjs";
import { parseProgress, STORAGE_KEY, audit } from "../src/lib.mjs";
import { cssDiagnostics } from "../src/projectDiagnostics.mjs";
const originalProgress = localStorage.getItem(STORAGE_KEY);
let passed = 0,
  failed = 0;
function check(name, fn) {
  const li = document.createElement("li");
  try {
    if (!fn()) throw Error("Check returned false");
    li.textContent = "PASS · " + name;
    passed++;
  } catch (e) {
    li.className = "fail";
    li.textContent = "FAIL · " + name + " · " + e.message;
    failed++;
  }
  document.querySelector("#results").append(li);
}
const files = starterFiles("A safe project", true);
files["index.html"].data = files["index.html"].data.replace(
  "</main>",
  '<img src="images/pixel.png" alt="A small diagram"></main>',
);
files["images/pixel.png"] = {
  type: "image",
  mime: "image/png",
  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+yCLsAAAAASUVORK5CYII=",
};
const token = "v2-test-nonce-123456789";
let source = projectPreview(files, "index.html", token);
const doc = new DOMParser().parseFromString(source.html, "text/html");
check(
  "local external CSS is inlined from its virtual path",
  () =>
    !doc.querySelector("link") &&
    [...doc.querySelectorAll("style")].some((s) =>
      s.textContent.includes("box-sizing: border-box"),
    ),
);
check("local image is resolved to its raster data", () =>
  doc.querySelector("img").src.startsWith("data:image/png"),
);
check(
  "local links are mapped to the controlled bridge",
  () =>
    doc.querySelector('a[data-project-page="about.html"]') &&
    source.links.length === 3,
);
check(
  "preview has no origin, submission, external resource, or learner-script permission",
  () =>
    doc
      .querySelector("meta[http-equiv]")
      .content.includes("default-src 'none'") &&
    doc.querySelector("meta").content.includes("form-action 'none'") &&
    doc.querySelectorAll("script").length === 1,
);
const hostile = structuredClone(files);
hostile["index.html"].data +=
  `<script nonce="${token}">parent.postMessage('V2-LEARNER-RAN','*')</script><img src="https://example.com/track" onerror="parent.postMessage('V2-LEARNER-RAN','*')"><iframe src="https://example.com"></iframe><meta http-equiv="refresh" content="0;url=https://example.com"><a href="javascript:alert(1)" target="_top">Bad</a><style>@import 'https://example.com/evil.css';p{background:url(https://example.com/a)}</style>`;
source = projectPreview(hostile, "index.html", token);
const cleaned = new DOMParser().parseFromString(source.html, "text/html");
check(
  "learner scripts, event handlers, nested frames, and refresh are removed",
  () =>
    cleaned.querySelectorAll("script").length === 1 &&
    !cleaned.querySelector('[onerror],iframe,meta[http-equiv="refresh"]'),
);
check(
  "external CSS and links cannot navigate or make requests",
  () =>
    !cleaned.querySelector(
      'a[href^="javascript:"],a[target],img[src^="https:"]',
    ) &&
    [...cleaned.querySelectorAll("style")].every(
      (s) => !s.textContent.includes("https://"),
    ),
);
for (const p of industryProjects)
  check(`reference project has no automated HTML audit issues: ${p.id}`, () =>
    Object.entries(p.solution)
      .filter(([n]) => n.endsWith(".html"))
      .every(([, f]) => audit(f.data).length === 0),
  );
const testId = "v2-browser-test-" + crypto.randomUUID();
try {
  await projectStore("save", {
    id: testId,
    name: "Test-only record",
    files,
    updated: Date.now(),
  });
  const loaded = (await projectStore("list")).find((p) => p.id === testId);
  check(
    "IndexedDB preserves a saved project and binary asset",
    () =>
      loaded.files["images/pixel.png"].data === files["images/pixel.png"].data,
  );
  check(
    "ZIP round trip preserves project pages and CSS",
    () =>
      JSON.stringify(
        Object.keys(importProject(exportProject(loaded.files))).sort(),
      ) === JSON.stringify(Object.keys(files).sort()),
  );
  await projectStore("delete", testId);
  check(
    "deleting a test project leaves original lesson progress unchanged",
    () => localStorage.getItem(STORAGE_KEY) === originalProgress,
  );
} catch (e) {
  check("IndexedDB save/resume round trip", () => {
    throw e;
  });
}
const frame = document.createElement("iframe");
check(
  "template, noscript, and image-map navigation cannot smuggle active content",
  () => {
    const attack = structuredClone(files);
    attack["index.html"].data +=
      '<template shadowrootmode="open"><script>alert(1)</script></template><noscript><a href="https://example.com">Escape</a></noscript><map><area href="https://example.com" target="_top"></map>';
    const out = new DOMParser().parseFromString(
      projectPreview(attack, "index.html", token).html,
      "text/html",
    );
    return (
      !out.querySelector("template,noscript,area") &&
      out.querySelectorAll("script").length === 1
    );
  },
);
frame.setAttribute("sandbox", "allow-scripts");
frame.title = "Hostile isolated project fixture";
frame.srcdoc = source.html;
let learnerRan = false,
  navigation = false;
window.addEventListener("message", (e) => {
  if (e.source !== frame.contentWindow) return;
  if (e.data === "V2-LEARNER-RAN") learnerRan = true;
  if (e.data?.type === "html-lab-navigate" && e.data.token === token)
    navigation = e.data.path === "about.html";
});
document.body.append(frame);
await new Promise((r) => setTimeout(r, 600));
check(
  "hostile code does not execute and project origin is opaque",
  () => !learnerRan && frame.contentDocument === null,
);
check(
  "fixture ZIP and storage work without changing the old progress schema",
  () =>
    JSON.stringify(parseProgress(originalProgress)) ===
    JSON.stringify(parseProgress(localStorage.getItem(STORAGE_KEY))),
);
const cssFixture = {
  "index.html": {
    type: "text",
    data: '<link rel="stylesheet" href="css/STYLE.CSS"><main class="card">Hello</main>',
  },
  "css/STYLE.CSS": {
    type: "text",
    data: ".card {color:red} .typo {color:blue} @media(min-width:1px){.nested-typo{color:red}} .card:hover{color:green} .card{background:url(../images/missing.png)}",
  },
};
const cssReport = cssDiagnostics(cssFixture);
check(
  "CSS diagnostics resolve resources relative to stylesheet and inspect nested static selectors",
  () =>
    cssReport.some((s) =>
      s.includes("missing CSS resource ../images/missing.png"),
    ) &&
    cssReport.some((s) => s.includes("selector .typo")) &&
    cssReport.some((s) => s.includes("selector .nested-typo")) &&
    !cssReport.some((s) => s.includes("selector .card")),
);
check(
  "unused stylesheets do not produce misleading selector advice",
  () =>
    cssDiagnostics({
      "unused.css": { type: "text", data: ".unused{color:red}" },
    }).length === 0,
);
check("uppercase stylesheet extension renders in secure preview", () =>
  projectPreview(cssFixture, "index.html", token).html.includes(".typo"),
);
const reviewRecord = {
  id: "review-test-" + Date.now(),
  name: "Review test",
  files: starterFiles(),
  updated: Date.now(),
  review: {
    scores: { Structure: 3 },
    notes: "Tested with keyboard.",
    stale: true,
  },
};
await projectStore("save", reviewRecord);
const reviewSaved = (await projectStore("list")).find(
  (p) => p.id === reviewRecord.id,
);
check(
  "saved project rubric survives IndexedDB without a schema migration",
  () =>
    reviewSaved?.review?.scores.Structure === 3 &&
    reviewSaved.review.notes === "Tested with keyboard." &&
    reviewSaved.review.stale,
);
await projectStore("delete", reviewRecord.id);
document.querySelector("#status").textContent =
  `${passed} passed · ${failed} failed`;
document.documentElement.dataset.result = failed ? "failed" : "passed";
