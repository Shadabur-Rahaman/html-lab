export function candidateChoice(width, dpr, slotPercent, candidates) {
  const slot = (width * slotPercent) / 100;
  const list = [...new Set(candidates)]
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);
  return {
    slot,
    target: slot * dpr,
    chosen: list.find((n) => n >= slot * dpr) || list.at(-1) || 0,
  };
}
export function parserTree(source, mime = "text/html") {
  const doc = new DOMParser().parseFromString(source.slice(0, 80000), mime);
  let count = 0;
  function walk(node, depth) {
    if (++count > 220 || depth > 10) return "  ".repeat(depth) + "…";
    if (node.nodeType === 3)
      return node.textContent.trim()
        ? "  ".repeat(depth) +
            JSON.stringify(node.textContent.trim().slice(0, 120))
        : "";
    if (node.nodeType !== 1) return "";
    return (
      "  ".repeat(depth) +
      `<${node.nodeName.toLowerCase()}>` +
      [...node.childNodes].map((n) => "\n" + walk(n, depth + 1)).join("")
    );
  }
  return {
    tree: walk(doc.documentElement, 0),
    mode: doc.compatMode,
    xmlError: !!doc.querySelector("parsererror"),
  };
}
export const parserPuzzles = [
  {
    name: "Paragraph recovery",
    source: "<!DOCTYPE html><p>Before<h2>Inside?</h2>After</p>",
    why: "The h2 start tag closes the open paragraph. A later p end tag can produce an extra empty paragraph.",
  },
  {
    name: "Optional list endings",
    source: "<!DOCTYPE html><ul><li>One<li>Two</ul>",
    why: "The next li start tag closes the preceding list item in this context.",
  },
  {
    name: "Table construction",
    source: "<!DOCTYPE html><table>Stray text<tr><td>One</td></tr></table>",
    why: "The parser inserts tbody and foster-parents the stray table text outside the table.",
  },
  {
    name: "Nested buttons",
    source: "<!DOCTYPE html><button>Outer<button>Inner</button>Tail</button>",
    why: "The inner button start tag triggers recovery that closes the outer button; the intended nesting does not survive.",
  },
  {
    name: "Character references",
    source:
      "<!DOCTYPE html><p>&lt;strong&gt; &amp; text</p><textarea>&lt;strong&gt;</textarea>",
    why: "The references become text. A literal tag represented by &lt; is not parsed again as an element.",
  },
];
export function metadataReport(source) {
  const doc = new DOMParser().parseFromString(source, "text/html");
  const meta = (selector) =>
    doc.querySelector(selector)?.getAttribute("content") || "";
  const fields = [
    [
      "Title",
      doc.title,
      "Identifies the document; use a specific, accurate title.",
    ],
    [
      "Language",
      doc.documentElement.lang,
      "Declares the actual document language.",
    ],
    [
      "Description",
      meta('meta[name="description"]'),
      "Optional snippet guidance; display is not guaranteed.",
    ],
    [
      "Canonical",
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
      "Optional preferred URL; choose it intentionally.",
    ],
    [
      "Robots",
      meta('meta[name="robots"]'),
      "Optional crawler instructions; never access control.",
    ],
    [
      "Open Graph title",
      meta('meta[property="og:title"]'),
      "Optional social-sharing title.",
    ],
    [
      "Open Graph image",
      meta('meta[property="og:image"]'),
      "Optional publicly fetchable share image.",
    ],
    [
      "Social card",
      meta('meta[name="twitter:card"]'),
      "Optional platform-specific card convention.",
    ],
    [
      "Language alternates",
      [...doc.querySelectorAll('link[rel="alternate"][hreflang]')]
        .map((n) => `${n.getAttribute("hreflang")}: ${n.getAttribute("href")}`)
        .join("; "),
      "Use only when real alternate pages exist.",
    ],
  ];
  const structured = [
    ...doc.querySelectorAll('script[type="application/ld+json"]'),
  ].map((n) => {
    try {
      const data = JSON.parse(n.textContent);
      return {
        valid: true,
        text: JSON.stringify(data, null, 2).slice(0, 8000),
      };
    } catch {
      return {
        valid: false,
        text: "Invalid JSON syntax. Fix quoting, commas and brackets.",
      };
    }
  });
  return { fields, structured };
}
export function advancedAudit(source) {
  const d = new DOMParser().parseFromString(source, "text/html"),
    issues = [];
  const add = (area, message) => issues.push({ area, message });
  const ids = new Set();
  for (const el of d.querySelectorAll("[id]")) {
    if (ids.has(el.id)) add("Structure", `Duplicate id: ${el.id}`);
    ids.add(el.id);
  }
  if (!d.querySelector("main"))
    add(
      "Landmarks",
      "Consider an appropriate main landmark for the dominant content.",
    );
  let previous = 0;
  for (const h of d.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    const rank = Number(h.tagName[1]);
    if (rank > previous + 1)
      add(
        "Headings",
        `Review heading jump to ${h.tagName.toLowerCase()}: ${h.textContent.slice(0, 60)}`,
      );
    previous = rank;
  }
  for (const n of d.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]),select,textarea',
  )) {
    const associated =
      n.closest("label") ||
      [...d.querySelectorAll("label[for]")].some(
        (l) => l.htmlFor && l.htmlFor === n.id,
      );
    if (
      !associated &&
      !n.getAttribute("aria-label") &&
      !n.getAttribute("aria-labelledby")
    )
      add(
        "Forms",
        "A control needs a useful accessible name; prefer an associated visible label.",
      );
  }
  for (const n of d.querySelectorAll(
    "[aria-labelledby],[aria-describedby],[headers]",
  ))
    for (const attr of ["aria-labelledby", "aria-describedby", "headers"])
      for (const id of (n.getAttribute(attr) || "")
        .split(/\s+/)
        .filter(Boolean))
        if (!d.getElementById(id))
          add("Relationships", `${attr} refers to missing id ${id}.`);
  for (const n of d.querySelectorAll("a[href]"))
    if (/^(click here|more|here)$/i.test(n.textContent.trim()))
      add("Links", "Explain the link destination or purpose in context.");
  for (const n of d.querySelectorAll("img:not([alt])"))
    add(
      "Images",
      "An image lacks alt; determine whether it is informative or decorative.",
    );
  for (const n of d.querySelectorAll("[tabindex]"))
    if (Number(n.getAttribute("tabindex")) > 0)
      add(
        "Focus",
        "Avoid positive tabindex; review logical DOM and keyboard order.",
      );
  for (const t of d.querySelectorAll("table")) {
    if (!t.querySelector("caption"))
      add("Tables", "Consider a descriptive caption.");
    if (!t.querySelector("th"))
      add("Tables", "Data-table relationships need appropriate header cells.");
  }
  for (const n of d.querySelectorAll("dialog"))
    if (!n.hasAttribute("aria-label") && !n.hasAttribute("aria-labelledby"))
      add(
        "Dialogs",
        "Give the dialog an accessible name and manually test opening, closing and focus.",
      );
  for (const n of d.querySelectorAll("a a,a button,button a,button input"))
    add(
      "Content model",
      "Nested interactive content needs review. Parser recovery can hide additional source errors.",
    );
  if (
    /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<(?:h[1-6]|section|article|div)\b/i.test(
      source,
    )
  )
    add(
      "Source candidate",
      "A block/section inside a paragraph may have triggered parser repair; inspect source and validate it.",
    );
  for (const n of d.querySelectorAll("iframe")) {
    if (!n.hasAttribute("title"))
      add("Embedding", "Name the iframe with a useful title.");
    if (!n.hasAttribute("sandbox"))
      add(
        "Embedding",
        "Review whether this untrusted embed needs sandbox restrictions.",
      );
    if (
      /allow-scripts/.test(n.getAttribute("sandbox") || "") &&
      /allow-same-origin/.test(n.getAttribute("sandbox") || "")
    )
      add(
        "Embedding",
        "Scripts plus same-origin can defeat intended isolation for same-origin untrusted content.",
      );
    if (n.getAttribute("allow"))
      add(
        "Permissions",
        "Review each granted iframe feature and remove unnecessary permissions.",
      );
  }
  for (const n of d.querySelectorAll("[href],[src]"))
    if (
      /^\s*javascript:/i.test(
        n.getAttribute("href") || n.getAttribute("src") || "",
      )
    )
      add(
        "URLs",
        "Do not accept untrusted javascript URLs. Use validated destinations.",
      );
  for (const n of d.querySelectorAll("*"))
    if ([...n.attributes].some((a) => /^on/i.test(a.name)))
      add(
        "Injection",
        "Inline event handlers execute in active documents; keep untrusted markup inert and use safe text insertion.",
      );
  return issues;
}
