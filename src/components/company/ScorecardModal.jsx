// src/components/company/ScorecardModal.jsx
import { useEffect, useMemo, useState } from "react";
import { BACKEND_URL } from "../../../config";
import { showToast } from "../../utils/toast";
import { CheckCircle } from "lucide-react";

export default function ScorecardModal({ jobId, application, onClose, onSaved }) {
  const [rubric,       setRubric]       = useState([]);
  const [scores,       setScores]       = useState({}); // { criterionId: { score, notes } }
  const [overallNotes, setOverallNotes] = useState("");
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);

  // ── Load rubric + any existing scorecard ─────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("companyToken");

        // Fetch rubric and existing scorecard in parallel
        const [rubricRes, scRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/interview/jobs/${jobId}/rubric`,
            { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${application._id}/scorecard`,
            { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const rubricData = await rubricRes.json();
        setRubric(rubricData.rubric || []);

        const scData = await scRes.json();
        if (scData.scorecard?.length) {
          const prefill = {};
          scData.scorecard.forEach(s => {
            prefill[String(s.criterionId)] = {
              score: s.score,
              notes: s.notes || "",
            };
          });
          setScores(prefill);
          setOverallNotes(scData.notes || "");
        }
      } catch (err) {
        console.error("Failed to load scorecard data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId, application._id]);

  // ── Live weighted score preview ───────────────────────────────────
  const liveScore = useMemo(() => {
    let totalWeighted = 0;
    let totalWeight   = 0;

    rubric.forEach(c => {
      const entry = scores[String(c._id)];
      if (entry?.score != null) {
        totalWeighted += (entry.score / c.maxScore) * 100 * c.weight;
        totalWeight   += c.weight;
      }
    });

    return totalWeight > 0 ? Math.round(totalWeighted / totalWeight) : null;
  }, [scores, rubric]);

  // ── Update a single criterion ─────────────────────────────────────
  const setScore = (criterionId, field, value) => {
    setScores(prev => ({
      ...prev,
      [String(criterionId)]: {
        ...prev[String(criterionId)],
        [field]: value,
      },
    }));
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // Make sure every criterion is scored
    const missing = rubric.find(
      c => scores[String(c._id)]?.score == null
    );
    if (missing) {
      showToast(`Please score "${missing.label}" before submitting`, 4000);
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("companyToken");

      const scorecard = rubric.map(c => ({
        criterionId: c._id,
        score:       scores[String(c._id)].score,
        notes:       scores[String(c._id)].notes || "",
      }));

      const res = await fetch(
        `${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${application._id}/scorecard`,
        {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:  `Bearer ${token}`,
          },
          body: JSON.stringify({ scorecard, overallNotes }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit scorecard");

      showToast(`Scorecard saved — Score: ${data.interviewScore}/100`, 4000);
      onSaved?.(data.interviewScore);
      onClose();
    } catch (err) {
      showToast(err.message || "Could not save scorecard", 5000);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Score colour helper ───────────────────────────────────────────
  const scoreColor = (score) => {
    if (score == null) return "";
    if (liveScore >= 70) return "text-green-600";
    if (liveScore >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const progressColor = liveScore == null
    ? "bg-gray-200"
    : liveScore >= 70 ? "bg-green-500"
    : liveScore >= 50 ? "bg-yellow-500"
    : "bg-red-500";

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Interview Scorecard
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {application.developerSnapshot?.name || "Candidate"}
            </p>
          </div>

          {/* Live score badge */}
          <div className="text-right flex-shrink-0">
            {liveScore != null ? (
              <>
                <p className="text-xs text-gray-400 mb-0.5">Weighted Score</p>
                <p className={`text-4xl font-bold tabular-nums ${scoreColor(liveScore)}`}>
                  {liveScore}
                  <span className="text-lg text-gray-400 font-normal">/100</span>
                </p>
                {/* Progress bar */}
                <div className="mt-1 w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressColor}`}
                    style={{ width: `${liveScore}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 mt-2">Score all criteria<br />to see total</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading rubric...</p>

          ) : rubric.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                No rubric defined for this job yet.
              </p>
              <p className="text-sm text-gray-500">
                Close this modal and click <strong>"Configure Rubric"</strong> first.
              </p>
            </div>

          ) : (
            <>
              {rubric.map((criterion, idx) => {
                const entryScore = scores[String(criterion._id)]?.score ?? null;
                const entryNotes = scores[String(criterion._id)]?.notes ?? "";
                const isScored   = entryScore != null;

                return (
                  <div
                    key={String(criterion._id)}
                    className={`border rounded-xl p-4 space-y-3 transition ${
                      isScored
                        ? "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}
                  >
                    {/* Criterion header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isScored && (
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {idx + 1}. {criterion.label}
                          </h4>
                          {criterion.description && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {criterion.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        Weight {criterion.weight}×
                      </span>
                    </div>

                    {/* Score buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {Array.from({ length: criterion.maxScore }, (_, i) => i + 1).map(n => {
                        const isSelected = entryScore === n;
                        // Color scale: 1 = red, middle = yellow, max = green
                        const pct = n / criterion.maxScore;
                        const activeColor =
                          pct >= 0.8 ? "bg-green-500 border-green-500 text-white"
                          : pct >= 0.5 ? "bg-yellow-400 border-yellow-400 text-white"
                          : "bg-red-400 border-red-400 text-white";

                        return (
                          <button
                            key={n}
                            onClick={() => setScore(criterion._id, "score", n)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm border-2 transition
                              ${isSelected
                                ? activeColor
                                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary"
                              }`}
                          >
                            {n}
                          </button>
                        );
                      })}

                      {/* Scale labels */}
                      <div className="ml-2 text-xs text-gray-400 flex gap-2">
                        <span>1 = Poor</span>
                        <span>·</span>
                        <span>{criterion.maxScore} = Excellent</span>
                      </div>
                    </div>

                    {/* Per-criterion notes */}
                    <textarea
                      rows={2}
                      value={entryNotes}
                      onChange={e => setScore(criterion._id, "notes", e.target.value)}
                      placeholder="Notes for this criterion (optional)..."
                      className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 resize-none bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                );
              })}

              {/* Overall interview notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Overall Interview Notes
                </label>
                <textarea
                  rows={3}
                  value={overallNotes}
                  onChange={e => setOverallNotes(e.target.value)}
                  placeholder="General observations, red flags, highlights, overall impression..."
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm resize-none bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rubric.length === 0 || loading}
            className="flex-1 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {submitting ? "Saving..." : "Submit Scorecard"}
          </button>
        </div>
      </div>
    </div>
  );
}