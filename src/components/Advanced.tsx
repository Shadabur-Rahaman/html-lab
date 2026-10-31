import { useEffect, useState } from "react";
import {
  advancedLessons,
  advancedQuestions,
  advancedReference,
  standardsChecked,
} from "../data/advanced.mjs";
import { advancedProjects } from "../data/advancedProjects.mjs";
import {
  advancedFragments,
  advancedMatches,
} from "../data/advancedExercises.mjs";
import Lab from "./Lab";
import Quiz from "./Quiz";
import ProjectWorkspace from "./ProjectWorkspace";
import { downloadBlob } from "../projectModel.mjs";
import {
  SemanticArchitecture,
  NativeFormLab,
  NativeUILab,
  ImageInspector,
  LanguageLab,
  ParserDetective,
  LoadingTimeline,
  ComponentAnatomy,
  SourceInspector,
} from "./AdvancedLabs";
type Progress = {
  completed: string[];
  bookmarks: string[];
  scores: Record<string, number>;
  drafts: Record<string, string>;
};
type Props = {
  id?: string;
  route: string;
  teacher: boolean;
  progress: Progress;
  go: (s: string) => void;
  done: (s: string) => void;
  score: (s: string, n: number) => void;
  bookmark: (s: string) => void;
  saveDraft: (s: string, value: string) => void;
};
type Lesson = (typeof advancedLessons)[number];
export default function Advanced(props: Props) {
  const { id, route, go, teacher, progress, done, score, bookmark, saveDraft } =
    props;
  const [tab, setTab] = useState("learn");
  if (id === "assessment")
    return (
      <>
        <Heading
          title="Advanced standards assessment"
          description="Apply and justify decisions across the optional advanced path. Uses the existing quiz engine and saved best-score system."
        />
        <Quiz
          questions={advancedQuestions}
          chapter={1}
          final
          onScore={(n) => score("advanced-final", n)}
        />
        <button className="button secondary" onClick={() => go("advanced")}>
          Back to advanced path
        </button>
      </>
    );
  if (id === "project") {
    const project = advancedProjects.find((p) => p.id === route.split("/")[2]);
    if (!project)
      return (
        <p>
          Project not found.{" "}
          <button onClick={() => go("advanced")}>
            Return to advanced path
          </button>
        </p>
      );
    return (
      <>
        <Heading title={project.title} description={project.focus} />
        <button
          className="button secondary compact"
          onClick={() => go("advanced")}
        >
          Advanced path
        </button>
        <div className="note-card">
          <h2>Project brief</h2>
          <ul>
            {project.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h3>Guided implementation</h3>
          <ol>
            {project.walkthrough.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <p>
            Independent task: choose a different subject and audience; implement
            the same requirements without copying the reference. Explain each
            choice and keep a record of tests.
          </p>
          <p>
            The workspace blocks scripts, remote media and form submissions. Use
            the trusted advanced labs for native behavior, then export and test
            in a real browser. The reference is a learning example, not
            certified production code.
          </p>
          <h3>Manual review & rubric</h3>
          <p>
            Review source conformance, keyboard/focus, responsive layout,
            content alternatives, language, privacy and resource loading. Record
            browser/date and evidence in the existing saved five-criterion
            project rubric. Validate exported source intentionally at Nu; the
            app sends nothing there.
          </p>
          <button
            className="button secondary compact"
            onClick={() =>
              downloadBlob(
                new Blob(
                  [
                    project.requirements.join("\n") +
                      "\n\n" +
                      project.walkthrough.join("\n") +
                      "\n\nManual evidence: browser/date; task; issue; fix; remaining limits.\nRubric 0–4 each: structure, content/audience, resources, keyboard/alternatives, responsive presentation.",
                  ],
                  { type: "text/plain" },
                ),
                "advanced-project-brief.txt",
              )
            }
          >
            Download brief & checklist
          </button>
        </div>
        <ProjectWorkspace
          key={project.id}
          seed={{
            id: "advanced-" + project.id,
            title: project.title,
            starter: project.starter,
            solution: project.solution,
            checks: project.checks,
          }}
          teacher={teacher}
          done={done}
        />
      </>
    );
  }
  const lesson = advancedLessons.find((l) => l.id === id);
  if (!lesson)
    return (
      <>
        <Heading
          title="ADVANCED HTML"
          description="From Markup to Web Standards Mastery · An optional continuation of your existing course."
        />
        <p>
          Begin with the original course, then investigate these deeper
          questions. Original completion percentages remain unchanged. Your
          advanced drafts and quiz scores save on this device.
        </p>
        <div className="path-cards">
          {advancedLessons.map((l, i) => (
            <button
              className="path-card"
              key={l.id}
              onClick={() => go("advanced/" + l.id)}
            >
              <span className="eyebrow">
                WORKSHOP {i + 1}{" "}
                {progress.completed.includes("advanced-" + l.id)
                  ? "· PRACTICE CHECKED"
                  : ""}
              </span>
              <h2>{l.title}</h2>
              <p>{l.intro}</p>
              <span className="text-button">Explore & practice →</span>
            </button>
          ))}
        </div>
        <h2>Build and justify your decisions</h2>
        <div className="path-cards">
          {advancedProjects.map((p) => (
            <button
              className="path-card"
              key={p.id}
              onClick={() => go("advanced/project/" + p.id)}
            >
              <h3>{p.title}</h3>
              <p>{p.focus}</p>
              <span className="text-button">Open project brief →</span>
            </button>
          ))}
        </div>
        <div className="note-card">
          <h2>Final advanced assessment</h2>
          <p>
            {advancedQuestions.length} explanation-based questions in the
            existing quiz engine. Best score:{" "}
            {progress.scores["advanced-final"] ?? "Not taken"}
            {progress.scores["advanced-final"] !== undefined ? "%" : ""}.
          </p>
          <button
            className="button primary"
            onClick={() => go("advanced/assessment")}
          >
            Take advanced assessment
          </button>
        </div>
        <Schedule />
        <p>
          References reviewed {standardsChecked}. Browser support changes;
          follow each lesson’s official documentation and test the browsers your
          audience uses.
        </p>
      </>
    );
  const key = "advanced-" + lesson.id;
  return (
    <>
      <Heading title={lesson.title} description={lesson.intro} />
      <div className="chip-row">
        <button
          className="button secondary compact"
          onClick={() => go("advanced")}
        >
          Advanced path
        </button>
        <button
          className="button secondary compact"
          onClick={() => bookmark(key)}
        >
          {progress.bookmarks.includes(key)
            ? "Bookmarked"
            : "Bookmark workshop"}
        </button>
        <span>
          {progress.completed.includes(key)
            ? "Structural practice checked"
            : "Optional advanced workshop"}{" "}
          · Best quiz: {progress.scores[key] ?? "—"}
          {progress.scores[key] !== undefined ? "%" : ""}
        </span>
      </div>
      <div className="lesson-tabs" aria-label="Advanced workshop views">
        {["learn", "experiment", "practice", "quiz"].map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? "active" : ""}
            aria-pressed={tab === t}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "learn" && (
        <>
          <div className="lesson-prose">
            <h2>Why this exists</h2>
            <p>{lesson.why}</p>
            <h2>Standards context</h2>
            <p>{lesson.context}</p>
            <div className="advanced-split">
              <div className="note-card">
                <h3>When to use it</h3>
                <p>{lesson.use}</p>
              </div>
              <div className="note-card">
                <h3>When to choose another approach</h3>
                <p>{lesson.avoid}</p>
              </div>
            </div>
            {lesson.sections.map(([title, body, code]) => (
              <section className="concept-block" key={title}>
                <h2>{title}</h2>
                <p>{body}</p>
                <pre>
                  <code>{code}</code>
                </pre>
              </section>
            ))}
            <div className="note-card">
              <h3>Common mistake</h3>
              <p>{lesson.mistake}</p>
              <b>{lesson.recap}</b>
            </div>
          </div>
          <h2>Editable worked example</h2>
          <p>
            Use the safe editor to inspect HTML and its DOM. Scripts/submissions
            remain blocked; template, popover, media and modal restrictions may
            differ from a real document. Use Experiment for the trusted native
            demonstration.
          </p>
          <Lab
            initial={lesson.example}
            draftKey={`${key}-example`}
            draft={progress.drafts[`${key}-example`]}
            saveDraft={saveDraft}
          />
        </>
      )}
      {tab === "experiment" && (
        <>
          <div className="note-card">
            <h2>Predict before experimenting</h2>
            <p>{lesson.predict}</p>
            <textarea
              aria-label="Your prediction"
              maxLength={2000}
              placeholder="Write a prediction and a reason…"
            />
            <details>
              <summary>Reveal the reasoning</summary>
              <p>{lesson.prediction}</p>
            </details>
          </div>
          <Workshop lesson={lesson} />
        </>
      )}
      {tab === "practice" && (
        <>
          <h2>Repair, then build independently</h2>
          <p>{lesson.task}</p>
          <Lab
            key={`${key}-repair`}
            initial={lesson.broken}
            solution={advancedReference(lesson)}
            selectors={lesson.checks}
            task={lesson.task}
            hint={lesson.mistake}
            draftKey={`${key}-repair`}
            draft={progress.drafts[`${key}-repair`]}
            saveDraft={saveDraft}
            onPass={() => done(key)}
          />
          <p>
            Passing selector checks only records structural practice. Explain
            your result, inspect source conformance and complete manual behavior
            tests before treating the work as finished.
          </p>
          <details>
            <summary>Independent assignment & review</summary>
            <p>
              Use a different audience/topic to implement the same idea. Provide
              your source, a before/after bug explanation, keyboard/browser
              evidence and one limitation. {lesson.discussion}
            </p>
          </details>
        </>
      )}
      {tab === "quiz" && (
        <Quiz
          key={lesson.id}
          chapter={1}
          questions={lesson.quiz}
          fragment={
            advancedFragments[lesson.id as keyof typeof advancedFragments]
          }
          matching={advancedMatches[lesson.id as keyof typeof advancedMatches]}
          onScore={(n) => score(key, n)}
        />
      )}
      <div className="note-card">
        <h2>Authoritative references</h2>
        <p>
          Reviewed {standardsChecked}. Check current compatibility tables for
          the target browsers.
        </p>
        <ul>
          {lesson.references.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {new URL(url).hostname} ·{" "}
                {decodeURIComponent(
                  new URL(url).pathname.split("/").filter(Boolean).at(-1) ||
                    "Reference",
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {teacher && <AdvancedTeacher lesson={lesson} />}
      <div className="chip-row">
        <button
          className="button secondary"
          onClick={() =>
            go(
              "advanced/" +
                (advancedLessons[advancedLessons.indexOf(lesson) + 1]?.id ||
                  "assessment"),
            )
          }
        >
          Continue advanced path →
        </button>
        <button
          className="button subtle"
          onClick={() => go("lesson/" + lesson.existing[0])}
        >
          Revisit the foundation lesson
        </button>
      </div>
    </>
  );
}
function Heading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">
        <span className="orange-line" />
        OPTIONAL ADVANCED PATH
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function Workshop({ lesson }: { lesson: Lesson }) {
  switch (lesson.id) {
    case "semantics":
      return <SemanticArchitecture />;
    case "forms":
      return <NativeFormLab />;
    case "native":
      return <NativeUILab />;
    case "media":
      return <ImageInspector />;
    case "metadata":
      return <SourceInspector kind="metadata" initial={lesson.example} />;
    case "language":
      return <LanguageLab />;
    case "parsing":
      return <ParserDetective />;
    case "loading":
      return <LoadingTimeline />;
    case "components":
      return <ComponentAnatomy />;
    case "security":
      return <SourceInspector kind="security" initial={lesson.broken} />;
    case "accessibility":
      return <SourceInspector kind="accessibility" initial={lesson.broken} />;
    default:
      return null;
  }
}
function AdvancedTeacher({ lesson: l }: { lesson: Lesson }) {
  const [seconds, setSeconds] = useState(0),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const notes = [
    ["Explain", l.intro],
    ["Why", l.why],
    [
      "Demonstrate",
      "Use Experiment to compare actual native behavior or the labeled model, then edit the worked source. " +
        l.sections[0][1],
    ],
    ["Predict", l.predict],
    ["Common Confusion", l.mistake],
    ["Practice", l.task],
    ["Advanced Discussion", l.discussion],
    ["Answer", l.prediction],
    [
      "Homework",
      "Build the independent assignment for a different subject. Supply source, test evidence and an explanation.",
    ],
    [
      "Transition",
      `Connect this workshop to ${advancedLessons[advancedLessons.indexOf(l) + 1]?.title || "the projects and final assessment"}. ${l.recap}`,
    ],
  ];
  return (
    <div className="teacher-notes">
      <h2>Instructor notes · {l.title}</h2>
      <div className="teacher-timer">
        <span>
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
        <button
          className="button secondary compact"
          onClick={() => setRunning((r) => !r)}
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
          Reset timer
        </button>
        <button
          className="button secondary compact"
          onClick={() =>
            downloadBlob(
              new Blob([notes.map(([a, b]) => `${a}\n${b}`).join("\n\n")], {
                type: "text/plain",
              }),
              "advanced-teaching-notes.txt",
            )
          }
        >
          Download teaching notes
        </button>
      </div>
      <div className="teaching-grid">
        {notes.map(([title, body]) => (
          <div className="teaching-card" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <Schedule />
    </div>
  );
}
function Schedule() {
  return (
    <details className="note-card">
      <summary>
        Flexible advanced course schedule · 60–90 minute sessions
      </summary>
      <p>
        Each workshop can take one session, or split a complex form/native UI
        workshop across two. Begin with recall, then predict, demonstrate,
        repair and justify. Preserve the original introductory lesson plans.
      </p>
      <ol>
        {advancedLessons.map((l) => (
          <li key={l.id}>
            {l.title}: 5 min recall, 10 min explanation, 15 min experiment, 20
            min repair/build, 10 min review; optionally add 30 min independent
            work and discussion.
          </li>
        ))}
        <li>
          Project studio: choose a targeted brief, build independently, validate
          exported source, exchange review evidence and complete the advanced
          assessment.
        </li>
      </ol>
    </details>
  );
}
