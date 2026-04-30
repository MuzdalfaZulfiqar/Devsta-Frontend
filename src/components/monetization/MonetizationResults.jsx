// import { useState, useRef } from "react";
// import {
//   ShieldCheck, DollarSign, AlertTriangle, AlertCircle,
//   BarChart3, FileDown, ExternalLink, CheckCircle2, TrendingUp,
//   Package, GitBranch, TestTube, Cpu, CheckCircle, X, Clock
// } from "lucide-react";
// import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";

// // ── Color maps ────────────────────────────────────────────────────────────────
// const LICENSE_COLOR = {
//   "MIT":          "#086972",
//   "Apache-2.0":   "#2563eb",
//   "GPL-3.0":      "#dc2626",
//   "AGPL-3.0":     "#9f1239",
//   "BSD-2-Clause": "#0891b2",
//   "BSD-3-Clause": "#0891b2",
//   "MPL-2.0":      "#7c3aed",
//   "Dual-License": "#d97706",
//   "Proprietary":  "#374151",
// };

// // ── Sub-components ────────────────────────────────────────────────────────────

// function SectionHeading({ icon: Icon, children }) {
//   return (
//     <div className="flex items-center gap-2 mb-4">
//       <Icon size={15} className="text-primary" />
//       <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
//         {children}
//       </h3>
//     </div>
//   );
// }

// function Card({ children, className = "" }) {
//   return (
//     <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}>
//       {children}
//     </div>
//   );
// }

// function StatCard({ label, value, sub, accent = false }) {
//   return (
//     <div className={`rounded-xl p-4 border text-center ${
//       accent
//         ? "bg-primary/5 border-primary/20 dark:bg-primary/10"
//         : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
//     }`}>
//       <div className={`text-2xl font-bold ${accent ? "text-primary" : "text-gray-900 dark:text-white"}`}>
//         {value}
//       </div>
//       <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1">{label}</div>
//       {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>}
//     </div>
//   );
// }

// function ConfidenceGauge({ value, color }) {
//   const pct = Math.round(value * 100);
//   const data = [{ value: pct, fill: color }];
//   return (
//     <div className="flex flex-col items-center gap-1">
//       <div style={{ width: 80, height: 80 }}>
//         <ResponsiveContainer>
//           <RadialBarChart
//             innerRadius="65%" outerRadius="100%"
//             startAngle={210} endAngle={-30}
//             data={data}
//           >
//             <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "#f1f5f9" }} />
//             <Tooltip formatter={(v) => [`${v}%`, "Confidence"]} />
//           </RadialBarChart>
//         </ResponsiveContainer>
//       </div>
//       <span className="text-lg font-bold" style={{ color }}>{pct}%</span>
//       <span className="text-xs text-gray-400">confidence</span>
//     </div>
//   );
// }

// function StatusBadge({ severity }) {
//   return (
//     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
//       severity === "blocker"
//         ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
//         : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
//     }`}>
//       {severity}
//     </span>
//   );
// }

// // ── Download Toast ─────────────────────────────────────────────────────────────

// function DownloadToast({ toast, onDismiss }) {
//   if (!toast) return null;
//   return (
//     <div className="flex items-center gap-3 p-3.5 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in slide-in-from-top-2 duration-200">
//       <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
//         <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-green-800 dark:text-green-300">
//           {toast.format === "pdf" ? "PDF report downloaded" : "HTML report opened"}
//         </p>
//         <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
//           {toast.filename} · {toast.time}
//         </p>
//       </div>
//       <button
//         onClick={onDismiss}
//         className="w-6 h-6 rounded-full hover:bg-green-200 dark:hover:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-400 transition-colors flex-shrink-0"
//       >
//         <X size={12} />
//       </button>
//     </div>
//   );
// }

// // ── Download History ──────────────────────────────────────────────────────────

// function DownloadHistory({ downloads }) {
//   if (downloads.length === 0) return null;
//   return (
//     <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
//       <div className="flex items-center gap-1.5 mb-2">
//         <Clock size={11} className="text-gray-400" />
//         <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
//           Download history
//         </p>
//       </div>
//       <div className="space-y-1.5">
//         {downloads.map((d, i) => (
//           <div key={i} className="flex items-center gap-2 text-xs">
//             <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
//               d.format === "pdf"
//                 ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
//                 : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
//             }`}>
//               {d.format.toUpperCase()}
//             </span>
//             <span className="text-gray-500 dark:text-gray-400 font-mono truncate flex-1">
//               {d.filename}
//             </span>
//             <span className="text-gray-400 flex-shrink-0">{d.time}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Main Results Component ────────────────────────────────────────────────────

