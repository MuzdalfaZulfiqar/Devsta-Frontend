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


// src/pages/ResumePage.jsx
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import {
  Eye, Download, CheckCircle, Pencil, Sparkles, FileText,
  Clock, Zap, Layers, ChevronRight, RefreshCw, Calendar,
  LayoutTemplate, Star, Loader2,
} from "lucide-react";
import { fetchResumePdf } from "../../api/resume";
import ResumeEditModal from "../../components/ResumeEditModal";

// ─── How It Works steps ───────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { icon: FileText, step: "01", title: "Profile is read",      desc: "We pull your experience, education, projects, and GitHub repos automatically." },
  { icon: Zap,      step: "02", title: "AI crafts your resume", desc: "Our model rewrites bullets for impact, highlights ATS keywords, and structures everything perfectly." },
  { icon: Layers,   step: "03", title: "Pick a template",       desc: "Choose from 6 professionally designed layouts — minimal to sidebar-modern." },
  { icon: Download, step: "04", title: "Download your PDF",     desc: "One click. Print-ready, ATS-optimized, and yours to keep." },
];

// ─── Static template metadata (for skeletons + colors) ───────────────────────
const TEMPLATE_META = {
  classic_ats:         { color: "#086972", layout: "single",  tag: "Most popular" },
  header_accent:       { color: "#1D4ED8", layout: "single",  tag: "Visual"       },
  minimal_no_rules:    { color: "#475569", layout: "single",  tag: "Clean"        },
  sidebar_modern:      { color: "#7c3aed", layout: "sidebar", tag: "Modern"       },
  two_column_balanced: { color: "#0f766e", layout: "two_col", tag: "Balanced"     },
  project_showcase:    { color: "#b45309", layout: "single",  tag: "Dev-first"    },
};

// ─── Mini PDF skeleton ────────────────────────────────────────────────────────
function TemplateSkeleton({ color, layout = "single" }) {
  const line = (w, op = 1) => (
    <div style={{ height: 4, width: w, background: `${color}${Math.round(op * 255).toString(16).padStart(2, "0")}`, borderRadius: 2, marginBottom: 4 }} />
  );
  if (layout === "sidebar") return (
    <div style={{ display: "flex", gap: 6, padding: "10px 8px", height: "100%" }}>
      <div style={{ width: "30%", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ height: 18, width: "100%", background: `${color}22`, borderRadius: 3, marginBottom: 5 }} />
        {line("80%", 0.5)}{line("60%", 0.3)}{line("70%", 0.3)}{line("50%", 0.3)}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        {line("90%", 0.7)}{line("100%", 0.3)}{line("85%", 0.3)}
        <div style={{ marginTop: 5 }} />
        {line("70%", 0.6)}{line("100%", 0.25)}{line("90%", 0.25)}
      </div>
    </div>
  );
  if (layout === "two_col") return (
    <div style={{ display: "flex", gap: 6, padding: "10px 8px", height: "100%" }}>
      {[0, 1].map((col) => (
        <div key={col} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ height: col === 0 ? 14 : 8, background: `${color}22`, borderRadius: 2, marginBottom: 4 }} />
          {line("90%", 0.5)}{line("75%", 0.3)}{line("80%", 0.3)}
          <div style={{ marginTop: 3 }} />
          {line("60%", 0.4)}{line("85%", 0.25)}{line("70%", 0.25)}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ height: 14, width: "50%", background: `${color}33`, borderRadius: 3, marginBottom: 5, alignSelf: "center" }} />
      {line("80%", 0.4)}{line("65%", 0.25)}
      <div style={{ marginTop: 5, borderTop: `1px solid ${color}22`, paddingTop: 4 }} />
      {line("40%", 0.55)}{line("100%", 0.2)}{line("90%", 0.2)}{line("75%", 0.2)}
      <div style={{ marginTop: 3 }} />
      {line("40%", 0.55)}{line("100%", 0.2)}{line("85%", 0.2)}
    </div>
  );
}

// ─── Fullscreen scan overlay (replaces the old modal loader) ─────────────────
const SCAN_MSGS_GEN = [
  "Initializing resume generation…",
  "Analyzing your profile…",
  "Extracting skills & experience…",
  "Optimizing for ATS compatibility…",
  "Crafting achievement bullets…",
  "Structuring layout…",
  "Generating PDF document…",
  "Almost there…",
];
const SCAN_MSGS_EXP = [
  "Preparing your resume…",
  "Applying selected template…",
  "Adjusting typography & spacing…",
  "Generating PDF document…",
  "Finalizing output…",
];

