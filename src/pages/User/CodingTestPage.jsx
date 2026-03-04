// // src/pages/User/CodingTestPage.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom"; // ← now using real jobId
// import CodeEditor from "../../components/coding/CodeEditor";
// import useAssessmentSession from "../../hooks/useAssessmentSession";
// import AssessmentTimer from "../../components/assessment/AssessmentTimer";
// import AssessmentGuard from "../../components/assessment/AssessmentGuard";

// export default function CodingTestPage() {
//   const { jobId } = useParams(); // ← real jobId from URL (e.g. /coding-test/64f8a...)

//   const { 
//     session, 
//     timeLeft, 
//     submitted, 
//     handleSubmit, 
//     error, 
//     loading 
//   } = useAssessmentSession(jobId);

//   const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
//   const [editorTheme, setEditorTheme] = useState("vs-dark");
//   const [problemCollapsed, setProblemCollapsed] = useState(false);
//   const [outputCollapsed, setOutputCollapsed] = useState(false);
//   const [outputHeight, setOutputHeight] = useState(220);
//   const resizerRef = useRef(null);
//   const [activeTab, setActiveTab] = useState("terminal");

//   // Per-challenge state (code, language, output, results)
//   const [challengeStates, setChallengeStates] = useState({});
//   const [isReady, setIsReady] = useState(false);

//   // Initialize state when real session loads
//   useEffect(() => {
//     if (session?.challenges) {
//       const initialStates = {};
//       session.challenges.forEach((ch) => {
//         initialStates[ch.challengeId] = {
//           code: "// Write your solution here...\n",
//           language: "javascript",
//           output: "",
//           testResults: [],
//           summary: null,
//         };
//       });
//       setChallengeStates(initialStates);
//     }
//   }, [session?.challenges]);

//   const currentChallenge = session?.challenges?.[currentChallengeIndex] || null;
//   const currentState = currentChallenge ? challengeStates[currentChallenge.challengeId] || {} : {};

//   const updateCurrentState = (updates) => {
//     if (!currentChallenge) return;
//     setChallengeStates((prev) => ({
//       ...prev,
//       [currentChallenge.challengeId]: {
//         ...(prev[currentChallenge.challengeId] || {}),
//         ...updates,
//       },
//     }));
//   };

//   // Resizer logic (unchanged)
//   useEffect(() => {
//     const resizer = resizerRef.current;
//     if (!resizer) return;

//     let startY = 0;
//     let startHeight = 0;

//     const onMouseMove = (e) => {
//       if (outputCollapsed) return;
//       const dy = e.clientY - startY;
//       let newHeight = startHeight - dy;
//       newHeight = Math.max(140, Math.min(900, newHeight));
//       setOutputHeight(newHeight);
//     };

//     const onMouseUp = () => {
//       document.removeEventListener("mousemove", onMouseMove);
//       document.removeEventListener("mouseup", onMouseUp);
//     };

//     const onMouseDown = (e) => {
//       if (outputCollapsed) return;
//       startY = e.clientY;
//       startHeight = outputHeight;
//       document.addEventListener("mousemove", onMouseMove);
//       document.addEventListener("mouseup", onMouseUp);
//     };

//     resizer.addEventListener("mousedown", onMouseDown);
//     return () => resizer.removeEventListener("mousedown", onMouseDown);
//   }, [outputCollapsed]);

//   const toggleOutputCollapsed = () => {
//     if (outputCollapsed) setOutputHeight((prev) => Math.max(prev, 180));
//     setOutputCollapsed(!outputCollapsed);
//   };

//   const toggleTheme = () => {
//     const next = editorTheme === "vs-dark" ? "light" : "vs-dark";
//     setEditorTheme(next);
//     localStorage.setItem("editorTheme", next);
//   };

//   const languageMap = {
//     javascript: 63,
//     python: 71,
//     cpp: 54,
//     java: 62,
//   };

//   const handleRunCode = async () => {
//     if (!currentChallenge) return;

//     updateCurrentState({ output: "Running code...\n" });
//     if (outputCollapsed) setOutputCollapsed(false);

//     try {
//       const response = await fetch("http://localhost:5000/api/developer/evaluate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           code: currentState.code,
//           language_id: languageMap[currentState.language],
//           testCases: currentChallenge.testCases,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Evaluation failed");

//       const resultsWithPassFlag = data.testCases.map((tc) => ({
//         ...tc,
//         passed: (tc.user_output || "").trim() === (tc.expected_output || "").trim(),
//       }));

//       updateCurrentState({
//         testResults: resultsWithPassFlag,
//         summary: {
//           correctness: data.correctness,
//           outcome: data.outcome,
//           avgTime: data.avgTime || 0,
//         },
//       });

//       const formatted = resultsWithPassFlag
//         .map(
//           (tc, i) =>
//             `Test Case ${i + 1}:\n` +
//             `Input:\n${tc.input}\n` +
//             `Expected:\n${tc.expected_output}\n` +
//             `Your Output:\n${tc.user_output}\n` +
//             `Time: ${tc.exec_time || "—"}s\n` +
//             `Result: ${tc.passed ? "PASS ✅" : "FAIL ❌"}`
//         )
//         .join("\n\n");

