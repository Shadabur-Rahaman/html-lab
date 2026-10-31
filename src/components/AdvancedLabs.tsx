import { useEffect, useId, useRef, useState } from "react";
import {
  advancedAudit,
  candidateChoice,
  metadataReport,
  parserPuzzles,
  parserTree,
} from "../advancedModel.mjs";
import { previewHTML } from "../lib.mjs";

export function SemanticArchitecture() {
  const variants = [
    [
      "Generic containers",
      "<div><div>Research journal</div><div><div>River study</div><div>A field report.</div></div></div>",
      "Generic containers can be valid but do not identify headings, landmarks or independent articles. Use div for wrappers that have no more specific meaning.",
    ],
    [
      "Semantic structure",
      "<main><h1>Research journal</h1><article><h2>River study</h2><p>A field report.</p></article></main>",
      "main identifies dominant content, article identifies an independent story, and explicit headings express hierarchy. This can support navigation by landmarks/headings.",
    ],
    [
      "Incorrect nesting",
      "<main><h1>Research journal</h1><p>Introduction<article><h2>River study</h2><p>A field report.</p></article></p></main>",
      "The parser closes p before article. A semantic tag does not make an invalid relationship correct. Inspect the recovered DOM, then repair the source.",
    ],
  ];
  const [index, setIndex] = useState(0);
  const [title, source, explanation] = variants[index];
  return (
    <section className="experiment">
      <h2>Semantic Architecture Lab</h2>
      <div className="chip-row">
        {variants.map(([name], i) => (
          <button
            key={name}
            className={`button ${index === i ? "primary" : "secondary"} compact`}
            onClick={() => setIndex(i)}
          >
            {name}
          </button>
        ))}
      </div>
      <p>{explanation}</p>
      <div className="advanced-split">
        <div>
          <h3>{title} · source</h3>
          <pre>{source}</pre>
          <h3>Browser-constructed DOM</h3>
          <pre>{parserTree(source).tree}</pre>
        </div>
        <iframe
          title="Semantic architecture preview"
          sandbox=""
          srcDoc={previewHTML(source)}
        />
      </div>
      <p>
        This DOM view is not the accessibility tree. Inspect the browser’s
        accessibility panel and test heading/landmark navigation to assess
        actual exposure.
      </p>
    </section>
  );
}

