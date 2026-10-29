import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  FlaskConical,
  GitBranch,
  GraduationCap,
  History,
  Layers3,
  LayoutTemplate,
  Lightbulb,
  ListChecks,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  Trash2,
  X,
  Trophy,
  PanelLeftClose,
  Maximize2,
} from "lucide-react";
import {
  chapters,
  lessons,
  documentHTML,
  sources,
} from "./data/curriculum.mjs";
import {
  eras,
  projects,
  catalogGroups,
  elementNotes,
  sessions,
} from "./data/resources.mjs";
import { solutionFor } from "./data/solutions.mjs";
import { deepDives } from "./data/deepDives.mjs";
import {
  extraNotes,
  elementExample,
  elementChapter,
} from "./data/elements.mjs";
import { parseProgress, STORAGE_KEY } from "./lib.mjs";
import Lab from "./components/Lab";
import Quiz from "./components/Quiz";
import {
  NestingLab,
  TextLab,
  ImageDebugger,
  ListBuilder,
  MediaBuilder,
  ResponsiveImages,
  AttributeLab,
} from "./components/MoreExperiments";
import {
  LayersDemo,
  RequestDemo,
  Anatomy,
  StructureDemo,
  PathDemo,
  FormBuilder,
  TableBuilder,
  SemanticBuilder,
} from "./components/Experiments";

