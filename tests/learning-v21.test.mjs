import test from "node:test";
import assert from "node:assert/strict";
import { addTreeNode, treeSource, tagRounds } from "../src/learningModel.mjs";
test("DOM practice preserves siblings, nested children, and immutable history", () => {
  const root = [{ id: 0, parent: -1, tag: "body" }];
  let tree = addTreeNode(root, 0, "main");
  tree = addTreeNode(tree, 1, "ul");
  tree = addTreeNode(tree, 2, "li");
  tree = addTreeNode(tree, 2, "li");
  assert.equal(root.length, 1);
  assert.match(
    treeSource(tree),
    /<ul>\n      <li>Example text<\/li>\n      <li>Example text<\/li>\n    <\/ul>/,
  );
  assert.throws(() => addTreeNode(tree, 2, "p"), /cannot be a child/);
  assert.throws(() => addTreeNode(tree, 0, "main"), /one main/);
  assert.throws(() => addTreeNode(tree, 99, "p"), /existing parent/);
  assert.throws(() => addTreeNode(tree, 1, "script"), /supported element/);
});
test("tag rounds include void elements and nested closing order", () => {
  assert.equal(tagRounds.length, 5);
  assert.equal(
    tagRounds.find((r) => r.source.startsWith("<img")).answer,
    "No closing tag",
  );
  assert.equal(
    tagRounds.find((r) => r.source.includes("<strong>")).answer,
    "</strong>",
  );
});
