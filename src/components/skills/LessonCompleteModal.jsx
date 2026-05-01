import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, Lightbulb, ShieldAlert, Sparkles, X } from "lucide-react";

const UNDERSTANDING_LEVELS = [
  {
    value: 1,
    label: "Explored",
    helper: "I only skimmed it",
    tone: "bg-slate-100 text-slate-700 ring-slate-200",
  },
  {
    value: 2,
    label: "Basics",
    helper: "I got the core idea",
    tone: "bg-amber-100 text-amber-700 ring-amber-200",
  },
  {
    value: 3,
    label: "Comfortable",
    helper: "I understood it well",
    tone: "bg-sky-100 text-sky-700 ring-sky-200",
  },
  {
    value: 4,
    label: "Confident",
    helper: "I can explain it clearly",
    tone: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  {
    value: 5,
    label: "Independent",
    helper: "I can apply it alone",
    tone: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  },
];

const PRACTICAL_CONFIDENCE = [
  "Not yet",
  "With help",
  "Mostly yes",
  "Fully yes",
];

const RESOURCE_TYPES = [
  "YouTube",
  "Udemy",
  "Coursera",
  "MDN Docs",
  "Documentation",
  "Article",
  "Other",
];

export default function LessonCompleteModal({ lesson, onConfirm, onClose }) {
  const defaultMinutes = useMemo(
    () => (lesson?.estimatedHours ? Math.max(15, lesson.estimatedHours * 60) : 60),
    [lesson]
  );

  const [completionStatus, setCompletionStatus] = useState("completed");
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [understanding, setUnderstanding] = useState(3);
  const [confidence, setConfidence] = useState("Mostly yes");
  const [resourceType, setResourceType] = useState("YouTube");
  const [whatLearned, setWhatLearned] = useState("");
  const [blockers, setBlockers] = useState("");
  const [revisionNeeded, setRevisionNeeded] = useState(false);

  useEffect(() => {
    setMinutes(defaultMinutes);
    setCompletionStatus("completed");
    setUnderstanding(3);
    setConfidence("Mostly yes");
    setResourceType("YouTube");
    setWhatLearned("");
    setBlockers("");
    setRevisionNeeded(false);
  }, [defaultMinutes, lesson?._id]);

  if (!lesson) return null;

  function buildStructuredNote() {
    const parts = [
      `Completion Status: ${completionStatus}`,
      `Resource Used: ${resourceType}`,
      `Practical Confidence: ${confidence}`,
      `Revision Needed: ${revisionNeeded ? "Yes" : "No"}`,
    ];

    if (whatLearned.trim()) {
      parts.push(`What I Learned: ${whatLearned.trim()}`);
    }

    if (blockers.trim()) {
      parts.push(`Blockers: ${blockers.trim()}`);
    }

    return parts.join("\n");
  }

  function handleSubmit() {
    onConfirm({
      lessonId: lesson._id,
      minutes: Number(minutes) || 30,
      understanding,
      note: buildStructuredNote(),
    });
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/60 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-5">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-2.5rem)] sm:rounded-[28px]">
          <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-primary px-4 py-4 pr-14 text-white sm:px-6 sm:py-5">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full bg-white/10 p-2 transition hover:bg-white/20 sm:right-4 sm:top-4"
              aria-label="Close learning log"
            >
              <X size={18} />
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-xs sm:tracking-[0.24em]">
              Log your learning
            </p>
            <h2 className="mt-2 max-w-[calc(100%-1rem)] break-words text-lg font-semibold leading-snug sm:text-xl">
              {lesson.title}
            </h2>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-white/75 sm:text-sm">
              Capture what you studied, how much time you spent, and how confident you feel before moving forward.
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:gap-5 xl:gap-6">
              <div className="min-w-0 space-y-4 sm:space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <BookOpen size={16} />
                    Learning summary
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Completion status
                      </label>
                      <select
                        value={completionStatus}
                        onChange={(e) => setCompletionStatus(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                      >
                        <option value="completed">Completed</option>
                        <option value="partial">Partially completed</option>
                        <option value="reviewed">Reviewed only</option>
                      </select>
                    </div>

                    <div className="min-w-0">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Resource used
                      </label>
                      <select
                        value={resourceType}
                        onChange={(e) => setResourceType(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                      >
                        {RESOURCE_TYPES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Clock3 size={16} />
                    Time invested
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <input
                      type="range"
                      min={10}
                      max={480}
                      step={5}
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="min-w-0 flex-1 accent-primary"
                    />
                    <div className="w-full rounded-xl bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-900 sm:w-[100px] sm:shrink-0 sm:text-right">
                      {minutes < 60 ? `${minutes} min` : `${(minutes / 60).toFixed(1)} hrs`}
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                    <span>10 min</span>
                    <span>8 hrs</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Sparkles size={16} />
                    Understanding level
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {UNDERSTANDING_LEVELS.map((level) => {
                      const isActive = understanding === level.value;
                      return (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setUnderstanding(level.value)}
                          className={`flex min-h-[92px] w-full flex-col justify-start rounded-2xl border px-4 py-3 text-left transition ${isActive
                              ? `${level.tone} ring-2`
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <p className="whitespace-normal break-words text-sm font-semibold leading-snug">
                            {level.label}
                          </p>
                          <p className="mt-1 whitespace-normal break-words text-xs leading-5 opacity-80">
                            {level.helper}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="min-w-0 space-y-4 sm:space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Lightbulb size={16} />
                    Practical confidence
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                    {PRACTICAL_CONFIDENCE.map((item) => {
                      const active = confidence === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setConfidence(item)}
                          className={`rounded-xl px-3 py-3 text-sm font-medium transition ${active
                              ? "bg-primary text-white shadow-sm"
                              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                            }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    What did you learn?
                  </label>
                  <textarea
                    rows={4}
                    value={whatLearned}
                    onChange={(e) => setWhatLearned(e.target.value)}
                    placeholder="Summarize the key concepts, ideas, or techniques you understood."
                    className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Any blockers or difficult parts?
                  </label>
                  <textarea
                    rows={3}
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="Mention what felt difficult, unclear, or needs revision."
                    className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  />

                  <label className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={revisionNeeded}
                      onChange={(e) => setRevisionNeeded(e.target.checked)}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="min-w-0 leading-5">
                      Mark this lesson for revision later
                    </span>
                  </label>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-700" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-amber-800">
                        Learning log
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        This log stores your time, understanding level, confidence, resource used, and notes for progress tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
              >
                Save Learning Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
