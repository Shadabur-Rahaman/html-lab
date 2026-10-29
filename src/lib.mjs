import { captionDataURL } from "./data/media.mjs";
export const STORAGE_KEY = "html-lab-progress-v1";
export function parseProgress(raw) {
  try {
    const p = JSON.parse(raw || "{}");
    if (!p || typeof p !== "object") throw Error("Invalid progress");
    return {
      completed: Array.isArray(p.completed)
        ? [...new Set(p.completed.filter((x) => typeof x === "string"))]
        : [],
      bookmarks: Array.isArray(p.bookmarks)
        ? [...new Set(p.bookmarks.filter((x) => typeof x === "string"))]
        : [],
      scores:
        p.scores && typeof p.scores === "object"
          ? Object.fromEntries(
              Object.entries(p.scores).filter(
                ([, v]) =>
                  typeof v === "number" &&
                  Number.isFinite(v) &&
                  v >= 0 &&
                  v <= 100,
              ),
            )
          : {},
      drafts:
        p.drafts && typeof p.drafts === "object"
          ? Object.fromEntries(
              Object.entries(p.drafts).filter(
                ([, v]) => typeof v === "string" && v.length <= 80000,
              ),
            )
          : {},
    };
  } catch {
    return { completed: [], bookmarks: [], scores: {}, drafts: {} };
  }
}
export const previewPolicy =
  "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data: blob: https: http://127.0.0.1:*; media-src data: blob: https: http://127.0.0.1:*; font-src 'none'; frame-src 'none'; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'";
export function parseHTML(code) {
  return new DOMParser().parseFromString(code, "text/html");
}
export function previewHTML(code) {
  const d = parseHTML(code);
  // The sandbox has an opaque origin. Embed the known bundled caption text,
  // rather than granting origin access to load its relative WebVTT resource.
  d.querySelectorAll(
    'track[src="./captions.vtt"],track[src="captions.vtt"]',
  ).forEach((track) => track.setAttribute("src", captionDataURL));
  d.querySelectorAll(
    "script,base,meta[http-equiv],iframe,object,embed",
  ).forEach((n) => n.remove());
  d.querySelectorAll("*").forEach((el) => {
    for (const a of [...el.attributes]) {
      if (a.name.toLowerCase().startsWith("on") || a.name === "srcdoc")
        el.removeAttribute(a.name);
    }
    if (el.tagName === "A") {
      el.removeAttribute("target");
      if (!el.getAttribute("href")?.startsWith("#")) {
        el.removeAttribute("href");
        el.setAttribute(
          "title",
          "External navigation disabled in the preview.",
        );
      }
    }
  });
  const meta = d.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = previewPolicy;
  d.head.prepend(meta);
  return "<!DOCTYPE html>\n" + d.documentElement.outerHTML;
}
export function checkStructure(code, selectors) {
  const d = parseHTML(code);
  return selectors
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => ({ selector: s, passed: !!d.querySelector(s) }));
}
export function audit(code) {
  const d = parseHTML(code),
    out = [];
  const add = (condition, message) => {
    if (condition) out.push(message);
  };
  add(!d.title.trim(), "Add a descriptive title inside head.");
  add(!d.documentElement.lang, "Declare the document language on html.");
  add(
    d.querySelectorAll("h1").length !== 1,
    "Use one clear page-level h1 as a practical convention.",
  );
  add(
    d.querySelectorAll("main:not([hidden])").length !== 1,
    "Use one visible main landmark for the dominant content.",
  );
  d.querySelectorAll("img").forEach((img, i) =>
    add(
      !img.hasAttribute("alt"),
      `Image ${i + 1}: add an appropriate alt attribute (empty for decoration).`,
    ),
  );
  d.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]),select,textarea',
  ).forEach((el, i) =>
    add(
      !el.closest("label") &&
        ![...d.querySelectorAll("label")].some(
          (l) => l.htmlFor && l.htmlFor === el.id,
        ) &&
        !el.hasAttribute("aria-label") &&
        !el.hasAttribute("aria-labelledby"),
      `Control ${i + 1}: add an associated visible label.`,
    ),
  );
  let last = 0;
  d.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
    const n = +h.tagName[1];
    add(
      last > 0 && n > last + 1,
      `Heading ${h.textContent}: review the jump from h${last} to h${n}.`,
    );
    last = n;
  });
  add(
    !!d.querySelector("font,center,frameset,frame,marquee"),
    "Replace obsolete elements with semantic HTML and CSS.",
  );
  const ids = new Set();
  add(
    !!d.querySelector(
      "ul > :not(li):not(script):not(template), ol > :not(li):not(script):not(template)",
    ),
    "Invalid list nesting: put list items inside li elements.",
  );
  add(
    !!d.querySelector(
      "a[href] button, a[href] input, a[href] select, a[href] textarea, button a[href], button input, button select, button textarea",
    ),
    "Invalid interactive nesting: do not put interactive controls inside a link or button.",
  );
  d.querySelectorAll("[id]").forEach((el) => {
    add(ids.has(el.id), `Duplicate id: ${el.id}. Give elements unique ids.`);
    ids.add(el.id);
  });
  return out;
}
export function downloadHTML(code, name = "my-webpage.html") {
  const url = URL.createObjectURL(new Blob([code], { type: "text/html" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
