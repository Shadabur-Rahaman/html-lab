import { documentHTML } from "./curriculum.mjs";
import { projectImage } from "./projectImage.mjs";
export const starterCSS = `* { box-sizing: border-box; }\nbody { margin: 0; font: 1rem/1.7 system-ui, sans-serif; color: #24312d; background: #faf7f0; }\nheader, main, footer { max-width: 65rem; margin: auto; padding: 1.5rem; }\nnav { display: flex; flex-wrap: wrap; gap: 1rem; }\na { color: #80512b; }\na:focus-visible, button:focus-visible { outline: 3px solid #286052; outline-offset: 4px; }\n.cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }\narticle { padding: 1.5rem; border: 1px solid #d4d4c4; border-radius: .6rem; background: white; }\nimg { max-width: 100%; height: auto; }\nlabel { display: block; }\ninput, textarea, button { font: inherit; max-width: 100%; margin: .4rem 0; padding: .5rem; }\n@media (min-width: 48rem) { h1 { font-size: 2.5rem; } }`;
const text = (data) => ({ type: "text", data });
const nav =
  '<nav aria-label="Main"><a href="index.html">Home</a><a href="about.html">About</a><a href="contact.html">Contact</a></nav>';
export function styledPage(body, title) {
  return documentHTML(body, title).replace(
    "</head>",
    '  <meta name="description" content="A fictional student website built in HTML LAB.">\n  <link rel="stylesheet" href="css/style.css">\n</head>',
  );
}
export function starterFiles(title = "My first website", filled = false) {
  return {
    "images/project-diagram.png": { ...projectImage },
    "index.html": text(
      styledPage(
        `<header>${nav}</header>\n<main><h1>${title}</h1><p>A fictional learning project.</p>${filled ? '<section><h2>Our work</h2><div class="cards"><article><h3>First project</h3><p>A useful problem, a clear explanation, and an honest result.</p></article><article><h3>Next project</h3><p>Document the process and what you learned.</p></article></div></section>' : ""}</main><footer><p>Learning demonstration. No personal data is collected.</p></footer>`,
        title,
      ),
    ),
    "about.html": text(
      styledPage(
        `<header>${nav}</header><main><h1>About this project</h1><p>Explain who this website helps and why.</p><h2>Skills and approach</h2><ul><li>Clear structure</li><li>Useful content</li><li>Thoughtful testing</li></ul></main>`,
        "About — " + title,
      ),
    ),
    "contact.html": text(
      styledPage(
        `<header>${nav}</header><main><h1>Contact</h1><p>This static form is an interface demonstration; it does not send messages.</p><form><label for="email">Email</label><input id="email" name="email" type="email" required><label for="message">Message</label><textarea id="message" name="message" required></textarea><button type="button">Contact UI demo — no submission service</button></form></main>`,
        "Contact — " + title,
      ),
    ),
    "css/style.css": text(
      filled
        ? starterCSS
        : "/* Add your styles here. HTML supplies the content; CSS changes its presentation. */\nbody { font-family: system-ui, sans-serif; }",
    ),
    "README.md": text(
      "# " +
        title +
        "\n\nFictional educational project. Open index.html in a browser. Add your own licensed images. No backend or real account creation.\n",
    ),
  };
}
const make = (id, title, audience, goal, sections) => ({
  id,
  title,
  audience,
  goal,
  sections,
  requirements: [
    "Three HTML documents with consistent relative navigation",
    "One external CSS file and a layout that works at 320px",
    "A specific title, language, main landmark, and clear headings",
    "Useful text alternatives for any images you add",
    "Keyboard review and an honest boundary for form behavior",
  ],
  steps: [
    "Name your audience and write the main question your site answers.",
    "Outline the three pages and each page’s headings.",
    "Write semantic HTML before styling.",
    "Add the specialty content below; explain choices rather than copying.",
    "Link the external stylesheet and test narrow and wide widths.",
    "Check paths, labels, metadata, and the keyboard experience.",
    "Export a ZIP and follow the publishing guide.",
  ],
  starter: starterFiles(title),
  solution: starterFiles(title, true),
});
export const industryProjects = [
  make(
    "mechanical",
    "Mechanical engineering portfolio",
    "A fictional placement reviewer",
    "Show how a learner approaches engineering problems.",
    [
      "CAD/project showcase",
      "Design process and results",
      "Skills and certifications",
    ],
  ),
  make(
    "civil",
    "Civil project showcase",
    "A fictional community project reviewer",
    "Make a construction case study understandable.",
    [
      "Project gallery",
      "Specifications and materials",
      "A case study with evidence",
    ],
  ),
  make(
    "electrical",
    "Electrical component catalog",
    "A fictional lab technician",
    "Compare components with clearly labeled units.",
    [
      "Component descriptions",
      "Specifications and ratings",
      "Comparison table",
    ],
  ),
  make(
    "department",
    "College department website",
    "Prospective students",
    "Help visitors understand courses and find contact information.",
    [
      "Department overview",
      "Faculty and course information",
      "Accessible timetable",
    ],
  ),
  make(
    "business",
    "Local business website",
    "A fictional neighborhood customer",
    "Explain services and help a visitor choose a next step.",
    [
      "Services and prices",
      "About the business",
      "Gallery and contact information",
    ],
  ),
  make(
    "career",
    "Personal job portfolio",
    "A fictional hiring reviewer",
    "Show relevant evidence of skills without exposing private information.",
    [
      "Education and experience",
      "Project case studies",
      "Resume link and contact links",
    ],
  ),
  make(
    "capstone",
    "Multi-page business capstone",
    "A clearly described customer group",
    "Independently plan, build, test, and prepare a complete site for publication.",
    [
      "A useful homepage",
      "Service details and evidence",
      "Accessible contact page",
    ],
  ),
];
const specialty = {
  mechanical: [
    "Bench fixture design study",
    "A fictional clamp fixture organizes a repeatable drilling task. The case study distinguishes a CAD concept from a manufactured and tested part.",
    "Record the design constraints, model revisions, material assumptions, and what would need physical testing before use.",
    "Skills: dimensional drawings, clear documentation, and communicating trade-offs. Certifications listed here are classroom examples, not real credentials.",
  ],
  civil: [
    "Rain-garden walkway study",
    "A fictional campus walkway proposal considers a clear pedestrian route and drainage. The gallery illustration is a schematic, not a construction drawing.",
    "List the proposed surface materials and the assumptions behind quantities. Real structural and site decisions require qualified review and project evidence.",
    "The case study describes the problem, alternatives, chosen concept, and next investigations without claiming the design has been built.",
  ],
  electrical: [
    "Teaching-lab component directory",
    "This fictional catalog helps a reader compare labeled properties. The example ratings are educational sample data, not instructions for designing or wiring a circuit.",
    "Use a description list for one component and a comparison table when properties align across components. Include units in every relevant label.",
    "A product image should identify the component meaningfully. The bundled diagram only illustrates a catalog layout.",
  ],
  department: [
    "Department of Applied Design",
    "Prospective students can compare course topics, meet fictional faculty, and find a weekly workshop schedule.",
    "Courses: Web Foundations introduces semantic documents; Design Studio explores readable interfaces. Faculty names are fictional examples.",
    "The timetable uses row and column headers. The Contact page is a mockup and does not submit an admission or support request.",
  ],
  business: [
    "Neighborhood repair desk",
    "A fictional service helps visitors understand repair assessments before making an inquiry. The site does not promise a diagnosis or take payment.",
    "Services: an initial assessment, an estimate review, and a maintenance discussion. Prices and availability must be confirmed through a real business process.",
    "The gallery uses an original schematic illustration. Contact information is fictional; no personal customer data is requested or stored.",
  ],
  career: [
    "A learner’s job portfolio",
    "This fictional applicant presents evidence of learning rather than unsupported claims of expertise. Education and experience are clearly labeled as practice material.",
    "Case study: build a readable three-page department site, test its keyboard navigation, record a broken-path fix, and export the working source.",
    "Use an HTML resume page that remains readable on a narrow screen. Contact links use example addresses; do not publish private personal details in a class exercise.",
  ],
  capstone: [
    "A useful service website",
    "This independent capstone helps a clearly described visitor understand a service, read evidence, and choose an appropriate next step.",
    "The About page explains the audience and editorial decisions. Service details describe scope and limitations. The contact interface is explicitly a demonstration.",
    "Before publication, inspect every page at 320px and a wide viewport, use only licensed assets, test the keyboard path, and verify the real provider URL after publishing.",
  ],
};
for (const p of industryProjects) {
  const d = specialty[p.id];
  const articles = p.sections
    .map((s, i) => `<article><h2>${s}</h2><p>${d[i + 1]}</p></article>`)
    .join("");
  const table =
    p.id === "electrical"
      ? '<table><caption>Fictional component comparison — sample data only</caption><thead><tr><th scope="col">Component</th><th scope="col">Example property</th></tr></thead><tbody><tr><th scope="row">Resistor A</th><td>1 kΩ nominal resistance</td></tr><tr><th scope="row">Capacitor B</th><td>10 μF nominal capacitance</td></tr></tbody></table>'
      : p.id === "department"
        ? '<table><caption>Fictional weekly workshop timetable</caption><tr><th scope="col">Day</th><th scope="col">Session</th></tr><tr><th scope="row">Monday</th><td>Web Foundations</td></tr><tr><th scope="row">Wednesday</th><td>Design Studio</td></tr></table>'
        : "";
  p.solution["index.html"].data = styledPage(
    `<header>${nav}</header><main><h1>${d[0]}</h1><p>${p.goal}</p><figure><img src="images/project-diagram.png" alt="An original schematic grid representing a project layout, not a technical design" width="240" height="140"><figcaption>Original classroom illustration. All project details are fictional.</figcaption></figure><div class="cards">${articles}</div>${table}${p.id === "career" ? '<p><a href="resume.html">Read the fictional HTML resume</a></p>' : ""}</main><footer><p>Learning project. No backend, professional certification, or account creation is implied.</p></footer>`,
    p.title,
  );
  p.solution["about.html"].data = styledPage(
    `<header>${nav}</header><main><h1>About this project</h1><h2>Audience and purpose</h2><p>${p.audience}: ${p.goal}</p><h2>Process and review</h2><ol><li>Outline the reader’s questions.</li><li>Write clear content and meaningful markup.</li><li>Test resource paths and keyboard navigation.</li><li>Review the narrow-screen layout and publish only appropriate information.</li></ol><p>${d[1]}</p></main>`,
    "About — " + p.title,
  );
  if (p.id === "career")
    p.solution["resume.html"] = text(
      styledPage(
        `<header>${nav}</header><main><h1>Fictional learner resume</h1><h2>Education</h2><p>Example diploma program — learning demonstration.</p><h2>Project experience</h2><p>Built and reviewed a semantic multi-page static website in HTML LAB.</p><h2>Skills</h2><ul><li>Semantic HTML and labeled forms</li><li>Beginner CSS layouts</li><li>Documenting path fixes and keyboard checks</li></ul><p><a href="contact.html">Contact interface demonstration</a></p></main>`,
        "Resume — fictional learner",
      ),
    );
}
