// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Layers,
//   RotateCcw,
//   Loader2,
//   MessageSquare,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Calendar,
//   Building2,
//   ChevronDown,
//   ArrowLeft,
//   Star,
//   BookOpen,
//   Hash,
//   BarChart2,
//   Mic,
//   Trophy,
//   Trash2,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const STATUS_CONFIG = {
//   completed: {
//     label: "Completed",
//     color: "#059669",
//     bg: "#ecfdf5",
//     border: "#a7f3d0",
//     Icon: CheckCircle2,
//   },
//   abandoned: {
//     label: "Abandoned",
//     color: "#dc2626",
//     bg: "#fef2f2",
//     border: "#fecaca",
//     Icon: XCircle,
//   },
//   active: {
//     label: "In Progress",
//     color: "#d97706",
//     bg: "#fffbeb",
//     border: "#fde68a",
//     Icon: AlertCircle,
//   },
// };

// const PHASE_META = {
//   General: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
//   Technical: { color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
//   Behavioral: { color: "#be185d", bg: "#fdf2f8", border: "#fbcfe8" },
//   "System Design": { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
// };

// const EXP_LABEL = {
//   junior: "Junior · 0–2 yrs",
//   mid: "Mid · 2–5 yrs",
//   senior: "Senior · 5+ yrs",
// };

// function scoreGrade(s) {
//   if (s >= 90) return { label: "Outstanding", color: "#059669", bg: "#ecfdf5" };
//   if (s >= 80) return { label: "Excellent", color: "#0369a1", bg: "#eff6ff" };
//   if (s >= 70) return { label: "Good", color: "#7c3aed", bg: "#f5f3ff" };
//   if (s >= 60) return { label: "Fair", color: "#d97706", bg: "#fffbeb" };
//   return { label: "Needs work", color: "#dc2626", bg: "#fef2f2" };
// }

// // ── Collapsible panel ──────────────────────────────────────────
// function CollapsiblePanel({
//   title,
//   subtitle,
//   iconColor,
//   iconBg,
//   borderColor,
//   accentColor,
//   defaultOpen = true,
//   children,
// }) {
//   const [open, setOpen] = useState(defaultOpen);

//   return (
//     <div
//       style={{
//         borderRadius: 12,
//         border: `1.5px solid ${borderColor}`,
//         overflow: "hidden",
//         boxShadow: open
//           ? `0 2px 10px ${borderColor}80`
//           : "0 1px 2px rgba(0,0,0,0.04)",
//         transition: "box-shadow 0.2s",
//       }}
//     >
//       {/* Header */}
//       <button
//         onClick={() => setOpen((o) => !o)}
//         style={{
//           width: "100%",
//           display: "flex",
//           alignItems: "center",
//           gap: 9,
//           padding: "10px 13px",
//           background: open ? iconBg : "#fdfdfd",
//           border: "none",
//           cursor: "pointer",
//           textAlign: "left",
//           borderBottom: open ? `1px solid ${borderColor}` : "none",
//           transition: "background 0.15s",
//         }}
//         onMouseEnter={(e) => {
//           if (!open) e.currentTarget.style.background = "#f9fafb";
//         }}
//         onMouseLeave={(e) => {
//           if (!open) e.currentTarget.style.background = "#fdfdfd";
//         }}
//       >
//         <div
//           style={{
//             width: 26,
//             height: 26,
//             borderRadius: 7,
//             flexShrink: 0,
//             background: iconBg,
//             border: `1px solid ${borderColor}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {title === "AI Feedback & Score" ? (
//             <Star size={13} strokeWidth={2} style={{ color: iconColor }} />
//           ) : (
//             <MessageSquare
//               size={13}
//               strokeWidth={2}
//               style={{ color: iconColor }}
//             />
//           )}
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div
//             style={{
//               fontSize: 12,
//               fontWeight: 700,
//               color: "#111827",
//               lineHeight: 1.2,
//             }}
//           >
//             {title}
//           </div>
//           {subtitle && (
//             <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1.5 }}>
//               {subtitle}
//             </div>
//           )}
//         </div>
//         <ChevronDown
//           size={13}
//           strokeWidth={2.5}
//           style={{
//             color: "#d1d5db",
//             flexShrink: 0,
//             transform: open ? "rotate(180deg)" : "rotate(0deg)",
//             transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
//           }}
//         />
//       </button>

//       {/* Body */}
//       {open && <div style={{ background: "#fff" }}>{children}</div>}
//     </div>
//   );
// }

// // ── Transcript ─────────────────────────────────────────────────
// function TranscriptView({ history }) {
//   const qaPairs = [];
//   for (let i = 0; i < history.length; i++) {
//     if (history[i].role === "interviewer") {
//       qaPairs.push({
//         q: history[i],
//         a: history[i + 1]?.role === "candidate" ? history[i + 1] : null,
//       });
//       if (history[i + 1]?.role === "candidate") i++;
//     }
//   }
//   if (qaPairs.length === 0) return null;

