import React from "react";
import { X } from "lucide-react";

export default function GoalModal({
  open,
  onClose,
  goal,
  goalForm,
  setGoalForm,
  onSubmit,
  savingGoal,
  generating,
  onGenerate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] overflow-y-auto bg-slate-950/60 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:rounded-[30px]">
          <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-primary px-4 py-4 pr-14 text-white sm:px-6 sm:py-5">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-xs sm:tracking-[0.24em]">
              Set your next target
            </p>

            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
              {goal?._id ? "Update your growth target" : "Create a new growth target"}
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/75 sm:text-sm">
              Define the role, focus, and learning preferences so DevSta can generate a useful journey and roadmap.
            </p>
          </div>

          <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target name
                  </label>
                  <input
                    type="text"
                    value={goalForm.targetTitle}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, targetTitle: event.target.value }))
                    }
                    placeholder="Web Development"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target role
                  </label>
                  <input
                    type="text"
                    value={goalForm.targetRole}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, targetRole: event.target.value }))
                    }
                    placeholder="Frontend Developer"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target company
                  </label>
                  <input
                    type="text"
                    value={goalForm.targetCompany}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, targetCompany: event.target.value }))
                    }
                    placeholder="Meta"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Experience level
                  </label>
                  <select
                    value={goalForm.experienceLevel}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, experienceLevel: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["intern", "junior", "mid", "senior", "lead", "other"].map((value) => (
                      <option key={value} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Timeline
                  </label>
                  <select
                    value={goalForm.timeline}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, timeline: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["1 month", "3 months", "6 months", "12 months"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Weekly availability
                  </label>
                  <select
                    value={goalForm.weeklyAvailability}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, weeklyAvailability: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["3 hours", "5 hours", "10 hours", "15+ hours"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred resource type
                  </label>
                  <select
                    value={goalForm.preferredResourceType}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, preferredResourceType: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["Video", "Course", "Documentation", "Mixed"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Budget preference
                  </label>
                  <select
                    value={goalForm.budgetPreference}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, budgetPreference: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["Free only", "Free + paid"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred difficulty
                  </label>
                  <select
                    value={goalForm.preferredDifficulty}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, preferredDifficulty: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["Beginner", "Intermediate", "Advanced", "Adaptive"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Focus skills
                  </label>
                  <input
                    type="text"
                    value={goalForm.focusSkillsText}
                    onChange={(event) =>
                      setGoalForm((previous) => ({ ...previous, focusSkillsText: event.target.value }))
                    }
                    placeholder="react, angular, typescript, testing, performance"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <p className="mt-2 text-xs text-slate-400">Enter comma-separated skills.</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur sm:p-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingGoal}
                  className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
                >
                  {savingGoal ? "Saving..." : goal?._id ? "Update target" : "Save target"}
                </button>

                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={generating || !goal?._id}
                  className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
                >
                  {generating ? "Generating..." : "Generate journey"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
