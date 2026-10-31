import { resolvePath } from "./projectModel.mjs";
// These checks inspect local references and selector matches, not full CSS validity.
export function cssDiagnostics(files) {
  const issues = [];
  for (const [name, file] of Object.entries(files)) {
    if (!/\.css$/i.test(name) || file.type !== "text") continue;
    const css = file.data.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
      const ref = match[2].trim();
      if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
      const target = resolvePath(name, ref);
      if (!target || !files[target])
        issues.push(
          `${name}: missing CSS resource ${ref}. CSS paths start from the stylesheet folder.`,
        );
    }
    const docs = Object.entries(files)
      .filter(([n, f]) => /\.html?$/i.test(n) && f.type === "text")
      .map(([n, f]) => [
        n,
        new DOMParser().parseFromString(f.data, "text/html"),
      ])
      .filter(([n, doc]) =>
        [...doc.querySelectorAll('link[rel="stylesheet"][href]')].some(
          (link) => resolvePath(n, link.getAttribute("href")) === name,
        ),
      );
    if (!docs.length) continue;
    if (
      typeof CSSStyleSheet === "undefined" ||
      !CSSStyleSheet.prototype.replaceSync
    ) {
      issues.push(
        `${name}: selector suggestions are unavailable in this browser. Use browser inspection to review your CSS.`,
      );
      continue;
    }
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      function visit(rules) {
        for (const rule of rules) {
          if (rule.selectorText) {
            // Limit to static selectors. Dynamic states, pseudo-elements and nesting
            // need runtime context and would otherwise produce misleading failures.
            if (/[:&]/.test(rule.selectorText)) continue;
            try {
              if (!docs.some(([, doc]) => doc.querySelector(rule.selectorText)))
                issues.push(
                  `${name}: selector ${rule.selectorText} matches no element in the pages that link this stylesheet. Check class and id spelling.`,
                );
            } catch {
              /* Unsupported selector: leave it for browser inspection. */
            }
          } else if (rule.cssRules && !rule.name) visit(rule.cssRules);
        }
      }
      visit(sheet.cssRules);
    } catch {
      issues.push(
        `${name}: the browser could not read this stylesheet. Inspect its syntax.`,
      );
    }
  }
  return issues;
}
