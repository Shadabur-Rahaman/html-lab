import { documentHTML } from "./curriculum.mjs";
export const extraNotes = {
  h1: [
    "The highest heading level. Name the page clearly and build a logical hierarchy.",
    "id, class",
  ],
  h2: [
    "A second-level heading for a major section under the page heading.",
    "id, class",
  ],
  h3: ["A third-level heading for a subsection of an h2 section.", "id, class"],
  h4: [
    "A fourth-level heading. Use it only when the content hierarchy needs that depth.",
    "id, class",
  ],
  h5: ["A fifth-level heading, for deeply nested content.", "id, class"],
  h6: [
    "The sixth and deepest heading level. Do not choose it just for small text.",
    "id, class",
  ],
  p: [
    "A paragraph of phrasing content. A heading or another paragraph cannot be its child.",
    "id, class",
  ],
  br: [
    "An intentional line break, useful in an address or poem. Void; not a spacing tool.",
    "",
  ],
  hr: [
    "A thematic break between paragraphs or sections. Void; appearance is styled with CSS.",
    "",
  ],
  mark: [
    "Text highlighted for its relevance in the current context, such as a search match.",
    "",
  ],
  small: [
    "Side comments or small print such as a copyright notice. Meaning is not simply font size.",
    "",
  ],
  sub: ["Subscript notation, such as the 2 in H₂O.", ""],
  sup: ["Superscript notation, such as an exponent or footnote marker.", ""],
  del: [
    "Content removed from a document. Pair with ins when showing an edit.",
    "cite, datetime",
  ],
  ins: [
    "Content added to a document. The datetime can describe when the edit occurred.",
    "cite, datetime",
  ],
  q: [
    "A short inline quotation. Browsers usually add quotation punctuation.",
    "cite",
  ],
  blockquote: [
    "An extended quotation from another source. Place attribution outside the quotation.",
    "cite",
  ],
  cite: [
    "The title of a creative work, such as a book or article. Usually not a person’s name.",
    "",
  ],
  abbr: [
    "An abbreviation. Expand it visibly on first use; title is an optional supplement.",
    "title",
  ],
  code: [
    "A fragment of computer code. Escape literal HTML syntax in its text.",
    "",
  ],
  pre: [
    "Preformatted text that preserves whitespace and line breaks. Often contains code.",
    "",
  ],
  ul: [
    "An unordered list whose items do not have an essential sequence. Direct items are li.",
    "",
  ],
  ol: [
    "An ordered list where sequence matters. Each direct list item is li.",
    "start, reversed, type",
  ],
  li: [
    "An item within ul or ol. Nest any child list inside this item.",
    "value (inside ol)",
  ],
  dl: [
    "A list of name-value or term-description groups. Contains dt and dd.",
    "",
  ],
  dt: [
    "A term or name in a description list. Follow with the associated description.",
    "",
  ],
  dd: [
    "The description or value associated with a dt in a description list.",
    "",
  ],
  caption: [
    "The accessible title or caption of a table. Place as a child of table.",
    "",
  ],
  thead: [
    "A group of table header rows. It groups rows; it does not turn td into th.",
    "",
  ],
  tbody: [
    "A group of table body rows. Browsers may insert tbody during parsing.",
    "",
  ],
  tfoot: ["A group of summary or footer rows in a table, such as totals.", ""],
  tr: [
    "A row of table cells. Contains th and td, not arbitrary page layout.",
    "",
  ],
  textarea: [
    "A multiline plain-text control. Its initial content is text between its tags. Label it.",
    "id, name, rows, cols, required, minlength, maxlength",
  ],
  select: [
    "A control for choosing from option elements, optionally grouped with optgroup.",
    "id, name, multiple, required, size",
  ],
  option: [
    "A choice in select or a suggestion in datalist. value is the submitted value.",
    "value, selected, disabled, label",
  ],
  optgroup: [
    "A labeled group of options inside select. The label is not a selectable option.",
    "label, disabled",
  ],
  fieldset: [
    "A group of related form controls. Use legend to name the group.",
    "disabled, form, name",
  ],
  legend: [
    "A caption for a fieldset. Place it first within that fieldset.",
    "",
  ],
  datalist: [
    "Suggested values for an input whose list attribute matches this element’s id. Users can usually type other values.",
    "id",
  ],
  output: [
    "A calculation result. HTML provides the semantics; a script is needed for dynamic calculation.",
    "for, form, name",
  ],
  header: [
    "Introductory content for a page or section. A page-level header can be a banner landmark.",
    "",
  ],
  nav: [
    "A region of major navigation links, not every incidental link group. Label multiple navigation regions distinctly.",
    "aria-label",
  ],
  aside: [
    "Content tangential to the surrounding content, such as related resources.",
    "aria-label",
  ],
  footer: [
    "Closing information for its nearest section or page. It need not sit visually at the bottom.",
    "",
  ],
  address: [
    "Contact information for the relevant article or document author. Not every postal address belongs here.",
    "",
  ],
  search: [
    "A region containing controls or content related to search or filtering. This is a modern addition; check target browsers.",
    "aria-label",
  ],
};
export const elementChapter = {
  Document: 3,
  Text: 4,
  "Links & images": 5,
  Lists: 6,
  Tables: 6,
  Forms: 7,
  "Semantic layout": 8,
  "Media & interactive": 9,
  Historical: 2,
};
const table =
  '<table><caption>Workshop attendance</caption><thead><tr><th scope="col">Day</th><th scope="col">Learners</th></tr></thead><tbody><tr><th scope="row">Monday</th><td>12</td></tr></tbody><tfoot><tr><th scope="row">Total</th><td>12</td></tr></tfoot></table>';
