// // src/pages/ResumePage.jsx
// import { useState, useEffect, useCallback } from "react";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";
// import { BACKEND_URL } from "../../../config";
// import { Eye, Download, CheckCircle, Pencil, Sparkles } from "lucide-react";
// import { fetchResumePdf } from "../../api/resume";
// import ResumeTemplateModal from "../../components/ResumeTemplateModal";
// import ResumeEditModal from "../../components/ResumeEditModal";

// export default function ResumePage() {
//   const { user, token } = useAuth();

//   const [resumeData, setResumeData] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");

//   const [isGenerateOpen, setIsGenerateOpen] = useState(false);
//   const [isExportOpen, setIsExportOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   const refreshStatus = useCallback(async () => {
//     if (!user?._id || !token) return;

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/resume/status/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (data?.exists) {
//         setResumeData({
//           resumePdfUrl: data.resumePdfUrl,
//           template: data.template,
//           updatedAt: data.lastUpdated,
//         });
//       } else {
//         setResumeData(null);
//       }
//     } catch {
//       setResumeData(null);
//     }
//   }, [user?._id, token]);

//   useEffect(() => {
//     refreshStatus();
//   }, [refreshStatus]);

//   const handleViewResume = async () => {
//     try {
//       const blob = await fetchResumePdf(user._id, token);
//       const blobUrl = window.URL.createObjectURL(blob);
//       window.open(blobUrl, "_blank");
//       setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000);
//     } catch (e) {
//       console.error(e);
//       alert("Failed to open resume. Please log in again.");
//     }
//   };

//   const handleDownloadResume = async () => {
//     try {
//       const blob = await fetchResumePdf(user._id, token);
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `Resume_${user?.name || "Professional"}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       console.error(e);
//       alert("Failed to download resume. Please log in again.");
//     }
//   };

//   const showSuccess = (msg) => {
//     setSuccessMessage(msg);
//     setTimeout(() => setSuccessMessage(""), 5000);
//   };

//   const onGeneratedOrExported = async (msg) => {
//     await refreshStatus();
//     showSuccess(msg);
//   };

//   const onEdited = async () => {
//     await refreshStatus();
//     showSuccess("Resume updated successfully!");
//   };

//   const hasResume = !!resumeData?.resumePdfUrl;

//   return (
//     <DashboardLayout user={user}>
//       <div className="max-w-5xl mx-auto px-4 py-10">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
//           <h1 className="text-3xl font-bold">Professional Resume</h1>

//           {/* ✅ State A: First time => only Generate */}
//           {!hasResume ? (
//             <button
//               onClick={() => setIsGenerateOpen(true)}
//               className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
//             >
//               <Sparkles className="w-5 h-5" />
//               Generate Resume
//             </button>
//           ) : (
//             /* ✅ State B: Resume exists => Edit + Export */
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setIsEditOpen(true)}
//                 className="px-5 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
//               >
//                 <Pencil className="w-5 h-5" />
//                 Edit
//               </button>
//               <button
//                 onClick={() => setIsExportOpen(true)}
//                 className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
//               >
//                 <Sparkles className="w-5 h-5" />
//                 Generate / Export
//               </button>
//             </div>
//           )}
//         </div>

//         {successMessage && (
//           <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-sm">
//             <CheckCircle className="w-6 h-6 text-green-600" />
//             <span className="font-medium">{successMessage}</span>
//           </div>
//         )}

//         {/* Actions if exists */}
//         {hasResume && (
//           <div className="flex gap-4 mb-8">
//             <button
//               onClick={handleViewResume}
//               className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
//             >
//               <Eye className="w-5 h-5" /> View Resume
//             </button>
//             <button
//               onClick={handleDownloadResume}
//               className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition flex items-center justify-center gap-2"
//             >
//               <Download className="w-5 h-5" /> Download PDF
//             </button>
//           </div>
//         )}

//         {/* ✅ Template Modal: First-time Generate */}
//         {isGenerateOpen && (
//           <ResumeTemplateModal
//             isOpen={isGenerateOpen}
//             onClose={() => setIsGenerateOpen(false)}
//             mode="generate"
//             onSuccess={() => onGeneratedOrExported("Resume generated successfully!")}
//           />
//         )}

//         {/* ✅ Template Modal: Export after exists (NO AI) */}
//         {isExportOpen && (
//           <ResumeTemplateModal
//             isOpen={isExportOpen}
//             onClose={() => setIsExportOpen(false)}
//             mode="export"
//             onSuccess={() => onGeneratedOrExported("Resume exported successfully!")}
//           />
//         )}

//         {/* ✅ Edit Modal: only after exists */}
//         {isEditOpen && hasResume && (
//           <ResumeEditModal
//             isOpen={isEditOpen}
//             onClose={() => setIsEditOpen(false)}
//             onSuccess={onEdited}
//           />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// // src/pages/ResumePage.jsx
// import { useState, useEffect, useCallback } from "react";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";
// import { BACKEND_URL } from "../../../config";
// import {
//   Eye,
//   Download,
//   CheckCircle,
//   Pencil,
//   Sparkles,
//   FileText,
//   Clock,
//   Zap,
//   Layers,
//   ChevronRight,
//   RefreshCw,
//   Calendar,
//   LayoutTemplate,
//   Star,
// } from "lucide-react";
// import { fetchResumePdf } from "../../api/resume";
// import ResumeTemplateModal from "../../components/ResumeTemplateModal";
// import ResumeEditModal from "../../components/ResumeEditModal";

// // ─── How It Works steps ─────────────────────────────────────────────────────
// const HOW_IT_WORKS = [
//   {
//     icon: FileText,
//     step: "01",
//     title: "Profile is read",
//     desc: "We pull your experience, education, projects, and GitHub repos automatically.",
//     accent: "#086972",
//   },
//   {
//     icon: Zap,
//     step: "02",
//     title: "AI crafts your resume",
//     desc: "Our model rewrites bullet points for impact, highlights ATS keywords, and structures everything perfectly.",
//     accent: "#0891b2",
//   },
//   {
//     icon: Layers,
//     step: "03",
//     title: "Pick a template",
//     desc: "Choose from 6 professionally designed layouts — minimal to sidebar-modern.",
//     accent: "#086972",
//   },
//   {
//     icon: Download,
//     step: "04",
//     title: "Download your PDF",
//     desc: "One click. Print-ready, ATS-optimized, and yours to keep.",
//     accent: "#0891b2",
//   },
// ];

// // ─── Template preview cards (static) ────────────────────────────────────────
// const TEMPLATE_PREVIEWS = [
//   { id: "classic_ats", name: "Classic ATS", tag: "Most popular", color: "#086972" },
//   { id: "header_accent", name: "Header Accent", tag: "Visual", color: "#0891b2" },
//   { id: "minimal_no_rules", name: "Minimal", tag: "Clean", color: "#475569" },
//   { id: "sidebar_modern", name: "Sidebar Modern", tag: "Modern", color: "#7c3aed" },
//   { id: "two_column_balanced", name: "Two-Column", tag: "Balanced", color: "#0f766e" },
//   { id: "project_showcase", name: "Project Showcase", tag: "Dev-first", color: "#b45309" },
// ];

// // ─── Mini PDF skeleton (template preview illustration) ───────────────────────
// function TemplateSkeleton({ color, layout = "single" }) {
//   const line = (w, opacity = 1) => (
//     <div
//       style={{
//         height: 4,
//         width: w,
//         background: `${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`,
//         borderRadius: 2,
//         marginBottom: 4,
//       }}
//     />
//   );

//   if (layout === "sidebar") {
//     return (
//       <div style={{ display: "flex", gap: 6, padding: "12px 10px", height: "100%" }}>
//         <div style={{ width: "30%", display: "flex", flexDirection: "column", gap: 3 }}>
//           <div style={{ height: 20, width: "100%", background: `${color}22`, borderRadius: 3, marginBottom: 6 }} />
//           {line("80%", 0.5)}
//           {line("60%", 0.3)}
//           {line("70%", 0.3)}
//           {line("50%", 0.3)}
//         </div>
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
//           {line("90%", 0.7)}
//           {line("100%", 0.3)}
//           {line("85%", 0.3)}
//           <div style={{ marginTop: 6 }} />
//           {line("70%", 0.6)}
//           {line("100%", 0.25)}
//           {line("90%", 0.25)}
//         </div>
//       </div>
//     );
//   }

//   if (layout === "two_col") {
//     return (
//       <div style={{ display: "flex", gap: 6, padding: "12px 10px", height: "100%" }}>
//         {[0, 1].map((col) => (
//           <div key={col} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
//             <div style={{ height: col === 0 ? 16 : 8, background: `${color}22`, borderRadius: 2, marginBottom: 5 }} />
//             {line("90%", 0.5)}
//             {line("75%", 0.3)}
//             {line("80%", 0.3)}
//             <div style={{ marginTop: 4 }} />
//             {line("60%", 0.4)}
//             {line("85%", 0.25)}
//             {line("70%", 0.25)}
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
//       <div style={{ height: 16, width: "55%", background: `${color}33`, borderRadius: 3, marginBottom: 6, alignSelf: "center" }} />
//       {line("80%", 0.4)}
//       {line("65%", 0.25)}
//       <div style={{ marginTop: 6, borderTop: `1px solid ${color}33`, paddingTop: 4 }} />
//       {line("40%", 0.55)}
//       {line("100%", 0.2)}
//       {line("90%", 0.2)}
//       {line("75%", 0.2)}
//       <div style={{ marginTop: 4 }} />
//       {line("40%", 0.55)}
//       {line("100%", 0.2)}
//       {line("85%", 0.2)}
//     </div>
//   );
// }

// const LAYOUT_MAP = {
//   sidebar_modern: "sidebar",
//   two_column_balanced: "two_col",
// };

// // ─── Resume history item ─────────────────────────────────────────────────────
// function HistoryItem({ entry, idx, onView, onDownload }) {
//   const date = entry.updatedAt ? new Date(entry.updatedAt) : null;
//   const label = date
//     ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
//     : "—";
//   const time = date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";
//   const tpl = TEMPLATE_PREVIEWS.find((t) => t.id === entry.template) || TEMPLATE_PREVIEWS[0];

//   return (
//     <div
//       className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/40 transition-all group"
//       style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
//     >
//       <div
//         className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
//         style={{ background: tpl.color }}
//       >
//         {idx + 1}
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <span className="font-medium text-gray-900 text-sm truncate">{tpl.name} Template</span>
//           {idx === 0 && (
//             <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#086972", color: "#fff" }}>
//               Latest
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-1 mt-0.5">
//           <Calendar className="w-3 h-3 text-gray-400" />
//           <span className="text-xs text-gray-500">{label} · {time}</span>
//         </div>
//       </div>
//       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//         <button
//           onClick={onView}
//           className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
//           title="View"
//         >
//           <Eye className="w-4 h-4" />
//         </button>
//         <button
//           onClick={onDownload}
//           className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
//           title="Download"
//         >
//           <Download className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ───────────────────────────────────────────────────────────────
// export default function ResumePage() {
//   const { user, token } = useAuth();

//   const [resumeData, setResumeData] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [history, setHistory] = useState([]);

//   const [isGenerateOpen, setIsGenerateOpen] = useState(false);
//   const [isExportOpen, setIsExportOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   const refreshStatus = useCallback(async () => {
//     if (!user?._id || !token) return;
//     try {
//       const res = await fetch(`${BACKEND_URL}/api/resume/status/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data?.exists) {
//         const entry = {
//           resumePdfUrl: data.resumePdfUrl,
//           template: data.template,
//           updatedAt: data.lastUpdated,
//         };
//         setResumeData(entry);
//         // Keep a local history list (most recent first)
//         setHistory((prev) => {
//           const updated = [entry, ...prev.filter((h) => h.updatedAt !== entry.updatedAt)].slice(0, 5);
//           return updated;
//         });
//       } else {
//         setResumeData(null);
//       }
//     } catch {
//       setResumeData(null);
//     }
//   }, [user?._id, token]);

//   useEffect(() => {
//     refreshStatus();
//   }, [refreshStatus]);

//   const handleViewResume = async () => {
//     try {
//       const blob = await fetchResumePdf(user._id, token);
//       const blobUrl = window.URL.createObjectURL(blob);
//       window.open(blobUrl, "_blank");
//       setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000);
//     } catch (e) {
//       console.error(e);
//       alert("Failed to open resume. Please log in again.");
//     }
//   };

//   const handleDownloadResume = async () => {
//     try {
//       const blob = await fetchResumePdf(user._id, token);
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `Resume_${user?.name || "Professional"}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       console.error(e);
//       alert("Failed to download resume. Please log in again.");
//     }
//   };

//   const showSuccess = (msg) => {
//     setSuccessMessage(msg);
//     setTimeout(() => setSuccessMessage(""), 5000);
//   };

//   const onGeneratedOrExported = async (msg) => {
//     await refreshStatus();
//     showSuccess(msg);
//   };

//   const onEdited = async () => {
//     await refreshStatus();
//     showSuccess("Resume updated successfully!");
//   };

//   const hasResume = !!resumeData?.resumePdfUrl;

//   return (
//     <DashboardLayout user={user}>
//       <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

//         {/* ── Hero Header ── */}
//         <div
//           className="relative rounded-2xl overflow-hidden p-8 md:p-10"
//           style={{
//             background: "linear-gradient(135deg, #086972 0%, #0891b2 100%)",
//           }}
//         >
//           {/* decorative rings */}
//           <div
//             className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-10 border-[24px]"
//             style={{ borderColor: "#ffffff" }}
//           />
//           <div
//             className="absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-10 border-[16px]"
//             style={{ borderColor: "#ffffff" }}
//           />

//           <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 <Sparkles className="w-5 h-5 text-white/80" />
//                 <span className="text-white/80 text-sm font-medium tracking-wide uppercase">AI-Powered</span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
//                 Professional Resume
//               </h1>
//               <p className="mt-2 text-white/75 text-base max-w-md">
//                 Your profile, transformed into a polished, ATS-ready resume in seconds.
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               {!hasResume ? (
//                 <button
//                   onClick={() => setIsGenerateOpen(true)}
//                   className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
//                   style={{ background: "#fff", color: "#086972" }}
//                 >
//                   <Sparkles className="w-4 h-4" />
//                   Generate My Resume
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => setIsEditOpen(true)}
//                     className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 transition-all"
//                   >
//                     <Pencil className="w-4 h-4" />
//                     Edit Content
//                   </button>
//                   <button
//                     onClick={() => setIsExportOpen(true)}
//                     className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
//                     style={{ background: "#fff", color: "#086972" }}
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                     Re-generate / Export
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Success Banner ── */}
//         {successMessage && (
//           <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl shadow-sm">
//             <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//             <span className="font-medium text-sm">{successMessage}</span>
//           </div>
//         )}

//         {/* ── If resume exists: action row ── */}
//         {hasResume && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <button
//               onClick={handleViewResume}
//               className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-xl hover:border-primary/50 hover:bg-gray-50 transition-all group"
//             >
//               <div
//                 className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
//                 style={{ background: "#f0fafa" }}
//               >
//                 <Eye className="w-4 h-4" style={{ color: "#086972" }} />
//               </div>
//               <div className="text-left">
//                 <div className="font-semibold text-gray-900 text-sm">View Resume</div>
//                 <div className="text-xs text-gray-500">Opens in a new tab</div>
//               </div>
//               <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
//             </button>

//             <button
//               onClick={handleDownloadResume}
//               className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl hover:opacity-95 transition-all group"
//               style={{ background: "#086972" }}
//             >
//               <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/20 group-hover:scale-110 transition-transform">
//                 <Download className="w-4 h-4 text-white" />
//               </div>
//               <div className="text-left">
//                 <div className="font-semibold text-white text-sm">Download PDF</div>
//                 <div className="text-xs text-white/70">Print-ready format</div>
//               </div>
//               <ChevronRight className="w-4 h-4 text-white/40 ml-auto group-hover:translate-x-0.5 transition-transform" />
//             </button>
//           </div>
//         )}

//         {/* ── Resume Status Card (if exists) ── */}
//         {hasResume && resumeData && (
//           <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-wrap gap-6 items-center">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#e6f7f8" }}>
//                 <LayoutTemplate className="w-5 h-5" style={{ color: "#086972" }} />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Template</div>
//                 <div className="text-sm font-semibold text-gray-800">
//                   {TEMPLATE_PREVIEWS.find((t) => t.id === resumeData.template)?.name || resumeData.template}
//                 </div>
//               </div>
//             </div>
//             <div className="w-px h-10 bg-gray-200 hidden sm:block" />
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#e6f7f8" }}>
//                 <Clock className="w-5 h-5" style={{ color: "#086972" }} />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Last Updated</div>
//                 <div className="text-sm font-semibold text-gray-800">
//                   {resumeData.updatedAt
//                     ? new Date(resumeData.updatedAt).toLocaleDateString("en-US", {
//                         month: "long",
//                         day: "numeric",
//                         year: "numeric",
//                       })
//                     : "—"}
//                 </div>
//               </div>
//             </div>
//             <div className="w-px h-10 bg-gray-200 hidden sm:block" />
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#e6f7f8" }}>
//                 <Star className="w-5 h-5" style={{ color: "#086972" }} />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</div>
//                 <div className="text-sm font-semibold" style={{ color: "#086972" }}>
//                   ATS-Optimized ✓
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── How It Works ── */}
//         <section>
//           <div className="flex items-center gap-2 mb-6">
//             <h2 className="text-xl font-bold text-gray-900">How it works</h2>
//             <div className="flex-1 h-px bg-gray-100" />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc, accent }) => (
//               <div
//                 key={step}
//                 className="relative p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all group"
//                 style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
//               >
//                 <div
//                   className="absolute top-4 right-4 font-black text-4xl leading-none select-none"
//                   style={{ color: `${accent}10` }}
//                 >
//                   {step}
//                 </div>
//                 <div
//                   className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
//                   style={{ background: `${accent}18` }}
//                 >
//                   <Icon className="w-5 h-5" style={{ color: accent }} />
//                 </div>
//                 <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
//                 <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── Template Gallery ── */}
//         <section>
//           <div className="flex items-center gap-2 mb-6">
//             <h2 className="text-xl font-bold text-gray-900">Available templates</h2>
//             <div className="flex-1 h-px bg-gray-100" />
//             {hasResume && (
//               <button
//                 onClick={() => setIsExportOpen(true)}
//                 className="text-xs font-medium hover:underline flex items-center gap-1"
//                 style={{ color: "#086972" }}
//               >
//                 Change template <ChevronRight className="w-3 h-3" />
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {TEMPLATE_PREVIEWS.map((t) => {
//               const isActive = resumeData?.template === t.id;
//               const layout = LAYOUT_MAP[t.id] || "single";
//               return (
//                 <div
//                   key={t.id}
//                   className={`relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer group ${
//                     isActive ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300"
//                   }`}
//                   onClick={hasResume ? () => setIsExportOpen(true) : () => setIsGenerateOpen(true)}
//                 >
//                   {/* mini PDF preview */}
//                   <div
//                     className="h-32 bg-white relative overflow-hidden"
//                     style={{ borderBottom: `1px solid ${t.color}22` }}
//                   >
//                     <TemplateSkeleton color={t.color} layout={layout} />
//                   </div>

//                   <div className="px-3 py-2.5 bg-white">
//                     <div className="flex items-start justify-between gap-1">
//                       <span className="font-semibold text-gray-900 text-xs leading-tight">{t.name}</span>
//                       <span
//                         className="text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap"
//                         style={{ background: `${t.color}15`, color: t.color }}
//                       >
//                         {t.tag}
//                       </span>
//                     </div>
//                   </div>

//                   {isActive && (
//                     <div
//                       className="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full font-semibold"
//                       style={{ background: "#086972" }}
//                     >
//                       Active
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ── Generation History ── */}
//         {history.length > 0 && (
//           <section>
//             <div className="flex items-center gap-2 mb-6">
//               <h2 className="text-xl font-bold text-gray-900">Generation history</h2>
//               <div className="flex-1 h-px bg-gray-100" />
//             </div>
//             <div className="space-y-3">
//               {history.map((entry, idx) => (
//                 <HistoryItem
//                   key={idx}
//                   entry={entry}
//                   idx={idx}
//                   onView={handleViewResume}
//                   onDownload={handleDownloadResume}
//                 />
//               ))}
//             </div>
//             <p className="text-xs text-gray-400 mt-3">
//               History is stored for your current session. Re-generate anytime to create a fresh version.
//             </p>
//           </section>
//         )}

//         {/* ── Empty state CTA (no resume yet) ── */}
//         {!hasResume && (
//           <div className="text-center py-16 px-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
//             <div
//               className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
//               style={{ background: "#e6f7f8" }}
//             >
//               <FileText className="w-8 h-8" style={{ color: "#086972" }} />
//             </div>
//             <h3 className="font-bold text-gray-900 text-lg mb-2">No resume yet</h3>
//             <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
//               Generate your first AI-crafted resume in under 15 seconds. Your profile data is already saved.
//             </p>
//             <button
//               onClick={() => setIsGenerateOpen(true)}
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
//               style={{ background: "#086972" }}
//             >
//               <Sparkles className="w-4 h-4" />
//               Generate My Resume
//             </button>
//           </div>
//         )}

//         {/* ── Modals ── */}
//         {isGenerateOpen && (
//           <ResumeTemplateModal
//             isOpen={isGenerateOpen}
//             onClose={() => setIsGenerateOpen(false)}
//             mode="generate"
//             onSuccess={() => onGeneratedOrExported("Resume generated successfully!")}
//           />
//         )}

//         {isExportOpen && (
//           <ResumeTemplateModal
//             isOpen={isExportOpen}
//             onClose={() => setIsExportOpen(false)}
//             mode="export"
//             onSuccess={() => onGeneratedOrExported("Resume exported successfully!")}
//           />
//         )}

//         {isEditOpen && hasResume && (
//           <ResumeEditModal
//             isOpen={isEditOpen}
//             onClose={() => setIsEditOpen(false)}
//             onSuccess={onEdited}
//           />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// // src/pages/ResumePage.jsx
// import { useState, useEffect, useCallback } from "react";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";
// import { BACKEND_URL } from "../../../config";
// import axios from "axios";
// import {
//   Eye, Download, CheckCircle, Pencil, Sparkles, FileText,
//   Clock, Zap, Layers, ChevronRight, RefreshCw, Calendar,
//   LayoutTemplate, Star, Loader2,
// } from "lucide-react";
// import { fetchResumePdf } from "../../api/resume";
// import ResumeEditModal from "../../components/ResumeEditModal";

// // ─── How It Works steps ───────────────────────────────────────────────────────
// const HOW_IT_WORKS = [
//   { icon: FileText, step: "01", title: "Profile is read",      desc: "We pull your experience, education, projects, and GitHub repos automatically." },
//   { icon: Zap,      step: "02", title: "AI crafts your resume", desc: "Our model rewrites bullets for impact, highlights ATS keywords, and structures everything perfectly." },
//   { icon: Layers,   step: "03", title: "Pick a template",       desc: "Choose from 6 professionally designed layouts — minimal to sidebar-modern." },
//   { icon: Download, step: "04", title: "Download your PDF",     desc: "One click. Print-ready, ATS-optimized, and yours to keep." },
// ];

// // ─── Static template metadata (for skeletons + colors) ───────────────────────
// const TEMPLATE_META = {
//   classic_ats:         { color: "#086972", layout: "single",  tag: "Most popular" },
//   header_accent:       { color: "#1D4ED8", layout: "single",  tag: "Visual"       },
//   minimal_no_rules:    { color: "#475569", layout: "single",  tag: "Clean"        },
//   sidebar_modern:      { color: "#7c3aed", layout: "sidebar", tag: "Modern"       },
//   two_column_balanced: { color: "#0f766e", layout: "two_col", tag: "Balanced"     },
//   project_showcase:    { color: "#b45309", layout: "single",  tag: "Dev-first"    },
// };

// // ─── Mini PDF skeleton ────────────────────────────────────────────────────────
// function TemplateSkeleton({ color, layout = "single" }) {
//   const line = (w, op = 1) => (
//     <div style={{ height: 4, width: w, background: `${color}${Math.round(op * 255).toString(16).padStart(2, "0")}`, borderRadius: 2, marginBottom: 4 }} />
//   );
//   if (layout === "sidebar") return (
//     <div style={{ display: "flex", gap: 6, padding: "10px 8px", height: "100%" }}>
//       <div style={{ width: "30%", display: "flex", flexDirection: "column", gap: 3 }}>
//         <div style={{ height: 18, width: "100%", background: `${color}22`, borderRadius: 3, marginBottom: 5 }} />
//         {line("80%", 0.5)}{line("60%", 0.3)}{line("70%", 0.3)}{line("50%", 0.3)}
//       </div>
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
//         {line("90%", 0.7)}{line("100%", 0.3)}{line("85%", 0.3)}
//         <div style={{ marginTop: 5 }} />
//         {line("70%", 0.6)}{line("100%", 0.25)}{line("90%", 0.25)}
//       </div>
//     </div>
//   );
//   if (layout === "two_col") return (
//     <div style={{ display: "flex", gap: 6, padding: "10px 8px", height: "100%" }}>
//       {[0, 1].map((col) => (
//         <div key={col} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
//           <div style={{ height: col === 0 ? 14 : 8, background: `${color}22`, borderRadius: 2, marginBottom: 4 }} />
//           {line("90%", 0.5)}{line("75%", 0.3)}{line("80%", 0.3)}
//           <div style={{ marginTop: 3 }} />
//           {line("60%", 0.4)}{line("85%", 0.25)}{line("70%", 0.25)}
//         </div>
//       ))}
//     </div>
//   );
//   return (
//     <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
//       <div style={{ height: 14, width: "50%", background: `${color}33`, borderRadius: 3, marginBottom: 5, alignSelf: "center" }} />
//       {line("80%", 0.4)}{line("65%", 0.25)}
//       <div style={{ marginTop: 5, borderTop: `1px solid ${color}22`, paddingTop: 4 }} />
//       {line("40%", 0.55)}{line("100%", 0.2)}{line("90%", 0.2)}{line("75%", 0.2)}
//       <div style={{ marginTop: 3 }} />
//       {line("40%", 0.55)}{line("100%", 0.2)}{line("85%", 0.2)}
//     </div>
//   );
// }

// // ─── Fullscreen scan overlay (replaces the old modal loader) ─────────────────
// const SCAN_MSGS_GEN = [
//   "Initializing resume generation…",
//   "Analyzing your profile…",
//   "Extracting skills & experience…",
//   "Optimizing for ATS compatibility…",
//   "Crafting achievement bullets…",
//   "Structuring layout…",
//   "Generating PDF document…",
//   "Almost there…",
// ];
// const SCAN_MSGS_EXP = [
//   "Preparing your resume…",
//   "Applying selected template…",
//   "Adjusting typography & spacing…",
//   "Generating PDF document…",
//   "Finalizing output…",
// ];

// function ScanOverlay({ messages, messageIndex }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//         <div className="relative h-44 overflow-hidden" style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}>
//           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
//           <div className="absolute inset-x-8 top-0 bottom-0 flex items-center pointer-events-none">
//             <div className="w-full h-1.5 rounded-full" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)", animation: "scanBeam 2.4s cubic-bezier(.4,0,.6,1) infinite" }} />
//           </div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Loader2 className="w-10 h-10 text-white/80 animate-spin" />
//           </div>
//         </div>
//         <div className="px-8 py-6 text-center">
//           <p className="text-sm font-semibold text-gray-800 mb-4 min-h-[1.25rem]">{messages[messageIndex]}</p>
//           <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
//             <div className="h-full rounded-full transition-all duration-[1800ms] ease-linear" style={{ width: `${((messageIndex + 1) / messages.length) * 100}%`, background: "linear-gradient(90deg,#086972,#0891b2)" }} />
//           </div>
//           <p className="mt-3 text-xs text-gray-400">This usually takes 8–15 seconds…</p>
//         </div>
//       </div>
//       <style>{`@keyframes scanBeam{0%{transform:translateY(-200%);opacity:.3}15%{opacity:1}50%{transform:translateY(200%);opacity:1}85%{opacity:.3}100%{transform:translateY(-200%);opacity:.3}}`}</style>
//     </div>
//   );
// }

// // ─── History item ─────────────────────────────────────────────────────────────
// function HistoryItem({ entry, idx, isLatest, onView, onDownload }) {
//   const meta = TEMPLATE_META[entry.template] || TEMPLATE_META.classic_ats;
//   const date = entry.generatedAt ? new Date(entry.generatedAt) : null;
//   const label = date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
//   const time  = date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";
//   const name  = entry.template?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Classic ATS";

//   return (
//     <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/40 transition-all group">
//       <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ background: meta.color }}>
//         {idx + 1}
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="font-medium text-gray-900 text-sm">{name} Template</span>
//           {isLatest && <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: "#086972" }}>Latest</span>}
//         </div>
//         <div className="flex items-center gap-1 mt-0.5">
//           <Calendar className="w-3 h-3 text-gray-400" />
//           <span className="text-xs text-gray-500">{label}{time ? ` · ${time}` : ""}</span>
//         </div>
//       </div>
//       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//         <button onClick={onView}     className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
//         <button onClick={onDownload} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Download"><Download className="w-4 h-4" /></button>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function ResumePage() {
//   const { user, token } = useAuth();

//   const [resumeData, setResumeData] = useState(null);
//   const [templates,  setTemplates]  = useState([]);
//   const [selectedId, setSelectedId] = useState("classic_ats");
//   const [history,    setHistory]    = useState([]);

//   const [successMessage, setSuccessMessage] = useState("");
//   const [isEditOpen,     setIsEditOpen]     = useState(false);
//   const [actionMode,     setActionMode]     = useState(null); // "generate" | "export" | null
//   const [msgIdx,         setMsgIdx]         = useState(0);

//   const scanMessages = actionMode === "generate" ? SCAN_MSGS_GEN : SCAN_MSGS_EXP;

//   // cycle messages while busy
//   useEffect(() => {
//     if (!actionMode) return;
//     setMsgIdx(0);
//     const iv = setInterval(() => setMsgIdx(p => (p + 1) % scanMessages.length), 1800);
//     return () => clearInterval(iv);
//   }, [actionMode]);

//   // fetch templates once
//   useEffect(() => {
//     if (!token) return;
//     axios.get(`${BACKEND_URL}/api/resume/templates`, { headers: { Authorization: `Bearer ${token}` } })
//       .then(r => {
//         const list = r.data?.templates || [];
//         setTemplates(list);
//         if (list.length) setSelectedId(list[0].id);
//       })
//       .catch(console.error);
//   }, [token]);

//   // fetch status + history
//   const refreshStatus = useCallback(async () => {
//     if (!user?._id || !token) return;
//     try {
//       const res  = await fetch(`${BACKEND_URL}/api/resume/status/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       if (data?.exists) {
//         setResumeData({ resumePdfUrl: data.resumePdfUrl, template: data.template, updatedAt: data.lastUpdated });
//         setSelectedId(data.template || "classic_ats");
//         // backend sends history array if you wire it up (see ResumePortfolioController update below)
//         if (Array.isArray(data.history)) setHistory(data.history);
//       } else {
//         setResumeData(null);
//       }
//     } catch { setResumeData(null); }
//   }, [user?._id, token]);

//   useEffect(() => { refreshStatus(); }, [refreshStatus]);

//   // view / download
//   const handleViewResume = async () => {
//     try {
//       const blob = await fetchResumePdf(user._id, token);
//       const url  = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//       setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
//     } catch (e) { console.error(e); alert("Failed to open resume."); }
//   };

//   const handleDownloadResume = async () => {
//     try {
//       const blob = await fetchResumePdf(user._id, token);
//       const url  = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url; link.download = `Resume_${user?.name || "Professional"}.pdf`;
//       document.body.appendChild(link); link.click(); document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (e) { console.error(e); alert("Failed to download resume."); }
//   };

//   const showSuccess = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(""), 5000); };

//   // generate / export — inline, no modal needed
//   const handleAction = async (mode) => {
//     if (actionMode) return;
//     setActionMode(mode);
//     try {
//       const endpoint = mode === "generate" ? `${BACKEND_URL}/api/resume/generate` : `${BACKEND_URL}/api/resume/export`;
//       await axios.post(endpoint, { templateId: selectedId }, { headers: { Authorization: `Bearer ${token}` } });
//       await refreshStatus();
//       showSuccess(mode === "generate" ? "Resume generated successfully!" : "Resume exported with new template!");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Something went wrong. Please try again.");
//     } finally {
//       setActionMode(null);
//     }
//   };

//   const onEdited = async () => { await refreshStatus(); showSuccess("Resume updated successfully!"); };

//   const hasResume = !!resumeData?.resumePdfUrl;

//   return (
//     <DashboardLayout user={user}>
//       {actionMode && <ScanOverlay messages={scanMessages} messageIndex={msgIdx} />}

//       <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

//         {/* Hero */}
//         <div className="relative rounded-2xl overflow-hidden p-8 md:p-10" style={{ background: "linear-gradient(135deg, #086972 0%, #0891b2 100%)" }}>
//           <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-10 border-[24px] border-white" />
//           <div className="absolute -right-4  -top-4  w-32 h-32 rounded-full opacity-10 border-[16px] border-white" />
//           <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="w-4 h-4 text-white/70" />
//                 <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">AI-Powered</span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold text-white">Professional Resume</h1>
//               <p className="mt-2 text-white/70 text-sm max-w-md">Your profile, transformed into a polished, ATS-ready resume in seconds.</p>
//             </div>
//             {hasResume && (
//               <button onClick={() => setIsEditOpen(true)} className="self-start px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 transition-all">
//                 <Pencil className="w-4 h-4" /> Edit Content
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Success banner */}
//         {successMessage && (
//           <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
//             <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//             <span className="font-medium text-sm">{successMessage}</span>
//           </div>
//         )}

//         {/* View / Download (only when resume exists) */}
//         {hasResume && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {[
//               { label: "View Resume", sub: "Opens in a new tab", icon: Eye, action: handleViewResume, dark: false },
//               { label: "Download PDF", sub: "Print-ready format",  icon: Download, action: handleDownloadResume, dark: true },
//             ].map(({ label, sub, icon: Icon, action, dark }) => (
//               <button key={label} onClick={action}
//                 className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all group ${dark ? "hover:opacity-95" : "bg-white border border-gray-200 hover:border-primary/50 hover:bg-gray-50"}`}
//                 style={dark ? { background: "#086972" } : {}}
//               >
//                 <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${dark ? "bg-white/20" : ""}`} style={!dark ? { background: "#f0fafa" } : {}}>
//                   <Icon className="w-4 h-4" style={{ color: dark ? "#fff" : "#086972" }} />
//                 </div>
//                 <div className="text-left">
//                   <div className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>{label}</div>
//                   <div className={`text-xs ${dark ? "text-white/70" : "text-gray-500"}`}>{sub}</div>
//                 </div>
//                 <ChevronRight className={`w-4 h-4 ml-auto group-hover:translate-x-0.5 transition-transform ${dark ? "text-white/40" : "text-gray-300"}`} />
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Status chips */}
//         {hasResume && (
//           <div className="flex flex-wrap gap-6 p-5 rounded-2xl border border-gray-200 bg-gray-50/60">
//             {[
//               { icon: LayoutTemplate, label: "Template",     value: resumeData.template?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Classic ATS" },
//               { icon: Clock,          label: "Last Updated", value: resumeData.updatedAt ? new Date(resumeData.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
//               { icon: Star,           label: "Status",       value: "ATS-Optimized ✓", color: "#086972" },
//             ].map(({ icon: Icon, label, value, color }) => (
//               <div key={label} className="flex items-center gap-3">
//                 <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#e6f7f8" }}>
//                   <Icon className="w-4 h-4" style={{ color: "#086972" }} />
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
//                   <div className="text-sm font-semibold" style={{ color: color || "#111827" }}>{value}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════════════
//             INLINE TEMPLATE SELECTOR — no extra modal needed
//         ══════════════════════════════════════════════════════ */}
//         <section>
//           <div className="mb-5">
//             <h2 className="text-xl font-bold text-gray-900">
//               {hasResume ? "Switch template & re-export" : "Choose a template"}
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               {hasResume
//                 ? `Pick any template and click "Export PDF" — your resume content stays the same.`
//                 : "Select a layout below, then generate your resume."}
//             </p>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {(templates.length > 0 ? templates : Object.entries(TEMPLATE_META).map(([id, m]) => ({ id, name: id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), description: "", ...m }))).map((t) => {
//               const meta = TEMPLATE_META[t.id] || { color: "#086972", layout: "single", tag: "" };
//               const isSelected = selectedId === t.id;
//               const isActive   = resumeData?.template === t.id;
//               return (
//                 <button key={t.id} onClick={() => setSelectedId(t.id)}
//                   className={`relative rounded-xl border-2 overflow-hidden transition-all text-left focus:outline-none ${isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-gray-200 hover:border-gray-300"}`}
//                 >
//                   <div className="h-28 bg-white overflow-hidden" style={{ borderBottom: `1px solid ${meta.color}1a` }}>
//                     <TemplateSkeleton color={meta.color} layout={meta.layout} />
//                   </div>
//                   <div className="px-3 py-2.5 bg-white">
//                     <div className="flex items-start justify-between gap-1">
//                       <span className="font-semibold text-gray-900 text-xs leading-tight">{t.name}</span>
//                       <span className="text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0" style={{ background: `${meta.color}18`, color: meta.color }}>{meta.tag}</span>
//                     </div>
//                     {t.description && <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{t.description}</p>}
//                   </div>
//                   {isSelected && (
//                     <div className="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#086972" }}>Selected</div>
//                   )}
//                   {isActive && !isSelected && (
//                     <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold border" style={{ background: "#fff", color: "#086972", borderColor: "#086972" }}>Active</div>
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Single CTA — context-aware */}
//           <div className="mt-6 flex flex-wrap items-center gap-3">
//             <button
//               onClick={() => handleAction(hasResume ? "export" : "generate")}
//               disabled={!!actionMode}
//               className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}
//             >
//               {actionMode
//                 ? <><Loader2 className="w-4 h-4 animate-spin" /> Working…</>
//                 : hasResume
//                   ? <><RefreshCw className="w-4 h-4" /> Export PDF with selected template</>
//                   : <><Sparkles className="w-4 h-4" /> Generate My Resume</>}
//             </button>
//             {hasResume && selectedId === resumeData?.template && (
//               <span className="text-xs text-gray-400 italic">This is your currently active template</span>
//             )}
//           </div>
//         </section>

