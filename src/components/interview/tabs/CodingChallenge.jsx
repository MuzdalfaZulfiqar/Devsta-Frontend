// import { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import axios from "axios";
// import { 
//   ArrowLeft, Play, Bot, Send, Loader2, Sun, Moon, 
//   CheckCircle, XCircle, Code2, Sparkles,
//   Copy, Check, Terminal, Maximize2, Minimize2,
//   Clock, Tag, AlertTriangle, List, Hash, FileText
// } from "lucide-react";

// export default function CodingChallenge({ challenge, onClose }) {
//   const [code, setCode] = useState(challenge?.starter_code || "");
//   const [language, setLanguage] = useState(challenge?.language || "python");
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState(null);
//   const [aiReview, setAiReview] = useState(null);
//   // const [activePanel, setActivePanel] = useState("problem");
//   // To this (challenge prop now carries .status):
// const [activePanel, setActivePanel] = useState(
//   challenge?.status === "reviewed" ? "review" : "problem"
// );
//   const [editorTheme, setEditorTheme] = useState("vs-dark");
//   const [fontSize, setFontSize] = useState(14);
//   const [isEditorExpanded, setIsEditorExpanded] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [output, setOutput] = useState(null);

//   const token = localStorage.getItem("devsta_token");

//   // Auto-save code to localStorage
//   useEffect(() => {
//     const saveTimeout = setTimeout(() => {
//       if (code && challenge?._id) {
//         localStorage.setItem(`code_${challenge._id}`, code);
//       }
//     }, 1000);
//     return () => clearTimeout(saveTimeout);
//   }, [code, challenge]);

//   // Load saved code on mount
//   useEffect(() => {
//     if (challenge?._id) {
//       const savedCode = localStorage.getItem(`code_${challenge._id}`);
//       if (savedCode) setCode(savedCode);
//     }
//   }, [challenge]);

//   if (!challenge) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
//         <div className="text-center">
//           <Code2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//           <p className="text-gray-500 dark:text-gray-400">No challenge selected</p>
//         </div>
//       </div>
//     );
//   }

//   const runTests = async () => {
//     setLoading(true);
//     setOutput(null);
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/roadmap/submit-solution",
//         {
//           challengeId: challenge._id,
//           code,
//           language,
//           testOnly: true,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setResults(res.data.results);
//       setOutput(res.data.output || null);
//       setActivePanel("results");
//     } catch (err) {
//       alert(err.response?.data?.message || "Execution failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const getAiReview = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const res = await axios.post(
//   //       "http://localhost:5000/api/roadmap/ai-review",
//   //       {
//   //         code,
//   //         language,
//   //         problem: challenge.description,
//   //         title: challenge.title,
//   //       },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     setAiReview(res.data.review);
//   //     setActivePanel("review");
//   //   } catch (err) {
//   //     alert("AI review failed");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const getAiReview = async () => {
//   setLoading(true);
//   try {
//     const res = await axios.post(
//       "http://localhost:5000/api/roadmap/ai-review",
//       {
//         code,
//         language,
//         problem: challenge.description,
//         title: challenge.title,
//         challengeId: challenge._id,  // ← add this
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setAiReview(res.data.review);
//     setActivePanel("review");
//   } catch (err) {
//     alert("AI review failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   const submitSolution = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/roadmap/submit-solution",
//         {
//           challengeId: challenge._id,
//           code,
//           language,
//           testOnly: false,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setResults(res.data.results);
//       setActivePanel("results");
//       alert("✅ Solution submitted successfully!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyCode = () => {
//     navigator.clipboard.writeText(code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const getLanguageDisplay = () => {
//     const languages = {
//       python: "Python",
//       javascript: "JavaScript",
//       java: "Java",
//       cpp: "C++",
//       go: "Go",
//       rust: "Rust"
//     };
//     return languages[language] || language;
//   };

//   const passedTests = results?.testResults?.filter(t => t.passed).length || 0;
//   const totalTests = results?.testResults?.length || 0;

