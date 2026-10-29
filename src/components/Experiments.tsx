import { useState } from "react";
import {
  ArrowRight,
  Globe,
  Server,
  Monitor,
  Plus,
  Trash2,
  MousePointer2,
} from "lucide-react";
import { documentHTML } from "../data/curriculum.mjs";
import Lab from "./Lab";

export function LayersDemo() {
  const [structured, setStructured] = useState(true),
    [css, setCss] = useState(true),
    [js, setJs] = useState(false),
    [count, setCount] = useState(0);
  return (
    <div className="layers-demo">
      <div className="section-top">
        <div>
          <span className="eyebrow">THE THREE LAYERS OF THE WEB</span>
          <h3>One card. Three different jobs.</h3>
        </div>
        <MousePointer2 size={22} />
      </div>
      <div className="layer-toggles">
        <label>
          <input
            type="checkbox"
            checked={structured}
            onChange={(e) => setStructured(e.target.checked)}
          />
          <b>HTML</b>
          <span>Structure</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={css}
            onChange={(e) => setCss(e.target.checked)}
          />
          <b>CSS</b>
          <span>Appearance</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={js}
            onChange={(e) => setJs(e.target.checked)}
          />
          <b>JavaScript</b>
          <span>Behavior</span>
        </label>
      </div>
      <div className={`demo-render ${css ? "styled-card" : ""}`}>
        {structured ? (
          <>
            <span className="demo-overline">YOUR NEXT CHAPTER</span>
            <h3>A little more curious.</h3>
            <p>Make something that didn’t exist yesterday.</p>
            <button disabled={!js} onClick={() => setCount(count + 1)}>
              {js ? `I’m in!${count ? ` · ${count} clicks` : ""}` : "I’m in!"}{" "}
              <ArrowRight size={14} />
            </button>
            <small>
              {js
                ? "Custom click behavior is enabled."
                : "Enable JavaScript to add custom click behavior."}
            </small>
          </>
        ) : (
          <span>
            A little more curious. Make something that didn’t exist yesterday.
            I’m in! No heading, paragraph, or button semantics: just text.
          </span>
        )}
      </div>
      <p className="muted">
        This app simulates each contribution. HTML is a markup language; CSS
        styles it; JavaScript adds programmable behavior.
      </p>
    </div>
  );
}