//       updateCurrentState({
//         output: `${formatted}\n\n------------------------------------\n` +
//           `Correctness: ${Math.round(data.correctness * 100)}%\n` +
//           `Outcome: ${data.outcome}\n` +
//           `Average Time: ${data.avgTime || 0}s`,
//       });
//     } catch (err) {
//       updateCurrentState({
//         output: `Error: ${err.message || "Something went wrong"}\n`,
//         summary: null,
//       });
//     }
//   };

//   // ─────────────────────────────────────────────
//   // Loading / Error / Submitted States
//   // ─────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-50 text-xl">
//         Loading your coding test...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-red-50 text-red-700 text-xl font-medium">
//         Error: {error}
//       </div>
//     );
//   }

//   if (submitted) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-green-50 text-green-700 text-2xl font-bold">
//         Test Submitted Successfully ✓
//       </div>
//     );
//   }

//   if (!session?.challenges?.length) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-50 text-xl text-red-600">
//         No coding challenges found for this test.
//       </div>
//     );
//   }

//   // ─────────────────────────────────────────────
//   // Main UI (real data)
//   // ─────────────────────────────────────────────
//   return (
//     <div className="h-screen flex flex-col bg-gray-50 font-sans">
//       {!isReady ? (
//         <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] text-white">
//           <div className="text-center max-w-3xl p-16 bg-gray-900 rounded-3xl border-4 border-red-700 shadow-2xl">
//             <h1 className="text-5xl font-extrabold mb-12 text-red-500">
//               FINAL TEST RULES
//             </h1>
//             <ul className="text-2xl mb-12 space-y-6 text-left max-w-2xl mx-auto">
//               <li>• You will be forced into fullscreen mode</li>
//               <li>• <strong>Exiting fullscreen even once ends the test immediately</strong></li>
//               <li>• Paste, copy, right-click, print are completely blocked</li>
//               <li>• Tab switching or minimizing ends the test</li>
//               <li>• This session is monitored — no second chances</li>
//             </ul>
//             <button
//               onClick={() => setIsReady(true)}
//               className="bg-red-700 hover:bg-red-900 px-20 py-8 rounded-2xl text-3xl font-bold transition transform hover:scale-105"
//             >
//               I UNDERSTAND – START TEST
//             </button>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Header */}
//           <header className="bg-white border-b px-4 py-3 flex items-center gap-4 shadow-sm z-10">
//             <button
//               onClick={() => setProblemCollapsed(!problemCollapsed)}
//               className="px-4 py-2 text-sm border rounded hover:bg-gray-100 flex items-center gap-2"
//             >
//               {problemCollapsed ? "Show Problem" : "Hide Problem"}
//               <span className="text-xs opacity-70">{problemCollapsed ? "↓" : "↑"}</span>
//             </button>

//             {!problemCollapsed && (
//               <h1 className="text-lg font-bold text-blue-700 truncate flex-1">
//                 {currentChallenge?.title || "Coding Challenge"}
//               </h1>
//             )}

//             <div className="flex items-center gap-4 ml-auto">
//               <select
//                 value={currentState.language || "javascript"}
//                 onChange={(e) => updateCurrentState({ language: e.target.value })}
//                 className="border rounded px-3 py-2 text-sm bg-white min-w-[140px]"
//               >
//                 <option value="javascript">JavaScript</option>
//                 <option value="python">Python</option>
//                 <option value="cpp">C++</option>
//                 <option value="java">Java</option>
//               </select>

//               <button
//                 onClick={toggleTheme}
//                 className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
//               >
//                 {editorTheme === "vs-dark" ? "Light" : "Dark"} Theme
//               </button>

//               <AssessmentTimer timeLeft={timeLeft} />

//               <button
//                 disabled={loading || !currentChallenge}
//                 onClick={handleRunCode}
//                 className={`px-6 py-2 rounded font-medium text-sm transition-colors ${
//                   loading
//                     ? "bg-gray-400 text-white cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 text-white"
//                 }`}
//               >
//                 {loading ? "Running..." : "Run Code"}
//               </button>

//               <button
//                 onClick={() => handleSubmit(false)}
//                 className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
//               >
//                 Submit Test
//               </button>
//             </div>
//           </header>

//           <AssessmentGuard
//             onViolation={(reason) => handleSubmit(true)}
//             maxViolations={1}
//           />

//           {/* Challenge Tabs */}
//           <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
//             {session.challenges.map((ch, idx) => (
//               <button
//                 key={ch.challengeId}
//                 onClick={() => setCurrentChallengeIndex(idx)}
//                 className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
//                   currentChallengeIndex === idx
//                     ? "bg-blue-50 border border-b-0 border-blue-300 text-blue-700 font-semibold"
//                     : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 {idx + 1}. {ch.title}
//                 <span className="ml-2 text-xs text-gray-500">({ch.timeLimit} min)</span>
//               </button>
//             ))}
//           </div>