//   // Helper function to get difficulty color
//   const getDifficultyColor = (difficulty) => {
//     switch(difficulty?.toLowerCase()) {
//       case 'easy': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400';
//       case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400';
//       case 'hard': return 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400';
//       default: return 'text-gray-600 bg-gray-50 dark:bg-gray-500/10 dark:text-gray-400';
//     }
//   };

//   // Add near the top with other useEffects
// useEffect(() => {
//   if (!challenge?._id) return;
//   const fetchLastSubmission = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/roadmap/submissions/${challenge._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const subs = res.data.submissions || [];
//       // Load the last code if no localStorage save exists
//       const savedCode = localStorage.getItem(`code_${challenge._id}`);
//       if (!savedCode && subs[0]?.code) {
//         setCode(subs[0].code);
//       }
//       // Load last AI review if one exists
//       const reviewSub = subs.find(s => s.aiReview);
//       if (reviewSub) {
//         setAiReview(reviewSub.aiReview);
//       }
//     } catch (err) {
//       console.error("Failed to load previous submission:", err);
//     }
//   };
//   fetchLastSubmission();
// }, [challenge?._id]);

//   return (
//     <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
//       {/* Top Header */}
//       <div className="bg-white dark:bg-gray-900 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={onClose}
//             className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Roadmap</span>
//           </button>

//           <div className="flex-1 px-6">
//             <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
//               {challenge.title}
//             </h1>
//             <div className="flex justify-center gap-3 mt-2">
//               <span className={`text-sm px-3 py-1 rounded-full font-medium ${getDifficultyColor(challenge.difficulty)}`}>
//                 {challenge.difficulty || "Intermediate"}
//               </span>
//               <span className="text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
//                 {getLanguageDisplay()}
//               </span>
//               {challenge.expected_time_minutes && (
//                 <span className="text-sm px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-1">
//                   <Clock className="w-3 h-3" />
//                   {challenge.expected_time_minutes} min
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Right Side Controls */}
//           <div className="flex items-center gap-3">
//             {/* Theme Switch */}
//             <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
//               <button
//                 onClick={() => setEditorTheme("light")}
//                 className={`p-2 rounded-md transition-all ${
//                   editorTheme === "light" 
//                     ? "bg-white shadow-sm text-gray-900" 
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 <Sun className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setEditorTheme("vs-dark")}
//                 className={`p-2 rounded-md transition-all ${
//                   editorTheme === "vs-dark" 
//                     ? "bg-gray-800 shadow-sm text-white" 
//                     : "text-gray-500 hover:text-gray-400"
//                 }`}
//               >
//                 <Moon className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Font Size */}
//             <div className="hidden md:flex items-center gap-2">
//               <span className="text-sm text-gray-500">A</span>
//               <input
//                 type="range"
//                 min="12"
//                 max="20"
//                 value={fontSize}
//                 onChange={(e) => setFontSize(Number(e.target.value))}
//                 className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
//               />
//               <span className="text-sm text-gray-500">A</span>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2">
//               <button
//                 onClick={runTests}
//                 disabled={loading}
//                 className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
//               >
//                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
//                 <span>Run</span>
//               </button>

//               <button
//                 onClick={getAiReview}
//                 disabled={loading}
//                 className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
//               >
//                 <Sparkles className="w-4 h-4" /> 
//                 <span>Review</span>
//               </button>

//               <button
//                 onClick={submitSolution}
//                 disabled={loading}
//                 className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
//               >
//                 <Send className="w-4 h-4" /> 
//                 <span>Submit</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Subtle divider */}
//       <div className="h-px bg-gray-200 dark:bg-gray-700" />