//   return (
//     <CollapsiblePanel
//       title="Full Transcript"
//       subtitle={`${qaPairs.length} exchange${qaPairs.length !== 1 ? "s" : ""}`}
//       iconColor="#0369a1"
//       iconBg="#f0f9ff"
//       borderColor="#bae6fd"
//       defaultOpen={false}
//     >
//       <div
//         style={{
//           maxHeight: 340,
//           overflowY: "auto",
//           padding: "12px 13px",
//           scrollbarWidth: "thin",
//           scrollbarColor: "#bfdbfe transparent",
//         }}
//       >
//         {qaPairs.map(({ q, a }, idx) => (
//           <div
//             key={idx}
//             style={{ marginBottom: idx < qaPairs.length - 1 ? 14 : 0 }}
//           >
//             {/* Q */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: 8,
//                 alignItems: "flex-start",
//                 marginBottom: 5,
//               }}
//             >
//               <div
//                 style={{
//                   width: 18,
//                   height: 18,
//                   borderRadius: 5,
//                   flexShrink: 0,
//                   marginTop: 2,
//                   background: "#0369a1",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 8,
//                   fontWeight: 800,
//                   color: "#fff",
//                 }}
//               >
//                 {idx + 1}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div
//                   style={{
//                     fontSize: 8.5,
//                     fontWeight: 800,
//                     letterSpacing: "0.07em",
//                     color: "#0369a1",
//                     marginBottom: 3.5,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Interviewer
//                 </div>
//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: 11.5,
//                     lineHeight: 1.65,
//                     color: "#374151",
//                     background: "#f8fafc",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: 7,
//                     padding: "7px 10px",
//                   }}
//                 >
//                   {q.content}
//                 </p>
//               </div>
//             </div>
//             {/* A */}
//             {a && (
//               <div style={{ paddingLeft: 26 }}>
//                 <div
//                   style={{
//                     fontSize: 8.5,
//                     fontWeight: 800,
//                     letterSpacing: "0.07em",
//                     color: "#059669",
//                     marginBottom: 3.5,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Your Answer
//                 </div>
//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: 11.5,
//                     lineHeight: 1.65,
//                     color: "#166534",
//                     background: "#f0fdf4",
//                     border: "1px solid #bbf7d0",
//                     borderRadius: 7,
//                     padding: "7px 10px",
//                   }}
//                 >
//                   {a.content}
//                 </p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </CollapsiblePanel>
//   );
// }

// // ── Feedback ───────────────────────────────────────────────────
// function FeedbackView({ feedback, score }) {
//   if (!feedback) return null;
//   const g = score != null ? scoreGrade(score) : null;

//   return (
//     <CollapsiblePanel
//       title="AI Feedback & Score"
//       subtitle="Personalized performance analysis"
//       iconColor="#ca8a04"
//       iconBg="#fef9ee"
//       borderColor="#fde68a"
//       defaultOpen={true}
//     >
//       <div style={{ padding: "12px 13px" }}>
//         {g && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 9,
//               paddingBottom: 9,
//               borderBottom: "1px solid #fef3c7",
//             }}
//           >
//             <span style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600 }}>
//               Performance rating
//             </span>
//             <span
//               style={{
//                 fontSize: 10.5,
//                 fontWeight: 800,
//                 padding: "3px 10px",
//                 borderRadius: 20,
//                 background: g.bg,
//                 color: g.color,
//                 border: `1px solid ${g.color}35`,
//               }}
//             >
//               {score} · {g.label}
//             </span>
//           </div>
//         )}
//         <p
//           style={{
//             margin: 0,
//             fontSize: 12,
//             lineHeight: 1.75,
//             color: "#4b5563",
//             whiteSpace: "pre-line",
//           }}
//         >
//           {feedback}
//         </p>
//       </div>
//     </CollapsiblePanel>
//   );
// }

// // ── Session detail ─────────────────────────────────────────────
// function SessionDetail({ sessionId }) {
//   const [detail, setDetail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const token =
//     localStorage.getItem("devsta_token") || localStorage.getItem("token");

//   useEffect(() => {
//     axios
//       .get(`${API}/api/interview-session/${sessionId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((r) => setDetail(r.data.session))
//       .catch(() => setDetail(null))
//       .finally(() => setLoading(false));
//   }, [sessionId]);

//   if (loading)
//     return (
//       <div className="px-6 pb-5 pt-4 flex items-center gap-2 text-gray-400 text-sm">
//         <Loader2 size={14} className="animate-spin" /> Loading session details…
//       </div>
//     );
//   if (!detail)
//     return (
//       <div className="px-6 pb-5 pt-4 text-sm text-red-500">
//         Could not load session details.
//       </div>
//     );

//   const hasFeedback = !!detail.feedback;
//   const hasTranscript = (detail.history || []).some(
//     (m) => m.role === "interviewer",
//   );