// export default function MonetizationResults({ result, jobId, onDownload }) {
//   const { code_analysis: ca, license: lic, monetization: mon } = result;
//   const licColor = LICENSE_COLOR[lic.recommended_license] || "#086972";
// const [downloadingFormat, setDownloadingFormat] = useState(null);
//   const [toast, setToast] = useState(null);
//   const [downloads, setDownloads] = useState([]);
//   const toastTimer = useRef(null);

//   const handleDownload = async (format) => {
//     try {
//       await onDownload(format);
//       const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//       const filename = `monetization_report_${jobId.slice(0, 8)}.${format}`;
//       const entry = { format, filename, time: now };
//       setDownloads((prev) => [entry, ...prev]);
//       setToast(entry);
//       if (toastTimer.current) clearTimeout(toastTimer.current);
//       toastTimer.current = setTimeout(() => setToast(null), 5000);
//     } catch {
//       // error handled by parent
//     }
//   };

//   return (
//     <div className="space-y-5">

//       {/* ── Toast ────────────────────────────────────────────────── */}
//       <DownloadToast toast={toast} onDismiss={() => setToast(null)} />

//       {/* ── Repo Header ─────────────────────────────────────────────── */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <GitBranch size={14} className="text-primary" />
//             <span className="text-xs font-bold text-primary uppercase tracking-widest">
//               Analysis Complete
//             </span>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{ca.repo_name}</h2>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
//             {ca.project_category} · {ca.primary_language}
//           </p>
//         </div>

//         {/* Download buttons with history */}
//         <div className="flex-shrink-0">
//           <div className="flex gap-2 mb-1">
//             <button
//               onClick={() => handleDownload("html")}
//               className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//             >
//               <FileDown size={13} /> HTML
//             </button>
//             <button
//               onClick={() => handleDownload("pdf")}
//               className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-xs font-bold text-white hover:bg-primary/90 transition-colors"
//             >
//               <FileDown size={13} /> PDF Report
//             </button>
//           </div>
//           <DownloadHistory downloads={downloads} />
//         </div>
//       </div>

//       {/* ── Stats Row ───────────────────────────────────────────────── */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         <StatCard label="Files Analysed" value={ca.total_files} accent />
//         <StatCard label="Unique Logic" value={`${Math.round(ca.unique_logic_pct)}%`} sub="vs boilerplate" />
//         <StatCard label="Copyleft Deps" value={ca.copyleft_dependency_count} sub="license risk" />
//         <StatCard label="CI Pipeline" value={ca.has_ci ? "Yes" : "No"} sub={ca.has_tests ? "Tests found" : "No tests"} />
//       </div>

//       {/* ── Summaries ───────────────────────────────────────────────── */}
//       {(ca.readme_summary || ca.code_summary) && (
//         <Card>
//           <SectionHeading icon={Cpu}>Project Intelligence</SectionHeading>
//           <div className="space-y-3">
//             {ca.readme_summary && (
//               <div>
//                 <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">README</span>
//                 <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{ca.readme_summary}</p>
//               </div>
//             )}
//             {ca.code_summary && (
//               <div>
//                 <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</span>
//                 <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{ca.code_summary}</p>
//               </div>
//             )}
//           </div>
//         </Card>
//       )}

//       {/* ── License + Monetization ──────────────────────────────────── */}
//       <div className="grid sm:grid-cols-2 gap-4">

//         {/* License Card */}
//         <Card>
//           <SectionHeading icon={ShieldCheck}>License Recommendation</SectionHeading>
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <div className="text-3xl font-extrabold" style={{ color: licColor }}>
//                 {lic.recommended_license}
//               </div>
//               <div className="text-xs text-gray-400 mt-1">Recommended license</div>
//             </div>
//             <ConfidenceGauge value={lic.confidence_score} color={licColor} />
//           </div>
//           <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
//             {lic.rationale}
//           </p>
//           {lic.obligations?.length > 0 && (
//             <div>
//               <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
//                 Key Obligations
//               </p>
//               <ul className="space-y-1.5">
//                 {lic.obligations.map((ob, i) => (
//                   <li key={i} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
//                     <span className="text-primary mt-0.5 flex-shrink-0">·</span>
//                     {ob}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </Card>