//         {/* How It Works */}
//         <section>
//           <div className="flex items-center gap-2 mb-6">
//             <h2 className="text-xl font-bold text-gray-900">How it works</h2>
//             <div className="flex-1 h-px bg-gray-100" />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
//               <div key={step} className="relative p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all group" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
//                 <div className="absolute top-4 right-4 font-black text-4xl leading-none select-none" style={{ color: "#08697212" }}>{step}</div>
//                 <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: "#e6f7f8" }}>
//                   <Icon className="w-5 h-5" style={{ color: "#086972" }} />
//                 </div>
//                 <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
//                 <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Generation History */}
//         {history.length > 0 && (
//           <section>
//             <div className="flex items-center gap-2 mb-5">
//               <h2 className="text-xl font-bold text-gray-900">Generation history</h2>
//               <div className="flex-1 h-px bg-gray-100" />
//               <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{history.length} version{history.length !== 1 ? "s" : ""}</span>
//             </div>
//             <div className="space-y-3">
//               {history.map((entry, idx) => (
//                 <HistoryItem key={idx} entry={entry} idx={idx} isLatest={idx === 0} onView={handleViewResume} onDownload={handleDownloadResume} />
//               ))}
//             </div>
//             <p className="text-xs text-gray-400 mt-3">Showing the last {history.length} version{history.length !== 1 ? "s" : ""}. Only the latest PDF can be downloaded.</p>
//           </section>
//         )}

