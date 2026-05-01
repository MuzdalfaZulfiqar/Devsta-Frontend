// src/components/interview/tabs/Roadmap.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { getRoadmaps } from "../../../api/roadmap";
import {
  ChevronDown,
  Map,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Sparkles,
  History,
  Layout,
  Zap,
  Terminal,
  FileText,
  Trash2,
} from "lucide-react";

export default function Roadmap({
  roadmapData,
  onGoToDefine,
  userProfile,
  onSolveChallenge,
}) {
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "not_started" | "in_progress" | "done"
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // roadmap object to confirm

  useEffect(() => {
    if (roadmapData) {
      setSelected(roadmapData);
      fetchSavedRoadmaps(false);
    } else {
      fetchSavedRoadmaps(true);
    }
  }, [roadmapData]);

  const fetchSavedRoadmaps = async (selectFirst = false) => {
    setLoadingHistory(true);
    try {
      const data = await getRoadmaps();
      setSavedRoadmaps(data);
      if (selectFirst && data.length > 0) setSelected(data[0]);
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getRoadmapStatus = (rm) => {
    const phases = rm?.roadmap?.phases || [];
    const progress = rm?.phaseProgress || {};
    if (phases.length === 0) return "not_started";
    const doneCount = phases.filter((p) => progress[p.title] === "done").length;
    const inProgressCount = phases.filter(
      (p) => progress[p.title] === "in_progress",
    ).length;
    if (doneCount === phases.length) return "done";
    if (doneCount > 0 || inProgressCount > 0) return "in_progress";
    return "not_started";
  };

  const handleDeleteRoadmap = async (rm) => {
    setDeletingId(rm._id);
    try {
      const token = localStorage.getItem("devsta_token");
      await axios.delete(`http://localhost:5000/api/roadmap/${rm._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = savedRoadmaps.filter((r) => r._id !== rm._id);
      setSavedRoadmaps(updated);
      if (selected?._id === rm._id) {
        setSelected(updated[0] || null);
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("Failed to delete roadmap.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const filteredRoadmaps = savedRoadmaps.filter((rm) => {
    if (filter === "all") return true;
    return getRoadmapStatus(rm) === filter;
  });

  if (loadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">
          Syncing your journey...
        </span>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] text-center bg-gray-50/30 dark:bg-gray-900/10">
        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center mb-6">
          <Map className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
          No Active Roadmap
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8 text-sm leading-relaxed">
          Your personalized career path hasn't been generated yet. Start by
          defining your goals.
        </p>
        <button
          onClick={onGoToDefine}
          className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          Define a Goal
        </button>
      </div>
    );
  }

  const { role, company, experience, gapAnalysis, roadmap, createdAt } =
    selected;
  const { phases = [], timeline, tips = [] } = roadmap || {};
  const isRoadmapLoading = selected?.loadingRoadmap;
  const { missing = [], matched = [] } = gapAnalysis || {};

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Sidebar Navigation */}
      {/* {savedRoadmaps.length > 1 && (
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-6 px-2">
              <History className="w-4 h-4 text-gray-400" />
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Your History
              </h4>
            </div>
            <div className="space-y-2">
              {savedRoadmaps.map((rm) => (
                <button
                  key={rm._id}
                  onClick={() => setSelected(rm)}
                  className={`w-full group text-left px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    selected?._id === rm._id
                      ? "bg-primary text-white shadow-lg shadow-primary/25 font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="text-sm truncate">{rm.role}</div>
                  <div
                    className={`text-[10px] mt-1 flex items-center gap-1 opacity-70 ${selected?._id === rm._id ? "text-white" : "text-gray-400"}`}
                  >
                    <Layout className="w-3 h-3" />{" "}
                    {rm.company || "General Path"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )} */}

      {savedRoadmaps.length > 0 && (
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 px-2">
              <History className="w-4 h-4 text-gray-400" />
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Your History
              </h4>
              <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {filteredRoadmaps.length}
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 mb-4 px-2">
              {[
                { value: "all", label: "All" },
                { value: "not_started", label: "Not started" },
                { value: "in_progress", label: "In progress" },
                { value: "done", label: "Done" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all ${
                    filter === f.value
                      ? f.value === "done"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : f.value === "in_progress"
                          ? "bg-amber-500 text-white border-amber-500"
                          : f.value === "not_started"
                            ? "bg-gray-500 text-white border-gray-500"
                            : "bg-primary text-white border-primary"
                      : "bg-transparent text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredRoadmaps.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-4 px-2">
                No roadmaps match this filter.
              </p>
            ) : (
              <div className="space-y-1">
                {filteredRoadmaps.map((rm) => {
                  const status = getRoadmapStatus(rm);
                  const dotClass =
                    status === "done"
                      ? "bg-emerald-500"
                      : status === "in_progress"
                        ? "bg-amber-400"
                        : "bg-gray-400";

                  return (
                    <div
                      key={rm._id}
                      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                        selected?._id === rm._id
                          ? "bg-primary text-white shadow-lg shadow-primary/25"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                      }`}
                      onClick={() => setSelected(rm)}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate font-bold">
                          {rm.role}
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 flex items-center gap-1 opacity-70 ${
                            selected?._id === rm._id
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          <Layout className="w-3 h-3" />
                          {rm.company || "General Path"}
                        </div>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(rm);
                        }}
                        disabled={deletingId === rm._id}
                        className={`opacity-0 group-hover:opacity-100 shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          selected?._id === rm._id
                            ? "hover:bg-white/20 text-white/70 hover:text-white"
                            : "hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"
                        } ${deletingId === rm._id ? "opacity-100" : ""}`}
                        title="Delete roadmap"
                      >
                        {deletingId === rm._id ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              Delete roadmap?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              <span className="font-bold text-gray-700 dark:text-gray-200">
                "{confirmDelete.role}"
              </span>{" "}
              and all its challenges, submissions and practice activities will
              be permanently removed.
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 mb-6">
              This action cannot be undone.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRoadmap(confirmDelete)}
                disabled={deletingId === confirmDelete._id}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-black transition disabled:opacity-60"
              >
                {deletingId === confirmDelete._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Roadmap Area */}
      <main className="flex-1 min-w-0 space-y-10 pb-20 w-full">
        <section className="space-y-8">
          {/* Hero Header */}
          <header className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 dark:bg-black p-8 md:p-12 text-white">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                  AI Career Blueprint
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 uppercase">
                {role}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                {company && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold">
                    <Target className="w-4 h-4 text-primary" /> {company}
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold capitalize">
                  <Zap className="w-4 h-4 text-amber-400" /> {experience}
                </div>
                {timeline && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold">
                    <Clock className="w-4 h-4 text-emerald-400" /> {timeline}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
            {createdAt && (
              <div className="absolute top-8 right-8 text-right hidden md:block">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                  Generated
                </p>
                <p className="text-xs font-bold text-white/60">
                  {new Date(createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Roadmap Progress
              </p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                A quick glance at your career plan and where it’s heading.
              </p>
              <div className="mt-6 flex items-center gap-3 text-3xl font-black text-gray-900 dark:text-white">
                <span>{phases.length}</span>
                <span className="text-base font-semibold text-gray-500 dark:text-gray-400">
                  phases
                </span>
              </div>
            </article>

            <article className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Skill balance
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
                    Matched
                  </p>
                  <p className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-200">
                    {matched.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 dark:bg-orange-500/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-600 dark:text-orange-300">
                    To learn
                  </p>
                  <p className="mt-2 text-2xl font-black text-orange-700 dark:text-orange-200">
                    {missing.length}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Timeline
              </p>
              <p className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
                {timeline || "Flexible pace"}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Estimated delivery based on your current plan.
              </p>
            </article>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[2rem] bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Matched Skills
                  </h4>
                </div>
                <span className="text-2xl font-black text-emerald-200 dark:text-emerald-800">
                  {matched.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matched.slice(0).map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-100 dark:border-emerald-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-orange-50/30 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h4 className="text-[11px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                    Delta Skills
                  </h4>
                </div>
                <span className="text-2xl font-black text-orange-200 dark:text-orange-800">
                  {missing.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missing.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-xl text-xs font-bold text-orange-700 dark:text-orange-300 shadow-sm border border-orange-100 dark:border-orange-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </section>

        {/* Roadmap Phases */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              Learning Curriculum
            </h3>
            <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>

          <div className="space-y-4">
            {isRoadmapLoading ? (
              <div className="p-20 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-[2.5rem] border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Compiling Curriculum...
                </p>
              </div>
            ) : (
              phases.map((phase, i) => (
                <PhaseCard
                  key={`${selected._id}-${i}`}
                  phase={phase}
                  index={i}
                  role={role}
                  company={company}
                  userProfile={userProfile}
                  roadmapId={selected._id}
                  roadmap={selected}
                  onSolveChallenge={onSolveChallenge}
                />
              ))
            )}
          </div>
        </section>

        {/* Tips footer */}
        {tips.length > 0 && (
          <footer className="p-8 bg-blue-50/50 dark:bg-blue-500/5 rounded-[2.5rem] border border-blue-100 dark:border-blue-500/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                  Strategy Tips
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Growth Insights
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-blue-500 font-black text-lg opacity-20 group-hover:opacity-100 transition-opacity">
                    0{i + 1}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
function PhaseCard({
  phase,
  index,
  role,
  company,
  userProfile,
  roadmapId,
  roadmap,
  onSolveChallenge,
  refreshKey,
}) {
  const [open, setOpen] = useState(index === 0);
  const [topicCards, setTopicCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [cardsGenerated, setCardsGenerated] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [studyCollapsed, setStudyCollapsed] = useState(false);
  const [labCollapsed, setLabCollapsed] = useState(false);
  const [practiceCollapsed, setPracticeCollapsed] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [practiceActivities, setPracticeActivities] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [selectedLang, setSelectedLang] = useState("python");

  const [confirmRegenChallenges, setConfirmRegenChallenges] = useState(false);
  const [confirmRegenPractice, setConfirmRegenPractice] = useState(false);
  const [confirmRegenCards, setConfirmRegenCards] = useState(false);

  // ✅ NEW: phase progress state
  const [phaseStatus, setPhaseStatus] = useState(
    () => roadmap?.phaseProgress?.[phase.title] || "not_started",
  );
  const [savingStatus, setSavingStatus] = useState(false);

  const phaseText = (
    phase.title +
    " " +
    (phase.topics || []).join(" ")
  ).toLowerCase();
  const isAlgorithmic =
    /array|tree|graph|dynamic|algorithm|dsa|sorting|searching|recursion|sliding|binary|dfs|bfs|stack|queue|linked list|hashmap|heap|trie|dp|greedy/.test(
      phaseText,
    );

  // ✅ NEW: update status handler
  const handleStatusChange = async (newStatus) => {
    if (savingStatus || newStatus === phaseStatus) return;
    setSavingStatus(true);
    try {
      const token = localStorage.getItem("devsta_token");
      await axios.patch(
        `http://localhost:5000/api/roadmap/${roadmapId}/phase-progress`,
        { phaseTitle: phase.title, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPhaseStatus(newStatus);
    } catch (err) {
      console.error("Failed to update phase status:", err);
      alert("Failed to save status. Please try again.");
    } finally {
      setSavingStatus(false);
    }
  };

  // ✅ Status config
  const statusConfig = {
    not_started: {
      label: "Not Started",
      dotClass: "bg-gray-400",
      badgeClass:
        "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    },
    in_progress: {
      label: "In Progress",
      dotClass: "bg-amber-400 animate-pulse",
      badgeClass:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
    },
    done: {
      label: "Done",
      dotClass: "bg-emerald-500",
      badgeClass:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    },
  };

  const currentStatus = statusConfig[phaseStatus];

  useEffect(() => {
    setTopicCards([]);
    setChallenges([]);
    setPracticeActivities([]);
    setCardsGenerated(false);
    setExpandedTopic(null);
    setActiveSection("overview");
    setStudyCollapsed(false);
    setLabCollapsed(false);
    setPracticeCollapsed(false);
  }, [roadmapId, phase.title]);

  useEffect(() => {
    if (open) loadSavedData();
  }, [open, roadmapId, phase.title, refreshKey]);

  useEffect(() => {
    const cachedCards = roadmap?.topicCards?.[phase.title];
    if (cachedCards?.length) {
      setTopicCards(cachedCards);
      setCardsGenerated(true);
      setExpandedTopic(cachedCards[0]?.topic || null);
    } else {
      setTopicCards([]);
      setCardsGenerated(false);
    }
  }, [roadmap, phase.title]);

  // Sync phaseStatus if roadmap prop changes (e.g. switching roadmaps in sidebar)
  useEffect(() => {
    setPhaseStatus(roadmap?.phaseProgress?.[phase.title] || "not_started");
  }, [roadmap?._id, phase.title]);

  useEffect(() => {
    setChallenges([]);
    setPracticeActivities([]);
  }, [roadmapId, phase.title]);

  const loadSavedData = async () => {
    if (!roadmapId) return;
    setLoadingSaved(true);
    try {
      const token = localStorage.getItem("devsta_token");
      const [chRes, paRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/roadmap/challenges/${roadmapId}`, {
          params: { phaseTitle: phase.title },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          `http://localhost:5000/api/roadmap/practice-activities/${roadmapId}`,
          {
            params: { phaseTitle: phase.title },
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      ]);
      setChallenges(chRes.data.challenges || []);
      setPracticeActivities(paRes.data.activities || []);
    } catch (err) {
      console.error("Failed to load saved data:", err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleGenerateTopicCards = async () => {
    if (!roadmapId || loadingCards || !phase.topics?.length) return;
    setLoadingCards(true);
    try {
      const token = localStorage.getItem("devsta_token");
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/topic-cards",
        {
          topics: phase.topics,
          phaseTitle: phase.title,
          role,
          experience: userProfile?.experienceLevel || "mid",
          roadmapId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTopicCards(res.data.cards || []);
      setCardsGenerated(true);
      setExpandedTopic(res.data.cards?.[0]?.topic || null);
    } catch (err) {
      console.error("Topic cards failed:", err);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleGenerateChallenges = async () => {
    if (!roadmapId) return;
    setLoadingChallenges(true);
    try {
      const token = localStorage.getItem("devsta_token");
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/challenges",
        {
          phase,
          role,
          company,
          preferred_language: selectedLang,
          count: 3,
          roadmapId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Append new challenges to existing ones instead of replacing
      setChallenges((prev) => [...prev, ...(res.data.challenges || [])]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate challenges");
    } finally {
      setLoadingChallenges(false);
    }
  };

  const handleGeneratePractice = async () => {
    if (!roadmapId) return;
    setLoadingActivities(true);
    try {
      const token = localStorage.getItem("devsta_token");
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/practice-activities",
        { phase, role, company, userProfile, roadmapId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Append new activities to existing ones instead of replacing
      setPracticeActivities((prev) => [
        ...prev,
        ...(res.data.activities || []),
      ]);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to generate practice content",
      );
    } finally {
      setLoadingActivities(false);
    }
  };

  return (
    <div
      className={`relative rounded-[2rem] transition-all duration-500 border ${
        open
          ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none translate-x-1"
          : "bg-transparent border-transparent hover:border-gray-100 dark:hover:border-gray-800"
      }`}
    >
      {/* Phase Header */}
      <div className="w-full flex items-center justify-between px-6 py-6 text-left group">
        {/* Left: expand toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-6 flex-1 min-w-0"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shrink-0 ${
              open
                ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200"
            }`}
          >
            {phaseStatus === "done" ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              index + 1
            )}
          </div>
          <div className="min-w-0">
            <h4
              className={`text-lg font-black tracking-tight transition-colors truncate ${open ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
            >
              {phase.title}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {phase.topics?.length || 0} Key
                Modules
              </span>
              {/* ✅ Status badge in header */}
              <span
                className={`flex items-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${currentStatus.badgeClass}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${currentStatus.dotClass}`}
                />
                {currentStatus.label}
              </span>
            </div>
          </div>
        </button>

        {/* Right: status controls + chevron */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {/* ✅ Status toggle buttons */}
          <div className="hidden sm:flex items-center gap-1 rounded-xl p-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {[
              {
                value: "not_started",
                icon: "○",
                title: "Mark as Not Started",
                idle: "bg-gray-200/70 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600",
                active: "bg-gray-500 text-white shadow-sm",
              },
              {
                value: "in_progress",
                icon: "↻",
                title: "Mark as In Progress",
                idle: "bg-amber-100/80 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/25",
                active:
                  "bg-amber-500 text-white shadow-sm shadow-amber-200 dark:shadow-none",
              },
              {
                value: "done",
                icon: "✓",
                title: "Mark as Done",
                idle: "bg-emerald-100/80 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/25",
                active:
                  "bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-none",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                title={opt.title}
                disabled={savingStatus}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(opt.value);
                }}
                className={`w-8 h-8 rounded-lg text-sm font-black transition-all disabled:opacity-50 ${
                  phaseStatus === opt.value ? opt.active : opt.idle
                }`}
              >
                {savingStatus && phaseStatus !== opt.value ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-3 h-3 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  </span>
                ) : (
                  opt.icon
                )}
              </button>
            ))}
          </div>

          <button onClick={() => setOpen(!open)}>
            <ChevronDown
              className={`w-6 h-6 text-gray-300 transition-transform duration-500 ${open ? "rotate-180 text-primary" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile status row — shown below header on small screens */}
      <div className="sm:hidden px-6 pb-4 flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Status:
        </span>
        {[
          { value: "not_started", label: "Not started" },
          { value: "in_progress", label: "In progress" },
          { value: "done", label: "Done" },
        ].map((opt) => (
          <button
            key={opt.value}
            disabled={savingStatus}
            onClick={() => handleStatusChange(opt.value)}
            className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all disabled:opacity-50 ${
              phaseStatus === opt.value
                ? opt.value === "done"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : opt.value === "in_progress"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-gray-500 text-white border-gray-500"
                : opt.value === "done"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                  : opt.value === "in_progress"
                    ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
                    : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            } disabled:opacity-50`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* rest of your existing open && (...) expanded content stays 100% unchanged */}
      {open && (
        <div className="px-6 pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="rounded-[2rem] bg-gray-50 dark:bg-gray-950/70 border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Phase overview
                </p>
                <h5 className="mt-3 text-xl font-black text-gray-900 dark:text-white">
                  {phase.title}
                </h5>
              </div>
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Key modules
                </p>
                <p className="mt-2 text-3xl font-black text-primary">
                  {phase.topics?.length || 0}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {phase.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            {[
              { id: "overview", label: "Overview" },
              { id: "study", label: "Study cards" },
              { id: "lab", label: "Coding lab", condition: isAlgorithmic },
              { id: "practice", label: "Practice" },
            ]
              .filter((item) => item.condition === undefined || item.condition)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    activeSection === item.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>

          {activeSection === "overview" && (
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
                <h6 className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 mb-4 flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Targeted Topics
                </h6>
                <div className="flex flex-wrap gap-2">
                  {phase.topics?.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-3 py-1.5 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 rounded-xl border border-purple-100 dark:border-purple-900/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
                <h6 className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Core Resources
                </h6>
                <ul className="space-y-3">
                  {phase.resources?.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-xs font-bold text-primary"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {activeSection === "study" && (
            <section className="space-y-6">
              <div className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                      Topic study cards
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Interview-focused breakdowns for each topic in this phase.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setStudyCollapsed((prev) => !prev)}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-[10px] font-black text-gray-600 hover:border-gray-300 transition dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                      {studyCollapsed ? "Show cards" : "Hide cards"}
                    </button>
                    {/* {!cardsGenerated ? (
                      <button
                        onClick={handleGenerateTopicCards}
                        disabled={loadingCards || !phase.topics?.length}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-black text-white hover:bg-violet-700 transition disabled:opacity-50"
                      >
                        {loadingCards ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Generate study cards
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateTopicCards}
                        disabled={loadingCards}
                        className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-[10px] font-black text-violet-500 transition hover:border-violet-300 dark:border-gray-700 dark:bg-gray-900"
                      >
                        ↺ Refresh cards
                      </button>
                    )} */}

                    {/* Replace the existing cardsGenerated branch */}
                    {!cardsGenerated ? (
                      <button
                        onClick={handleGenerateTopicCards}
                        disabled={loadingCards || !phase.topics?.length}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-black text-white hover:bg-violet-700 transition disabled:opacity-50"
                      >
                        {loadingCards ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Generate study cards
                          </>
                        )}
                      </button>
                    ) : confirmRegenCards ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-bold">
                          Regenerate all cards?
                        </span>
                        <button
                          onClick={() => {
                            setConfirmRegenCards(false);
                            handleGenerateTopicCards();
                          }}
                          className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-black text-white hover:bg-violet-700 transition"
                        >
                          Yes, refresh
                        </button>
                        <button
                          onClick={() => setConfirmRegenCards(false)}
                          className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-500 hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRegenCards(true)}
                        className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-[10px] font-black text-violet-500 transition hover:border-violet-300 dark:border-gray-700 dark:bg-gray-900"
                      >
                        ↺ Refresh cards
                      </button>
                    )}
                  </div>
                </div>

                {!studyCollapsed && (
                  <>
                    {topicCards.length > 0 ? (
                      <div className="mt-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {topicCards.map((card) => (
                            <button
                              key={card.topic}
                              onClick={() =>
                                setExpandedTopic(
                                  expandedTopic === card.topic
                                    ? null
                                    : card.topic,
                                )
                              }
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 border ${
                                expandedTopic === card.topic
                                  ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200 dark:shadow-none"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-300"
                              }`}
                            >
                              {card.topic}
                            </button>
                          ))}
                        </div>
                        {expandedTopic &&
                          topicCards.map((card) =>
                            expandedTopic === card.topic ? (
                              <TopicStudyCard key={card.topic} card={card} />
                            ) : null,
                          )}
                      </div>
                    ) : (
                      <div className="mt-6 rounded-[1.75rem] border border-dashed border-violet-200 bg-violet-50/70 p-6 text-center text-sm font-black text-violet-500 dark:border-violet-500/20 dark:bg-violet-900/10 dark:text-violet-200">
                        {loadingCards
                          ? "Building your phase study cards…"
                          : "Generate study cards to surface topic summaries and interview questions."}
                      </div>
                    )}
                  </>
                )}
                {studyCollapsed && (
                  <div className="mt-6 rounded-[1.75rem] border border-gray-200 bg-gray-100 p-6 text-sm font-black text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    Topic Study Cards are hidden. Expand the section to view
                    generated cards and interview questions.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeSection === "lab" && isAlgorithmic && (
            <section className="space-y-6">
              <div className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                      Phase actions
                    </p>
                    <h6 className="mt-2 text-lg font-black text-gray-900 dark:text-white">
                      Sharpen your coding skills
                    </h6>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 w-full sm:w-auto">
                    <button
                      onClick={handleGenerateTopicCards}
                      disabled={loadingCards || !phase.topics?.length}
                      className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white hover:bg-violet-700 transition disabled:opacity-50"
                    >
                      {cardsGenerated ? "Update study cards" : "Study cards"}
                    </button>
                    <button
                      onClick={handleGenerateChallenges}
                      disabled={loadingChallenges}
                      className="rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white hover:bg-orange-700 transition disabled:opacity-50"
                    >
                      Coding lab
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-orange-50/30 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
                      <Terminal className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        Algorithmic Lab
                      </h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Coding practice with tailored prompts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLabCollapsed((prev) => !prev)}
                    className="rounded-full border border-orange-200 bg-white px-4 py-2 text-[10px] font-black text-orange-600 transition hover:border-orange-300 dark:border-orange-500/20 dark:bg-orange-950 dark:text-orange-300"
                  >
                    {labCollapsed ? "Expand" : "Collapse"}
                  </button>
                </div>
                {!labCollapsed ? (
                  <>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <select
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                        className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold outline-none dark:border-gray-700 dark:bg-gray-900"
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                      </select>
                      {/* <button
                        onClick={handleGenerateChallenges}
                        disabled={loadingChallenges}
                        className="rounded-2xl bg-orange-600 px-4 py-3 text-xs font-black text-white hover:bg-orange-700 transition disabled:opacity-50"
                      >
                        {loadingChallenges
                          ? "Architecting…"
                          : "Generate challenges"}
                      </button> */}

                      {challenges.length === 0 ? (
                        <button
                          onClick={handleGenerateChallenges}
                          disabled={loadingChallenges}
                          className="rounded-2xl bg-orange-600 px-4 py-3 text-xs font-black text-white hover:bg-orange-700 transition disabled:opacity-50"
                        >
                          {loadingChallenges
                            ? "Architecting…"
                            : "Generate challenges"}
                        </button>
                      ) : confirmRegenChallenges ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-bold">
                            Regenerate? Existing challenges kept.
                          </span>
                          <button
                            onClick={() => {
                              setConfirmRegenChallenges(false);
                              handleGenerateChallenges();
                            }}
                            className="rounded-xl bg-orange-600 px-3 py-2 text-xs font-black text-white hover:bg-orange-700 transition"
                          >
                            Yes, add more
                          </button>
                          <button
                            onClick={() => setConfirmRegenChallenges(false)}
                            className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-500 hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRegenChallenges(true)}
                          className="rounded-2xl border border-orange-300 px-4 py-3 text-xs font-black text-orange-600 hover:bg-orange-50 transition"
                        >
                          ↺ Regenerate challenges
                        </button>
                      )}
                    </div>
                    {loadingSaved && (
                      <p className="text-xs text-gray-400 animate-pulse mb-4">
                        Syncing saved challenges...
                      </p>
                    )}
                    {challenges.length > 0 ? (
                      <div className="mt-6 space-y-4">
                        {challenges.map((ch) => {
                          const statusConfig = {
                            solved: {
                              label: "✓ Solved",
                              badge:
                                "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
                              dot: "bg-emerald-500",
                              btnClass:
                                "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-500/10",
                              cta: "Solve again",
                            },
                            attempted: {
                              label: "↻ Attempted",
                              badge:
                                "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
                              dot: "bg-amber-500",
                              btnClass:
                                "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-500/10",
                              cta: "Keep solving",
                            },
                            reviewed: {
                              label: "⬡ AI Reviewed",
                              badge:
                                "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/30",
                              dot: "bg-violet-500",
                              btnClass:
                                "border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-500/40 dark:text-violet-400 dark:hover:bg-violet-500/10",
                              cta: "Revisit + view review",
                            },
                            unsolved: {
                              label: "○ Not started",
                              badge:
                                "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
                              dot: "bg-gray-400",
                              btnClass:
                                "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600",
                              cta: "Start challenge",
                            },
                          };
                          const s =
                            statusConfig[ch.status] || statusConfig.unsolved;
                          const scorePercent = ch.lastScore ?? null;

                          return (
                            <div
                              key={ch._id}
                              className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h6 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                                  {ch.title}
                                </h6>
                                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                                  <span
                                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                      ch.difficulty === "easy"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                                        : ch.difficulty === "medium"
                                          ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
                                          : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30"
                                    }`}
                                  >
                                    {ch.difficulty}
                                  </span>
                                  <span
                                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${s.badge}`}
                                  >
                                    {s.label}
                                  </span>
                                </div>
                              </div>

                              {(ch.attemptCount > 0 ||
                                ch.status === "reviewed") && (
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                                  />
                                  <span className="text-[10px] text-gray-400 font-bold">
                                    {ch.attemptCount > 0 &&
                                      `${ch.attemptCount} attempt${ch.attemptCount > 1 ? "s" : ""}`}
                                    {scorePercent !== null &&
                                      ` · Best: ${scorePercent}%`}
                                    {ch.status === "reviewed" &&
                                      !ch.attemptCount &&
                                      "AI reviewed"}
                                  </span>
                                </div>
                              )}

                              {scorePercent !== null && (
                                <div className="h-[3px] rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden mb-3">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                      scorePercent === 100
                                        ? "bg-emerald-500"
                                        : scorePercent >= 60
                                          ? "bg-amber-500"
                                          : "bg-rose-500"
                                    }`}
                                    style={{ width: `${scorePercent}%` }}
                                  />
                                </div>
                              )}

                              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                {ch.description}
                              </p>

                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => onSolveChallenge(ch)}
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${s.btnClass}`}
                                >
                                  {s.cta}
                                  <ChevronDown className="-rotate-90 w-3 h-3" />
                                </button>
                                {ch.type === "judge0" && (
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                                    Auto-graded
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-[1.75rem] border border-dashed border-orange-200 bg-orange-50/70 p-5 text-center text-sm font-black text-orange-500 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
                        No lab sessions initiated yet.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-orange-200 bg-orange-50/70 p-5 text-center text-sm font-black text-orange-500 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
                    Algorithmic Lab is collapsed. Expand to view challenge
                    prompts.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeSection === "practice" && (
            <section className="space-y-6">
              <div className="rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                      Phase actions
                    </p>
                    <h6 className="mt-2 text-lg font-black text-gray-900 dark:text-white">
                      Stay focused with guided practice
                    </h6>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 w-full sm:w-auto">
                    <button
                      onClick={handleGenerateTopicCards}
                      disabled={loadingCards || !phase.topics?.length}
                      className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white hover:bg-violet-700 transition disabled:opacity-50"
                    >
                      {cardsGenerated ? "Update study cards" : "Study cards"}
                    </button>
                    <button
                      onClick={handleGeneratePractice}
                      disabled={loadingActivities}
                      className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      Practice tasks
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        Practice Suite
                      </h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Guided activities & tasks
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPracticeCollapsed((prev) => !prev)}
                    className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-[10px] font-black text-indigo-600 transition hover:border-indigo-300 dark:border-indigo-500/20 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {practiceCollapsed ? "Expand" : "Collapse"}
                  </button>
                </div>
                {/* <button
                  onClick={handleGeneratePractice}
                  disabled={loadingActivities}
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loadingActivities
                    ? "Generating practice…"
                    : "Generate practice"}
                </button> */}

                {practiceActivities.length === 0 ? (
                  <button
                    onClick={handleGeneratePractice}
                    disabled={loadingActivities}
                    className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loadingActivities
                      ? "Generating practice…"
                      : "Generate practice"}
                  </button>
                ) : confirmRegenPractice ? (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 font-bold">
                      Add new activities?
                    </span>
                    <button
                      onClick={() => {
                        setConfirmRegenPractice(false);
                        handleGeneratePractice();
                      }}
                      className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black text-white hover:bg-indigo-700 transition"
                    >
                      Yes, generate more
                    </button>
                    <button
                      onClick={() => setConfirmRegenPractice(false)}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-500 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRegenPractice(true)}
                    className="w-full rounded-2xl border border-indigo-300 px-4 py-3 text-sm font-black text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    ↺ Regenerate practice
                  </button>
                )}
                {loadingSaved && (
                  <p className="text-xs text-gray-400 animate-pulse mt-4">
                    Syncing saved activities...
                  </p>
                )}
                {!practiceCollapsed ? (
                  practiceActivities.length > 0 ? (
                    <div className="mt-6 space-y-4">
                      {practiceActivities.map((act, i) => (
                        <div
                          key={act._id || i}
                          className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3 gap-3">
                            <h6 className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                              {act.title}
                            </h6>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                              <Clock className="w-3 h-3" /> {act.expectedTime}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed mb-4">
                            {act.description}
                          </p>
                          {act.questions?.length > 0 && (
                            <div className="mb-4 space-y-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Key Objectives
                              </p>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {act.questions.map((q, idx) => (
                                  <li
                                    key={idx}
                                    className="flex gap-2 text-xs font-medium text-gray-500 dark:text-gray-400"
                                  >
                                    <span className="text-indigo-400 font-black">
                                      •
                                    </span>{" "}
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {act.tips?.length > 0 && (
                            <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex flex-wrap gap-x-4 gap-y-2">
                              {act.tips.map((tip, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5"
                                >
                                  <Lightbulb className="w-3 h-3" /> {tip}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[1.75rem] border border-dashed border-indigo-200 bg-indigo-50/70 p-5 text-center text-sm font-black text-indigo-500 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200">
                      No practice activities have been generated yet.
                    </div>
                  )
                ) : (
                  <div className="mt-6 rounded-[1.75rem] border border-dashed border-indigo-200 bg-indigo-50/70 p-5 text-center text-sm font-black text-indigo-500 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200">
                    Practice Suite is collapsed. Expand to view your guided
                    tasks.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function TopicStudyCard({ card }) {
  return (
    <div className="mt-3 p-6 bg-gradient-to-br from-violet-50/80 to-white dark:from-violet-900/10 dark:to-gray-900 rounded-[1.5rem] border border-violet-100 dark:border-violet-500/20 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Concept */}
      <div>
        <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-2">
          Core Concept
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
          {card.concept}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Points */}
        <div>
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-3">
            Key Points
          </p>
          <ul className="space-y-2">
            {card.key_points?.map((pt, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium"
              >
                <span className="mt-0.5 w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[9px] font-black text-violet-600 dark:text-violet-400 shrink-0">
                  {i + 1}
                </span>
                {pt}
              </li>
            ))}
          </ul>
        </div>

        {/* Interview Questions */}
        <div>
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-3">
            Interview Questions
          </p>
          <ul className="space-y-2">
            {card.interview_questions?.map((q, i) => (
              <li
                key={i}
                className="text-xs text-gray-600 dark:text-gray-400 font-medium flex gap-2"
              >
                <span className="text-violet-400 font-black shrink-0">?</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* What interviewers look for */}
      <div className="flex gap-3 p-4 bg-amber-50/80 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">
            What Interviewers Look For
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            {card.interviewer_looks_for}
          </p>
        </div>
      </div>
    </div>
  );
}