export function NativeFormLab() {
  const uid = useId(),
    form = useRef<HTMLFormElement>(null),
    [required, setRequired] = useState(true),
    [disabled, setDisabled] = useState(false),
    [readonly, setReadonly] = useState(false),
    [multiple, setMultiple] = useState(false),
    [bypass, setBypass] = useState(false),
    [pattern, setPattern] = useState("[A-Za-z]{2,20}"),
    [report, setReport] = useState(""),
    [data, setData] = useState<string[] | null>(null);
  function inspect() {
    const f = form.current!;
    const controls = [...f.elements].filter(
      (n): n is HTMLInputElement => n instanceof HTMLInputElement,
    );
    setReport(
      controls
        .map(
          (n) =>
            `${n.name || "(unnamed)"}: ${
              n.willValidate
                ? n.validity.valid
                  ? "valid"
                  : Object.keys({
                      valueMissing: 1,
                      typeMismatch: 1,
                      patternMismatch: 1,
                      rangeUnderflow: 1,
                      rangeOverflow: 1,
                      stepMismatch: 1,
                      tooShort: 1,
                    })
                      .filter((k) => n.validity[k as keyof ValidityState])
                      .join(", ") +
                    " — " +
                    n.validationMessage
                : "excluded from constraint validation"
            }`,
        )
        .join("\n"),
    );
    setData(
      [...new FormData(f).entries()].map(
        ([k, v]) =>
          `${k}: ${typeof v === "string" ? v : `File (${v.size} bytes)`}`,
      ),
    );
  }
  return (
    <section className="experiment">
      <h2>Native Form Laboratory</h2>
      <p>
        Real browser controls and FormData, with trusted handlers that prevent
        every submission. Use fictional values. No request is sent. Keyboard
        widgets and messages depend on your browser/locale.
      </p>
      <div className="chip-row">
        <label>
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />{" "}
          Require email
        </label>
        <label>
          <input
            type="checkbox"
            checked={multiple}
            onChange={(e) => setMultiple(e.target.checked)}
          />{" "}
          Multiple email values
        </label>
        <label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />{" "}
          Disable reference
        </label>
        <label>
          <input
            type="checkbox"
            checked={readonly}
            onChange={(e) => setReadonly(e.target.checked)}
          />{" "}
          Readonly reference
        </label>
        <label>
          <input
            type="checkbox"
            checked={bypass}
            onChange={(e) => setBypass(e.target.checked)}
          />{" "}
          Skip submission validation (novalidate)
        </label>
      </div>
      <label>
        Pattern for learner code
        <input
          value={pattern}
          maxLength={80}
          onChange={(e) => setPattern(e.target.value)}
        />
      </label>
      <p>
        Try the supplied simple pattern. Invalid patterns may be ignored by the
        browser; this field is not a complete pattern validator. Complex
        patterns are not applied in this demo.
      </p>
      <form
        ref={form}
        noValidate={bypass}
        onSubmit={(e) => {
          e.preventDefault();
          inspect();
        }}
        onInvalidCapture={() => {
          setData(null);
          setReport(
            "Submission stopped by native validation. Inspect the field and use Inspect validity for details.",
          );
        }}
      >
        <fieldset>
          <legend>Fictional registration</legend>
          <label htmlFor={`${uid}-email`}>Email</label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required={required}
            multiple={multiple}
            autoComplete="email"
            inputMode="email"
            enterKeyHint="next"
            aria-describedby={`${uid}-help`}
          />
          <p id={`${uid}-help`}>
            Separate multiple email addresses with commas when that option is
            enabled.
          </p>
          <label htmlFor={`${uid}-code`}>
            Learner code (2–20 ASCII letters by default)
          </label>
          <input
            id={`${uid}-code`}
            name="learner"
            pattern={
              pattern === "[A-Za-z]{2,20}"
                ? pattern
                : pattern === "[0-9]{4}"
                  ? pattern
                  : undefined
            }
          />
          <p>
            Live patterns supported here: [A-Za-z]&#123;2,20&#125; or
            [0-9]&#123;4&#125;. Other patterns remain source-study only to keep
            the demo responsive.
          </p>
          <label htmlFor={`${uid}-qty`}>Quantity (2–10, step 2)</label>
          <input
            id={`${uid}-qty`}
            name="quantity"
            type="number"
            min="2"
            max="10"
            step="2"
            defaultValue="2"
          />
          <label htmlFor={`${uid}-ref`}>Reference</label>
          <input
            id={`${uid}-ref`}
            name="reference"
            defaultValue="COURSE-42"
            disabled={disabled}
            readOnly={readonly}
          />
          <label>
            <input name="updates" type="checkbox" value="yes" /> Optional
            updates
          </label>
          <button className="button primary compact">
            Review submission locally
          </button>
        </fieldset>
      </form>
      <div className="chip-row">
        <button className="button secondary compact" onClick={inspect}>
          Inspect validity & form data
        </button>
        <button
          className="button secondary compact"
          onClick={() => form.current?.reportValidity()}
        >
          Show native validation message
        </button>
      </div>
      {report && <pre role="status">{report}</pre>}
      {data && (
        <>
          <h3>Successful-control data (not transmitted)</h3>
          <pre>{data.length ? data.join("\n") : "No successful controls."}</pre>
        </>
      )}
      <p>
        Inspecting data does not itself validate it. Disabled and unchecked
        controls are normally absent. Server validation is still required. Use
        the source exercise below for file attributes, submitter overrides and
        other types.
      </p>
    </section>
  );
}

