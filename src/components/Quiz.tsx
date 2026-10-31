import { useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Lightbulb } from "lucide-react";
import { lessons } from "../data/curriculum.mjs";
export type Question = {
  question: string;
  options: string[];
  answer: number;
  reason: string;
  type: string;
};
export function chapterQuestions(chapter: number): Question[] {
  const topics = lessons.filter((l) => l.chapter === chapter);
  return topics
    .map((l) => ({
      question: l.question,
      options: l.options,
      answer: l.answer,
      reason: l.how,
      type: "UNDERSTAND",
    }))
    .concat([
      {
        question:
          "Predict: <h2>Notes</h2><p>First<br>Second</p>. What is rendered?",
        options: [
          "A level-two heading, then a paragraph with a deliberate line break",
          "Three level-one headings",
          "A single image",
        ],
        answer: 0,
        reason:
          "h2 defines a heading level; p groups text; br inserts a line break inside the paragraph.",
        type: "PREDICT THE OUTPUT",
      },
      {
        question: "Match the purpose: which pair is correct?",
        options: [
          "a → navigation; button → action",
          "div → automatic form validation; img → navigation",
          "title → visible page heading; h1 → tab title",
        ],
        answer: 0,
        reason:
          "Choose native elements by purpose. A link navigates to a resource; a button triggers an action or submits a form.",
        type: "MATCH ELEMENT TO PURPOSE",
      },
      {
        question:
          'Find the error: <label for="mail">Email</label><input id="email" name="email">',
        options: [
          "The label for value does not match the control id",
          "Every label must contain an image",
          "The name attribute is forbidden",
        ],
        answer: 0,
        reason:
          "An explicit label association requires an exact match between for and id.",
        type: "FIND THE ERROR",
      },
      {
        question:
          "Scenario: a registration page must create real accounts. What else is required beyond HTML?",
        options: [
          "A service with secure server-side processing and validation",
          "Only a password input",
          "A longer form title",
        ],
        answer: 0,
        reason:
          "HTML describes the interface. Account creation, authorization, and persistence require additional technology.",
        type: "REAL-WORLD SCENARIO",
      },
    ]);
}
export default function Quiz({
  chapter,
  onScore,
  final = false,
  questions,
  fragment,
  matching,
}: {
  chapter: number;
  onScore: (score: number) => void;
  final?: boolean;
  questions?: Question[];
  fragment?: { prompt: string; answer: string; reason: string };
  matching?: string[][];
}) {
  const fragmentTask = fragment || {
    prompt: "<p>Hello, learner! ____",
    answer: "</p>",
    reason: "A normal paragraph closes with </p>.",
  };
  const qs: Question[] =
    questions ||
    (final
      ? lessons.map((l) => ({
          question: l.question,
          options: l.options,
          answer: l.answer,
          reason: l.how,
          type: `CHAPTER ${l.chapter}`,
        }))
      : chapterQuestions(chapter));
  const [index, setIndex] = useState(0),
    [choice, setChoice] = useState<number | null>(null),
    [submitted, setSubmitted] = useState(false),
    [score, setScore] = useState(0),
    [finished, setFinished] = useState(false),
    [hint, setHint] = useState(false),
    [fill, setFill] = useState(""),
    [fillFeedback, setFillFeedback] = useState("");
  const q = qs[index];
  function next() {
    if (index === qs.length - 1) {
      setFinished(true);
      onScore(Math.round((score / qs.length) * 100));
      return;
    }
    setIndex(index + 1);
    setChoice(null);
    setSubmitted(false);
    setHint(false);
  }
  return (
    <div className="quiz-card">
      {finished ? (
        <>
          <span className="eyebrow">CHECKPOINT COMPLETE</span>
          <h2>
            {score} / {qs.length} correct
          </h2>
          <p>
            Your best score is saved on this device. Revisit the explanations,
            then try again.
          </p>
          <button
            className="button primary"
            onClick={() => {
              setIndex(0);
              setScore(0);
              setChoice(null);
              setSubmitted(false);
              setFinished(false);
            }}
          >
            <RotateCcw size={16} />
            Retake assessment
          </button>
        </>
      ) : (
        <>
          <div className="section-top">
            <span className="eyebrow">{q.type}</span>
            <span className="muted">
              {index + 1} / {qs.length}
            </span>
          </div>
          <div className="thin-progress">
            <span style={{ width: `${(index / qs.length) * 100}%` }} />
          </div>
          <h2>{q.question}</h2>
          <div className="quiz-options">
            {q.options.map((option, i) => {
              const actual = (i + index) % q.options.length;
              return (
                <button
                  key={actual}
                  disabled={submitted}
                  className={`quiz-option ${choice === actual ? "chosen" : ""} ${submitted && actual === q.answer ? "correct" : ""}`}
                  onClick={() => setChoice(actual)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {q.options[actual]}
                  {submitted && actual === q.answer && (
                    <CheckCircle2 size={18} />
                  )}
                </button>
              );
            })}
          </div>
          {submitted ? (
            <div className={choice === q.answer ? "feedback good" : "feedback"}>
              <b>
                {choice === q.answer ? "That’s right." : "Let’s unpack that."}
              </b>
              <p>{q.reason}</p>
              <button className="button primary" onClick={next}>
                {index === qs.length - 1 ? "See results" : "Next question"}
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="quiz-actions">
              <button
                disabled={choice === null}
                className="button primary"
                onClick={() => {
                  setSubmitted(true);
                  if (choice === q.answer) setScore(score + 1);
                }}
              >
                Check answer
              </button>
              <button className="button subtle" onClick={() => setHint(!hint)}>
                <Lightbulb size={16} />
                Hint
              </button>
            </div>
          )}
          {hint && !submitted && (
            <p className="hint">{q.reason.split(". ")[0]}.</p>
          )}
        </>
      )}
      {!final && (!questions || fragment) && (
        <details className="fill-task">
          <summary>Bonus · Complete the HTML fragment</summary>
          <p>
            Complete: <code>{fragmentTask.prompt}</code>
          </p>
          <label htmlFor="missing-tag">Missing fragment</label>
          <input
            id="missing-tag"
            value={fill}
            onChange={(e) => setFill(e.target.value)}
          />
          <button
            className="button secondary compact"
            onClick={() =>
              setFillFeedback(
                fill.trim().toLowerCase() === fragmentTask.answer.toLowerCase()
                  ? `Correct. ${fragmentTask.reason}`
                  : `Review: ${fragmentTask.reason} Expected fragment: ${fragmentTask.answer}`,
              )
            }
          >
            Check fragment
          </button>
          <p role="status">{fillFeedback}</p>
        </details>
      )}
      {!final && (!questions || matching) && <MatchingTask pairs={matching} />}
    </div>
  );
}

function MatchingTask({ pairs: suppliedPairs }: { pairs?: string[][] }) {
  const pairs = suppliedPairs || [
    ["nav", "Major navigation"],
    ["main", "Dominant content"],
    ["label", "Name a form control"],
  ];
  const [answers, setAnswers] = useState(pairs.map(() => ""));
  const [checked, setChecked] = useState(false);
  return (
    <details className="fill-task">
      <summary>Bonus · Match markup to its purpose</summary>
      <p>Match each element or attribute to its purpose.</p>
      {pairs.map(([tag], index) => (
        <div className="matching-row" key={tag}>
          <label htmlFor={`match-${tag}`}>
            <code>{suppliedPairs ? tag : `<${tag}>`}</code>
          </label>
          <select
            id={`match-${tag}`}
            value={answers[index]}
            onChange={(e) => {
              setAnswers(
                answers.map((a, i) => (i === index ? e.target.value : a)),
              );
              setChecked(false);
            }}
          >
            <option value="">Choose a purpose</option>
            {[...pairs].reverse().map(([, purpose]) => (
              <option key={purpose}>{purpose}</option>
            ))}
          </select>
        </div>
      ))}
      <button
        className="button secondary compact"
        onClick={() => setChecked(true)}
      >
        Check matches
      </button>
      {checked && (
        <p
          role="status"
          className={
            answers.every((a, i) => a === pairs[i][1]) ? "success" : "warning"
          }
        >
          {answers.every((a, i) => a === pairs[i][1])
            ? "All matched correctly."
            : `Review the pairs: ${pairs.map(([tag, purpose]) => `${tag} → ${purpose}`).join("; ")}.`}
        </p>
      )}
    </details>
  );
}