//         {/* Empty state */}
//         {!hasResume && (
//           <div className="text-center py-14 px-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
//             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#e6f7f8" }}>
//               <FileText className="w-8 h-8" style={{ color: "#086972" }} />
//             </div>
//             <h3 className="font-bold text-gray-900 text-lg mb-2">No resume yet</h3>
//             <p className="text-gray-500 text-sm max-w-sm mx-auto">Select a template above and click "Generate My Resume". Your profile data is already saved.</p>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {isEditOpen && hasResume && (
//           <ResumeEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSuccess={onEdited} />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import {
  Eye,
  Download,
  Sparkles,
  FileText,
  Zap,
  Layers,
  Loader2,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  LayoutTemplate,
  Clock,
  Star,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { fetchResumePdf } from "../../api/resume";
import ResumeEditModal from "../../components/ResumeEditModal";

// ─── Template metadata ────────────────────────────────────────────────────────
const TEMPLATE_META = {
  classic_ats: { color: "#086972", layout: "single", tag: "Most popular" },
  header_accent: { color: "#1D4ED8", layout: "single", tag: "Visual" },
  minimal_no_rules: { color: "#475569", layout: "single", tag: "Clean" },
  sidebar_modern: { color: "#7c3aed", layout: "sidebar", tag: "Modern" },
  two_column_balanced: { color: "#0f766e", layout: "two_col", tag: "Balanced" },
  project_showcase: { color: "#b45309", layout: "single", tag: "Dev-first" },
};

