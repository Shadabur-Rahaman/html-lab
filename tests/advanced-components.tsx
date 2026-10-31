import React from "react";
import { createRoot } from "react-dom/client";
import {
  ComponentAnatomy,
  NativeFormLab,
  NativeUILab,
} from "../src/components/AdvancedLabs";
import ProjectWorkspace from "../src/components/ProjectWorkspace";
import { advancedProjects } from "../src/data/advancedProjects.mjs";
const fixture = document.getElementById("component-fixture")!,
  root = createRoot(fixture);
let passed = 0,
  failed = 0;
const wait = async (fn: () => boolean) => {
  for (let i = 0; i < 100; i++) {
    if (fn()) return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw Error("Component did not reach expected state");
};
function check(name: string, fn: () => boolean) {
  const li = document.createElement("li");
  try {
    if (!fn()) throw Error("Check returned false");
    li.textContent = "PASS · " + name;
    passed++;
  } catch (e) {
    li.textContent = "FAIL · " + name + " · " + (e as Error).message;
    failed++;
  }
  document.querySelector("#results")!.append(li);
}
const button = (text: string) =>
  [...fixture.querySelectorAll("button")].find((b) =>
    b.textContent?.includes(text),
  )!;
try {
  root.render(
    <React.StrictMode>
      <ComponentAnatomy />
    </React.StrictMode>,
  );
  await wait(
    () => !!fixture.querySelector("template")?.content.querySelector("article"),
  );
  check(
    "React anatomy demo populates the real inert template fragment",
    () =>
      !!fixture.querySelector("template")?.content.querySelector("h3") &&
      !fixture.querySelector(".advanced-clones article"),
  );
  button("Clone trusted template").click();
  await wait(
    () => fixture.querySelectorAll(".advanced-clones article").length === 1,
  );
  check(
    "React template button renders a real cloned card",
    () =>
      fixture.querySelector(".advanced-clones h3")?.textContent ===
      "Cloned profile",
  );
  check("React anatomy host has a real named slot assignment", () => {
    const host = fixture.querySelector(".note-card")!;
    return (
      host.shadowRoot?.querySelector("slot")?.assignedElements()[0] ===
      host.querySelector('[slot="name"]')
    );
  });
  button("Clear cloned examples").click();
  await wait(() => !fixture.querySelector(".advanced-clones article"));
  check(
    "anatomy reset removes cloned nodes",
    () => !fixture.querySelector(".advanced-clones article"),
  );
  root.render(<NativeFormLab />);
  await wait(() => !!fixture.querySelector('form input[name="email"]'));
  const form = fixture.querySelector("form")!,
    email = form.elements.namedItem("email") as HTMLInputElement;
  email.value = "fictional@example.org";
  button("Inspect validity & form data").click();
  await wait(() => fixture.querySelectorAll("pre").length === 2);
  check("React native form inspector exposes actual successful controls", () =>
    [...fixture.querySelectorAll("pre")].some((p) =>
      p.textContent?.includes("reference: COURSE-42"),
    ),
  );
  const disable = [...fixture.querySelectorAll("label")]
    .find((l) => l.textContent?.includes("Disable reference"))!
    .querySelector("input")!;
  disable.click();
  await wait(
    () => (form.elements.namedItem("reference") as HTMLInputElement).disabled,
  );
  button("Inspect validity & form data").click();
  await wait(
    () =>
      ![...fixture.querySelectorAll("pre")]
        .at(-1)
        ?.textContent?.includes("reference:"),
  );
  check(
    "React disabled toggle changes native form data",
    () => !new FormData(form).has("reference"),
  );
  root.render(<NativeUILab />);
  await wait(() => !!fixture.querySelector("dialog"));
  button("Open native modal").click();
  await wait(() => !!fixture.querySelector("dialog:modal"));
  check(
    "React native modal uses the browser modal state",
    () => !!fixture.querySelector("dialog:modal"),
  );
  button("Done reviewing").click();
  await wait(
    () =>
      !fixture.querySelector("dialog:modal") &&
      document.activeElement === button("Open native modal"),
  );
  check(
    "method dialog close returns focus to the opener",
    () => document.activeElement === button("Open native modal"),
  );
  for (const project of advancedProjects) {
    const completed: string[] = [];
    root.render(
      <ProjectWorkspace
        key={project.id}
        seed={{
          id: "advanced-" + project.id,
          title: project.title,
          starter: project.solution,
          checks: project.checks,
        }}
        done={(id) => completed.push(id)}
      />,
    );
    await wait(
      () =>
        fixture.textContent?.includes(
          "No horizontal overflow detected in the current preview.",
        ) === true,
    );
    button("Check project").click();
    await wait(() => !!fixture.querySelector(".project-report"));
    check(
      "existing workspace passes the advanced reference: " + project.id,
      () =>
        !fixture.querySelector(".project-report .warning") &&
        completed.includes("advanced-" + project.id),
    );
    // Wait for unmount before the next project so an earlier preview measurement
    // cannot satisfy the next project's readiness condition.
    root.render(<div>Between project fixtures</div>);
    await wait(() => !fixture.querySelector("iframe"));
  }
} catch (e) {
  check(
    "component integration completes: " + (e as Error).message,
    () => false,
  );
}
root.unmount();
document.querySelector("#status")!.textContent =
  `${passed} passed · ${failed} failed`;
