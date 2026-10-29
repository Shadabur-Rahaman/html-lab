import { documentHTML, lessons } from "./curriculum.mjs";
const additions = {
  web: '<h1>From client to server</h1><p>A browser is a client that requests resources from a server.</p><a href="https://example.com/">An example website</a>',
  markup:
    "<h1>My field notes</h1><p>I am learning HTML.</p><p>Markup adds meaning.</p><ol><li>Build a page</li><li>Check its structure</li></ol>",
  layers:
    '<h1>Reading club</h1><p>Welcome, reader.</p><a href="https://example.com/books">Browse books</a><button type="button">Join club UI demo</button>',
  origins:
    '<h1>Research directory</h1><p>Connected information.</p><ul><li><a href="https://info.cern.ch/">The first website</a></li><li><a href="https://www.w3.org/">W3C</a></li><li><a href="https://html.spec.whatwg.org/">HTML standard</a></li></ul>',
  versions:
    "<h1>Structure and presentation</h1><p><strong>Use meaningful elements.</strong></p><p>Style their appearance with CSS.</p>",
  living:
    "<main><article><h1>A living web</h1><p>The standard evolves continuously.</p></article></main>",
  document:
    "<h1>Hello, web!</h1><p>This is my first document.</p><p>I can edit the source and inspect the result.</p>",
  syntax:
    '<section><h1>Garden journal</h1><p>Day one<br>Read the <a href="https://example.com/guide">planting guide</a>.</p><hr></section>',
  nesting:
    "<main><h1>My notes</h1><section><h2>Today</h2><p>A clearly nested paragraph.</p></section></main>",
  headings:
    "<h1>Field guide</h1><h2>Birds</h2><h3>At dawn</h3><p>Listen carefully.</p><hr><h2>Plants</h2><h3>In the garden</h3><p>Observe leaf shapes.</p>",
  meaning:
    '<p><abbr title="HyperText Markup Language">HTML</abbr> means HyperText Markup Language.</p><p>Workshop date: <del>4 November</del> <ins>5 November</ins>.</p><p><strong>Bring water.</strong> I <em>really</em> enjoy fieldwork.</p>',
  entities:
    '<h1>Code notes</h1><pre><code>&lt;a href="/"&gt;Home&lt;/a&gt;</code></pre>',
  links:
    '<nav><a href="#contact">Contact</a></nav><h1>My portfolio</h1><section id="contact"><h2>Contact</h2><a href="https://example.com/" target="_blank" rel="noopener">Visit the studio (new tab)</a></section>',
  paths:
    '<h1>About this project</h1><p>This file would live in pages/.</p><a href="../index.html">Return to the homepage</a>',
  images:
    '<h1>A color study</h1><figure><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22120%22%3E%3Crect width=%22240%22 height=%22120%22 fill=%22coral%22/%3E%3C/svg%3E" width="240" height="120" alt="A solid coral rectangle"><figcaption>A study of a warm accent color for our journal.</figcaption></figure>',
  lists:
    "<h1>Field notebook</h1><ol><li>Fold paper.</li><li>Add sections:<ul><li>Birds</li><li>Plants</li></ul></li><li>Record observations.</li></ol><dl><dt>Habitat</dt><dd>A species’ natural home.</dd><dt>Canopy</dt><dd>The upper layer of trees.</dd></dl>",
  tables:
    '<table><caption>Workshop timetable</caption><thead><tr><th scope="col">Day</th><th scope="col">Topic</th></tr></thead><tbody><tr><th scope="row">Monday</th><td>HTML</td></tr><tr><th scope="row">Tuesday</th><td>Forms</td></tr><tr><th scope="row">Wednesday</th><td>Project</td></tr></tbody></table>',
  spans:
    '<table><caption>Study schedule</caption><tr><th scope="col">Day</th><th scope="col">Morning</th><th scope="col">Afternoon</th></tr><tr><th scope="row">Friday</th><td colspan="2">Workshop</td></tr><tr><th scope="row">Sunday</th><td colspan="2">Independent project</td></tr></table>',
  controls:
    '<form><fieldset><legend>Workshop</legend><label for="day">Date</label><input id="day" name="day" type="date"><label><input type="checkbox" name="updates">Optional updates</label><label for="email">Email</label><input id="email" name="email" type="email" required><button>Submit demo</button></fieldset></form>',
  validation:
    '<form><label for="age">Age (12–100)</label><input id="age" name="age" type="number" min="12" max="100" required><label for="code">Course code</label><input id="code" name="code" value="HTML" readonly><button>Check details</button></form>',
  submission:
    '<form action="/contact" method="post"><label for="note">Your message</label><textarea id="note" name="note" required></textarea><button type="submit">Send message</button></form><p>A real endpoint is needed to process this.</p>',
  landmarks:
    '<header><nav><a href="#about">About</a></nav></header><main><h1>Field Notes</h1><section id="about"><h2>About</h2><p>A community journal.</p></section></main><footer>Learning demonstration</footer>',
  sections:
    "<main><h1>Community journal</h1><article><h2>Our first harvest</h2><section><h3>What we learned</h3><p>Water consistently.</p></section></article><article><h2>New seedlings</h2><p>Our next season begins.</p></article></main>",
  outline:
    '<a href="#content">Skip to content</a><main id="content" tabindex="-1"><h1>My portfolio</h1><section><h2>Skills</h2><ul><li>HTML</li></ul></section><section><h2>Projects</h2><p>A field journal.</p></section></main>',
  media:
    '<h1>Sound lesson</h1><audio controls src="./tone.wav"></audio><p>A short generated tone.</p><audio controls src="./tone.wav"></audio><p>A second player for comparison.</p><video controls><source src="./flower.mp4" type="video/mp4"><track kind="captions" src="./captions.vtt" srclang="en" label="English"></video><p>Silent flowers moving in the breeze. CC0 sample from MDN.</p>',
  responsive:
    '<h1>Safe embed</h1><picture><img src="./small.svg" alt="Students around a table"></picture><iframe title="A short greeting document" sandbox loading="lazy" srcdoc="&lt;p&gt;Hello!&lt;/p&gt;"></iframe><p>The image uses a bundled asset. Nested frames are blocked in this lab.</p>',
  modern:
    '<h1>Workshop</h1><details><summary>What should I bring?</summary><p>A notebook.</p></details><details><summary>Where do we meet?</summary><p>At the library.</p></details><label for="done">Course completion</label><progress id="done" value="6" max="12">6 of 12</progress><label for="storage">Storage used</label><meter id="storage" min="0" max="100" value="30">30%</meter>',
  attributes:
    '<h1>Attribute lab</h1><p id="note" class="featured" data-topic="HTML">A note with metadata.</p>',
  dom: "<main><h1>Reading tree</h1><ul><li>Read</li><li><strong>Build</strong> something useful.</li></ul></main>",
  repair:
    "<p>Before the heading</p><h2>Now a sibling</h2><p>After the heading</p>",
  accessible:
    '<main><h1>Contact</h1><form><label for="email">Email</label><input id="email" name="email" type="email"><button>Send demo</button></form><a href="https://example.com/help">Read contact help</a></main>',
  metadata:
    "<h1>River College admissions</h1><p>Explore entry requirements.</p>",
  audit:
    '<main><h1>Contact the workshop</h1><label for="contact">Your message</label><input id="contact" name="contact"><img src="missing.jpg" alt="Workshop room layout; image currently unavailable"></main>',
  planning:
    "<main><h1>Alex — Web learner</h1><section><h2>Skills</h2><ul><li>HTML</li></ul></section><section><h2>Projects</h2><article><h3>Field journal</h3><p>A local nature directory.</p></article></section></main>",
  integration:
    '<main><h1>Everyday notebook</h1><section><h2>Reviews</h2><article><h3>Useful for notes</h3><p>A fictional review.</p></article><article><h3>Easy to carry</h3><p>Another fictional review.</p></article></section><form><label for="q">Quantity</label><input id="q" name="quantity" type="number" min="1"><button type="button">Cart UI demo</button></form></main>',
  review:
    '<main><h1>Review checklist</h1><ul><li>Meaningful headings</li><li>Labels</li><li>Alt text</li><li>Working paths</li><li>Keyboard order</li><li>Narrow-screen rendering</li><li>Specific title</li><li>Correct language</li></ul><details><summary>Next step</summary><p>Learn CSS.</p></details><a href="https://shadabur-rahaman.github.io/js-lab/">Continue to JS LAB</a></main>',
};
export function solutionFor(id) {
  let html = documentHTML(
    additions[id] || "<h1>My page</h1><p>A meaningful document.</p>",
    id === "metadata"
      ? "Admissions — River College"
      : lessons.find((l) => l.id === id)?.title || "HTML exercise",
  );
  if (id === "metadata")
    html = html.replace(
      "</head>",
      '  <meta name="description" content="Explore courses and admission requirements at River College.">\n</head>',
    );
  return html;
}
