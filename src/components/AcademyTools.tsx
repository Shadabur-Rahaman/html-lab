import { useState } from "react";
import { ArrowRight, Download, Play, RotateCcw } from "lucide-react";
import Lab from "./Lab";
import { documentHTML } from "../data/curriculum.mjs";
import { downloadBlob } from "../projectModel.mjs";
export function NetworkJourney() {
  const [url, setUrl] = useState("https://learn.example.com/notes.html"),
    [outcome, setOutcome] = useState("success"),
    [step, setStep] = useState(0),
    [running, setRunning] = useState(false),
    [answer, setAnswer] = useState("");
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
    if (!["https:", "http:"].includes(parsed.protocol)) parsed = null;
  } catch {}
  const names = [
    "Student",
    "Browser",
    "DNS",
    "Web server",
    "Response",
    "Browser rendering",
  ];
  const cases: { [key: string]: [string, string] } = {
    success: [
      "200 OK",
      "The server returned the page. The browser can parse it and request related resources.",
    ],
    missing: [
      "404 Not Found",
      "The server answered but could not find this path. Check the filename and publication folder.",
    ],
    server: [
      "500 Server Error",
      "The server failed while processing the request. Your heading markup is not enough to diagnose its cause.",
    ],
    image: [
      "200 page / 404 image",
      "The HTML arrived; a separate image request failed. Inspect that image’s URL and the actual file.",
    ],
    incorrect: [
      "Incorrect URL",
      "An invalid address cannot start a normal HTTP journey. A well-formed typo may instead reach a wrong host or return a missing page.",
    ],
    connection: [
      "Connection failure",
      "No HTTP response was received. Check connectivity and whether the host is reachable.",
    ],
    redirect: [
      "301 / 302 redirect",
      "A server supplied another destination; the browser follows the redirect according to its rules.",
    ],
    forbidden: [
      "403 Forbidden",
      "The server is reachable but refuses access. Changing a local paragraph does not grant permission.",
    ],
    cached: [
      "Cached response",
      "A previously stored resource may be reused according to cache freshness and validation rules.",
    ],
  };
  return (
    <div className="experiment">
      <span className="eyebrow">
        EDUCATIONAL NETWORK MODEL · NO REQUESTS ARE SENT
      </span>
      <h2>Follow the request, not a guess.</h2>
      <label htmlFor="journey-url">Sample URL</label>
      <input
        id="journey-url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setRunning(false);
        }}
        style={{ width: "100%", margin: "12px 0" }}
      />
      <select
        aria-label="Network outcome"
        value={outcome}
        onChange={(e) => {
          setOutcome(e.target.value);
          setRunning(false);
          setStep(0);
        }}
      >
        {Object.keys(cases).map((o) => (
          <option key={o} value={o}>
            {cases[o][0]}
          </option>
        ))}
      </select>
      <div className="network-stages">
        {names.map((n, i) => (
          <button
            className={running && step === i ? "active" : ""}
            key={n}
            onClick={() => {
              setStep(i);
              setRunning(true);
            }}
          >
            {i + 1}. {n}
          </button>
        ))}
      </div>
      <button
        className="button primary compact"
        onClick={() => {
          setRunning(true);
          setStep(running ? (step + 1) % 6 : 0);
        }}
      >
        <Play size={14} />
        {running ? "Next step" : "Start journey"}
      </button>
      {running && (
        <div className="note-card">
          <h3>{!parsed ? "Invalid sample URL" : names[step]}</h3>
          <p>
            {!parsed
              ? "Use an absolute HTTP or HTTPS URL such as https://example.com/index.html."
              : step === 0
                ? "A person asks for a resource by entering a URL or following a link."
                : step === 1
                  ? `The browser reads scheme ${parsed.protocol}, host ${parsed.hostname}, path ${parsed.pathname}, query ${parsed.search || "(none)"}, and fragment ${parsed.hash || "(none)"}. A fragment is handled within the document rather than sent as part of the HTTP request path.`
                  : step === 2
                    ? "DNS helps resolve the hostname to a network address. Cached lookup results can avoid repeating work. A connection failure may stop the journey before an HTTP response exists."
                    : step === 3
                      ? "The browser makes an HTTP request. A static server finds files; a dynamic backend may generate a response or process data."
                      : step === 4
                        ? `${cases[outcome][0]}: ${cases[outcome][1]}`
                        : "The browser parses HTML into a DOM, applies CSS, lays out content, paints it, and may execute permitted JavaScript. This model does not inspect live packets or prove a real URL is reachable."}
          </p>
        </div>
      )}
      <h3>Which component can return a 404 response?</h3>
      <div className="chip-row">
        {["The web server", "The keyboard", "CSS margin"].map((a) => (
          <button className="chip" key={a} onClick={() => setAnswer(a)}>
            {a}
          </button>
        ))}
      </div>
      {answer && (
        <p role="status">
          {answer === "The web server"
            ? "Correct: it answered the request but did not find the resource."
            : "Try again: 404 is an HTTP response, not a visual layout property."}
        </p>
      )}
    </div>
  );
}
export function ComputerInstructions() {
  const [os, setOs] = useState("Windows"),
    [last, setLast] = useState("");
  const instructions: { [key: string]: string[] } = {
    Windows: [
      "Open File Explorer. Choose a location such as Documents and create a MyWebsite folder.",
      "Use View → Show → File name extensions in current Windows versions; older versions place the toggle differently. Confirm the full name index.html rather than index.html.txt.",
      "Open the folder in a plain-text/code editor, save, then open the HTML file in a browser. Check Downloads for your exported ZIP, extract it, and open the extracted folder.",
    ],
    macOS: [
      "Open Finder, choose a location, then File → New Folder. Name it MyWebsite.",
      "In Finder settings, Advanced offers Show all filename extensions. Use plain text rather than rich text when authoring HTML.",
      "Open the folder in a code editor, save index.html, and open it in a browser. Find exported ZIPs in your browser’s download location and extract them.",
    ],
    Linux: [
      "Open your distribution’s file manager and create a MyWebsite folder in a location you can find again.",
      "File managers vary; inspect the complete filename and use a plain-text editor. File names are commonly case-sensitive.",
      "Save index.html, open it in a browser, then locate and extract downloaded ZIPs. Use the official VS Code distribution instructions for your system.",
    ],
  };
  return (
    <div className="experiment">
      <span className="eyebrow">REPEAT IT ON A REAL COMPUTER</span>
      <div className="chip-row">
        {Object.keys(instructions).map((o) => (
          <button
            key={o}
            className={`chip ${os === o ? "active" : ""}`}
            onClick={() => setOs(o)}
          >
            {o}
          </button>
        ))}
      </div>
      <ol>
        {instructions[os].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <h3>Shortcut practice</h3>
      <p>
        Focus this practice area and press Ctrl/Cmd+S, Ctrl/Cmd+F, Ctrl/Cmd+Z,
        or Ctrl/Cmd+C/V. The simulation identifies the shortcut; it does not
        read your clipboard or save your real files.
      </p>
      <div
        className="shortcut-practice"
        tabIndex={0}
        role="group"
        aria-label="Keyboard shortcut practice"
        onKeyDown={(e) => {
          if (
            (e.ctrlKey || e.metaKey) &&
            ["s", "f", "z", "c", "v"].includes(e.key.toLowerCase())
          ) {
            e.preventDefault();
            setLast(
              {
                s: "Save: write edits to a file.",
                f: "Find: search the current document.",
                z: "Undo: reverse an edit.",
                c: "Copy: copy the selected content.",
                v: "Paste: insert copied content.",
              }[e.key.toLowerCase()] || "",
            );
          }
        }}
      >
        Click or Tab here, then try a shortcut.
      </div>
      <p role="status">{last}</p>
    </div>
  );
}
export function CSSStudio({ done }: { done: (s: string) => void }) {
  const [padding, setPadding] = useState(20),
    [margin, setMargin] = useState(12),
    [border, setBorder] = useState(2),
    [size, setSize] = useState(200),
    [color, setColor] = useState("#edb68b"),
    [direction, setDirection] = useState("row"),
    [align, setAlign] = useState("center"),
    [wrap, setWrap] = useState("wrap"),
    [gap, setGap] = useState(12);
  const css = `.profile { box-sizing: border-box; width: min(100%, ${size}px); padding: ${padding}px; margin: ${margin}px; border: ${border}px solid #80512b; background: ${color}; }\n.cards { display: flex; flex-direction: ${direction}; align-items: ${align}; flex-wrap: ${wrap}; gap: ${gap}px; }`;
  return (
    <>
      <div className="experiment">
        <span className="eyebrow">CSS PAINTING & BOX MODEL LAB</span>
        <h2>Change presentation, keep the meaning.</h2>
        <div className="v2-control-grid">
          {[
            ["Padding", padding, setPadding, 48],
            ["Margin", margin, setMargin, 36],
            ["Border", border, setBorder, 12],
            ["Declared width", size, setSize, 340],
          ].map(([label, value, set, max]) => (
            <label key={label as string}>
              {label as string}: {value as number}px
              <input
                type="range"
                aria-label={label as string}
                min={label === "Declared width" ? 100 : 0}
                max={max as number}
                value={value as number}
                onChange={(e) => (set as (n: number) => void)(+e.target.value)}
              />
            </label>
          ))}
          <label>
            Background
            <input
              aria-label="Card background"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </div>
        <div className="box-model-demo" style={{ padding: margin }}>
          <div
            style={{
              width: size,
              maxWidth: "100%",
              padding,
              border: `${border}px solid #80512b`,
              background: color,
              boxSizing: "border-box",
              color: "#32251a",
            }}
          >
            <b>Meaningful content</b>
            <p style={{ color: "#4d3b2b", fontSize: 12 }}>
              A profile card’s structure still uses a heading and a paragraph.
            </p>
          </div>
          <span>Margin outside · border · padding inside · content</span>
        </div>
        <p>
          With border-box the declared width includes padding and border.
          Approximate content width here:{" "}
          {Math.max(0, size - 2 * padding - 2 * border)}px before any container
          constraint.
        </p>
        <button
          className="button secondary compact"
          onClick={() => done("v2-css-experiment")}
        >
          Record this CSS experiment
        </button>
      </div>
      <div className="experiment">
        <span className="eyebrow">FLEXBOX PLAYGROUND</span>
        <div className="chip-row">
          <label>
            Direction
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              {["row", "column", "row-reverse", "column-reverse"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Align items
            <select value={align} onChange={(e) => setAlign(e.target.value)}>
              {["center", "stretch", "flex-start", "flex-end"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Wrapping
            <select value={wrap} onChange={(e) => setWrap(e.target.value)}>
              <option>wrap</option>
              <option>nowrap</option>
            </select>
          </label>
          <label>
            Gap
            <input
              aria-label="Flex gap"
              type="range"
              min="0"
              max="40"
              value={gap}
              onChange={(e) => setGap(+e.target.value)}
            />
            {gap}px
          </label>
        </div>
        <Lab
          key={css}
          initial={documentHTML(
            `<style>${css}\nbody {font:1rem/1.6 system-ui} a:focus-visible{outline:3px solid blue}</style>\n<h1>Our workshop</h1><div class="cards"><article class="profile"><h2>Design</h2><p>Plan the content.</p></article><article class="profile"><h2>Build</h2><p>Choose meaningful elements.</p></article><article class="profile"><h2>Test</h2><p>Review the result.</p></article></div>`,
          )}
        />
      </div>
      <div className="note-card">
        <h3>Independent CSS practice</h3>
        <p>
          In Project Workspace, style a labeled registration form, add :hover
          and :focus-visible to navigation links, then create a two-column
          layout with Grid: grid-template-columns: repeat(2,minmax(0,1fr)). Use
          a min-width media query so small screens start in one column. Compare
          320px and 1100px preview widths.
        </p>
        <pre>{`.cards { display: grid; gap: 1rem; }\n@media (min-width: 48rem) {\n  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}`}</pre>
      </div>
    </>
  );
}
export function PlanningCanvas({ go }: { go: (s: string) => void }) {
  const [idea, setIdea] = useState("A local repair workshop"),
    [audience, setAudience] = useState(
      "Neighbors who need a clear description of services",
    ),
    [goal, setGoal] = useState(
      "Help visitors decide whether to contact the workshop",
    ),
    [pages, setPages] = useState("Home, Services, Contact"),
    [notes, setNotes] = useState("");
  const list = pages
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 8);
  const plan = `WEBSITE PLAN\nIdea: ${idea}\nAudience: ${audience}\nObjective: ${goal}\n\nPages: ${list.join(" → ")}\n\nFor each page: specific title; h1; introduction; useful sections; consistent navigation; next action.\n\nContent and assets: original text, descriptive links, licensed images with alternatives, contact boundary.\n\nBuild: semantic HTML, shared external CSS, narrow-first layout.\nTest: paths, labels, images, headings, keyboard, 320px and wide viewport, load sizes.\nPublish: export, extract, upload through a real provider, verify public URL.\nMaintain: keep source, record changes, retest and republish.\n\nYour notes: ${notes}\n\nThis is a draft proposal, not validated customer research.`;
  return (
    <div className="experiment">
      <span className="eyebrow">WEBSITE PLANNING CANVAS</span>
      <div className="v2-form-grid">
        <label>
          Website idea
          <input value={idea} onChange={(e) => setIdea(e.target.value)} />
        </label>
        <label>
          Audience
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </label>
        <label>
          Objective
          <input value={goal} onChange={(e) => setGoal(e.target.value)} />
        </label>
        <label>
          Pages, separated by commas
          <input value={pages} onChange={(e) => setPages(e.target.value)} />
        </label>
      </div>
      <div className="wireframes">
        {list.map((p, i) => (
          <div key={i}>
            <span>Navigation: {list.join(" · ")}</span>
            <h3>{p}</h3>
            <div>Introduction and main message</div>
            <div>Evidence / details / useful content</div>
            <div>Clear next action</div>
            <small>Footer</small>
          </div>
        ))}
      </div>
      <p>
        This is a suggested sitemap and wireframe. Check the real audience’s
        needs before treating it as requirements.
      </p>
      <label>
        Content checklist and changes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </label>
      <div className="chip-row">
        <button
          className="button secondary"
          onClick={() =>
            downloadBlob(
              new Blob([plan], { type: "text/plain" }),
              "website-plan.txt",
            )
          }
        >
          <Download size={15} />
          Download plan
        </button>
        <button className="button primary" onClick={() => go("workspace")}>
          Build the plan
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
export function GitVisualizer() {
  const [working, setWorking] = useState("My first page"),
    [staged, setStaged] = useState<string | null>(null),
    [commits, setCommits] = useState<{ text: string; message: string }[]>([]),
    [remote, setRemote] = useState(0),
    [message, setMessage] = useState("Add first heading"),
    [notice, setNotice] = useState("");
  return (
    <div className="experiment">
      <span className="eyebrow">
        GIT VISUALIZER · NO REAL REMOTE CONNECTION
      </span>
      <div className="network-stages">
        {[
          "Working files",
          "Staged changes",
          `${commits.length} local commits`,
          `${remote} simulated remote commits`,
        ].map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <label>
        Working file contents
        <textarea
          value={working}
          onChange={(e) => setWorking(e.target.value)}
          rows={3}
        />
      </label>
      <label>
        Commit message
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <div className="chip-row">
        <button
          className="button secondary compact"
          onClick={() => {
            setStaged(working);
            setNotice(
              "Staged the current contents. Later edits remain separate until staged again.",
            );
          }}
        >
          Stage changes
        </button>
        <button
          className="button secondary compact"
          disabled={staged === null || !message.trim()}
          onClick={() => {
            setCommits([...commits, { text: staged!, message }]);
            setStaged(null);
            setNotice(
              "Created a local simulated commit. This did not push to GitHub.",
            );
          }}
        >
          Commit staged version
        </button>
        <button
          className="button primary compact"
          disabled={!commits.length || remote === commits.length}
          onClick={() => {
            setRemote(commits.length);
            setNotice(
              "Copied simulated commit history to the simulated remote. No files were uploaded.",
            );
          }}
        >
          Simulate push
        </button>
      </div>
      <p role="status">{notice}</p>
      <p>
        Staged contents: <code>{staged ?? "(nothing staged)"}</code>
      </p>
      <ol>
        {commits.map((c, i) => (
          <li key={i}>
            <b>{c.message}</b> — {c.text}{" "}
            <button
              className="text-button"
              onClick={() => {
                setWorking(c.text);
                setNotice(
                  "Restored this version to the working file. History is retained; stage and commit to record another version.",
                );
              }}
            >
              Restore to working files
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
export function DeploymentSimulator({ done }: { done: (s: string) => void }) {
  const [scenario, setScenario] = useState("ready"),
    [step, setStep] = useState(0),
    [url, setUrl] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [notice, setNotice] = useState("");
  const results: { [key: string]: string } = {
    ready:
      "The selected output has index.html and its referenced assets. The simulation can reach the public URL stage; nothing is really uploaded.",
    index:
      "No index.html at the selected root. Put it at the publication root or select the correct folder.",
    folder:
      "The chosen folder is the source parent instead of the folder containing index.html. Inspect the extracted structure.",
    link: "A link points to /about.html instead of a relative project page. Check the project subdirectory.",
    image:
      "The page arrived but its image is missing. Check exact case and upload the referenced asset.",
    base: "An asset URL assumes the origin root. On a project site it may need a project base or a relative path.",
    failed:
      "The simulated provider build failed. Inspect its error rather than repeatedly refreshing the public page.",
    cached:
      "The provider has an update, but the browser may reuse a stale resource. Confirm deployment success first, then investigate caching.",
  };
  return (
    <div className="experiment">
      <span className="eyebrow">DEPLOYMENT SIMULATOR</span>
      <select
        aria-label="Deployment scenario"
        value={scenario}
        onChange={(e) => {
          setScenario(e.target.value);
          setStep(0);
        }}
      >
        {Object.keys(results).map((s) => (
          <option value={s} key={s}>
            {s === "ready" ? "Ready to publish" : s + " problem"}
          </option>
        ))}
      </select>
      <div className="network-stages">
        {[
          "Local folder",
          "Repository",
          "Build / publish",
          "Hosted files",
          "Public URL",
        ].map((s, i) => (
          <button
            key={s}
            className={step === i ? "active" : ""}
            onClick={() => setStep(i)}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>
      <p>
        {step < 2
          ? "Organize actual source files. A simulated repository here does not create one in your account."
          : results[scenario]}
      </p>
      <button
        className="button secondary compact"
        onClick={() => setStep((step + 1) % 5)}
      >
        Next publishing step
        <ArrowRight size={14} />
      </button>
      <hr />
      <h3>Record your own real deployment</h3>
      <p>
        Only use this after completing an external provider workflow. HTML LAB
        cannot independently verify ownership or publication. This milestone is
        labeled self-reported.
      </p>
      <label>
        Actual public HTTPS URL
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setConfirmed(false);
          }}
          placeholder="https://your-site.example/"
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />{" "}
        I personally opened this public site and checked its pages after the
        provider reported success.
      </label>
      <button
        className="button primary compact"
        disabled={!confirmed}
        onClick={() => {
          try {
            const parsed = new URL(url);
            if (
              parsed.protocol !== "https:" ||
              ["localhost", "127.0.0.1"].includes(parsed.hostname)
            )
              throw Error();
            done("v2-deployment-self-reported");
            setNotice(
              "Recorded as your self-reported deployment milestone, not a provider-verified publication.",
            );
          } catch {
            setNotice(
              "Use a real public HTTPS URL after following the external publishing guide.",
            );
          }
        }}
      >
        Record self-reported completion
      </button>
      <p role="status">{notice}</p>
    </div>
  );
}
export function InspectorSimulator() {
  const [node, setNode] = useState("h1"),
    [panel, setPanel] = useState("elements");
  const info: {
    [key: string]: {
      html: string;
      css: string;
      parent: string;
      computed: string;
    };
  } = {
    h1: {
      html: '<h1 class="title">Field guide</h1>',
      css: ".title { color: #80512b; font-size: 2rem; }",
      parent: "main",
      computed:
        "font-size: 32px when the root font size is 16px; color: rgb(128,81,43)",
    },
    p: {
      html: "<p>Observe, describe, and share.</p>",
      css: "p { line-height: 1.7; }",
      parent: "main",
      computed: "line-height: 27.2px when font-size is 16px",
    },
    img: {
      html: '<img src="images/plant.png" alt="A labeled leaf diagram">',
      css: "img { max-width: 100%; height: auto; }",
      parent: "figure",
      computed:
        "Image unavailable in the broken scenario; inspect the request path.",
    },
  };
  return (
    <div className="experiment">
      <span className="eyebrow">GUIDED INSPECTOR SIMULATION</span>
      <div className="chip-row">
        {["elements", "styles", "computed", "network", "console", "source"].map(
          (p) => (
            <button
              className={`chip ${panel === p ? "active" : ""}`}
              key={p}
              onClick={() => setPanel(p)}
            >
              {p}
            </button>
          ),
        )}
      </div>
      <div className="inspector-simulation">
        <div>
          {["h1", "p", "img"].map((n) => (
            <button
              className={node === n ? "selected" : ""}
              onClick={() => setNode(n)}
              key={n}
            >
              {n === "h1"
                ? "Field guide"
                : n === "p"
                  ? "Observe, describe, and share."
                  : "▧ Missing leaf diagram"}
              <code>&lt;{n}&gt;</code>
            </button>
          ))}
        </div>
        <pre>
          {panel === "elements"
            ? `${info[node].html}\nParent: ${info[node].parent}\n${node === "img" ? "Void element: no child nodes." : "The element contains a text node."}`
            : panel === "styles"
              ? info[node].css
              : panel === "computed"
                ? info[node].computed
                : panel === "network"
                  ? "GET index.html    200   text/html\nGET css/style.css 200   text/css\nGET images/plant.png 404 image/png\n\nThe missing image is a separate failed request."
                  : panel === "console"
                    ? "Example warning: resource not found: images/plant.png\nInvestigate this path; do not paste unknown console commands."
                    : "Source can omit tbody or contain a paragraph around a heading. The HTML parser may insert or repair nodes. Inspect shows the resulting live DOM, not necessarily the original source."}
        </pre>
      </div>
      <p>
        These values are a predefined model, not measurements of your browser.
        Use the existing DOM Explorer for your own HTML, and real browser tools
        for actual computed styles and requests.
      </p>
    </div>
  );
}
function luminance(hex: string) {
  const values = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}
export function AccessibilityWorkshop() {
  const [fg, setFg] = useState("#777777"),
    [bg, setBg] = useState("#ffffff"),
    [manual, setManual] = useState<string[]>([]);
  const a = luminance(fg),
    b = luminance(bg),
    ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return (
    <>
      <div className="experiment">
        <span className="eyebrow">ONE MEASUREMENT, NOT A CERTIFICATE</span>
        <div className="chip-row">
          <label>
            Text color
            <input
              aria-label="Text color"
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
            />
          </label>
          <label>
            Background
            <input
              aria-label="Background color"
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
            />
          </label>
        </div>
        <p style={{ background: bg, color: fg, padding: 20 }}>
          Read this sample text and compare contrast.
        </p>
        <h3>{ratio.toFixed(2)} : 1</h3>
        <p>
          {ratio >= 4.5
            ? "Meets the WCAG AA 4.5:1 contrast threshold for normal text in this color pair."
            : ratio >= 3
              ? "Meets 3:1 for qualifying large text, but not 4.5:1 for normal text."
              : "Below the 3:1 large-text threshold and 4.5:1 normal-text threshold."}{" "}
          This calculation does not assess font size, actual page context,
          interaction, or complete conformance.
        </p>
        <h3>Human review evidence</h3>
        {[
          "I followed the page using Tab and Shift+Tab.",
          "I could see focus and activate controls.",
          "I checked that alternatives communicate the image purpose.",
          "I read the heading outline and meaningful links.",
          "I reviewed labels, instructions, errors, and table headers.",
        ].map((t) => (
          <label className="manual-check" key={t}>
            <input
              type="checkbox"
              checked={manual.includes(t)}
              onChange={() =>
                setManual(
                  manual.includes(t)
                    ? manual.filter((x) => x !== t)
                    : [...manual, t],
                )
              }
            />
            {t}
          </label>
        ))}
        <button
          className="button secondary compact"
          onClick={() =>
            downloadBlob(
              new Blob(
                [
                  `MANUAL REVIEW NOTES\n${manual.join("\n")}\n\nColor pair: ${fg} / ${bg}; ratio ${ratio.toFixed(2)}:1.\nThis is learner-recorded evidence, not certification.`,
                ],
                { type: "text/plain" },
              ),
              "accessibility-review.txt",
            )
          }
        >
          Download my review notes
        </button>
      </div>
      <Lab
        initial={documentHTML(
          '<h1>Contact</h1><h3>Details</h3><input id="mail" name="email"><img src="missing.png"><p><a href="#missing">Click here</a></p>',
        )}
        task="Repair the heading jump, add a main landmark, associate a visible label, add useful image alternatives, fix the fragment, and add a specific meta description."
        solution={documentHTML(
          '<main><h1>Workshop contact</h1><h2>Details</h2><label for="mail">Email</label><input id="mail" name="email" type="email"><p id="help">Contact help is available in class.</p><a href="#help">Read contact help</a></main>',
        ).replace(
          "</head>",
          '<meta name="description" content="How to contact the fictional workshop."></head>',
        )}
        selectors="main; label[for='mail']; input[type='email']; meta[name='description']; a[href='#help']; #help"
      />
    </>
  );
}
export function DesignCritic() {
  const [answer, setAnswer] = useState("");
  return (
    <div className="experiment">
      <span className="eyebrow">DESIGN CRITIC</span>
      <div className="design-pair">
        <div className="poor-design">
          <h3>WELCOME!!!!!!!!</h3>
          <p>Everything you need in one place click here click here.</p>
          <span>Homeaboutservicescontact</span>
          <input
            aria-label="Poor design example field"
            placeholder="Your thing"
            disabled
          />
          <b>GO</b>
        </div>
        <div className="good-design">
          <h3>Book a repair assessment</h3>
          <p>Understand the service, then choose how to contact us.</p>
          <nav aria-label="Illustrated navigation">
            <span>Services</span>
            <span>About</span>
            <span>Contact</span>
          </nav>
          <label>
            Your message
            <textarea
              disabled
              rows={2}
              defaultValue="A persistent label identifies this field."
            />
          </label>
          <b>Request an assessment</b>
        </div>
      </div>
      <p>
        These are static comparison samples. Which version gives clearer
        navigation, readable spacing, and a persistent form label?
      </p>
      <div className="chip-row">
        {["The first version", "The second version"].map((a) => (
          <button className="chip" key={a} onClick={() => setAnswer(a)}>
            {a}
          </button>
        ))}
      </div>
      {answer && (
        <p role="status">
          {answer === "The second version"
            ? "Yes."
            : "Review the second version."}{" "}
          Grouped navigation, clear hierarchy, whitespace, and a persistent
          label reduce uncertainty. Styling is useful because of those effects,
          not because one palette is universally better.
        </p>
      )}
    </div>
  );
}
export function EssentialsTools() {
  const [kb, setKb] = useState(2400),
    [speed, setSpeed] = useState(5),
    [choice, setChoice] = useState("");
  return (
    <div className="experiment">
      <span className="eyebrow">IMAGE SIZE & LOADING MODEL</span>
      <label>
        Image size: {kb} KB
        <input
          aria-label="Image size KB"
          type="range"
          min="50"
          max="6000"
          step="50"
          value={kb}
          onChange={(e) => setKb(+e.target.value)}
        />
      </label>
      <label>
        Connection: {speed} Mbps
        <input
          aria-label="Connection Mbps"
          type="range"
          min="1"
          max="30"
          value={speed}
          onChange={(e) => setSpeed(+e.target.value)}
        />
      </label>
      <div className="waterfall-row">
        <span>HTML 20 KB</span>
        <i style={{ width: Math.max(2, (20 / kb) * 80) + "%" }} />
      </div>
      <div className="waterfall-row">
        <span>CSS 30 KB</span>
        <i style={{ width: Math.max(2, (30 / kb) * 80) + "%" }} />
      </div>
      <div className="waterfall-row">
        <span>Image {kb} KB</span>
        <i style={{ width: "80%" }} />
      </div>
      <p>
        Idealized image transfer:{" "}
        {((kb * 1000 * 8) / (speed * 1000000)).toFixed(2)} seconds. Reducing to
        200 KB would be about{" "}
        {((200 * 1000 * 8) / (speed * 1000000)).toFixed(2)} seconds at this
        bandwidth. This ignores latency, caching, parallel requests, decoding,
        and server overhead. It does not optimize an actual image.
      </p>
      <h3>Security mistake detective</h3>
      <pre>
        {
          "<!-- Fictional example: SECRET_KEY = DEMO-NOT-A-REAL-KEY -->\n<p>Our static HTML form securely creates real accounts.</p>"
        }
      </pre>
      <p>What is wrong with this example?</p>
      <div className="chip-row">
        {[
          "Public source cannot hide secrets; a static form is not authentication.",
          "Comments are always private.",
        ].map((c) => (
          <button className="chip" key={c} onClick={() => setChoice(c)}>
            {c}
          </button>
        ))}
      </div>
      {choice && (
        <p role="status">
          {choice.startsWith("Public") ? "Correct." : "Try again."} Comments are
          delivered source. Use appropriate server-side infrastructure for real
          secrets and authentication.
        </p>
      )}
    </div>
  );
}
export function JSConnection() {
  const [count, setCount] = useState(0),
    [shown, setShown] = useState(true),
    [value, setValue] = useState(""),
    [feedback, setFeedback] = useState("");
  return (
    <div className="experiment">
      <span className="eyebrow">
        CONTROLLED PREBUILT JAVASCRIPT · NO LEARNER SCRIPT EXECUTION
      </span>
      <h3>Count: {count}</h3>
      <div className="chip-row">
        <button
          className="button primary compact"
          onClick={() => setCount(count + 1)}
        >
          Increment counter
        </button>
        <button
          className="button secondary compact"
          onClick={() => setShown(!shown)}
        >
          {shown ? "Hide" : "Show"} explanation
        </button>
        <button
          className="button subtle compact"
          onClick={() => {
            setCount(0);
            setShown(true);
            setFeedback("");
          }}
        >
          <RotateCcw size={14} />
          Reset example
        </button>
      </div>
      <p hidden={!shown}>
        A click listener updates a value, then the DOM displays its new text.
        The count is temporary.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFeedback(
            value.trim()
              ? `The script can respond to “${value.slice(0, 50)}”. Nothing was submitted to a server.`
              : "Type a fictional topic first.",
          );
        }}
      >
        <label>
          Fictional learning topic
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={50}
          />
        </label>
        <button className="button secondary compact">
          Show local feedback
        </button>
      </form>
      <p role="status">{feedback}</p>
      <pre>{`const heading = document.querySelector('#count');\nbutton.addEventListener('click', () => {\n  count += 1;\n  heading.textContent = 'Count: ' + count;\n});`}</pre>
      <p>
        This code illustrates selection, events, and a text update. The
        interface uses predefined application behavior; no code from your editor
        is run.
      </p>
      <a
        href="https://shadabur-rahaman.github.io/js-lab/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Continue learning in JS LAB ↗
      </a>
    </div>
  );
}
