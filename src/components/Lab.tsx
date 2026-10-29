import { useEffect, useId, useMemo, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import {
  Play,
  RotateCcw,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  ChevronRight,
  Code2,
  GitBranch,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
  Eye,
} from "lucide-react";
import {
  previewHTML,
  parseHTML,
  checkStructure,
  audit,
  downloadHTML,
} from "../lib.mjs";

function TreeNode({
  node,
  depth = 0,
  onSelect,
}: {
  node: Node;
  depth?: number;
  onSelect: (n: Node) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const children = [...node.childNodes].filter(
    (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
  );
  if (depth > 10) return <span className="muted">Deeper nodes omitted</span>;
  const element = node.nodeType === 1 ? (node as Element) : null;
  return (
    <div className="tree-node">
      <div className="tree-row">
        <button
          aria-label={`${open ? "Collapse" : "Expand"} ${node.nodeName}`}
          onClick={() => setOpen(!open)}
          disabled={!children.length}
        >
          <ChevronRight
            size={12}
            style={{ transform: open ? "rotate(90deg)" : undefined }}
          />
        </button>
        <button className="tree-label" onClick={() => onSelect(node)}>
          {element
            ? `<${element.tagName.toLowerCase()}${element.id ? ` #${element.id}` : ""}>`
            : `#text “${node.textContent?.trim().slice(0, 50)}”`}
        </button>
      </div>
      {open &&
        children.slice(0, 70).map((child, i) => (
          <div className="tree-children" key={i}>
            <TreeNode node={child} depth={depth + 1} onSelect={onSelect} />
          </div>
        ))}
    </div>
  );
}
type Props = {
  initial: string;
  solution?: string;
  task?: string;
  selectors?: string;
  hint?: string;
  onPass?: () => void;
  draftKey?: string;
  saveDraft?: (key: string, code: string) => void;
  draft?: string;
};
export default function Lab({
  initial,
  solution,
  task,
  selectors,
  hint,
  onPass,
  draftKey,
  saveDraft,
  draft,
}: Props) {
  const [code, setCode] = useState(draft || initial),
    [rendered, setRendered] = useState(draft || initial),
    [live, setLive] = useState(true),
    [mobile, setMobile] = useState(false),
    [full, setFull] = useState(false),
    [bottom, setBottom] = useState("dom"),
    [notice, setNotice] = useState(""),
    [showHint, setShowHint] = useState(false),
    [compare, setCompare] = useState(false),
    [checks, setChecks] = useState<
      { selector: string; passed: boolean }[] | null
    >(null),
    [selected, setSelected] = useState<Node | null>(null);
  const editorId = useId();
  const labRef = useRef<HTMLDivElement>(null);
  const doc = useMemo(() => parseHTML(rendered), [rendered]);
  const preview = useMemo(() => previewHTML(rendered), [rendered]);
  const issues = useMemo(() => audit(rendered), [rendered]);
  useEffect(() => setSelected(null), [rendered]);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => setRendered(code), 400);
    return () => clearTimeout(t);
  }, [code, live]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (draftKey && saveDraft) saveDraft(draftKey, code);
    }, 700);
    return () => clearTimeout(t);
  }, [code, draftKey]);
  useEffect(() => {
    if (!full) return;
    const previous = document.activeElement as HTMLElement;
    labRef.current?.querySelector<HTMLElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "Tab") {
        const nodes = [
          ...labRef.current!.querySelectorAll<HTMLElement>(
            "button:not([disabled]),textarea,input,a[href]",
          ),
        ].filter((n) => n.getClientRects().length);
        const first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [full]);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 3500);
      return () => clearTimeout(t);
    }
  }, [notice]);
  function update(value: string) {
    if (value.length > 80000) {
      setNotice(
        "Keep documents under 80,000 characters for responsive editing.",
      );
      return;
    }
    setCode(value);
    setChecks(null);
  }
  function validate() {
    setRendered(code);
    const result = checkStructure(code, selectors || "h1; p");
    setChecks(result);
    if (result.every((r: { passed: boolean }) => r.passed)) {
      setNotice(
        "Structure checks passed. Review your content and rendering too.",
      );
      onPass?.();
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setNotice("HTML copied to your clipboard.");
    } catch {
      setNotice(
        "Clipboard unavailable. Select the editor text and copy manually.",
      );
    }
  }
  return (
    <div className={`lab ${full ? "lab-full" : ""}`} ref={labRef}>
      <div className="lab-toolbar">
        <span className="lab-name">
          <Code2 size={17} /> HTML Live Lab{" "}
          <span className="tiny-label">EXPERIMENT</span>
        </span>
        <div className="toolbar-actions">
          <label className="live-switch">
            <input
              type="checkbox"
              checked={live}
              onChange={(e) => setLive(e.target.checked)}
            />
            <span className={live ? "status-dot" : ""} />
            Live preview
          </label>
          <button
            className="icon-button"
            aria-label={full ? "Exit full screen" : "Full screen editor"}
            onClick={() => setFull(!full)}
          >
            {full ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>
      {task && (
        <div className="lab-task">
          <Lightbulb size={17} />
          <span>
            <b>Your experiment</b> {task}
          </span>
        </div>
      )}
      <div className="lab-split">
        <div className="editor-pane">
          <div className="pane-heading">
            <span>
              <i className="file-dot" />
              index.html
            </span>
            <span>
              HTML <span className="muted">⌘</span>
            </span>
          </div>
          <label className="sr-only" htmlFor={editorId}>
            HTML source code
          </label>
          <div className="editor-scroll">
            <div aria-hidden="true" className="line-numbers">
              {code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <Editor
              value={code}
              onValueChange={update}
              highlight={(value) =>
                Prism.highlight(value, Prism.languages.markup, "markup")
              }
              padding={20}
              tabSize={2}
              insertSpaces
              textareaId={editorId}
              textareaClassName="code-input"
              className="code-editor"
              style={{
                fontFamily: "Consolas, monospace",
                fontSize: 12,
                lineHeight: "23px",
                minHeight: 330,
              }}
              aria-label="HTML source code"
            />
          </div>
          <div className="editor-footer">
            <span>
              UTF-8 <span>HTML</span>
            </span>
            <span>{code.split("\n").length} lines</span>
          </div>
        </div>
        <div className="preview-pane">
          <div className="pane-heading">
            <span>
              <span className="status-dot green" /> Browser preview
            </span>
            <div className="device-switch">
              <button
                className={!mobile ? "selected" : ""}
                onClick={() => setMobile(false)}
                aria-label="Desktop preview"
              >
                <Monitor size={14} />
              </button>
              <button
                className={mobile ? "selected" : ""}
                onClick={() => setMobile(true)}
                aria-label="Mobile preview"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>
          <div className={`preview-surface ${mobile ? "mobile-preview" : ""}`}>
            <iframe
              title="Your rendered HTML"
              sandbox=""
              referrerPolicy="no-referrer"
              srcDoc={preview}
            />
          </div>
          <div className="preview-footer">
            <ShieldCheck size={12} /> Isolated preview · scripts & submissions
            disabled
          </div>
        </div>
      </div>
      <div className="lab-controls">
        <button
          className="button primary compact"
          onClick={() => {
            setRendered(code);
            setNotice("Preview updated.");
          }}
        >
          <Play size={14} />
          Run HTML
        </button>
        <button
          className="button subtle compact"
          onClick={() => {
            setCode(initial);
            setRendered(initial);
            setChecks(null);
            setCompare(false);
            setNotice("Starter restored.");
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button className="button subtle compact" onClick={copy}>
          <Copy size={14} />
          Copy
        </button>
        <button
          className="button subtle compact"
          onClick={() => downloadHTML(code)}
        >
          <Download size={14} />
          Download
        </button>
        <div className="spacer" />
        <button
          className="button subtle compact"
          onClick={() => setShowHint(!showHint)}
        >
          <Lightbulb size={14} />
          Hint
        </button>
        {solution && (
          <>
            <button
              className="button subtle compact"
              onClick={() => setCompare(!compare)}
            >
              <Eye size={14} />
              Compare
            </button>
            <button
              className="button subtle compact"
              onClick={() => {
                setCode(solution);
                setRendered(solution);
                setChecks(null);
                setNotice(
                  "Reference solution loaded. Explain its choices before moving on.",
                );
              }}
            >
              Reveal solution
            </button>
          </>
        )}
        {selectors && (
          <button className="button compact secondary" onClick={validate}>
            <CheckCircle2 size={14} />
            Check work
          </button>
        )}
      </div>
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}
      {showHint && (
        <div className="hint">
          <Lightbulb size={16} />
          {hint ||
            "Read the task as a checklist. Choose elements by their purpose, then inspect their relationships in the DOM below."}
        </div>
      )}
      {compare && solution && (
        <div className="compare">
          <h3>Reference example</h3>
          <p>
            Different valid structures may satisfy the same task. Compare
            meaning and relationships, not exact spelling.
          </p>
          <pre>{solution}</pre>
        </div>
      )}
      {checks && (
        <div className="check-results" aria-live="polite">
          {checks.map((c) => (
            <p key={c.selector} className={c.passed ? "success" : "warning"}>
              {c.passed ? "✓" : "○"} <code>{c.selector}</code>{" "}
              {c.passed
                ? "Found"
                : "Not found — inspect the required structure"}
            </p>
          ))}
        </div>
      )}
      <div className="inspector">
        <div className="inspector-tabs">
          <button
            className={bottom === "dom" ? "active" : ""}
            onClick={() => setBottom("dom")}
          >
            <GitBranch size={14} /> DOM Explorer
          </button>
          <button
            className={bottom === "audit" ? "active" : ""}
            onClick={() => setBottom("audit")}
          >
            <ShieldCheck size={14} />
            HTML check <span className="count">{issues.length}</span>
          </button>
        </div>
        {bottom === "dom" ? (
          <div className="dom-columns">
            <div className="dom-tree">
              {doc.querySelectorAll("*").length < 350 ? (
                <TreeNode node={doc.documentElement} onSelect={setSelected} />
              ) : (
                <p>Tree view limited to documents under 350 elements.</p>
              )}
            </div>
            <div className="node-details">
              <span className="eyebrow">ELEMENT INSPECTOR</span>
              {selected ? (
                <>
                  <h3>
                    {selected.nodeType === 1
                      ? `<${selected.nodeName.toLowerCase()}>`
                      : "#text"}
                  </h3>
                  {selected.nodeType === 1 ? (
                    [...(selected as Element).attributes].map((a) => (
                      <p key={a.name}>
                        <code>{a.name}</code> = {a.value}
                      </p>
                    ))
                  ) : (
                    <p>{selected.textContent}</p>
                  )}
                  <p className="muted">
                    {selected.childNodes.length} child nodes · Parent:{" "}
                    {selected.parentNode?.nodeName.toLowerCase()}
                  </p>
                </>
              ) : (
                <p className="muted">
                  Select a tag or text node to see its attributes and
                  relationships.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="audit-results">
            <p className="muted">
              A learning aid, not a complete conformance, accessibility, or SEO
              audit. The DOM parser repairs some source errors.
            </p>
            {issues.length ? (
              issues.map((x, i) => (
                <p key={i} className="warning">
                  ○ {x}
                </p>
              ))
            ) : (
              <p className="success">
                ✓ No issues found by these checks. Continue with keyboard and
                content review.
              </p>
            )}
            <a
              href="https://validator.w3.org/nu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the W3C Nu HTML Checker ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