//   return (
//     <div
//       style={{
//         borderTop: "1px solid #f3f4f6",
//         background: "linear-gradient(to bottom, #fafafa, #fff)",
//       }}
//     >
//       {/* Meta pills */}
//       <div
//         style={{
//           padding: "16px 20px 0",
//           display: "grid",
//           gridTemplateColumns: "repeat(3,1fr)",
//           gap: 10,
//         }}
//       >
//         {[
//           {
//             Icon: BarChart2,
//             label: "Experience",
//             value: EXP_LABEL[detail.experience] || detail.experience || "Mid",
//             color: "#7c3aed",
//             bg: "#f5f3ff",
//           },
//           {
//             Icon: Hash,
//             label: "Questions",
//             value: `${detail.questionCount || "—"} planned`,
//             color: "#0369a1",
//             bg: "#f0f9ff",
//           },
//           {
//             Icon: Mic,
//             label: "Turns",
//             value: `${detail.turnCount} answered`,
//             color: "#059669",
//             bg: "#f0fdf4",
//           },
//         ].map(({ Icon, label, value, color, bg }) => (
//           <div
//             key={label}
//             style={{
//               borderRadius: 10,
//               padding: "9px 12px",
//               display: "flex",
//               alignItems: "center",
//               gap: 9,
//               background: bg,
//               border: `1.5px solid ${color}22`,
//             }}
//           >
//             <Icon size={14} style={{ color, flexShrink: 0 }} strokeWidth={2} />
//             <div style={{ minWidth: 0 }}>
//               <div
//                 style={{
//                   fontSize: 9,
//                   fontWeight: 800,
//                   letterSpacing: "0.07em",
//                   color: color + "99",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 {label}
//               </div>
//               <div
//                 style={{
//                   fontSize: 11.5,
//                   fontWeight: 700,
//                   color,
//                   marginTop: 1.5,
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {value}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Side-by-side panels */}
//       <div style={{ padding: "14px 20px 20px" }}>
//         {!hasFeedback && !hasTranscript && (
//           <p
//             style={{
//               fontSize: 13,
//               color: "#9ca3af",
//               textAlign: "center",
//               padding: "20px 0",
//               fontStyle: "italic",
//             }}
//           >
//             No content recorded for this session.
//           </p>
//         )}

//         {(hasFeedback || hasTranscript) && (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns:
//                 hasFeedback && hasTranscript ? "1fr 1fr" : "1fr",
//               gap: 12,
//               alignItems: "start",
//             }}
//           >
//             {hasFeedback && (
//               <FeedbackView feedback={detail.feedback} score={detail.score} />
//             )}
//             {hasTranscript && <TranscriptView history={detail.history} />}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── Session card ───────────────────────────────────────────────
// function SessionCard({ session, expanded, onExpand ,onDelete, isDeleting = false}) {
//   const status = STATUS_CONFIG[session.status] || STATUS_CONFIG.active;
//   const StatusIcon = status.Icon;
//   const phase = PHASE_META[session.phase] || PHASE_META.Technical;
//   const dateStr = new Date(session.createdAt).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });

//   return (
//     <div
//       className="rounded-2xl overflow-hidden transition-all duration-200"
//       style={{
//         background: "#fff",
//         border: expanded
//           ? `1.5px solid ${PHASE_META[session.phase]?.color || "#086972"}40`
//           : "1.5px solid #f0f0f0",
//         boxShadow: expanded
//           ? `0 4px 24px ${PHASE_META[session.phase]?.color || "#086972"}12`
//           : "0 1px 4px rgba(0,0,0,0.05)",
//       }}
//     >
//       {/* <button onClick={onExpand}
//         className="w-full text-left px-5 py-4 flex items-center gap-4 transition-colors"
//         style={{ background: expanded ? `${PHASE_META[session.phase]?.color || "#086972"}04` : "transparent" }}
//         onMouseEnter={e => !expanded && (e.currentTarget.style.background = "#fafafa")}
//         onMouseLeave={e => !expanded && (e.currentTarget.style.background = "transparent")}
//       > */}
//       <button
//         onClick={onExpand}
//         className="w-full text-left px-5 py-4 flex items-center gap-4 transition-colors relative group"
//         style={{
//           background: expanded
//             ? `${PHASE_META[session.phase]?.color || "#086972"}04`
//             : "transparent",
//         }}
//         onMouseEnter={(e) =>
//           !expanded && (e.currentTarget.style.background = "#fafafa")
//         }
//         onMouseLeave={(e) =>
//           !expanded && (e.currentTarget.style.background = "transparent")
//         }
//       >
//         <div className="flex-1 min-w-0 space-y-2">
//           <div className="flex items-baseline gap-2 flex-wrap">
//             <span className="text-sm font-extrabold text-gray-900 leading-tight">
//               {session.targetRole}
//             </span>
//             {session.targetCompany && (
//               <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
//                 <Building2 size={10} /> {session.targetCompany}
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-2 flex-wrap">
//             <span
//               className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
//               style={{
//                 background: phase.bg,
//                 color: phase.color,
//                 border: `1px solid ${phase.border}`,
//               }}
//             >
//               {session.phase}
//             </span>
//             <span
//               className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
//               style={{
//                 background: status.bg,
//                 color: status.color,
//                 border: `1px solid ${status.border}`,
//               }}
//             >
//               <StatusIcon size={9} strokeWidth={2.5} /> {status.label}
//             </span>
//             <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
//               <Hash size={9} strokeWidth={2} /> {session.turnCount} questions
//               answered
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
//           <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
//             <Calendar size={10} /> {dateStr}
//           </span>
//         </div>

//         <ChevronDown
//           size={16}
//           strokeWidth={2}
//           className="flex-shrink-0 transition-transform ml-1"
//           style={{
//             color: "#d1d5db",
//             transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
//           }}
//         />


