import test from "node:test";
import assert from "node:assert/strict";
import { chapters, lessons } from "../src/data/curriculum.mjs";
import { eras, projects, catalogGroups } from "../src/data/resources.mjs";
import { solutionFor } from "../src/data/solutions.mjs";
import { deepDives } from "../src/data/deepDives.mjs";
import { parseProgress, previewPolicy } from "../src/lib.mjs";
test("12 chapters contain 36 unique authored lessons with complete learning fields", () => {
  assert.equal(chapters.length, 12);
  assert.equal(lessons.length, 36);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 36);
  for (const l of lessons) {
    for (const key of [
      "what",
      "why",
      "how",
      "task",
      "mistake",
      "question",
      "selector",
    ])
      assert.ok(l[key]?.length > 0, `${l.id}: ${key}`);
    assert.ok(l.options.length >= 3);
    assert.ok(l.answer >= 0 && l.answer < l.options.length);
    assert.ok(solutionFor(l.id).startsWith("<!DOCTYPE html>"));
  }
});
test("six guided projects have real starters, solutions, steps, and structural checks", () => {
  assert.equal(projects.length, 6);
  for (const p of projects) {
    assert.ok(p.tasks.length >= 4);
    assert.ok(p.selectors.length >= 5);
    assert.notEqual(p.starter, p.solution);
    assert.ok(p.solution.includes('<html lang="en">'));
  }
});
test("timeline includes historical snapshots and continuous maintenance", () => {
  assert.equal(eras.length, 8);
  assert.ok(eras.some((e) => e.label === "HTML 5.1 / 5.2"));
  assert.ok(eras.at(-1).url.includes("whatwg"));
  assert.ok(eras.every((e) => e.code && e.modern && e.warning && e.question));
});
test("element catalog has no duplicate tags and includes all categories", () => {
  const tags = Object.values(catalogGroups).flat();
  assert.equal(new Set(tags).size, tags.length);
  assert.ok(tags.length > 85);
  for (const tag of ["output", "track", "dialog", "data", "frameset"])
    assert.ok(tags.includes(tag));
});
test("progress recovers from malformed or partially invalid stored values", () => {
  assert.deepEqual(parseProgress("not json").completed, []);
  assert.deepEqual(parseProgress("null").bookmarks, []);
  assert.deepEqual(
    parseProgress('{"completed":[1,"web"],"bookmarks":null}').completed,
    ["web"],
  );
  const original = {
    completed: ["web"],
    bookmarks: ["dom"],
    scores: { final: 50 },
    drafts: { web: "<h1>Notes</h1>" },
  };
  assert.deepEqual(parseProgress(JSON.stringify(original)), original);
});
test("preview CSP denies script, submission, connection, and nested documents", () => {
  for (const rule of [
    "script-src 'none'",
    "form-action 'none'",
    "connect-src 'none'",
    "frame-src 'none'",
    "base-uri 'none'",
    "object-src 'none'",
  ])
    assert.ok(previewPolicy.includes(rule));
});
test("each lesson has a worked explanation and an independent transfer task", () => {
  for (const lesson of lessons) {
    const detail = deepDives[lesson.id];
    assert.ok(detail, lesson.id);
    assert.equal(detail.length, 3);
    assert.ok(
      detail.every(
        (value) => typeof value === "string" && value.trim().length > 0,
      ),
    );
  }
});