//         {/* Monetization Card */}
//         <Card>
//           <SectionHeading icon={DollarSign}>Monetization Strategy</SectionHeading>
//           <div className="mb-3">
//             <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
//               {mon.primary_strategy}
//             </span>
//           </div>
//           <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
//             {mon.revenue_model_summary}
//           </p>
//           <div className="space-y-2">
//             {mon.platform_suggestions?.slice(0, 4).map((s, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
//               >
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-1.5">
//                     <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
//                       {s.platform}
//                     </span>
//                     <a href={s.url} target="_blank" rel="noopener noreferrer">
//                       <ExternalLink size={10} className="text-gray-400 hover:text-primary flex-shrink-0" />
//                     </a>
//                   </div>
//                   <div className="text-[11px] text-gray-400 mt-0.5">{s.strategy}</div>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <div className="text-xs font-bold text-primary">{Math.round(s.ai_confidence * 100)}%</div>
//                   <div className="text-[10px] text-gray-400">fit</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* ── Compatibility Flags ─────────────────────────────────────── */}
//       {lic.compatibility_flags?.length > 0 && (
//         <Card>
//           <SectionHeading icon={AlertTriangle}>Compatibility Flags</SectionHeading>
//           <div className="space-y-2">
//             {lic.compatibility_flags.map((f, i) => (
//               <div
//                 key={i}
//                 className={`flex items-start gap-3 p-3 rounded-lg text-xs ${
//                   f.severity === "blocker"
//                     ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50"
//                     : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50"
//                 }`}
//               >
//                 <AlertTriangle
//                   size={13}
//                   className={f.severity === "blocker" ? "text-red-500 flex-shrink-0 mt-0.5" : "text-yellow-500 flex-shrink-0 mt-0.5"}
//                 />
//                 <span className="flex-1 text-gray-700 dark:text-gray-300">{f.conflict_description}</span>
//                 <StatusBadge severity={f.severity} />
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* ── Risk Notes ──────────────────────────────────────────────── */}
//       {mon.risk_notes?.length > 0 && (
//         <Card>
//           <SectionHeading icon={AlertCircle}>Risk Notes</SectionHeading>
//           <ul className="space-y-2">
//             {mon.risk_notes.map((r, i) => (
//               <li key={i} className="flex gap-2.5 text-xs text-gray-600 dark:text-gray-400">
//                 <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
//                 {r}
//               </li>
//             ))}
//           </ul>
//         </Card>
//       )}

//       {/* ── Dependencies Table ──────────────────────────────────────── */}
//       {ca.dependencies?.length > 0 && (
//         <Card>
//           <SectionHeading icon={Package}>
//             Detected Dependencies ({ca.dependencies.length})
//           </SectionHeading>
//           <div className="overflow-x-auto">
//             <table className="w-full text-xs">
//               <thead>
//                 <tr className="border-b border-gray-100 dark:border-gray-700">
//                   {["Package", "Version", "License", "Type"].map((h) => (
//                     <th key={h} className="text-left py-2 px-1 text-gray-400 dark:text-gray-500 font-semibold">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {ca.dependencies.slice(0, 20).map((dep, i) => (
//                   <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
//                     <td className="py-2 px-1 font-semibold text-gray-800 dark:text-gray-200">{dep.name}</td>
//                     <td className="py-2 px-1 text-gray-400 font-mono">{dep.version}</td>
//                     <td className="py-2 px-1 text-gray-600 dark:text-gray-400">{dep.license_id}</td>
//                     <td className="py-2 px-1">
//                       {dep.is_copyleft ? (
//                         <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
//                           Copyleft
//                         </span>
//                       ) : dep.license_id === "Unknown" ? (
//                         <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-bold">
//                           Unknown
//                         </span>
//                       ) : (
//                         <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
//                           Permissive
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {ca.dependencies.length > 20 && (
//               <p className="text-xs text-gray-400 mt-2">
//                 + {ca.dependencies.length - 20} more — download PDF for full list
//               </p>
//             )}
//           </div>
//         </Card>
//       )}

//       {/* ── Auto-Generated CREDITS.md ───────────────────────────────── */}
//       {lic.auto_generated_credits && (
//         <Card>
//           <SectionHeading icon={CheckCircle2}>Auto-Generated CREDITS.md</SectionHeading>
//           <pre className="bg-gray-900 dark:bg-black text-emerald-400 rounded-lg p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
//             {lic.auto_generated_credits}
//           </pre>
//         </Card>
//       )}
//     </div>
//   );
// }

import { useState, useRef } from "react";
import {
  ShieldCheck, DollarSign, AlertTriangle, AlertCircle,
  BarChart3, FileDown, ExternalLink, CheckCircle2, TrendingUp,
  Package, GitBranch, TestTube, Cpu, CheckCircle, X, Clock,
  Loader2,
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";

// ── Color maps ────────────────────────────────────────────────────────────────
const LICENSE_COLOR = {
  "MIT":          "#086972",
  "Apache-2.0":   "#2563eb",
  "GPL-3.0":      "#dc2626",
  "AGPL-3.0":     "#9f1239",
  "BSD-2-Clause": "#0891b2",
  "BSD-3-Clause": "#0891b2",
  "MPL-2.0":      "#7c3aed",
  "Dual-License": "#d97706",
  "Proprietary":  "#374151",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={17} className="text-primary" />
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {children}
      </h3>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={`rounded-xl p-4 border text-center ${
      accent
        ? "bg-primary/5 border-primary/20 dark:bg-primary/10"
        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
    }`}>
      <div className={`text-3xl font-bold ${accent ? "text-primary" : "text-gray-900 dark:text-white"}`}>
        {value}
      </div>
      <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function ConfidenceGauge({ value, color }) {
  const pct = Math.round(value * 100);
  const data = [{ value: pct, fill: color }];
  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: 80, height: 80 }}>
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="65%" outerRadius="100%"
            startAngle={210} endAngle={-30}
            data={data}
          >
            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "#f1f5f9" }} />
            <Tooltip formatter={(v) => [`${v}%`, "Confidence"]} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <span className="text-xl font-bold" style={{ color }}>{pct}%</span>
      <span className="text-sm text-gray-400">confidence</span>
    </div>
  );
}

