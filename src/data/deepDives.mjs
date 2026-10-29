export const deepDives = {
  web: [
    "Follow the whole journey",
    "When you open a college course page, the browser does not ask for a picture of the website. It asks for a resource. The HTML response names content and may reference other resources, which can require further requests. A 404 response means the requested resource was not found; it does not mean the Internet stopped working. HTTPS protects the connection using TLS, while HTTP defines request and response semantics. A local file opened with file: skips the usual web-server request, which is why some features behave differently locally.",
    "Explain how a browser could display a saved page while offline, and which linked resources might still be missing.",
  ],
  markup: [
    "Read the example as meaning",
    "In the field-notes example, h1 identifies the document’s main subject, p introduces the learner, and ul groups related goals. Those relationships remain even if CSS makes the heading small and the list items appear in a row. Change ul to ol when the goals become a sequence of steps. The tags are instructions about meaning, not words the reader is meant to see. To display a literal tag in teaching material, escape its less-than sign rather than writing it as active markup.",
    "Build the same content as a recipe. Decide which information becomes an ordered list and explain why.",
  ],
  layers: [
    "Separate the responsibilities",
    "Imagine a product card. HTML supplies its name, image alternative, description, price, and a real button. CSS can make that card compact on a phone and wide on a desktop. JavaScript can update a cart when the button is activated. Some behavior needs no script: a link already navigates, details already expands, and a required email field can already reject a missing value. The useful distinction is programmable application logic, not the mistaken claim that HTML has no interactive behavior at all.",
    "List three native HTML interactions and one interaction that needs programmable logic.",
  ],
  origins: [
    "Why links were the breakthrough",
    "A research document can mention another document without copying it. A hyperlink turns that reference into a navigable connection. That small idea scales from a few scientific notes to a distributed web of independently hosted resources. The first website described the Web project itself and linked to its people, software, and help. Its current preservation is useful evidence, but a page viewed in a modern browser is not a perfect reproduction of the original machine, browser interface, fonts, or network conditions.",
    "Create a research directory with three destinations and a sentence explaining why each link is useful.",
  ],
  versions: [
    "Keep syntax and parsing distinct",
    "XHTML is an especially useful debugging lesson. A document can look like XML while being handled by the HTML parser because the server sends text/html. Conversely, an XML media type invokes XML rules, where malformed nesting is a parsing error instead of ordinary HTML recovery. For modern HTML authoring, keep tags consistently lowercase and quote values for readability, while remembering those conventions do not change the response media type. Historical doctypes and framesets belong in historical study, not a new page’s starter template.",
    "Compare a normal br element with XHTML-style br slash syntax, and explain why the slash does not select a parser.",
  ],
  living: [
    "A milestone is not a support guarantee",
    "HTML5 was a major publication milestone, while the actual browser platform continued changing before and after it. An element being described in a current specification does not mean an older browser knows it. When choosing a newer feature, check its documentation and target browsers, then decide whether the page still communicates its content if that feature is unavailable. Learn elements by their meaning and current behavior; memorizing an invented future version number does not help you build interoperable documents.",
    "Choose one modern element in the catalog and identify a usable fallback or a way to test its implementation.",
  ],
  document: [
    "Read every line of the boilerplate",
    'The doctype is a declaration, not an ordinary element or an HTML version counter. html is the root element; lang="en" declares English for language-sensitive tools. head contains information about the document. meta charset="UTF-8" tells the parser the character encoding. The viewport declaration helps narrow-screen browsers use the intended viewport. title names the document in the tab and other contexts. body contains the page’s content. The visible h1 and the tab title can differ while describing the same subject. Save edits before refreshing a locally opened file.',
    "Create a second document about another subject. Give it a specific title and a different visible h1, then explain the job of each.",
  ],
  syntax: [
    "Trace the nesting by hand",
    "Read an opening tag as entering a container and its closing tag as leaving it. A link inside a paragraph must close before the paragraph closes. Whitespace between attributes separates their names; quotes delimit a value that may contain spaces. A void element has no content and no end tag, so img and br cannot wrap a caption or sentence. Attributes belong in the opening tag. Comments can explain a decision to another author, but browsers still deliver comments to visitors, so they are unsuitable for private notes or credentials.",
    "Annotate the parent, child, and sibling relationships in a document containing a section, heading, paragraph, and link.",
  ],
  nesting: [
    "Inspect what the browser actually made",
    "Indentation helps a human see intended relationships but does not determine the DOM. A deeply indented heading can still become a sibling when the parser closes a paragraph before it. In the tree explorer, expand body, select the heading, and inspect its parent. Then select a paragraph’s text node and compare it with an element node. A page can display convincingly while its DOM differs from your plan. Fix the source rather than relying on recovery, and check the resulting structure again.",
    "Create one intentionally malformed paragraph containing a heading, predict the tree, then rewrite it into three clear siblings.",
  ],
  headings: [
    "Make the outline tell the story",
    "Read only the headings of the field guide. “Field guide → Birds → At dawn → Plants” tells you where each piece belongs without reading every sentence. If an h3 introduces a major peer of Birds, it is at the wrong level even if the font size looks attractive. Paragraphs group ideas; line breaks keep text within the same paragraph. A thematic break says that the subject has shifted. CSS can add margins, borders, and visual size without changing those semantic relationships.",
    "Write a résumé outline with a page heading, Education and Experience sections, and one subsection under each.",
  ],
  meaning: [
    "Ask what you intend to communicate",
    "A warning deserves strong because the content is important, not because bold looks good. In “I really enjoy fieldwork,” em can identify the word you would stress when speaking. A scientific name can use i without implying emphasis. A search result can use mark to identify the matched phrase without declaring it urgent. Several of these elements may look alike under default styles, so explain the reason for your choice before you style it. A quotation should also remain distinguishable from your own words, with useful attribution nearby.",
    "Write two sentences that look similar but need different elements: one warning and one technical term. Explain the difference.",
  ],
  entities: [
    "Display source without executing its markup",
    'A tutorial about anchors needs the reader to see <a href="/">, not to receive an accidental hyperlink. Encoding the less-than sign as &lt; makes it text. code marks the text as a code fragment; pre preserves its indentation and newlines. The combination is useful for examples, but a very long unbroken code line may still overflow on a narrow screen and needs thoughtful presentation. Use actual UTF-8 characters for ordinary prose when practical. Do not use a row of non-breaking spaces as a substitute for layout.',
    "Show a complete form element as escaped source, then place a real form beside it to explain the difference.",
  ],
  links: [
    "Match the control to the destination",
    "An anchor with a fragment can navigate to a matching id in the same page. An anchor with a relative file path can navigate to another document. mailto and tel ask the device to use a configured application, so behavior varies across environments. A button should be used for actions such as opening a tool or submitting a form. In the isolated lab, external navigation is intentionally disabled; inspect the href in the DOM or test the exported page to follow it. Do not promise that a new tab will always appear in the same way on every device.",
    "Create navigation for About, Work, and Contact sections. Make each link’s destination exist, then test the exported document.",
  ],
  paths: [
    "Resolve paths from the current document",
    "Start with the URL of the document doing the linking. Remove its filename to identify the current directory. Each ../ removes one directory level; then append the remaining resource path. A leading slash instead starts at the origin root. On a project-hosted site, /images/photo.svg can therefore point outside the project’s subdirectory. A query string or fragment does not change the file’s directory. Check spelling, capitalization, and whether the file actually exists before assuming the img or anchor element is broken.",
    "Draw a folder tree with pages/contact.html and assets/icons/mail.svg. Calculate the path from the contact page to the icon.",
  ],
  images: [
    "Write an alternative for the task",
    "The same photo can need different alternatives in different contexts. In a biography, identify the person when that is useful. In a decorative banner, an empty alternative avoids unnecessary repetition. In a chart, summarize the message and provide the underlying data nearby; a short alt alone may not be sufficient. Width and height reserve an aspect ratio but do not replace responsive CSS. An img is void, so put its visible caption in a sibling figcaption inside figure rather than trying to nest text inside the image.",
    "Describe how the alternative changes when a landscape is the subject of an article versus a purely decorative border.",
  ],
  lists: [
    "Membership, sequence, or definition?",
    "Ask whether rearranging the items changes the meaning. If it does, an ordered list is often appropriate. If it does not, an unordered list may fit. A glossary needs terms and their descriptions, so use dl, dt, and dd rather than pretending the definitions are unrelated bullet points. A nested list belongs inside the item it elaborates. This makes the relationship explicit and keeps the tree meaningful. Changing bullet shape with CSS does not convert an unordered group into a sequence.",
    "Write a restaurant menu as grouped items, a preparation method as steps, and a short food glossary as term-description pairs.",
  ],
  tables: [
    "Follow one data cell to its headers",
    "In the timetable, “HTML” is meaningful because its row says Monday and its column says Topic. th and scope express those relationships. caption gives the whole table a name. thead, tbody, and tfoot group rows; they do not replace cell headers. A total belongs in a footer group when that organization helps. If every cell is just a piece of page layout, the data model is wrong for a table. Use CSS layout for positioning and preserve a sensible source order.",
    "Create a marksheet with subject row headers, score column headers, units, and a caption that identifies the class and period.",
  ],
  spans: [
    "Count the occupied grid slots",
    'Imagine each row as a fixed number of slots. A header for Day takes one slot, and a colspan="2" activity takes two more. Do not add another cell for a slot already covered by the span. A rowspan covers positions in later rows, so those rows need fewer explicitly written cells. These rules describe the table’s logical model, not a general page layout. As spans multiply, header associations become harder to follow. Prefer two simple tables when one complicated table obscures the relationships.',
    "Sketch a three-column timetable on paper before writing it. Add one two-period activity, then check every row’s occupied slots.",
  ],
  controls: [
    "A label, an identity, and a submitted key",
    "The label’s for value matches the control’s id so people and software can identify the control. name has a different job: it becomes the submitted field key. Multiple radio inputs share one name to form a choice group, while each explicit label still needs its own matching id. Checkboxes represent independent selections unless the question says otherwise. A file input selects files; it does not upload them by itself. Use fieldset and legend for related questions so the group has a clear name as well as individually labeled controls.",
    "Build a preferred-session question using three radio choices and an optional updates checkbox. Explain why the radios share a name.",
  ],
  validation: [
    "Test constraints as a user would",
    "Start with an empty required field and attempt to submit. Then try a malformed email and an out-of-range number. Observe that the browser checks validity before a normal form submission. pattern checks the entire value against its pattern; it needs clear visible instructions. Do not silently impose a narrow format on international names or phone numbers. A readonly control communicates a value that can still be submitted; a disabled control is usually excluded. A server must recheck everything because a client can bypass or change these constraints.",
    "Write a visible instruction for a three-letter code, try two and four letters, and compare readonly with disabled in a conceptual request.",
  ],
  submission: [
    "Follow successful controls into a request",
    "A named enabled text field usually contributes its current value. Unchecked checkboxes do not contribute a checkbox value, and a file upload requires appropriate server handling and encoding, often multipart/form-data. GET makes a retrieval request with fields in the query string; POST sends a body for processing. Neither method makes HTML into an account system. Do not put sensitive information into a demonstration URL. This lab shows illustrative requests and blocks actual submissions so students can investigate structure without sending personal data.",
    "Explain which fields would be omitted from a request containing one disabled input and one unchecked checkbox.",
  ],
  landmarks: [
    "Give every region a useful purpose",
    "The header introduces the page, nav exposes major destinations, main holds the dominant content, and footer closes the document. An aside can contain useful related reading without interrupting the main narrative. A header inside an article introduces that article, so its context differs from the page-level header. Use one visible main as the default page structure and keep repeated navigation outside it. If a container exists only to style a row of cards, a div may be more honest than inventing a section with no thematic purpose.",
    "Inspect a college homepage and propose a landmark map before writing any layout CSS.",
  ],
  sections: [
    "Use independence as a practical test",
    "A community journal can contain several article elements because each story has its own topic and can be read independently. Inside a story, a What we learned section is a thematic subdivision. It is not necessarily an independent article. A layout wrapper around an image and text may simply be a div. Add headings where they help name the thematic groups; do not mechanically create a new section for every visual box. The same semantic structure can support many different CSS layouts without changing its meaning.",
    "Turn two project cards into independent project articles, then identify any wrapper that should remain a plain div.",
  ],
  outline: [
    "Test the page without visual decoration",
    'A heading outline is useful only if it matches the actual content relationships. The top-level page heading introduces the whole document; major topics use h2; subdivisions use h3. Inserting section does not make every nested h1 a safe automatic outline. A skip link should point to a real destination such as main id="content". tabindex="-1" allows that destination to receive focus without adding another stop to the usual Tab sequence. Test the link instead of assuming that its presence is sufficient.',
    "Read a page using only its headings and links. Rewrite any heading that says little about the content beneath it.",
  ],
  media: [
    "Resources and alternatives are part of the feature",
    "A video element without a reachable media file is only an empty player. A track without a valid WebVTT file is only a promise of captions. The bundled example uses a real silent flower video and a nearby text description. For speech content, captions must include the words and relevant sounds; a transcript and audio description may also be needed depending on the material. controls lets the visitor choose playback. Avoid autoplay and test both the media format and the alternatives in target browsers.",
    "Plan alternatives for a cooking demonstration that contains narration, a timer sound, and important visual steps.",
  ],
  responsive: [
    "Art direction and resolution are different",
    "picture can choose a composition using source media conditions: a wide landscape for a large viewport and a tighter crop for a phone. srcset with width descriptors instead offers multiple resolutions of the same intended image, while sizes helps the browser estimate its display width. A source choice still ends with an img carrying the text alternative. An iframe has a different job: embedding a separate document. Its sandbox limits capabilities; an iframe title helps people identify the embedded content. This lab blocks nested embeds and shows their markup for study.",
    "Explain why changing an image’s alt on every viewport is usually unnecessary when all crops communicate the same information.",
  ],
  modern: [
    "Choose the indicator that matches the meaning",
    "A progress bar answers “how much of the task is complete?” A meter answers “where does this measurement sit within its range?” A task may be indeterminate, so progress can omit value. A measurement still needs a known scale. details and summary provide native disclosure behavior without a custom click handler. dialog open creates a nonmodal dialog; it is not equivalent to showModal(), which requires JavaScript and has additional focus and interaction behavior. time and data pair readable text with machine-oriented values.",
    "Compare a download, battery level, and temperature reading. Choose progress or meter for each and explain the scale.",
  ],
  attributes: [
    "Observe properties rather than guessing",
    'A class may contain several names, so class="title featured" puts one element in two groups. An id should identify only one element in the document. data-topic="HTML" attaches string metadata but does not create behavior on its own. contenteditable changes whether a person can edit the displayed content; those edits do not automatically rewrite the source file or persist to a server. hidden removes content from normal presentation, while direction and language describe different properties. Setting dir="rtl" does not translate the words.',
    "Make a paragraph editable, reload the preview, and explain why the typed text did not become a saved website update.",
  ],
  dom: [
    "Count nodes, then count elements",
    "In “Hello <em>curious</em> learner,” the paragraph has a text node, an em element, and another text node. Its childNodes count is therefore different from its element children count. Attributes describe an element but do not appear as ordinary child text. The tree explorer lets you select both kinds of nodes and see their parent. Developer tools inspect the current DOM, which can also be changed later by scripts. View Source usually shows the original response source, so the two views answer different debugging questions.",
    "Write a paragraph with two inline emphasis elements and predict the number of text and element children before inspecting it.",
  ],
  repair: [
    "Recovery is useful, but not a design tool",
    "The browser’s error recovery keeps imperfect pages usable. It does not preserve every relationship the author imagined. A paragraph closes before a heading, and a table can receive an inserted tbody even if the source omitted it. Content in an inappropriate table position may move elsewhere during parsing. Inspecting only the recovered DOM loses some evidence of the original mistake. Compare source, intended relationships, and actual tree; use a broader conformance checker when you need source-level diagnostics.",
    "Explain why a DOM check that finds a heading cannot prove that the heading was correctly nested in the source.",
  ],
  accessible: [
    "Test one complete task with a keyboard",
    "Choose a task such as finding a course and filling a contact form. Tab through its links and controls in a logical order, keep the focus indicator visible, and verify that labels name the controls. Activate links with Enter and buttons with Enter or Space. A native element supplies important behavior, but the surrounding text can still be confusing. Review image alternatives and heading relationships too. An automated report can find some omissions; it cannot replace testing whether a person can understand and complete the task.",
    "Review a contact form without using a mouse. Record the first unclear label, confusing destination, or missing focus indication.",
  ],
  metadata: [
    "A document needs a useful identity",
    "Imagine five tabs all called Home. A specific title such as Admissions — River College is more helpful. A description summarizes the page for systems that may display a snippet, but those systems can choose another text. The visible h1 should also describe the page for its reader. Keep the character encoding and language accurate, and make the content useful before optimizing its metadata. Search engines use many signals outside this HTML lesson; no tag checklist can promise a ranking or a particular search-result appearance.",
    "Write distinct titles and descriptions for a college home page, course page, and application instructions page.",
  ],
  audit: [
    "Fix the highest-impact issue first",
    "Start by asking what the page is for. A missing control label can prevent someone from completing a form, while a vague document title makes navigation confusing. Fix the structure, labels, and alternatives, then check keyboard use and real content quality. If an image is informative, the checker can detect a missing alt attribute but cannot judge whether your sentence explains the image well enough. Keep an audit note that separates issues a tool found from observations made by a person.",
    "Repair the example, then list one important question that the automated checker still cannot answer.",
  ],
  planning: [
    "Turn a content outline into elements",
    "A portfolio reader wants to know who the learner is, what they can do, and where to see their work. Start with those questions as headings. Then choose lists for skills, articles for independent project descriptions, and contact links for destinations. Do not invent a form just because many websites have one; use it when it supports a real task and be clear about its processing boundary. A multi-page site needs actual linked files, so plan their names and relative paths before exporting them separately.",
    "Sketch a three-page portfolio, name each file, and calculate the links from the project-detail page back to the home page.",
  ],
  integration: [
    "Integrate by purpose, not by tag count",
    "A product page is not improved by using every element you know. Add a table when there are genuine comparisons, a description list for specifications, and an article for an independent review. A quantity control needs a useful label and a sensible minimum. A cart button in a static HTML exercise cannot pretend to complete a purchase. State what the interface demonstrates and where a real service would begin. Test the whole page after each section so one malformed fragment does not hide inside a larger project.",
    "Review a product page and justify every list, table, article, and form control in terms of the reader’s task.",
  ],
  review: [
    "Export is the beginning of verification",
    "Download the source, place any linked images, video, caption files, and pages in their planned folders, then open the result in its intended environment. Check the browser tab title, heading outline, fragment destinations, keyboard order, and resource paths. A page served from a project subdirectory can expose mistakes hidden by an origin-root path. Keep the HTML structure clear as you add CSS and JavaScript later; a styling or scripting enhancement should not erase the meaning that made the document useful.",
    "Create a short release checklist for your project, including one content check, one keyboard check, and one resource-path check.",
  ],
};