//        <button
//   onClick={(e) => {
//     e.stopPropagation();
//     if (window.confirm("Delete this interview permanently? This action cannot be undone.")) {
//       onDelete(session._id);
//     }
//   }}
//   disabled={isDeleting}
//   className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 disabled:opacity-50"
//   title="Delete interview"
// >
//   {isDeleting ? (
//     <Loader2 size={16} className="animate-spin" />
//   ) : (
//     <Trash2 size={16} strokeWidth={2.5} />
//   )}
// </button>

//   <ChevronDown size={16} strokeWidth={2} className="flex-shrink-0 transition-transform ml-1"
//     style={{ color: "#d1d5db", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} 
//   />
//       </button>

//       {expanded && <SessionDetail sessionId={session._id} />}
//     </div>
//   );
// }

// // ── Main ───────────────────────────────────────────────────────
// export default function PastInterviews({ onBack }) {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expanded, setExpanded] = useState(null);
//   const [filter, setFilter] = useState("all");

//   const token =
//     localStorage.getItem("devsta_token") || localStorage.getItem("token");

//   // Add near other useState declarations
//   const [deleting, setDeleting] = useState(null);

//   const handleDelete = async (sessionId) => {
//     if (deleting) return;

//     setDeleting(sessionId);
//     try {
//       await axios.delete(`${API}/api/interview-session/${sessionId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove from local state
//       setSessions((prev) => prev.filter((s) => s._id !== sessionId));

//       // Close expanded view if deleted
//       if (expanded === sessionId) {
//         setExpanded(null);
//       }

//       // Optional: Show success toast
//       alert("Interview deleted successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete interview. Please try again.");
//     } finally {
//       setDeleting(null);
//     }
//   };
//   const fetchSessions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${API}/api/interview-session`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSessions(res.data.sessions || []);
//     } catch {
//       setError("Failed to load past interviews.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   const filtered = sessions.filter(
//     (s) => filter === "all" || s.status === filter,
//   );
//   const completed = sessions.filter((s) => s.status === "completed");
//   const abandoned = sessions.filter((s) => s.status === "abandoned");

//   const FILTERS = [
//     { key: "all", label: "All", count: sessions.length },
//     { key: "completed", label: "Completed", count: completed.length },
//     { key: "abandoned", label: "Abandoned", count: abandoned.length },
//   ];

//   return (
//     <div
//       className="w-full space-y-6"
//       style={{ maxWidth: 800, fontFamily: "inherit" }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//             >
//               <ArrowLeft size={13} strokeWidth={2.5} /> Back
//             </button>
//           )}
//           <div>
//             <h2 className="text-xl font-extrabold text-gray-900">
//               Past Interviews
//             </h2>
//             <p className="text-xs text-gray-400 mt-0.5">
//               Review your sessions, transcripts & feedback
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={fetchSessions}
//           className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//         >
//           <RotateCcw size={11} strokeWidth={2.5} /> Refresh
//         </button>
//       </div>

//       {/* Stats */}
//       {!loading &&
//         sessions.length > 0 &&
//         (() => {
//           const avgScore = completed.length
//             ? Math.round(
//                 completed.reduce((a, s) => a + (s.score ?? 0), 0) /
//                   completed.length,
//               )
//             : null;
//           const bestScore = completed.length
//             ? Math.max(...completed.map((s) => s.score ?? 0))
//             : null;

//           return (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {[
//                 {
//                   Icon: Layers,
//                   label: "Total Sessions",
//                   value: sessions.length,
//                   color: "#7c3aed",
//                   bg: "#f5f3ff",
//                 },
//                 {
//                   Icon: CheckCircle2,
//                   label: "Completed",
//                   value: completed.length,
//                   color: "#059669",
//                   bg: "#ecfdf5",
//                 },
//                 {
//                   Icon: Star,
//                   label: "Avg Score",
//                   value: avgScore !== null ? `${avgScore}/100` : "—",
//                   color: "#d97706",
//                   bg: "#fffbeb",
//                 },
//                 {
//                   Icon: Trophy,
//                   label: "Best Score",
//                   value: bestScore !== null ? `${bestScore}/100` : "—",
//                   color: "#0369a1",
//                   bg: "#eff6ff",
//                 },
//               ].map(({ Icon, label, value, color, bg }) => (
//                 <div
//                   key={label}
//                   className="rounded-2xl p-4 flex items-center gap-3"
//                   style={{ background: bg, border: `1.5px solid ${color}18` }}
//                 >
//                   <Icon
//                     size={20}
//                     style={{ color, flexShrink: 0 }}
//                     strokeWidth={1.8}
//                   />
//                   <div>
//                     <div
//                       className="text-[10px] font-bold uppercase tracking-widest"
//                       style={{ color: color + "99" }}
//                     >
//                       {label}
//                     </div>
//                     <div className="text-2xl font-extrabold" style={{ color }}>
//                       {value}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           );
//         })()}

//       {/* Score trend — only show if 2+ completed sessions with scores */}
//       {!loading &&
//         completed.filter((s) => s.score != null).length > 1 &&
//         (() => {
//           const trendData = completed
//             .filter((s) => s.score != null)
//             .slice()
//             .reverse()
//             .map((s, i) => ({
//               session: i + 1,
//               score: s.score,
//               phase: s.phase,
//             }));

