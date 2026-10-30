import test from "node:test";
import assert from "node:assert/strict";
import { zipSync, strToU8 } from "fflate";
import {
  safePath,
  resolvePath,
  importProject,
  exportProject,
  validateFiles,
  assetFile,
} from "../src/projectModel.mjs";
import { starterFiles, industryProjects } from "../src/data/v2Projects.mjs";
import { guides, glossary } from "../src/data/academy.mjs";
import { bugs } from "../src/data/bugs.mjs";
test("relative path resolution stays inside the virtual project and preserves case", () => {
  assert.equal(
    resolvePath("pages/about.html", "../css/style.css"),
    "css/style.css",
  );
  assert.equal(resolvePath("index.html", "About.html"), "About.html");
  assert.equal(resolvePath("index.html", "../private.txt"), null);
  assert.equal(resolvePath("index.html", "%2e%2e/secret.txt"), null);
  assert.equal(resolvePath("index.html", "https://example.com"), null);
  assert.equal(resolvePath("pages/about.html", "#intro"), "pages/about.html");
  assert.equal(resolvePath("pages/about.html", "..\\secret.txt"), null);
});
test("unsafe ZIP paths, hidden files, and unsupported executable formats are rejected", () => {
  for (const path of [
    "../escape.html",
    "/index.html",
    "a/../../index.html",
    "C:/index.html",
    ".git/config",
    "a\\b.html",
    "%2e%2e/index.html",
  ])
    assert.throws(() => safePath(path));
  for (const name of ["../index.html", "run.js", "photo.svg", ".env"]) {
    const zip = zipSync({
      [name]: strToU8("not allowed"),
      "index.html": strToU8("<h1>Hi</h1>"),
    });
    assert.throws(() => importProject(zip));
  }
});
test("complete project round trip preserves text, folders, and binary assets", () => {
  const files = starterFiles("Round trip");
  files["images"] = { type: "folder", data: "" };
  files["images/pixel.png"] = assetFile(
    "images/pixel.png",
    Uint8Array.from(
      atob(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+yCLsAAAAASUVORK5CYII=",
      ),
      (c) => c.charCodeAt(0),
    ),
  );
  const loaded = importProject(exportProject(files));
  assert.deepEqual(Object.keys(loaded).sort(), Object.keys(files).sort());
  for (const path of Object.keys(files))
    assert.equal(loaded[path].data, files[path].data);
});
test("imports reject excessive counts, large text, and file/folder conflicts", () => {
  assert.throws(() =>
    validateFiles({ "index.html": { type: "text", data: "x".repeat(80001) } }),
  );
  assert.throws(() =>
    validateFiles({
      "a.txt": { type: "text", data: "" },
      "a.txt/index.html": { type: "text", data: "" },
    }),
  );
  const many = Object.fromEntries(
    Array.from({ length: 61 }, (_, i) => [
      `page${i}.html`,
      { type: "text", data: "" },
    ]),
  );
  assert.throws(() => validateFiles(many));
  const compressed = zipSync({
    "index.html": strToU8("A".repeat(2 * 1024 * 1024 + 1)),
  });
  assert.throws(() => importProject(compressed));
});
test("image extension does not permit arbitrary SVG or HTML bytes", () => {
  assert.throws(() =>
    assetFile("pretend.png", strToU8('<svg onload="alert(1)"></svg>')),
  );
  assert.throws(() => assetFile("image.svg", strToU8("<svg/>")));
});
test("new project templates and challenge fixtures are complete and separate from the original curriculum", () => {
  assert.equal(industryProjects.length, 7);
  for (const p of industryProjects) {
    validateFiles(p.starter);
    validateFiles(p.solution);
    assert.ok(p.steps.length >= 6);
    assert.ok(p.requirements.length >= 5);
    assert.ok(p.solution["index.html"].data.includes(p.sections[0]));
  }
  assert.equal(bugs.length, 7);
  for (const b of bugs) {
    assert.ok(b.hints.length === 3);
    assert.notDeepEqual(b.starter, b.solution);
  }
});
test("beginner guides and glossary provide examples and practice without changing the original progress schema", () => {
  assert.ok(guides.length >= 13);
  assert.ok(glossary.length >= 25);
  for (const g of guides)
    for (const u of g.units)
      for (const field of ["why", "what", "analogy", "practice", "mistake"])
        assert.ok(u[field].length > 10, `${g.id}: ${field}`);
});
