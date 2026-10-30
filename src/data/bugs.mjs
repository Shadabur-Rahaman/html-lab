import { starterFiles, starterCSS } from "./v2Projects.mjs";
const make = (id, title, level, description, hints, breakIt) => {
  const solution = starterFiles("Repair workshop", true);
  const starter = structuredClone(solution);
  breakIt(starter);
  return { id, title, level, description, hints, starter, solution };
};
export const bugs = [
  make(
    "stylesheet",
    "The styles disappeared",
    "Beginner",
    "The page should use the shared stylesheet. Observe the source and inspect its resolved path.",
    [
      "Start in the document head.",
      "Compare the stylesheet href with the actual file tree.",
      "css/styles.css and css/style.css are different paths.",
    ],
    (f) => {
      f["index.html"].data = f["index.html"].data.replace(
        "css/style.css",
        "css/styles.css",
      );
    },
  ),
  make(
    "labels",
    "The label does not focus its input",
    "Beginner",
    "Clicking the email label should identify the email input. The text looks plausible, but the association is broken.",
    [
      "Inspect contact.html.",
      "Compare for and id; name is a different property.",
      "The label says mail while the control id is email.",
    ],
    (f) => {
      f["contact.html"].data = f["contact.html"].data.replace(
        'for="email"',
        'for="mail"',
      );
    },
  ),
  make(
    "case",
    "Works here, fails after upload",
    "Intermediate",
    "A navigation link uses a filename with different capitalization. The virtual file system is deliberately case-sensitive.",
    [
      "Inspect the Home page navigation.",
      "Compare the About link with the exact path in the tree.",
      "About.html is not about.html on a case-sensitive host.",
    ],
    (f) => {
      f["index.html"].data = f["index.html"].data.replace(
        'href="about.html"',
        'href="About.html"',
      );
    },
  ),
  make(
    "extension",
    "A page saved as a text file",
    "Beginner",
    "The home document exists but is not available as the normal root HTML entry page.",
    [
      "Read the complete filename.",
      "A browser page list only includes .html and .htm.",
      "Rename index.html.txt to index.html; moving contents is not required.",
    ],
    (f) => {
      f["index.html.txt"] = f["index.html"];
      delete f["index.html"];
    },
  ),
  make(
    "path",
    "The nested page lost its styles",
    "Intermediate",
    "A nested page refers to css/style.css as though it lived at the root.",
    [
      "Inspect pages/about.html.",
      "Resolve its stylesheet path from the pages folder.",
      "Use ../css/style.css and update its navigation to reach root pages.",
    ],
    (f) => {
      f["pages/about.html"] = f["about.html"];
      delete f["about.html"];
      f["index.html"].data = f["index.html"].data.replace(
        'href="about.html"',
        'href="pages/about.html"',
      );
      f["contact.html"].data = f["contact.html"].data.replace(
        'href="about.html"',
        'href="pages/about.html"',
      );
    },
  ),
  make(
    "overflow",
    "The page is wider than the phone",
    "Practical",
    "At 320px, the main area should fit the viewport. Use the overflow report and change one layout rule.",
    [
      "Choose the 320px preview.",
      "Inspect the last main rule in css/style.css.",
      "Replace an unconditional fixed width with a fitting width or max-width rule.",
    ],
    (f) => {
      f["css/style.css"].data = starterCSS + "\nmain { width: 1200px; }";
    },
  ),
];
const imageBug = make(
  "image",
  "The diagram is not showing",
  "Beginner",
  "The page should show the bundled schematic. Investigate the filename, folder, and case before changing the img element.",
  [
    "Compare the img src with the actual image path in File Explorer.",
    "The folder is images, and the file name uses hyphens and lowercase letters.",
    "Point the image to images/project-diagram.png.",
  ],
  (f) => {
    f["index.html"].data = f["index.html"].data.replace(
      "</main>",
      '<figure><img src="Images/project-diagram.PNG" alt="An original schematic grid" width="240" height="140"><figcaption>Classroom project diagram</figcaption></figure></main>',
    );
  },
);
imageBug.solution["index.html"].data = imageBug.solution[
  "index.html"
].data.replace(
  "</main>",
  '<figure><img src="images/project-diagram.png" alt="An original schematic grid" width="240" height="140"><figcaption>Classroom project diagram</figcaption></figure></main>',
);
bugs.push(imageBug);