//       {/* Main Content */}
//      <div className={`flex ${isEditorExpanded ? 'flex-col' : ''} gap-4 p-4 flex-1 min-h-0 transition-all duration-300`}>
//        {/* Left Panel */}
//   <div className={`
//     ${isEditorExpanded ? 'hidden' : 'w-2/5'} 
//     bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 
//     overflow-hidden flex flex-col
//     max-h-[calc(100vh-190px)] self-start
//   `}>
//     {/* Tab Header */}
//     <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2">
//       <div className="flex gap-2">
//         {[
//           { id: "problem", label: "Problem", icon: <FileText className="w-4 h-4" /> },
//           { id: "results", label: "Results", icon: <Terminal className="w-4 h-4" />, badge: results ? `${passedTests}/${totalTests}` : null },
//           { id: "review", label: "AI Review", icon: <Sparkles className="w-4 h-4" /> }
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActivePanel(tab.id)}
//             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//               activePanel === tab.id 
//                 ? "bg-primary text-white shadow-sm" 
//                 : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//             }`}
//           >
//             {tab.icon}
//             {tab.label}
//             {tab.badge && (
//               <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/20">
//                 {tab.badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>

//         <div className="flex-1 overflow-auto p-4 min-h-0">
//             {activePanel === "problem" && (
//               <div className="space-y-6">
//                 {/* Problem Description */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//                     <FileText className="w-4 h-4 text-primary" />
//                     Description
//                   </h3>
//                   <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
//                     {challenge.description}
//                   </div>
//                 </div>

