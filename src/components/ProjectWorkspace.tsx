import { useEffect, useId, useMemo, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-css";
import {
  Code2,
  Folder,
  FileCode,
  Save,
  Download,
  Upload,
  Plus,
  Trash2,
  ArrowRight,
  Monitor,
  Smartphone,
  CheckCircle2,
  RotateCcw,
  X,
} from "lucide-react";
import {
  safePath,
  fileType,
  resolvePath,
  validateFiles,
  assetFile,
  exportProject,
  importProject,
  downloadBlob,
  projectStore,
} from "../projectModel.mjs";
import { projectPreview } from "../projectPreview.mjs";
import { starterFiles } from "../data/v2Projects.mjs";
import { audit, checkStructure } from "../lib.mjs";
import { cssDiagnostics } from "../projectDiagnostics.mjs";
import ProjectReview, { type Review } from "./ProjectReview";
export type VFile = { type: string; data: string; mime?: string };
export type VFiles = Record<string, VFile>;
type Project = {
  id: string;
  name: string;
  files: VFiles;
  updated: number;
  review?: Review;
};
type Seed = {
  id: string;
  title: string;
  starter: VFiles;
  solution?: VFiles;
  sections?: string[];
  checks?: string[];
};
type Props = {
  guided?: boolean;
  seed?: Seed;
  done: (id: string) => void;
  teacher?: boolean;
};
export default function ProjectWorkspace({
  guided = false,
  seed,
  done,
  teacher = false,
}: Props) {
  const [project, setProject] = useState<Project>(() => ({
    id: crypto.randomUUID(),
    name: seed?.title || (guided ? "MyWebsite" : "My first website"),
    files: seed?.starter || (guided ? {} : starterFiles()),
    updated: Date.now(),
  }));
  const [records, setRecords] = useState<Project[]>([]),
    [active, setActive] = useState("index.html"),
    [tabs, setTabs] = useState(["index.html"]),
    [page, setPage] = useState("index.html"),
    [path, setPath] = useState("index.html"),
    [kind, setKind] = useState("file"),
    [newName, setNewName] = useState(""),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [dirty, setDirty] = useState(false),
    [live, setLive] = useState(!guided),
    [width, setWidth] = useState(900),
    [mode, setMode] = useState("guided"),
    [pendingDelete, setPendingDelete] = useState<string | null>(null),
    [confirmClear, setConfirmClear] = useState(false),
    [showSolution, setShowSolution] = useState(false),
    [hint, setHint] = useState(0),
    [storageReady, setStorageReady] = useState(false),
    [report, setReport] = useState<string[] | null>(null),
    [cssAdvice, setCssAdvice] = useState<string[]>([]),
    [previewFiles, setPreviewFiles] = useState(project.files),
    [savedEvidence, setSavedEvidence] = useState(false),
    [previewOpened, setPreviewOpened] = useState(false),
    [undo, setUndo] = useState<VFiles | null>(null),
    [find, setFind] = useState(""),
    [overflow, setOverflow] = useState<boolean | null>(null),
    [manualReviewed, setManualReviewed] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null),
    upload = useRef<HTMLInputElement>(null),
    imageUpload = useRef<HTMLInputElement>(null);
  const editorId = useId();
  const current = project.files[active];
  const token = useMemo(
    () =>
      Array.from(crypto.getRandomValues(new Uint8Array(18)), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join(""),
    [previewFiles, page],
  );
  const rendered = useMemo(
    () => projectPreview(previewFiles, page, token),
    [previewFiles, page, token],
  );
  useEffect(() => setOverflow(null), [previewFiles, page, width]);
  useEffect(() => {
    if (!pendingDelete && !confirmClear) return;
    const previous = document.activeElement as HTMLElement;
    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPendingDelete(null);
        setConfirmClear(false);
      }
      if (e.key === "Tab") {
        const buttons = [
          ...document.querySelectorAll<HTMLButtonElement>(
            ".inline-confirm button",
          ),
        ];
        const first = buttons[0],
          last = buttons.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", trap);
    return () => {
      window.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [pendingDelete, confirmClear]);
  useEffect(() => {
    projectStore("list")
      .then((items: unknown) => {
        setRecords(items as Project[]);
        setStorageReady(true);
      })
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(() => {
    if (!live) return;
    const timer = setTimeout(() => setPreviewFiles(project.files), 500);
    return () => clearTimeout(timer);
  }, [project.files, live]);
  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.data?.token !== token)
        return;
      if (
        e.data.type === "html-lab-metrics" &&
        typeof e.data.overflow === "boolean"
      ) {
        setOverflow(e.data.overflow);
        return;
      }
      if (e.data.type !== "html-lab-navigate") return;
      const target = e.data.path;
      if (
        typeof target === "string" &&
        previewFiles[target]?.type === "text" &&
        /\.html?$/i.test(target)
      ) {
        setPage(target);
        if (target !== page) done("v2-multipage");
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [previewFiles, token]);
  useEffect(() => {
    if (!dirty) return;
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", listener);
    const navigate = (e: Event) => {
      if (
        !window.confirm(
          "Leave this project with unsaved changes? Save or export first to keep them.",
        )
      )
        e.preventDefault();
    };
    window.addEventListener("html-lab-before-navigate", navigate);
    return () => {
      window.removeEventListener("beforeunload", listener);
      window.removeEventListener("html-lab-before-navigate", navigate);
    };
  }, [dirty]);
  function changeFiles(files: VFiles) {
    try {
      validateFiles(files);
      setUndo(project.files);
      setProject((p) => ({
        ...p,
        files,
        updated: Date.now(),
        review: p.review ? { ...p.review, stale: true } : undefined,
      }));
      if (!files[active]) {
        const first =
          Object.keys(files).find((n) => files[n].type !== "folder") || "";
        setActive(first);
        setTabs(first ? [first] : []);
      }
      if (!files[page])
        setPage(
          Object.keys(files).find((n) => /\.html?$/i.test(n)) || "index.html",
        );
      setDirty(true);
      setError("");
      setReport(null);
      setCssAdvice([]);
      setSavedEvidence(false);
      setManualReviewed(false);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function openFile(name: string) {
    setActive(name);
    setTabs((t) => (t.includes(name) ? t : [...t, name]));
  }
  function create() {
    try {
      const name = safePath(path.trim());
      if (
        project.files[name] ||
        Object.keys(project.files).some((p) => p.startsWith(name + "/"))
      )
        throw Error("That path already exists.");
      const file =
        kind === "folder"
          ? { type: "folder", data: "" }
          : { ...fileType(name), data: "" };
      if (file.type === "image")
        throw Error("Use Add image to import real image contents.");
      changeFiles({ ...project.files, [name]: file });
      if (file.type !== "folder") openFile(name);
      setNotice(`${kind === "folder" ? "Folder" : "File"} created: ${name}`);
      setPath("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function rename() {
    try {
      const target = safePath(newName.trim());
      if (project.files[target]) throw Error("That path already exists.");
      if (current.type !== "folder" && fileType(target).type !== current.type)
        throw Error("Keep the same text or image file category.");
      const files: VFiles = {};
      for (const [name, file] of Object.entries(project.files)) {
        const destination =
          name === active
            ? target
            : name.startsWith(active + "/")
              ? target + name.slice(active.length)
              : name;
        if (files[destination])
          throw Error("A renamed path would overwrite another file.");
        files[destination] = file;
      }
      validateFiles(files);
      changeFiles(files);
      setActive(target);
      setTabs((t) => t.map((n) => (n === active ? target : n)));
      if (page === active) setPage(target);
      setNewName("");
      setNotice(
        "Renamed or moved. Update any links that still use the old path.",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function copySelected() {
    try {
      const target = safePath(newName.trim());
      if (project.files[target]) throw Error("Choose a new path for the copy.");
      if (!current) throw Error("Select a file first.");
      const copied: VFiles = { ...project.files };
      for (const [name, file] of Object.entries(project.files))
        if (name === active || name.startsWith(active + "/")) {
          const destination =
            name === active ? target : target + name.slice(active.length);
          if (copied[destination])
            throw Error("A copied path would overwrite an existing file.");
          copied[destination] = { ...file };
        }
      validateFiles(copied);
      changeFiles(copied);
      openFile(target);
      setNewName("");
      setNotice(
        "Created an independent copy. Later edits to one copy do not update the other.",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function save() {
    try {
      validateFiles(project.files);
      if (!storageReady)
        throw Error("Device storage is unavailable. Export a ZIP instead.");
      await projectStore("save", project);
      setRecords((r) => [project, ...r.filter((p) => p.id !== project.id)]);
      setDirty(false);
      setSavedEvidence(true);
      setNotice(
        "Saved on this device. The original lesson progress is unchanged.",
      );
      if (Object.keys(project.files).some((p) => p.endsWith(".html")))
        done("v2-first-file");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function preview() {
    setPreviewFiles(project.files);
    setPreviewOpened(true);
    if (project.files[page]?.data.includes("<h1")) done("v2-first-page");
    setNotice(
      "Preview updated from the current files. It does not publish a website.",
    );
  }
  function exportZip() {
    try {
      const bytes = exportProject(project.files);
      downloadBlob(
        new Blob([bytes as BlobPart], { type: "application/zip" }),
        (project.name.replace(/[^a-z0-9-]/gi, "-") || "website") + ".zip",
      );
      done("v2-exported");
      setNotice(
        "Project ZIP exported. Keep a copy before clearing browser data.",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function load(p: Project, force = false) {
    if (
      dirty &&
      !force &&
      !window.confirm(
        "Replace the current unsaved view? Save or export first to keep these edits.",
      )
    )
      return;
    try {
      validateFiles(p.files);
      setProject(p);
      const first = p.files["index.html"]
        ? "index.html"
        : Object.keys(p.files).find((n) => /\.html?$/i.test(n)) ||
          Object.keys(p.files)[0] ||
          "";
      setActive(first);
      setTabs([first]);
      setPage(first);
      setPreviewFiles(p.files);
      setDirty(false);
      setReport(null);
      setCssAdvice([]);
      setSavedEvidence(false);
      setPreviewOpened(false);
      setUndo(null);
      setNotice(`Opened ${p.name}.`);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function importZip(file: File) {
    try {
      if (file.size > 8 * 1024 * 1024)
        throw Error("ZIP imports must be at most 8 MB.");
      const files = importProject(
        new Uint8Array(await file.arrayBuffer()),
      ) as VFiles;
      load({
        id: crypto.randomUUID(),
        name: file.name.replace(/\.zip$/i, ""),
        files,
        updated: Date.now(),
      });
      setDirty(true);
      setNotice(
        "ZIP imported into a new project. Save on this device to retain it.",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function image(file: File) {
    try {
      if (file.size > 2 * 1024 * 1024)
        throw Error("Images must be at most 2 MB before importing.");
      const name = safePath(`images/${file.name}`);
      if (project.files[name])
        throw Error(
          "An image with that path exists. Rename it first or choose another file.",
        );
      const value = assetFile(name, new Uint8Array(await file.arrayBuffer()));
      changeFiles({ ...project.files, [name]: value });
      openFile(name);
      setNotice(
        `Image added. Use src="${name}" from index.html; use ../images/... from a nested page.`,
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function check() {
    const issues: string[] = [];
    const cssFindings = cssDiagnostics(project.files);
    issues.push(
      ...cssFindings.filter((s) => s.includes("missing CSS resource")),
    );
    setCssAdvice(
      cssFindings.filter((s) => !s.includes("missing CSS resource")),
    );
    if (overflow === null || previewFiles !== project.files)
      issues.push(
        "Update the browser preview and wait for its viewport measurement before completing this check.",
      );
    if (overflow)
      issues.push(
        `The current ${width}px preview has horizontal overflow. Inspect fixed widths, padding, images, and long content.`,
      );
    let htmlCount = 0;
    for (const [name, file] of Object.entries(project.files)) {
      if (!/\.html?$/i.test(name)) continue;
      htmlCount++;
      for (const issue of audit(file.data)) issues.push(`${name}: ${issue}`);
      const doc = new DOMParser().parseFromString(file.data, "text/html");
      for (const node of [
        ...doc.querySelectorAll('a[href],img[src],link[rel="stylesheet"]'),
      ]) {
        const ref = node.getAttribute("href") || node.getAttribute("src") || "";
        if (ref.startsWith("#")) {
          let fragment = ref.slice(1);
          try {
            fragment = decodeURIComponent(fragment);
          } catch {
            /* Show the malformed fragment below. */
          }
          if (fragment && !doc.getElementById(fragment))
            issues.push(`${name}: fragment destination not found: ${ref}`);
          continue;
        }
        if (/^[a-z]+:/i.test(ref)) continue;
        const dest = resolvePath(name, ref);
        if (!dest || !project.files[dest])
          issues.push(`${name}: missing local resource ${ref}`);
        else {
          if (node.tagName === "LINK" && !/\.css$/i.test(dest))
            issues.push(`${name}: stylesheet ${ref} must point to a CSS file.`);
          if (node.tagName === "IMG" && project.files[dest].type !== "image")
            issues.push(
              `${name}: image ${ref} must point to an imported raster image.`,
            );
          if (
            node.tagName === "A" &&
            /\.html?$/i.test(dest) &&
            ref.includes("#")
          ) {
            let fragment = ref.slice(ref.indexOf("#") + 1);
            try {
              fragment = decodeURIComponent(fragment);
            } catch {
              /* Keep the original text for feedback. */
            }
            if (
              fragment &&
              !new DOMParser()
                .parseFromString(project.files[dest].data, "text/html")
                .getElementById(fragment)
            )
              issues.push(
                `${name}: fragment destination not found in ${dest}: #${fragment}`,
              );
          }
        }
      }
    }
    if (!Object.keys(project.files).some((n) => n === "index.html"))
      issues.push(
        "Put index.html at the website root for straightforward static hosting.",
      );
    if (!htmlCount) issues.push("Add an HTML page before testing.");
    if (seed?.checks) {
      const docs = Object.entries(project.files)
        .filter(([n]) => /\.html?$/i.test(n))
        .map(([, f]) => new DOMParser().parseFromString(f.data, "text/html"));
      for (const selector of seed.checks)
        if (!docs.some((d) => d.querySelector(selector)))
          issues.push(
            `Advanced project requirement not found: ${selector}. Review the brief and your source.`,
          );
    }
    if (seed?.sections) {
      const docs = Object.entries(project.files)
        .filter(([n]) => /\.html?$/i.test(n))
        .map(([, f]) => new DOMParser().parseFromString(f.data, "text/html"));
      if (docs.length < 3)
        issues.push(
          "The project brief asks for at least three linked HTML pages.",
        );
      if (!docs.some((d) => d.querySelector("figure img[alt][src]")))
        issues.push(
          "Include an appropriate project image with a text alternative in a figure.",
        );
      if (!Object.keys(project.files).some((n) => n.endsWith(".css")))
        issues.push("Add a shared external CSS file.");
      if (docs.some((d) => d.querySelectorAll("nav a[href]").length < 2))
        issues.push("Review consistent navigation on each page.");
    }
    setReport(issues);
    if (!issues.length) {
      done("v2-tested");
      if (seed?.id.startsWith("advanced-")) done(seed.id);
      if (
        Object.entries(project.files).some(
          ([n, f]) =>
            /\.html?$/i.test(n) &&
            new DOMParser()
              .parseFromString(f.data, "text/html")
              .querySelector('form label + input[type="email"]'),
        )
      )
        done("v2-form");
      if (htmlCount > 1) done("v2-multipage");
      if (
        Object.keys(project.files).some(
          (n) => n.endsWith(".css") && project.files[n].data.includes("{"),
        )
      )
        done("v2-styled");
      if (seed?.id === "capstone" && manualReviewed) done("v2-capstone");
    }
    setNotice(
      "Checks inspect structure and local resources. Review content quality, keyboard use, and viewport overflow manually too.",
    );
  }
  const tree = [
    ...new Set(
      Object.keys(project.files).flatMap((name) => {
        const parts = name.split("/");
        return parts.map((_, i) => parts.slice(0, i + 1).join("/"));
      }),
    ),
  ].sort();
  const htmlPages = Object.keys(project.files).filter((n) =>
    /\.html?$/i.test(n),
  );
  const hasFolder =
    tree.includes("MyWebsite") ||
    (project.name === "MyWebsite" &&
      Object.keys(project.files).some((p) => p.includes("/")));
  const firstHeading = Object.values(project.files).some(
    (f) => f.type === "text" && /<h1(?:\s|>)/i.test(f.data),
  );
  return (
    <section className="project-workspace">
      {guided && (
        <div className="zero-steps">
          <span className="eyebrow">VIRTUAL COMPUTER · A SAFE SIMULATION</span>
          <h2>A file becomes a webpage.</h2>
          <p>
            This combines a simulated File Explorer, a small code editor, and a
            browser. Nothing here changes your real computer’s folders. Follow
            the steps, then repeat them on your own computer.
          </p>
          <ol>
            {[
              ["Create a MyWebsite folder", hasFolder],
              [
                "Create index.html (inside it, or at the project root)",
                htmlPages.length > 0,
              ],
              ["Open it in the editor and write an h1", firstHeading],
              ["Save your project on this device", savedEvidence],
              [
                "Choose the HTML page and open the browser preview",
                previewOpened,
              ],
            ].map(([label, passed], i) => (
              <li key={i} className={passed ? "success" : ""}>
                {passed ? "✓" : "○"} {label as string}
              </li>
            ))}
          </ol>
          <p className="muted">
            Try index.html.txt: it is a text file, not an HTML page. Rename it
            to index.html and notice that it becomes available in the browser
            page list.
          </p>
        </div>
      )}
      <div className="workspace-toolbar">
        <label>
          Project name
          <input
            aria-label="Project name"
            value={project.name}
            maxLength={70}
            onChange={(e) => {
              setProject((p) => ({ ...p, name: e.target.value }));
              setDirty(true);
            }}
          />
        </label>
        <label>
          Open saved project
          <select
            aria-label="Open saved project"
            value=""
            onChange={(e) => {
              const record = records.find((p) => p.id === e.target.value);
              if (record) load(record);
            }}
          >
            <option value="">Choose a saved project</option>
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button secondary compact"
          onClick={() =>
            load({
              id: crypto.randomUUID(),
              name: "Untitled website",
              files: {},
              updated: Date.now(),
            })
          }
        >
          <Plus size={14} />
          New project
        </button>
        <button className="button primary compact" onClick={save}>
          <Save size={14} />
          Save on this device
        </button>
      </div>
      <div className="vfs-grid">
        <aside className="vfs-explorer">
          <div className="pane-heading">
            <span>
              <Folder size={14} /> FILE EXPLORER
            </span>
            <span>{dirty ? "UNSAVED" : "LOCAL"}</span>
          </div>
          <div className="file-tree">
            {tree.length ? (
              tree.map((name) => {
                const file = project.files[name],
                  folder = !file || file.type === "folder";
                return (
                  <button
                    key={name}
                    className={active === name ? "active" : ""}
                    style={{
                      paddingLeft: 10 + (name.split("/").length - 1) * 12,
                    }}
                    onClick={() => {
                      if (file) openFile(name);
                      else setPath(name + "/index.html");
                    }}
                  >
                    {folder ? <Folder size={13} /> : <FileCode size={13} />}
                    <span>{name.split("/").at(-1)}</span>
                  </button>
                );
              })
            ) : (
              <p>Create your first folder or file below.</p>
            )}
          </div>
          <div className="file-create">
            <label htmlFor="new-vfs-path">New path</label>
            <input
              id="new-vfs-path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="pages/about.html"
            />
            <select
              aria-label="Create file or folder"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
            <button className="button secondary compact" onClick={create}>
              Create {kind}
            </button>
          </div>
          <p className="muted">
            Folders are cupboards; files are the documents inside. A slash in a
            path separates folders.
          </p>
        </aside>
        <div className="vfs-code">
          <div className="vfs-tabs">
            {tabs
              .filter(
                (n) => project.files[n] && project.files[n].type !== "folder",
              )
              .map((n) => (
                <button
                  key={n}
                  className={active === n ? "active" : ""}
                  onClick={() => openFile(n)}
                >
                  {n}
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Close ${n}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        setTabs((t) => t.filter((x) => x !== n));
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTabs((t) => t.filter((x) => x !== n));
                    }}
                  >
                    ×
                  </span>
                </button>
              ))}
          </div>
          {current?.type === "text" ? (
            <>
              <label className="sr-only" htmlFor={editorId}>
                Project source code
              </label>
              <div className="workspace-editor">
                <Editor
                  value={current.data}
                  onValueChange={(data) => {
                    if (data.length > 80000) {
                      setError(
                        "Text files in the editor are limited to 80,000 characters.",
                      );
                      return;
                    }
                    changeFiles({
                      ...project.files,
                      [active]: { ...current, data },
                    });
                  }}
                  highlight={(code) =>
                    Prism.highlight(
                      code,
                      active.endsWith(".css")
                        ? Prism.languages.css
                        : Prism.languages.markup,
                      active.endsWith(".css") ? "css" : "markup",
                    )
                  }
                  padding={20}
                  tabSize={2}
                  insertSpaces
                  textareaId={editorId}
                  style={{
                    fontFamily: "Consolas,monospace",
                    fontSize: 12,
                    lineHeight: "23px",
                    minHeight: 310,
                  }}
                />
              </div>
              <div className="workspace-find">
                <label htmlFor="project-find">Find in this file</label>
                <input
                  id="project-find"
                  value={find}
                  onChange={(e) => setFind(e.target.value)}
                />
                {find && (
                  <span>
                    {current.data.split(find).length - 1} exact matches
                  </span>
                )}
              </div>
            </>
          ) : current?.type === "image" ? (
            <div className="asset-preview">
              <img src={current.data} alt={`Imported asset: ${active}`} />
              <p>
                Use an img element with appropriate alt text in your page. The
                filename is not automatically good alt text.
              </p>
            </div>
          ) : (
            <div className="workspace-empty">
              <Code2 size={30} />
              <h3>
                {current?.type === "folder"
                  ? "Folder selected"
                  : "Choose or create a file"}
              </h3>
              <p>
                Create index.html, write a heading, save, and preview. For a
                complete starter use the three-page template.
              </p>
              <button
                className="button secondary"
                onClick={() =>
                  load({
                    id: crypto.randomUUID(),
                    name: "Three-page starter",
                    files: starterFiles() as VFiles,
                    updated: Date.now(),
                  })
                }
              >
                Open a three-page starter
              </button>
            </div>
          )}
          {current && (
            <div className="file-actions">
              <input
                aria-label="Rename or move selected path"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New full path"
              />
              <button
                className="button subtle compact"
                disabled={!newName.trim()}
                onClick={rename}
              >
                Rename / move
              </button>
              <button
                className="button subtle compact"
                disabled={!newName.trim()}
                onClick={copySelected}
              >
                Copy to new path
              </button>
              <button
                className="icon-button"
                aria-label="Delete selected file or folder"
                onClick={() => setPendingDelete(active)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="workspace-actions">
        <button className="button primary compact" onClick={preview}>
          <Monitor size={14} />
          Open browser preview
        </button>
        <label>
          <input
            type="checkbox"
            checked={live}
            onChange={(e) => setLive(e.target.checked)}
          />
          Preview as I type
        </label>
        <button className="button secondary compact" onClick={check}>
          <CheckCircle2 size={14} />
          Check project
        </button>
        <button className="button subtle compact" onClick={exportZip}>
          <Download size={14} />
          Export ZIP
        </button>
        <button
          className="button subtle compact"
          onClick={() => upload.current?.click()}
        >
          <Upload size={14} />
          Import ZIP
        </button>
        <button
          className="button subtle compact"
          onClick={() => imageUpload.current?.click()}
        >
          Add image
        </button>
        <button
          className="button subtle compact"
          disabled={!undo}
          onClick={() => {
            if (undo) {
              const previous = project.files;
              setProject((p) => ({
                ...p,
                files: undo,
                updated: Date.now(),
                review: p.review ? { ...p.review, stale: true } : undefined,
              }));
              setUndo(previous);
              setDirty(true);
            }
          }}
        >
          <RotateCcw size={14} />
          Undo last edit
        </button>
      </div>
      <input
        className="sr-only"
        ref={upload}
        type="file"
        accept=".zip"
        aria-label="Import project ZIP"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importZip(f);
          e.target.value = "";
        }}
      />
      <input
        className="sr-only"
        ref={imageUpload}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        aria-label="Add project image"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) image(f);
          e.target.value = "";
        }}
      />
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="warning">
          {error}
        </p>
      )}
      <div className="preview-config">
        <label>
          Browser page
          <select
            aria-label="Browser page"
            value={page}
            onChange={(e) => {
              setPage(e.target.value);
              setPreviewFiles(project.files);
              setPreviewOpened(true);
            }}
          >
            {!htmlPages.length && <option>No HTML file yet</option>}
            {htmlPages.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <div className="chip-row">
          {[320, 390, 768, 1100].map((w) => (
            <button
              className={`chip ${width === w ? "active" : ""}`}
              key={w}
              onClick={() => setWidth(w)}
            >
              {w < 500 ? <Smartphone size={12} /> : <Monitor size={12} />} {w}px
            </button>
          ))}
        </div>
      </div>
      <div className="project-preview-scroll">
        <iframe
          ref={frame}
          title="Multi-file project preview"
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          srcDoc={rendered.html}
          style={{ width, maxWidth: "none", height: 420 }}
        />
      </div>
      <p
        className={overflow ? "warning" : "muted"}
        role="status"
        style={{ padding: "0 20px", fontSize: 11 }}
      >
        {!previewFiles[page]
          ? "Choose an HTML page to measure."
          : overflow === null
            ? "Measuring this preview…"
            : overflow
              ? "Horizontal overflow detected inside the project page."
              : "No horizontal overflow detected in the current preview."}{" "}
        Check other pages and widths too.
      </p>
      <p className="muted">
        Preview only: learner scripts, submissions, embeds, external assets, and
        CSS imports are blocked. A fixed isolated navigation bridge handles
        project links. Use the horizontal area to inspect wide previews on a
        phone; overflow inside the page needs your own review.
      </p>
      <p className="muted">
        ZIP export preserves your source files. Code blocked in this preview may
        behave differently when opened or hosted outside the lab. Review
        imported HTML before opening or publishing it.
      </p>
      {rendered.issues.length > 0 && (
        <details>
          <summary>{rendered.issues.length} preview resource notes</summary>
          {rendered.issues.map((i: string) => (
            <p key={i}>{i}</p>
          ))}
        </details>
      )}
      {report && (
        <div className="project-report">
          <h3>Project review</h3>
          {report.length ? (
            report.map((i, iKey) => (
              <p className="warning" key={iKey}>
                ○ {i}
              </p>
            ))
          ) : (
            <p className="success">
              ✓ These structure and path checks passed. Now review the content,
              keyboard access, and responsive behavior.
            </p>
          )}
          <p>
            No automatic check guarantees accessibility, SEO ranking, or
            complete project quality.
          </p>
        </div>
      )}
      {seed && (
        <div className="workspace-guidance">
          {seed.sections && (
            <label className="manual-check">
              <input
                type="checkbox"
                checked={manualReviewed}
                onChange={(e) => setManualReviewed(e.target.checked)}
              />
              I reviewed the audience-specific content, keyboard behavior, and
              narrow/wide layouts against the brief. This is my manual review,
              not automated certification.
            </label>
          )}
          <label>
            Challenge mode
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="guided">Guided</option>
              <option value="practice">Practice</option>
              <option value="independent">Independent</option>
            </select>
          </label>
          {mode === "guided" && (
            <p>
              Work one requirement at a time. Inspect the preview, explain your
              choice, and run the project checks.
            </p>
          )}
          {mode !== "independent" && (
            <>
              <button
                className="button subtle compact"
                onClick={() => setHint(Math.min(3, hint + 1))}
              >
                Next hint
              </button>
              {hint > 0 && (
                <p>
                  {
                    [
                      "Start with the page heading and one main landmark.",
                      "Use relative links from each file’s location; names are case-sensitive.",
                      "Link css/style.css in head; labels need ids; images need real asset paths.",
                    ][hint - 1]
                  }
                </p>
              )}
            </>
          )}
          {seed.solution && (
            <details>
              <summary>Reference solution — compare your decisions</summary>
              <p>
                Save your work before replacing it. Multiple valid solutions can
                satisfy the requirements.
              </p>
              <button
                className="button secondary"
                onClick={() => {
                  if (
                    window.confirm(
                      "Load the reference as a new project? Unsaved edits in this view will be replaced.",
                    )
                  ) {
                    setDirty(false);
                    load(
                      {
                        id: crypto.randomUUID(),
                        name: seed.title + " — reference",
                        files: seed.solution!,
                        updated: Date.now(),
                      },
                      true,
                    );
                    setDirty(true);
                    setShowSolution(true);
                  }
                }}
              >
                Load reference in a new project
              </button>
              {showSolution && (
                <p>
                  Reference loaded. Explain its structure and improve its
                  content.
                </p>
              )}
            </details>
          )}
        </div>
      )}
      {cssAdvice.length > 0 && (
        <div className="note-card">
          <h3>CSS suggestions</h3>
          <p>
            Unused selectors can be intentional. These suggestions do not block
            completion. CSS checks are not a complete syntax validator.
          </p>
          <ul>
            {cssAdvice.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <ProjectReview
        name={project.name}
        value={project.review}
        change={(review) => {
          setProject((p) => ({ ...p, review }));
          setDirty(true);
        }}
      />
      {teacher && (
        <div className="note-card">
          <h3>Classroom use · device-local workspace</h3>
          <p>
            5 min: predict file paths. 10 min: demonstrate one saved HTML file.
            15 min: guided two-page build. 20 min: independent styling and path
            repair. 10 min: peer review and export. Ask: what changed on disk,
            and what changed only in the preview?
          </p>
          <button
            className="button secondary compact"
            onClick={() =>
              downloadBlob(
                new Blob(
                  [
                    `PROJECT REVIEW: ${project.name}\n\nStructure: /4\nContent and audience: /4\nPaths and resources: /4\nKeyboard and alternatives: /4\nResponsive presentation: /4\n\nEvidence and next steps:\n${report?.join("\n") || "Run project checks, then complete a manual review."}`,
                  ],
                  { type: "text/plain" },
                ),
                "project-review.txt",
              )
            }
          >
            Download review rubric
          </button>
        </div>
      )}
      <details className="storage-controls">
        <summary>Saved projects & storage controls</summary>
        <p>
          Projects use IndexedDB on this browser. Nothing is uploaded. Export
          before clearing browser data. Up to 60 entries, 2 MB per file, and 8
          MB total; text editing is limited to 80,000 characters per file. ZIPs
          with scripts, SVG, hidden files, or unsafe paths are rejected.
        </p>
        {records.map((r) => (
          <div className="revision-row" key={r.id}>
            <span>{r.name}</span>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Delete saved project “${r.name}” from this device? Export first to keep it.`,
                  )
                )
                  projectStore("delete", r.id)
                    .then(() =>
                      setRecords((items) => items.filter((p) => p.id !== r.id)),
                    )
                    .catch((e: Error) => setError(e.message));
              }}
            >
              Delete saved copy
            </button>
          </div>
        ))}
        <button
          className="button subtle compact"
          onClick={() => setConfirmClear(true)}
        >
          Reset project storage only
        </button>
      </details>
      {pendingDelete && (
        <div role="alertdialog" aria-modal="true" className="inline-confirm">
          <p>
            Delete {pendingDelete} and its children? This changes the current
            project; save afterward to update its saved copy.
          </p>
          <button
            className="button secondary compact"
            autoFocus
            onClick={() => setPendingDelete(null)}
          >
            Cancel
          </button>
          <button
            className="button primary compact"
            onClick={() => {
              changeFiles(
                Object.fromEntries(
                  Object.entries(project.files).filter(
                    ([n]) =>
                      n !== pendingDelete && !n.startsWith(pendingDelete + "/"),
                  ),
                ),
              );
              setPendingDelete(null);
            }}
          >
            Delete path
          </button>
        </div>
      )}
      {confirmClear && (
        <div role="alertdialog" aria-modal="true" className="inline-confirm">
          <p>
            Clear saved projects on this browser? Existing lesson progress and
            bookmarks will remain. Export first.
          </p>
          <button
            className="button secondary compact"
            autoFocus
            onClick={() => setConfirmClear(false)}
          >
            Cancel
          </button>
          <button
            className="button primary compact"
            onClick={() =>
              projectStore("clear")
                .then(() => {
                  setRecords([]);
                  setConfirmClear(false);
                  setNotice(
                    "Saved projects cleared; the open project stays in memory until you leave. Export it if needed.",
                  );
                })
                .catch((e: Error) => setError(e.message))
            }
          >
            Clear project storage
          </button>
        </div>
      )}
    </section>
  );
}
