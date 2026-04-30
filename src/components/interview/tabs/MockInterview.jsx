// working----
import { useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  Mic, MicOff, LogOut, Briefcase, Building2,
  Sprout, Zap, Rocket, Trophy, RotateCcw,
  ArrowRight, CheckCircle2, ChevronRight,
  Target, MessageSquareMore, Timer, History,
} from "lucide-react";
import { useSpeech } from "../../../hooks/useSpeech";
import TalkingAvatar from "../avatar/TalkingAvatar";
import PastInterviews from "./PastInterviews";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PHASES = [
  { key: "General",       label: "General",       color: "#7c3aed", bg: "rgba(124,58,237,0.09)",  border: "rgba(124,58,237,0.25)" },
  { key: "Technical",     label: "Technical",     color: "#086972", bg: "rgba(8,105,114,0.09)",   border: "rgba(8,105,114,0.25)"  },
  { key: "Behavioral",    label: "Behavioral",    color: "#db2777", bg: "rgba(219,39,119,0.09)",  border: "rgba(219,39,119,0.25)" },
  { key: "System Design", label: "System Design", color: "#ea580c", bg: "rgba(234,88,12,0.09)",   border: "rgba(234,88,12,0.25)"  },
];

const EXP_OPTIONS = [
  { value: "junior", label: "Junior",   range: "0–2 yrs", Icon: Sprout,  color: "#16a34a", bg: "rgba(22,163,74,0.09)",  border: "rgba(22,163,74,0.28)",  glow: "rgba(22,163,74,0.15)"  },
  { value: "mid",    label: "Mid",      range: "2–5 yrs", Icon: Zap,     color: "#d97706", bg: "rgba(217,119,6,0.09)",  border: "rgba(217,119,6,0.28)",  glow: "rgba(217,119,6,0.15)"  },
  { value: "senior", label: "Senior",   range: "5+ yrs",  Icon: Rocket,  color: "#0891b2", bg: "rgba(8,145,178,0.09)",  border: "rgba(8,145,178,0.28)",  glow: "rgba(8,145,178,0.15)"  },
];

const WHAT_TO_EXPECT = [
  { title: "Adaptive questions",  desc: "Follow-ups based on your actual answers",      color: "#7c3aed" },
  { title: "Real conversation",   desc: "No rigid scripts — flows like a real interview", color: "#db2777" },
  { title: "Instant feedback",    desc: "Detailed score and tips at the end",             color: "#086972" },
  { title: "Voice or type",       desc: "Use your mic or type — your choice",             color: "#ea580c" },
];