//           {/* Main content – same as before, now using real data */}
//           <div className="flex flex-1 overflow-hidden">
//             {/* Problem Panel */}
//             <div
//               className={`bg-white border-r transition-all duration-300 overflow-hidden flex flex-col ${
//                 problemCollapsed ? "w-0 border-r-0" : "w-96 min-w-[320px] max-w-[45vw]"
//               }`}
//             >
//               {!problemCollapsed && currentChallenge && (
//                 <div className="flex-1 overflow-y-auto p-6 space-y-8">
//                   <section>
//                     <h2 className="font-bold text-xl mb-4 text-gray-800">Problem Description</h2>
//                     <p className="text-gray-700 leading-relaxed">
//                       {currentChallenge.problemStatement}
//                     </p>
//                   </section>

//                   <section>
//                     <h3 className="font-bold text-lg mb-3 text-gray-800">Constraints</h3>
//                     <ul className="list-disc pl-6 space-y-2 text-gray-600">
//                       {currentChallenge.constraints?.split("\n").map((line, i) => (
//                         <li key={i}>{line.trim()}</li>
//                       ))}
//                     </ul>
//                   </section>

//                   <section>
//                     <h3 className="font-bold text-lg mb-4 text-gray-800">Test Cases / Examples</h3>
//                     <div className="space-y-6">
//                       {currentChallenge.testCases?.map((tc, i) => (
//                         <div key={i} className="border rounded-lg p-5 bg-gray-50">
//                           <div className="font-semibold mb-3 text-gray-700">Example {i + 1}</div>
//                           <div className="mb-4">
//                             <div className="font-medium mb-2">Input:</div>
//                             <pre className="bg-white p-4 rounded border font-mono text-sm overflow-x-auto">
//                               {tc.input}
//                             </pre>
//                           </div>
//                           <div>
//                             <div className="font-medium mb-2">Expected Output:</div>
//                             <pre className="bg-white p-4 rounded border font-mono text-sm overflow-x-auto">
//                               {tc.expected_output}
//                             </pre>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </section>
//                 </div>
//               )}
//             </div>

//             {/* Editor + Output */}
//             <div className="flex-1 flex flex-col min-w-0">
//               <div className="flex-1 min-h-0 bg-gray-900">
//                 {currentChallenge ? (
//                   <CodeEditor
//                     language={currentState.language || "javascript"}
//                     value={currentState.code || ""}
//                     onChange={(newCode) => updateCurrentState({ code: newCode })}
//                     editorTheme={editorTheme}
//                   />
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-gray-400">
//                     No challenge selected
//                   </div>
//                 )}
//               </div>

//               {!outputCollapsed && (
//                 <div
//                   ref={resizerRef}
//                   className="h-2 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors"
//                 />
//               )}

//               <div
//                 className="bg-white border-t flex flex-col transition-all duration-300"
//                 style={{ height: outputCollapsed ? "44px" : `${outputHeight + 44}px` }}
//               >
//                 <div className="h-11 flex items-center justify-between px-5 border-b bg-gray-100">
//                   <div className="flex gap-3">
//                     <button
//                       className={`px-4 py-1.5 text-xs font-semibold rounded ${
//                         activeTab === "terminal"
//                           ? "bg-blue-600 text-white"
//                           : "text-gray-700 hover:bg-gray-200"
//                       }`}
//                       onClick={() => setActiveTab("terminal")}
//                     >
//                       Terminal
//                     </button>
//                     <button
//                       className={`px-4 py-1.5 text-xs font-semibold rounded ${
//                         activeTab === "tests"
//                           ? "bg-blue-600 text-white"
//                           : "text-gray-700 hover:bg-gray-200"
//                       }`}
//                       onClick={() => setActiveTab("tests")}
//                     >
//                       Tests
//                     </button>
//                   </div>

//                   <button
//                     onClick={toggleOutputCollapsed}
//                     className="text-sm font-bold text-gray-600 hover:text-blue-700"
//                   >
//                     {outputCollapsed ? "SHOW OUTPUT ▼" : "HIDE OUTPUT ▲"}
//                   </button>
//                 </div>

