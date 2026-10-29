import { lessons } from "../src/data/curriculum.mjs";
import {
  projects,
  catalogGroups,
  elementNotes,
} from "../src/data/resources.mjs";
import { elementExample, extraNotes } from "../src/data/elements.mjs";
import { solutionFor } from "../src/data/solutions.mjs";
import { parseHTML, previewHTML, checkStructure, audit } from "../src/lib.mjs";
let passed = 0,
  failed = 0;
function check(name, fn) {
  const li = document.createElement("li");
  try {
    if (fn() === false) throw Error("Check returned false");
    li.textContent = "PASS · " + name;
    passed++;
  } catch (e) {
    li.textContent = "FAIL · " + name + " · " + e.message;
    li.className = "fail";
    failed++;
  }
  document.querySelector("#results").append(li);
}
for (const l of lessons)
  check(`Reference solution satisfies ${l.number} ${l.title}`, () => {
    const results = checkStructure(solutionFor(l.id), l.selector);
    if (results.some((r) => !r.passed))
      throw Error(
        results
          .filter((r) => !r.passed)
          .map((r) => r.selector)
          .join(", "),
      );
    return true;
  });
for (const p of projects)
  check(`Project solution satisfies ${p.title}`, () =>
    checkStructure(p.solution, p.selectors.join(";")).every((r) => r.passed),
  );
check(
  "DOM parser closes a paragraph before a heading",
  () =>
    parseHTML("<p>Before<h2>Heading</h2>After</p>").querySelector("h2")
      .parentElement.tagName === "BODY",
);
check("Text nodes remain distinct from element children", () => {
  const p = parseHTML("<p>Hello <em>web</em></p>").querySelector("p");
  return p.childNodes.length === 2 && p.children.length === 1;
});
check("Different equivalent markup passes structure validation", () =>
  checkStructure(
    '<main id="x"><section class="custom"><h2>A different heading</h2></section></main>',
    "main section > h2",
  ).every((r) => r.passed),
);
const hostile =
  '<base href="https://example.com"><meta http-equiv="refresh" content="0;url=https://example.com"><script>parent.postMessage("bad","*")</script><img src="x" onerror="alert(1)"><iframe srcdoc="evil"></iframe><a target="_top" href="javascript:alert(1)">bad link</a>';
check("Preview strips active source, refresh, and base overrides", () => {
  const d = parseHTML(previewHTML(hostile));
  return (
    !d.querySelector("script,iframe,base,[onerror]") &&
    d.querySelectorAll("meta[http-equiv]").length === 1 &&
    d.querySelector("meta").content.includes("script-src 'none'")
  );
});
check("Preview strips external navigation and parent targets", () => {
  const a = parseHTML(previewHTML(hostile)).querySelector("a");
  return !a.hasAttribute("href") && !a.hasAttribute("target");
});
check("Accessibility learning checks detect missing labels and alt", () => {
  const issues = audit('<input><img src="x">');
  return (
    issues.some((i) => i.includes("label")) &&
    issues.some((i) => i.includes("alt")) &&
    issues.some((i) => i.includes("language"))
  );
});
check("Images use well-formed embedded SVG URLs", () => {
  const img = parseHTML(solutionFor("images")).querySelector("img");
  return (
    img.getAttribute("src").endsWith("%3C/svg%3E") &&
    img.getAttributeNames().length === 4
  );
});
const audioResponse = await fetch("/tone.wav");
check(
  "Bundled audio is served successfully",
  () =>
    audioResponse.ok &&
    audioResponse.headers.get("content-type").includes("audio"),
);
for (const path of [
  "/flower.mp4",
  "/small.svg",
  "/wide.svg",
  "/captions.vtt",
]) {
  const response = await fetch(path);
  check(`Bundled resource exists: ${path}`, () => response.ok);
}
for (const [category, tags] of Object.entries(catalogGroups))
  for (const tag of tags) {
    check(`Catalog example and guidance: ${tag}`, () => {
      if (!{ ...extraNotes, ...elementNotes }[tag]) return false;
      const d = parseHTML(elementExample(tag, category));
      return ["iframe", "frameset", "link"].includes(tag)
        ? !!d.querySelector("p,pre")
        : !!d.querySelector(tag);
    });
  }
const frame = document.createElement("iframe");
check(
  "Bundled captions are embedded without widening sandbox permissions",
  () =>
    parseHTML(
      previewHTML(
        '<video><track src="./captions.vtt" kind="captions"></video>',
      ),
    )
      .querySelector("track")
      .getAttribute("src")
      .startsWith("data:text/vtt;"),
);
check(
  "Checker identifies invalid list and interactive nesting that remains in the DOM",
  () => {
    const issues = audit(
      '<ul><p>Wrong direct child</p></ul><a href="#x"><button>Nested action</button></a>',
    );
    return (
      issues.some((i) => i.includes("list nesting")) &&
      issues.some((i) => i.includes("interactive nesting"))
    );
  },
);
frame.setAttribute("sandbox", "");
frame.title = "Isolation check";
frame.srcdoc = previewHTML(
  '<h1>Safe</h1><script>parent.postMessage("lab-script-ran","*")</script>',
);
document.body.append(frame);
let executed = false;
window.addEventListener("message", (e) => {
  if (e.data === "lab-script-ran") executed = true;
});
setTimeout(() => {
  check(
    "Preview has opaque origin and no script permissions",
    () =>
      frame.contentDocument === null &&
      frame.getAttribute("sandbox") === "" &&
      !executed,
  );
  frame.remove();
  document.querySelector("#status").textContent =
    `${passed} passed · ${failed} failed`;
  document.documentElement.dataset.result = failed ? "failed" : "passed";
}, 600);