export default function MockInterview({ userProfile, roadmapData }) {

  const [showHistory,      setShowHistory]      = useState(false);
  const [customRole,       setCustomRole]       = useState("");
  const [customCompany,    setCustomCompany]    = useState("");
  const [customExperience, setCustomExperience] = useState("mid");
  const [questionCount,    setQuestionCount]    = useState(8);

  const [sessionId,       setSessionId]       = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentType,     setCurrentType]     = useState("technical");
  const [sessionStatus,   setSessionStatus]   = useState("idle");
  const [feedback,        setFeedback]        = useState(null);
  const [score,           setScore]           = useState(null);
  const [history,         setHistory]         = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [selectedPhase,   setSelectedPhase]   = useState("Technical");
  const [isMuted,         setIsMuted]         = useState(false);
  const [error,           setError]           = useState(null);
  const [turnCount,       setTurnCount]       = useState(0);
  const [elapsedSeconds,  setElapsedSeconds]  = useState(0);

  const avatarRef = useRef(null);
  const timerRef  = useRef(null);
  const token     = localStorage.getItem("devsta_token") || localStorage.getItem("token");

  const { isListening, isSpeaking, transcript, setTranscript, micError, sttSupported, startListening, stopListening, speak, cancelSpeech, sttMode, setTypedTranscript } = useSpeech();

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const startTimer = () => { timerRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000); };
  const stopTimer  = () => clearInterval(timerRef.current);

  const handleSpeak = useCallback((text, onEnd) => {
    if (isMuted) { onEnd?.(); return; }
    if (avatarRef.current?.speakText) { avatarRef.current.speakText(text, onEnd); return; }
    speak(text, { onEnd });
  }, [isMuted, speak]);

  const startSession = async () => {
    const targetRole       = roadmapData?.role       || customRole.trim()    || "Software Engineer";
    const targetCompany    = roadmapData?.company    || customCompany.trim() || "";
    const targetExperience = roadmapData?.experience || customExperience;
    if (!targetRole) { setError("Please enter a role to interview for."); return; }
    setLoading(true); setError(null);
    try {
      const res = await axios.post(`${API}/api/interview-session/start`,
        { roadmapId: roadmapData?._id || null, targetRole, targetCompany, experience: targetExperience, phase: selectedPhase, questionCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionId(res.data.sessionId);
      setCurrentQuestion(res.data.question);
      setCurrentType(res.data.type || "technical");
      setSessionStatus("active");
      setTurnCount(0); setHistory([]); setElapsedSeconds(0);
      startTimer();
      setTimeout(() => { handleSpeak(res.data.question, () => startListening()); }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect. Is n8n running?");
    } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    const stopped = stopListening();
    await new Promise((r) => setTimeout(r, 150));
    const finalAnswer = (stopped || transcript).trim();
    if (!finalAnswer) { setError("No answer recorded. Click the mic button, speak your answer, then click Submit."); return; }
    if (!sessionId) return;
    cancelSpeech(); setError(null); setLoading(true);
    const questionSnapshot = currentQuestion;
    setHistory((p) => [...p, { role: "interviewer", content: questionSnapshot }, { role: "candidate", content: finalAnswer }]);
    setTranscript("");
    if (avatarRef.current?.setThinking) avatarRef.current.setThinking(true);
    try {
      const res = await axios.post(`${API}/api/interview-session/continue`,
        { sessionId, userAnswer: finalAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (avatarRef.current?.setThinking) avatarRef.current.setThinking(false);
      setTurnCount(res.data.turnCount || turnCount + 1);
      if (res.data.done) {
        stopTimer(); setSessionStatus("done"); setFeedback(res.data.feedback); setScore(res.data.score);
      } else {
        setCurrentQuestion(res.data.question);
        setCurrentType(res.data.type || "technical");
        setTimeout(() => handleSpeak(res.data.question, () => startListening()), 400);
      }
    } catch (err) {
      if (avatarRef.current?.setThinking) avatarRef.current.setThinking(false);
      setError("Failed to submit. Please try again.");
      console.error(err);
    } finally { setLoading(false); }
  };

  const reset = async () => {
    cancelSpeech(); stopTimer();
    if (sessionId && sessionStatus === "active") {
      try { await axios.patch(`${API}/api/interview-session/abandon/${sessionId}`, {}, { headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    }
    setSessionId(null); setCurrentQuestion(""); setTranscript(""); setSessionStatus("idle");
    setFeedback(null); setScore(null); setHistory([]); setError(null); setTurnCount(0); setElapsedSeconds(0);
  };

  // ── HISTORY VIEW ────────────────────────────────────────────
  if (showHistory) {
    return <PastInterviews onBack={() => setShowHistory(false)} />;
  }

  // ── IDLE ────────────────────────────────────────────────────
  if (sessionStatus === "idle") {
    const hasRoadmap = !!roadmapData?.role;

    return (
      <div className="w-full font-fragment">
        <style>{`
          .mi-input { transition: border-color 0.2s, box-shadow 0.2s; }
          .mi-input:focus { outline: none; border-color: #086972 !important; box-shadow: 0 0 0 3px rgba(8,105,114,0.14); }
          .mi-chip { transition: all 0.15s; }
          .mi-chip:hover { border-color: #086972 !important; color: #086972 !important; background: rgba(8,105,114,0.08) !important; }
          .mi-exp { transition: all 0.2s; cursor: pointer; }
          .mi-exp:hover { transform: translateY(-2px); }
          .mi-phase { transition: all 0.18s; cursor: pointer; }
          .mi-phase:hover { transform: translateY(-1px); }
          .mi-submit { transition: all 0.2s; }
          .mi-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(8,105,114,0.4); }
          .mi-header-line {
            background: linear-gradient(90deg, #086972 0%, #0891b2 50%, #db2777 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          }
          .mi-history-btn { transition: all 0.18s; }
          .mi-history-btn:hover { background: rgba(8,105,114,0.12) !important; border-color: rgba(8,105,114,0.4) !important; }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

          {/* ── LEFT + CENTRE: Form (2/3) ─────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title row with history button */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-snug mb-1">
                  Practice like it's <span className="mi-header-line">the real thing</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adaptive follow-up questions, real conversation flow, and detailed feedback.
                </p>
              </div>

              {/* ── View past interviews button ── */}
              <button
                onClick={() => setShowHistory(true)}
                className="mi-history-btn flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition"
                style={{
                  background: "rgba(8,105,114,0.07)",
                  border: "1.5px solid rgba(8,105,114,0.22)",
                  color: "#086972",
                  whiteSpace: "nowrap",
                }}
              >
                <History size={14} strokeWidth={2.5} />
                Past interviews
              </button>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#ef4444" }}>
                {error}
              </div>
            )}

            {/* Roadmap context OR custom inputs */}
            {hasRoadmap ? (
              <div className="p-4 rounded-xl" style={{ background: "rgba(8,105,114,0.06)", border: "1px solid rgba(8,105,114,0.2)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#086972" }}>Using roadmap settings</p>
                <div className="flex flex-wrap gap-6">
                  {[
                    { label: "Role",    value: roadmapData.role,       Icon: Briefcase, color: "#086972" },
                    { label: "Level",   value: roadmapData.experience, Icon: Zap,       color: "#d97706" },
                    ...(roadmapData.company ? [{ label: "Company", value: roadmapData.company, Icon: Building2, color: "#7c3aed" }] : []),
                  ].map(({ label, value, Icon, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon size={13} strokeWidth={2} style={{ color }} />
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white capitalize">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Briefcase size={11} strokeWidth={2.5} /> Role <span className="text-red-400">*</span>
                  </label>
                  <input type="text" value={customRole} onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer..."
                    className="mi-input w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: "rgba(8,105,114,0.04)", border: "1.5px solid rgba(8,105,114,0.2)", color: "inherit" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Building2 size={11} strokeWidth={2.5} /> Company <span className="font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <input type="text" value={customCompany} onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="e.g. Google, a startup..."
                    className="mi-input w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: "rgba(8,105,114,0.04)", border: "1.5px solid rgba(8,105,114,0.2)", color: "inherit" }}
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Experience level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {EXP_OPTIONS.map(({ value, label, range, Icon, color, bg, border, glow }) => {
                      const sel = customExperience === value;
                      return (
                        <button key={value} onClick={() => setCustomExperience(value)}
                          className="mi-exp text-left p-3.5 rounded-xl"
                          style={{ background: sel ? bg : "rgba(0,0,0,0.02)", border: `1.5px solid ${sel ? color : "rgba(0,0,0,0.08)"}`, boxShadow: sel ? `0 0 0 3px ${glow}` : "none" }}
                        >
                          <Icon size={16} strokeWidth={2} style={{ color: sel ? color : "rgba(0,0,0,0.22)" }} className="mb-1.5 dark:opacity-60" />
                          <div className="text-sm font-bold" style={{ color: sel ? color : "inherit" }}>{label}</div>
                          <div className="text-[10px] font-mono text-gray-400">{range}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Focus area */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Focus area</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PHASES.map(({ key, label, color, bg, border }) => {
                  const sel = selectedPhase === key;
                  return (
                    <button key={key} onClick={() => setSelectedPhase(key)}
                      className="mi-phase py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: sel ? bg : "rgba(0,0,0,0.02)", border: `1.5px solid ${sel ? color : "rgba(0,0,0,0.08)"}`, color: sel ? color : "inherit" }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question count */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Questions — <span style={{ color: "#086972" }}>{questionCount}</span>
              </label>
              <input type="range" min={4} max={20} step={1} value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full" style={{ accentColor: "#086972" }}
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>4 · quick</span><span>12 · standard</span><span>20 · deep dive</span>
              </div>
            </div>

            {/* Submit */}
            <button onClick={startSession}
              disabled={loading || (!hasRoadmap && !customRole.trim())}
              className="mi-submit w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: (!hasRoadmap && !customRole.trim()) ? "rgba(8,105,114,0.1)" : "#086972",
                color:       (!hasRoadmap && !customRole.trim()) ? "rgba(8,105,114,0.35)" : "#fff",
                border: "none",
                cursor: loading || (!hasRoadmap && !customRole.trim()) ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Starting...</>
                : <><span>Start interview</span><ArrowRight size={15} strokeWidth={2.5} /></>
              }
            </button>
          </div>

          {/* ── RIGHT: Info (1/3) ─────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* What to expect */}
            <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(8,105,114,0.04)", border: "1px solid rgba(8,105,114,0.13)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#086972" }}>What to expect</p>
              <div className="space-y-2.5">
                {WHAT_TO_EXPECT.map(({ title, desc, color }) => (
                  <div key={title} className="flex gap-2.5 items-start">
                    <CheckCircle2 size={13} strokeWidth={2} style={{ color, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{title}</p>
                      <p className="text-[10px] text-gray-500 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick tips */}
            <div className="rounded-2xl p-4 space-y-2.5" style={{ background: "rgba(8,105,114,0.03)", border: "1px solid rgba(8,105,114,0.1)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#086972" }}>Quick tips</p>
              {[
                { text: "Speak clearly — the mic picks up naturally",  color: "#7c3aed" },
                { text: "Use STAR format for behavioral questions",    color: "#db2777" },
                { text: "It's okay to pause before answering",        color: "#086972" },
                { text: "Ask to clarify if a question is ambiguous",  color: "#ea580c" },
              ].map(({ text, color }) => (
                <div key={text} className="flex items-start gap-2">
                  <ChevronRight size={12} strokeWidth={2.5} style={{ color, flexShrink: 0, marginTop: 1 }} />
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ────────────────────────────────────────────────────
  if (sessionStatus === "done") {
    const scoreColorVal = score >= 80 ? "#086972" : score >= 60 ? "#d97706" : "#ef4444";
    return (
      <div className="w-full font-fragment max-w-2xl space-y-5">
        <div className="p-8 rounded-2xl text-center space-y-2" style={{ background: "rgba(8,105,114,0.06)", border: "1px solid rgba(8,105,114,0.18)" }}>
          <Trophy size={32} strokeWidth={1.5} style={{ color: "#086972", margin: "0 auto 8px" }} />
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Interview Complete</h2>
          {score !== null && (
            <>
              <p className="text-6xl font-extrabold mt-2" style={{ color: scoreColorVal }}>
                {score}<span className="text-lg font-normal text-gray-400">/100</span>
              </p>
              <p className="text-sm text-gray-500">
                {score >= 80 ? "Excellent performance — you're ready!" : score >= 60 ? "Good effort — a bit more practice and you'll nail it." : "Keep going — practice makes perfect."}
              </p>
            </>
          )}
        </div>
        {feedback && (
          <div className="p-6 rounded-2xl space-y-3" style={{ background: "rgba(8,105,114,0.04)", border: "1px solid rgba(8,105,114,0.12)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#086972" }}>Feedback</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{feedback}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={reset}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90"
            style={{ background: "#086972", color: "#fff", border: "none" }}
          >
            <RotateCcw size={14} strokeWidth={2.5} /> New session
          </button>
          <button onClick={() => { reset(); setShowHistory(true); }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition hover:opacity-90"
            style={{ background: "rgba(8,105,114,0.08)", border: "1.5px solid rgba(8,105,114,0.2)", color: "#086972" }}
          >
            <History size={14} strokeWidth={2.5} /> View history
          </button>
        </div>
      </div>
    );
  }

  // ── ACTIVE ──────────────────────────────────────────────────
  return (
    <div className="flex rounded-[2rem] overflow-hidden border border-gray-200 dark:border-gray-800" style={{ height: "700px" }}>

      {/* LEFT PANEL */}
      <div className="flex flex-col p-5 gap-3 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" style={{ width: "35%", minHeight: 0 }}>
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSpeaking ? "bg-orange-500 animate-pulse" : ""}`}
              style={isListening ? { background: "#086972" } : !isSpeaking ? { background: "#10b981" } : {}}
            />
            {isSpeaking ? "Speaking" : isListening ? "Listening..." : "Active"}
          </div>
          <span className="text-xs text-gray-400 tabular-nums font-medium">{formatTime(elapsedSeconds)}</span>
        </div>

        <div className="flex-shrink-0 rounded-2xl p-4" style={{ background: "rgba(8,105,114,0.04)", border: "1px solid rgba(8,105,114,0.15)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: "rgba(8,105,114,0.12)", color: "#086972" }}>
              {currentType}
            </span>
            <span className="text-[10px] text-gray-400">Q{turnCount + 1} / {questionCount}</span>
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-white leading-relaxed">
            {loading && !currentQuestion
              ? <span className="flex items-center gap-2 text-gray-400 text-sm font-normal"><span className="w-3.5 h-3.5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin inline-block" />Thinking...</span>
              : currentQuestion
            }
          </p>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
          {history.length === 0 && <p className="text-xs text-gray-400 italic text-center mt-4">Conversation history will appear here</p>}
          {history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[88%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                style={msg.role === "candidate"
                  ? { background: "#086972", color: "#fff" }
                  : { background: "rgba(8,105,114,0.07)", color: "inherit", border: "1px solid rgba(8,105,114,0.12)" }
                }
              >{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 flex-wrap">
          {[
            { label: "Role",  value: roadmapData?.role  || customRole  || "Engineer" },
            { label: "Level", value: roadmapData?.experience || customExperience || "Mid" },
            { label: "Focus", value: selectedPhase },
          ].map((m, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{m.value}</span>
            </div>
          ))}
        </div>

        {error && <div className="flex-shrink-0 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-xs text-red-600 dark:text-red-400">{error}</div>}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col" style={{ width: "65%" }}>
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          <TalkingAvatar ref={avatarRef} isSpeaking={isSpeaking} isMuted={isMuted}
            onToggleMute={() => { setIsMuted((m) => !m); if (!isMuted) cancelSpeech(); }}
          />
        </div>

        <div className="flex-shrink-0 flex flex-col gap-3 px-6 py-5 border-t border-white/[0.06]" style={{ background: "#0d0d12" }}>
          {micError === "not-allowed" && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              Microphone blocked — allow mic access in your browser, then refresh.
            </div>
          )}
          {sttMode === "typing" && micError !== "not-allowed" && (
            <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
              Voice input unavailable — type your answer below.
            </div>
          )}

          {sttMode === "typing" ? (
            <textarea value={transcript} onChange={(e) => setTypedTranscript(e.target.value)}
              placeholder="Type your answer here..." rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm text-white/90 resize-none outline-none"
              style={{ background: "rgba(8,105,114,0.1)", border: "1px solid rgba(8,105,114,0.35)", minHeight: 72 }}
            />
          ) : (
            <div className="rounded-xl px-4 py-3 text-sm leading-relaxed transition-all" style={{
              minHeight: 48,
              background: isListening ? "rgba(8,105,114,0.1)" : "rgba(255,255,255,0.03)",
              border:     isListening ? "1px solid rgba(8,105,114,0.5)" : "1px solid rgba(255,255,255,0.07)",
              color:      transcript  ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
            }}>
              {transcript
                ? <span>{transcript}</span>
                : <span className="italic">{isListening ? "● Listening... speak now" : "Click mic to start speaking"}</span>
              }
            </div>
          )}

          <div className="flex items-center gap-3">
            {sttMode === "speech" && (
              <button onClick={() => isListening ? stopListening() : startListening()} disabled={loading}
                className="flex-shrink-0 flex items-center justify-center rounded-full transition-all disabled:opacity-40"
                style={{ width: 52, height: 52, background: isListening ? "#ea580c" : "#086972", transform: isListening ? "scale(1.08)" : "scale(1)", animation: isListening ? "mic-pulse 1.5s ease-in-out infinite" : "none" }}
              >
                {isListening ? <MicOff style={{ width: 20, height: 20, color: "white" }} /> : <Mic style={{ width: 20, height: 20, color: "white" }} />}
              </button>
            )}
            {sttMode === "speech" && (
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isListening ? "#f97316" : "rgba(255,255,255,0.25)", minWidth: 56 }}>
                {isListening ? "Recording" : "Mic off"}
              </span>
            )}
            <button onClick={submitAnswer} disabled={loading || !transcript.trim()}
              className="flex-1 h-11 rounded-xl text-sm font-bold transition"
              style={{
                border:     "0.5px solid rgba(255,255,255,0.14)",
                background: transcript.trim() ? "rgba(8,105,114,0.35)" : "rgba(255,255,255,0.05)",
                color:      transcript.trim() ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.25)",
                cursor:     transcript.trim() && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Processing...</span>
                : transcript.trim() ? (sttMode === "typing" ? "Send answer" : "Submit answer") : (sttMode === "typing" ? "Type your answer above" : "Record answer first")
              }
            </button>
            <button onClick={reset}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition flex-shrink-0"
              style={{ border: "0.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
            >
              <LogOut style={{ width: 15, height: 15 }} />
            </button>
          </div>

          {transcript.trim() && !loading && (
            <button onClick={() => setTranscript("")} className="text-xs text-white/25 hover:text-white/50 transition text-left">
              Clear and re-record
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.4); }
          50%       { box-shadow: 0 0 0 10px rgba(234,88,12,0); }
        }
      `}</style>
    </div>
  );
}