//                 <div
//                   className={`flex-1 overflow-auto p-5 font-mono text-sm ${
//                     outputCollapsed ? "hidden" : "block"
//                   }`}
//                 >
//                   {activeTab === "terminal" ? (
//                     currentState.summary ? (
//                       <div className="max-w-4xl mx-auto py-8">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                           <div className="bg-gray-50 p-5 rounded-lg border text-center">
//                             <div className="text-sm text-gray-600 mb-1">Outcome</div>
//                             <div
//                               className={`text-3xl font-bold ${
//                                 currentState.summary.outcome?.includes("Pass") ||
//                                 currentState.summary.outcome?.includes("pass")
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               {currentState.summary.outcome || "—"}
//                             </div>
//                           </div>
//                           <div className="bg-gray-50 p-5 rounded-lg border text-center">
//                             <div className="text-sm text-gray-600 mb-1">Correctness</div>
//                             <div className="text-3xl font-bold text-gray-900">
//                               {Math.round(currentState.summary.correctness * 100)}%
//                             </div>
//                           </div>
//                           <div className="bg-gray-50 p-5 rounded-lg border text-center">
//                             <div className="text-sm text-gray-600 mb-1">Avg Time</div>
//                             <div className="text-3xl font-bold text-gray-900">
//                               {currentState.summary.avgTime.toFixed(3)}s
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-center text-gray-500 text-sm">
//                           Last run: {new Date().toLocaleTimeString()}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="h-full flex items-center justify-center text-gray-500 italic">
//                         Run your code to see results
//                       </div>
//                     )
//                   ) : (
//                     <div className="space-y-6">
//                       {currentState.testResults?.length > 0 ? (
//                         currentState.testResults.map((tc, i) => (
//                           <div
//                             key={i}
//                             className={`p-5 border rounded-lg ${
//                               tc.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
//                             }`}
//                           >
//                             <div className="flex justify-between items-center mb-4">
//                               <h4 className="font-bold text-lg">
//                                 Test Case {i + 1}
//                                 <span className="ml-3 text-base font-semibold">
//                                   {tc.passed ? "✓ PASSED" : "✗ FAILED"}
//                                 </span>
//                               </h4>
//                               <span className="text-sm text-gray-600">
//                                 {tc.exec_time ? `${tc.exec_time}s` : "—"}
//                               </span>
//                             </div>

//                             <div className="grid md:grid-cols-2 gap-6">
//                               <div>
//                                 <div className="font-semibold mb-2">Input</div>
//                                 <pre className="bg-white p-4 rounded border overflow-auto max-h-32 font-mono text-sm">
//                                   {tc.input || "(empty)"}
//                                 </pre>
//                               </div>
//                               <div>
//                                 <div className="font-semibold mb-2">Expected Output</div>
//                                 <pre className="bg-white p-4 rounded border overflow-auto max-h-32 font-mono text-sm">
//                                   {tc.expected_output || "(empty)"}
//                                 </pre>
//                               </div>
//                               <div className="md:col-span-2">
//                                 <div className="font-semibold mb-2">Your Output</div>
//                                 <pre
//                                   className={`p-4 rounded border overflow-auto max-h-40 font-mono text-sm ${
//                                     tc.passed ? "bg-green-100" : "bg-red-100"
//                                   }`}
//                                 >
//                                   {tc.user_output || "(no output)"}
//                                 </pre>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-12 text-gray-500 italic">
//                           No test results yet. Click "Run Code" to evaluate.
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeEditor from "../../components/coding/CodeEditor";
import useAssessmentSession from "../../hooks/useAssessmentSession";
import AssessmentTimer from "../../components/assessment/AssessmentTimer";
import AssessmentGuard from "../../components/assessment/AssessmentGuard";
import InfoModal from "../../components/InfoModal";
import ConfirmModal from "../../components/ConfirmModal";

export default function CodingTestPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    session,
    timeLeft,
    submitted,
    handleSubmit: rawHandleSubmit,
    error,
    loading
  } = useAssessmentSession(jobId);

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [problemCollapsed, setProblemCollapsed] = useState(false);
  const [outputCollapsed, setOutputCollapsed] = useState(false);
  const [outputHeight, setOutputHeight] = useState(220);
  const resizerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("terminal");

  const [challengeStates, setChallengeStates] = useState({});
  const [isReady, setIsReady] = useState(false);

  // Modals
  const [infoModal, setInfoModal] = useState({ open: false, title: "", message: "" });
  const [showConfirm, setShowConfirm] = useState(false);

  // Load saved code + init states
  useEffect(() => {
    if (session?.challenges) {
      const initialStates = {};
      session.challenges.forEach((ch) => {
        const saved = localStorage.getItem(`coding-test-${jobId}-${ch.challengeId}`);
        initialStates[ch.challengeId] = {
          code: saved || "// Write your solution here...\n",
          language: "javascript",
          output: "",
          testResults: [],
          summary: null,
        };
      });
      setChallengeStates(initialStates);
    }
  }, [session?.challenges, jobId]);

  // Save code on change
  useEffect(() => {
    const ch = session?.challenges?.[currentChallengeIndex];
    if (ch && challengeStates[ch.challengeId]?.code) {
      localStorage.setItem(
        `coding-test-${jobId}-${ch.challengeId}`,
        challengeStates[ch.challengeId].code
      );
    }
  }, [challengeStates, session?.challenges, currentChallengeIndex, jobId]);

  const currentChallenge = session?.challenges?.[currentChallengeIndex] || null;
  const currentState = currentChallenge ? challengeStates[currentChallenge.challengeId] || {} : {};

  const updateCurrentState = (updates) => {
    if (!currentChallenge) return;
    setChallengeStates((prev) => ({
      ...prev,
      [currentChallenge.challengeId]: {
        ...(prev[currentChallenge.challengeId] || {}),
        ...updates,
      },
    }));
  };

  // Resizer (unchanged)
  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    let startY = 0;
    let startHeight = 0;

    const onMouseMove = (e) => {
      if (outputCollapsed) return;
      const dy = e.clientY - startY;
      let newHeight = startHeight - dy;
      newHeight = Math.max(140, Math.min(900, newHeight));
      setOutputHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e) => {
      if (outputCollapsed) return;
      startY = e.clientY;
      startHeight = outputHeight;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    resizer.addEventListener("mousedown", onMouseDown);
    return () => resizer.removeEventListener("mousedown", onMouseDown);
  }, [outputCollapsed]);

  // Autosave current challenge code every 30 seconds + on tab blur/switch
