// import { Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

// const STEP_LABELS = {
//   pending:    "Queued…",
//   queued:     "Queued…",
//   ingesting:  "Cloning & scanning repository…",
//   embedding:  "Embedding code chunks into vectors…",
//   analyzing:  "Running RAG analysis with Groq…",
//   licensing:  "Running SPDX license engine…",
//   monetizing: "Building monetization strategy…",
//   complete:   "Analysis complete",
//   failed:     "Analysis failed",
// };

// const STEPS = [
//   { key: "ingesting",  label: "Ingest Repository",      desc: "Clone & filter source files" },
//   { key: "embedding",  label: "Chunk & Embed",           desc: "Semantic vector embeddings" },
//   { key: "analyzing",  label: "RAG Code Analysis",       desc: "Multi-query retrieval + Groq LLM" },
//   { key: "licensing",  label: "License Engine",          desc: "SPDX compatibility matrix" },
//   { key: "monetizing", label: "Monetization Strategy",   desc: "Platform matching & risk scoring" },
// ];

// const STEP_ORDER = ["ingesting", "embedding", "analyzing", "licensing", "monetizing", "complete"];

// export default function MonetizationProgress({ status, progress, error }) {
//   const isFailed = status === "failed";
//   const currentIdx = STEP_ORDER.indexOf(status);

//   return (
//     <div className="max-w-xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           {isFailed ? (
//             <XCircle size={28} className="text-red-500 flex-shrink-0" />
//           ) : (
//             <Loader2 size={28} className="text-primary animate-spin flex-shrink-0" />
//           )}
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//               {isFailed ? "Analysis Failed" : "Analysing Repository"}
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
//               {error || STEP_LABELS[status] || "Processing…"}
//             </p>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden mb-1.5">
//           <div
//             className={`h-full rounded-full transition-all duration-700 ${
//               isFailed ? "bg-red-500" : "bg-primary"
//             }`}
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//         <div className="flex justify-between">
//           <span className="text-xs text-gray-400">{progress}% complete</span>
//           {!isFailed && (
//             <span className="text-xs text-gray-400">
//               Est. 30–90 seconds
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Step List */}
//       <div className="space-y-2">
//         {STEPS.map(({ key, label, desc }, idx) => {
//           const stepIdx = STEP_ORDER.indexOf(key);
//           const isDone = currentIdx > stepIdx || status === "complete";
//           const isActive = status === key;
//           const isPending = !isDone && !isActive;

//           return (
//             <div
//               key={key}
//               className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
//                 isActive
//                   ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
//                   : isDone
//                   ? "border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10"
//                   : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30"
//               }`}
//             >
//               {/* Step Icon */}
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                 isDone
//                   ? "bg-green-100 dark:bg-green-900/50"
//                   : isActive
//                   ? "bg-primary/10"
//                   : "bg-gray-100 dark:bg-gray-800"
//               }`}>
//                 {isDone ? (
//                   <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
//                 ) : isActive ? (
//                   <Loader2 size={14} className="text-primary animate-spin" />
//                 ) : (
//                   <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
//                 )}
//               </div>

//               {/* Step Info */}
//               <div className="flex-1 min-w-0">
//                 <div className={`text-sm font-semibold ${
//                   isDone
//                     ? "text-green-700 dark:text-green-400"
//                     : isActive
//                     ? "text-primary"
//                     : "text-gray-400 dark:text-gray-500"
//                 }`}>
//                   {label}
//                 </div>
//                 <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</div>
//               </div>

//               {/* Status tag */}
//               {isDone && (
//                 <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full flex-shrink-0">
//                   Done
//                 </span>
//               )}
//               {isActive && (
//                 <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
//                   Running
//                 </span>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {isFailed && (
//         <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
//           <div className="flex items-start gap-2">
//             <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="text-sm font-semibold text-red-700 dark:text-red-400">What went wrong?</p>
//               <p className="text-xs text-red-600 dark:text-red-500 mt-1">
//                 {error || "An unexpected error occurred during analysis. Please try again."}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const STEP_LABELS = {
  pending:    "Queued…",
  queued:     "Queued…",
  ingesting:  "Cloning & scanning repository…",
  embedding:  "Embedding code chunks into vectors…",
  analyzing:  "Running RAG analysis with Groq…",
  licensing:  "Running SPDX license engine…",
  monetizing: "Building monetization strategy…",
  complete:   "Analysis complete",
  failed:     "Analysis failed",
};

const STEPS = [
  { key: "ingesting",  label: "Ingest Repository",      desc: "Clone & filter source files" },
  { key: "embedding",  label: "Chunk & Embed",           desc: "Semantic vector embeddings" },
  { key: "analyzing",  label: "RAG Code Analysis",       desc: "Multi-query retrieval + Groq LLM" },
  { key: "licensing",  label: "License Engine",          desc: "SPDX compatibility matrix" },
  { key: "monetizing", label: "Monetization Strategy",   desc: "Platform matching & risk scoring" },
];

const STEP_ORDER = ["ingesting", "embedding", "analyzing", "licensing", "monetizing", "complete"];

export default function MonetizationProgress({ status, progress, error }) {
  const isFailed = status === "failed";
  const currentIdx = STEP_ORDER.indexOf(status);

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {isFailed ? (
            <XCircle size={30} className="text-red-500 flex-shrink-0" />
          ) : (
            <Loader2 size={30} className="text-primary animate-spin flex-shrink-0" />
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isFailed ? "Analysis Failed" : "Analysing Repository"}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
              {error || STEP_LABELS[status] || "Processing…"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isFailed ? "bg-red-500" : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">{progress}% complete</span>
          {!isFailed && (
            <span className="text-sm text-gray-400">Est. 30–90 seconds</span>
          )}
        </div>
      </div>

      {/* Step List */}
      <div className="space-y-2">
        {STEPS.map(({ key, label, desc }, idx) => {
          const stepIdx = STEP_ORDER.indexOf(key);
          const isDone = currentIdx > stepIdx || status === "complete";
          const isActive = status === key;

          return (
            <div
              key={key}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                  : isDone
                  ? "border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30"
              }`}
            >
              {/* Step Icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDone
                  ? "bg-green-100 dark:bg-green-900/50"
                  : isActive
                  ? "bg-primary/10"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}>
                {isDone ? (
                  <CheckCircle2 size={17} className="text-green-600 dark:text-green-400" />
                ) : isActive ? (
                  <Loader2 size={16} className="text-primary animate-spin" />
                ) : (
                  <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <div className={`text-base font-semibold ${
                  isDone
                    ? "text-green-700 dark:text-green-400"
                    : isActive
                    ? "text-primary"
                    : "text-gray-400 dark:text-gray-500"
                }`}>
                  {label}
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{desc}</div>
              </div>

              {/* Status tag */}
              {isDone && (
                <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 rounded-full flex-shrink-0">
                  Done
                </span>
              )}
              {isActive && (
                <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex-shrink-0">
                  Running
                </span>
              )}
            </div>
          );
        })}
      </div>

      {isFailed && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-semibold text-red-700 dark:text-red-400">What went wrong?</p>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                {error || "An unexpected error occurred during analysis. Please try again."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