export function NativeUILab() {
  const uid = useId().replace(/:/g, ""),
    modal = useRef<HTMLDialogElement>(null),
    nonmodal = useRef<HTMLDialogElement>(null),
    invoker = useRef<HTMLButtonElement>(null),
    region = useRef<HTMLDivElement>(null),
    [inert, setInert] = useState(false),
    [hidden, setHidden] = useState(false),
    [message, setMessage] = useState(""),
    [support, setSupport] = useState({
      popover: false,
      hint: false,
      command: false,
    }),
    [mode, setMode] = useState<"auto" | "manual">("auto");
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("popover", "hint");
    setSupport({
      popover: "popover" in HTMLElement.prototype,
      hint: el.popover === "hint",
      command: "commandForElement" in HTMLButtonElement.prototype,
    });
  }, []);
  useEffect(() => {
    if (region.current) region.current.inert = inert;
  }, [inert]);
  return (
    <section className="experiment">
      <h2>Native UI Lab</h2>
      <p>
        These are actual details, dialog, popover and inert browser behaviors
        using fixed trusted markup. The editable learner preview remains
        script-free.
      </p>
      <details>
        <summary>FAQ: how do I keep a project?</summary>
        <p>Save on device, then export a backup.</p>
      </details>
      <div className="chip-row">
        <button
          className="button primary compact"
          ref={invoker}
          onClick={() => modal.current?.showModal()}
        >
          Open native modal
        </button>
        <button
          className="button secondary compact"
          onClick={() => {
            if (!nonmodal.current?.open) nonmodal.current?.show();
          }}
        >
          Open nonmodal dialog
        </button>
      </div>
      <dialog
        ref={modal}
        aria-labelledby={`${uid}-modal-title`}
        onClose={() => {
          setMessage("Modal closed. Focus returns to its opener.");
          invoker.current?.focus();
        }}
      >
        <h2 id={`${uid}-modal-title`}>Review your learning plan</h2>
        <p>
          The browser makes the rest of this document inert. Try Tab, Shift+Tab
          and Escape.
        </p>
        <form method="dialog">
          <button autoFocus value="done" className="button primary compact">
            Done reviewing
          </button>
        </form>
      </dialog>
      <dialog ref={nonmodal} aria-labelledby={`${uid}-nonmodal-title`}>
        <h2 id={`${uid}-nonmodal-title`}>Nonmodal note</h2>
        <p>
          You can still interact with the document. This is a native show()
          dialog.
        </p>
        <form method="dialog">
          <button className="button secondary compact">Close nonmodal</button>
        </form>
      </dialog>
      <p role="status">{message}</p>
      <label>
        Information popover mode
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "auto" | "manual")}
        >
          <option value="auto">auto · light dismissal</option>
          <option value="manual">manual · explicit close</option>
        </select>
      </label>
      {support.popover ? (
        <div className="chip-row">
          <button
            className="button secondary compact"
            popoverTarget={`${uid}-popover`}
          >
            Toggle information popover
          </button>
          <aside
            key={mode}
            id={`${uid}-popover`}
            popover={mode}
            className="native-popover"
          >
            <h3>Keep a backup</h3>
            <p>
              {mode === "auto"
                ? "Click outside or press Escape to dismiss."
                : "Manual mode: use this close control; light dismissal is not provided."}
            </p>
            <button
              className="button secondary compact"
              popoverTarget={`${uid}-popover`}
              popoverTargetAction="hide"
            >
              Close information
            </button>
          </aside>
          <button
            className="button secondary compact"
            popoverTarget={`${uid}-menu`}
          >
            Help actions
          </button>
          <div id={`${uid}-menu`} popover="auto" className="native-popover">
            <h3>Help actions</h3>
            <p>
              This is ordinary content with buttons, not an ARIA menu widget.
            </p>
            <button
              className="button secondary compact"
              popoverTarget={`${uid}-menu`}
              popoverTargetAction="hide"
            >
              Return to lesson
            </button>
          </div>
        </div>
      ) : (
        <p>
          Popover is unavailable here. Use the FAQ disclosure as a fallback.
        </p>
      )}
      <p>
        Detected: popover {support.popover ? "yes" : "no"}; hint recognized{" "}
        {support.hint ? "yes (behavior may still vary)" : "no"}; Invoker
        Commands {support.command ? "yes" : "no"}. Core recognition does not
        prove every accessibility behavior. The modal button uses trusted
        showModal as a compatible teaching path.
      </p>
      <div className="chip-row">
        <label>
          <input
            type="checkbox"
            checked={inert}
            onChange={(e) => setInert(e.target.checked)}
          />{" "}
          Make example region inert
        </label>
        <label>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
          />{" "}
          Hide example region
        </label>
      </div>
      <div ref={region} hidden={hidden} className="note-card">
        <p>
          Example background region: visible while inert, removed from
          presentation while hidden.
        </p>
        <button
          className="button secondary compact"
          onClick={() => setMessage("Example region button activated.")}
        >
          Try example button
        </button>
      </div>
    </section>
  );
}

