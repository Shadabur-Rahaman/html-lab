// Explicit maintainer-only check of authored curriculum, never saved learner data.
import { advancedLessons, advancedReference } from "../src/data/advanced.mjs";
import { advancedProjects } from "../src/data/advancedProjects.mjs";
if (!process.argv.includes("--send-authored-examples"))
  throw Error(
    "Use --send-authored-examples to explicitly send authored course references to the external Nu checker.",
  );
const pages = [
  ...advancedLessons.map((l) => [l.id, advancedReference(l)]),
  ...advancedProjects.flatMap((p) =>
    Object.entries(p.solution)
      .filter(([n]) => n.endsWith(".html"))
      .map(([n, f]) => [p.id + "/" + n, f.data]),
  ),
];
let errors = 0;
for (const [name, source] of pages) {
  const response = await fetch("https://validator.w3.org/nu/?out=json", {
    method: "POST",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "User-Agent": "HTML-LAB-authored-curriculum-check/3.0",
    },
    body: source,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok)
    throw Error(
      `Nu checker unavailable (${response.status}); no conformance result can be claimed.`,
    );
  const result = await response.json();
  const messages = (result.messages || []).map((m) => ({
    type: m.type,
    subType: m.subType,
    message: m.message,
    line: m.lastLine,
  }));
  errors += messages.filter((m) => m.type === "error").length;
  console.log(JSON.stringify({ name, messages }));
  await new Promise((r) => setTimeout(r, 300));
}
console.log(JSON.stringify({ pages: pages.length, errors }));
process.exitCode = errors ? 1 : 0;
