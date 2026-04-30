// src/components/interview/tabs/ProgressDashboard.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getRoadmaps } from "../../../api/roadmap";
import {
  CheckCircle2, Code2, Sparkles, TrendingUp, ChevronDown,
  ChevronUp, Target, BookOpen, Terminal, AlertCircle, X,
  Star, BarChart2
} from "lucide-react";


// ── AI Review Modal ──────────────────────────────────────────────
function AiReviewModal({ review, onClose }) {
  const score = review.match(/\*\*Final Score:\s*(\d+)\/100\*\*/)
    ? parseInt(review.match(/\*\*Final Score:\s*(\d+)\/100\*\*/)[1])
    : null;

  const sections = review.split(/###\s+\d+\.\s+/).filter(Boolean);

  const sectionColors = [
    { bg: "bg-emerald-50 dark:bg-emerald-500/5", border: "border-emerald-100 dark:border-emerald-500/20", label: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
    { bg: "bg-rose-50 dark:bg-rose-500/5",       border: "border-rose-100 dark:border-rose-500/20",       label: "text-rose-700 dark:text-rose-400",       dot: "bg-rose-500" },
    { bg: "bg-blue-50 dark:bg-blue-500/5",        border: "border-blue-100 dark:border-blue-500/20",        label: "text-blue-700 dark:text-blue-400",        dot: "bg-blue-500" },
    { bg: "bg-amber-50 dark:bg-amber-500/5",      border: "border-amber-100 dark:border-amber-500/20",      label: "text-amber-700 dark:text-amber-400",      dot: "bg-amber-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-white">AI Code Review</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Senior Staff Engineer Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {sections.map((section, i) => {
            const lines = section.trim().split("\n");
            const heading = lines[0].trim();
            const body = lines.slice(1).join("\n").trim();
            const color = sectionColors[i % sectionColors.length];
            return (
              <div key={i} className={`rounded-2xl border ${color.bg} ${color.border} p-4 space-y-2`}>
                <p className={`text-[10px] font-black uppercase tracking-widest ${color.label}`}>{heading}</p>
                <div className="space-y-1.5">
                  {body.split("\n").filter(Boolean).map((line, j) => {
                    const clean = line.replace(/^[-*]\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1").trim();
                    if (!clean) return null;
                    return (
                      <div key={j} className="flex gap-2 items-start">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`} />
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{clean}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {score !== null && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Final Score</p>
                <p className={`text-3xl font-black tabular-nums ${
                  score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"
                }`}>
                  {score}<span className="text-base text-gray-400">/100</span>
                </p>
              </div>
              <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    score >= 80 ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                    : score >= 60 ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : "bg-gradient-to-r from-rose-400 to-red-500"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Code Modal ───────────────────────────────────────────────────
function CodeModal({ code, language, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const KEYWORDS = new Set([
    "def","return","if","else","elif","for","while","in","import","from","class",
    "True","False","None","and","or","not","try","except","with","as","pass",
    "break","continue","lambda","yield","async","await","const","let","var",
    "function","new","this","typeof","instanceof","null","undefined","int","str",
    "list","dict","bool","print","range","len","self","super","export","default",
    "interface","type","enum","extends","implements","public","private","protected",
    "static","readonly","void","any"
  ]);
  const BUILTINS = new Set([
    "console","Math","Array","Object","String","Number","Boolean","Promise","fetch",
    "JSON","Error","Map","Set","Symbol","Date","RegExp","parseInt","parseFloat",
    "isNaN","setTimeout","clearTimeout","setInterval","clearInterval"
  ]);

  const colorize = (line) => {
    const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const span = (color, text, extra="") =>
      `<span style="color:${color}${extra}">${esc(text)}</span>`;
    let out = ""; let i = 0; const s = line;
    while (i < s.length) {
      if (s[i] === "#") { out += span("#059669", s.slice(i), ";font-style:italic"); break; }
      if (s[i] === "/" && s[i+1] === "/") { out += span("#059669", s.slice(i), ";font-style:italic"); break; }
      if (s[i] === '"' || s[i] === "'" || s[i] === "`") {
        const q = s[i]; let j = i + 1;
        while (j < s.length) {
          if (s[j] === "\\") { j += 2; continue; }
          if (s[j] === q) { j++; break; }
          j++;
        }
        out += span("#d97706", s.slice(i, j)); i = j; continue;
      }
      if (/\d/.test(s[i]) && (i === 0 || /\W/.test(s[i-1]))) {
        let j = i; while (j < s.length && /[\d.]/.test(s[j])) j++;
        out += span("#0891b2", s.slice(i, j)); i = j; continue;
      }
      if (/[a-zA-Z_]/.test(s[i])) {
        let j = i; while (j < s.length && /\w/.test(s[j])) j++;
        const word = s.slice(i, j);
        let k = j; while (k < s.length && s[k] === " ") k++;
        const isCall = s[k] === "(";
        if (KEYWORDS.has(word)) out += span("#7c3aed", word, ";font-weight:600");
        else if (BUILTINS.has(word)) out += span("#0891b2", word);
        else if (isCall) out += span("#2563eb", word);
        else out += esc(word);
        i = j; continue;
      }
      if (/[=!<>+\-*/%&|^~]/.test(s[i])) {
        let j = i; while (j < s.length && /[=!<>+\-*/%&|^~]/.test(s[j])) j++;
        out += span("#be185d", s.slice(i, j)); i = j; continue;
      }
      out += esc(s[i]); i++;
    }
    return out;
  };

  const ext = { python:"py", javascript:"js", typescript:"ts", java:"java", cpp:"cpp", go:"go", rust:"rs", ruby:"rb" }[language] || language;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-white">Solution Code</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">solution.{ext}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copy}
              className="text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-colors"
              style={copied
                ? { background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" }
                : { background: "transparent", color: "#9ca3af", borderColor: "#e5e7eb" }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code body */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <table className="w-full border-collapse" style={{ fontFamily: "'Fira Code','Cascadia Code','JetBrains Mono',Consolas,monospace", fontSize: "12.5px", lineHeight: "1.7" }}>
            <tbody>
              {code.split("\n").map((line, idx) => (
                <tr key={idx} className="hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors">
                  <td className="select-none text-right tabular-nums pr-4 pl-5" style={{ color: "#c0c0c0", borderRight: "1px solid #e5e7eb", width: "3rem", fontSize: "11px", userSelect: "none", paddingTop: "1px", paddingBottom: "1px" }}>
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre pl-5 pr-8" style={{ paddingTop: "1px", paddingBottom: "1px", color: "#1f2937" }}
                    dangerouslySetInnerHTML={{ __html: colorize(line) || "\u00a0" }}
                  />
                </tr>
              ))}
              <tr><td colSpan={2} style={{ paddingBottom: "1.5rem" }} /></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Roadmap Dropdown ─────────────────────────────────────────────
function RoadmapDropdown({ roadmaps, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const ref = useRef(null);
  const selected = roadmaps.find(r => r._id === selectedId);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getPct = (r) => {
    const phases = r?.roadmap?.phases || [];
    const progress = r?.phaseProgress || {};
    const done = phases.filter(p => progress[p.title] === "done").length;
    return phases.length ? Math.round((done / phases.length) * 100) : 0;
  };

   // ADD THIS helper
  const getStatus = (r) => {
    const phases = r?.roadmap?.phases || [];
    const progress = r?.phaseProgress || {};
    if (!phases.length) return "not_started";
    const done = phases.filter(p => progress[p.title] === "done").length;
    const inProg = phases.filter(p => progress[p.title] === "in_progress").length;
    if (done === phases.length) return "done";
    if (done > 0 || inProg > 0) return "in_progress";
    return "not_started";
  };

  const filtered = filter === "all" ? roadmaps : roadmaps.filter(r => getStatus(r) === filter);

  
  return (
    <div className="relative" ref={ref}>
      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 pl-1">Roadmap</label>

      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-left transition-all hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        style={{ boxShadow: open ? "0 0 0 3px var(--tw-ring-color)" : undefined }}
      >
        {selected ? (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 dark:text-white truncate">{selected.role}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider capitalize mt-0.5">{selected.experience}</p>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Select a roadmap</span>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {selected && (
            <span className={`text-xs font-black tabular-nums ${getPct(selected) === 100 ? "text-emerald-500" : "text-primary"}`}>
              {getPct(selected)}%
            </span>
          )}
          <div className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute z-40 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* ADD: filter pills at top of dropdown */}
          <div className="flex gap-1.5 p-3 border-b border-gray-100 dark:border-gray-800 flex-wrap">
            {[
              { value: "all", label: "All" },
              { value: "not_started", label: "Not started" },
              { value: "in_progress", label: "In progress" },
              { value: "done", label: "Done" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={(e) => { e.stopPropagation(); setFilter(f.value); }}
                className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all ${
                  filter === f.value
                    ? f.value === "done"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : f.value === "in_progress"
                      ? "bg-amber-500 text-white border-amber-500"
                      : f.value === "not_started"
                      ? "bg-gray-500 text-white border-gray-500"
                      : "bg-primary text-white border-primary"
                    : "bg-transparent text-gray-500 border-gray-200 dark:border-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-5">No roadmaps match this filter.</p>
          ) : (
            filtered.map((r, i) => {
              // ... your existing map — use `filtered` instead of `roadmaps` ...
              const pct = getPct(r);
            const isActive = r._id === selectedId;
            return (
              <button
                key={r._id}
                onClick={() => { onSelect(r._id); setOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors ${
                  isActive ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                } ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}
              >
                {/* Progress ring / check */}
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {pct === 100
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <span className={`text-xs font-black tabular-nums ${isActive ? "text-primary" : "text-gray-500"}`}>{pct}%</span>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black truncate ${isActive ? "text-primary" : "text-gray-800 dark:text-gray-200"}`}>{r.role}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider capitalize mt-0.5">{r.experience} · {r.company || "General Path"}</p>
                </div>

                {/* Mini progress bar */}
                <div className="shrink-0 w-20">
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? "bg-emerald-500" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Active tick */}
                {isActive && (
                  <div className="shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            );
            })
          )}
        </div>
        
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function ProgressDashboard() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [expandedSub, setExpandedSub] = useState(null);
  const [activeReview, setActiveReview] = useState(null);
  const [activeCode, setActiveCode] = useState(null); // { code, language }
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("devsta_token");

  useEffect(() => {
    Promise.all([
      getRoadmaps(),
      axios.get("http://localhost:5000/api/roadmap/submissions/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]).then(([roadmapData, subRes]) => {
      setRoadmaps(roadmapData);
      if (roadmapData.length > 0) setSelectedId(roadmapData[0]._id);
      setSubmissions(subRes.data.submissions || []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    axios.get(`http://localhost:5000/api/roadmap/progress/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data));
  }, [selectedId]);

  if (loading) return (
    <div className="py-20 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm text-gray-400 font-medium">Loading your progress...</p>
    </div>
  );

  if (!roadmaps.length) return (
    <div className="py-20 text-center text-gray-400">No roadmaps yet. Generate one first.</div>
  );

  const currentRoadmap = roadmaps.find(r => r._id === selectedId);
  const phases = currentRoadmap?.roadmap?.phases || [];
  const phaseProgress = currentRoadmap?.phaseProgress || {};
  const doneCount = phases.filter(p => phaseProgress[p.title] === "done").length;
  const inProgressCount = phases.filter(p => phaseProgress[p.title] === "in_progress").length;
  const overallPct = phases.length ? Math.round((doneCount / phases.length) * 100) : 0;

  const roadmapChallengeIds = new Set(
    (stats?.challenges || []).map(c => c._id?.toString())
  );
  const filteredSubmissions = submissions.filter(
    sub => roadmapChallengeIds.has(sub.challenge?._id?.toString())
  );

  return (
    <>
      {/* Modals */}
      {activeReview && (
        <AiReviewModal review={activeReview} onClose={() => setActiveReview(null)} />
      )}
      {activeCode && (
        <CodeModal
          code={activeCode.code}
          language={activeCode.language}
          onClose={() => setActiveCode(null)}
        />
      )}

      <div className="space-y-8 max-w-4xl pb-20">

        {/* Roadmap custom dropdown */}
        {roadmaps.length > 1 && (
          <RoadmapDropdown
            roadmaps={roadmaps}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {/* Hero journey bar */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 dark:bg-black p-7 text-white">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Career Journey</p>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{currentRoadmap?.role || "—"}</h2>
            <p className="text-sm text-white/50 capitalize mb-6">
              {currentRoadmap?.experience} level · {currentRoadmap?.company || "General Path"}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    overallPct === 100 ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                    : "bg-gradient-to-r from-primary to-violet-500"
                  }`}
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <span className={`text-3xl font-black tabular-nums shrink-0 ${
                overallPct === 100 ? "text-emerald-400" : overallPct >= 50 ? "text-amber-400" : "text-white"
              }`}>{overallPct}%</span>
            </div>
            <div className="flex gap-5 mt-4">
              {[
                { dot: "bg-gray-500", label: `${phases.filter(p => !phaseProgress[p.title] || phaseProgress[p.title] === "not_started").length} not started` },
                { dot: "bg-amber-400", label: `${inProgressCount} in progress` },
                { dot: "bg-emerald-400", label: `${doneCount} completed` },
              ].map(({ dot, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-[11px] text-white/50 font-bold">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/15 rounded-full blur-[80px]" />
        </div>

        {/* Stat cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Challenges Solved", value: stats.solved, sub: `of ${stats.total} generated`, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-500" },
              { label: "Best Score",        value: stats.avgScore > 0 ? `${Math.round(stats.avgScore)}%` : "—", sub: "avg across attempts", icon: <Star className="w-4 h-4" />, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-500" },
              { label: "AI Reviews",        value: stats.reviewed, sub: "code reviews done", icon: <Sparkles className="w-4 h-4" />, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", iconColor: "text-violet-500" },
              { label: "Phases Done",       value: `${doneCount}/${phases.length}`, sub: `${inProgressCount} in progress`, icon: <Target className="w-4 h-4" />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-500" },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center ${s.iconColor} mb-3`}>{s.icon}</div>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Phase tracker */}
        {phases.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Phase Tracker</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Your learning curriculum progress</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-500">{doneCount} / {phases.length}</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">phases done</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {phases.map((phase, i) => {
                const st = phaseProgress[phase.title] || "not_started";
                const challengeData = stats?.byPhase?.[phase.title];
                const solvedInPhase = challengeData?.solved || 0;
                const totalInPhase = challengeData?.total || 0;
                const stConfig = {
                  not_started: { pill: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400", rowBg: "" },
                  in_progress:  { pill: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", rowBg: "bg-amber-50/30 dark:bg-amber-500/5" },
                  done:         { pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400", rowBg: "bg-emerald-50/20 dark:bg-emerald-500/5" },
                }[st];
                const labels = { not_started: "Not started", in_progress: "In Progress", done: "Done" };

                return (
                  <div key={i} className={`px-6 py-4 ${stConfig.rowBg} transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        st === "done" ? "bg-emerald-500 text-white"
                        : st === "in_progress" ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}>
                        {st === "done" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-black truncate ${
                            st === "done" ? "text-gray-400 line-through decoration-emerald-400"
                            : st === "in_progress" ? "text-gray-900 dark:text-white"
                            : "text-gray-500"
                          }`}>{phase.title}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${stConfig.pill}`}>
                            {labels[st]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {phase.topics?.length || 0} topics
                          </span>
                          {totalInPhase > 0 && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Terminal className="w-3 h-3" /> {solvedInPhase}/{totalInPhase} challenges
                            </span>
                          )}
                        </div>
                      </div>
                      {totalInPhase > 0 && (
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${solvedInPhase === totalInPhase ? "bg-emerald-500" : "bg-primary"}`}
                              style={{ width: `${totalInPhase ? (solvedInPhase / totalInPhase) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold w-8 text-right">
                            {totalInPhase ? Math.round((solvedInPhase / totalInPhase) * 100) : 0}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Code Activity Log */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">Code Activity Log</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Every run, submit & review for this roadmap</p>
            </div>
            {filteredSubmissions.length > 0 && (
              <span className="text-xs font-black text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                {filteredSubmissions.length} entries
              </span>
            )}
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="py-14 text-center">
              <Terminal className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-sm font-bold text-gray-400">No activity yet for this roadmap</p>
              <p className="text-xs text-gray-400 mt-1">Solve a challenge to see your log here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredSubmissions.map((sub) => {
                const isAccepted = sub.status === "Accepted";
                const isReviewed = sub.status === "AI Reviewed";

                return (
                  <div key={sub._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    {/* Status icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isAccepted ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : isReviewed ? "bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400"
                      : "bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    }`}>
                      {isAccepted ? <CheckCircle2 className="w-4 h-4" /> : isReviewed ? <Sparkles className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                        {sub.challenge?.title || "Unknown Challenge"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${
                          isAccepted ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                          : isReviewed ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/30"
                          : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30"
                        }`}>{sub.status}</span>
                        <span className="text-[10px] text-gray-400">{sub.challenge?.phaseTitle}</span>
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-[10px] text-gray-400 font-mono">{sub.language}</span>
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Score + action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {sub.score !== null && sub.score !== undefined && (
                        <span className={`text-lg font-black tabular-nums ${
                          sub.score === 100 ? "text-emerald-500" : sub.score >= 60 ? "text-amber-500" : "text-rose-500"
                        }`}>{sub.score}%</span>
                      )}

                      {/* Code button — only on non-AI-reviewed submissions */}
                      {!isReviewed && sub.code && (
                        <button
                          onClick={() => setActiveCode({ code: sub.code, language: sub.language || "code" })}
                          className="flex items-center gap-1 text-[10px] font-black text-sky-500 hover:text-sky-700 px-2 py-1 rounded-lg border border-sky-200 dark:border-sky-500/30 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors"
                        >
                          <Code2 className="w-3 h-3" /> Code
                        </button>
                      )}

                      {/* AI Review button — only on AI Reviewed submissions */}
                      {isReviewed && sub.aiReview && (
                        <button
                          onClick={() => setActiveReview(sub.aiReview)}
                          className="flex items-center gap-1 text-[10px] font-black text-violet-500 hover:text-violet-700 px-2 py-1 rounded-lg border border-violet-200 dark:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                        >
                          <Sparkles className="w-3 h-3" /> Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