type Lesson = (typeof lessons)[number];
type Progress = {
  completed: string[];
  bookmarks: string[];
  scores: Record<string, number>;
  drafts: Record<string, string>;
};
function load(): Progress {
  try {
    return parseProgress(localStorage.getItem(STORAGE_KEY));
  } catch {
    return parseProgress(null);
  }
}
const benefits = [
  "A shared vocabulary lets different browsers retrieve and understand the same content.",
  "Historical context helps you recognize obsolete practices instead of copying them.",
  "A consistent skeleton makes documents easier to inspect, maintain, and adapt.",
  "Meaningful text structure supports scanning, navigation, and assistive technology.",
  "Descriptive links and alternatives keep content useful when resources or vision are limited.",
  "Explicit list and table relationships communicate organization beyond visual appearance.",
  "Native form controls supply keyboard behavior, labels, and useful browser validation.",
  "Meaningful regions expose the purpose and organization of page content.",
  "Native media and disclosure reduce the amount of custom interaction code required.",
  "Understanding the parsed tree turns browser behavior into something you can inspect.",
  "Clear semantics and content improve usability for people and machine readers.",
  "Combining small, tested structures produces useful complete documents.",
];
const limits = [
  "HTML alone does not supply general-purpose logic, layout styling, or server storage.",
  "Educational recreations show typical patterns, not exact historical browser rendering.",
  "A browser may repair bad markup; a rendered page is not proof of valid source.",
  "Semantic meaning and default visual appearance are different; CSS may change appearance.",
  "Relative resource paths need real files at the correct deployed location.",
  "Complex tables require additional review; simple relationships are easier to understand.",
  "Validation in the browser cannot secure a service or replace backend validation.",
  "Semantic tags do not prescribe layout or guarantee complete accessibility.",
  "Media requires real files and alternatives; support varies by browser and feature.",
  "DOM inspection cannot recover all original source errors after parser repair.",
  "Automated checks cannot guarantee WCAG conformance or search ranking.",
  "An exported document does not include a backend or automatically bundle linked assets.",
];
function NavIcon({ name }: { name: string }) {
  const icons: { [key: string]: typeof Compass } = {
    home: Compass,
    lab: Code2,
    history: History,
    elements: Layers3,
    projects: LayoutTemplate,
    assessment: ListChecks,
    revision: Bookmark,
  };
  const Icon = icons[name] || BookOpen;
  return <Icon size={17} />;
}
export default function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "home"),
    [progress, setProgress] = useState<Progress>(load),
    [teacher, setTeacher] = useState(false),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(""),
    [storageError, setStorageError] = useState(false),
    [reset, setReset] = useState(false),
    [present, setPresent] = useState(false),
    [searchOpen, setSearchOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const [page, id] = route.split("/");
  const lesson = lessons.find((l) => l.id === id) || lessons[0];
  useEffect(() => {
    const change = () => {
      setRoute(location.hash.slice(1) || "home");
      setMenu(false);
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  useEffect(() => {
    document.title = `${page === "lesson" ? lesson.title : "Learn HTML by Building"} · HTML LAB`;
  }, [page, id]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenu(false);
        setPresent(false);
        setReset(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  useEffect(() => {
    if (!searchOpen && !reset) return;
    const previous = document.activeElement as HTMLElement;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const controls = [
        ...document.querySelectorAll<HTMLElement>(
          '.modal-backdrop button:not([disabled]),.modal-backdrop input,.modal-backdrop [tabindex="0"]',
        ),
      ];
      const first = controls[0],
        last = controls.at(-1);
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !controls.includes(document.activeElement as HTMLElement))
      ) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", trap);
    return () => {
      window.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [searchOpen, reset]);
  const done = (key: string) =>
    setProgress((p) => ({
      ...p,
      completed: p.completed.includes(key)
        ? p.completed
        : [...p.completed, key],
    }));
  const bookmark = (key: string) =>
    setProgress((p) => ({
      ...p,
      bookmarks: p.bookmarks.includes(key)
        ? p.bookmarks.filter((k) => k !== key)
        : [...p.bookmarks, key],
    }));
  const score = (key: string, value: number) =>
    setProgress((p) => ({
      ...p,
      scores: {
        ...p.scores,
        [key]: Math.max(Number(p.scores[key]) || 0, value),
      },
    }));
  const saveDraft = (key: string, value: string) =>
    setProgress((p) =>
      p.drafts[key] === value
        ? p
        : { ...p, drafts: { ...p.drafts, [key]: value } },
    );
  const totalDone = lessons.filter((l) =>
      progress.completed.includes(l.id),
    ).length,
    percent = Math.round((totalDone / lessons.length) * 100);
  const next =
    lessons.find((l) => !progress.completed.includes(l.id)) || lessons[0];
  function go(target: string) {
    if (location.hash === `#${target}`) {
      setRoute(target);
      setMenu(false);
      setSearchOpen(false);
      return;
    }
    location.hash = target;
    setSearchOpen(false);
    setSearch("");
  }
  const navItems = [
    ["home", "Learning home"],
    ["lab", "HTML Live Lab"],
    ["history", "HTML Time Machine"],
    ["elements", "Element Explorer"],
    ["projects", "Project Studio"],
    ["assessment", "Final assessment"],
    ["revision", "Saved & revision"],
  ];
  return (
    <div className={`app ${present ? "presenting" : ""}`}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to main content
      </a>
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <a className="brand" href="#home">
          <span className="brand-icon">
            <Code2 size={24} />
          </span>
          <span>
            HTML<span className="brand-lab">LAB</span>
            <small>LEARN BY BUILDING</small>
          </span>
        </a>
        <div className="workspace-label">YOUR LEARNING WORKSPACE</div>
        <nav aria-label="Workspace">
          {navItems.map(([key, label]) => (
            <button
              key={key}
              className={`nav-link ${page === key ? "active" : ""}`}
              onClick={() => go(key)}
            >
              <NavIcon name={key} />
              <span>{label}</span>
              {key === "lab" && <span className="new-label">LIVE</span>}
              {page === key && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-course-title">
          <span>THE HTML PATH</span>
          <span>12 CHAPTERS</span>
        </div>
        <nav className="course-nav" aria-label="Course chapters">
          {chapters.map((c) => {
            const count = c.lessons.filter((l) =>
              progress.completed.includes(l.id),
            ).length;
            const active = page === "lesson" && lesson.chapter === c.id;
            return (
              <div className="chapter-group" key={c.id}>
                <button
                  className={`chapter-link ${active ? "current" : ""}`}
                  onClick={() => go(`lesson/${c.lessons[0].id}`)}
                >
                  <span
                    className={`chapter-number ${count === c.lessons.length ? "finished" : ""}`}
                  >
                    {count === c.lessons.length ? (
                      <Check size={12} />
                    ) : (
                      String(c.id).padStart(2, "0")
                    )}
                  </span>
                  <span>{c.title}</span>
                  <ChevronRight size={12} />
                </button>
                {active && (
                  <div className="subtopics">
                    {c.lessons.map((l) => (
                      <button
                        key={l.id}
                        className={id === l.id ? "selected" : ""}
                        onClick={() => go(`lesson/${l.id}`)}
                      >
                        <span
                          className={
                            progress.completed.includes(l.id)
                              ? "lesson-dot done"
                              : "lesson-dot"
                          }
                        />
                        {l.title}
                      </button>
                    ))}
                    <button
                      onClick={() => go(`lesson/${c.lessons[0].id}/quiz`)}
                    >
                      <ListChecks size={12} /> Chapter checkpoint
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="progress-heading">
            <span>Your learning journey</span>
            <b>{percent}%</b>
          </div>
          <div className="thin-progress">
            <span style={{ width: `${percent}%` }} />
          </div>
          <p>
            {totalDone} of {lessons.length} lessons completed
          </p>
          <button
            className={`teacher-toggle ${teacher ? "enabled" : ""}`}
            onClick={() => {
              setTeacher(!teacher);
              if (teacher) setPresent(false);
            }}
          >
            <GraduationCap size={17} />
            <span>Teacher mode</span>
            <span className="switch">
              <i />
            </span>
          </button>
          <button className="reset-link" onClick={() => setReset(true)}>
            Reset local progress
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Toggle course navigation"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb-icon">
              <BookOpen size={16} />
            </span>
            <span>Workspace</span>
            <ChevronRight size={12} />
            <b>
              {page === "lesson"
                ? `Chapter ${lesson.chapter}`
                : navItems.find((x) => x[0] === page)?.[1] || "Learning home"}
            </b>
          </div>
          <div className="topbar-right">
            <button
              className="search-button"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={15} />
              <span>Find a lesson</span>
              <kbd>Ctrl K</kbd>
            </button>
            <span className="topbar-divider" />
            <span className="student-avatar">
              {teacher ? <GraduationCap size={17} /> : <span>S</span>}
            </span>
            <span className="mode-label">
              {teacher ? "Teacher workspace" : "Student workspace"}
            </span>
          </div>
        </header>
        <main
          id="main-content"
          className="main-content"
          tabIndex={-1}
          ref={main}
        >
          {storageError && (
            <p role="status" className="notice">
              Browser storage is unavailable or full. You can keep learning, but
              changes may not persist.
            </p>
          )}
          {teacher && (
            <div className="teacher-banner">
              <GraduationCap size={18} />
              <b>Teacher mode</b>
              <span>
                Notes, questions, and classroom planning are available in each
                lesson.
              </span>
              <button
                className="button subtle compact"
                onClick={() => setPresent(!present)}
              >
                <Maximize2 size={14} />
                {present ? "Exit presentation" : "Presenter view"}
              </button>
            </div>
          )}
          {page === "home" ? (
            <>
              <div className="home-intro">
                <div className="eyebrow">
                  <span className="orange-line" /> YOUR FIRST STEP INTO THE WEB
                </div>
                <h1>
                  Great websites start
                  <br />
                  with <span>good structure.</span>
                </h1>
                <p className="intro-copy">
                  Every website you’ve ever visited started with structure.
                  <br className="desktop-break" /> That structure is HTML. Let’s
                  build yours.
                </p>
                <div className="hero-actions">
                  <button
                    className="button primary"
                    onClick={() => go(`lesson/${next.id}`)}
                  >
                    {totalDone
                      ? "Continue your journey"
                      : "Start learning HTML"}
                    <ArrowRight size={17} />
                  </button>
                  <button className="button subtle" onClick={() => go("lab")}>
                    <Code2 size={17} />
                    Open the live lab
                  </button>
                </div>
                <div className="hero-meta">
                  <span>
                    <CheckCircle2 size={13} />
                    No experience needed
                  </span>
                  <span>
                    <ShieldCheck size={13} />
                    No account. Just curiosity.
                  </span>
                  <span>
                    <BookOpen size={13} />
                    12 hands-on chapters
                  </span>
                </div>
                <div className="hero-code" aria-hidden="true">
                  <div className="floating-tag tag-one">&lt;html&gt;</div>
                  <div className="hero-code-card">
                    <div className="code-dots">
                      <i />
                      <i />
                      <i />
                      <span>your-first-page.html</span>
                    </div>
                    <pre>
                      <span className="syntax-comment">
                        &lt;!-- A little code. A whole new world. --&gt;
                      </span>
                      {"\n"}
                      <span className="syntax-tag">&lt;h1&gt;</span>Hello,
                      world.<span className="syntax-tag">&lt;/h1&gt;</span>
                      {"\n"}
                      <span className="syntax-tag">&lt;p&gt;</span>I made this.
                      <span className="syntax-tag">&lt;/p&gt;</span>
                    </pre>
                    <div className="hero-code-result">
                      <span>THE BROWSER SEES</span>
                      <strong>Hello, world.</strong>
                      <p>I made this.</p>
                    </div>
                  </div>
                  <div className="floating-tag tag-two">&lt;/&gt;</div>
                  <div className="hero-mini-badge">
                    <span className="status-dot green" /> From code to something
                    real.
                  </div>
                </div>
              </div>
              <div className="philosophy-strip">
                <span>THE WAY WE LEARN</span>
                {[
                  "Understand",
                  "Visualize",
                  "Predict",
                  "Experiment",
                  "Make mistakes",
                  "Fix",
                  "Build",
                ].map((t, i) => (
                  <span key={t}>
                    {i > 0 && <ChevronRight size={11} />}
                    <b className={i === 6 ? "accent" : ""}>{t}</b>
                  </span>
                ))}
              </div>
              <section className="start-section">
                <div className="section-top">
                  <div>
                    <span className="eyebrow">
                      LESS READING. MORE DISCOVERING.
                    </span>
                    <h2>Your browser is your classroom.</h2>
                    <p className="muted">
                      Write a little HTML. See what happens. Make it your own.
                    </p>
                  </div>
                  <button className="text-button" onClick={() => go("lab")}>
                    Explore the playground
                    <ArrowUpRight size={15} />
                  </button>
                </div>
                <Lab
                  initial={documentHTML(
                    "<h1>Hello, world! 👋</h1>\n<p>I’m learning how to build the web.</p>\n\n<h2>A few things I want to make</h2>\n<ul>\n  <li>My own portfolio</li>\n  <li>A page for my favorite things</li>\n  <li>Something nobody has thought of yet</li>\n</ul>",
                  )}
                  task="Change the heading. Add something you want to build. The preview is yours."
                />
              </section>
              <section className="paths-section">
                <div className="section-top">
                  <div>
                    <span className="eyebrow">A PATH, NOT A PILE OF TAGS</span>
                    <h2>Small steps. Real understanding.</h2>
                  </div>
                  <span className="muted">Beginner → Intermediate</span>
                </div>
                <div className="path-cards">
                  {[
                    {
                      n: "01 — 03",
                      title: "Meet the web",
                      desc: "Understand the why. Travel through HTML’s history. Build your first document.",
                      icon: GlobeIcon,
                      id: "web",
                      color: "orange",
                    },
                    {
                      n: "04 — 07",
                      title: "Make it meaningful",
                      desc: "Work with words, links, images, tables, and forms that actually make sense.",
                      icon: Layers3,
                      id: "headings",
                      color: "blue",
                    },
                    {
                      n: "08 — 12",
                      title: "Build for the real world",
                      desc: "Think semantically. Build accessibly. Bring everything together in a real project.",
                      icon: LayoutTemplate,
                      id: "landmarks",
                      color: "green",
                    },
                  ].map((c) => (
                    <button
                      className={`path-card ${c.color}`}
                      key={c.n}
                      onClick={() => go(`lesson/${c.id}`)}
                    >
                      <div>
                        <span className="path-icon">
                          <c.icon size={21} />
                        </span>
                        <ArrowUpRight size={17} />
                      </div>
                      <span className="eyebrow">CHAPTERS {c.n}</span>
                      <h3>{c.title}</h3>
                      <p>{c.desc}</p>
                      <span className="path-card-action">
                        Explore chapters
                        <ArrowRight size={14} />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
              <div className="home-demo-grid">
                <StructureDemo />
                <LayersDemo />
              </div>
              <Anatomy />
              <div className="bottom-invite">
                <div>
                  <span className="eyebrow">
                    YOUR CURIOSITY IS THE ONLY PREREQUISITE
                  </span>
                  <h2>
                    Don’t just memorize HTML tags.
                    <br />
                    Understand how the web is built.
                  </h2>
                </div>
                <button
                  className="button primary"
                  onClick={() => go("lesson/web")}
                >
                  Build your first page
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : page === "lesson" ? (
            <LessonView
              key={lesson.id}
              lesson={lesson}
              teacher={teacher}
              progress={progress}
              done={done}
              bookmark={bookmark}
              score={score}
              go={go}
              saveDraft={saveDraft}
              initialTab={route.endsWith("/quiz") ? "quiz" : "learn"}
            />
          ) : page === "lab" ? (
            <>
              <PageHeading
                eyebrow="YOUR IDEAS, RENDERED"
                title="HTML Live Lab"
                description="Write it. Run it. Break it. Understand it. A safe space to explore real HTML."
              />
              <TemplateLab progress={progress} saveDraft={saveDraft} />
            </>
          ) : page === "history" ? (
            <HistoryView />
          ) : page === "elements" ? (
            <ElementsView go={go} />
          ) : page === "projects" ? (
            <ProjectsView
              progress={progress}
              saveDraft={saveDraft}
              done={done}
            />
          ) : page === "assessment" ? (
            <>
              <PageHeading
                eyebrow="PUT IT ALL TOGETHER"
                title="The HTML knowledge challenge"
                description="36 questions covering every chapter. Immediate explanations, a saved best score, and as many retakes as you need."
              />
              <Quiz chapter={1} final onScore={(n) => score("final", n)} />
              {progress.scores.final !== undefined && (
                <p className="success">
                  Best final score: {progress.scores.final}%
                </p>
              )}
              <h2>Practical final task</h2>
              <p>
                Build a portfolio with navigation, a main landmark, sections, an
                article, a list, and a labeled email form.
              </p>
              <Lab
                initial={documentHTML("<h1>My final project</h1>")}
                solution={projects[0].solution.replace(
                  "</main>",
                  '<form><label for="email">Email</label><input id="email" name="email" type="email"><button>Submit demo</button></form></main>',
                )}
                selectors="nav a[href]; main section; article; ul > li; form label; input[type='email'][name]"
                onPass={() => done("final-practical")}
              />
            </>
          ) : page === "revision" ? (
            <>
              <PageHeading
                eyebrow="KEEP THE IMPORTANT PARTS CLOSE"
                title="Saved & revision"
                description="Revisit your bookmarks, inspect your progress, and turn weak spots into understanding."
              />
              <div className="stats-row">
                <div>
                  <b>{totalDone}</b>
                  <span>Lessons completed</span>
                </div>
                <div>
                  <b>{progress.bookmarks.length}</b>
                  <span>Lessons saved</span>
                </div>
                <div>
                  <b>
                    {progress.scores.final ?? "—"}
                    {progress.scores.final !== undefined ? "%" : ""}
                  </b>
                  <span>Best final assessment</span>
                </div>
              </div>
              <h2>Your saved lessons</h2>
              {!progress.bookmarks.length && (
                <p className="muted">
                  Use the bookmark button inside a lesson to save it here.
                </p>
              )}
              {lessons
                .filter((l) => progress.bookmarks.includes(l.id))
                .map((l) => (
                  <button
                    className="revision-row"
                    key={l.id}
                    onClick={() => go(`lesson/${l.id}`)}
                  >
                    <BookOpen size={17} />
                    <span>
                      {l.number} · {l.title}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                ))}
              <h2>Chapter checkpoints</h2>
              {chapters.map((c) => (
                <button
                  className="revision-row"
                  key={c.id}
                  onClick={() => go(`lesson/${c.lessons[0].id}/quiz`)}
                >
                  <span>
                    {c.id}. {c.title}
                  </span>
                  <b>
                    {progress.scores[`chapter-${c.id}`] !== undefined
                      ? `${progress.scores[`chapter-${c.id}`]}%`
                      : "Try checkpoint"}
                  </b>
                  <ArrowRight size={16} />
                </button>
              ))}
            </>
          ) : (
            <>
              <PageHeading
                eyebrow="LET’S GET YOU BACK ON TRACK"
                title="That page isn’t in the lab."
                description="Choose a chapter or return to your learning home."
              />
              <button className="button primary" onClick={() => go("home")}>
                Learning home
                <ArrowRight size={16} />
              </button>
            </>
          )}
          <footer className="app-footer">
            <a className="footer-brand" href="#home">
              <Code2 size={17} />
              HTML LAB
            </a>
            <span>Made for curious minds. Built on the open web.</span>
            <a
              href="https://shadabur-rahaman.github.io/js-lab/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next adventure: JS LAB
              <ArrowUpRight size={13} />
            </a>
          </footer>
        </main>
      </div>
      {menu && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      {searchOpen && (
        <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Find a lesson"
            className="search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal-head">
              <Search size={20} />
              <input
                autoFocus
                placeholder="Search lessons, concepts, and chapters…"
                aria-label="Search lessons"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="icon-button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
            <div className="search-results">
              {lessons
                .filter((l) =>
                  (l.title + " " + l.what)
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((l) => (
                  <button key={l.id} onClick={() => go(`lesson/${l.id}`)}>
                    <span>{l.number}</span>
                    {l.title}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
      {reset && (
        <div className="modal-backdrop">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            className="reset-modal"
          >
            <Trash2 size={25} />
            <h2 id="reset-title">Start a fresh learning journey?</h2>
            <p>
              This clears your completed lessons, scores, bookmarks, and saved
              editor drafts on this browser.
            </p>
            <div className="chip-row">
              <button
                className="button subtle"
                autoFocus
                onClick={() => setReset(false)}
              >
                Keep my progress
              </button>
              <button
                className="button primary"
                onClick={() => {
                  setProgress(parseProgress(null));
                  setReset(false);
                  go("home");
                }}
              >
                Reset progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function GlobeIcon({ size = 20 }: { size?: number }) {
  return <Compass size={size} />;
}
function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">
        <span className="orange-line" />
        {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function TemplateLab({
  progress,
  saveDraft,
}: {
  progress: Progress;
  saveDraft: (key: string, code: string) => void;
}) {
  const [template, setTemplate] = useState("blank");
  const templates: { [key: string]: string } = {
    blank: documentHTML(
      "<h1>Hello, world!</h1>\n<p>Make this page your own.</p>",
    ),
    article: solutionFor("sections"),
    form: solutionFor("controls"),
    table: solutionFor("tables"),
    media: solutionFor("modern"),
  };
  return (
    <>
      <div className="chip-row template-choices">
        <span className="muted">START WITH</span>
        {Object.keys(templates).map((t) => (
          <button
            key={t}
            className={`chip ${template === t ? "active" : ""}`}
            onClick={() => setTemplate(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <Lab
        key={template}
        initial={templates[template]}
        draft={progress.drafts[`lab-${template}`]}
        draftKey={`lab-${template}`}
        saveDraft={saveDraft}
      />
    </>
  );
}

function LessonView({
  lesson: l,
  teacher,
  progress,
  done,
  bookmark,
  score,
  go,
  saveDraft,
  initialTab,
}: {
  lesson: Lesson;
  teacher: boolean;
  progress: Progress;
  done: (key: string) => void;
  bookmark: (key: string) => void;
  score: (key: string, n: number) => void;
  go: (route: string) => void;
  saveDraft: (key: string, code: string) => void;
  initialTab: string;
}) {
  const [tab, setTab] = useState(initialTab);
  const chapter = chapters[l.chapter - 1];
  const index = lessons.findIndex((x) => x.id === l.id);
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  return (
    <>
      <div className="lesson-breadcrumb">
        <button onClick={() => go("home")}>The HTML path</button>
        <ChevronRight size={13} />
        <span>
          Chapter {l.chapter} · {chapter.title}
        </span>
      </div>
      <div className="lesson-heading">
        <div>
          <span className="eyebrow">
            LESSON {l.number}{" "}
            <span className="pill">
              {l.chapter < 7 ? "FOUNDATIONS" : "BUILDING CONFIDENCE"}
            </span>
          </span>
          <h1>{l.title}</h1>
          <p>{chapter.description}</p>
        </div>
        <button
          className={`bookmark-button ${progress.bookmarks.includes(l.id) ? "saved" : ""}`}
          onClick={() => bookmark(l.id)}
          aria-label={
            progress.bookmarks.includes(l.id)
              ? "Remove bookmark"
              : "Bookmark lesson"
          }
        >
          <Bookmark size={19} />
        </button>
      </div>
      <div className="lesson-tabs">
        {[
          ["learn", "Understand"],
          ["experiment", "Visualize & experiment"],
          ["practice", "Practice"],
          ["quiz", "Chapter quiz"],
          ...(teacher ? [["teacher", "Teaching notes"]] : []),
        ].map(([key, name]) => (
          <button
            key={key}
            className={tab === key ? "active" : ""}
            onClick={() => setTab(key)}
          >
            {name}
          </button>
        ))}
      </div>
      {tab === "learn" ? (
        <>
          <div className="lesson-overview">
            <div className="lesson-prose">
              <div className="concept-block">
                <span className="eyebrow">01 / THE IDEA</span>
                <h2>What is it?</h2>
                <p>{l.what}</p>
              </div>
              <div className="concept-block">
                <span className="eyebrow">02 / THE REASON</span>
                <h2>Why does it matter?</h2>
                <p>{l.why}</p>
              </div>
              <div className="concept-block">
                <span className="eyebrow">03 / PUT IT TO WORK</span>
                <h2>How to use it</h2>
                <p>{l.how}</p>
              </div>
              <div className="concept-block">
                <span className="eyebrow">04 / WORK THROUGH THE DETAILS</span>
                <h2>{deepDives[l.id as keyof typeof deepDives][0]}</h2>
                <p>{deepDives[l.id as keyof typeof deepDives][1]}</p>
              </div>
            </div>
            <aside className="lesson-context">
              <span className="context-icon">
                <Lightbulb size={23} />
              </span>
              <h3>A useful mental model</h3>
              <p>
                {
                  [
                    "The Internet is the road network. The Web is a delivery service using those roads. HTML is one kind of document it delivers.",
                    "A standard is a shared agreement about meaning and behavior. A historical edition is a snapshot of that agreement.",
                    "Source is the recipe; the DOM is the tree the browser constructs from it. Inspect both.",
                    "Choose the meaning first. The browser’s default appearance is only a starting point.",
                    "A path is a set of directions from the current document. An alternative describes the information an image contributes.",
                    "Lists express membership or sequence. Tables express relationships in a grid.",
                    "A form is the envelope and its labeled fields. A server is needed to receive and process it.",
                    "A semantic page is a document with signposts. Each signpost should describe the content it introduces.",
                    "Choose a native element for its purpose, then check that its resources and alternatives actually exist.",
                    "Attributes describe properties; the DOM shows the parsed relationships between nodes.",
                    "Good markup gives people useful information and native behavior. Testing checks whether that foundation works.",
                    "Build one meaningful section, inspect it, then combine it with the next.",
                  ][l.chapter - 1]
                }
              </p>
              <div className="context-rule" />
              <span className="eyebrow">YOUR GOAL</span>
              <p>{l.task}</p>
              <button
                className="text-button"
                onClick={() => setTab("practice")}
              >
                Try it yourself
                <ArrowRight size={14} />
              </button>
            </aside>
          </div>
          <div className="two-cards">
            <div className="note-card">
              <span className="eyebrow success">THE ADVANTAGE</span>
              <p>{benefits[l.chapter - 1]}</p>
            </div>
            <div className="note-card">
              <span className="eyebrow">KNOW THE LIMIT</span>
              <p>{limits[l.chapter - 1]}</p>
            </div>
          </div>
          <div className="mistake-card">
            <span className="warning-icon">!</span>
            <div>
              <h3>A common wrong turn</h3>
              <p>{l.mistake}</p>
            </div>
          </div>
          <h2>See the browser’s interpretation</h2>
          <p className="muted">
            Edit the example, predict what will change, and inspect the
            resulting tree.
          </p>
          <Lab key={l.id} initial={l.code} />
          <div className="recap">
            <span className="eyebrow">TAKE IT WITH YOU</span>
            <h2>Meaning first. Then markup.</h2>
            <ul>
              <li>{l.what.split(". ")[0]}.</li>
              <li>{benefits[l.chapter - 1]}</li>
              <li>Check your result: {l.task}</li>
            </ul>
            <button
              className="button primary"
              onClick={() => setTab("practice")}
            >
              Put it into practice
              <ArrowRight size={16} />
            </button>
          </div>
          <details className="sources">
            <summary>Documentation & historical references</summary>
            {sources.map(([label, url]) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </details>
        </>
      ) : tab === "experiment" ? (
        <>
          <div className="section-heading">
            <span className="eyebrow">SEE IT. CHANGE IT. EXPLAIN IT.</span>
            <h2>A concept you can interact with.</h2>
          </div>
          {l.chapter === 1 ? (
            <>
              <RequestDemo />
              <LayersDemo />
            </>
          ) : l.chapter === 2 ? (
            <HistoryView compact />
          ) : l.chapter === 3 ? (
            <NestingLab />
          ) : l.chapter === 4 ? (
            <TextLab />
          ) : l.chapter === 5 ? (
            <>
              <PathDemo />
              <ImageDebugger />
            </>
          ) : l.chapter === 6 ? (
            <>
              <ListBuilder />
              <TableBuilder />
            </>
          ) : l.chapter === 7 ? (
            <FormBuilder />
          ) : l.chapter === 8 ? (
            <SemanticBuilder />
          ) : l.chapter === 9 ? (
            <>
              <MediaBuilder />
              <ResponsiveImages />
            </>
          ) : l.chapter === 10 ? (
            <>
              <AttributeLab />
              <NestingLab />
            </>
          ) : (
            <Lab
              initial={l.code}
              task={`Predict the rendered result before editing. ${l.task}`}
              solution={solutionFor(l.id)}
              selectors={l.selector}
            />
          )}
        </>
      ) : tab === "practice" ? (
        <>
          <div className="section-heading">
            <span className="eyebrow">YOUR TURN TO BUILD</span>
            <h2>Start small. Then make it yours.</h2>
            <p>
              First, make one intentional change to the example. Then complete
              the independent task below.
            </p>
          </div>
          <Lab
            initial={l.code}
            solution={solutionFor(l.id)}
            task={l.task}
            selectors={l.selector}
            draft={progress.drafts[l.id]}
            draftKey={l.id}
            saveDraft={saveDraft}
            onPass={() => done(l.id)}
            hint={`${l.how} Watch out: ${l.mistake}`}
          />
          <div className="mini-challenge">
            <span className="eyebrow">INDEPENDENT VARIATION</span>
            <p>{deepDives[l.id as keyof typeof deepDives][2]}</p>
            <span className="eyebrow">CHAPTER MINI CHALLENGE</span>
            <h2>
              {
                [
                  "Create a web explainer",
                  "Build an early-web directory",
                  "Create your first complete document",
                  "Write a field journal article",
                  "Make a student profile page",
                  "Create a college timetable",
                  "Build a registration form",
                  "Modernize a div-heavy page",
                  "Create a multimedia lesson",
                  "Explain the parsed DOM",
                  "Repair an inaccessible page",
                  "Finish a complete portfolio",
                ][l.chapter - 1]
              }
            </h2>
            <p>
              {chapter.lessons.map((t: { task: string }) => t.task).join(" ")}
            </p>
            <p className="muted">
              Extend it: choose a fictional topic of your own, add one useful
              section, and explain your element choices to another learner.
            </p>
            <button className="button secondary" onClick={() => go("projects")}>
              Open Project Studio
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      ) : tab === "quiz" ? (
        <>
          <div className="section-heading">
            <span className="eyebrow">CHAPTER {l.chapter} CHECKPOINT</span>
            <h2>Check your understanding.</h2>
            <p>
              Questions include this chapter’s concepts and practical HTML
              reasoning.
            </p>
          </div>
          <Quiz
            chapter={l.chapter}
            onScore={(n) => score(`chapter-${l.chapter}`, n)}
          />
          {progress.scores[`chapter-${l.chapter}`] !== undefined && (
            <p className="success">
              Your best chapter score: {progress.scores[`chapter-${l.chapter}`]}
              %
            </p>
          )}
          <h3>Interactive coding checkpoint</h3>
          <Lab
            initial={l.code}
            task={l.task}
            selectors={l.selector}
            solution={solutionFor(l.id)}
            onPass={() => done(l.id)}
          />
        </>
      ) : tab === "teacher" ? (
        <TeacherNotes lesson={l} />
      ) : null}
      <div className="lesson-bottom">
        <button
          className="button subtle"
          disabled={!index}
          onClick={() => go(`lesson/${lessons[index - 1].id}`)}
        >
          <ArrowLeft size={15} />
          Previous lesson
        </button>
        <button className="button secondary" onClick={() => done(l.id)}>
          <CheckCircle2 size={16} />
          {progress.completed.includes(l.id)
            ? "Lesson completed"
            : "Mark as understood"}
        </button>
        <button
          className="button primary"
          onClick={() =>
            index < lessons.length - 1
              ? go(`lesson/${lessons[index + 1].id}`)
              : go("assessment")
          }
        >
          {index < lessons.length - 1 ? "Next lesson" : "Final assessment"}
          <ArrowRight size={15} />
        </button>
      </div>
    </>
  );
}

function HistoryView({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0),
    [mode, setMode] = useState("then"),
    [answer, setAnswer] = useState<number | null>(null);
  const era = eras[index];
  return (
    <div className="history-view">
      {!compact && (
        <PageHeading
          eyebrow="SOME IDEAS CHANGE EVERYTHING"
          title="The HTML Time Machine"
          description="From a few linked research documents to the structure of the modern web. Travel through the moments that mattered."
        />
      )}
      <div className="timeline">
        {eras.map((e, i) => (
          <button
            key={e.year}
            onClick={() => {
              setIndex(i);
              setAnswer(null);
              setMode("then");
            }}
            className={i === index ? "selected" : ""}
          >
            <span className="timeline-dot" />
            <b>{e.year}</b>
            <span>{e.label}</span>
          </button>
        ))}
      </div>
      <div className="era-panel">
        <div className="era-intro">
          <div>
            <span className="era-year">{era.year}</span>
            <span className="eyebrow">{era.label}</span>
            <h2>{era.name}</h2>
            <p>{era.why}</p>
          </div>
          <div>
            <h3>What changed</h3>
            <p>{era.changes}</p>
            <div className="historical-warning">
              <History size={17} />
              <p>{era.warning}</p>
            </div>
            <a
              className="text-button"
              href={era.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the primary reference
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="era-controls">
          <button
            className={`chip ${mode === "then" ? "active" : ""}`}
            onClick={() => setMode("then")}
          >
            Then · historical example
          </button>
          <button
            className={`chip ${mode === "now" ? "active" : ""}`}
            onClick={() => setMode("now")}
          >
            Now · modern equivalent
          </button>
        </div>
        <p className="muted">
          Educational recreation of typical markup, rendered by your modern
          browser. This is not exact historical browser emulation. Obsolete
          elements are shown for study only.
        </p>
        <Lab
          key={`${index}-${mode}`}
          initial={
            (mode === "then" ? era.code : era.modern).includes("<html")
              ? mode === "then"
                ? era.code
                : era.modern
              : documentHTML(mode === "then" ? era.code : era.modern, era.label)
          }
        />
        <div className="era-question">
          <span className="eyebrow">A MOMENT TO REFLECT</span>
          <h3>{era.question}</h3>
          <div className="chip-row">
            {era.options.map((o, i) => (
              <button
                className={`chip ${answer === i ? "active" : ""}`}
                key={i}
                onClick={() => setAnswer(i)}
              >
                {o}
              </button>
            ))}
          </div>
          {answer !== null && (
            <p
              role="status"
              className={answer === era.answer ? "success" : "warning"}
            >
              {answer === era.answer ? "Correct." : "Try again."} {era.changes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ElementsView({ go }: { go: (s: string) => void }) {
  const [query, setQuery] = useState(""),
    [group, setGroup] = useState("All"),
    [selected, setSelected] = useState("a");
  const entries = Object.entries(catalogGroups)
    .flatMap(([category, tags]) => tags.map((tag) => ({ category, tag })))
    .filter(
      (e) =>
        (group === "All" || e.category === group) &&
        e.tag.includes(query.replace(/[<>]/g, "").toLowerCase()),
    );
  const category =
    Object.entries(catalogGroups).find(([, tags]) =>
      tags.includes(selected),
    )?.[0] || "Document";
  const allNotes = { ...extraNotes, ...elementNotes };
  const notes = allNotes[selected as keyof typeof allNotes];
  const related = lessons.find(
    (l) =>
      l.chapter === elementChapter[category as keyof typeof elementChapter],
  );
  const example = elementExample(selected, category);
  return (
    <>
      <PageHeading
        eyebrow="A TOOLBOX OF MEANING"
        title="Visual Element Explorer"
        description="Look up an element, understand its purpose, and find it in a working lesson."
      />
      <div className="catalog-search">
        <Search size={17} />
        <input
          value={query}
          aria-label="Search HTML elements"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find an element… try input, article, or img"
        />
        <select
          aria-label="Element category"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option>All</option>
          {Object.keys(catalogGroups).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="catalog-layout">
        <div className="element-grid">
          {entries.map(({ tag, category }) => (
            <button
              className={`element-tile ${selected === tag ? "selected" : ""} ${category === "Historical" ? "obsolete" : ""}`}
              key={tag}
              onClick={() => setSelected(tag)}
            >
              <code>&lt;{tag}&gt;</code>
              <span>{category}</span>
            </button>
          ))}
          {!entries.length && <p>No matching elements.</p>}
        </div>
        <div className="element-details">
          <span className="eyebrow">ELEMENT REFERENCE</span>
          <h2>&lt;{selected}&gt;</h2>
          <span className="pill">
            {catalogGroups.Historical.includes(selected)
              ? "OBSOLETE · EDUCATIONAL ONLY"
              : "CURRENT HTML"}
          </span>
          <p>
            {notes?.[0] ||
              related?.what ||
              `The ${selected} element organizes its corresponding content. Use it within a valid parent context and inspect the working example below.`}
          </p>
          <h3>Important attributes</h3>
          <p>
            <code>
              {notes?.[1] || "Global attributes: id, class, lang, dir"}
            </code>
          </p>
          <h3>Use it thoughtfully</h3>
          <p>
            {related?.mistake ||
              "Choose this element for its meaning, preserve a logical reading order, and test with a keyboard."}
          </p>
          <p className="muted">
            Browser support depends on the feature and attribute. Review the
            current specification and test your target browsers.
          </p>
          <a
            className="text-button"
            href={`https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${selected}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation & compatibility
            <ArrowUpRight size={14} />
          </a>
          {related && (
            <button
              className="button secondary"
              onClick={() => go(`lesson/${related.id}`)}
            >
              Open related lesson
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
      <h2>A complete example in context</h2>
      <Lab key={selected} initial={example} />
    </>
  );
}

function ProjectsView({
  progress,
  saveDraft,
  done,
}: {
  progress: Progress;
  saveDraft: (key: string, s: string) => void;
  done: (key: string) => void;
}) {
  const [id, setId] = useState(projects[0].id);
  const p = projects.find((p) => p.id === id)!;
  return (
    <>
      <PageHeading
        eyebrow="FROM UNDERSTANDING TO MAKING"
        title="Project Studio"
        description="Six guided projects. Real content problems. Your HTML, your decisions, your next step."
      />
      <div className="project-grid">
        {projects.map((project, i) => (
          <button
            key={project.id}
            className={`project-card ${id === project.id ? "selected" : ""}`}
            onClick={() => setId(project.id)}
          >
            <span className="eyebrow">
              PROJECT {String(i + 1).padStart(2, "0")}{" "}
              <ArrowUpRight size={14} />
            </span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <span className="pill">
              {progress.completed.includes(`project-${project.id}`)
                ? "✓ STRUCTURE CHECKED"
                : project.level}
            </span>
          </button>
        ))}
      </div>
      <div className="project-brief">
        <span className="eyebrow">THE BRIEF</span>
        <h2>{p.title}</h2>
        <p>{p.description}</p>
        <div className="two-cards">
          <div>
            <h3>Before you begin</h3>
            <p>
              Review document structure, text, links, and semantic HTML. For
              forms and tables, complete Chapters 6 and 7 first.
            </p>
            <h3>Expected result</h3>
            <p>
              A complete document that meets the steps below, with a readable
              outline, useful links, and native controls where appropriate.
            </p>
          </div>
          <div>
            <h3>Your build plan</h3>
            <ol>
              {p.tasks.map((t: string) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <Lab
        key={id}
        initial={p.starter}
        solution={p.solution}
        task={p.tasks.join(" ")}
        selectors={p.selectors.join("; ")}
        draftKey={`project-${id}`}
        draft={progress.drafts[`project-${id}`]}
        saveDraft={saveDraft}
        onPass={() => done(`project-${id}`)}
        hint="Start with the heading outline. Build one section at a time. Add labels before form controls and use headers before table data."
      />
      <div className="two-cards">
        <div className="note-card">
          <span className="eyebrow">DEBUGGING CHECKPOINTS</span>
          <p>
            Inspect the DOM. Check every fragment destination and label/id pair.
            Test keyboard order. Review the HTML check panel, then verify paths
            in the exported document.
          </p>
        </div>
        <div className="note-card">
          <span className="eyebrow">MAKE IT YOUR OWN</span>
          <p>
            Add a second page, a glossary, or a native FAQ. Export each page
            separately and place linked assets alongside the HTML. Keep
            fictional sample data and explain any missing server behavior.
          </p>
        </div>
      </div>
    </>
  );
}

function TeacherNotes({ lesson: l }: { lesson: Lesson }) {
  const [running, setRunning] = useState(false),
    [seconds, setSeconds] = useState(0),
    [session, setSession] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  return (
    <div className="teacher-notes">
      <div className="teacher-timer">
        <Timer size={23} />
        <span>
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
        <button
          className="button secondary compact"
          onClick={() => setRunning(!running)}
        >
          {running ? "Pause" : "Start"} lesson timer
        </button>
        <button
          className="button subtle compact"
          onClick={() => {
            setSeconds(0);
            setRunning(false);
          }}
        >
          Reset
        </button>
      </div>
      <div className="teacher-objectives">
        <span className="eyebrow">LEARNING OBJECTIVE</span>
        <h2>
          Students can explain the concept and demonstrate it in a document.
        </h2>
        <p>{l.task}</p>
      </div>
      <div className="teaching-grid">
        {[
          ["Explain", l.what + " " + l.why],
          [
            "Demonstrate",
            "Run the example, narrate the rendered result, then edit one element or attribute. " +
              l.how,
          ],
          ["Ask", l.question],
          ["Expected answer", l.options[l.answer]],
          ["Common mistake", l.mistake],
          ["Practice", l.task],
          [
            "Transition",
            `Ask learners to explain their choice before moving to ${lessons[lessons.findIndex((t) => t.id === l.id) + 1]?.title || "the final assessment"}.`,
          ],
        ].map(([title, body], i) => (
          <div className="teaching-card" key={title}>
            <span className="eyebrow">
              {String(i + 1).padStart(2, "0")} / {title.toUpperCase()}
            </span>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <details>
        <summary>Exercise reference solution</summary>
        <pre>{solutionFor(l.id)}</pre>
      </details>
      <h2>A flexible 60-minute first class</h2>
      <div className="session-plan">
        {[
          ["0–5", "Why websites need HTML"],
          ["5–12", "Internet, Web, HTML, CSS, JavaScript"],
          ["12–20", "History and evolution"],
          ["20–30", "Tags, attributes, document structure"],
          ["30–42", "Headings, paragraphs, links, images"],
          ["42–52", "Guided first webpage"],
          ["52–60", "Quiz, challenge, recap"],
        ].map(([time, title]) => (
          <div key={time}>
            <code>{time} min</code>
            <span>{title}</span>
          </div>
        ))}
      </div>
      <h2>Plan a multi-class journey</h2>
      <label htmlFor="session-select">Choose a session</label>
      <select
        id="session-select"
        value={session}
        onChange={(e) => setSession(+e.target.value)}
      >
        {sessions.map((s, i) => (
          <option key={s} value={i}>
            Session {i + 1}: {s}
          </option>
        ))}
      </select>
      <div className="note-card">
        <h3>{sessions[session]}</h3>
        <p>
          Begin with a five-minute recall task. Explain one concept, predict a
          result together, demonstrate it, then let pairs modify the code and
          compare their decisions.
        </p>
        <p>
          Quick revision: name one useful element, one common mistake, and one
          check you would run. Extend practice or split the session to suit your
          class.
        </p>
        <label htmlFor="session-notes">
          Your session notes (kept while this view is open)
        </label>
        <textarea
          id="session-notes"
          rows={4}
          placeholder="Add classroom questions, timing adjustments, or follow-up tasks…"
        />
      </div>
    </div>
  );
}
