import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/curriculum.mjs";
import {
  advancedLessons,
  advancedQuestions,
  advancedReference,
} from "../src/data/advanced.mjs";
import { advancedLinks } from "../src/data/advancedLinks.mjs";
import { advancedProjects } from "../src/data/advancedProjects.mjs";
import { candidateChoice } from "../src/advancedModel.mjs";
import { advancedImages } from "../src/data/advancedImages.mjs";
import {
  advancedFragments,
  advancedMatches,
} from "../src/data/advancedExercises.mjs";
import {
  validateFiles,
  exportProject,
  importProject,
} from "../src/projectModel.mjs";
import { parseProgress, STORAGE_KEY, previewPolicy } from "../src/lib.mjs";
test("advanced workshops supply authored explanations, prediction, repair, references and teacher material", () => {
  assert.equal(lessons.length, 36);
  assert.equal(advancedLessons.length, 11);
  assert.equal(new Set(advancedLessons.map((l) => l.id)).size, 11);
  for (const l of advancedLessons) {
    for (const field of [
      "intro",
      "why",
      "context",
      "use",
      "avoid",
      "task",
      "predict",
      "prediction",
      "mistake",
      "recap",
      "discussion",
    ])
      assert.ok(l[field].length > 30, `${l.id}:${field}`);
    assert.ok(l.sections.length >= 3);
    assert.ok(
      l.sections.every(
        (row) =>
          row.length === 3 && row[1].length > 100 && row[2].includes("<"),
      ),
    );
    assert.ok(l.references.every((r) => r.startsWith("https://")));
    assert.ok(l.existing.every((id) => lessons.some((old) => old.id === id)));
    assert.ok(l.quiz.length >= 2);
    assert.ok(advancedReference(l).includes("<!DOCTYPE html>"));
  }
  assert.deepEqual(
    advancedLinks.map(([id, title, existing]) => ({ id, title, existing })),
    advancedLessons.map(({ id, title, existing }) => ({ id, title, existing })),
  );
});
test("advanced questions have reasoned, valid choices in the existing quiz format", () => {
  for (const l of advancedLessons) {
    assert.ok(advancedFragments[l.id]?.answer);
    assert.ok(advancedFragments[l.id].reason.length > 50);
  }
  for (const pairs of Object.values(advancedMatches)) {
    assert.equal(pairs.length, 3);
    assert.equal(new Set(pairs.map((p) => p[1])).size, 3);
  }
  assert.ok(advancedQuestions.length >= 30);
  for (const q of advancedQuestions) {
    assert.ok(q.options.length >= 3);
    assert.ok(
      Number.isInteger(q.answer) &&
        q.answer >= 0 &&
        q.answer < q.options.length,
    );
    assert.ok(q.reason.length > 50);
  }
});
test("advanced projects have complete supported files and survive ZIP export/import", () => {
  assert.equal(advancedProjects.length, 6);
  for (const p of advancedProjects) {
    assert.ok(p.requirements.length >= 4);
    assert.ok(p.walkthrough.length >= 5);
    assert.ok(p.checks.length >= 4);
    validateFiles(p.starter);
    validateFiles(p.solution);
    const restored = importProject(exportProject(p.solution));
    assert.deepEqual(
      Object.keys(restored).sort(),
      Object.keys(p.solution).sort(),
    );
    for (const [name, file] of Object.entries(p.solution)) {
      assert.equal(restored[name].data, file.data);
      assert.equal(restored[name].type, file.type);
    }
    assert.notEqual(
      p.starter["index.html"].data,
      p.solution["index.html"].data,
    );
  }
});
test("image model labels a bounded candidate decision without claiming measured timing", () => {
  assert.equal(Object.keys(advancedImages).length, 3);
  for (const width of [320, 640, 1280]) {
    const png = Buffer.from(
      advancedImages[`images/product-${width}.png`].data.split(",")[1],
      "base64",
    );
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), (width * 9) / 16);
  }
  assert.deepEqual(candidateChoice(400, 2, 100, [1600, 400, 800]), {
    slot: 400,
    target: 800,
    chosen: 800,
  });
  assert.equal(candidateChoice(1440, 3, 100, [400, 800]).chosen, 800);
  assert.equal(candidateChoice(400, 1, 50, [400, 800]).target, 200);
});
test("advanced progress coexists with old scores/drafts and preview policy", () => {
  const original = {
    completed: ["document", "advanced-forms"],
    bookmarks: ["web", "advanced-native"],
    scores: { "chapter-1": 80, "advanced-final": 90 },
    drafts: { "lesson-web": "original", "advanced-forms-repair": "advanced" },
  };
  assert.deepEqual(parseProgress(JSON.stringify(original)), original);
  assert.equal(STORAGE_KEY, "html-lab-progress-v1");
  assert.ok(previewPolicy.includes("script-src 'none'"));
  assert.ok(previewPolicy.includes("form-action 'none'"));
});