useEffect(() => {
  if (!currentChallenge?.challengeId || submitted || loading) return;

  const autosave = async () => {
    const currentCodeState = challengeStates[currentChallenge.challengeId];
    if (!currentCodeState?.code?.trim()) return; // skip if empty

    try {
      const token = localStorage.getItem("devsta_token");
      if (!token) return;

      const response = await fetch(
        `${BACKEND_URL}/api/developer/test/${jobId}/submission/${currentChallenge.challengeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: currentCodeState.code,
            language: currentCodeState.language || "javascript",
          }),
        }
      );

      if (!response.ok) {
        console.warn("Autosave failed:", await response.text());
      } else {
        console.log("Autosaved challenge", currentChallenge.challengeId);
      }
    } catch (err) {
      console.warn("Autosave network error:", err);
    }
  };

  // Save every 30 seconds
  const interval = setInterval(autosave, 30000);

  // Also save when user leaves the tab / switches window
  window.addEventListener("blur", autosave);
  window.addEventListener("beforeunload", autosave); // extra safety

  return () => {
    clearInterval(interval);
    window.removeEventListener("blur", autosave);
    window.removeEventListener("beforeunload", autosave);
  };
}, [currentChallenge, challengeStates, jobId, submitted, loading]);


  const toggleOutputCollapsed = () => {
    if (outputCollapsed) setOutputHeight((prev) => Math.max(prev, 180));
    setOutputCollapsed(!outputCollapsed);
  };

  const toggleTheme = () => {
    const next = editorTheme === "vs-dark" ? "light" : "vs-dark";
    setEditorTheme(next);
    localStorage.setItem("editorTheme", next);
  };

  const languageMap = {
    javascript: 63,
    python: 71,
    cpp: 54,
    java: 62,
  };

  const handleRunCode = async () => {
    if (!currentChallenge) return;

    updateCurrentState({ output: "Running code...\n" });
    if (outputCollapsed) setOutputCollapsed(false);

    try {
      const response = await fetch("http://localhost:5000/api/developer/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentState.code,
          language_id: languageMap[currentState.language],
          testCases: currentChallenge.testCases,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Evaluation failed");

      const resultsWithPassFlag = data.testCases.map((tc) => ({
        ...tc,
        passed: (tc.user_output || "").trim() === (tc.expected_output || "").trim(),
      }));

      updateCurrentState({
        testResults: resultsWithPassFlag,
        summary: {
          correctness: data.correctness,
          outcome: data.outcome,
          avgTime: data.avgTime || 0,
        },
      });

      const formatted = resultsWithPassFlag
        .map(
          (tc, i) =>
            `Test Case ${i + 1}:\n` +
            `Input:\n${tc.input}\n` +
            `Expected:\n${tc.expected_output}\n` +
            `Your Output:\n${tc.user_output}\n` +
            `Time: ${tc.exec_time || "—"}s\n` +
            `Result: ${tc.passed ? "PASS ✅" : "FAIL ❌"}`
        )
        .join("\n\n");

      updateCurrentState({
        output: `${formatted}\n\n------------------------------------\n` +
          `Correctness: ${Math.round(data.correctness * 100)}%\n` +
          `Outcome: ${data.outcome}\n` +
          `Average Time: ${data.avgTime || 0}s`,
      });
    } catch (err) {
      updateCurrentState({
        output: `Error: ${err.message || "Something went wrong"}\n`,
        summary: null,
      });
    }
  };

  // Submit handlers
  const onSubmitClick = () => setShowConfirm(true);

  // const confirmSubmit = async () => {
  //   setShowConfirm(false);
  //   const result = await rawHandleSubmit(false);
  //   if (result.success) {
  //     setInfoModal({
  //       open: true,
  //       title: "Test Submitted",
  //       message: "Your test has been submitted successfully!",
  //     });
  //   } else {
  //     setInfoModal({
  //       open: true,
  //       title: "Submission Failed",
  //       message: result.error || "Something went wrong. Please try again.",
  //     });
  //   }
  // };

  // Inside confirmSubmit
const confirmSubmit = async () => {
  setShowConfirm(false);

  // Collect all current code states
  const submissionData = session.challenges.map(ch => {
    const state = challengeStates[ch.challengeId] || {};
    return {
      challengeId: ch.challengeId,
      code: state.code || "",
      language: state.language || "javascript",
    };
  });

  console.log("Sending submissions:", submissionData); // debug

  const result = await rawHandleSubmit(false, null, submissionData); // pass extra arg

  if (result.success) {
    setInfoModal({ open: true, title: "Test Submitted", message: "..." });
  } else {
    setInfoModal({ open: true, title: "Submission Failed", message: result.error });
  }
};

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  if (loading || !session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-xl text-gray-700">
        {error ? `Error: ${error}` : "Initializing your test session..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50 text-red-700 text-xl font-medium">
        Error: {error}
      </div>
    );
  }

  // if (submitted) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">
  //       <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 text-center relative overflow-hidden">

  //         {/* Decorative Glow */}
  //         <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-200 rounded-full blur-3xl opacity-30"></div>

  //         {/* Success Icon */}
  //         <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-4xl font-bold shadow-md">
  //           ✓
  //         </div>

  //         {/* Title */}
  //         <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
  //           Test Submitted Successfully
  //         </h2>

  //         {/* Subtitle */}
  //         <p className="text-gray-600 text-lg mb-8 leading-relaxed">
  //           Your coding test has been securely submitted.
  //           You can no longer make changes.
  //         </p>

  //         {/* Divider */}
  //         <div className="h-px bg-gray-200 mb-8"></div>

  //         {/* CTA */}
  //         <button
  //           onClick={() => navigate("/dashboard/jobs")}
  //           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
  //         >
  //           Back to My Applications
  //         </button>

  //         {/* Small footer */}
  //         <p className="text-sm text-gray-400 mt-6">
  //           Thank you for completing your assessment.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }  


  // if (submitted) {
  //   const isAuto = session?.submissionType === "auto" || session?.status === "auto-submitted";

  //   if (isAuto) {
  //     return (
  //       <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-6">
  //         <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-red-200 p-10 text-center">
  //           <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-5xl">
  //             ⚠
  //           </div>

  //           <h2 className="text-3xl font-bold text-red-800 mb-4">
  //             Test Auto-Submitted
  //           </h2>

  //           <p className="text-lg text-red-700 mb-8 leading-relaxed">
  //             A violation was detected or time expired.<br />
  //             Your current answers have been submitted automatically.
  //           </p>

  //           <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-left text-red-800">
  //             <p className="font-medium">Reason: {session?.autoSubmitReason || "Violation detected"}</p>
  //           </div>

  //           <button
  //             onClick={() => navigate("/dashboard/jobs")}
  //             className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all"
  //           >
  //             Back to My Applications
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }
  // }
  // // Add this new block
  // if (session?.status === "submitted" || session?.status === "auto-submitted") {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-gray-100 text-center px-6">
  //       <div className="max-w-md">
  //         <div className="text-6xl mb-6 text-green-600">✓</div>
  //         <h2 className="text-3xl font-bold text-gray-800 mb-4">
  //           Test Already Submitted
  //         </h2>
  //         <p className="text-lg text-gray-600 mb-8">
  //           Your coding test for this job has already been submitted. You can no longer make changes.
  //         </p>
  //         <button
  //           onClick={() => navigate("/dashboard/jobs")}
  //           className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
  //         >
  //           Back to My Applications
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  if (submitted || session?.status === "submitted" || session?.status === "auto-submitted") {
  const isAuto = 
    session?.status === "auto-submitted" ||
    session?.submissionType === "auto";

  const reason = session?.autoSubmitReason || "Violation or timeout detected";

  if (isAuto) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 px-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-red-200 p-10 text-center">
          <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-full bg-red-100 text-red-700 text-6xl shadow-md">
            ⚠
          </div>
          <h2 className="text-4xl font-bold text-red-800 mb-4">
            Test Auto-Submitted
          </h2>
          <p className="text-lg text-red-700 mb-8 leading-relaxed">
            The test ended automatically due to a violation or time running out.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10 text-left">
            <p className="font-medium text-red-800">Reason: {reason}</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/jobs")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition shadow-lg"
          >
            Back to My Applications
          </button>
        </div>
      </div>
    );
  }

  // Normal manual submission success screen
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-emerald-200 p-10 text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
        <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-6xl font-bold shadow-md">
          ✓
        </div>
        <h2 className="text-4xl font-extrabold text-emerald-800 mb-4">
          Test Submitted Successfully
        </h2>
        <p className="text-lg text-gray-700 mb-10 leading-relaxed">
          Your coding assessment has been securely received.<br/>
          No further changes are possible.
        </p>
        <button
          onClick={() => navigate("/dashboard/jobs")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition shadow-lg hover:shadow-xl"
        >
          Back to My Applications
        </button>
        <p className="text-sm text-gray-500 mt-8">
          Thank you for completing the assessment.
        </p>
      </div>
    </div>
  );
}

  if (!session?.challenges?.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-xl text-red-600">
        No coding challenges found for this test.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      {!isReady ? (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] text-white">
          <div className="text-center max-w-3xl p-16 bg-gray-900 rounded-3xl border-4 border-red-700 shadow-2xl">
            <h1 className="text-5xl font-extrabold mb-12 text-red-500">
              FINAL TEST RULES
            </h1>
            <ul className="text-2xl mb-12 space-y-6 text-left max-w-2xl mx-auto">
              <li>• You will be forced into fullscreen mode</li>
              <li>• <strong>Exiting fullscreen even once ends the test immediately</strong></li>
              <li>• Paste, copy, right-click, print are completely blocked</li>
              <li>• Tab switching or minimizing ends the test</li>
              <li>• This session is monitored — no second chances</li>
            </ul>
            <button
              onClick={() => setIsReady(true)}
              className="bg-red-700 hover:bg-red-900 px-20 py-8 rounded-2xl text-3xl font-bold transition transform hover:scale-105"
            >
              I UNDERSTAND – START TEST
            </button>
          </div>
        </div>
      ) : (
        <>
          <header className="bg-white border-b px-4 py-3 flex items-center gap-4 shadow-sm z-10">
            <button
              onClick={() => setProblemCollapsed(!problemCollapsed)}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100 flex items-center gap-2"
            >
              {problemCollapsed ? "Show Problem" : "Hide Problem"}
              <span className="text-xs opacity-70">{problemCollapsed ? "↓" : "↑"}</span>
            </button>

            {!problemCollapsed && (
              <h1 className="text-lg font-bold text-blue-700 truncate flex-1">
                {currentChallenge?.title || "Coding Challenge"}
              </h1>
            )}

            <div className="flex items-center gap-4 ml-auto">
              <select
                value={currentState.language || "javascript"}
                onChange={(e) => updateCurrentState({ language: e.target.value })}
                className="border rounded px-3 py-2 text-sm bg-white min-w-[140px]"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>

              <button
                onClick={toggleTheme}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                {editorTheme === "vs-dark" ? "Light" : "Dark"} Theme
              </button>

              <AssessmentTimer timeLeft={timeLeft} />

              <button
                disabled={loading || !currentChallenge}
                onClick={handleRunCode}
                className={`px-6 py-2 rounded font-medium text-sm transition-colors ${loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {loading ? "Running..." : "Run Code"}
              </button>

              <button
                onClick={onSubmitClick}
                disabled={loading || !currentChallenge}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
              >
                Submit Test
              </button>
            </div>
          </header>

          {/* <AssessmentGuard
            onViolation={async (reason) => {
              const result = await rawHandleSubmit(true);
              if (result.success) {
                setInfoModal({
                  open: true,
                  title: "Violation Detected",
                  message: `A violation was detected (${reason}).\nThe test has been auto-submitted.`,
                });
              }
            }}
            maxViolations={1}
          /> */}


        <AssessmentGuard
  onViolation={async (reason) => {
    const result = await rawHandleSubmit(true, reason);   // ← add , reason
    if (result.success) {
      setInfoModal({
        open: true,
        title: "Violation Detected – Test Auto-Submitted",
        message: `Reason: ${reason}\n\nYour test has been automatically submitted.`,
        duration: 10000,
      });
    } else {
      setInfoModal({
        open: true,
        title: "Submission Failed",
        message: result.error || "Something went wrong.",
        duration: 8000,
      });
    }
  }}
  maxViolations={1}
/>

          {/* Challenge Tabs */}
          <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
            {session.challenges.map((ch, idx) => (
              <button
                key={ch.challengeId}
                onClick={() => setCurrentChallengeIndex(idx)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${currentChallengeIndex === idx
                    ? "bg-blue-50 border border-b-0 border-blue-300 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {idx + 1}. {ch.title}
                <span className="ml-2 text-xs text-gray-500">({ch.timeLimit} min)</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Problem Panel */}
            <div
              className={`bg-white border-r transition-all duration-300 overflow-hidden flex flex-col ${problemCollapsed ? "w-0 border-r-0" : "w-96 min-w-[320px] max-w-[45vw]"
                }`}
            >
              {!problemCollapsed && currentChallenge && (
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <section>
                    <h2 className="font-bold text-xl mb-4 text-gray-800">Problem Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {currentChallenge.problemStatement}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3 text-gray-800">Constraints</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      {currentChallenge.constraints?.split("\n").map((line, i) => (
                        <li key={i}>{line.trim()}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Test Cases / Examples</h3>
                    <div className="space-y-6">
                      {currentChallenge.testCases?.map((tc, i) => (
                        <div key={i} className="border rounded-lg p-5 bg-gray-50">
                          <div className="font-semibold mb-3 text-gray-700">Example {i + 1}</div>
                          <div className="mb-4">
                            <div className="font-medium mb-2">Input:</div>
                            <pre className="bg-white p-4 rounded border font-mono text-sm overflow-x-auto">
                              {tc.input}
                            </pre>
                          </div>
                          <div>
                            <div className="font-medium mb-2">Expected Output:</div>
                            <pre className="bg-white p-4 rounded border font-mono text-sm overflow-x-auto">
                              {tc.expected_output}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Editor + Output */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 min-h-0 bg-gray-900">
                {currentChallenge ? (
                  <CodeEditor
                    language={currentState.language || "javascript"}
                    value={currentState.code || ""}
                    onChange={(newCode) => updateCurrentState({ code: newCode })}
                    editorTheme={editorTheme}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No challenge selected
                  </div>
                )}
              </div>

              {!outputCollapsed && (
                <div
                  ref={resizerRef}
                  className="h-2 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors"
                />
              )}

              <div
                className="bg-white border-t flex flex-col transition-all duration-300"
                style={{ height: outputCollapsed ? "44px" : `${outputHeight + 44}px` }}
              >
                <div className="h-11 flex items-center justify-between px-5 border-b bg-gray-100">
                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-1.5 text-xs font-semibold rounded ${activeTab === "terminal" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() => setActiveTab("terminal")}
                    >
                      Terminal
                    </button>
                    <button
                      className={`px-4 py-1.5 text-xs font-semibold rounded ${activeTab === "tests" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() => setActiveTab("tests")}
                    >
                      Tests
                    </button>
                  </div>

                  <button
                    onClick={toggleOutputCollapsed}
                    className="text-sm font-bold text-gray-600 hover:text-blue-700"
                  >
                    {outputCollapsed ? "SHOW OUTPUT ▼" : "HIDE OUTPUT ▲"}
                  </button>
                </div>

                <div
                  className={`flex-1 overflow-auto p-5 font-mono text-sm ${outputCollapsed ? "hidden" : "block"
                    }`}
                >
                  {activeTab === "terminal" ? (
                    currentState.summary ? (
                      <div className="max-w-4xl mx-auto py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="bg-gray-50 p-5 rounded-lg border text-center">
                            <div className="text-sm text-gray-600 mb-1">Outcome</div>
                            <div
                              className={`text-3xl font-bold ${currentState.summary.outcome?.includes("Pass") ||
                                  currentState.summary.outcome?.includes("pass")
                                  ? "text-green-600"
                                  : "text-red-600"
                                }`}
                            >
                              {currentState.summary.outcome || "—"}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-5 rounded-lg border text-center">
                            <div className="text-sm text-gray-600 mb-1">Correctness</div>
                            <div className="text-3xl font-bold text-gray-900">
                              {Math.round(currentState.summary.correctness * 100)}%
                            </div>
                          </div>
                          <div className="bg-gray-50 p-5 rounded-lg border text-center">
                            <div className="text-sm text-gray-600 mb-1">Avg Time</div>
                            <div className="text-3xl font-bold text-gray-900">
                              {currentState.summary.avgTime.toFixed(3)}s
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-gray-500 text-sm">
                          Last run: {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 italic">
                        Run your code to see results
                      </div>
                    )
                  ) : (
                    <div className="space-y-6">
                      {currentState.testResults?.length > 0 ? (
                        currentState.testResults.map((tc, i) => (
                          <div
                            key={i}
                            className={`p-5 border rounded-lg ${tc.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                              }`}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-lg">
                                Test Case {i + 1}
                                <span className="ml-3 text-base font-semibold">
                                  {tc.passed ? "✓ PASSED" : "✗ FAILED"}
                                </span>
                              </h4>
                              <span className="text-sm text-gray-600">
                                {tc.exec_time ? `${tc.exec_time}s` : "—"}
                              </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <div className="font-semibold mb-2">Input</div>
                                <pre className="bg-white p-4 rounded border overflow-auto max-h-32 font-mono text-sm">
                                  {tc.input || "(empty)"}
                                </pre>
                              </div>
                              <div>
                                <div className="font-semibold mb-2">Expected Output</div>
                                <pre className="bg-white p-4 rounded border overflow-auto max-h-32 font-mono text-sm">
                                  {tc.expected_output || "(empty)"}
                                </pre>
                              </div>
                              <div className="md:col-span-2">
                                <div className="font-semibold mb-2">Your Output</div>
                                <pre
                                  className={`p-4 rounded border overflow-auto max-h-40 font-mono text-sm ${tc.passed ? "bg-green-100" : "bg-red-100"
                                    }`}
                                >
                                  {tc.user_output || "(no output)"}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500 italic">
                          No test results yet. Click "Run Code" to evaluate.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modals */}
          <InfoModal
            open={infoModal.open}
            title={infoModal.title}
            message={infoModal.message}
            onClose={() => setInfoModal({ ...infoModal, open: false })}
          />

          <ConfirmModal
            open={showConfirm}
            title="Submit Test?"
            message="Are you sure you want to submit your test? This action cannot be undone."
            confirmLabel="Yes, Submit"
            cancelLabel="Cancel"
            onConfirm={confirmSubmit}
            onCancel={() => setShowConfirm(false)}
          />
        </>
      )}
    </div>
  );
}