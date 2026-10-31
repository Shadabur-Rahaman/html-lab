import { useState } from "react";
import {
  addTreeNode,
  treeSource,
  treeTags,
  tagRounds,
} from "../learningModel.mjs";
export default function LearningGames({
  kind,
  done,
}: {
  kind: string;
  done: (s: string) => void;
}) {
  const [round, setRound] = useState(0),
    [choice, setChoice] = useState(""),
    [score, setScore] = useState(0);
  const [nodes, setNodes] = useState([{ id: 0, parent: -1, tag: "body" }]),
    [parent, setParent] = useState(0),
    [tag, setTag] = useState("main"),
    [error, setError] = useState("");
  if (kind === "tags") {
    const item = tagRounds[round];
    return (
      <section className="experiment">
        <h1>Match the closing tag</h1>
        <p>
          Follow the nesting stack. Each first answer counts once; feedback
          explains every choice.
        </p>
        {item ? (
          <>
            <p>
              Round {round + 1} of {tagRounds.length}
            </p>
            <pre>
              <code>{item.source}</code>
            </pre>
            <div className="chip-row">
              {[
                "</h1>",
                "</li>",
                "</strong>",
                "</section>",
                "No closing tag",
              ].map((answer) => (
                <button
                  className="button secondary compact"
                  disabled={!!choice}
                  key={answer}
                  onClick={() => {
                    setChoice(answer);
                    if (answer === item.answer) setScore((s) => s + 1);
                  }}
                >
                  {answer}
                </button>
              ))}
            </div>
            {choice && (
              <div role="status">
                <p>
                  {choice === item.answer
                    ? "Correct."
                    : `The answer is ${item.answer}.`}{" "}
                  {item.reason}
                </p>
                <button
                  className="button primary compact"
                  onClick={() => {
                    setRound((r) => r + 1);
                    setChoice("");
                    if (round === tagRounds.length - 1) done("v2-tag-practice");
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <p role="status">
              Completed: {score} / {tagRounds.length}. Try again to practice the
              stack.
            </p>
            <button
              className="button secondary"
              onClick={() => {
                setRound(0);
                setScore(0);
              }}
            >
              Play again
            </button>
          </>
        )}
      </section>
    );
  }
  return (
    <section className="experiment">
      <h1>Build a DOM tree</h1>
      <p>
        Choose a parent, then add a child. This small practice model uses a
        limited set of valid relationships; it is not a complete HTML validator.
      </p>
      <div className="chip-row">
        <label>
          Parent{" "}
          <select
            value={parent}
            onChange={(e) => setParent(Number(e.target.value))}
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                #{n.id} &lt;{n.tag}&gt;
                {n.parent >= 0 ? ` inside #${n.parent}` : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Child element{" "}
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            {treeTags.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <button
          className="button primary compact"
          onClick={() => {
            try {
              setNodes(addTreeNode(nodes, parent, tag));
              setError("");
              done("v2-dom-practice");
            } catch (e) {
              setError((e as Error).message);
            }
          }}
        >
          Add child
        </button>
        <button
          className="button secondary compact"
          onClick={() => {
            setNodes([{ id: 0, parent: -1, tag: "body" }]);
            setParent(0);
            setError("");
          }}
        >
          Reset tree
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      <pre aria-label="Generated DOM source">
        <code>{treeSource(nodes)}</code>
      </pre>
      <p>
        Tip: add main to body, ul to main, then li to ul. Compare siblings with
        children by changing the selected parent.
      </p>
    </section>
  );
}