function FlagBadge({ severity }) {
  return (
    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
      severity === "blocker"
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
    }`}>
      {severity}
    </span>
  );
}

// ── Download Toast ─────────────────────────────────────────────────────────────

function DownloadToast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className="flex items-center gap-3 p-3.5 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
      <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
        <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          {toast.format === "pdf" ? "PDF report downloaded" : "HTML report opened in new tab"}
        </p>
        <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
          {toast.filename} · {toast.time}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="w-6 h-6 rounded-full hover:bg-green-200 dark:hover:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-400 transition-colors flex-shrink-0"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ── Download History ──────────────────────────────────────────────────────────

function DownloadHistory({ downloads }) {
  if (downloads.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-1.5 mb-2">
        <Clock size={11} className="text-gray-400" />
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Download history
        </p>
      </div>
      <div className="space-y-1.5">
        {downloads.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              d.format === "pdf"
                ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
            }`}>
              {d.format.toUpperCase()}
            </span>
            <span className="text-gray-500 dark:text-gray-400 font-mono truncate flex-1">
              {d.filename}
            </span>
            <span className="text-gray-400 flex-shrink-0">{d.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Results Component ────────────────────────────────────────────────────

export default function MonetizationResults({ result, jobId, onDownload }) {
  const { code_analysis: ca, license: lic, monetization: mon } = result;
  const licColor = LICENSE_COLOR[lic.recommended_license] || "#086972";

  const [toast, setToast] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const toastTimer = useRef(null);

  const handleDownload = async (format) => {
    if (downloadingFormat) return;
    setDownloadingFormat(format);
    try {
      await onDownload(format);
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const filename = `monetization_report_${jobId.slice(0, 8)}.${format}`;
      const entry = { format, filename, time: now };
      setDownloads((prev) => [entry, ...prev]);
      setToast(entry);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 5000);
    } catch {
      // error handled by parent
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Toast ────────────────────────────────────────────────── */}
      <DownloadToast toast={toast} onDismiss={() => setToast(null)} />

      {/* ── Repo Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={14} className="text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-widest">
              Analysis Complete
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{ca.repo_name}</h2>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
            {ca.project_category} · {ca.primary_language}
          </p>
        </div>

        {/* Download buttons */}
        <div className="flex-shrink-0">
          <div className="flex gap-2 mb-1">
            <button
              onClick={() => handleDownload("html")}
              disabled={!!downloadingFormat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[90px] justify-center"
            >
              {downloadingFormat === "html" ? (
                <><Loader2 size={13} className="animate-spin" /> Opening…</>
              ) : (
                <><FileDown size={13} /> HTML</>
              )}
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              disabled={!!downloadingFormat}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-w-[120px] justify-center"
            >
              {downloadingFormat === "pdf" ? (
                <><Loader2 size={13} className="animate-spin" /> Generating…</>
              ) : (
                <><FileDown size={13} /> PDF Report</>
              )}
            </button>
          </div>
          <DownloadHistory downloads={downloads} />
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Files Analysed" value={ca.total_files} accent />
        <StatCard label="Unique Logic" value={`${Math.round(ca.unique_logic_pct)}%`} sub="vs boilerplate" />
        <StatCard label="Copyleft Deps" value={ca.copyleft_dependency_count} sub="license risk" />
        <StatCard label="CI Pipeline" value={ca.has_ci ? "Yes" : "No"} sub={ca.has_tests ? "Tests found" : "No tests"} />
      </div>

      {/* ── Summaries ───────────────────────────────────────────────── */}
      {(ca.readme_summary || ca.code_summary) && (
        <Card>
          <SectionHeading icon={Cpu}>Project Intelligence</SectionHeading>
          <div className="space-y-4">
            {ca.readme_summary && (
              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">README</span>
                <p className="text-base text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed">{ca.readme_summary}</p>
              </div>
            )}
            {ca.code_summary && (
              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</span>
                <p className="text-base text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed">{ca.code_summary}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ── License + Monetization ──────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* License Card */}
        <Card>
          <SectionHeading icon={ShieldCheck}>License Recommendation</SectionHeading>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-extrabold" style={{ color: licColor }}>
                {lic.recommended_license}
              </div>
              <div className="text-sm text-gray-400 mt-1">Recommended license</div>
            </div>
            <ConfidenceGauge value={lic.confidence_score} color={licColor} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {lic.rationale}
          </p>
          {lic.obligations?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Key Obligations
              </p>
              <ul className="space-y-2">
                {lic.obligations.map((ob, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-primary mt-0.5 flex-shrink-0">·</span>
                    {ob}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Monetization Card */}
        <Card>
          <SectionHeading icon={DollarSign}>Monetization Strategy</SectionHeading>
          <div className="mb-3">
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
              {mon.primary_strategy}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {mon.revenue_model_summary}
          </p>
          <div className="space-y-2">
            {mon.platform_suggestions?.slice(0, 4).map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {s.platform}
                    </span>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={11} className="text-gray-400 hover:text-primary flex-shrink-0" />
                    </a>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.strategy}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-primary">{Math.round(s.ai_confidence * 100)}%</div>
                  <div className="text-xs text-gray-400">fit</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Compatibility Flags ─────────────────────────────────────── */}
      {lic.compatibility_flags?.length > 0 && (
        <Card>
          <SectionHeading icon={AlertTriangle}>Compatibility Flags</SectionHeading>
          <div className="space-y-2">
            {lic.compatibility_flags.map((f, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3.5 rounded-lg text-sm ${
                  f.severity === "blocker"
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50"
                }`}
              >
                <AlertTriangle
                  size={14}
                  className={f.severity === "blocker" ? "text-red-500 flex-shrink-0 mt-0.5" : "text-yellow-500 flex-shrink-0 mt-0.5"}
                />
                <span className="flex-1 text-gray-700 dark:text-gray-300">{f.conflict_description}</span>
                <FlagBadge severity={f.severity} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Risk Notes ──────────────────────────────────────────────── */}
      {mon.risk_notes?.length > 0 && (
        <Card>
          <SectionHeading icon={AlertCircle}>Risk Notes</SectionHeading>
          <ul className="space-y-3">
            {mon.risk_notes.map((r, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ── Dependencies Table ──────────────────────────────────────── */}
      {ca.dependencies?.length > 0 && (
        <Card>
          <SectionHeading icon={Package}>
            Detected Dependencies ({ca.dependencies.length})
          </SectionHeading>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {["Package", "Version", "License", "Type"].map((h) => (
                    <th key={h} className="text-left py-2.5 px-2 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ca.dependencies.slice(0, 20).map((dep, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-2.5 px-2 font-semibold text-gray-800 dark:text-gray-200">{dep.name}</td>
                    <td className="py-2.5 px-2 text-gray-400 font-mono">{dep.version}</td>
                    <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400">{dep.license_id}</td>
                    <td className="py-2.5 px-2">
                      {dep.is_copyleft ? (
                        <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2 py-0.5 rounded text-xs font-bold">
                          Copyleft
                        </span>
                      ) : dep.license_id === "Unknown" ? (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded text-xs font-bold">
                          Unknown
                        </span>
                      ) : (
                        <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">
                          Permissive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ca.dependencies.length > 20 && (
              <p className="text-sm text-gray-400 mt-3">
                + {ca.dependencies.length - 20} more — download PDF for full list
              </p>
            )}
          </div>
        </Card>
      )}

      {/* ── Auto-Generated CREDITS.md ───────────────────────────────── */}
      {lic.auto_generated_credits && (
        <Card>
          <SectionHeading icon={CheckCircle2}>Auto-Generated CREDITS.md</SectionHeading>
          <pre className="bg-gray-900 dark:bg-black text-emerald-400 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
            {lic.auto_generated_credits}
          </pre>
        </Card>
      )}
    </div>
  );
}
