import { advancedLessons, advancedReference } from "../src/data/advanced.mjs";
import { advancedProjects } from "../src/data/advancedProjects.mjs";
import {
  parserTree,
  metadataReport,
  advancedAudit,
} from "../src/advancedModel.mjs";
import { parseHTML, checkStructure, audit, previewHTML } from "../src/lib.mjs";
let passed = 0,
  failed = 0;
function check(name, fn) {
  const li = document.createElement("li");
  try {
    if (!fn()) throw Error("Check returned false");
    li.textContent = "PASS · " + name;
    passed++;
  } catch (e) {
    li.textContent = "FAIL · " + name + " · " + e.message;
    li.className = "fail";
    failed++;
  }
  document.querySelector("#results").append(li);
}
for (const l of advancedLessons) {
  check("repair reference meets structural exercise: " + l.id, () =>
    checkStructure(advancedReference(l), l.checks).every((r) => r.passed),
  );
  check(
    "worked example has no baseline educational audit issues: " + l.id,
    () => audit(l.example).length === 0,
  );
}
for (const p of advancedProjects) {
  const docs = Object.entries(p.solution)
    .filter(([n]) => n.endsWith(".html"))
    .map(([, f]) => parseHTML(f.data));
  check("project reference meets brief selectors: " + p.id, () =>
    p.checks.every((selector) => docs.some((d) => d.querySelector(selector))),
  );
  check("project pages pass limited baseline HTML audit: " + p.id, () =>
    Object.entries(p.solution)
      .filter(([n]) => n.endsWith(".html"))
      .every(([, f]) => audit(f.data).length === 0),
  );
}
check("real HTML parser inserts tbody and moves stray table text", () => {
  const d = parseHTML("<table>Stray<tr><td>One</td></tr></table>");
  return (
    !!d.querySelector("table>tbody>tr") &&
    d.body.textContent.includes("Stray") &&
    !d.querySelector("table").textContent.includes("Stray")
  );
});
check("real HTML parser closes p before h2", () => {
  const d = parseHTML("<p>Before<h2>Heading</h2>After</p>");
  return !d.querySelector("p h2") && !!d.querySelector("body>h2");
});
check(
  "MIME changes parser behavior; malformed XML reports error",
  () =>
    parserTree("<p>One<p>Two", "application/xhtml+xml").xmlError &&
    !parserTree("<p>One<p>Two").xmlError,
);
check(
  "doctype controls quirks distinction",
  () =>
    parserTree("<p>No doctype").mode === "BackCompat" &&
    parserTree("<!doctype html><p>Doctype").mode === "CSS1Compat",
);
check(
  "metadata inspector reads inert JSON-LD without interpreting it as code",
  () => {
    const r = metadataReport(
      advancedLessons.find((l) => l.id === "metadata").example,
    );
    return (
      r.structured.length === 1 &&
      r.structured[0].valid &&
      r.fields.find(([n]) => n === "Canonical")[1].startsWith("https://")
    );
  },
);
check(
  "metadata inspector identifies malformed data JSON",
  () =>
    !metadataReport('<script type="application/ld+json">{broken}</script>')
      .structured[0].valid,
);
check(
  "advanced planted audit finds labels/headings/tables/focus/link issues",
  () => {
    const issues = advancedAudit(
      advancedLessons.find((l) => l.id === "accessibility").broken,
    );
    return ["Forms", "Headings", "Tables", "Focus", "Links"].every((area) =>
      issues.some((i) => i.area === area),
    );
  },
);
check("security inspector finds iframe capability and naming problems", () => {
  const issues = advancedAudit(
    advancedLessons.find((l) => l.id === "security").broken,
  );
  return (
    issues.some((i) => i.area === "Embedding") &&
    issues.some((i) => i.area === "Permissions")
  );
});
const fixtures = document.querySelector("#fixtures");
const form = document.createElement("form");
form.innerHTML =
  '<label for="testmail">Email</label><input id="testmail" name="email" type="email" required><input name="reference" readonly value="COURSE"><input name="disabled" disabled value="NO"><input type="checkbox" name="unchecked" value="NO"><input name="qty" type="number" min="2" max="10" step="2" value="3"><button>Review</button>';