const form =
  '<form><fieldset><legend>Learning preferences</legend><label for="name">Name</label><input id="name" name="name" required><label for="topic">Topic</label><select id="topic" name="topic"><optgroup label="Web"><option value="html" selected>HTML</option><option value="css">CSS</option></optgroup></select><label for="notes">Notes</label><textarea id="notes" name="notes" rows="3">I want to build a website.</textarea><label for="book">Book suggestion</label><input id="book" name="book" list="books"><datalist id="books"><option value="Field guide"><option value="Web notes"></datalist><p>Example result: <output name="result">12</output> (static; no calculation script)</p><button type="submit">Submit demo</button></fieldset></form>';
const samples = {
  html: "<h1>A complete document</h1><p>Inspect the html root, head metadata, and body in the DOM Explorer.</p>",
  head: "<h1>Metadata lives in head</h1><p>Change title in the editor and inspect the document tree.</p>",
  body: "<h1>The visible document</h1><p>Page content lives in body.</p>",
  title:
    "<h1>Tab title and page heading</h1><p>Inspect head > title to find the document title.</p>",
  meta: "<h1>Metadata example</h1><p>Inspect charset and viewport in head.</p>",
  link: '<h1>External resources</h1><p>Example source: &lt;link rel="stylesheet" href="styles.css"&gt;. External stylesheets are blocked in this isolated preview.</p>',
  style:
    "<style>h1{color:coral}</style><h1>CSS changes appearance</h1><p>HTML still supplies the structure.</p>",
  p: "<h1>Related thoughts</h1><p>A paragraph groups a connected idea.</p><p>A second idea starts another paragraph.</p>",
  br: "<h1>A short address</h1><p>12 Garden Road<br>Example Town</p>",
  hr: "<h1>Journal</h1><p>Morning observations.</p><hr><p>A new theme: evening sounds.</p>",
  strong: "<p><strong>Warning:</strong> this route is closed.</p>",
  em: "<p>I <em>really</em> want to learn HTML.</p>",
  b: "<p>The guide highlights <b>key terms</b> without declaring urgency.</p>",
  i: '<p>The term <i lang="la">Homo sapiens</i> is a scientific name.</p>',
  mark: "<p>Search result: Learn <mark>HTML</mark> by building.</p>",
  small:
    "<p>Workshop admission is free.</p><small>Materials are limited to one set per attendee.</small>",
  sub: "<p>Water is H<sub>2</sub>O.</p>",
  sup: "<p>Area is measured in m<sup>2</sup>.</p>",
  del: '<p>Meeting: <del datetime="2026-10-01">4 November</del> <ins>5 November</ins>.</p>',
  ins: '<p><del>Draft</del> <ins datetime="2026-10-29">Published</ins></p>',
  q: "<p>Our motto is <q>Build to understand.</q></p>",
  blockquote:
    "<blockquote><p>Observation is the beginning of a useful question.</p></blockquote><p>— A fictional teaching note</p>",
  cite: "<p>Read <cite>The Field Notebook</cite>, a fictional guide.</p>",
  abbr: '<p><abbr title="HyperText Markup Language">HTML</abbr> means HyperText Markup Language.</p>',
  code: "<p>Use <code>&lt;p&gt;</code> for a paragraph.</p>",
  pre: "<pre><code>&lt;h1&gt;Hello&lt;/h1&gt;\n  &lt;p&gt;Indented source&lt;/p&gt;</code></pre>",
  a: '<h1>A document with destinations</h1><a href="#notes">Read the notes</a><section id="notes"><h2>Notes</h2><p>Fragments navigate inside a document.</p></section>',
  img: '<figure><img src="./small.svg" alt="Two coral hills beneath a pale sun" width="320" height="180"><figcaption>A simple landscape illustration.</figcaption></figure>',
  figure:
    '<figure><img src="./small.svg" alt="Two coral hills beneath a pale sun" width="320" height="180"><figcaption>A simple landscape illustration.</figcaption></figure>',
  figcaption:
    '<figure><img src="./small.svg" alt="Two coral hills beneath a pale sun" width="320" height="180"><figcaption>Figure 1: a landscape study.</figcaption></figure>',
  ul: "<h1>Things to bring</h1><ul><li>Notebook</li><li>Water</li></ul>",
  ol: '<h1>Prepare for class</h1><ol start="1"><li>Open the lab</li><li>Read the task<ul><li>Predict</li><li>Experiment</li></ul></li><li>Build</li></ol>',
  li: "<ul><li>A parent item<ul><li>A nested item</li></ul></li></ul>",
  dl: "<dl><dt>HTML</dt><dd>Structure and meaning</dd><dt>CSS</dt><dd>Presentation and layout</dd></dl>",
  dt: "<dl><dt>Browser</dt><dd>A client that retrieves and displays web resources.</dd></dl>",
  dd: "<dl><dt>Hypertext</dt><dd>Text connected by navigable links.</dd></dl>",
  header:
    '<header><h1>Field journal</h1><nav><a href="#notes">Notes</a></nav></header><main id="notes"><p>A page with signposts.</p></main>',
  nav: '<nav aria-label="Main"><a href="#about">About</a> <a href="#work">Work</a></nav><main><h1>My page</h1><section id="about"><h2>About</h2></section><section id="work"><h2>Work</h2></section></main>',
  main: "<header><p>Field journal</p></header><main><h1>Today’s observations</h1><p>The dominant content belongs here.</p></main><footer>Learning demo</footer>",
  section:
    "<main><h1>Field guide</h1><section><h2>Birds</h2><p>A thematic group.</p></section></main>",
  article:
    "<main><h1>Community journal</h1><article><h2>Our first harvest</h2><p>This story can stand on its own.</p></article></main>",
  aside:
    '<main><h1>Planting guide</h1><p>The main guide goes here.</p><aside><h2>Related reading</h2><a href="#book">A local field guide</a></aside></main>',
  footer:
    "<main><h1>Journal</h1></main><footer><p>Written for the nature club.</p></footer>",
  address:
    '<article><h1>A field guide</h1><p>Our latest observations.</p><address>Contact the author: <a href="mailto:alex@example.com">Alex</a></address></article>',
  div: '<div class="layout-wrapper"><h1>Generic grouping</h1><p>The wrapper has no extra semantic meaning.</p></div>',
  span: '<p>Our current topic is <span class="topic">HTML</span>.</p>',
  search:
    '<search aria-label="Site search"><form><label for="q">Search the guide</label><input id="q" name="q" type="search"><button>Search</button></form></search>',
  audio:
    '<h1>Audio example</h1><audio controls src="./tone.wav"></audio><p>A one-second generated 440 Hz tone.</p>',
  video:
    '<h1>Video example</h1><video controls width="320"><source src="./flower.mp4" type="video/mp4"><track src="./captions.vtt" kind="captions" srclang="en" label="English"></video><p>A silent close-up of flowers moving in the breeze. CC0 sample from MDN.</p>',
  source:
    '<audio controls><source src="./tone.wav" type="audio/wav"></audio><p>The source is a one-second generated tone.</p>',
  track:
    '<video controls width="320"><source src="./flower.mp4" type="video/mp4"><track src="./captions.vtt" kind="captions" srclang="en" label="English"></video><p>Silent flowers moving in the breeze; captions describe the visual study.</p>',
  picture:
    '<picture><source media="(min-width: 600px)" srcset="./wide.svg"><img src="./small.svg" alt="Coral hills beneath a pale sun" width="320" height="180"></picture>',
  iframe:
    '<h1>Separate document</h1><pre>&lt;iframe title="Greeting" sandbox srcdoc="&amp;lt;p&amp;gt;Hello&amp;lt;/p&amp;gt;"&gt;&lt;/iframe&gt;</pre><p>For safety, nested frames are removed in this lab. Download this code to explore a standalone embed.</p>',
  details:
    "<details><summary>What is HTML?</summary><p>A language for marking up the structure and meaning of content.</p></details>",
  summary:
    "<details open><summary>What should I bring?</summary><p>A notebook and curiosity.</p></details>",
  progress:
    '<label for="done">Lessons completed</label><progress id="done" max="12" value="4">4 of 12</progress>',
  meter:
    '<label for="battery">Battery level</label><meter id="battery" min="0" max="100" value="72">72%</meter>',
  dialog:
    "<h1>Nonmodal dialog example</h1><dialog open><p>This uses the open attribute. A modal dialog uses showModal() through JavaScript.</p></dialog>",
  time: '<p>Class begins on <time datetime="2026-11-05T10:00:00+05:30">5 November at 10:00 IST</time>.</p>',
  data: '<p>Product: <data value="SKU-104">Everyday notebook</data></p>',
  font: '<h1>Historical example — obsolete</h1><font color="red">Old presentation markup</font><p>Modern equivalent: use a class and CSS color.</p>',
  center:
    "<h1>Historical example — obsolete</h1><center>Old centered content</center><p>Modern equivalent: CSS text-align: center.</p>",
  frameset:
    '<h1>Historical example — obsolete</h1><pre>&lt;frameset cols="20%,80%"&gt;\n  &lt;frame src="menu.html"&gt;\n  &lt;frame src="content.html"&gt;\n&lt;/frameset&gt;</pre><p>Use semantic HTML regions and CSS layout in a modern document.</p>',
};
export function elementExample(tag, category) {
  let body = samples[tag];
  if (/^h[1-6]$/.test(tag)) {
    const n = +tag[1];
    body =
      Array.from(
        { length: n },
        (_, i) =>
          `<h${i + 1}>Level ${i + 1}: ${i === n - 1 ? "the selected heading" : "parent topic"}</h${i + 1}>`,
      ).join("\n") + "<p>Heading levels describe the content hierarchy.</p>";
  }
  if (category === "Tables") body = table;
  if (category === "Forms") body = form;
  return documentHTML(
    body || "<h1>HTML example</h1>",
    "The " + tag + " element",
  );
}
