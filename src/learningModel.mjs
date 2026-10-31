export const tagRounds = [
  {
    source: "<main><h1>Welcome",
    answer: "</h1>",
    reason: "Close the most recently opened element first.",
  },
  {
    source: "<ul><li>First item",
    answer: "</li>",
    reason: "The list item belongs inside the list.",
  },
  {
    source: "<p>A <strong>useful word",
    answer: "</strong>",
    reason: "Finish the emphasis before closing the paragraph.",
  },
  {
    source: '<img src="photo.png" alt="A mountain">',
    answer: "No closing tag",
    reason: "img is a void element. It has no children or end tag.",
  },
  {
    source: "<section><p>Finished paragraph</p>",
    answer: "</section>",
    reason: "The paragraph is closed; the section is still open.",
  },
];
export const treeTags = ["main", "section", "h1", "p", "strong", "ul", "li"];
export function addTreeNode(nodes, parent, tag) {
  if (!treeTags.includes(tag)) throw Error("Choose a supported element.");
  const owner = nodes.find((n) => n.id === parent);
  if (!owner) throw Error("Choose an existing parent.");
  const allowed = {
    body: ["main"],
    main: ["section", "h1", "p", "ul"],
    section: ["section", "h1", "p", "ul"],
    ul: ["li"],
    li: ["p", "strong", "ul"],
    p: ["strong"],
    h1: ["strong"],
    strong: [],
  };
  if (!allowed[owner.tag]?.includes(tag))
    throw Error(
      `In this exercise, <${tag}> cannot be a child of <${owner.tag}>. Choose another parent.`,
    );
  if (tag === "main" && nodes.some((n) => n.tag === "main"))
    throw Error("Use one main landmark in this exercise.");
  if (nodes.length >= 24)
    throw Error(
      "This practice tree has room for 24 nodes. Reset to start again.",
    );
  return [
    ...nodes,
    { id: Math.max(...nodes.map((n) => n.id)) + 1, parent, tag },
  ];
}
export function treeSource(nodes, id = 0, depth = 0) {
  const node = nodes.find((n) => n.id === id);
  if (!node) return "";
  const children = nodes.filter((n) => n.parent === id);
  const indent = "  ".repeat(depth);
  return `${indent}<${node.tag}>${children.length ? "\n" + children.map((n) => treeSource(nodes, n.id, depth + 1)).join("\n") + "\n" + indent : ["h1", "p", "strong", "li"].includes(node.tag) ? "Example text" : ""}</${node.tag}>`;
}
export const reviewCriteria = [
  "Structure",
  "Content and audience",
  "Paths and resources",
  "Keyboard and alternatives",
  "Responsive presentation",
];
