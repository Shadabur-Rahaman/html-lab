import { reviewCriteria } from "../learningModel.mjs";
import { downloadBlob } from "../projectModel.mjs";
export type Review = {
  scores: Record<string, number>;
  notes: string;
  stale?: boolean;
};
export default function ProjectReview({
  value,
  change,
  name,
}: {
  value?: Review;
  change: (r: Review) => void;
  name: string;
}) {
  const review = value || { scores: {}, notes: "" };
  const complete = reviewCriteria.every((c) =>
    Number.isInteger(review.scores[c]),
  );
  return (
    <details className="note-card">
      <summary>Project review rubric · saved with this project</summary>
      <p>
        Self or peer review: 0 = not demonstrated, 1 = needs support, 2 = partly
        works, 3 = meets the brief, 4 = clear evidence and explanation. These
        scores are your assessment.
      </p>
      {review.stale && (
        <p role="status">
          Files changed after this review. Check the evidence and confirm your
          review again.
        </p>
      )}
      <div className="rubric-grid">
        {reviewCriteria.map((c) => (
          <label key={c}>
            {c}
            <select
              value={review.scores[c] ?? ""}
              onChange={(e) => {
                const scores = { ...review.scores };
                if (e.target.value === "") delete scores[c];
                else scores[c] = Number(e.target.value);
                change({ ...review, scores });
              }}
            >
              <option value="">Not reviewed</option>
              {[0, 1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} / 4
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <label>
        Evidence and next steps
        <textarea
          maxLength={4000}
          value={review.notes}
          onChange={(e) => change({ ...review, notes: e.target.value })}
          placeholder="Which page, element, keyboard test, or viewport supports your score?"
        />
      </label>
      <p>
        {complete
          ? `Review total: ${Object.values(review.scores).reduce((a, b) => a + b, 0)} / 20`
          : "Complete all five criteria to see a total."}{" "}
        Use Save on device to retain this review. Website ZIPs contain website
        files only.
      </p>
      <div className="chip-row">
        <button
          className="button secondary compact"
          onClick={() => change({ ...review, stale: false })}
        >
          Confirm review of current files
        </button>
        <button
          className="button secondary compact"
          onClick={() =>
            downloadBlob(
              new Blob(
                [
                  `PROJECT REVIEW: ${name}\n${review.stale ? "Files changed: review needs checking.\n" : ""}${reviewCriteria.map((c) => `${c}: ${review.scores[c] ?? "Not reviewed"} /4`).join("\n")}\n\nEvidence and next steps:\n${review.notes}`,
                ],
                { type: "text/plain" },
              ),
              "project-review.txt",
            )
          }
        >
          Export filled review
        </button>
      </div>
    </details>
  );
}