//                 {/* Tags/Skills */}
//                 {challenge.tags && challenge.tags.length > 0 && (
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//                       <Tag className="w-4 h-4 text-primary" />
//                       Skills & Tags
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                       {challenge.tags.map((tag, idx) => (
//                         <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Test Cases */}
//                 {challenge.test_cases && challenge.test_cases.length > 0 && (
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//                       <List className="w-4 h-4 text-primary" />
//                       Test Cases ({challenge.test_cases.length})
//                     </h3>
//                     <div className="space-y-3">
//                       {challenge.test_cases.map((tc, idx) => (
//                         <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
//                           <div className="flex items-center gap-2 mb-2">
//                             <Hash className="w-3 h-3 text-gray-400" />
//                             <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Test Case {idx + 1}</span>
//                           </div>
//                           <div className="space-y-1 text-xs">
//                             <p><span className="font-semibold text-gray-700 dark:text-gray-300">Input:</span> <code className="text-primary">{tc.input || '(no input)'}</code></p>
//                             <p><span className="font-semibold text-gray-700 dark:text-gray-300">Expected Output:</span> <code className="text-emerald-600 dark:text-emerald-400">{tc.expected_output}</code></p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Constraints */}
//                 {challenge.constraints && (
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//                       <AlertTriangle className="w-4 h-4 text-primary" />
//                       Constraints
//                     </h3>
//                     <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3 border border-amber-200 dark:border-amber-500/20">
//                       <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap">
//                         {challenge.constraints}
//                       </p>
//                     </div>
//                   </div>
//                 )}

               
//               </div>
//             )}
// {activePanel === "results" && results && (
//   <div className="space-y-6 p-1 animate-in fade-in duration-500">
//     {/* Stats Cards */}
//     <div className="grid grid-cols-3 gap-3">
//       {[
//         { 
//           label: "Passed", 
//           value: `${passedTests}/${totalTests}`, 
//           bg: "bg-indigo-50/50 dark:bg-indigo-500/5",
//           border: "border-indigo-100 dark:border-indigo-500/20",
//           text: "text-indigo-600 dark:text-indigo-400" 
//         },
//         { 
//           label: "Score", 
//           value: `${Math.round((passedTests / totalTests) * 100)}%`, 
//           bg: "bg-slate-50 dark:bg-slate-800/50",
//           border: "border-slate-200 dark:border-slate-700",
//           text: "text-slate-700 dark:text-slate-200" 
//         },
//         { 
//           label: "Status", 
//           value: passedTests === totalTests ? "Accepted" : "Partial", 
//           bg: passedTests === totalTests ? "bg-emerald-50/50 dark:bg-emerald-500/5" : "bg-rose-50/50 dark:bg-rose-500/5",
//           border: passedTests === totalTests ? "border-emerald-100 dark:border-emerald-500/20" : "border-rose-100 dark:border-rose-500/20",
//           text: passedTests === totalTests ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400" 
//         },
//       ].map((s) => (
//         <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-3 transition-all`}>
//           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{s.label}</p>
//           <p className={`text-xl font-bold tracking-tight tabular-nums ${s.text}`}>{s.value}</p>
//         </div>
//       ))}
//     </div>

//     {/* Progress Bar */}
//     <div className="px-1">
//       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
//         <div
//           className={`h-full transition-all duration-1000 ease-out rounded-full ${
//             passedTests === totalTests ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-indigo-400 to-violet-500"
//           }`}
//           style={{ width: `${(passedTests / totalTests) * 100}%` }}
//         />
//       </div>
//     </div>

//     {/* Test Cases */}
//     <div className="space-y-3">
//       <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Detailed Analysis</h3>
//       <div className="grid gap-3">
//         {results.testResults.map((tc, i) => (
//           <div key={i} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-hover hover:shadow-md">
//             {/* Header */}
//             <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
//               tc.passed ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/10" : "bg-rose-50/30 dark:bg-rose-500/5 border-rose-100/50 dark:border-rose-500/10"
//             }`}>
//               <div className="flex items-center gap-3">
//                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
//                    tc.passed 
//                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" 
//                    : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30"
//                 }`}>
//                   CASE {i + 1}
//                 </span>
//                 <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
//                   {tc.passed ? "Check Passed" : "Check Failed"}
//                 </span>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-4 grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/50">
//               <div className="space-y-1.5">
//                 <span className="text-[9px] font-bold text-slate-400 uppercase">Expected Output</span>
//                 <pre className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-tight">
//                   {tc.expected}
//                 </pre>
//               </div>
//               <div className="space-y-1.5">
//                 <span className="text-[9px] font-bold text-slate-400 uppercase">Actual Output</span>
//                 <pre className={`p-2.5 rounded-lg border text-[11px] font-mono leading-tight ${
//                   tc.passed 
//                   ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400" 
//                   : "bg-rose-50/50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400"
//                 }`}>
//                   {tc.actual}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>

//     {/* Console Output (Enhanced with Slate-950) */}
//     {output && (
//       <div className="space-y-2">
//         <div className="flex items-center gap-2 px-1">
//           <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
//           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logs</span>
//         </div>
//         <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 shadow-2xl">
//           <code className="text-[11px] font-mono text-indigo-300/90 leading-relaxed block overflow-auto max-h-40 scrollbar-thin scrollbar-thumb-slate-700">
//             <span className="text-slate-600 mr-2 select-none">❯</span>
//             {output}
//           </code>
//         </div>
//       </div>
//     )}
//   </div>
// )}

//             {/* {activePanel === "review" && aiReview && (
//               <div className="space-y-4">
//                 <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg p-5">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Sparkles className="w-5 h-5 text-violet-500" />
//                     <h3 className="text-base font-semibold text-gray-900 dark:text-white">AI Code Review</h3>
//                   </div>
//                   <div className="prose prose-sm dark:prose-invert max-w-none">
//                     <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-base">
//                       {aiReview}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )} */}

//             {activePanel === "review" && aiReview && (
//   <div className="space-y-4 p-1 animate-in fade-in duration-500">
//     {/* Header */}
//     <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
//       <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
//         <Sparkles className="w-4 h-4 text-violet-500" />
//       </div>
//       <div>
//         <p className="text-sm font-bold text-gray-900 dark:text-white">AI Code Review</p>
//         <p className="text-[10px] text-gray-400 uppercase tracking-widest">Senior Staff Engineer Analysis</p>
//       </div>
//     </div>

//     {/* Parsed sections */}
//     {aiReview.split(/###\s+\d+\.\s+/).filter(Boolean).map((section, i) => {
//       const lines = section.trim().split("\n");
//       const heading = lines[0].trim();
//       const body = lines.slice(1).join("\n").trim();

//       const sectionColors = [
//         { bg: "bg-emerald-50/50 dark:bg-emerald-500/5", border: "border-emerald-100 dark:border-emerald-500/20", icon: "text-emerald-500", label: "text-emerald-700 dark:text-emerald-400" },
//         { bg: "bg-rose-50/50 dark:bg-rose-500/5", border: "border-rose-100 dark:border-rose-500/20", icon: "text-rose-500", label: "text-rose-700 dark:text-rose-400" },
//         { bg: "bg-blue-50/50 dark:bg-blue-500/5", border: "border-blue-100 dark:border-blue-500/20", icon: "text-blue-500", label: "text-blue-700 dark:text-blue-400" },
//         { bg: "bg-amber-50/50 dark:bg-amber-500/5", border: "border-amber-100 dark:border-amber-500/20", icon: "text-amber-500", label: "text-amber-700 dark:text-amber-400" },
//       ];

//       const color = sectionColors[i % sectionColors.length];

//       return (
//         <div key={i} className={`rounded-xl border ${color.bg} ${color.border} p-4 space-y-2`}>
//           <p className={`text-xs font-bold uppercase tracking-widest ${color.label}`}>{heading}</p>
//           <div className="space-y-1.5">
//             {body.split("\n").filter(Boolean).map((line, j) => {
//               const clean = line.replace(/^[-*]\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1").trim();
//               if (!clean) return null;
//               return (
//                 <div key={j} className="flex gap-2 items-start">
//                   <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.icon} bg-current`} />
//                   <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{clean}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       );
//     })}

//     {/* Final Score */}
//     {aiReview.match(/\*\*Final Score:\s*(\d+)\/100\*\*/) && (() => {
//       const score = parseInt(aiReview.match(/\*\*Final Score:\s*(\d+)\/100\*\*/)[1]);
//       const scoreColor = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";
//       const barColor = score >= 80 ? "from-emerald-400 to-teal-500" : score >= 60 ? "from-amber-400 to-orange-500" : "from-rose-400 to-red-500";
//       return (
//         <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
//           <div className="flex items-center justify-between mb-3">
//             <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Score</p>
//             <p className={`text-2xl font-black tabular-nums ${scoreColor}`}>{score}<span className="text-sm text-slate-400">/100</span></p>
//           </div>
//           <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
//             <div
//               className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000`}
//               style={{ width: `${score}%` }}
//             />
//           </div>
//         </div>
//       );
//     })()}
//   </div>
// )}
//           </div>
//         </div>

//     <div className={`
//         ${isEditorExpanded ? 'flex-1' : 'flex-1'} 
//         flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800
//         max-h-[calc(100vh-190px)]   /* ← Key fix for editor */
//       `}>
//     {/* Editor Header */}
//           <div className="bg-gray-800 px-3 py-2 flex items-center justify-end border-b border-gray-700">
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={copyCode}
//                 className="p-1.5 hover:bg-gray-700 rounded transition-colors"
//                 title="Copy code"
//               >
//                 {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
//               </button>
//               <button
//                 onClick={() => setIsEditorExpanded(!isEditorExpanded)}
//                 className="p-1.5 hover:bg-gray-700 rounded transition-colors"
//                 title={isEditorExpanded ? "Minimize" : "Maximize"}
//               >
//                 {isEditorExpanded ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
//               </button>
//             </div>
//           </div>

//           {/* Monaco Editor */}
//           <div className="flex-1 min-h-0">
//               <Editor
//                 height="100%"
//                 language={language}
//                 value={code}
//                 onChange={(value) => setCode(value || "")}
//                 theme={editorTheme}
//                 options={{
//                   fontSize: fontSize,
//                   minimap: { enabled: false },
//                   scrollBeyondLastLine: false,
//                   wordWrap: "on",
//                   automaticLayout: true,
//                   lineNumbers: "on",
//                   renderWhitespace: "selection",
//                   tabSize: 2,
//                   fontFamily: "'Fira Code', 'Cascadia Code', monospace",
//                   fontLigatures: true,
//                 }}
//               />
//           </div>
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col items-center gap-3 shadow-2xl">
//             <Loader2 className="w-8 h-8 animate-spin text-primary" />
//             <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Processing your code...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/interview/tabs/CodingChallenge.jsx
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { 
  ArrowLeft, Play, Bot, Send, Loader2, Sun, Moon, 
  CheckCircle, XCircle, Code2, Sparkles,
  Copy, Check, Terminal, Maximize2, Minimize2,
  Clock, Tag, AlertTriangle, List, Hash, FileText
} from "lucide-react";
import SuccessModal from "../../SuccessModal";
import ErrorModal from "../../ErrorModal";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CodingChallenge({ challenge, onClose }) {
  const navigate = useNavigate();
  const [code, setCode] = useState(challenge?.starter_code || "");
  const [language, setLanguage] = useState(challenge?.language || "python");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [aiReview, setAiReview] = useState(null);
  const [activePanel, setActivePanel] = useState(
    challenge?.status === "reviewed" ? "review" : "problem"
  );
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState(null);

  // Modal state
  const [successModal, setSuccessModal] = useState({ open: false, message: "" });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  const showSuccess = (message) => setSuccessModal({ open: true, message });
  const showError = (message) => setErrorModal({ open: true, message });

  const token = localStorage.getItem("devsta_token");

  // Auto-save code to localStorage
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (code && challenge?._id) {
        localStorage.setItem(`code_${challenge._id}`, code);
      }
    }, 1000);
    return () => clearTimeout(saveTimeout);
  }, [code, challenge]);

  // Load saved code on mount
  useEffect(() => {
    if (challenge?._id) {
      const savedCode = localStorage.getItem(`code_${challenge._id}`);
      if (savedCode) setCode(savedCode);
    }
  }, [challenge]);

  // Load previous submission
  useEffect(() => {
    if (!challenge?._id) return;
    const fetchLastSubmission = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/roadmap/submissions/${challenge._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const subs = res.data.submissions || [];
        const savedCode = localStorage.getItem(`code_${challenge._id}`);
        if (!savedCode && subs[0]?.code) {
          setCode(subs[0].code);
        }
        const reviewSub = subs.find(s => s.aiReview);
        if (reviewSub) {
          setAiReview(reviewSub.aiReview);
        }
      } catch (err) {
        console.error("Failed to load previous submission:", err);
      }
    };
    fetchLastSubmission();
  }, [challenge?._id]);

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Code2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No challenge selected</p>
        </div>
      </div>
    );
  }

  const runTests = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/submit-solution",
        { challengeId: challenge._id, code, language, testOnly: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.results);
      setOutput(res.data.output || null);
      setActivePanel("results");
    } catch (err) {
      showError(err.response?.data?.message || "Execution failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAiReview = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/ai-review",
        {
          code,
          language,
          problem: challenge.description,
          title: challenge.title,
          challengeId: challenge._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiReview(res.data.review);
      setActivePanel("review");
    } catch (err) {
      showError("AI review failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitSolution = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/submit-solution",
        { challengeId: challenge._id, code, language, testOnly: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.results);
      setActivePanel("results");
      showSuccess("Solution submitted successfully! Keep up the great work.");
    } catch (err) {
      showError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageDisplay = () => {
    const languages = { python: "Python", javascript: "JavaScript", java: "Java", cpp: "C++", go: "Go", rust: "Rust" };
    return languages[language] || language;
  };

  const passedTests = results?.testResults?.filter(t => t.passed).length || 0;
  const totalTests = results?.testResults?.length || 0;

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400';
      case 'hard': return 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* System modals */}
      <SuccessModal
        open={successModal.open}
        message={successModal.message}
        onClose={() => 
          {setSuccessModal({ open: false, message: "" });
        } 
      }
      />
      <ErrorModal
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />

      {/* Top Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Roadmap</span>
          </button>

          <div className="flex-1 px-6">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              {challenge.title}
            </h1>
            <div className="flex justify-center gap-3 mt-2">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty || "Intermediate"}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {getLanguageDisplay()}
              </span>
              {challenge.expected_time_minutes && (
                <span className="text-sm px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {challenge.expected_time_minutes} min
                </span>
              )}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setEditorTheme("light")}
                className={`p-2 rounded-md transition-all ${editorTheme === "light" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditorTheme("vs-dark")}
                className={`p-2 rounded-md transition-all ${editorTheme === "vs-dark" ? "bg-gray-800 shadow-sm text-white" : "text-gray-500 hover:text-gray-400"}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-500">A</span>
              <input
                type="range" min="12" max="20" value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-sm text-gray-500">A</span>
            </div>

            <div className="flex gap-2">
              <button onClick={runTests} disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Run</span>
              </button>
              <button onClick={getAiReview} disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50">
                <Sparkles className="w-4 h-4" />
                <span>Review</span>
              </button>
              <button onClick={submitSolution} disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50">
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-700" />

      {/* Main Content */}
      <div className={`flex ${isEditorExpanded ? 'flex-col' : ''} gap-4 p-4 flex-1 min-h-0 transition-all duration-300`}>
        {/* Left Panel */}
        <div className={`
          ${isEditorExpanded ? 'hidden' : 'w-2/5'} 
          bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 
          overflow-hidden flex flex-col max-h-[calc(100vh-190px)] self-start
        `}>
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2">
            <div className="flex gap-2">
              {[
                { id: "problem", label: "Problem", icon: <FileText className="w-4 h-4" /> },
                { id: "results", label: "Results", icon: <Terminal className="w-4 h-4" />, badge: results ? `${passedTests}/${totalTests}` : null },
                { id: "review", label: "AI Review", icon: <Sparkles className="w-4 h-4" /> }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActivePanel(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activePanel === tab.id ? "bg-primary text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}>
                  {tab.icon}
                  {tab.label}
                  {tab.badge && <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/20">{tab.badge}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 min-h-0">
            {activePanel === "problem" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Description
                  </h3>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {challenge.description}
                  </div>
                </div>

                {challenge.tags && challenge.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> Skills & Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {challenge.test_cases && challenge.test_cases.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <List className="w-4 h-4 text-primary" /> Test Cases ({challenge.test_cases.length})
                    </h3>
                    <div className="space-y-3">
                      {challenge.test_cases.map((tc, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Hash className="w-3 h-3 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Test Case {idx + 1}</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <p><span className="font-semibold text-gray-700 dark:text-gray-300">Input:</span> <code className="text-primary">{tc.input || '(no input)'}</code></p>
                            <p><span className="font-semibold text-gray-700 dark:text-gray-300">Expected Output:</span> <code className="text-emerald-600 dark:text-emerald-400">{tc.expected_output}</code></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {challenge.constraints && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-primary" /> Constraints
                    </h3>
                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3 border border-amber-200 dark:border-amber-500/20">
                      <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap">{challenge.constraints}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activePanel === "results" && results && (
              <div className="space-y-6 p-1 animate-in fade-in duration-500">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Passed", value: `${passedTests}/${totalTests}`, bg: "bg-indigo-50/50 dark:bg-indigo-500/5", border: "border-indigo-100 dark:border-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400" },
                    { label: "Score", value: `${Math.round((passedTests / totalTests) * 100)}%`, bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700", text: "text-slate-700 dark:text-slate-200" },
                    { label: "Status", value: passedTests === totalTests ? "Accepted" : "Partial", bg: passedTests === totalTests ? "bg-emerald-50/50 dark:bg-emerald-500/5" : "bg-rose-50/50 dark:bg-rose-500/5", border: passedTests === totalTests ? "border-emerald-100 dark:border-emerald-500/20" : "border-rose-100 dark:border-rose-500/20", text: passedTests === totalTests ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400" },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-3`}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{s.label}</p>
                      <p className={`text-xl font-bold tracking-tight tabular-nums ${s.text}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="px-1">
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ease-out rounded-full ${passedTests === totalTests ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-indigo-400 to-violet-500"}`}
                      style={{ width: `${(passedTests / totalTests) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Detailed Analysis</h3>
                  <div className="grid gap-3">
                    {results.testResults.map((tc, i) => (
                      <div key={i} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className={`flex items-center justify-between px-4 py-2.5 border-b ${tc.passed ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/10" : "bg-rose-50/30 dark:bg-rose-500/5 border-rose-100/50 dark:border-rose-500/10"}`}>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tc.passed ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30"}`}>
                              CASE {i + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{tc.passed ? "Check Passed" : "Check Failed"}</span>
                          </div>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Expected Output</span>
                            <pre className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-tight">{tc.expected}</pre>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Actual Output</span>
                            <pre className={`p-2.5 rounded-lg border text-[11px] font-mono leading-tight ${tc.passed ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400" : "bg-rose-50/50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400"}`}>{tc.actual}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {output && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logs</span>
                    </div>
                    <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 shadow-2xl">
                      <code className="text-[11px] font-mono text-indigo-300/90 leading-relaxed block overflow-auto max-h-40">
                        <span className="text-slate-600 mr-2 select-none">❯</span>
                        {output}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activePanel === "review" && aiReview && (
              <div className="space-y-4 p-1 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">AI Code Review</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Senior Staff Engineer Analysis</p>
                  </div>
                </div>

                {aiReview.split(/###\s+\d+\.\s+/).filter(Boolean).map((section, i) => {
                  const lines = section.trim().split("\n");
                  const heading = lines[0].trim();
                  const body = lines.slice(1).join("\n").trim();
                  const sectionColors = [
                    { bg: "bg-emerald-50/50 dark:bg-emerald-500/5", border: "border-emerald-100 dark:border-emerald-500/20", icon: "text-emerald-500", label: "text-emerald-700 dark:text-emerald-400" },
                    { bg: "bg-rose-50/50 dark:bg-rose-500/5", border: "border-rose-100 dark:border-rose-500/20", icon: "text-rose-500", label: "text-rose-700 dark:text-rose-400" },
                    { bg: "bg-blue-50/50 dark:bg-blue-500/5", border: "border-blue-100 dark:border-blue-500/20", icon: "text-blue-500", label: "text-blue-700 dark:text-blue-400" },
                    { bg: "bg-amber-50/50 dark:bg-amber-500/5", border: "border-amber-100 dark:border-amber-500/20", icon: "text-amber-500", label: "text-amber-700 dark:text-amber-400" },
                  ];
                  const color = sectionColors[i % sectionColors.length];
                  return (
                    <div key={i} className={`rounded-xl border ${color.bg} ${color.border} p-4 space-y-2`}>
                      <p className={`text-xs font-bold uppercase tracking-widest ${color.label}`}>{heading}</p>
                      <div className="space-y-1.5">
                        {body.split("\n").filter(Boolean).map((line, j) => {
                          const clean = line.replace(/^[-*]\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1").trim();
                          if (!clean) return null;
                          return (
                            <div key={j} className="flex gap-2 items-start">
                              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.icon} bg-current`} />
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{clean}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {aiReview.match(/\*\*Final Score:\s*(\d+)\/100\*\*/) && (() => {
                  const score = parseInt(aiReview.match(/\*\*Final Score:\s*(\d+)\/100\*\*/)[1]);
                  const scoreColor = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";
                  const barColor = score >= 80 ? "from-emerald-400 to-teal-500" : score >= 60 ? "from-amber-400 to-orange-500" : "from-rose-400 to-red-500";
                  return (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Score</p>
                        <p className={`text-2xl font-black tabular-nums ${scoreColor}`}>{score}<span className="text-sm text-slate-400">/100</span></p>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Editor Panel */}
        <div className={`
          ${isEditorExpanded ? 'flex-1' : 'flex-1'} 
          flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800
          max-h-[calc(100vh-190px)]
        `}>
          <div className="bg-gray-800 px-3 py-2 flex items-center justify-end border-b border-gray-700">
            <div className="flex items-center gap-2">
              <button onClick={copyCode} className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Copy code">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
              <button onClick={() => setIsEditorExpanded(!isEditorExpanded)} className="p-1.5 hover:bg-gray-700 rounded transition-colors" title={isEditorExpanded ? "Minimize" : "Maximize"}>
                {isEditorExpanded ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={editorTheme}
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                lineNumbers: "on",
                renderWhitespace: "selection",
                tabSize: 2,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col items-center gap-3 shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Processing your code...</p>
          </div>
        </div>
      )}
    </div>
  );
}
