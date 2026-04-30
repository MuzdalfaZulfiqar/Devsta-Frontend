// import { useState, useEffect } from "react";
// import {
//   Clock, CheckCircle2, XCircle, Loader2, RotateCcw,
//   Trash2, FileDown, ExternalLink, BarChart3, GitBranch,
//   TrendingUp, Package, Shield,
// } from "lucide-react";
// import { getHistory, deleteJob, downloadReport } from "../../api/monetizationApi";
// import SuccessModal from "../SuccessModal";
// import ErrorModal from "../ErrorModal";
// import ConfirmModal from "../ConfirmModal";

// const STATUS_CONFIG = {
//   complete:   { icon: CheckCircle2, color: "text-green-600 dark:text-green-400",   bg: "bg-green-100 dark:bg-green-900/40",   label: "Complete"   },
//   failed:     { icon: XCircle,      color: "text-red-600 dark:text-red-400",        bg: "bg-red-100 dark:bg-red-900/40",        label: "Failed"     },
//   queued:     { icon: Clock,        color: "text-gray-500 dark:text-gray-400",      bg: "bg-gray-100 dark:bg-gray-800",         label: "Queued"     },
//   ingesting:  { icon: Loader2,      color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-100 dark:bg-blue-900/40",      label: "Ingesting"  },
//   embedding:  { icon: Loader2,      color: "text-purple-600 dark:text-purple-400",  bg: "bg-purple-100 dark:bg-purple-900/40",  label: "Embedding"  },
//   analyzing:  { icon: Loader2,      color: "text-amber-600 dark:text-amber-400",    bg: "bg-amber-100 dark:bg-amber-900/40",    label: "Analyzing"  },
//   licensing:  { icon: Loader2,      color: "text-teal-600 dark:text-teal-400",      bg: "bg-teal-100 dark:bg-teal-900/40",      label: "Licensing"  },
//   monetizing: { icon: Loader2,      color: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-100 dark:bg-indigo-900/40",  label: "Monetizing" },
// };

// /** Extract a human-readable name from a job record */
// function getJobLabel(job) {
//   const ca = job.result?.code_analysis;
//   // Best: AI-detected repo name from analysis
//   if (ca?.repo_name && ca.repo_name !== "unknown-project") return ca.repo_name;
//   // Second: owner/repo from GitHub URL
//   if (job.meta?.url) {
//     const parts = job.meta.url.replace("https://github.com/", "").split("/").filter(Boolean);
//     if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
//     if (parts.length === 1) return parts[0];
//   }
//   // Third: uploaded filename without .zip
//   if (job.meta?.filename) return job.meta.filename.replace(/\.zip$/i, "");
//   // Fallback: short job ID
//   return job.job_id.slice(0, 8);
// }

// function StatusBadge({ status }) {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.queued;
//   const Icon = cfg.icon;
//   const spinning = !["complete", "failed", "queued"].includes(status);
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
//       <Icon size={11} className={spinning ? "animate-spin" : ""} />
//       {cfg.label}
//     </span>
//   );
// }

// function ObligationChip({ text }) {
//   return (
//     <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full mr-1 mb-1">
//       {text}
//     </span>
//   );
// }

// function JobRow({ job, onDeleteRequest, onViewResults, onDownloadError }) {
//   const [expanded, setExpanded] = useState(false);
//   const [downloading, setDownloading] = useState(false);

//   const result = job.result;
//   const ca = result?.code_analysis;
//   const lic = result?.license;
//   const mon = result?.monetization;
//   const isComplete = job.status === "complete";

//   const label = getJobLabel(job);
//   const createdAt = job.created_at
//     ? new Date(job.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
//     : "—";