function ScanOverlay({ messages, messageIndex }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="relative h-44 overflow-hidden" style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
          <div className="absolute inset-x-8 top-0 bottom-0 flex items-center pointer-events-none">
            <div className="w-full h-1.5 rounded-full" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)", animation: "scanBeam 2.4s cubic-bezier(.4,0,.6,1) infinite" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white/80 animate-spin" />
          </div>
        </div>
        <div className="px-8 py-6 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-4 min-h-[1.25rem]">{messages[messageIndex]}</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-[1800ms] ease-linear" style={{ width: `${((messageIndex + 1) / messages.length) * 100}%`, background: "linear-gradient(90deg,#086972,#0891b2)" }} />
          </div>
          <p className="mt-3 text-xs text-gray-400">This usually takes 8–15 seconds…</p>
        </div>
      </div>
      <style>{`@keyframes scanBeam{0%{transform:translateY(-200%);opacity:.3}15%{opacity:1}50%{transform:translateY(200%);opacity:1}85%{opacity:.3}100%{transform:translateY(-200%);opacity:.3}}`}</style>
    </div>
  );
}

// ─── History item ─────────────────────────────────────────────────────────────
function HistoryItem({ entry, idx, isLatest, onView, onDownload }) {
  const meta = TEMPLATE_META[entry.template] || TEMPLATE_META.classic_ats;
  const date = entry.generatedAt ? new Date(entry.generatedAt) : null;
  const label = date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  const time  = date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";
  const name  = entry.template?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Classic ATS";

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/40 transition-all group">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ background: meta.color }}>
        {idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 text-sm">{name} Template</span>
          {isLatest && <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: "#086972" }}>Latest</span>}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{label}{time ? ` · ${time}` : ""}</span>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onView}     className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
        <button onClick={onDownload} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Download"><Download className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumePage() {
  const { user, token } = useAuth();

  const [resumeData, setResumeData] = useState(null);
  const [templates,  setTemplates]  = useState([]);
  const [selectedId, setSelectedId] = useState("classic_ats");
  const [history,    setHistory]    = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [isEditOpen,     setIsEditOpen]     = useState(false);
  const [actionMode,     setActionMode]     = useState(null); // "generate" | "export" | null
  const [msgIdx,         setMsgIdx]         = useState(0);

  const scanMessages = actionMode === "generate" ? SCAN_MSGS_GEN : SCAN_MSGS_EXP;

  // cycle messages while busy
  useEffect(() => {
    if (!actionMode) return;
    setMsgIdx(0);
    const iv = setInterval(() => setMsgIdx(p => (p + 1) % scanMessages.length), 1800);
    return () => clearInterval(iv);
  }, [actionMode]);

  // fetch templates once
  useEffect(() => {
    if (!token) return;
    axios.get(`${BACKEND_URL}/api/resume/templates`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        const list = r.data?.templates || [];
        setTemplates(list);
        if (list.length) setSelectedId(list[0].id);
      })
      .catch(console.error);
  }, [token]);

  // fetch status + history
  const refreshStatus = useCallback(async () => {
    if (!user?._id || !token) return;
    try {
      const res  = await fetch(`${BACKEND_URL}/api/resume/status/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data?.exists) {
        setResumeData({ resumePdfUrl: data.resumePdfUrl, template: data.template, updatedAt: data.lastUpdated });
        setSelectedId(data.template || "classic_ats");
        // backend sends history array if you wire it up (see ResumePortfolioController update below)
        if (Array.isArray(data.history)) setHistory(data.history);
      } else {
        setResumeData(null);
      }
    } catch { setResumeData(null); }
  }, [user?._id, token]);

  useEffect(() => { refreshStatus(); }, [refreshStatus]);

  // view / download
  const handleViewResume = async () => {
    try {
      const blob = await fetchResumePdf(user._id, token);
      const url  = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (e) { console.error(e); alert("Failed to open resume."); }
  };

  const handleDownloadResume = async () => {
    try {
      const blob = await fetchResumePdf(user._id, token);
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `Resume_${user?.name || "Professional"}.pdf`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) { console.error(e); alert("Failed to download resume."); }
  };

  const showSuccess = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(""), 5000); };

  // generate / export — inline, no modal needed
  const handleAction = async (mode) => {
    if (actionMode) return;
    setActionMode(mode);
    try {
      const endpoint = mode === "generate" ? `${BACKEND_URL}/api/resume/generate` : `${BACKEND_URL}/api/resume/export`;
      await axios.post(endpoint, { templateId: selectedId }, { headers: { Authorization: `Bearer ${token}` } });
      await refreshStatus();
      showSuccess(mode === "generate" ? "Resume generated successfully!" : "Resume exported with new template!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setActionMode(null);
    }
  };

  const onEdited = async () => { await refreshStatus(); showSuccess("Resume updated successfully!"); };

  const hasResume = !!resumeData?.resumePdfUrl;

  return (
    <DashboardLayout user={user}>
      {actionMode && <ScanOverlay messages={scanMessages} messageIndex={msgIdx} />}

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden p-8 md:p-10" style={{ background: "linear-gradient(135deg, #086972 0%, #0891b2 100%)" }}>
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-10 border-[24px] border-white" />
          <div className="absolute -right-4  -top-4  w-32 h-32 rounded-full opacity-10 border-[16px] border-white" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">AI-Powered</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Professional Resume</h1>
              <p className="mt-2 text-white/70 text-sm max-w-md">Your profile, transformed into a polished, ATS-ready resume in seconds.</p>
            </div>
            {hasResume && (
              <button onClick={() => setIsEditOpen(true)} className="self-start px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 transition-all">
                <Pencil className="w-4 h-4" /> Edit Content
              </button>
            )}
          </div>
        </div>

        {/* Success banner */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        )}

        {/* View / Download (only when resume exists) */}
        {hasResume && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "View Resume", sub: "Opens in a new tab", icon: Eye, action: handleViewResume, dark: false },
              { label: "Download PDF", sub: "Print-ready format",  icon: Download, action: handleDownloadResume, dark: true },
            ].map(({ label, sub, icon: Icon, action, dark }) => (
              <button key={label} onClick={action}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all group ${dark ? "hover:opacity-95" : "bg-white border border-gray-200 hover:border-primary/50 hover:bg-gray-50"}`}
                style={dark ? { background: "#086972" } : {}}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${dark ? "bg-white/20" : ""}`} style={!dark ? { background: "#f0fafa" } : {}}>
                  <Icon className="w-4 h-4" style={{ color: dark ? "#fff" : "#086972" }} />
                </div>
                <div className="text-left">
                  <div className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>{label}</div>
                  <div className={`text-xs ${dark ? "text-white/70" : "text-gray-500"}`}>{sub}</div>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto group-hover:translate-x-0.5 transition-transform ${dark ? "text-white/40" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
        )}

        {/* Status chips */}
        {hasResume && (
          <div className="flex flex-wrap gap-6 p-5 rounded-2xl border border-gray-200 bg-gray-50/60">
            {[
              { icon: LayoutTemplate, label: "Template",     value: resumeData.template?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Classic ATS" },
              { icon: Clock,          label: "Last Updated", value: resumeData.updatedAt ? new Date(resumeData.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
              { icon: Star,           label: "Status",       value: "ATS-Optimized ✓", color: "#086972" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#e6f7f8" }}>
                  <Icon className="w-4 h-4" style={{ color: "#086972" }} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
                  <div className="text-sm font-semibold" style={{ color: color || "#111827" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            INLINE TEMPLATE SELECTOR — no extra modal needed
        ══════════════════════════════════════════════════════ */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              {hasResume ? "Switch template & re-export" : "Choose a template"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {hasResume
                ? `Pick any template and click "Export PDF" — your resume content stays the same.`
                : "Select a layout below, then generate your resume."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(templates.length > 0 ? templates : Object.entries(TEMPLATE_META).map(([id, m]) => ({ id, name: id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), description: "", ...m }))).map((t) => {
              const meta = TEMPLATE_META[t.id] || { color: "#086972", layout: "single", tag: "" };
              const isSelected = selectedId === t.id;
              const isActive   = resumeData?.template === t.id;
              return (
                <button key={t.id} onClick={() => setSelectedId(t.id)}
                  className={`relative rounded-xl border-2 overflow-hidden transition-all text-left focus:outline-none ${isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="h-28 bg-white overflow-hidden" style={{ borderBottom: `1px solid ${meta.color}1a` }}>
                    <TemplateSkeleton color={meta.color} layout={meta.layout} />
                  </div>
                  <div className="px-3 py-2.5 bg-white">
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-gray-900 text-xs leading-tight">{t.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0" style={{ background: `${meta.color}18`, color: meta.color }}>{meta.tag}</span>
                    </div>
                    {t.description && <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{t.description}</p>}
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#086972" }}>Selected</div>
                  )}
                  {isActive && !isSelected && (
                    <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold border" style={{ background: "#fff", color: "#086972", borderColor: "#086972" }}>Active</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Single CTA — context-aware */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleAction(hasResume ? "export" : "generate")}
              disabled={!!actionMode}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}
            >
              {actionMode
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Working…</>
                : hasResume
                  ? <><RefreshCw className="w-4 h-4" /> Export PDF with selected template</>
                  : <><Sparkles className="w-4 h-4" /> Generate My Resume</>}
            </button>
            {hasResume && selectedId === resumeData?.template && (
              <span className="text-xs text-gray-400 italic">This is your currently active template</span>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold text-gray-900">How it works</h2>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="relative p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all group" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="absolute top-4 right-4 font-black text-4xl leading-none select-none" style={{ color: "#08697212" }}>{step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: "#e6f7f8" }}>
                  <Icon className="w-5 h-5" style={{ color: "#086972" }} />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Generation History */}
        {history.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-xl font-bold text-gray-900">Generation history</h2>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{history.length} version{history.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-3">
              {history.map((entry, idx) => (
                <HistoryItem key={idx} entry={entry} idx={idx} isLatest={idx === 0} onView={handleViewResume} onDownload={handleDownloadResume} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Showing the last {history.length} version{history.length !== 1 ? "s" : ""}. Only the latest PDF can be downloaded.</p>
          </section>
        )}

        {/* Empty state */}
        {!hasResume && (
          <div className="text-center py-14 px-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#e6f7f8" }}>
              <FileText className="w-8 h-8" style={{ color: "#086972" }} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">No resume yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">Select a template above and click "Generate My Resume". Your profile data is already saved.</p>
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && hasResume && (
          <ResumeEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSuccess={onEdited} />
        )}
      </div>
    </DashboardLayout>
  );
}