export function ImageInspector() {
  const [width, setWidth] = useState(390),
    [dpr, setDpr] = useState(2),
    [slot, setSlot] = useState(100),
    [set, setSet] = useState("standard");
  const candidates = set === "standard" ? [400, 800, 1600] : [640, 1280, 1920],
    choice = candidateChoice(width, dpr, slot, candidates);
  return (
    <section className="experiment">
      <h2>Responsive Image Inspector</h2>
      <p>
        Illustrative width-descriptor selection model. Actual browsers may
        choose differently due to cache/network/device heuristics. No candidate
        image is fetched by this model.
      </p>
      <div className="rubric-grid">
        <label>
          Viewport width: {width}px
          <input
            type="range"
            min="320"
            max="1440"
            step="10"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
          />
        </label>
        <label>
          Device pixel ratio
          <select value={dpr} onChange={(e) => setDpr(+e.target.value)}>
            {[1, 1.5, 2, 3].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          sizes model
          <select value={slot} onChange={(e) => setSlot(+e.target.value)}>
            <option value="100">100vw</option>
            <option value="50">50vw</option>
            <option value="80">80vw</option>
          </select>
        </label>
        <label>
          Source candidates
          <select value={set} onChange={(e) => setSet(e.target.value)}>
            <option value="standard">400w, 800w, 1600w</option>
            <option value="large">640w, 1280w, 1920w</option>
          </select>
        </label>
      </div>
      <div className="loading-track">
        <span style={{ width: `${slot}%` }}>
          Estimated slot: {Math.round(choice.slot)} CSS px
        </span>
      </div>
      <p role="status">
        {Math.round(choice.slot)} × {dpr} ≈ {Math.round(choice.target)} resource
        pixels → model chooses {choice.chosen}w.
      </p>
      <pre>{`<img src="image-${candidates[0]}.jpg"\n srcset="${candidates.map((n) => `image-${n}.jpg ${n}w`).join(", ")}"\n sizes="${slot}vw" width="1600" height="900" alt="Describe purpose">`}</pre>
      <table>
        <caption>
          Performance decisions · illustrative, not transfer measurements
        </caption>
        <thead>
          <tr>
            <th scope="col">Approach</th>
            <th scope="col">Tradeoff to measure</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Always oversized</th>
            <td>
              May transfer unnecessary bytes; cannot infer exact cost from
              dimensions alone.
            </td>
          </tr>
          <tr>
            <th scope="row">Correct fixed size</th>
            <td>
              Efficient for a known slot, potentially blurry on dense displays.
            </td>
          </tr>
          <tr>
            <th scope="row">Responsive candidates</th>
            <td>Give the browser options matched to slot and density.</td>
          </tr>
          <tr>
            <th scope="row">Lazy offscreen images</th>
            <td>
              May delay unnecessary work; avoid delaying the critical hero
              image.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Use actual Network measurements and currentSrc on an exported real page
        to compare bytes and chosen resources.
      </p>
    </section>
  );
}

export function LanguageLab() {
  const samples = [
    ["en", "English", "Welcome to the learning desk.", "ltr"],
    ["hi", "Hindi", "नमस्ते", "ltr"],
    ["kn", "Kannada", "ನಮಸ್ಕಾರ", "ltr"],
    ["ar", "Arabic", "مرحبًا بكم", "rtl"],
    ["ja", "Japanese", "日本語", "ltr"],
  ];
  const [lang, setLang] = useState("en"),
    [dir, setDir] = useState<"ltr" | "rtl" | "auto">("ltr");
  const selected = samples.find((s) => s[0] === lang)!;
  return (
    <section className="experiment">
      <h2>Language Lab</h2>
      <div className="chip-row">
        <label>
          Content language
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              setDir(
                samples.find((s) => s[0] === e.target.value)![3] as
                  | "ltr"
                  | "rtl",
              );
            }}
          >
            {samples.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Base direction
          <select
            value={dir}
            onChange={(e) => setDir(e.target.value as "ltr" | "rtl" | "auto")}
          >
            <option>ltr</option>
            <option>rtl</option>
            <option>auto</option>
          </select>
        </label>
      </div>
      <div className="note-card" lang={lang} dir={dir}>
        {selected[2]}
      </div>
      <p>
        Contributor: <bdi dir="auto">ليلى</bdi> — 12 notes.
      </p>
      <p lang="ja">
        <ruby>
          漢<rp>(</rp>
          <rt>かん</rt>
          <rp>)</rp>字<rp>(</rp>
          <rt>じ</rt>
          <rp>)</rp>
        </ruby>
      </p>
      <pre>{`<p lang="${lang}" dir="${dir}">${selected[2]}</p>`}</pre>
      <p>
        Changing dir changes base direction, not translation or the stored text.
        Changing this language selector chooses an authored example. Check real
        screen-reader pronunciation separately.
      </p>
    </section>
  );
}