//   const handleDownload = async (e, format) => {
//     e.stopPropagation();
//     setDownloading(true);
//     try {
//       const blob = await downloadReport(job.job_id, format);
//       if (blob) {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `monetization_report_${job.job_id.slice(0, 8)}.${format}`;
//         a.click();
//         URL.revokeObjectURL(url);
//       }
//     } catch (e) {
//       onDownloadError(e.message);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
//       {/* Row header */}
//       <div
//         className={`flex items-center gap-3 p-4 transition-colors ${isComplete ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" : ""}`}
//         onClick={() => isComplete && setExpanded(x => !x)}
//       >
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-0.5">
//             <GitBranch size={13} className="text-primary flex-shrink-0" />
//             <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//               {label}
//             </span>
//           </div>
//           <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
//             <span>{createdAt}</span>
//             {ca && (
//               <span>· {ca.primary_language} · {ca.total_files} files · {ca.project_category}</span>
//             )}
//             {job.meta?.url && (
//               <a
//                 href={job.meta.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={e => e.stopPropagation()}
//                 className="flex items-center gap-1 hover:text-primary"
//               >
//                 <ExternalLink size={10} /> GitHub
//               </a>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-2 flex-shrink-0">
//           <StatusBadge status={job.status} />

//           {isComplete && (
//             <>
//               <button
//                 onClick={e => handleDownload(e, "pdf")}
//                 disabled={downloading}
//                 className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary/50 transition-colors"
//                 title="Download PDF"
//               >
//                 {downloading ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
//               </button>
//               <button
//                 onClick={e => { e.stopPropagation(); onViewResults(job.job_id, result); }}
//                 className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
//               >
//                 View
//               </button>
//             </>
//           )}

//           <button
//             onClick={e => { e.stopPropagation(); onDeleteRequest(job.job_id, label); }}
//             className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//             title="Delete"
//           >
//             <Trash2 size={13} />
//           </button>
//         </div>
//       </div>

//       {/* Expanded obligation detail */}
//       {expanded && isComplete && ca && lic && mon && (
//         <div className="border-t border-gray-100 dark:border-gray-700 px-4 pb-4 pt-3">
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
//             {[
//               { label: "Unique logic",   value: `${Math.round(ca.unique_logic_pct)}%` },
//               { label: "License",        value: lic.recommended_license, accent: true },
//               { label: "Copyleft deps",  value: ca.copyleft_dependency_count },
//               { label: "Confidence",     value: `${Math.round(lic.confidence_score * 100)}%` },
//             ].map(({ label, value, accent }) => (
//               <div key={label} className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center border border-gray-100 dark:border-gray-700">
//                 <div className={`text-lg font-bold ${accent ? "text-primary" : "text-gray-900 dark:text-white"}`}>{value}</div>
//                 <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
//               </div>
//             ))}
//           </div>

//           {lic.obligations?.length > 0 && (
//             <div className="mb-3">
//               <div className="flex items-center gap-1.5 mb-2">
//                 <Shield size={12} className="text-primary" />
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">License obligations</span>
//               </div>
//               <div>{lic.obligations.map((ob, i) => <ObligationChip key={i} text={ob} />)}</div>
//             </div>
//           )}

//           {lic.compatibility_flags?.length > 0 && (
//             <div className="mb-3">
//               <div className="flex items-center gap-1.5 mb-2">
//                 <Package size={12} className="text-amber-500" />
//                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
//                   {lic.compatibility_flags.length} compatibility flag{lic.compatibility_flags.length !== 1 ? "s" : ""}
//                 </span>
//               </div>
//               <div className="space-y-1">
//                 {lic.compatibility_flags.slice(0, 3).map((f, i) => (
//                   <div key={i} className={`text-xs px-2.5 py-1.5 rounded-lg ${
//                     f.severity === "blocker"
//                       ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
//                       : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
//                   }`}>
//                     {f.conflict_description}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="text-xs text-gray-400">
//             Strategy: <span className="font-semibold text-primary">{mon.primary_strategy}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function MonetizationHistory({ onViewResults }) {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   // Modals
//   const [confirmModal, setConfirmModal] = useState({ open: false, jobId: null, label: "" });
//   const [successModal, setSuccessModal] = useState({ open: false, message: "" });
//   const [errorModal, setErrorModal]     = useState({ open: false, message: "" });

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await getHistory(100);
//       setJobs(data);
//     } catch (e) {
//       setErrorModal({ open: true, message: e.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   const handleDeleteRequest = (jobId, label) => {
//     setConfirmModal({ open: true, jobId, label });
//   };

