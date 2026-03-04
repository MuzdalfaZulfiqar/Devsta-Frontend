// src/components/company/RubricBuilderModal.jsx
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";
import { showToast } from "../../utils/toast";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";

const DEFAULT_CRITERION = () => ({
  _tempId: Math.random().toString(36).slice(2), // client-only key
  label: "",
  description: "",
  weight: 1,
  maxScore: 5,
});

const PRESET_RUBRICS = {
  engineering: [
    { label: "Technical Knowledge", description: "Depth of domain knowledge and concepts", weight: 3, maxScore: 5 },
    { label: "Problem Solving",     description: "Approach to breaking down and solving problems", weight: 3, maxScore: 5 },
    { label: "Communication",       description: "Clarity and confidence in explaining ideas", weight: 2, maxScore: 5 },
    { label: "Culture Fit",         description: "Alignment with team values and ways of working", weight: 1, maxScore: 5 },
    { label: "System Design",       description: "Ability to think about scalability and architecture", weight: 2, maxScore: 5 },
  ],
  general: [
    { label: "Communication",  description: "Clarity and articulation", weight: 2, maxScore: 5 },
    { label: "Experience",     description: "Relevance and depth of past work", weight: 2, maxScore: 5 },
    { label: "Motivation",     description: "Interest in the role and company", weight: 1, maxScore: 5 },
    { label: "Culture Fit",    description: "Alignment with team values", weight: 1, maxScore: 5 },
  ],
};

export default function RubricBuilderModal({ jobId, onClose, onSaved }) {
  const [criteria, setCriteria] = useState([DEFAULT_CRITERION()]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  // ── Load existing rubric on open ─────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("companyToken");
        const res   = await fetch(
          `${BACKEND_URL}/api/interview/jobs/${jobId}/rubric`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (data.rubric?.length) {
          // Add _tempId so React keys work even for saved criteria
          setCriteria(
            data.rubric.map(c => ({ ...c, _tempId: c._id || Math.random().toString(36).slice(2) }))
          );
        }
      } catch (err) {
        console.error("Failed to load rubric:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  // ── Field change handler ──────────────────────────────────────────
  const update = (tempId, field, value) => {
    setCriteria(prev =>
      prev.map(c => c._tempId === tempId ? { ...c, [field]: value } : c)
    );
  };

  const addCriterion   = () => setCriteria(prev => [...prev, DEFAULT_CRITERION()]);
  const removeCriterion = (tempId) => {
    if (criteria.length === 1) {
      showToast("At least one criterion is required", 4000);
      return;
    }
    setCriteria(prev => prev.filter(c => c._tempId !== tempId));
  };

  // ── Apply preset ──────────────────────────────────────────────────
  const applyPreset = (key) => {
    const preset = PRESET_RUBRICS[key];
    if (!preset) return;
    setCriteria(preset.map(c => ({ ...c, _tempId: Math.random().toString(36).slice(2) })));
    showToast(`Applied "${key}" preset — customise as needed`, 3000);
  };

  // ── Save ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    // Validate
    for (const c of criteria) {
      if (!c.label.trim()) {
        showToast("Every criterion needs a label", 4000);
        return;
      }
      if (Number(c.maxScore) < 2) {
        showToast(`Max score for "${c.label}" must be at least 2`, 4000);
        return;
      }
      if (Number(c.weight) < 0) {
        showToast(`Weight for "${c.label}" cannot be negative`, 4000);
        return;
      }
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("companyToken");
      const res   = await fetch(
        `${BACKEND_URL}/api/interview/jobs/${jobId}/rubric`,
        {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            criteria: criteria.map(({ _tempId, ...rest }) => rest), // strip client key
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save rubric");

      showToast("Interview rubric saved!", 4000);
      onSaved?.(data.rubric);
      onClose();
    } catch (err) {
      showToast(err.message || "Could not save rubric", 5000);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Interview Rubric
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Define how you'll score candidates — used in all scorecards for this job
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 leading-none"
          >
            ×
          </button>
        </div>

        {/* Presets */}
        <div className="px-6 pt-4 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Quick start:
          </span>
          {Object.keys(PRESET_RUBRICS).map(key => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="px-3 py-1 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 capitalize transition"
            >
              {key}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-1">or build your own below</span>
        </div>

        {/* Criteria list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading rubric...</p>
          ) : (
            <>
              {/* Column labels */}
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                <div className="col-span-4">Criterion</div>
                <div className="col-span-4">Hint for interviewer</div>
                <div className="col-span-1 text-center">Weight</div>
                <div className="col-span-2 text-center">Max Score</div>
                <div className="col-span-1" />
              </div>

              {criteria.map((c, idx) => (
                <div
                  key={c._tempId}
                  className="grid grid-cols-12 gap-2 items-start bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700"
                >
                  {/* Drag handle (visual only) */}
                  <div className="col-span-12 flex items-center gap-1 mb-1">
                    <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-400">#{idx + 1}</span>
                  </div>

                  {/* Label */}
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={c.label}
                      onChange={e => update(c._tempId, "label", e.target.value)}
                      placeholder="e.g. Problem Solving"
                      className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Description / hint */}
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={c.description}
                      onChange={e => update(c._tempId, "description", e.target.value)}
                      placeholder="Optional hint..."
                      className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Weight */}
                  <div className="col-span-1">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={c.weight}
                      onChange={e => update(c._tempId, "weight", Number(e.target.value))}
                      className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-2 text-center bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Max Score */}
                  <div className="col-span-2">
                    <select
                      value={c.maxScore}
                      onChange={e => update(c._tempId, "maxScore", Number(e.target.value))}
                      className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {[3, 4, 5, 7, 10].map(n => (
                        <option key={n} value={n}>1 – {n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 flex justify-center pt-1">
                    <button
                      onClick={() => removeCriterion(c._tempId)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="Remove criterion"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add criterion */}
              <button
                onClick={addCriterion}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition"
              >
                <Plus size={16} />
                Add Criterion
              </button>

              {/* Weight explanation */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">How weights work</p>
                <p className="text-xs leading-relaxed">
                  A criterion with weight <strong>3</strong> counts 3× more than one with weight <strong>1</strong>.
                  The final score is the weighted average of all criteria, normalised to 0–100.
                  Example: Technical (weight 3) + Communication (weight 1) means tech is 75% of the final score.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Rubric"}
          </button>
        </div>
      </div>
    </div>
  );
}