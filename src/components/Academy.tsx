import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  BookOpen,
  Code2,
  Download,
  Search,
  GraduationCap,
} from "lucide-react";
import { guides, glossary, stages, officialChecked } from "../data/academy.mjs";
import { industryProjects } from "../data/v2Projects.mjs";
import { bugs } from "../data/bugs.mjs";
import ProjectWorkspace, { type VFiles } from "./ProjectWorkspace";
import OfflineLessons from "./OfflineLessons";
import { downloadBlob } from "../projectModel.mjs";
import { catalogGroups, elementNotes } from "../data/resources.mjs";
import { extraNotes } from "../data/elements.mjs";
import {
  NetworkJourney,
  ComputerInstructions,
  CSSStudio,
  PlanningCanvas,
  GitVisualizer,
  DeploymentSimulator,
  InspectorSimulator,
  AccessibilityWorkshop,
  DesignCritic,
  EssentialsTools,
  JSConnection,
} from "./AcademyTools";
type Progress = {
  completed: string[];
  bookmarks: string[];
  scores: Record<string, number>;
  drafts: Record<string, string>;
};
type Props = {
  page: string;
  id?: string;
  go: (s: string) => void;
  done: (s: string) => void;
  progress: Progress;
  teacher: boolean;
  next: string;
};
export default function Academy({
  page,
  id,
  go,
  done,
  progress,
  teacher,
  next,
}: Props) {
  if (page === "workspace")
    return (
      <>
        <Heading
          label="YOUR OPTIONAL DEVELOPMENT ENVIRONMENT"
          title="Project Workspace"
          description="Create, organize, style, debug, and export a multi-page static website. Your projects stay on this device."
        />
        <ProjectWorkspace done={done} teacher={teacher} />
      </>
    );
  if (page === "zero")
    return (
      <ZeroPath
        go={go}
        done={done}
        progress={progress}
        next={next}
        teacher={teacher}
      />
    );
  if (page === "industry")
    return <Industry id={id} go={go} done={done} teacher={teacher} />;
  if (page === "bugs")
    return <BugArena id={id} go={go} done={done} teacher={teacher} />;
  if (page === "academy") {
    const guide = guides.find((g) => g.id === id);
    if (!guide) return <Toolkit go={go} progress={progress} />;
    return (
      <>
        <Heading
          label={`STAGE ${guide.stage} · ADDITIONAL LEARNING PATH`}
          title={guide.title}
          description={guide.description}
        />
        <Guide
          key={guide.id}
          guide={guide}
          go={go}
          done={done}
          teacher={teacher}
        />
      </>
    );
  }
  return <Toolkit go={go} progress={progress} />;
}
export function Heading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">
        <span className="orange-line" />
        {label}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function ZeroPath({
  go,
  done,
  progress,
  next,
  teacher,
}: {
  go: Props["go"];
  done: Props["done"];
  progress: Progress;
  next: string;
  teacher: boolean;
}) {
  const [selected, setSelected] = useState(false),
    [assessment, setAssessment] = useState(""),
    [showCheck, setShowCheck] = useState(false);
  return (
    <>
      <Heading
        label="START FROM ZERO · NO TECH BACKGROUND NEEDED"
        title="You don’t need a technical background."
        description="Begin with files, folders, and your first saved webpage. Choose a starting point; every part of the course remains open."
      />
      <div className="path-cards zero-choices">
        {[
          [
            "Start from absolute zero",
            "Create a folder and your first HTML file.",
            "zero",
          ],
          [
            "I know how to use a computer",
            "Learn the editor workflow, then use the existing HTML path.",
            "academy/editor",
          ],
          [
            "I know basic HTML",
            "Build and style a small multi-page website.",
            "academy/css",
          ],
          [
            "Continue my existing progress",
            "Return to your next unfinished HTML lesson.",
            `lesson/${next}`,
          ],
        ].map(([title, desc, target]) => (
          <button
            className="path-card"
            key={title}
            onClick={() => (target === "zero" ? setSelected(true) : go(target))}
          >
            <h3>{title}</h3>
            <p>{desc}</p>
            <span className="text-button">
              Begin here
              <ArrowRight size={14} />
            </span>
          </button>
        ))}
      </div>
      <details>
        <summary>Optional starting-point check</summary>
        <p>
          You saved index.html.txt. Why might it open as text rather than as a
          webpage?
        </p>
        <select
          aria-label="Starting point answer"
          value={assessment}
          onChange={(e) => {
            setAssessment(e.target.value);
            setShowCheck(false);
          }}
        >
          <option value="">Choose an explanation</option>
          <option value="extension">
            Its full filename still ends in .txt.
          </option>
          <option value="internet">
            It always needs paid Internet hosting first.
          </option>
        </select>
        <button
          className="button secondary compact"
          onClick={() => setShowCheck(true)}
        >
          Recommend a starting point
        </button>
        {showCheck && (
          <p role="status">
            {assessment === "extension"
              ? "You recognize file types. Try Editor School or continue with the original document-structure chapter."
              : "Start with computer and file fundamentals below. An HTML file can render locally without buying hosting."}{" "}
            This is a suggestion, never an access restriction.
          </p>
        )}
      </details>
      {selected && (
        <p className="notice" role="status">
          Start with the short explanations below, then follow the five steps in
          the virtual computer.
        </p>
      )}
      <Guide guide={guides[0]} go={go} done={done} teacher={teacher} noTool />
      <ComputerInstructions />
      <ProjectWorkspace
        key="zero-computer"
        guided
        done={done}
        teacher={teacher}
      />
      <div className="bottom-invite">
        <div>
          <h2>One saved page is a real first step.</h2>
          <p>
            Your original{" "}
            {progress.completed.filter((k) => !k.startsWith("v2-")).length}{" "}
            completion records remain available in the existing course.
          </p>
        </div>
        <button className="button primary" onClick={() => go("lesson/web")}>
          Continue to the HTML path
          <ArrowRight size={15} />
        </button>
      </div>
    </>
  );
}
function Toolkit({ go, progress }: { go: Props["go"]; progress: Progress }) {
  return (
    <>
      <Heading
        label="FROM ZERO TO A REAL WEBSITE"
        title="Your development toolkit"
        description="Use one next step at a time. The original twelve chapters are still your HTML foundation; these optional tools connect them to real development."
      />
      <div className="v2-journey">
        {stages.map((name, i) => (
          <div key={name}>
            <span>{i}</span>
            <b>{name}</b>
            <small>
              {i === 0
                ? "Files → editor → saved page"
                : i === 8
                  ? "External publication, honestly recorded"
                  : "Learn → experiment → build → review"}
            </small>
          </div>
        ))}
      </div>
      <div className="project-grid">
        {guides.map((g) => (
          <button
            className="project-card"
            key={g.id}
            onClick={() => go(`academy/${g.id}`)}
          >
            <span className="eyebrow">
              STAGE {g.stage}
              {progress.completed.includes(`v2-guide-${g.id}`) ? (
                <CheckCircle2 size={15} />
              ) : (
                <ArrowUpRight size={15} />
              )}
            </span>
            <h3>{g.title}</h3>
            <p>{g.description}</p>
          </button>
        ))}
      </div>
      <div className="two-cards">
        <button
          className="note-card toolkit-link"
          onClick={() => go("industry")}
        >
          <h2>Industry Project Lab</h2>
          <p>
            Seven new project briefs and downloadable multi-page workspaces. The
            original six projects remain in Project Studio.
          </p>
          <span className="text-button">
            Choose a real-world brief
            <ArrowRight size={14} />
          </span>
        </button>
        <button className="note-card toolkit-link" onClick={() => go("bugs")}>
          <h2>Bug Hunter arena</h2>
          <p>
            Investigate broken mini-sites with staged hints, a hypothesis, and
            structural/resource checks.
          </p>
          <span className="text-button">
            Repair your first bug
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
      <div className="experiment">
        <span className="eyebrow">USE THE TOOLS YOU ALREADY KNOW</span>
        <h2>Your HTML knowledge tools</h2>
        <div className="chip-row">
          <button
            className="button secondary compact"
            onClick={() => go("elements")}
          >
            Element playground & reference
          </button>
          <button
            className="button secondary compact"
            onClick={() => go("lesson/nesting/experiment")}
          >
            Nesting and DOM prediction
          </button>
          <button
            className="button secondary compact"
            onClick={() => go("lesson/landmarks/experiment")}
          >
            Semantic DOM tree builder
          </button>
          <button
            className="button secondary compact"
            onClick={() => go("lesson/markup/quiz")}
          >
            Tag matching and revision
          </button>
          <button
            className="button secondary compact"
            onClick={() =>
              downloadBlob(
                new Blob(
                  [
                    Object.entries(catalogGroups)
                      .map(
                        ([group, tags]) =>
                          group +
                          "\n" +
                          tags
                            .map(
                              (tag) =>
                                "<" +
                                tag +
                                "> — " +
                                ({ ...extraNotes, ...elementNotes }[
                                  tag as keyof typeof elementNotes
                                ]?.[0] ||
                                  "See the contextual element example."),
                            )
                            .join("\n"),
                      )
                      .join("\n\n"),
                  ],
                  { type: "text/plain" },
                ),
                "html-element-cheat-sheet.txt",
              )
            }
          >
            Download HTML cheat sheet
          </button>
        </div>
        <p>
          These open the existing lesson and reference tools. Keyboard practice
          is in Editor School; file structure and responsive testing live in
          Project Workspace.
        </p>
      </div>
      <Glossary go={go} />
      <OfflineLessons />
      <Achievements progress={progress} />
      <Roadmap go={go} />
    </>
  );
}
function Guide({
  guide,
  go,
  done,
  teacher,
  noTool = false,
}: {
  guide: (typeof guides)[number];
  go: Props["go"];
  done: Props["done"];
  teacher: boolean;
  noTool?: boolean;
}) {
  const [unit, setUnit] = useState(0),
    [checked, setChecked] = useState<string[]>([]);
  const current = guide.units[unit];
  return (
    <section className="academy-guide">
      <div className="lesson-tabs">
        {guide.units.map((u, i) => (
          <button
            key={u.title}
            className={i === unit ? "active" : ""}
            onClick={() => setUnit(i)}
          >
            {i + 1}. {u.title}
          </button>
        ))}
      </div>
      <div className="lesson-overview">
        <div className="lesson-prose">
          <div className="concept-block">
            <span className="eyebrow">WHY THIS EXISTS</span>
            <h2>{current.title}</h2>
            <p>{current.why}</p>
            <p>{current.what}</p>
          </div>
          <div className="concept-block">
            <span className="eyebrow">A FAMILIAR COMPARISON</span>
            <p>{current.analogy}</p>
          </div>
        </div>
        <aside className="lesson-context">
          <span className="eyebrow">TRY IT, THEN EXPLAIN IT</span>
          <p>{current.practice}</p>
          <div className="context-rule" />
          <span className="eyebrow">A COMMON WRONG TURN</span>
          <p>{current.mistake}</p>
        </aside>
      </div>
      <div className="guide-revision">
        <label>
          <input
            type="checkbox"
            checked={checked.includes(current.title)}
            onChange={() =>
              setChecked(
                checked.includes(current.title)
                  ? checked.filter((t) => t !== current.title)
                  : [...checked, current.title],
              )
            }
          />{" "}
          I can explain this idea and have attempted its practice task.
        </label>
        <button
          className="button secondary compact"
          onClick={() => {
            if (unit < guide.units.length - 1) setUnit(unit + 1);
            else {
              done(`v2-guide-${guide.id}`);
            }
          }}
        >
          {unit < guide.units.length - 1
            ? "Next concept"
            : "Record guide recap"}
          <ArrowRight size={14} />
        </button>
        <p className="muted">
          This records a learner recap, not an externally verified professional
          skill.
        </p>
      </div>
      {!noTool && (
        <>
          {guide.id === "computer" || guide.id === "editor" ? (
            <>
              <ComputerInstructions />
              <ProjectWorkspace guided done={done} teacher={teacher} />
            </>
          ) : guide.id === "web" ? (
            <NetworkJourney />
          ) : guide.id === "css" ? (
            <CSSStudio done={done} />
          ) : guide.id === "workflow" ? (
            <PlanningCanvas go={go} />
          ) : guide.id === "git" ? (
            <GitVisualizer />
          ) : guide.id === "publish" ? (
            <DeploymentSimulator done={done} />
          ) : guide.id === "devtools" ? (
            <InspectorSimulator />
          ) : guide.id === "access" ? (
            <AccessibilityWorkshop />
          ) : guide.id === "design" ? (
            <DesignCritic />
          ) : guide.id === "essentials" ? (
            <EssentialsTools />
          ) : guide.id === "javascript" ? (
            <JSConnection />
          ) : guide.id === "debug" ? (
            <BugArena go={go} done={done} teacher={teacher} />
          ) : null}
        </>
      )}
      {guide.links.length > 0 && (
        <details className="sources">
          <summary>Official documentation & next steps</summary>
          {guide.links.map(([name, url]) => (
            <a href={url} target="_blank" rel="noopener noreferrer" key={url}>
              {name}
              <ArrowUpRight size={13} />
            </a>
          ))}
          <p className="muted">
            Provider/editor guides checked {officialChecked}. Interface wording
            and account plans may change; follow the official source for current
            details.
          </p>
        </details>
      )}
      <div className="chip-row">
        <button className="button secondary" onClick={() => go("workspace")}>
          <Code2 size={16} />
          Use Project Workspace
        </button>
        <button className="button subtle" onClick={() => go("tools")}>
          Back to the toolkit
        </button>
        <button
          className="button subtle"
          onClick={() =>
            downloadBlob(
              new Blob(
                [
                  `${guide.title}\n\n${guide.units.map((u) => `${u.title}\nWHY: ${u.why}\nWHAT: ${u.what}\nANALOGY: ${u.analogy}\nPRACTICE: ${u.practice}\nDEBUG: ${u.mistake}`).join("\n\n")}\n\nSelf-review: Explain the idea, demonstrate one change, predict its effect, test it, and describe what you learned.\n`,
                ],
                { type: "text/plain" },
              ),
              guide.id + "-revision.txt",
            )
          }
        >
          <Download size={15} />
          Download original revision notes
        </button>
      </div>
      {teacher && (
        <TeacherExtension title={guide.title} practice={current.practice} />
      )}
    </section>
  );
}
function Glossary({ go }: { go: Props["go"] }) {
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState("href");
  const found = glossary.filter((g) =>
    g.slice(0, 2).join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const item = glossary.find((g) => g[0] === selected) || glossary[0];
  return (
    <section className="experiment">
      <span className="eyebrow">
        EXPLAIN LIKE I’M NEW · BUNDLED RULE-BASED REFERENCE
      </span>
      <h2>Small words for unfamiliar ideas.</h2>
      <label className="catalog-search">
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try href, repository, or browser"
          aria-label="Search beginner glossary"
        />
      </label>
      <div className="chip-row glossary-chips">
        {found.map((g) => (
          <button
            className={`chip ${selected === g[0] ? "active" : ""}`}
            key={g[0]}
            onClick={() => setSelected(g[0])}
          >
            {g[0]}
          </button>
        ))}
        {!found.length && <p>No term found. Try a shorter word.</p>}
      </div>
      <div className="note-card">
        <h3>{item[0]}</h3>
        <p>{item[1]}</p>
        <p>Analogy: {item[2]}</p>
        <pre>{item[3]}</pre>
        <button
          className="text-button"
          onClick={() => go(`academy/${item[4]}`)}
        >
          See it in context
          <ArrowRight size={14} />
        </button>
      </div>
      <p>
        This is deterministic bundled guidance, not a generative AI tutor. No
        code or personal information is uploaded.
      </p>
      <button
        className="button secondary compact"
        onClick={() =>
          downloadBlob(
            new Blob(
              [
                glossary
                  .map((g) => g[0] + ": " + g[1] + "\nExample: " + g[3])
                  .join("\n\n"),
              ],
              { type: "text/plain" },
            ),
            "html-lab-beginner-glossary.txt",
          )
        }
      >
        Download glossary & cheat sheet
      </button>
    </section>
  );
}
function Industry({
  id,
  go,
  done,
  teacher,
}: {
  id?: string;
  go: Props["go"];
  done: Props["done"];
  teacher: boolean;
}) {
  const p = industryProjects.find((p) => p.id === id);
  return (
    <>
      <Heading
        label="SEVEN ADDITIONAL REAL-WORLD BRIEFS"
        title={p ? p.title : "Industry Project Lab"}
        description={
          p
            ? p.goal
            : "Keep the six original guided projects, then apply your skills in a domain-relevant multi-page website. Use fictional information."
        }
      />
      {!p ? (
        <div className="project-grid">
          {industryProjects.map((p) => (
            <button
              className="project-card"
              key={p.id}
              onClick={() => go(`industry/${p.id}`)}
            >
              <span className="eyebrow">GUIDED → PRACTICE → INDEPENDENT</span>
              <h3>{p.title}</h3>
              <p>{p.goal}</p>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="project-brief">
            <h3>Target users</h3>
            <p>{p.audience}</p>
            <h3>Specialty content</h3>
            <ul>
              {p.sections.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="two-cards">
              <div>
                <h3>Requirements</h3>
                <ul>
                  {p.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Walkthrough</h3>
                <ol>
                  {p.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
            <p>
              Prerequisites: original HTML chapters for structure, links, forms,
              and tables; CSS Starter Lab for presentation. The expected result
              is an honest, usable three-page static site, not a backend
              service.
            </p>
            <p>
              Independent extension: add a case-study page with original
              licensed imagery and evidence of the design process. Common
              mistakes: incorrect relative links from nested pages, empty
              descriptions, fixed-width overflow, and claims that a static form
              sends messages.
            </p>
          </div>
          <ProjectWorkspace
            key={p.id}
            seed={
              p as unknown as {
                id: string;
                title: string;
                starter: VFiles;
                solution: VFiles;
                sections: string[];
              }
            }
            done={done}
            teacher={teacher}
          />
          <div className="note-card">
            <h3>Manual project review</h3>
            <p>
              Does the content answer the audience’s questions? Can a keyboard
              user follow navigation and controls? Does every image have an
              appropriate alternative? Is the site readable at 320px? Are units
              and claims accurate? Are all assets original or licensed? Record
              observations, not just a score.
            </p>
            <button
              className="text-button"
              onClick={() => go("academy/publish")}
            >
              Prepare the real deployment
              <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
    </>
  );
}
function BugArena({
  id,
  go,
  done,
  teacher,
}: {
  id?: string;
  go: Props["go"];
  done: Props["done"];
  teacher: boolean;
}) {
  const [selected, setSelected] = useState(id || bugs[0].id),
    [hint, setHint] = useState(0),
    [hypothesis, setHypothesis] = useState("");
  const b = bugs.find((b) => b.id === selected) || bugs[0];
  return (
    <>
      <Heading
        label="OBSERVE → REPRODUCE → HYPOTHESIZE → CHANGE → TEST"
        title="Bug Hunter"
        description="Investigate a broken site before looking at the fix. Start with the expected behavior and one piece of evidence."
      />
      <div className="chip-row">
        {bugs.map((b) => (
          <button
            key={b.id}
            className={`chip ${selected === b.id ? "active" : ""}`}
            onClick={() => {
              setSelected(b.id);
              setHint(0);
              setHypothesis("");
            }}
          >
            {b.title}
          </button>
        ))}
      </div>
      <div className="note-card">
        <span className="eyebrow">{b.level.toUpperCase()}</span>
        <h2>{b.title}</h2>
        <p>{b.description}</p>
        <label>
          My hypothesis
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            rows={2}
          />
        </label>
        <button
          className="button subtle compact"
          onClick={() => setHint(Math.min(b.hints.length, hint + 1))}
        >
          Reveal the next investigation hint
        </button>
        {hint > 0 && <p className="hint">{b.hints[hint - 1]}</p>}
      </div>
      <ProjectWorkspace
        key={b.id}
        seed={
          b as unknown as {
            id: string;
            title: string;
            starter: VFiles;
            solution: VFiles;
          }
        }
        done={(key) => {
          done(key);
          if (key === "v2-tested") done("v2-bug-fixed");
        }}
        teacher={teacher}
      />
      <p>
        After the checks, explain which cause your change addressed and retest
        another page. The overflow case also needs a narrow-viewport review.
      </p>
    </>
  );
}
function Achievements({ progress }: { progress: Progress }) {
  const items = [
    ["v2-first-file", "First saved HTML file"],
    ["v2-form", "Labeled form structure checked"],
    ["v2-first-page", "First previewed webpage"],
    ["v2-multipage", "Local multi-page navigation"],
    ["v2-bug-fixed", "First repaired bug"],
    ["v2-styled", "Styled project checked"],
    ["v2-exported", "Project ZIP exported"],
    ["v2-capstone", "Capstone structure checked"],
    ["v2-deployment-self-reported", "Public deployment · self-reported"],
  ];
  return (
    <section className="experiment">
      <span className="eyebrow">EVIDENCE OF YOUR JOURNEY</span>
      <h2>Progress you can explain.</h2>
      <div className="achievement-grid">
        {items.map(([key, label]) => (
          <div
            className={progress.completed.includes(key) ? "earned" : ""}
            key={key}
          >
            <CheckCircle2 size={18} />
            <span>{label}</span>
            <small>
              {progress.completed.includes(key)
                ? "Recorded on this device"
                : "Try the related activity"}
            </small>
          </div>
        ))}
      </div>
      <p>
        Practice actions and structural checks are local evidence. The
        public-deployment milestone requires your explicit real-world
        confirmation and remains self-reported.
      </p>
      <button
        className="button secondary compact"
        onClick={() =>
          downloadBlob(
            new Blob(
              [
                JSON.stringify(
                  {
                    exportedAt: new Date().toISOString(),
                    completed: progress.completed,
                    scores: progress.scores,
                    scope:
                      "Individual device-local learning record, not attendance or centralized grades.",
                  },
                  null,
                  2,
                ),
              ],
              { type: "application/json" },
            ),
            "my-html-lab-results.json",
          )
        }
      >
        Export my individual learning results
      </button>
    </section>
  );
}
function TeacherExtension({
  title,
  practice,
}: {
  title: string;
  practice: string;
}) {
  return (
    <div className="note-card teacher-extension">
      <span className="eyebrow">NON-CS CLASSROOM SUPPORT</span>
      <h2>Teach {title.toLowerCase()} in manageable steps.</h2>
      <p>
        0–5: use one familiar analogy. 5–15: demonstrate one concept. 15–25: ask
        students to predict and make one change. 25–40: guided practice. 40–52:
        independent task and peer review. 52–60: explain a mistake, recap, and
        assign homework. Adjust pacing instead of squeezing a complex guide into
        one class.
      </p>
      <p>
        Ask: “What changed? Why did it change? What did we save, and what did we
        only preview?” Expected answer: the saved source and rendered view are
        related but different artifacts.
      </p>
      <p>Homework: {practice}</p>
      <button
        className="button secondary compact"
        onClick={() =>
          downloadBlob(
            new Blob(
              [
                `PRACTICE SHEET: ${title}\n\nPredict:\n\nTask: ${practice}\n\nChange one thing:\n\nExpected result:\n\nObserved result:\n\nBug and hypothesis:\n\nEvidence of fix:\n\nReview rubric (0–4 each): meaning, functionality, paths, accessibility, responsive presentation.\n\nAll classroom records remain individual and device-local.`,
              ],
              { type: "text/plain" },
            ),
            "classroom-practice-sheet.txt",
          )
        }
      >
        Download printable practice sheet
      </button>
    </div>
  );
}
function Roadmap({ go }: { go: Props["go"] }) {
  return (
    <section className="experiment">
      <span className="eyebrow">WHAT YOU CAN BUILD NEXT</span>
      <h2>HTML → CSS → JavaScript → projects → publication.</h2>
      <p>
        HTML gives a document meaning. CSS creates readable layouts. JavaScript
        adds programmable behavior. Git records versions. Responsive design
        adapts your work. Projects connect these skills, and deployment makes
        the result available to visitors.
      </p>
      <p>
        After a complete beginner site, explore APIs for exchanging data,
        backend development for server processing, databases for persistence,
        frontend frameworks for complex interfaces, testing, and deployment
        workflows. These are next steps, not skills automatically mastered by
        finishing HTML LAB.
      </p>
      <div className="chip-row">
        <button
          className="button secondary"
          onClick={() => go("industry/capstone")}
        >
          Build the independent capstone
        </button>
        <a
          className="button primary"
          href="https://shadabur-rahaman.github.io/js-lab/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Continue in JS LAB
          <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}