//   const handleDeleteConfirm = async () => {
//     const { jobId, label } = confirmModal;
//     setConfirmModal({ open: false, jobId: null, label: "" });
//     try {
//       await deleteJob(jobId);
//       setJobs(prev => prev.filter(j => j.job_id !== jobId));
//       setSuccessModal({ open: true, message: `"${label}" has been removed from your history.` });
//     } catch (e) {
//       setErrorModal({ open: true, message: `Failed to delete job: ${e.message}` });
//     }
//   };

//   const handleDownloadError = (message) => {
//     setErrorModal({ open: true, message: `Report download failed: ${message}` });
//   };

//   const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

//   const stats = {
//     total:    jobs.length,
//     complete: jobs.filter(j => j.status === "complete").length,
//     failed:   jobs.filter(j => j.status === "failed").length,
//     running:  jobs.filter(j => !["complete", "failed"].includes(j.status)).length,
//   };

//   return (
//     <div className="space-y-5">

//       {/* Modals */}
//       <ConfirmModal
//         open={confirmModal.open}
//         title="Delete this analysis?"
//         message={`"${confirmModal.label}" will be permanently removed from your history. This cannot be undone.`}
//         confirmLabel="Delete"
//         cancelLabel="Cancel"
//         onConfirm={handleDeleteConfirm}
//         onCancel={() => setConfirmModal({ open: false, jobId: null, label: "" })}
//       />
//       <SuccessModal
//         open={successModal.open}
//         message={successModal.message}
//         onClose={() => setSuccessModal({ open: false, message: "" })}
//       />
//       <ErrorModal
//         open={errorModal.open}
//         message={errorModal.message}
//         onClose={() => setErrorModal({ open: false, message: "" })}
//       />

//       {/* Stats row */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         {[
//           { label: "Total analyses", value: stats.total,    icon: BarChart3    },
//           { label: "Completed",      value: stats.complete, icon: CheckCircle2 },
//           { label: "Failed",         value: stats.failed,   icon: XCircle      },
//           { label: "In progress",    value: stats.running,  icon: Loader2      },
//         ].map(({ label, value, icon: Icon }) => (
//           <div key={label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
//             <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
//             <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
//               <Icon size={11} /> {label}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Filter + Refresh */}
//       <div className="flex items-center gap-3">
//         <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
//           {["all", "complete", "failed"].map(f => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
//                 filter === f
//                   ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
//                   : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={load}
//           disabled={loading}
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
//         >
//           <RotateCcw size={12} className={loading ? "animate-spin" : ""} /> Refresh
//         </button>
//       </div>

//       {/* List */}
//       {loading ? (
//         <div className="flex items-center justify-center py-16 text-gray-400">
//           <Loader2 size={20} className="animate-spin mr-2" /> Loading history…
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//           <TrendingUp size={32} className="mb-3 opacity-40" />
//           <p className="text-sm font-semibold">No analyses yet</p>
//           <p className="text-xs mt-1">Run your first monetization audit to see it here.</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map(job => (
//             <JobRow
//               key={job.job_id}
//               job={job}
//               onDeleteRequest={handleDeleteRequest}
//               onViewResults={onViewResults}
//               onDownloadError={handleDownloadError}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import {
  Clock, CheckCircle2, XCircle, Loader2, RotateCcw,
  Trash2, FileDown, ExternalLink, BarChart3, GitBranch,
  TrendingUp, Package, Shield,
} from "lucide-react";
import { getHistory, deleteJob, downloadReport } from "../../api/monetizationApi";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import ConfirmModal from "../ConfirmModal";

