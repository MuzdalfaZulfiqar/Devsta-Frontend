// src/components/interview/tabs/DefineGoal.jsx
import { useState } from "react";
import {
  Briefcase, Building2, Sprout, Zap, Rocket,
  ScanSearch, GitBranch, Map, MessageSquareMore,
  ArrowRight, ChevronRight,
} from "lucide-react";
import { generateRoadmap, getGapAnalysis } from "../../../api/roadmap";

const LOADING_STEPS = [
  "Analyzing your skill profile...",
  "Identifying skill gaps for your target role...",
  "Generating your personalized roadmap with AI...",
  "Finalizing phases and resources...",
];

const ROLE_SUGGESTIONS = [
  "Frontend Engineer", "Backend Engineer", "Full Stack Developer",
  "Data Scientist", "ML Engineer", "DevOps Engineer",
  "Product Manager", "iOS Developer", "Android Developer",
];

const COMPANY_SUGGESTIONS = ["Google", "Meta", "Amazon", "Apple", "Netflix", "Stripe", "Figma"];

const EXPERIENCE_OPTIONS = [
  { value: "junior", label: "Junior",   range: "0–2 yrs", description: "Building fundamentals", Icon: Sprout,  color: "#16a34a", bg: "rgba(22,163,74,0.09)",   border: "rgba(22,163,74,0.28)",  glow: "rgba(22,163,74,0.15)" },
  { value: "mid",    label: "Mid-level", range: "2–5 yrs", description: "Growing ownership",    Icon: Zap,     color: "#d97706", bg: "rgba(217,119,6,0.09)",  border: "rgba(217,119,6,0.28)",  glow: "rgba(217,119,6,0.15)" },
  { value: "senior", label: "Senior",   range: "5+ yrs",  description: "Leading & mentoring",  Icon: Rocket,  color: "#0891b2", bg: "rgba(8,145,178,0.09)",  border: "rgba(8,145,178,0.28)",  glow: "rgba(8,145,178,0.15)" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Profile scan",   desc: "AI reads your existing skills",        Icon: ScanSearch,      color: "#7c3aed", bg: "rgba(124,58,237,0.09)",  border: "rgba(124,58,237,0.22)" },
  { step: "02", title: "Gap analysis",   desc: "Finds what's missing for your role",   Icon: GitBranch,       color: "#db2777", bg: "rgba(219,39,119,0.09)",  border: "rgba(219,39,119,0.22)" },
  { step: "03", title: "Roadmap",        desc: "Phased plan with curated resources",   Icon: Map,             color: "#086972", bg: "rgba(8,105,114,0.09)",   border: "rgba(8,105,114,0.22)"  },
  { step: "04", title: "Mock interview", desc: "AI interviews you for your role",      Icon: MessageSquareMore, color: "#ea580c", bg: "rgba(234,88,12,0.09)", border: "rgba(234,88,12,0.22)"  },
];

const DELIVERABLES = [
  { text: "Skill gap breakdown vs. job requirements", color: "#7c3aed" },
  { text: "Phased study plan with weekly milestones", color: "#db2777" },
  { text: "Curated resources for every gap topic",    color: "#086972" },
  { text: "AI mock interview tailored to your role",  color: "#ea580c" },
];

export default function DefineGoal({ onRoadmapGenerated }) {
  const [form, setForm] = useState({ role: "", company: "", experience: "" });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  const isValid = form.role.trim() && form.experience;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setError(null);
    setLoading(true);
    setLoadingStep(0);
    try {
      const gapData = await getGapAnalysis({ role: form.role.trim(), company: form.company.trim(), experience: form.experience });
      onRoadmapGenerated({ role: form.role, company: form.company, experience: form.experience, gapAnalysis: gapData.gap_analysis, roadmap: null, loadingRoadmap: true });
      setLoadingStep(2);
      const roadmapData = await generateRoadmap({ role: form.role.trim(), company: form.company.trim(), experience: form.experience, gap: gapData.gap_analysis, job_skills: gapData.job_skills });
      onRoadmapGenerated({ ...roadmapData, loadingRoadmap: false });
    } catch (err) {
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-8">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(8,105,114,0.15)" }} />
          <div className="absolute inset-0 rounded-full animate-spin" style={{ border: "2px solid transparent", borderTopColor: "#086972" }} />
          <div className="absolute inset-3 rounded-full animate-spin" style={{ border: "2px solid transparent", borderRightColor: "#0a8a96", animationDirection: "reverse", animationDuration: "0.75s" }} />
        </div>
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-sm font-semibold text-gray-800 dark:text-white animate-pulse">{LOADING_STEPS[loadingStep]}</p>
          <div className="flex gap-2 justify-center">
            {LOADING_STEPS.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-700" style={{ width: i <= loadingStep ? 28 : 6, background: i <= loadingStep ? "#086972" : "rgba(8,105,114,0.18)" }} />
            ))}
          </div>
          <p className="text-xs text-gray-400">Usually takes 15–30 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-fragment">
      <style>{`
        .dg-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .dg-input:focus { outline: none; border-color: #086972 !important; box-shadow: 0 0 0 3px rgba(8,105,114,0.14); }
        .dg-chip { transition: all 0.15s; }
        .dg-chip:hover { border-color: #086972 !important; color: #086972 !important; background: rgba(8,105,114,0.08) !important; }
        .dg-exp { transition: all 0.2s; cursor: pointer; }
        .dg-exp:hover { transform: translateY(-2px); }
        .dg-step { transition: transform 0.18s; }
        .dg-step:hover { transform: translateY(-2px); }
        .dg-submit { transition: all 0.2s; }
        .dg-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(8,105,114,0.4); }
        .dg-header-line {
          background: linear-gradient(90deg, #086972 0%, #0891b2 50%, #7c3aed 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
      `}</style>

      {/* Full-width two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

        {/* ── LEFT + CENTRE: Form (2/3 width) ─────────────── */}
        <div className="lg:col-span-2 space-y-5">

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-snug mb-1">
              Build your interview <span className="dg-header-line">roadmap in seconds</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tell us your goal — AI generates a personalized prep plan based on your current skills.
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          {/* Role + Company side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Briefcase size={11} strokeWidth={2.5} /> Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Engineer..."
                className="dg-input w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "rgba(8,105,114,0.04)", border: "1.5px solid rgba(8,105,114,0.2)", color: "inherit" }}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <div className="flex flex-wrap gap-1.5">
                {ROLE_SUGGESTIONS.map((r) => (
                  <button key={r} onClick={() => setForm({ ...form, role: r })}
                    className="dg-chip text-[11px] px-2.5 py-1 rounded-lg font-medium border"
                    style={{ background: form.role === r ? "rgba(8,105,114,0.1)" : "transparent", borderColor: form.role === r ? "#086972" : "rgba(8,105,114,0.2)", color: form.role === r ? "#086972" : "inherit" }}
                  >{r}</button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Building2 size={11} strokeWidth={2.5} /> Company <span className="font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Google, a startup..."
                className="dg-input w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "rgba(8,105,114,0.04)", border: "1.5px solid rgba(8,105,114,0.2)", color: "inherit" }}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
              <div className="flex flex-wrap gap-1.5">
                {COMPANY_SUGGESTIONS.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, company: c })}
                    className="dg-chip text-[11px] px-2.5 py-1 rounded-lg font-medium border"
                    style={{ background: form.company === c ? "rgba(8,105,114,0.1)" : "transparent", borderColor: form.company === c ? "#086972" : "rgba(8,105,114,0.2)", color: form.company === c ? "#086972" : "inherit" }}
                  >{c}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Experience Level <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {EXPERIENCE_OPTIONS.map(({ value, label, range, description, Icon, color, bg, border, glow }) => {
                const sel = form.experience === value;
                return (
                  <button key={value} onClick={() => setForm({ ...form, experience: value })}
                    className="dg-exp text-left p-4 rounded-xl"
                    style={{ background: sel ? bg : "rgba(0,0,0,0.02)", border: `1.5px solid ${sel ? color : "rgba(0,0,0,0.08)"}`, boxShadow: sel ? `0 0 0 3px ${glow}` : "none" }}
                  >
                    <Icon size={18} strokeWidth={2} style={{ color: sel ? color : "rgba(0,0,0,0.22)" }} className="mb-2 dark:opacity-60" />
                    <div className="text-sm font-bold" style={{ color: sel ? color : "inherit" }}>{label}</div>
                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">{range}</div>
                    <div className="text-[10px] text-gray-500 mt-1 leading-tight">{description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="dg-submit w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: isValid ? "#086972" : "rgba(8,105,114,0.1)", color: isValid ? "#fff" : "rgba(8,105,114,0.35)", border: "none", cursor: isValid ? "pointer" : "not-allowed" }}
          >
            Generate my roadmap
            {isValid && <ArrowRight size={15} strokeWidth={2.5} />}
          </button>
        </div>

        {/* ── RIGHT: Info column (1/3 width) ───────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* How it works — 2×2 coloured tiles */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(8,105,114,0.04)", border: "1px solid rgba(8,105,114,0.13)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#086972" }}>How it works</p>
            <div className="grid grid-cols-2 gap-2">
              {HOW_IT_WORKS.map(({ step, title, desc, Icon, color, bg, border }) => (
                <div key={step} className="dg-step rounded-xl p-3" style={{ background: bg, border: `1px solid ${border}` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon size={14} strokeWidth={2} style={{ color }} />
                    <span className="text-[9px] font-bold font-mono" style={{ color }}>{step}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll get */}
          <div className="rounded-2xl p-4 space-y-2.5" style={{ background: "rgba(8,105,114,0.03)", border: "1px solid rgba(8,105,114,0.1)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#086972" }}>What you'll get</p>
            {DELIVERABLES.map(({ text, color }) => (
              <div key={text} className="flex items-center gap-2">
                <ChevronRight size={12} strokeWidth={2.5} style={{ color, flexShrink: 0 }} />
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
