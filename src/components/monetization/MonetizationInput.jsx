// import { useState, useRef } from "react";
// import {
//   Github, Upload, ChevronRight, Loader2, FolderOpen,
//   Scan, Scale, TrendingUp, Zap, Shield, BarChart3,
//   CheckCircle, ArrowRight, Code2, FileSearch, Lightbulb
// } from "lucide-react";

// const EXAMPLE_REPOS = [
//   { label: "fastapi/fastapi", url: "https://github.com/fastapi/fastapi" },
//   { label: "tiangolo/sqlmodel", url: "https://github.com/tiangolo/sqlmodel" },
//   { label: "pallets/flask", url: "https://github.com/pallets/flask" },
// ];

// const HOW_IT_WORKS = [
//   {
//     step: "01",
//     icon: FileSearch,
//     title: "Repository Ingestion",
//     desc: "We clone your repo and scan every source file — Python, JS, Go, Rust, Java, and more. Dependency manifests are parsed across all ecosystems.",
//   },
//   {
//     step: "02",
//     icon: Scan,
//     title: "RAG Code Analysis",
//     desc: "Files are chunked semantically and embedded into a vector store. Multi-query retrieval surfaces the most relevant logic for analysis by Groq LLM.",
//   },
//   {
//     step: "03",
//     icon: Scale,
//     title: "SPDX License Engine",
//     desc: "A deterministic compatibility matrix cross-references every dependency license. Blockers and grey areas are flagged before a license is recommended.",
//   },
//   {
//     step: "04",
//     icon: TrendingUp,
//     title: "Monetization Strategy",
//     desc: "Project category, license type, and uniqueness score drive platform recommendations — from GitHub Sponsors to SaaS to dual-licensing.",
//   },
// ];

// const WHY_CARDS = [
//   {
//     icon: Zap,
//     title: "Saves hours of research",
//     desc: "What takes a lawyer and a business analyst days, this module does in under 90 seconds.",
//   },
//   {
//     icon: Shield,
//     title: "Avoids legal pitfalls",
//     desc: "Copyleft conflicts caught before you accidentally violate GPL terms in a commercial product.",
//   },
//   {
//     icon: BarChart3,
//     title: "Actionable revenue plan",
//     desc: "Platform-specific rationale, not generic advice. Know exactly where and how to list your project.",
//   },
// ];

// export default function MonetizationInput({ onSubmit, loading, error }) {
//   const [mode, setMode] = useState("github");
//   const [url, setUrl] = useState("");
//   const [file, setFile] = useState(null);
//   const [dragOver, setDragOver] = useState(false);
//   const fileRef = useRef(null);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const dropped = e.dataTransfer.files[0];
//     if (dropped?.name.endsWith(".zip")) setFile(dropped);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (mode === "github") onSubmit({ type: "github", url });
//     else if (file) onSubmit({ type: "upload", file });
//   };

//   const isReady = mode === "github"
//     ? url.startsWith("https://github.com/") && url.length > 22
//     : !!file;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl">

//       {/* ── LEFT COLUMN: Form ─────────────────────────────────────── */}
//       <div>
//         {/* Error Banner */}
//         {error && (
//           <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
//             <div className="w-4 h-4 rounded-full border border-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
//               <span className="text-[9px] font-bold">!</span>
//             </div>
//             {error}
//           </div>
//         )}