// ─── Mini PDF skeleton previews ───────────────────────────────────────────────
function TemplateSkeleton({ color, layout = "single" }) {
  const line = (w, op = 1) => (
    <div
      style={{
        height: 4,
        width: w,
        background: `${color}${Math.round(op * 255)
          .toString(16)
          .padStart(2, "0")}`,
        borderRadius: 2,
        marginBottom: 4,
      }}
    />
  );
  if (layout === "sidebar")
    return (
      <div
        style={{ display: "flex", gap: 6, padding: "10px 8px", height: "100%" }}
      >
        <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <div
            style={{
              height: 18,
              width: "100%",
              background: `${color}22`,
              borderRadius: 3,
              marginBottom: 5,
            }}
          />
          {line("80%", 0.5)}
          {line("60%", 0.3)}
          {line("70%", 0.3)}
          {line("50%", 0.3)}
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
        >
          {line("90%", 0.7)}
          {line("100%", 0.3)}
          {line("85%", 0.3)}
          <div style={{ marginTop: 5 }} />
          {line("70%", 0.6)}
          {line("100%", 0.25)}
          {line("90%", 0.25)}
        </div>
      </div>
    );
  if (layout === "two_col")
    return (
      <div
        style={{ display: "flex", gap: 6, padding: "10px 8px", height: "100%" }}
      >
        {[0, 1].map((col) => (
          <div
            key={col}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <div
              style={{
                height: col === 0 ? 14 : 8,
                background: `${color}22`,
                borderRadius: 2,
                marginBottom: 4,
              }}
            />
            {line("90%", 0.5)}
            {line("75%", 0.3)}
            {line("80%", 0.3)}
            <div style={{ marginTop: 3 }} />
            {line("60%", 0.4)}
            {line("85%", 0.25)}
            {line("70%", 0.25)}
          </div>
        ))}
      </div>
    );
  return (
    <div
      style={{
        padding: "10px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <div
        style={{
          height: 14,
          width: "50%",
          background: `${color}33`,
          borderRadius: 3,
          marginBottom: 5,
          alignSelf: "center",
        }}
      />
      {line("80%", 0.4)}
      {line("65%", 0.25)}
      <div
        style={{
          marginTop: 5,
          borderTop: `1px solid ${color}22`,
          paddingTop: 4,
        }}
      />
      {line("40%", 0.55)}
      {line("100%", 0.2)}
      {line("90%", 0.2)}
      {line("75%", 0.2)}
      <div style={{ marginTop: 3 }} />
      {line("40%", 0.55)}
      {line("100%", 0.2)}
      {line("85%", 0.2)}
    </div>
  );
}

// ─── Scan overlay ─────────────────────────────────────────────────────────────
const SCAN_MSGS = [
  "Analyzing your profile…",
  "Extracting skills & experience…",
  "Optimizing for ATS keywords…",
  "Crafting achievement bullets…",
  "Generating PDF…",
  "Almost there…",
];

function ScanOverlay({ messageIndex }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div
          className="relative h-44 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white/80 animate-spin" />
          </div>
        </div>
        <div className="px-8 py-6 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-4 min-h-[1.25rem]">
            {SCAN_MSGS[messageIndex]}
          </p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-[1800ms] ease-linear"
              style={{
                width: `${((messageIndex + 1) / SCAN_MSGS.length) * 100}%`,
                background: "linear-gradient(90deg,#086972,#0891b2)",
              }}
            />
          </div>
          <p className="mt-3 text-xs text-gray-400">
            This usually takes 8–15 seconds…
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current, total = 3 }) {
  const labels = ["Review profile", "Select projects", "Pick template"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {labels.slice(0, total).map((label, i) => {
        const idx = i + 1;
        const done = current > idx;
        const active = current === idx;
        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? "bg-green-500 text-white" : active ? "text-white" : "bg-gray-200 text-gray-400"}`}
                style={active ? { background: "#086972" } : {}}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : idx}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${active ? "text-gray-900" : "text-gray-400"}`}
              >
                {label}
              </span>
            </div>
            {i < total - 1 && (
              <div
                className={`h-px flex-1 mx-3 mb-5 transition-all ${done ? "bg-green-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Profile Review ───────────────────────────────────────────────────
function StepProfileReview({ profile, onNext }) {
  if (!profile)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );

  const Section = ({ title, children }) => (
    <div className="mb-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );

  const Chip = ({ label }) => (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 mr-1.5 mb-1.5">
      {label}
    </span>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Does this look right?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          This is the data your resume will be built from. If something's
          missing, update your profile first.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        {/* Contact */}
        <Section title="Contact">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Name", value: profile.name },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone || "—" },
              { label: "Role", value: profile.primaryRole || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                <div className="text-sm font-medium text-gray-800 truncate">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        {profile.topSkills?.length > 0 && (
          <Section title={`Skills (${profile.topSkills.length})`}>
            <div className="flex flex-wrap">
              {profile.topSkills.map((s) => (
                <Chip key={s} label={s} />
              ))}
            </div>
          </Section>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <Section title={`Experience (${profile.experience.length} roles)`}>
            <div className="space-y-2">
              {profile.experience.map((exp, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {(exp.company || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {exp.position}
                    </div>
                    <div className="text-xs text-gray-500">
                      {exp.company} ·{" "}
                      {exp.start_date || exp.startDate
                        ? (exp.start_date || exp.startDate)?.slice(0, 7)
                        : "?"}{" "}
                      – {exp.end_date || exp.endDate || "Present"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <Section title={`Education (${profile.education.length})`}>
            <div className="space-y-2">
              {profile.education.map((edu, i) => (
                <div
                  key={i}
                  className="py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="text-sm font-semibold text-gray-800">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {edu.institution} · {edu.start_year || "?"} –{" "}
                    {edu.end_year || "Present"}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Profile projects */}
        {profile.projects?.length > 0 && (
          <Section
            title={`Profile projects (${profile.projects.length}) — always included`}
          >
            <div className="space-y-1.5">
              {profile.projects.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-800 truncate">
                    {p.name || p.title}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <a
          href="/profile"
          className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2"
        >
          Something wrong? Edit your profile →
        </a>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}
        >
          Looks good, continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Project / Repo Selection ────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function StepProjectSelection({
  profile,
  selectedRepoIds,
  setSelectedRepoIds,
  repos,
  loadingRepos,
  onNext,
  onBack,
}) {
  const profileProjects = profile?.projects || [];
  const toggle = (id) => {
    setSelectedRepoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 6) {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Which projects should appear?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your profile projects are always included. Optionally pick GitHub
          repos to feature too — or skip and let AI choose the best ones.
        </p>
      </div>

      {/* Profile projects — always included */}
      {profileProjects.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700">
              Manually added projects (always included)
            </span>
          </div>
          <div className="space-y-2">
            {profileProjects.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-green-900 truncate">
                    {p.name || p.title}
                  </div>
                  {p.techStack?.length > 0 && (
                    <div className="text-xs text-green-700 mt-0.5">
                      {p.techStack.slice(0, 4).join(" · ")}
                    </div>
                  )}
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-medium flex-shrink-0">
                  Included
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GitHub repos */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">
            GitHub repos (optional, pick up to 6)
          </span>
          <div className="flex items-center gap-2">
            {selectedRepoIds.size > 0 && (
              <button
                onClick={() => setSelectedRepoIds(new Set())}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Clear
              </button>
            )}
            <span className="text-xs text-gray-500">
              {selectedRepoIds.size}/6 selected
            </span>
          </div>
        </div>

        {loadingRepos ? (
          <div className="flex items-center gap-2 py-8 justify-center text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading repos…
          </div>
        ) : repos.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-sm text-gray-400">
              No GitHub repos found. Connect your GitHub in settings to enable
              this.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {repos.map((repo) => {
              const picked = selectedRepoIds.has(repo.id);
              const disabled = !picked && selectedRepoIds.size >= 6;
              return (
                <button
                  key={repo.id}
                  onClick={() => !disabled && toggle(repo.id)}
                  disabled={disabled}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all w-full ${picked ? "border-indigo-500 bg-indigo-50/50" : disabled ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed" : "border-gray-200 bg-white hover:border-gray-300"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm leading-tight truncate">
                      {repo.name}
                    </span>
                    {picked && (
                      <div
                        className="w-4.5 h-4.5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ width: 18, height: 18 }}
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2 min-h-[2rem] leading-relaxed">
                    {repo.description || (
                      <span className="italic text-gray-300">
                        No description — AI will write one
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: LANG_COLORS[repo.language] || "#888",
                          }}
                        />
                        <span className="text-xs text-gray-400">
                          {repo.language}
                        </span>
                      </div>
                    )}
                    {repo.stars > 0 && (
                      <span className="text-xs text-gray-400 ml-auto">
                        ★ {repo.stars}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedRepoIds.size === 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            AI will automatically pick your best repos based on stars and
            relevance
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Template Selection ───────────────────────────────────────────────
function StepTemplateSelect({
  templates,
  selectedId,
  setSelectedId,
  onBack,
  onGenerate,
  generating,
  isRegen,
  hasContentChange,
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Pick a template</h2>
        <p className="text-sm text-gray-500 mt-1">
          {isRegen && !hasContentChange
            ? "Your resume content hasn't changed — we'll skip the AI and just render your existing content in the new template."
            : "Choose a layout. Your content will be AI-crafted and dropped into this design."}
        </p>
      </div>

      {isRegen && !hasContentChange && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-5 text-sm text-blue-800">
          <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>
            <strong>No AI call needed.</strong> Your profile and repo selection
            haven't changed — this will just re-render your resume in the
            selected template. Instant!
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {templates.map((t) => {
          const meta = TEMPLATE_META[t.id] || {
            color: "#086972",
            layout: "single",
            tag: "",
          };
          const isSelected = selectedId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`relative rounded-xl border-2 overflow-hidden transition-all text-left focus:outline-none ${isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div
                className="h-28 bg-white overflow-hidden"
                style={{ borderBottom: `1px solid ${meta.color}1a` }}
              >
                <TemplateSkeleton color={meta.color} layout={meta.layout} />
              </div>
              <div className="px-3 py-2.5 bg-white">
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-gray-900 text-xs leading-tight">
                    {t.name}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0"
                    style={{ background: `${meta.color}18`, color: meta.color }}
                  >
                    {meta.tag}
                  </span>
                </div>
                {t.description && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">
                    {t.description}
                  </p>
                )}
              </div>
              {isSelected && (
                <div
                  className="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#086972" }}
                >
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Working…
            </>
          ) : isRegen && !hasContentChange ? (
            <>
              <RefreshCw className="w-4 h-4" /> Export with this template
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate my resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Result view ──────────────────────────────────────────────────────────────
function ResumeResult({
  resumeData,
  user,
  token,
  onRegenerate,
  onEditOpen,
  history,
}) {
  const handleView = async () => {
    try {
      const blob = await fetchResumePdf(user._id, token);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch {
      alert("Failed to open resume.");
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await fetchResumePdf(user._id, token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Resume_${user?.name || "Professional"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download.");
    }
  };

  // const handleViewHistoryEntry = (url) => window.open(url, "_blank");
  // // BEFORE (broken — opens raw Cloudinary URL, shows blank page):

  // AFTER (correct — proxies through backend with proper Content-Type):
  const handleViewHistoryEntry = async (entry, index) => {
    // Open a loading tab immediately (browsers block window.open in async callbacks)
    const tab = window.open("about:blank", "_blank");

    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/resume/history/${user._id}/${index}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const blobUrl = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      tab.location.href = blobUrl;
      // Revoke after a delay so the tab has time to load
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (err) {
      tab.close();
      console.error("Failed to open history PDF", err);
      alert("Could not load this resume version. Please try again.");
    }
  };

  const handleDownloadHistoryEntry = async (idx, template) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/resume/history/${user._id}/${idx}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" },
      );
      const blobUrl = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `Resume_${template || "history"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      alert("Failed to download this version.");
    }
  };

  const templateName =
    resumeData?.template
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Classic ATS";
  const meta = TEMPLATE_META[resumeData?.template] || TEMPLATE_META.classic_ats;

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleView}
          className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all group"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "#f0fafa" }}
          >
            <Eye className="w-4 h-4" style={{ color: "#086972" }} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm text-gray-900">
              View Resume
            </div>
            <div className="text-xs text-gray-500">Opens in a new tab</div>
          </div>
          <ChevronRight className="w-4 h-4 ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-3 px-6 py-4 rounded-xl transition-all group hover:opacity-95"
          style={{ background: "#086972" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm text-white">Download PDF</div>
            <div className="text-xs text-white/70">Print-ready format</div>
          </div>
          <ChevronRight className="w-4 h-4 ml-auto text-white/40 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-5 p-5 rounded-2xl border border-gray-200 bg-gray-50/60">
        {[
          {
            icon: LayoutTemplate,
            label: "Template",
            value: templateName,
            color: meta.color,
          },
          {
            icon: Clock,
            label: "Last Updated",
            value: resumeData.updatedAt
              ? new Date(resumeData.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "—",
          },
          {
            icon: Star,
            label: "Status",
            value: "ATS-Optimized ✓",
            color: "#086972",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "#e6f7f8" }}
            >
              <Icon className="w-4 h-4" style={{ color: "#086972" }} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {label}
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: color || "#111827" }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Regenerate
        </button>
        <button
          onClick={onEditOpen}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Pencil className="w-4 h-4" /> Edit content
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Previous versions
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          </div>
          <div className="space-y-2">
            {history.map((entry, idx) => {
              const hMeta =
                TEMPLATE_META[entry.template] || TEMPLATE_META.classic_ats;
              const date = entry.generatedAt
                ? new Date(entry.generatedAt)
                : null;
              const name =
                entry.template
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()) || "Classic ATS";
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: hMeta.color }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {date
                        ? date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleViewHistoryEntry(entry, idx)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                      title="View this version"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadHistoryEntry(idx, entry.template)
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                      title="Download this version"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumePage() {
  const { user, token } = useAuth();

  // Wizard state
  const [step, setStep] = useState(null); // null = loading, "result" = done, 1/2/3 = wizard steps

  // Data
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [history, setHistory] = useState([]);

  // Wizard selections
  const [selectedRepoIds, setSelectedRepoIds] = useState(new Set());
  const [selectedTemplateId, setSelectedTemplateId] = useState("classic_ats");

  // Generation
  const [generating, setGenerating] = useState(false);
  const [scanMsgIdx, setScanMsgIdx] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Regen dirty tracking
  const [savedInputHash, setSavedInputHash] = useState(null);
  const [currentInputHash, setCurrentInputHash] = useState(null);

  const hasContentChange = currentInputHash !== savedInputHash;

  // ── Compute a simple hash from profile + repo selection ─────────────────────
  const computeHash = useCallback((profileData, repoIds) => {
    const key = JSON.stringify({
      exp: profileData?.experience?.map((e) => e.position + e.company),
      edu: profileData?.education?.map((e) => e.institution),
      skills: profileData?.topSkills,
      repos: [...(repoIds || [])].sort(),
    });
    // Simple djb2 hash
    let h = 5381;
    for (let i = 0; i < key.length; i++) h = ((h << 5) + h) ^ key.charCodeAt(i);
    return (h >>> 0).toString(16);
  }, []);

  // ── Load initial data ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id || !token) return;

    const loadAll = async () => {
      try {
        const [statusRes, profileRes, templatesRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/resume/status/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
          axios.get(`${BACKEND_URL}/api/resume/profile/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BACKEND_URL}/api/resume/templates`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profileData = profileRes.data;
        setProfile(profileData);

        const templateList = templatesRes.data?.templates || [];
        setTemplates(templateList);

        if (statusRes?.exists) {
          setResumeData({
            resumePdfUrl: statusRes.resumePdfUrl,
            template: statusRes.template,
            updatedAt: statusRes.lastUpdated,
          });
          setSelectedTemplateId(statusRes.template || "classic_ats");
          if (Array.isArray(statusRes.history)) setHistory(statusRes.history);
          const savedIds = new Set(statusRes.selectedRepoIds || []);
          setSelectedRepoIds(savedIds);
          const hash = computeHash(profileData, savedIds);
          setSavedInputHash(statusRes.inputHash || hash);
          setCurrentInputHash(hash);
          setStep("result");
        } else {
          setStep(1);
        }
      } catch (err) {
        console.error(err);
        setStep(1);
      }
    };

    loadAll();
  }, [user?._id, token, computeHash]);

  // ── Load repos on step 2 ─────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 2 || !user?._id || !token) return;
    setLoadingRepos(true);
    axios
      .get(`${BACKEND_URL}/api/resume/repo-selection/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setRepos(r.data.repos || []))
      .catch(console.error)
      .finally(() => setLoadingRepos(false));
  }, [step, user?._id, token]);

  // ── Update current hash when selection changes ───────────────────────────────
  useEffect(() => {
    if (!profile) return;
    setCurrentInputHash(computeHash(profile, selectedRepoIds));
  }, [profile, selectedRepoIds, computeHash]);

  // ── Scan message cycling ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!generating) return;
    setScanMsgIdx(0);
    const iv = setInterval(
      () => setScanMsgIdx((p) => (p + 1) % SCAN_MSGS.length),
      1800,
    );
    return () => clearInterval(iv);
  }, [generating]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // ── Generate ─────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Persist repo selection first
      await axios.put(
        `${BACKEND_URL}/api/resume/repo-selection`,
        { selectedIds: [...selectedRepoIds] },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const skipAI = resumeData && !hasContentChange;
      const endpoint = skipAI
        ? `${BACKEND_URL}/api/resume/export`
        : `${BACKEND_URL}/api/resume/generate`;

      await axios.post(
        endpoint,
        { templateId: selectedTemplateId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh status
      const statusRes = await fetch(
        `${BACKEND_URL}/api/resume/status/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      ).then((r) => r.json());
      if (statusRes?.exists) {
        setResumeData({
          resumePdfUrl: statusRes.resumePdfUrl,
          template: statusRes.template,
          updatedAt: statusRes.lastUpdated,
        });
        setHistory(statusRes.history || []);
        const newHash = computeHash(profile, selectedRepoIds);
        setSavedInputHash(statusRes.inputHash || newHash);
        setCurrentInputHash(newHash);
      }
      setStep("result");
      showSuccess(
        skipAI
          ? "Resume exported with new template!"
          : "Resume generated successfully!",
      );
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    // Go back to wizard step 1, keeping existing selections
    setStep(1);
  };

  const handleEdited = async () => {
    const statusRes = await fetch(
      `${BACKEND_URL}/api/resume/status/${user._id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    ).then((r) => r.json());
    if (statusRes?.exists) {
      setResumeData({
        resumePdfUrl: statusRes.resumePdfUrl,
        template: statusRes.template,
        updatedAt: statusRes.lastUpdated,
      });
      setHistory(statusRes.history || []);
    }
    showSuccess("Resume content updated!");
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (step === null)
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );

  const isRegen = !!resumeData;

  return (
    <DashboardLayout user={user}>
      {generating && <ScanOverlay messageIndex={scanMsgIdx} />}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div
          className="relative rounded-2xl overflow-hidden p-8 mb-8"
          style={{
            background: "linear-gradient(135deg, #086972 0%, #0891b2 100%)",
          }}
        >
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-10 border-[24px] border-white" />
          <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-10 border-[16px] border-white" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">
                AI-Powered
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {step === "result"
                ? "Your Resume"
                : isRegen
                  ? "Regenerate Resume"
                  : "Build Your Resume"}
            </h1>
            <p className="mt-1 text-white/70 text-sm">
              {step === "result"
                ? "ATS-optimized and ready to download."
                : "Answer a few questions and we'll handle the rest."}
            </p>
          </div>
        </div>

        {/* Success banner */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl mb-6">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        )}

        {/* Wizard steps */}
        {step !== "result" && <StepBar current={step} total={3} />}

        {step === 1 && (
          <StepProfileReview profile={profile} onNext={() => setStep(2)} />
        )}

        {step === 2 && (
          <StepProjectSelection
            profile={profile}
            selectedRepoIds={selectedRepoIds}
            setSelectedRepoIds={setSelectedRepoIds}
            repos={repos}
            loadingRepos={loadingRepos}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepTemplateSelect
            templates={
              templates.length > 0
                ? templates
                : Object.entries(TEMPLATE_META).map(([id, m]) => ({
                    id,
                    name: id
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase()),
                    ...m,
                  }))
            }
            selectedId={selectedTemplateId}
            setSelectedId={setSelectedTemplateId}
            onBack={() => setStep(2)}
            onGenerate={handleGenerate}
            generating={generating}
            isRegen={isRegen}
            hasContentChange={hasContentChange}
          />
        )}

        {step === "result" && (
          <ResumeResult
            resumeData={resumeData}
            user={user}
            token={token}
            onRegenerate={handleRegenerate}
            onEditOpen={() => setIsEditOpen(true)}
            history={history}
          />
        )}
      </div>

      {isEditOpen && (
        <ResumeEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={handleEdited}
        />
      )}
    </DashboardLayout>
  );
}