//           return (
//             <div
//               className="rounded-2xl p-5"
//               style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}
//             >
//               <div className="mb-4">
//                 <p className="text-sm font-extrabold text-gray-900">
//                   Score Trend
//                 </p>
//                 <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
//                   Your performance across completed sessions
//                 </p>
//               </div>
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart
//                   data={trendData}
//                   margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
//                 >
//                   <XAxis
//                     dataKey="session"
//                     tick={{ fontSize: 10, fill: "#9ca3af" }}
//                     label={{
//                       value: "Session",
//                       position: "insideBottom",
//                       offset: -2,
//                       fontSize: 10,
//                       fill: "#9ca3af",
//                     }}
//                   />
//                   <YAxis
//                     tick={{ fontSize: 10, fill: "#9ca3af" }}
//                     domain={[0, 100]}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       background: "#1f2937",
//                       border: "1px solid #374151",
//                       borderRadius: 8,
//                       fontSize: 11,
//                       color: "#f9fafb",
//                     }}
//                     formatter={(value, name) => [`${value}/100`, "Score"]}
//                     labelFormatter={(label) => `Session ${label}`}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="score"
//                     stroke="#086972"
//                     strokeWidth={2.5}
//                     dot={{ r: 4, fill: "#086972" }}
//                     activeDot={{ r: 6 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           );
//         })()}

//       {/* Filter tabs */}
//       {sessions.length > 0 && (
//         <div className="flex gap-2 border-b border-gray-100 pb-0">
//           {FILTERS.map(({ key, label, count }) => (
//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               className="flex items-center gap-1.5 pb-3 text-sm font-semibold transition-colors relative"
//               style={{
//                 color: filter === key ? "#086972" : "#9ca3af",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               {label}
//               <span
//                 className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
//                 style={{
//                   background:
//                     filter === key ? "rgba(8,105,114,0.1)" : "#f3f4f6",
//                   color: filter === key ? "#086972" : "#9ca3af",
//                 }}
//               >
//                 {count}
//               </span>
//               {filter === key && (
//                 <span
//                   className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
//                   style={{ background: "#086972" }}
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       )}

//       {loading && (
//         <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
//           <Loader2
//             size={24}
//             className="animate-spin"
//             style={{ color: "#086972" }}
//           />
//           <span className="text-sm font-medium">Loading your sessions…</span>
//         </div>
//       )}

//       {!loading && error && (
//         <div
//           className="px-4 py-3.5 rounded-2xl text-sm font-medium flex items-center gap-2"
//           style={{
//             background: "#fef2f2",
//             border: "1.5px solid #fecaca",
//             color: "#dc2626",
//           }}
//         >
//           <XCircle size={15} /> {error}
//         </div>
//       )}

//       {!loading && !error && sessions.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
//           <div
//             className="w-16 h-16 rounded-3xl flex items-center justify-center"
//             style={{
//               background: "rgba(8,105,114,0.08)",
//               border: "2px dashed rgba(8,105,114,0.2)",
//             }}
//           >
//             <BookOpen
//               size={24}
//               strokeWidth={1.5}
//               style={{ color: "#086972" }}
//             />
//           </div>
//           <div>
//             <p className="text-base font-bold text-gray-700">
//               No interviews yet
//             </p>
//             <p className="text-sm text-gray-400 mt-1 max-w-xs">
//               Complete a mock interview session — your transcript and score will
//               appear here.
//             </p>
//           </div>
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="mt-1 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
//               style={{ background: "#086972" }}
//             >
//               Start your first interview →
//             </button>
//           )}
//         </div>
//       )}

//       {!loading && !error && filtered.length === 0 && sessions.length > 0 && (
//         <div className="text-center py-12 text-sm text-gray-400">
//           No {filter} sessions found.
//         </div>
//       )}

//       {!loading && !error && filtered.length > 0 && (
//         <div className="space-y-3">
//           {filtered.map((session) => (
//             <SessionCard
//               key={session._id}
//               session={session}
//               expanded={expanded === session._id}
//               onExpand={() =>
//                 setExpanded(expanded === session._id ? null : session._id)
//               }
//               onDelete={handleDelete}           // ← Add this
//   isDeleting={deleting === session._id}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  Layers,
  RotateCcw,
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Building2,
  ChevronDown,
  ArrowLeft,
  Star,
  BookOpen,
  Hash,
  BarChart2,
  Mic,
  Trophy,
  Trash2,
  CheckCircle,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const STATUS_CONFIG = {
//   completed: {
//     label: "Completed",
//     color: "#059669",
//     bg: "#ecfdf5",
//     border: "#a7f3d0",
//     Icon: CheckCircle2,
//   },
//   abandoned: {
//     label: "Abandoned",
//     color: "#dc2626",
//     bg: "#fef2f2",
//     border: "#fecaca",
//     Icon: XCircle,
//   },
//   active: {
//     label: "In Progress",
//     color: "#d97706",
//     bg: "#fffbeb",
//     border: "#fde68a",
//     Icon: AlertCircle,
//   },
// };

// Change STATUS_CONFIG active entry to look like abandoned:
const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    Icon: CheckCircle2,
  },
  abandoned: {
    label: "Abandoned",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    Icon: XCircle,
  },
  active: {  // treat visually same as abandoned
    label: "Abandoned",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    Icon: XCircle,
  },
};

