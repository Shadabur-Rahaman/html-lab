import { useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { documentHTML } from "../data/curriculum.mjs";
import Lab from "./Lab";
import { solutionFor } from "../data/solutions.mjs";
const escapeText = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
export function NestingLab() {
  const [broken, setBroken] = useState(false),
    [answer, setAnswer] = useState<string | null>(null);
  const code = broken
    ? "<p>Before<h2>A heading</h2>After</p>"
    : "<p>Before</p>\n<h2>A heading</h2>\n<p>After</p>";
  return (
    <div className="experiment">
      <span className="eyebrow">SOURCE → PARSER → DOM</span>
      <h3>Is it really inside the paragraph?</h3>
      <div className="chip-row">
        <button
          className={`chip ${broken ? "active" : ""}`}
          onClick={() => {
            setBroken(true);
            setAnswer(null);
          }}
        >
          Try broken nesting
        </button>
        <button
          className={`chip ${!broken ? "active" : ""}`}
          onClick={() => {
            setBroken(false);
            setAnswer(null);
          }}
        >
          Use explicit siblings
        </button>
      </div>
      <p>
        Predict before inspecting: will the heading be a child of the paragraph?
      </p>
      <div className="chip-row">
        {["Yes", "No"].map((a) => (
          <button key={a} className="chip" onClick={() => setAnswer(a)}>
            {a}
          </button>
        ))}
      </div>
      {answer && (
        <p role="status" className={answer === "No" ? "success" : "warning"}>
          {answer === "No" ? "Correct." : "Look again."} A heading cannot be
          inside a paragraph. The HTML parser closes the paragraph before the
          heading.
        </p>
      )}
      <Lab
        key={code}
        initial={documentHTML(code)}
        solution={documentHTML(
          "<p>Before</p>\n<h2>A heading</h2>\n<p>After</p>",
        )}
      />
      <p className="muted">
        Expand body in the DOM Explorer and compare the siblings. HTML error
        recovery is defined behavior, not permission to write invalid nesting.
      </p>
    </div>
  );
}
export function TextLab() {
  const [tag, setTag] = useState("strong");
  const descriptions: { [key: string]: string } = {
    strong: "Strong importance: a safety warning or crucial instruction.",
    b: "Attention without extra importance: a keyword in a summary.",
    em: "Stress emphasis: changes which word you stress in a sentence.",
    i: "An alternate voice or technical term, such as a scientific name.",
    mark: "Contextual relevance, such as the matching phrase in a search result.",
  };
  return (
    <div className="experiment">
      <span className="eyebrow">MEANING VERSUS APPEARANCE</span>
      <h3>Similar looks. Different intentions.</h3>
      <div className="chip-row">
        {Object.keys(descriptions).map((t) => (
          <button
            className={`chip ${tag === t ? "active" : ""}`}
            key={t}
            onClick={() => setTag(t)}
          >
            &lt;{t}&gt;
          </button>
        ))}
      </div>
      <p>{descriptions[tag]}</p>
      <Lab
        key={tag}
        initial={documentHTML(
          `<h1>A note from the field</h1>\n<p>Bring <${tag}>water</${tag}> for the walk.</p>\n<p>Default styling can look similar. Choose the element by the intended meaning.</p>`,
        )}
      />
      <p className="muted">
        The example demonstrates default browser appearance. The sentence’s
        intended meaning determines the appropriate element; typography alone
        does not.
      </p>
    </div>
  );
}
export function ImageDebugger() {
  const [path, setPath] = useState("broken"),
    [alt, setAlt] = useState("image"),
    [response, setResponse] = useState("");
  const src = path === "broken" ? "./does-not-exist.svg" : "./small.svg";
  return (
    <div className="experiment">
      <span className="eyebrow">BROKEN IMAGE DETECTIVE</span>
      <h3>Is the path right? Is the alternative useful?</h3>
      <div className="chip-row">
        <label>
          Image source{" "}
          <select value={path} onChange={(e) => setPath(e.target.value)}>
            <option value="broken">./does-not-exist.svg</option>
            <option value="working">./small.svg</option>
          </select>
        </label>
        <label>
          Alternative{" "}
          <select value={alt} onChange={(e) => setAlt(e.target.value)}>
            <option value="image">image</option>
            <option value="Two coral hills beneath a pale sun">
              Two coral hills beneath a pale sun
            </option>
            <option value="">Empty (decorative)</option>
          </select>
        </label>
      </div>
      <Lab
        key={path + alt}
        initial={documentHTML(
          `<h1>Landscape illustration</h1>\n<img src="${src}" alt="${alt}" width="320" height="180">\n<p>This illustration is the subject of the discussion, so treat it as informative.</p>`,
        )}
      />
      <button
        className="button secondary"
        onClick={() =>
          setResponse(
            path === "broken"
              ? "The file does not exist. Correct the path before evaluating the image."
              : alt === "Two coral hills beneath a pale sun"
                ? "Good: the source exists and the alternative describes the illustration’s useful content."
                : "For this informative image, “image” and an empty alternative do not convey the useful information. Choose a descriptive alternative.",
          )
        }
      >
        Review my choices
        <ArrowRight size={15} />
      </button>
      {response && (
        <p role="status" className="hint">
          {response}
        </p>
      )}
      <p className="muted">
        For purely decorative images in another context, empty alt is
        appropriate. The purpose determines the alternative.
      </p>
    </div>
  );
}
export function ListBuilder() {
  const [ordered, setOrdered] = useState(false),
    [items, setItems] = useState([
      "Open the lab",
      "Write one meaningful element",
      "Inspect the result",
    ]),
    [text, setText] = useState("Explain your decision");
  const tag = ordered ? "ol" : "ul";
  return (
    <div className="experiment">
      <span className="eyebrow">LIVE LIST BUILDER</span>
      <h3>Does order change the meaning?</h3>
      <label>
        <input
          type="checkbox"
          checked={ordered}
          onChange={(e) => setOrdered(e.target.checked)}
        />{" "}
        The sequence matters
      </label>
      <div className="builder-fields">
        {items.map((item, i) => (
          <div className="builder-row" key={i}>
            <input
              aria-label={`List item ${i + 1}`}
              value={item}
              onChange={(e) =>
                setItems(items.map((x, j) => (j === i ? e.target.value : x)))
              }
            />
            <button
              aria-label={`Remove item ${i + 1}`}
              className="icon-button"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <div className="chip-row">
        <input
          aria-label="New list item"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          disabled={!text.trim() || items.length >= 12}
          className="button secondary compact"
          onClick={() => {
            setItems([...items, text]);
            setText("");
          }}
        >
          <Plus size={15} />
          Add item
        </button>
      </div>
      <Lab
        key={tag + items.join("|")}
        initial={documentHTML(
          `<h1>Learning checklist</h1>\n<${tag}>\n${items.map((i) => `  <li>${escapeText(i)}</li>`).join("\n")}\n</${tag}>`,
        )}
      />
    </div>
  );
}
export function MediaBuilder() {
  const [kind, setKind] = useState("video"),
    [controls, setControls] = useState(true),
    [captions, setCaptions] = useState(true),
    [disclosure, setDisclosure] = useState(true);
  const code = documentHTML(
    `<h1>A tiny media lesson</h1>\n${kind === "video" ? `<video width="320"${controls ? " controls" : ""} preload="metadata">\n  <source src="./flower.mp4" type="video/mp4">\n${captions ? '  <track src="./captions.vtt" kind="captions" srclang="en" label="English" default>\n' : ""}</video>\n<p>Silent pink and white flowers move in the breeze. CC0 sample from MDN.</p>` : `<audio${controls ? " controls" : ""} preload="metadata">\n  <source src="./tone.wav" type="audio/wav">\n</audio>\n<p>A generated one-second 440 Hz tone. No speech or music.</p>`}\n${disclosure ? "<details><summary>Text description</summary><p>" + (kind === "video" ? "A close-up of flowers moving gently outdoors." : "A pure tone fades in and out over one second.") + "</p></details>" : ""}`,
  );
  return (
    <div className="experiment">
      <span className="eyebrow">NATIVE MEDIA BUILDER</span>
      <h3>A player needs content and alternatives.</h3>
      <div className="chip-row">
        <select
          aria-label="Media type"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option>video</option>
          <option>audio</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={controls}
            onChange={(e) => setControls(e.target.checked)}
          />{" "}
          Native controls
        </label>
        {kind === "video" && (
          <label>
            <input
              type="checkbox"
              checked={captions}
              onChange={(e) => setCaptions(e.target.checked)}
            />{" "}
            Caption track
          </label>
        )}
        <label>
          <input
            type="checkbox"
            checked={disclosure}
            onChange={(e) => setDisclosure(e.target.checked)}
          />{" "}
          Text description
        </label>
      </div>
      <Lab key={code} initial={code} />
      <p className="muted">
        Notice what happens without controls. Avoid autoplay. A caption file
        must match actual content; speech, relevant sounds, and important visual
        information need appropriate alternatives.
      </p>
    </div>
  );
}
export function ResponsiveImages() {
  const [size, setSize] = useState(320);
  return (
    <div className="experiment">
      <span className="eyebrow">RESPONSIVE IMAGE SELECTOR</span>
      <h3>One purpose, different compositions.</h3>
      <label htmlFor="image-width">Illustrated display width: {size}px</label>
      <input
        id="image-width"
        type="range"
        min="220"
        max="800"
        step="20"
        value={size}
        onChange={(e) => setSize(+e.target.value)}
        style={{ width: "100%", margin: "20px 0" }}
      />
      <div
        className="responsive-image-demo"
        style={{ maxWidth: size, background: "#eee" }}
      >
        <img
          src={size >= 600 ? "./wide.svg" : "./small.svg"}
          alt="Coral hills under a pale sun"
          style={{ width: "100%", display: "block" }}
        />
      </div>
      <p>
        <code>{size >= 600 ? "wide.svg" : "small.svg"}</code> · This explicit
        teaching simulation switches art direction at 600px.
      </p>
      <p className="muted">
        A real picture element uses media queries against its document viewport,
        not this slider. For width-based srcset, the browser also considers
        sizes, device density, and other factors.
      </p>
      <Lab
        initial={documentHTML(
          '<h1>Art direction</h1>\n<picture>\n  <source media="(min-width: 600px)" srcset="./wide.svg">\n  <img src="./small.svg" alt="Coral hills under a pale sun" width="320" height="180">\n</picture>\n<p>Use the mobile/desktop preview controls to change the document viewport.</p>',
        )}
      />
    </div>
  );
}
export function AttributeLab() {
  const [disabled, setDisabled] = useState(false),
    [required, setRequired] = useState(false),
    [hidden, setHidden] = useState(false),
    [direction, setDirection] = useState("ltr");
  return (
    <div className="experiment">
      <span className="eyebrow">ATTRIBUTE LAB</span>
      <h3>Small attributes. Visible consequences.</h3>
      <div className="chip-row">
        <label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />{" "}
          disabled
        </label>
        <label>
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />{" "}
          required
        </label>
        <label>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
          />{" "}
          hidden paragraph
        </label>
        <label>
          Direction{" "}
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option>ltr</option>
            <option>rtl</option>
          </select>
        </label>
      </div>
      <Lab
        key={[disabled, required, hidden, direction].join("-")}
        initial={documentHTML(
          `<main dir="${direction}">\n<h1>Attribute experiment</h1>\n<p${hidden ? " hidden" : ""}>Hide me with a boolean attribute.</p>\n<form><label for="email">Email</label>\n<input id="email" name="email" type="email"${disabled ? " disabled" : ""}${required ? " required" : ""}>\n<button>Test native validation</button></form>\n</main>`,
        )}
      />
      <p className="muted">
        Boolean attributes are true when present. disabled="false" still
        disables a control. This lab omits the attribute entirely when a switch
        is off.
      </p>
    </div>
  );
}