const STATUS_CONFIG = {
  complete:   { icon: CheckCircle2, color: "text-green-600 dark:text-green-400",   bg: "bg-green-100 dark:bg-green-900/40",   label: "Complete"   },
  failed:     { icon: XCircle,      color: "text-red-600 dark:text-red-400",        bg: "bg-red-100 dark:bg-red-900/40",        label: "Failed"     },
  queued:     { icon: Clock,        color: "text-gray-500 dark:text-gray-400",      bg: "bg-gray-100 dark:bg-gray-800",         label: "Queued"     },
  ingesting:  { icon: Loader2,      color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-100 dark:bg-blue-900/40",      label: "Ingesting"  },
  embedding:  { icon: Loader2,      color: "text-purple-600 dark:text-purple-400",  bg: "bg-purple-100 dark:bg-purple-900/40",  label: "Embedding"  },
  analyzing:  { icon: Loader2,      color: "text-amber-600 dark:text-amber-400",    bg: "bg-amber-100 dark:bg-amber-900/40",    label: "Analyzing"  },
  licensing:  { icon: Loader2,      color: "text-teal-600 dark:text-teal-400",      bg: "bg-teal-100 dark:bg-teal-900/40",      label: "Licensing"  },
  monetizing: { icon: Loader2,      color: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-100 dark:bg-indigo-900/40",  label: "Monetizing" },
};

/** Extract a human-readable name from a job record */
function getJobLabel(job) {
  const ca = job.result?.code_analysis;
  // Best: AI-detected repo name from analysis
  if (ca?.repo_name && ca.repo_name !== "unknown-project") return ca.repo_name;
  // Second: owner/repo from GitHub URL
  if (job.meta?.url) {
    const parts = job.meta.url.replace("https://github.com/", "").split("/").filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    if (parts.length === 1) return parts[0];
  }
  // Third: uploaded filename without .zip
  if (job.meta?.filename) return job.meta.filename.replace(/\.zip$/i, "");
  // Fallback: short job ID with label
  return `Job ${job.job_id.slice(0, 8)}`;
}

/** Extract a subtitle for the job */
function getJobSubtitle(job) {
  const ca = job.result?.code_analysis;
  if (!ca) return null;
  const parts = [];
  if (ca.primary_language) parts.push(ca.primary_language);
  if (ca.total_files) parts.push(`${ca.total_files} files`);
  if (ca.project_category) parts.push(ca.project_category);
  return parts.join(" · ");
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.queued;
  const Icon = cfg.icon;
  const spinning = !["complete", "failed", "queued"].includes(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon size={11} className={spinning ? "animate-spin" : ""} />
      {cfg.label}
    </span>
  );
}

function ObligationChip({ text }) {
  return (
    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mr-1 mb-1">
      {text}
    </span>
  );
}

function JobRow({ job, onDeleteRequest, onViewResults, onDownloadError }) {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const result = job.result;
  const ca = result?.code_analysis;
  const lic = result?.license;
  const mon = result?.monetization;
  const isComplete = job.status === "complete";

  const label = getJobLabel(job);
  const subtitle = getJobSubtitle(job);
  const createdAt = job.created_at
    ? new Date(job.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "—";

  const handleDownload = async (e, format) => {
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await downloadReport(job.job_id, format);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `monetization_report_${job.job_id.slice(0, 8)}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      onDownloadError(e.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Row header */}
      <div
        className={`flex items-center gap-3 p-4 transition-colors ${isComplete ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" : ""}`}
        onClick={() => isComplete && setExpanded(x => !x)}
      >
        <div className="flex-1 min-w-0">
          {/* Project name — prominent */}
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={14} className="text-primary flex-shrink-0" />
            <span className="text-base font-bold text-gray-900 dark:text-white truncate">
              {label}
            </span>
          </div>
          {/* Subtitle row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-gray-400 ml-5">
            <span>{createdAt}</span>
            {subtitle && <span>· {subtitle}</span>}
            {job.meta?.url && (
              <a
                href={job.meta.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ExternalLink size={11} /> GitHub
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={job.status} />

          {isComplete && (
            <>
              <button
                onClick={e => handleDownload(e, "pdf")}
                disabled={downloading}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Download PDF"
              >
                {downloading
                  ? <Loader2 size={13} className="animate-spin" />
                  : <FileDown size={13} />
                }
              </button>
              <button
                onClick={e => { e.stopPropagation(); onViewResults(job.job_id, result); }}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                View
              </button>
            </>
          )}

          <button
            onClick={e => { e.stopPropagation(); onDeleteRequest(job.job_id, label); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded obligation detail */}
      {expanded && isComplete && ca && lic && mon && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Unique logic",   value: `${Math.round(ca.unique_logic_pct)}%` },
              { label: "License",        value: lic.recommended_license, accent: true },
              { label: "Copyleft deps",  value: ca.copyleft_dependency_count },
              { label: "Confidence",     value: `${Math.round(lic.confidence_score * 100)}%` },
            ].map(({ label, value, accent }) => (
              <div key={label} className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center border border-gray-100 dark:border-gray-700">
                <div className={`text-xl font-bold ${accent ? "text-primary" : "text-gray-900 dark:text-white"}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {lic.obligations?.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Shield size={13} className="text-primary" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">License obligations</span>
              </div>
              <div>{lic.obligations.map((ob, i) => <ObligationChip key={i} text={ob} />)}</div>
            </div>
          )}

          {lic.compatibility_flags?.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Package size={13} className="text-amber-500" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {lic.compatibility_flags.length} compatibility flag{lic.compatibility_flags.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-1">
                {lic.compatibility_flags.slice(0, 3).map((f, i) => (
                  <div key={i} className={`text-sm px-3 py-2 rounded-lg ${
                    f.severity === "blocker"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                  }`}>
                    {f.conflict_description}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-400 mt-2">
            Strategy: <span className="font-semibold text-primary">{mon.primary_strategy}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MonetizationHistory({ onViewResults }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Modals
  const [confirmModal, setConfirmModal] = useState({ open: false, jobId: null, label: "" });
  const [successModal, setSuccessModal] = useState({ open: false, message: "" });
  const [errorModal, setErrorModal]     = useState({ open: false, message: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHistory(100);
      setJobs(data);
    } catch (e) {
      setErrorModal({ open: true, message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDeleteRequest = (jobId, label) => {
    setConfirmModal({ open: true, jobId, label });
  };

  const handleDeleteConfirm = async () => {
    const { jobId, label } = confirmModal;
    setConfirmModal({ open: false, jobId: null, label: "" });
    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.job_id !== jobId));
      setSuccessModal({ open: true, message: `"${label}" has been removed from your history.` });
    } catch (e) {
      setErrorModal({ open: true, message: `Failed to delete job: ${e.message}` });
    }
  };

  const handleDownloadError = (message) => {
    setErrorModal({ open: true, message: `Report download failed: ${message}` });
  };

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  const stats = {
    total:    jobs.length,
    complete: jobs.filter(j => j.status === "complete").length,
    failed:   jobs.filter(j => j.status === "failed").length,
    running:  jobs.filter(j => !["complete", "failed"].includes(j.status)).length,
  };

  return (
    <div className="space-y-5">

      {/* Modals */}
      <ConfirmModal
        open={confirmModal.open}
        title="Delete this analysis?"
        message={`"${confirmModal.label}" will be permanently removed from your history. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ open: false, jobId: null, label: "" })}
      />
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

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total analyses", value: stats.total,    icon: BarChart3    },
          { label: "Completed",      value: stats.complete, icon: CheckCircle2 },
          { label: "Failed",         value: stats.failed,   icon: XCircle      },
          { label: "In progress",    value: stats.running,  icon: Loader2      },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
              <Icon size={12} /> {label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Refresh */}
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {["all", "complete", "failed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
        >
          <RotateCcw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={22} className="animate-spin mr-2" />
          <span className="text-base">Loading history…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <TrendingUp size={36} className="mb-3 opacity-40" />
          <p className="text-base font-semibold">No analyses yet</p>
          <p className="text-sm mt-1">Run your first monetization audit to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => (
            <JobRow
              key={job.job_id}
              job={job}
              onDeleteRequest={handleDeleteRequest}
              onViewResults={onViewResults}
              onDownloadError={handleDownloadError}
            />
          ))}
        </div>
      )}
    </div>
  );
}