const PHASE_META = {
  General: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Technical: { color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
  Behavioral: { color: "#be185d", bg: "#fdf2f8", border: "#fbcfe8" },
  "System Design": { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
};

const EXP_LABEL = {
  junior: "Junior · 0–2 yrs",
  mid: "Mid · 2–5 yrs",
  senior: "Senior · 5+ yrs",
};

function scoreGrade(s) {
  if (s >= 90) return { label: "Outstanding", color: "#059669", bg: "#ecfdf5" };
  if (s >= 80) return { label: "Excellent", color: "#0369a1", bg: "#eff6ff" };
  if (s >= 70) return { label: "Good", color: "#7c3aed", bg: "#f5f3ff" };
  if (s >= 60) return { label: "Fair", color: "#d97706", bg: "#fffbeb" };
  return { label: "Needs work", color: "#dc2626", bg: "#fef2f2" };
}

// ── Modal Components ──────────────────────────────────────────

function SuccessModal({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="relative bg-white dark:bg-[#0a0a0a] border border-white/20 dark:border-gray-700 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-primary transition"
        >
          <X size={20} />
        </button>

        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Success!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white bg-transparent rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function ErrorModal({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="relative bg-white dark:bg-[#0a0a0a] border border-white/20 dark:border-gray-700 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-primary transition"
        >
          <X size={20} />
        </button>

        <XCircle className="mx-auto text-red-500 w-14 h-14 mb-4" />
        <h2 className="text-lg font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white bg-transparent rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onCancel}
          >
            <IoClose size={20} />
          </button>

          <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm mb-5 leading-relaxed">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>

            <button
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 font-semibold"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Collapsible panel ──────────────────────────────────────────
function CollapsiblePanel({
  title,
  subtitle,
  iconColor,
  iconBg,
  borderColor,
  accentColor,
  defaultOpen = true,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1.5px solid ${borderColor}`,
        overflow: "hidden",
        boxShadow: open
          ? `0 2px 10px ${borderColor}80`
          : "0 1px 2px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "10px 13px",
          background: open ? iconBg : "#fdfdfd",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? `1px solid ${borderColor}` : "none",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.background = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = "#fdfdfd";
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            flexShrink: 0,
            background: iconBg,
            border: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {title === "AI Feedback & Score" ? (
            <Star size={13} strokeWidth={2} style={{ color: iconColor }} />
          ) : (
            <MessageSquare
              size={13}
              strokeWidth={2}
              style={{ color: iconColor }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1.5 }}>
              {subtitle}
            </div>
          )}
        </div>
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          style={{
            color: "#d1d5db",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </button>

      {/* Body */}
      {open && <div style={{ background: "#fff" }}>{children}</div>}
    </div>
  );
}

// ── Transcript ─────────────────────────────────────────────────
function TranscriptView({ history }) {
  const qaPairs = [];
  for (let i = 0; i < history.length; i++) {
    if (history[i].role === "interviewer") {
      qaPairs.push({
        q: history[i],
        a: history[i + 1]?.role === "candidate" ? history[i + 1] : null,
      });
      if (history[i + 1]?.role === "candidate") i++;
    }
  }
  if (qaPairs.length === 0) return null;

  return (
    <CollapsiblePanel
      title="Full Transcript"
      subtitle={`${qaPairs.length} exchange${qaPairs.length !== 1 ? "s" : ""}`}
      iconColor="#0369a1"
      iconBg="#f0f9ff"
      borderColor="#bae6fd"
      defaultOpen={false}
    >
      <div
        style={{
          maxHeight: 340,
          overflowY: "auto",
          padding: "12px 13px",
          scrollbarWidth: "thin",
          scrollbarColor: "#bfdbfe transparent",
        }}
      >
        {qaPairs.map(({ q, a }, idx) => (
          <div
            key={idx}
            style={{ marginBottom: idx < qaPairs.length - 1 ? 14 : 0 }}
          >
            {/* Q */}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  flexShrink: 0,
                  marginTop: 2,
                  background: "#0369a1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 8.5,
                    fontWeight: 800,
                    letterSpacing: "0.07em",
                    color: "#0369a1",
                    marginBottom: 3.5,
                    textTransform: "uppercase",
                  }}
                >
                  Interviewer
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    lineHeight: 1.65,
                    color: "#374151",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 7,
                    padding: "7px 10px",
                  }}
                >
                  {q.content}
                </p>
              </div>
            </div>
            {/* A */}
            {a && (
              <div style={{ paddingLeft: 26 }}>
                <div
                  style={{
                    fontSize: 8.5,
                    fontWeight: 800,
                    letterSpacing: "0.07em",
                    color: "#059669",
                    marginBottom: 3.5,
                    textTransform: "uppercase",
                  }}
                >
                  Your Answer
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    lineHeight: 1.65,
                    color: "#166534",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 7,
                    padding: "7px 10px",
                  }}
                >
                  {a.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </CollapsiblePanel>
  );
}

// ── Feedback ───────────────────────────────────────────────────
function FeedbackView({ feedback, score }) {
  if (!feedback) return null;
  const g = score != null ? scoreGrade(score) : null;

  return (
    <CollapsiblePanel
      title="AI Feedback & Score"
      subtitle="Personalized performance analysis"
      iconColor="#ca8a04"
      iconBg="#fef9ee"
      borderColor="#fde68a"
      defaultOpen={true}
    >
      <div style={{ padding: "12px 13px" }}>
        {g && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 9,
              paddingBottom: 9,
              borderBottom: "1px solid #fef3c7",
            }}
          >
            <span style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600 }}>
              Performance rating
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 20,
                background: g.bg,
                color: g.color,
                border: `1px solid ${g.color}35`,
              }}
            >
              {score} · {g.label}
            </span>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div
              style={{
                fontSize: 8.5,
                fontWeight: 800,
                letterSpacing: "0.07em",
                color: "#ca8a04",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              General Feedback
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                lineHeight: 1.6,
                color: "#4b5563",
              }}
            >
              {feedback}
            </p>
          </div>
        </div>
      </div>
    </CollapsiblePanel>
  );
}

// ── Session detail ─────────────────────────────────────────────
function SessionDetail({ sessionId }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("devsta_token") || localStorage.getItem("token");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `${API}/api/interview-session/${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setDetail(res.data.session);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [sessionId, token]);

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    );
  if (!detail) return null;

  const hasFeedback = !!detail.feedback;
  const hasTranscript = detail.history && detail.history.length > 0;

  return (
    <div
      style={{
        padding: "16px 20px 24px",
        background: "#fafafa",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {!hasFeedback && !hasTranscript && (
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              textAlign: "center",
              padding: "20px 0",
              fontStyle: "italic",
            }}
          >
            No content recorded for this session.
          </p>
        )}

        {(hasFeedback || hasTranscript) && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                hasFeedback && hasTranscript ? "1fr 1fr" : "1fr",
              gap: 12,
              alignItems: "start",
            }}
          >
            {hasFeedback && (
              <FeedbackView feedback={detail.feedback} score={detail.score} />
            )}
            {hasTranscript && <TranscriptView history={detail.history} />}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Session card ───────────────────────────────────────────────
function SessionCard({
  session,
  expanded,
  onExpand,
  onDelete,
  isDeleting = false,
}) {
  const status = STATUS_CONFIG[session.status] || STATUS_CONFIG.active;
  const StatusIcon = status.Icon;
  const phase = PHASE_META[session.phase] || PHASE_META.Technical;
  const dateStr = new Date(session.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "#fff",
        border: expanded
          ? `1.5px solid ${PHASE_META[session.phase]?.color || "#086972"}40`
          : "1.5px solid #f0f0f0",
        boxShadow: expanded
          ? `0 4px 24px ${PHASE_META[session.phase]?.color || "#086972"}12`
          : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        onClick={onExpand}
        className="w-full text-left px-5 py-4 flex items-center gap-4 transition-colors relative group cursor-pointer"
        style={{
          background: expanded
            ? `${PHASE_META[session.phase]?.color || "#086972"}04`
            : "transparent",
        }}
        onMouseEnter={(e) =>
          !expanded && (e.currentTarget.style.background = "#fafafa")
        }
        onMouseLeave={(e) =>
          !expanded && (e.currentTarget.style.background = "transparent")
        }
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-extrabold text-gray-900 leading-tight">
              {session.targetRole}
            </span>
            {session.targetCompany && (
              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Building2 size={10} /> {session.targetCompany}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
              style={{
                background: phase.bg,
                color: phase.color,
                border: `1px solid ${phase.border}`,
              }}
            >
              {session.phase}
            </span>
            <span
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
              style={{
                background: status.bg,
                color: status.color,
                border: `1px solid ${status.border}`,
              }}
            >
              <StatusIcon size={9} strokeWidth={2.5} /> {status.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
              <Hash size={9} strokeWidth={2} /> {session.turnCount} questions
              answered
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
            <Calendar size={10} /> {dateStr}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(session._id);
          }}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 disabled:opacity-50"
          title="Delete interview"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} strokeWidth={2.5} />
          )}
        </button>

        <ChevronDown
          size={16}
          strokeWidth={2}
          className="flex-shrink-0 transition-transform ml-1"
          style={{
            color: "#d1d5db",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {expanded && <SessionDetail sessionId={session._id} />}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function PastInterviews({ onBack }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  // Modal states
  const [successModal, setSuccessModal] = useState({ open: false, message: "" });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    sessionId: null,
  });

  const token =
    localStorage.getItem("devsta_token") || localStorage.getItem("token");

  const [deleting, setDeleting] = useState(null);

  const confirmDelete = (sessionId) => {
    setConfirmModal({ open: true, sessionId });
  };

  const handleDelete = async () => {
    const sessionId = confirmModal.sessionId;
    setConfirmModal({ open: false, sessionId: null });

    if (deleting || !sessionId) return;

    setDeleting(sessionId);
    try {
      await axios.delete(`${API}/api/interview-session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSessions((prev) => prev.filter((s) => s._id !== sessionId));

      if (expanded === sessionId) {
        setExpanded(null);
      }

      setSuccessModal({
        open: true,
        message: "Interview deleted successfully",
      });
    } catch (err) {
      console.error(err);
      setErrorModal({
        open: true,
        message: "Failed to delete interview. Please try again.",
      });
    } finally {
      setDeleting(null);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/interview-session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data.sessions || []);
    } catch {
      setError("Failed to load past interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // ✅ This correctly maps the abandoned tab to catch active sessions too
const filtered = sessions.filter((s) => {
  if (filter === "all") return true;
  if (filter === "abandoned") return s.status === "abandoned" || s.status === "active";
  return s.status === filter;
});

  // const filtered = sessions.filter(
  //   (s) => filter === "all" || s.status === filter,
  // );
  // const completed = sessions.filter((s) => s.status === "completed");
  // const abandoned = sessions.filter((s) => s.status === "abandoned");

  // const FILTERS = [
  //   { key: "all", label: "All", count: sessions.length },
  //   { key: "completed", label: "Completed", count: completed.length },
  //   { key: "abandoned", label: "Abandoned", count: abandoned.length },
  // ];


  // Replace your existing filter calculations:
const completed = sessions.filter((s) => s.status === "completed");
const abandoned  = sessions.filter((s) => s.status === "abandoned" || s.status === "active");

const FILTERS = [
  { key: "all",       label: "All",       count: sessions.length   },
  { key: "completed", label: "Completed", count: completed.length  },
  { key: "abandoned", label: "Abandoned", count: abandoned.length  },
];

  return (
    <div
      className="w-full space-y-6"
      style={{ maxWidth: 800, fontFamily: "inherit" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft size={13} strokeWidth={2.5} /> Back
            </button>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Past Interviews
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Review your sessions, transcripts & feedback
            </p>
          </div>
        </div>
        <button
          onClick={fetchSessions}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        >
          <RotateCcw size={11} strokeWidth={2.5} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {!loading &&
        sessions.length > 0 &&
        (() => {
          const validCompleted = completed.filter((s) => s.score != null);
          const avgScore = validCompleted.length
            ? Math.round(
                validCompleted.reduce((acc, s) => acc + (s.score ?? 0), 0) /
                  validCompleted.length,
              )
            : null;
          const bestScore = completed.length
            ? Math.max(...completed.map((s) => s.score ?? 0))
            : null;

          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  Icon: Layers,
                  label: "Total Sessions",
                  value: sessions.length,
                  color: "#7c3aed",
                  bg: "#f5f3ff",
                },
                {
                  Icon: CheckCircle2,
                  label: "Completed",
                  value: completed.length,
                  color: "#059669",
                  bg: "#ecfdf5",
                },
                {
                  Icon: Star,
                  label: "Avg Score",
                  value: avgScore !== null ? `${avgScore}/100` : "—",
                  color: "#d97706",
                  bg: "#fffbeb",
                },
                {
                  Icon: Trophy,
                  label: "Best Score",
                  value: bestScore !== null ? `${bestScore}/100` : "—",
                  color: "#0369a1",
                  bg: "#eff6ff",
                },
              ].map(({ Icon, label, value, color, bg }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: bg, border: `1.5px solid ${color}18` }}
                >
                  <Icon
                    size={20}
                    style={{ color, flexShrink: 0 }}
                    strokeWidth={1.8}
                  />
                  <div>
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: color + "99" }}
                    >
                      {label}
                    </div>
                    <div className="text-2xl font-extrabold" style={{ color }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

   

      {/* Filter tabs */}
      {sessions.length > 0 && (
        <div className="flex gap-2 border-b border-gray-100 pb-0">
          {FILTERS.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="flex items-center gap-1.5 pb-3 text-sm font-semibold transition-colors relative"
              style={{
                color: filter === key ? "#086972" : "#9ca3af",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    filter === key ? "rgba(8,105,114,0.1)" : "#f3f4f6",
                  color: filter === key ? "#086972" : "#9ca3af",
                }}
              >
                {count}
              </span>
              {filter === key && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#086972" }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2
            size={24}
            className="animate-spin"
            style={{ color: "#086972" }}
          />
          <span className="text-sm font-medium">Loading your sessions…</span>
        </div>
      )}

      {!loading && error && (
        <div
          className="px-4 py-3.5 rounded-2xl text-sm font-medium flex items-center gap-2"
          style={{
            background: "#fef2f2",
            border: "1.5px solid #fecaca",
            color: "#dc2626",
          }}
        >
          <XCircle size={15} /> {error}
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{
              background: "rgba(8,105,114,0.08)",
              border: "2px dashed rgba(8,105,114,0.2)",
            }}
          >
            <BookOpen
              size={24}
              strokeWidth={1.5}
              style={{ color: "#086972" }}
            />
          </div>
          <div>
            <p className="text-base font-bold text-gray-700">
              No interviews yet
            </p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Complete a mock interview session — your transcript and score will
              appear here.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-1 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: "#086972" }}
            >
              Start your first interview →
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && sessions.length > 0 && (
        <div className="text-center py-12 text-sm text-gray-400">
          No {filter} sessions found.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              expanded={expanded === session._id}
              onExpand={() =>
                setExpanded(expanded === session._id ? null : session._id)
              }
              onDelete={confirmDelete}
              isDeleting={deleting === session._id}
            />
          ))}
        </div>
      )}

      {/* Custom Modals */}
      <SuccessModal
        open={successModal.open}
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, message: "" })}
      />
      <ErrorModal
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />
      <ConfirmModal
        open={confirmModal.open}
        title="Delete Interview"
        message="Are you sure you want to delete this interview permanently? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ open: false, sessionId: null })}
      />
    </div>
  );
}