form.addEventListener("submit", (e) => e.preventDefault());
fixtures.append(form);
check(
  "native constraints flag required, type mismatch and step mismatch",
  () => {
    const email = form.elements.namedItem("email"),
      qty = form.elements.namedItem("qty");
    const missing = email.validity.valueMissing;
    email.value = "bad";
    return missing && email.validity.typeMismatch && qty.validity.stepMismatch;
  },
);
check("FormData includes readonly and excludes disabled/unchecked", () => {
  const data = new FormData(form);
  return (
    data.get("reference") === "COURSE" &&
    !data.has("disabled") &&
    !data.has("unchecked")
  );
});
check("Boolean false string is still true by presence", () => {
  const input = document.createElement("input");
  input.setAttribute("required", "false");
  return input.required;
});
const dialog = document.createElement("dialog");
dialog.innerHTML =
  '<h2 id="native-title">Test modal</h2><form method="dialog"><button value="done">Done</button></form>';
dialog.setAttribute("aria-labelledby", "native-title");
fixtures.append(dialog);
check(
  "native showModal uses modal state and form method dialog closes without navigation",
  () => {
    dialog.showModal();
    const modal = dialog.matches(":modal");
    dialog.querySelector("button").click();
    return modal && !dialog.open && dialog.returnValue === "done";
  },
);
check("native show is nonmodal", () => {
  dialog.show();
  const nonmodal = dialog.open && !dialog.matches(":modal");
  dialog.close();
  return nonmodal;
});
if ("commandForElement" in HTMLButtonElement.prototype) {
  dialog.id = "command-target";
  const invoke = document.createElement("button");
  invoke.setAttribute("commandfor", "command-target");
  invoke.setAttribute("command", "show-modal");
  invoke.textContent = "Declarative modal";
  fixtures.append(invoke);
  check(
    "native declarative Invoker Command opens a modal in this browser",
    () => {
      invoke.click();
      const modal = dialog.matches(":modal");
      dialog.close();
      return modal;
    },
  );
} else
  check(
    "Invoker Commands unsupported: trusted showModal fallback required",
    () => true,
  );
if ("popover" in HTMLElement.prototype) {
  const pop = document.createElement("div");
  pop.popover = "auto";
  pop.textContent = "Information";
  fixtures.append(pop);
  check("native popover opens and closes in top-layer state", () => {
    pop.showPopover();
    const open = pop.matches(":popover-open");
    pop.hidePopover();
    return open && !pop.matches(":popover-open");
  });
} else
  check("popover unsupported: fallback path explicitly detected", () => true);
const region = document.createElement("div"),
  button = document.createElement("button");
button.textContent = "Inert test";
region.append(button);
fixtures.append(region);
check("native inert prevents programmatic focus on its descendant", () => {
  region.inert = true;
  button.focus();
  const blocked = document.activeElement !== button;
  region.inert = false;
  button.focus();
  return blocked && document.activeElement === button;
});
const template = document.createElement("template");
template.innerHTML = "<article><h2>Stored profile</h2></article>";
check(
  "ordinary template content is inert and can be cloned",
  () =>
    !template.querySelector("h2") &&
    !!template.content.querySelector("h2") &&
    !!template.content.cloneNode(true).querySelector("article"),
);
const host = document.createElement("div");
host.innerHTML = '<span slot="name">Asha</span>';
fixtures.append(host);
const root = host.attachShadow({ mode: "open" });
root.innerHTML = '<slot name="name"></slot>';
check(
  "real named slot distributes a light-DOM child without reparenting",
  () =>
    root.querySelector("slot").assignedElements()[0] ===
      host.firstElementChild && host.firstElementChild.parentNode === host,
);
check("DOMParser does not activate declarative shadow roots by default", () => {
  const d = parseHTML(
    '<div><template shadowrootmode="open"><slot></slot></template>Text</div>',
  );
  return !d.querySelector("div").shadowRoot && !!d.querySelector("template");
});
check(
  "safe general preview continues to prohibit script and form submission",
  () => {
    const d = parseHTML(
      previewHTML(
        '<script>alert(1)</script><form action="https://example.org"><button>Send</button></form>',
      ),
    );
    const csp = d.querySelector("meta[http-equiv]").content;
    return (
      !d.querySelector("script") &&
      csp.includes("script-src 'none'") &&
      csp.includes("form-action 'none'")
    );
  },
);
fixtures.replaceChildren();
document.querySelector("#status").textContent =
  `${passed} passed · ${failed} failed`;
document.documentElement.dataset.result = failed ? "failed" : "passed";