//         {/* Mode Toggle */}
//         <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5">
//           {[
//             { key: "github", label: "GitHub URL", icon: Github },
//             { key: "upload", label: "Upload ZIP", icon: Upload },
//           ].map(({ key, label, icon: Icon }) => (
//             <button
//               key={key}
//               type="button"
//               onClick={() => setMode(key)}
//               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
//                 mode === key
//                   ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//               }`}
//             >
//               <Icon size={14} />
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {mode === "github" ? (
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Repository URL
//               </label>
//               <div className="relative">
//                 <Github
//                   size={15}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                 />
//                 <input
//                   type="url"
//                   placeholder="https://github.com/owner/repository"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
//                 />
//               </div>

//               {/* Quick-fill examples */}
//               <div className="mt-3">
//                 <p className="text-xs text-gray-400 mb-2">Try an example:</p>
//                 <div className="flex flex-wrap gap-2">
//                   {EXAMPLE_REPOS.map((ex) => (
//                     <button
//                       key={ex.label}
//                       type="button"
//                       onClick={() => setUrl(ex.url)}
//                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-colors"
//                     >
//                       <ArrowRight size={10} />
//                       {ex.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <p className="mt-3 text-xs text-gray-400">
//                 Public repositories only — use ZIP upload for private repos.
//               </p>
//             </div>
//           ) : (
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Project Archive
//               </label>
//               <div
//                 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={handleDrop}
//                 onClick={() => fileRef.current?.click()}
//                 className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
//                   dragOver
//                     ? "border-primary bg-primary/5"
//                     : "border-gray-200 dark:border-gray-700 hover:border-primary/50 bg-gray-50 dark:bg-gray-800/50"
//                 }`}
//               >
//                 <input
//                   ref={fileRef}
//                   type="file"
//                   accept=".zip"
//                   className="hidden"
//                   onChange={(e) => setFile(e.target.files[0])}
//                 />
//                 {file ? (
//                   <div className="flex items-center justify-center gap-3">
//                     <FolderOpen size={20} className="text-primary" />
//                     <div className="text-left">
//                       <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
//                         {file.name}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         {(file.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload size={24} className="mx-auto mb-3 text-gray-400" />
//                     <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       Drop your .zip here
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">or click to browse</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading || !isReady}
//             className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
//           >
//             {loading ? (
//               <Loader2 size={16} className="animate-spin" />
//             ) : (
//               <ChevronRight size={16} />
//             )}
//             {loading ? "Starting Analysis…" : "Run Monetization Audit"}
//           </button>
//         </form>

//         {/* Supported languages */}
//         <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
//           <p className="text-xs text-gray-400 mb-2.5 font-semibold uppercase tracking-wider">
//             Supported Languages
//           </p>
//           <div className="flex flex-wrap gap-1.5">
//             {[".py", ".js", ".ts", ".go", ".rs", ".java", ".rb", ".cpp", ".cs", ".swift", ".kt", "+more"].map((lang) => (
//               <span
//                 key={lang}
//                 className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-500 dark:text-gray-400"
//               >
//                 {lang}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── RIGHT COLUMN: How it works + Why ─────────────────────── */}
//       <div className="space-y-6">

//         {/* How it works */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <Code2 size={14} className="text-primary" />
//             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
//               How it works
//             </h3>
//           </div>

//           <div className="space-y-3">
//             {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
//               <div
//                 key={step}
//                 className="flex gap-3.5 p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl"
//               >
//                 <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
//                   <span className="text-[10px] font-bold text-gray-400 font-mono">{step}</span>
//                   <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
//                     <Icon size={13} className="text-primary" />
//                   </div>
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-0.5">{title}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Why it matters */}
//         <div>
//           {/* <div className="flex items-center gap-2 mb-4">
//             <Lightbulb size={14} className="text-primary" />
//             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
//               Why it matters
//             </h3>
//           </div>

//           <div className="space-y-2.5">
//             {WHY_CARDS.map(({ icon: Icon, title, desc }) => (
//               <div
//                 key={title}
//                 className="flex gap-3 p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
//               >
//                 <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <Icon size={13} className="text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-0.5">{title}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div> */}

//           {/* Output preview chips */}
//           <div className="mt-4 p-3.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
//             <p className="text-xs font-bold text-primary mb-2.5">What you get</p>
//             <div className="space-y-1.5">
//               {[
//                 "Recommended open-source license with rationale",
//                 "SPDX compatibility flags for every dependency",
//                 "Top monetization platforms ranked by fit score",
//                 "Auto-generated CREDITS.md if required",
//                 "Downloadable PDF + HTML audit report",
//               ].map((item) => (
//                 <div key={item} className="flex items-start gap-2">
//                   <CheckCircle size={11} className="text-primary flex-shrink-0 mt-0.5" />
//                   <span className="text-xs text-gray-600 dark:text-gray-400">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useRef } from "react";
import {
  Github, Upload, ChevronRight, Loader2, FolderOpen,
  Scan, Scale, TrendingUp, Zap, Shield, BarChart3,
  CheckCircle, ArrowRight, Code2, FileSearch,
} from "lucide-react";

const EXAMPLE_REPOS = [
  { label: "fastapi/fastapi", url: "https://github.com/fastapi/fastapi" },
  { label: "tiangolo/sqlmodel", url: "https://github.com/tiangolo/sqlmodel" },
  { label: "pallets/flask", url: "https://github.com/pallets/flask" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: FileSearch,
    title: "Repository Ingestion",
    desc: "We clone your repo and scan every source file — Python, JS, Go, Rust, Java, and more. Dependency manifests are parsed across all ecosystems.",
  },
  {
    step: "02",
    icon: Scan,
    title: "RAG Code Analysis",
    desc: "Files are chunked semantically and embedded into a vector store. Multi-query retrieval surfaces the most relevant logic for analysis by Groq LLM.",
  },
  {
    step: "03",
    icon: Scale,
    title: "SPDX License Engine",
    desc: "A deterministic compatibility matrix cross-references every dependency license. Blockers and grey areas are flagged before a license is recommended.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Monetization Strategy",
    desc: "Project category, license type, and uniqueness score drive platform recommendations — from GitHub Sponsors to SaaS to dual-licensing.",
  },
];

export default function MonetizationInput({ onSubmit, loading, error }) {
  const [mode, setMode] = useState("github");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".zip")) setFile(dropped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "github") onSubmit({ type: "github", url });
    else if (file) onSubmit({ type: "upload", file });
  };

  const isReady = mode === "github"
    ? url.startsWith("https://github.com/") && url.length > 22
    : !!file;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl">

      {/* ── LEFT COLUMN: Form ─────────────────────────────────────── */}
      <div>
        {/* Error Banner */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full border border-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">!</span>
            </div>
            {error}
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5">
          {[
            { key: "github", label: "GitHub URL", icon: Github },
            { key: "upload", label: "Upload ZIP", icon: Upload },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === key
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "github" ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Repository URL
              </label>
              <div className="relative">
                <Github
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="url"
                  placeholder="https://github.com/owner/repository"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Quick-fill examples */}
              <div className="mt-3">
                <p className="text-sm text-gray-400 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_REPOS.map((ex) => (
                    <button
                      key={ex.label}
                      type="button"
                      onClick={() => setUrl(ex.url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <ArrowRight size={11} />
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-400">
                Public repositories only — use ZIP upload for private repos.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Project Archive
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50 bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FolderOpen size={22} className="text-primary" />
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={26} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Drop your .zip here
                    </p>
                    <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                  </>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isReady}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-bold transition-colors"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <ChevronRight size={17} />
            )}
            {loading ? "Starting Analysis…" : "Run Monetization Audit"}
          </button>
        </form>

        {/* Supported languages */}
        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 mb-2.5 font-semibold uppercase tracking-wider">
            Supported Languages
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[".py", ".js", ".ts", ".go", ".rs", ".java", ".rb", ".cpp", ".cs", ".swift", ".kt", "+more"].map((lang) => (
              <span
                key={lang}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-500 dark:text-gray-400"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: How it works ────────────────────────────── */}
      <div className="space-y-6">

        {/* How it works */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              How it works
            </h3>
          </div>

          <div className="space-y-3">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="flex gap-3.5 p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl"
              >
                <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-400 font-mono">{step}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={15} className="text-primary" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-0.5">{title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What you get */}
        <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-sm font-bold text-primary mb-3">What you get</p>
          <div className="space-y-2">
            {[
              "Recommended open-source license with rationale",
              "SPDX compatibility flags for every dependency",
              "Top monetization platforms ranked by fit score",
              "Auto-generated CREDITS.md if required",
              "Downloadable PDF + HTML audit report",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle size={13} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