export function ParserDetective() {
  const [source, setSource] = useState(parserPuzzles[0].source),
    [index, setIndex] = useState(0),
    [reveal, setReveal] = useState(false),
    [prediction, setPrediction] = useState(""),
    [mime, setMime] = useState("text/html");
  const parsed = reveal ? parserTree(source, mime) : null;
  return (
    <section className="experiment">
      <h2>Parser Detective</h2>
      <label>
        Investigation
        <select
          value={index}
          onChange={(e) => {
            const i = +e.target.value;
            setIndex(i);
            setSource(parserPuzzles[i].source);
            setReveal(false);
            setPrediction("");
          }}
        >
          {parserPuzzles.map((p, i) => (
            <option key={p.name} value={i}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Source HTML
        <textarea
          rows={5}
          maxLength={80000}
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setReveal(false);
          }}
        />
      </label>
      <label>
        Parser MIME type
        <select
          value={mime}
          onChange={(e) => {
            setMime(e.target.value);
            setReveal(false);
          }}
        >
          <option>text/html</option>
          <option>application/xhtml+xml</option>
        </select>
      </label>
      <label>
        Predict the resulting relationships
        <textarea
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
          maxLength={2000}
        />
      </label>
      <button
        className="button primary compact"
        onClick={() => setReveal(true)}
      >
        Reveal parsed DOM
      </button>
      {parsed && (
        <>
          <p>
            {parserPuzzles[index].why}{" "}
            {mime === "application/xhtml+xml"
              ? "XML well-formedness applies; HTML-style omissions can cause parser errors."
              : ""}
          </p>
          <p>
            compatMode: {parsed.mode} ·{" "}
            {parsed.xmlError
              ? "XML parser error"
              : "No XML parser error reported"}
            . This value alone does not distinguish limited quirks from full
            standards mode.
          </p>
          <div className="advanced-split">
            <pre>{parsed.tree}</pre>
            <iframe
              title="Parser output safe preview"
              sandbox=""
              srcDoc={previewHTML(source)}
            />
          </div>
          <p>
            The output panel always renders the sanitized HTML interpretation;
            the selected MIME applies to the DOM inspection above. XML errors
            are shown as parser errors, not executed. No arbitrary code runs.
          </p>
        </>
      )}
    </section>
  );
}

export function LoadingTimeline() {
  const [mode, setMode] = useState("defer");
  const schedules: Record<string, string[]> = {
    classic: [
      "Parse until script discovery",
      "Pause parsing: fetch script",
      "Execute classic script (may wait for earlier CSS)",
      "Resume HTML parsing",
      "Finish parsing; readiness events follow",
    ],
    defer: [
      "Parse HTML and discover script/CSS/images",
      "Fetch script while parsing continues",
      "Finish parsing",
      "Execute deferred classic scripts in document order",
      "DOMContentLoaded after deferred work",
    ],
    async: [
      "Parse HTML and discover script",
      "Fetch concurrently; readiness time varies",
      "Execute when ready, potentially interrupting parsing",
      "Continue/finish parsing; order is not guaranteed",
      "DOMContentLoaded does not wait for async scripts",
    ],
    module: [
      "Parse and discover module graph",
      "Fetch module and dependencies",
      "Finish parsing",
      "Evaluate deferred module work in dependency order",
      "DOMContentLoaded follows applicable deferred work",
    ],
  };
  return (
    <section className="experiment">
      <h2>Loading Timeline</h2>
      <p>
        An ordering model, not a real network trace. CSS discovery can block
        rendering, image fetching can overlap, and network timings vary.
      </p>
      <label>
        Script declaration
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="classic">Classic external, no async/defer</option>
          <option value="defer">Classic external defer</option>
          <option value="async">External async</option>
          <option value="module">Module, no async</option>
        </select>
      </label>
      <ol className="advanced-timeline">
        {schedules[mode].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p>
        Rendering milestones occur when applicable styles and layout are ready;
        they are not fixed timestamps on this diagram. Images may load later.
        Execution logic belongs in JS LAB.
      </p>
    </section>
  );
}

export function ComponentAnatomy() {
  const host = useRef<HTMLDivElement>(null),
    template = useRef<HTMLTemplateElement>(null),
    output = useRef<HTMLDivElement>(null),
    [clones, setClones] = useState(0),
    [support, setSupport] = useState("");
  useEffect(() => {
    // Populate the actual inert DocumentFragment, not ordinary React children
    // on the template element. Only fixed teaching nodes are constructed here.
    if (template.current && !template.current.content.childNodes.length) {
      const card = document.createElement("article"),
        heading = document.createElement("h3"),
        paragraph = document.createElement("p");
      heading.textContent = "Cloned profile";
      paragraph.textContent = "This fragment came from template.content.";
      card.append(heading, paragraph);
      template.current.content.append(card);
    }
    if (!host.current || !("attachShadow" in host.current)) {
      setSupport(
        "Shadow DOM unsupported; the light-DOM content remains available.",
      );
      return;
    }
    const shadow =
      host.current.shadowRoot || host.current.attachShadow({ mode: "open" });
    if (!shadow.childNodes.length) {
      const article = document.createElement("article"),
        heading = document.createElement("h3"),
        named = document.createElement("slot"),
        body = document.createElement("slot");
      named.name = "name";
      named.textContent = "Profile";
      heading.append(named);
      article.append(heading, body);
      shadow.append(article);
    }
    setSupport(
      "Real open shadow root: the name slot presents the light-DOM name; the default slot presents the paragraph.",
    );
  }, []);
  return (
    <section className="experiment">
      <h2>Component Anatomy Lab</h2>
      <p>
        Trusted fixed markup, real template cloning and a real shadow root.
        Learner source is never inserted into the application DOM.
      </p>
      <div className="note-card" ref={host}>
        <span slot="name">Asha · field researcher</span>
        <p>Light-DOM profile content, assigned to the default slot.</p>
      </div>
      <p>{support}</p>
      <template ref={template} />
      <button
        className="button primary compact"
        disabled={clones >= 3}
        onClick={() => {
          const fragment = template.current?.content.cloneNode(true);
          if (fragment) {
            output.current?.append(fragment);
            setClones((n) => n + 1);
          }
        }}
      >
        Clone trusted template ({clones}/3)
      </button>
      <button
        className="button secondary compact"
        onClick={() => {
          output.current?.replaceChildren();
          setClones(0);
        }}
      >
        Clear cloned examples
      </button>
      <div ref={output} className="advanced-clones" />
      <div className="note-card">
        <p>
          Host → shadow root → article → named/default slots. Light children
          retain their light-DOM parents. An ordinary template stores a fragment
          and is not displayed until used.
        </p>
      </div>
      <h3>Declarative Shadow DOM · trusted initial document</h3>
      <iframe
        title="Trusted declarative shadow example"
        sandbox=""
        srcDoc={
          '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'"><title>Declarative profile</title></head><body><div><template shadowrootmode="open"><article><h2><slot name="name">Profile</slot></h2><slot></slot></article></template><span slot="name">Declarative profile: Asha</span><p>Useful light content remains when unsupported.</p></div></body></html>'
        }
      />
      <p>
        This fixed iframe is parsed as an initial document; it has no scripts,
        network permissions or same-origin access. Ordinary DOMParser and
        innerHTML do not activate declarative shadow roots by default.
      </p>
    </section>
  );
}

export function SourceInspector({
  kind,
  initial,
}: {
  kind: "metadata" | "security" | "accessibility";
  initial: string;
}) {
  const [source, setSource] = useState(initial),
    [checked, setChecked] = useState(false);
  const report = kind === "metadata" && checked ? metadataReport(source) : null;
  const issues = kind !== "metadata" && checked ? advancedAudit(source) : [];
  return (
    <section className="experiment">
      <h2>
        {kind === "metadata"
          ? "Metadata Inspector"
          : kind === "security"
            ? "Security Inspector"
            : "Advanced HTML Audit"}
      </h2>
      <p>
        Inspect source as data. Nothing is inserted into the application DOM or
        submitted to a validator. Findings are educational prompts, not a
        complete conformance or accessibility verdict.
      </p>
      <label>
        Source to inspect
        <textarea
          rows={9}
          maxLength={80000}
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="button primary compact"
        onClick={() => setChecked(true)}
      >
        Inspect source
      </button>
      {report && (
        <>
          <dl className="metadata-report">
            {report.fields.map(([name, value, why]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>
                  {value || "Not declared"}
                  <small>{why}</small>
                </dd>
              </div>
            ))}
          </dl>
          <h3>JSON-LD data blocks</h3>
          {report.structured.length ? (
            report.structured.map((item, i) => (
              <div key={i}>
                <p>
                  {item.valid
                    ? "JSON syntax parses; vocabulary and truthfulness still need validation."
                    : "JSON syntax error"}
                </p>
                <pre>{item.text}</pre>
              </div>
            ))
          ) : (
            <p>No JSON-LD data blocks. They are optional and page-dependent.</p>
          )}
        </>
      )}
      {checked && kind !== "metadata" && (
        <div role="status">
          {issues.length ? (
            <ul>
              {issues.map((issue, i) => (
                <li key={i}>
                  <b>{issue.area}:</b> {issue.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No issues found by these limited rules. Continue manual review and
              source validation.
            </p>
          )}
        </div>
      )}
      {kind === "accessibility" && (
        <div className="note-card">
          <h3>Validate and test intentionally</h3>
          <ol>
            <li>
              Download HTML from the editor below and open it in its intended
              environment.
            </li>
            <li>
              Choose file upload or text input at the{" "}
              <a
                href="https://validator.w3.org/nu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nu HTML Checker
              </a>
              . Submit only source you choose to share with that service.
            </li>
            <li>
              Fix reported causes and rerun; review remaining warnings in
              context.
            </li>
            <li>
              Test Tab/Shift+Tab, Enter/Space, Escape, focus return, zoom,
              narrow screens and actual task completion.
            </li>
            <li>
              Inspect names/relationships with browser accessibility tools and
              test with an actual screen reader. Automated tools such as{" "}
              <a
                href="https://www.deque.com/axe/"
                target="_blank"
                rel="noopener noreferrer"
              >
                axe
              </a>{" "}
              complement this work.
            </li>
          </ol>
        </div>
      )}
    </section>
  );
}