export function RequestDemo() {
  const [step, setStep] = useState(0);
  const labels = [
    "Choose a URL",
    "Resolve the domain",
    "Send an HTTP request",
    "Server sends a response",
    "Browser parses HTML",
  ];
  return (
    <div className="experiment">
      <span className="eyebrow">FOLLOW A PAGE REQUEST</span>
      <div className="request-flow">
        {[Monitor, Globe, Server].map((Icon, i) => (
          <div
            key={i}
            className={Math.min(2, Math.floor(step / 2)) === i ? "lit" : ""}
          >
            <Icon size={30} />
            <span>{["Browser", "Network & DNS", "Web server"][i]}</span>
            {i < 2 && <ArrowRight />}
          </div>
        ))}
      </div>
      <h3>
        {step + 1}. {labels[step]}
      </h3>
      <p>
        {
          [
            "You enter https://example.com/notes. A URL identifies a resource.",
            "DNS helps translate the domain to an address. Cached answers may be reused.",
            "The browser sends a request for /notes using HTTP over a connection.",
            "The server returns status, headers, and a response body. HTML is one possible response type.",
            "The browser builds a DOM, applies styles, fetches allowed resources, and displays the page.",
          ][step]
        }
      </p>
      <button
        className="button secondary"
        onClick={() => setStep((step + 1) % 5)}
      >
        {step === 4 ? "Start again" : "Next step"}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

const siteExamples: {
  [key: string]: { tag: string; text: string; meaning: string }[];
} = {
  "Search engine": [
    {
      tag: "header",
      text: "Search the web",
      meaning: "Introduces the search service.",
    },
    {
      tag: "form",
      text: "⌕ What are you curious about?",
      meaning: "Groups a labeled search input and submit button.",
    },
    {
      tag: "footer",
      text: "About · Privacy · Settings",
      meaning: "Closing links and service information.",
    },
  ],
  "Product page": [
    {
      tag: "h1",
      text: "The everyday notebook",
      meaning: "The primary product name.",
    },
    {
      tag: "figure",
      text: "▧ Product image & caption",
      meaning: "Groups product media with a caption.",
    },
    {
      tag: "dl",
      text: "120 pages · Recycled paper",
      meaning: "Pairs specification names with values.",
    },
    {
      tag: "form",
      text: "Quantity: 1     Add to cart",
      meaning:
        "Controls for choosing a quantity; real commerce needs more technology.",
    },
  ],
  Registration: [
    {
      tag: "h1",
      text: "Join the workshop",
      meaning: "The purpose of this page.",
    },
    {
      tag: "fieldset",
      text: "Contact details",
      meaning: "Groups related controls under a legend.",
    },
    {
      tag: "label",
      text: "Email address",
      meaning: "Names the associated email input.",
    },
    {
      tag: "button",
      text: "Submit application",
      meaning: "Submits the form when type is submit.",
    },
  ],
  "News article": [
    {
      tag: "nav",
      text: "World · Science · Culture",
      meaning: "Major navigation destinations.",
    },
    {
      tag: "article",
      text: "A new garden for the city",
      meaning: "An independently meaningful story.",
    },
    {
      tag: "time",
      text: "5 November 2026",
      meaning: "A date with a machine-readable datetime.",
    },
    {
      tag: "aside",
      text: "Related stories",
      meaning: "Content tangential to the main story.",
    },
  ],
  "Video platform": [
    {
      tag: "h1",
      text: "How a browser reads HTML",
      meaning: "The video page title.",
    },
    {
      tag: "video",
      text: "▶  A lesson in structure",
      meaning: "A native video player with controls.",
    },
    {
      tag: "details",
      text: "▸ Transcript",
      meaning: "An expandable text alternative.",
    },
    {
      tag: "section",
      text: "More lessons",
      meaning: "A thematic group with a heading.",
    },
  ],
  Portfolio: [
    {
      tag: "header",
      text: "Alex / creative learner",
      meaning: "Introduces the author.",
    },
    {
      tag: "section",
      text: "About me",
      meaning: "A thematic section with a heading.",
    },
    {
      tag: "article",
      text: "Project 01 — Field notes",
      meaning: "A self-contained project description.",
    },
    {
      tag: "address",
      text: "Get in touch",
      meaning: "Contact information for the author or page.",
    },
  ],
};
export function Anatomy() {
  const [site, setSite] = useState("Search engine"),
    [selected, setSelected] = useState(0);
  const rows = siteExamples[site];
  return (
    <div className="anatomy">
      <div className="section-top">
        <div>
          <span className="eyebrow">LOOK BENEATH THE SURFACE</span>
          <h2>Same web. Different structures.</h2>
        </div>
        <select
          aria-label="Website example"
          value={site}
          onChange={(e) => {
            setSite(e.target.value);
            setSelected(0);
          }}
        >
          {Object.keys(siteExamples).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="anatomy-grid">
        <div className="mini-site">
          {rows.map((r, i) => (
            <button
              className={selected === i ? "selected" : ""}
              key={i}
              onClick={() => setSelected(i)}
            >
              <span>{r.text}</span>
              <code>&lt;{r.tag}&gt;</code>
            </button>
          ))}
        </div>
        <div className="anatomy-note">
          <span className="eyebrow">CLICK AN ELEMENT</span>
          <h3>&lt;{rows[selected].tag}&gt;</h3>
          <p>{rows[selected].meaning}</p>
          <p className="muted">
            A simplified structural illustration. Real services also use CSS,
            JavaScript, servers, and other technologies.
          </p>
        </div>
      </div>
    </div>
  );
}

export function StructureDemo() {
  const [html, setHtml] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="experiment structure-demo">
      <div className="section-top">
        <h3>Give content a little structure.</h3>
        <button
          className="button secondary compact"
          onClick={() => setHtml(!html)}
        >
          {html ? "Remove structure" : "Add HTML structure"}
          <ArrowRight size={14} />
        </button>
      </div>
      {html ? (
        <div className="paper">
          <nav>
            <a href="#lesson/markup">Start exploring</a>
          </nav>
          <h2>My curious corner</h2>
          <p>A small place for big ideas.</p>
          <img
            src="./small.svg"
            width="90"
            height="50"
            alt="Coral hills beneath a pale sun"
          />
          <ul>
            <li>Read</li>
            <li>Experiment</li>
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label htmlFor="demo-topic">Your favorite topic</label>
            <input
              id="demo-topic"
              name="topic"
              placeholder="Try HTML"
              required
            />
            <button type="submit">Explore</button>
          </form>
          {submitted && (
            <small role="status">
              The browser validated this form. This demonstration sends no data.
            </small>
          )}
          <small>
            Elements: nav, a, h2, p, img, ul, li, form, label, input, button.
          </small>
        </div>
      ) : (
        <div className="unstructured">
          My curious corner A small place for big ideas Start exploring [sunset
          picture] Read Experiment Your favorite topic Explore
        </div>
      )}
    </div>
  );
}

export function PathDemo() {
  const [file, setFile] = useState("pages/about.html");
  return (
    <div className="experiment">
      <span className="eyebrow">FILE PATH EXPLORER</span>
      <h3>Where are you starting?</h3>
      <div className="chip-row">
        {["index.html", "pages/about.html", "pages/blog/story.html"].map(
          (f) => (
            <button
              className={file === f ? "chip active" : "chip"}
              onClick={() => setFile(f)}
              key={f}
            >
              {f}
            </button>
          ),
        )}
      </div>
      <pre>
        {
          "project/\n  index.html\n  pages/about.html\n  pages/blog/story.html\n  images/portrait.svg"
        }
      </pre>
      <p>
        From <code>{file}</code> to <code>images/portrait.svg</code>:
      </p>
      <div className="answer-code">
        {file === "index.html"
          ? "./images/portrait.svg"
          : file === "pages/about.html"
            ? "../images/portrait.svg"
            : "../../images/portrait.svg"}
      </div>
      <p className="muted">
        Each ../ moves one directory up. File paths are resolved from the
        document URL.
      </p>
    </div>
  );
}

export function FormBuilder() {
  const [fields, setFields] = useState([
      { type: "text", name: "name", label: "Your name", required: true },
      { type: "email", name: "email", label: "Email address", required: true },
    ]),
    [type, setType] = useState("date"),
    [method, setMethod] = useState("get"),
    [value, setValue] = useState("HTML & CSS");
  const code = documentHTML(
    `<h1>Workshop registration</h1>\n<form action="/register" method="${method}">\n${fields.map((f, i) => `  <label for="field-${i}">${f.label}</label>\n  <input id="field-${i}" name="${f.name}" type="${f.type}"${f.required ? " required" : ""}>`).join("\n")}\n  <button type="submit">Register</button>\n</form>\n<p>Learning demo: no data is sent.</p>`,
  );
  return (
    <div className="form-builder experiment">
      <span className="eyebrow">LIVE FORM BUILDER</span>
      <h3>Small controls. A useful conversation.</h3>
      <div className="builder-fields">
        {fields.map((f, i) => (
          <div className="builder-row" key={i}>
            <input
              aria-label={`Field ${i + 1} label`}
              value={f.label}
              onChange={(e) =>
                setFields(
                  fields.map((x, j) =>
                    j === i
                      ? { ...x, label: e.target.value.replace(/[<>&"']/g, "") }
                      : x,
                  ),
                )
              }
            />
            <code>{f.type}</code>
            <input
              aria-label={`Field ${i + 1} name`}
              value={f.name}
              onChange={(e) =>
                setFields(
                  fields.map((x, j) =>
                    j === i
                      ? {
                          ...x,
                          name: e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""),
                        }
                      : x,
                  ),
                )
              }
              placeholder="Submitted key"
            />
            <label>
              <input
                type="checkbox"
                checked={f.required}
                onChange={(e) =>
                  setFields(
                    fields.map((x, j) =>
                      j === i ? { ...x, required: e.target.checked } : x,
                    ),
                  )
                }
              />
              Required
            </label>
            <button
              className="icon-button"
              onClick={() => setFields(fields.filter((_, j) => j !== i))}
              aria-label={`Remove field ${i + 1}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <div className="chip-row">
        <select
          aria-label="New field type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {[
            "text",
            "password",
            "email",
            "number",
            "date",
            "time",
            "checkbox",
            "radio",
            "file",
            "hidden",
            "range",
            "color",
            "search",
            "tel",
            "url",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <button
          disabled={fields.length >= 12}
          className="button secondary compact"
          onClick={() =>
            setFields([
              ...fields,
              {
                type,
                name: `field${fields.length + 1}`,
                label: `Your ${type}`,
                required: false,
              },
            ])
          }
        >
          <Plus size={15} />
          Add control
        </button>
        <label>
          Method{" "}
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>get</option>
            <option>post</option>
          </select>
        </label>
      </div>
      <Lab key={code} initial={code} />
      <div className="request-illustration">
        <h3>Where would the data go?</h3>
        <label htmlFor="request-value">Illustrative search value</label>
        <input
          id="request-value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <pre>
          {method === "get"
            ? `GET /register?q=${encodeURIComponent(value)} HTTP/1.1`
            : `POST /register HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nq=${encodeURIComponent(value)}`}
        </pre>
        <p className="muted">
          Conceptual request; nothing is sent. GET includes fields in the URL.
          POST sends a body. Both need HTTPS for transport confidentiality, plus
          server-side validation.
        </p>
      </div>
    </div>
  );
}

export function TableBuilder() {
  const [rows, setRows] = useState(3),
    [cols, setCols] = useState(3),
    [span, setSpan] = useState(1);
  const code = documentHTML(
    `<table>\n<caption>Student practice table</caption>\n<thead><tr>${Array.from({ length: cols }, (_, i) => `<th scope="col">Column ${i + 1}</th>`).join("")}</tr></thead>\n<tbody>\n${Array.from({ length: rows }, (_, r) => `<tr><th scope="row">Row ${r + 1}</th><td colspan="${span}">Data</td>${Array.from({ length: Math.max(0, cols - 1 - span) }, () => "<td>Data</td>").join("")}</tr>`).join("\n")}\n</tbody>\n</table>`,
  );
  return (
    <div className="experiment">
      <span className="eyebrow">TABLE & SPAN BUILDER</span>
      <h3>See the grid behind the data.</h3>
      <div className="chip-row">
        <label>
          Rows{" "}
          <input
            type="number"
            min="1"
            max="8"
            value={rows}
            onChange={(e) => setRows(Math.min(8, Math.max(1, +e.target.value)))}
          />
        </label>
        <label>
          Columns{" "}
          <input
            type="number"
            min="2"
            max="6"
            value={cols}
            onChange={(e) => {
              const n = Math.min(6, Math.max(2, +e.target.value));
              setCols(n);
              setSpan(Math.min(span, n - 1));
            }}
          />
        </label>
        <label>
          Data-cell colspan{" "}
          <input
            type="number"
            min="1"
            max={cols - 1}
            value={span}
            onChange={(e) =>
              setSpan(Math.min(cols - 1, Math.max(1, +e.target.value)))
            }
          />
        </label>
      </div>
      <Lab key={code} initial={code} />
    </div>
  );
}

export function SemanticBuilder() {
  const [regions, setRegions] = useState(["header", "main", "footer"]);
  const code = documentHTML(
    regions
      .map(
        (tag) =>
          `<${tag}>\n  ${tag === "main" ? "<h1>My semantic page</h1>" : "<h2>" + tag[0].toUpperCase() + tag.slice(1) + "</h2>"}\n  <p>${{ header: "Introduction to this page.", nav: "Major navigation destinations.", main: "Dominant page content.", article: "An independent story.", section: "A thematic group.", aside: "Related, tangential information.", footer: "Closing information." }[tag]}</p>\n</${tag}>`,
      )
      .join("\n"),
  );
  return (
    <div className="experiment">
      <span className="eyebrow">SEMANTIC LAYOUT BUILDER</span>
      <h3>Choose regions by meaning.</h3>
      <div className="chip-row">
        {["header", "nav", "main", "article", "section", "aside", "footer"].map(
          (tag) => (
            <label className="chip" key={tag}>
              <input
                type="checkbox"
                checked={regions.includes(tag)}
                onChange={() =>
                  setRegions(
                    regions.includes(tag)
                      ? regions.filter((t) => t !== tag)
                      : [...regions, tag],
                  )
                }
              />
              &lt;{tag}&gt;
            </label>
          ),
        )}
      </div>
      <p className="muted">
        Regions appear in selection order. For this simple demo they are
        siblings; in your own page, nest articles and sections inside main where
        appropriate.
      </p>
      <Lab key={code} initial={code} />
      <p>
        Reading order: {regions.join(" → ")}. A simplified landmark map includes
        main, nav, aside, and page-level header/footer; not every semantic
        element creates a landmark.
      </p>
    </div>
  );
}
