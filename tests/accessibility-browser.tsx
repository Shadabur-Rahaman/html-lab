import React from "react";
import { createRoot } from "react-dom/client";
import axe from "axe-core";
import App from "../src/App";
import "../src/styles.css";
import "../src/v2.css";
if (!location.hash) location.hash = "advanced";
createRoot(document.getElementById("root")!).render(<App />);
document.getElementById("hide-axe")!.addEventListener("click", () => {
  document.getElementById("axe-result")!.hidden = true;
});
document.getElementById("run-axe")!.addEventListener("click", async () => {
  const output = document.getElementById("axe-result")!;
  output.hidden = false;
  output.textContent = "Scanning…";
  try {
    const result = await axe.run(document.getElementById("root")!, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
    output.textContent = JSON.stringify(
      {
        version: axe.version,
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        incomplete: result.incomplete.length,
        passes: result.passes.length,
      },
      null,
      2,
    );
  } catch (e) {
    output.textContent = (e as Error).message;
  }
});
