
// import React, { useState, useRef, useEffect } from "react";
// import CodeEditor from "../../components/coding/CodeEditor";
// import useAssessmentSession from "../../hooks/useAssessmentSession";
// import AssessmentTimer from "../../components/assessment/AssessmentTimer";
// import AssessmentGuard from "../../components/assessment/AssessmentGuard";

// export default function CodingTestPage() {

//   const jobId = "YOUR_JOB_ID_HERE"; // replace properly later

// const { session, timeLeft, submitted, handleSubmit } =
//   useAssessmentSession(jobId);

//   const challenge = {
//     title: "Echo Input",
//     description:
//       "Write a program that reads a single line of input and prints it exactly as received.",
//     constraints: [
//       "Input will contain a single line of text.",
//       "Output must match input exactly.",
//       "No extra spaces or characters allowed.",
//     ],
//     testCases: [
//       { input: "Hello", expected_output: "Hello" },
//       { input: "World", expected_output: "World" },
//       { input: "Devsta", expected_output: "Devsta" },
//     ],
//   };

//   const languageMap = {
//     javascript: 63,
//     python: 71,
//     cpp: 54,
//     java: 62,
//   };

//   const DEFAULT_OUTPUT_HEIGHT = 220;

//   const [code, setCode] = useState("// Write your solution...\n");
//   const [language, setLanguage] = useState("javascript");
//   const [output, setOutput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [editorTheme, setEditorTheme] = useState("vs-dark");

//   const [problemCollapsed, setProblemCollapsed] = useState(false);
//   const [outputCollapsed, setOutputCollapsed] = useState(false);
//   const [outputHeight, setOutputHeight] = useState(DEFAULT_OUTPUT_HEIGHT);

//   // NEW: store summary data for Terminal tab
//   const [summary, setSummary] = useState(null);

//   const resizerRef = useRef(null);
//   const [activeTab, setActiveTab] = useState("terminal");
//   const [testResults, setTestResults] = useState([]);



//   // Resizer logic
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

//   const handleRunCode = async () => {
//     try {
//       setLoading(true);
//       setOutput("Running code...\n");

//       if (outputCollapsed) setOutputCollapsed(false);

//       const response = await fetch(
//         "http://localhost:5000/api/developer/evaluate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             code,
//             language_id: languageMap[language],
//             testCases: challenge.testCases,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Evaluation failed");

//       // Add 'passed' flag for each test case
//       const resultsWithPassFlag = data.testCases.map((tc) => ({
//         ...tc,
//         passed: tc.user_output?.trim() === tc.expected_output?.trim(),
//       }));

//       setTestResults(resultsWithPassFlag);

//       // Save summary for Terminal tab
//       setSummary({
//         correctness: data.correctness,
//         outcome: data.outcome,
//         avgTime: data.avgTime || 0,
//       });

//       // Detailed log (still saved in output for reference)
//       const formatted = resultsWithPassFlag
//         .map(
//           (tc, index) =>
//             `Test Case ${index + 1}:\nInput:\n${tc.input}\nExpected Output:\n${tc.expected_output}\nYour Output:\n${tc.user_output}\nTime: ${tc.exec_time}s\nResult: ${tc.passed ? "PASS ✅" : "FAIL ❌"}`
//         )
//         .join("\n\n");

//       setOutput(
//         `${formatted}\n\n------------------------------------\nOverall Correctness: ${Math.round(
//           data.correctness * 100
//         )}%\nOutcome: ${data.outcome}\nAverage Time: ${data.avgTime}s`
//       );
//     } catch (err) {
//       setOutput(`Error: ${err.message || "Something went wrong"}`);
//       setSummary(null);
//     } finally {
//       setLoading(false);
//     }
//   };


//   if (submitted) {
//   return (
//     <div className="h-screen flex items-center justify-center text-xl font-bold">
//       Test Submitted Successfully ✅
//     </div>
//   );
// }
//   return (
//     <div className="h-screen flex flex-col bg-gray-50 font-fragment">

//       {/* Top Toolbar */}
//       <header className="bg-white border-b px-4 py-2.5 flex items-center gap-3 shadow-sm z-10">
//         <button
//           onClick={() => setProblemCollapsed(!problemCollapsed)}
//           className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 flex items-center gap-1.5"
//         >
//           {problemCollapsed ? "Show Problem" : "Hide Problem"}
//           <span className="text-xs opacity-70">{problemCollapsed ? "↓" : "↑"}</span>
//         </button>

//         {!problemCollapsed && (
//           <h1 className="text-lg font-bold text-primary truncate flex-1">
//             {challenge.title}
//           </h1>
//         )}

//         <div className="flex items-center gap-3 ml-auto">
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="border rounded px-3 py-1.5 text-sm bg-white min-w-[140px]"
//           >
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="cpp">C++</option>
//             <option value="java">Java</option>
//           </select>

//           <button
//             onClick={toggleTheme}
//             className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100"
//           >
//             {editorTheme === "vs-dark" ? "Light" : "Dark"}
//           </button>

//       <AssessmentTimer timeLeft={timeLeft} />


//           <button
//             disabled={loading}
//             onClick={handleRunCode}
//             className={`px-5 py-1.5 rounded font-medium text-sm transition ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed text-white"
//                 : "bg-primary hover:opacity-90 text-white"
//             }`}
//           >
//             {loading ? "Running..." : "Run Code"}
//           </button>

//           {/* <button className="px-5 py-1.5 bg-green-600 text-white rounded hover:opacity-90 font-medium text-sm">
//             Submit
//           </button> */}

//           <button
//   onClick={() => handleSubmit(false)}
//   className="px-5 py-1.5 bg-green-600 text-white rounded hover:opacity-90 font-medium text-sm"
// >
//   Submit Test
// </button>
//         </div>
//       </header>
// {/* <AssessmentGuard onViolation={() => handleSubmit(true)} /> */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Left - Problem */}
//         <div
//           className={`bg-white border-r transition-all duration-300 overflow-hidden flex flex-col ${
//             problemCollapsed ? "w-0 border-r-0" : "w-96 min-w-[320px] max-w-[45vw]"
//           }`}
//         >
//           {!problemCollapsed && (
//             <div className="flex-1 overflow-y-auto p-5 space-y-6">
//               <section>
//                 <h2 className="font-semibold text-lg mb-3">Description</h2>
//                 <p className="text-gray-700 leading-relaxed text-[15px]">
//                   {challenge.description}
//                 </p>
//               </section>

//               <section>
//                 <h3 className="font-semibold mb-2">Constraints</h3>
//                 <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-sm">
//                   {challenge.constraints.map((c, i) => (
//                     <li key={i}>{c}</li>
//                   ))}
//                 </ul>
//               </section>

//               <section>
//                 <h3 className="font-semibold mb-3">Examples</h3>
//                 <div className="space-y-4">
//                   {challenge.testCases.map((tc, i) => (
//                     <div
//                       key={i}
//                       className="border rounded-lg p-4 bg-gray-50 text-sm"
//                     >
//                       <div className="font-medium mb-1.5">Input</div>
//                       <pre className="bg-white p-3 rounded border font-mono whitespace-pre-wrap break-words">
//                         {tc.input}
//                       </pre>
//                       <div className="font-medium mt-4 mb-1.5">Expected Output</div>
//                       <pre className="bg-white p-3 rounded border font-mono whitespace-pre-wrap break-words">
//                         {tc.expected_output}
//                       </pre>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           )}
//         </div>

//         {/* Right side - Editor + Output */}
//         <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//           <div className="flex-1 min-h-0">
//             <CodeEditor
//               language={language}
//               value={code}
//               onChange={setCode}
//               editorTheme={editorTheme}
//             />
//           </div>

//           {!outputCollapsed && (
//             <div
//               ref={resizerRef}
//               className="h-1.5 bg-gray-200 hover:bg-primary cursor-row-resize transition-colors shrink-0"
//             />
//           )}

//           {/* Output panel */}
//           <div
//             className="bg-white border-t flex flex-col transition-[height] duration-300 ease-in-out shrink-0"
//             style={{
//               flex: "none",
//               height: outputCollapsed ? "40px" : `${outputHeight + 40}px`,
//             }}
//           >
//             {/* Header */}
//             <div className="h-[40px] flex items-center justify-between px-4 border-b bg-gray-100 shrink-0">
//               <div className="flex gap-2">
//                 <button
//                   className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
//                     activeTab === "terminal"
//                       ? "bg-blue-600 text-white shadow-sm"
//                       : "text-gray-700 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setActiveTab("terminal")}
//                 >
//                   Terminal
//                 </button>
//                 <button
//                   className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
//                     activeTab === "tests"
//                       ? "bg-blue-600 text-white shadow-sm"
//                       : "text-gray-700 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setActiveTab("tests")}
//                 >
//                   Tests
//                 </button>
//               </div>

//               <button
//                 onClick={toggleOutputCollapsed}
//                 className="text-xs font-bold text-gray-600 hover:text-blue-700 px-2 py-1"
//               >
//                 {outputCollapsed ? "SHOW OUTPUT ▼" : "HIDE ▼"}
//               </button>
//             </div>

//             {/* Content area */}
//             <div
//               className={`flex-1 overflow-auto p-4 font-mono text-sm bg-white ${
//                 outputCollapsed ? "hidden" : "block"
//               }`}
//             >
//               {activeTab === "terminal" ? (
//                 <div className="whitespace-pre-wrap leading-relaxed">
//                   {summary ? (
//                     <div className="max-w-3xl mx-auto py-6 px-4">


//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center mb-8">


//                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                           <div className="text-sm text-gray-600 mb-1">Outcome</div>
//                           <div
//                             className={`text-2xl font-semibold ${
//                               summary.outcome?.toLowerCase().includes("pass")
//                                 ? "text-green-600"
//                                 : "text-red-600"
//                             }`}
//                           >
//                             {summary.outcome || "—"}
//                           </div>
//                         </div>

//                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                           <div className="text-sm text-gray-600 mb-1">Average Time</div>
//                           <div className="text-2xl font-semibold text-gray-900">
//                             {summary.avgTime.toFixed(3)}s
//                           </div>
//                         </div>
//                       </div>

//                       <div className="text-center text-gray-600 text-sm">
//                         Last run: {new Date().toLocaleTimeString()}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex items-center justify-center text-gray-500 italic">
//                       Run your code to see the result summary
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 // Tests tab (detailed view)
//                 <div className="space-y-4">
//                   {testResults.length > 0 ? (
//                     testResults.map((tc, i) => (
//                       <div
//                         key={i}
//                         className={`p-4 border rounded-lg shadow-sm ${
//                           tc.passed
//                             ? "bg-green-50 border-green-300"
//                             : "bg-red-50 border-red-300"
//                         }`}
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <h4 className="font-bold text-base">
//                             Test Case {i + 1}
//                             <span className="ml-3 text-sm font-medium">
//                               {tc.passed ? (
//                                 <span className="text-green-700">✓ PASSED</span>
//                               ) : (
//                                 <span className="text-red-700">✗ FAILED</span>
//                               )}
//                             </span>
//                           </h4>
//                           <span className="text-xs text-gray-500">
//                             Time: {tc.exec_time}s
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <div className="font-semibold text-gray-800 mb-1">Input:</div>
//                             <pre className="bg-white p-2 rounded border border-gray-200 overflow-auto max-h-24 font-mono">
//                               {tc.input || "(empty)"}
//                             </pre>
//                           </div>

//                           <div>
//                             <div className="font-semibold text-gray-800 mb-1">Expected:</div>
//                             <pre className="bg-white p-2 rounded border border-gray-200 overflow-auto max-h-24 font-mono">
//                               {tc.expected_output || "(empty)"}
//                             </pre>
//                           </div>

//                           <div className="md:col-span-2">
//                             <div className="font-semibold text-gray-800 mb-1">Your Output:</div>
//                             <pre
//                               className={`p-2 rounded border overflow-auto max-h-32 font-mono ${
//                                 tc.passed ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
//                               }`}
//                             >
//                               {tc.user_output || "(no output)"}
//                             </pre>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center text-gray-500 py-10 italic">
//                       No test results yet. Click "Run Code" to evaluate your solution.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useRef, useEffect } from "react";
// import CodeEditor from "../../components/coding/CodeEditor";
// import useAssessmentSession from "../../hooks/useAssessmentSession";
// import AssessmentTimer from "../../components/assessment/AssessmentTimer";
// import AssessmentGuard from "../../components/assessment/AssessmentGuard";

// export default function CodingTestPage() {
//   const jobId = "YOUR_JOB_ID_HERE"; // ← Replace with real jobId from route/props later
//   const { session, timeLeft, submitted, handleSubmit } = useAssessmentSession(jobId);

//   const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [editorTheme, setEditorTheme] = useState("vs-dark");
//   const [problemCollapsed, setProblemCollapsed] = useState(false);
//   const [outputCollapsed, setOutputCollapsed] = useState(false);
//   const [outputHeight, setOutputHeight] = useState(220);
//   const resizerRef = useRef(null);
//   const [activeTab, setActiveTab] = useState("terminal");

//   // Per-challenge persistent state
//   const [challengeStates, setChallengeStates] = useState({});
//   // NEW: Track if a suspicious paste happened (for UI feedback or extra strictness)
//   const [suspiciousPasteCount, setSuspiciousPasteCount] = useState(0);


//   // Initialize state for each challenge when session loads
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

//   // Resizer logic
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

//   const handleSuspiciousPaste = () => {
//     setSuspiciousPasteCount((prev) => prev + 1);

//     // Trigger a violation (counts toward maxViolations in AssessmentGuard)
//     // You can adjust the message or make it count as 1 or 2 violations
//     alert("Large or suspicious paste detected — this has been counted as a violation.");

//     // If you want to make it auto-submit faster, you can call handleSubmit directly:
//     // if (suspiciousPasteCount + 1 >= 2) handleSubmit(true);
//   };
//   const languageMap = {
//     javascript: 63,
//     python: 71,
//     cpp: 54,
//     java: 62,
//   };

//   const handleRunCode = async () => {
//     if (!currentChallenge) return;

//     setLoading(true);
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
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-50 text-2xl font-bold text-green-600">
//         Test Submitted Successfully ✓
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-50 text-xl">
//         Loading assessment session...
//       </div>
//     );
//   }

//   if (!session.challenges?.length) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-50 text-xl text-red-600">
//         No coding challenges found for this test.
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-gray-50 font-sans">

//       {/* Header / Toolbar */}
//       <header className="bg-white border-b px-4 py-3 flex items-center gap-4 shadow-sm z-10">
//         <button
//           onClick={() => setProblemCollapsed(!problemCollapsed)}
//           className="px-4 py-2 text-sm border rounded hover:bg-gray-100 flex items-center gap-2"
//         >
//           {problemCollapsed ? "Show Problem" : "Hide Problem"}
//           <span className="text-xs opacity-70">{problemCollapsed ? "↓" : "↑"}</span>
//         </button>

//         {!problemCollapsed && (
//           <h1 className="text-lg font-bold text-blue-700 truncate flex-1">
//             {currentChallenge?.title || "Coding Challenge"}
//           </h1>
//         )}

//         <div className="flex items-center gap-4 ml-auto">
//           <select
//             value={currentState.language || "javascript"}
//             onChange={(e) => updateCurrentState({ language: e.target.value })}
//             className="border rounded px-3 py-2 text-sm bg-white min-w-[140px]"
//           >
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="cpp">C++</option>
//             <option value="java">Java</option>
//           </select>

//           <button
//             onClick={toggleTheme}
//             className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
//           >
//             {editorTheme === "vs-dark" ? "Light" : "Dark"} Theme
//           </button>

//           <AssessmentTimer timeLeft={timeLeft} />

//           <button
//             disabled={loading || !currentChallenge}
//             onClick={handleRunCode}
//             className={`px-6 py-2 rounded font-medium text-sm transition-colors ${loading
//                 ? "bg-gray-400 text-white cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//           >
//             {loading ? "Running..." : "Run Code"}
//           </button>

//           <button
//             onClick={() => handleSubmit(false)}
//             className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
//           >
//             Submit Test
//           </button>
//         </div>
//       </header>



//       <AssessmentGuard
//         onViolation={(reason) => handleSubmit(true)}
//         maxViolations={3} // feel free to increase to 4 or 5
//       />
//       {/* Challenge Tabs */}
//       <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
//         {session.challenges.map((ch, idx) => (
//           <button
//             key={ch.challengeId}
//             onClick={() => setCurrentChallengeIndex(idx)}
//             className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${currentChallengeIndex === idx
//                 ? "bg-blue-50 border border-b-0 border-blue-300 text-blue-700 font-semibold"
//                 : "text-gray-600 hover:bg-gray-50"
//               }`}
//           >
//             {idx + 1}. {ch.title}
//             <span className="ml-2 text-xs text-gray-500">({ch.timeLimit} min)</span>
//           </button>
//         ))}
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Problem Description Panel */}
//         <div
//           className={`bg-white border-r transition-all duration-300 overflow-hidden flex flex-col ${problemCollapsed ? "w-0 border-r-0" : "w-96 min-w-[320px] max-w-[45vw]"
//             }`}
//         >
//           {!problemCollapsed && currentChallenge && (
//             <div className="flex-1 overflow-y-auto p-6 space-y-8">
//               <section>
//                 <h2 className="font-bold text-xl mb-4 text-gray-800">Problem Description</h2>
//                 <p className="text-gray-700 leading-relaxed">
//                   {currentChallenge.problemStatement}
//                 </p>
//               </section>

//               <section>
//                 <h3 className="font-bold text-lg mb-3 text-gray-800">Constraints</h3>
//                 <ul className="list-disc pl-6 space-y-2 text-gray-600">
//                   {currentChallenge.constraints?.split("\n").map((line, i) => (
//                     <li key={i}>{line.trim()}</li>
//                   ))}
//                 </ul>
//               </section>

//               <section>
//                 <h3 className="font-bold text-lg mb-4 text-gray-800">Test Cases / Examples</h3>
//                 <div className="space-y-6">
//                   {currentChallenge.testCases?.map((tc, i) => (
//                     <div key={i} className="border rounded-lg p-5 bg-gray-50">
//                       <div className="font-semibold mb-3 text-gray-700">Example {i + 1}</div>
//                       <div className="mb-4">
//                         <div className="font-medium mb-2">Input:</div>
//                         <pre className="bg-white p-4 rounded border font-mono text-sm overflow-x-auto">
//                           {tc.input}
//                         </pre>
//                       </div>
//                       <div>
//                         <div className="font-medium mb-2">Expected Output:</div>
//                         <pre className="bg-white p-4 rounded border font-mono text-sm overflow-x-auto">
//                           {tc.expected_output}
//                         </pre>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           )}
//         </div>

//         {/* Editor + Output Area */}
//         <div className="flex-1 flex flex-col min-w-0">
//           {/* Editor */}
//           <div className="flex-1 min-h-0 bg-gray-900">
//             {currentChallenge ? (
//   <CodeEditor
//     language={currentState.language || "javascript"}
//     value={currentState.code || ""}
//     onChange={(newCode) => updateCurrentState({ code: newCode })}
//     editorTheme={editorTheme}
//     onSuspiciousPaste={handleSuspiciousPaste}   // ← NEW prop
//   />
// ) : (
//   <div className="h-full flex items-center justify-center text-gray-400">
//     No challenge selected
//   </div>
// )}
//           </div>

//           {/* Resizer */}
//           {!outputCollapsed && (
//             <div
//               ref={resizerRef}
//               className="h-2 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors"
//             />
//           )}

//           {/* Output Panel */}
//           <div
//             className="bg-white border-t flex flex-col transition-all duration-300"
//             style={{ height: outputCollapsed ? "44px" : `${outputHeight + 44}px` }}
//           >
//             <div className="h-11 flex items-center justify-between px-5 border-b bg-gray-100">
//               <div className="flex gap-3">
//                 <button
//                   className={`px-4 py-1.5 text-xs font-semibold rounded ${activeTab === "terminal"
//                       ? "bg-blue-600 text-white"
//                       : "text-gray-700 hover:bg-gray-200"
//                     }`}
//                   onClick={() => setActiveTab("terminal")}
//                 >
//                   Terminal
//                 </button>
//                 <button
//                   className={`px-4 py-1.5 text-xs font-semibold rounded ${activeTab === "tests"
//                       ? "bg-blue-600 text-white"
//                       : "text-gray-700 hover:bg-gray-200"
//                     }`}
//                   onClick={() => setActiveTab("tests")}
//                 >
//                   Tests
//                 </button>
//               </div>

//               <button
//                 onClick={toggleOutputCollapsed}
//                 className="text-sm font-bold text-gray-600 hover:text-blue-700"
//               >
//                 {outputCollapsed ? "SHOW OUTPUT ▼" : "HIDE OUTPUT ▲"}
//               </button>
//             </div>

//             <div
//               className={`flex-1 overflow-auto p-5 font-mono text-sm ${outputCollapsed ? "hidden" : "block"
//                 }`}
//             >
//               {activeTab === "terminal" ? (
//                 currentState.summary ? (
//                   <div className="max-w-4xl mx-auto py-8">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                       <div className="bg-gray-50 p-5 rounded-lg border text-center">
//                         <div className="text-sm text-gray-600 mb-1">Outcome</div>
//                         <div
//                           className={`text-3xl font-bold ${currentState.summary.outcome?.includes("Pass") ||
//                               currentState.summary.outcome?.includes("pass")
//                               ? "text-green-600"
//                               : "text-red-600"
//                             }`}
//                         >
//                           {currentState.summary.outcome || "—"}
//                         </div>
//                       </div>
//                       <div className="bg-gray-50 p-5 rounded-lg border text-center">
//                         <div className="text-sm text-gray-600 mb-1">Correctness</div>
//                         <div className="text-3xl font-bold text-gray-900">
//                           {Math.round(currentState.summary.correctness * 100)}%
//                         </div>
//                       </div>
//                       <div className="bg-gray-50 p-5 rounded-lg border text-center">
//                         <div className="text-sm text-gray-600 mb-1">Avg Time</div>
//                         <div className="text-3xl font-bold text-gray-900">
//                           {currentState.summary.avgTime.toFixed(3)}s
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-center text-gray-500 text-sm">
//                       Last run: {new Date().toLocaleTimeString()}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-gray-500 italic">
//                     Run your code to see results
//                   </div>
//                 )
//               ) : (
//                 // Tests tab
//                 <div className="space-y-6">
//                   {currentState.testResults?.length > 0 ? (
//                     currentState.testResults.map((tc, i) => (
//                       <div
//                         key={i}
//                         className={`p-5 border rounded-lg ${tc.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
//                           }`}
//                       >
//                         <div className="flex justify-between items-center mb-4">
//                           <h4 className="font-bold text-lg">
//                             Test Case {i + 1}
//                             <span className="ml-3 text-base font-semibold">
//                               {tc.passed ? "✓ PASSED" : "✗ FAILED"}
//                             </span>
//                           </h4>
//                           <span className="text-sm text-gray-600">
//                             {tc.exec_time ? `${tc.exec_time}s` : "—"}
//                           </span>
//                         </div>

//                         <div className="grid md:grid-cols-2 gap-6">
//                           <div>
//                             <div className="font-semibold mb-2">Input</div>
//                             <pre className="bg-white p-4 rounded border overflow-auto max-h-32 font-mono text-sm">
//                               {tc.input || "(empty)"}
//                             </pre>
//                           </div>
//                           <div>
//                             <div className="font-semibold mb-2">Expected Output</div>
//                             <pre className="bg-white p-4 rounded border overflow-auto max-h-32 font-mono text-sm">
//                               {tc.expected_output || "(empty)"}
//                             </pre>
//                           </div>
//                           <div className="md:col-span-2">
//                             <div className="font-semibold mb-2">Your Output</div>
//                             <pre
//                               className={`p-4 rounded border overflow-auto max-h-40 font-mono text-sm ${tc.passed ? "bg-green-100" : "bg-red-100"
//                                 }`}
//                             >
//                               {tc.user_output || "(no output)"}
//                             </pre>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-12 text-gray-500 italic">
//                       No test results yet. Click "Run Code" to evaluate.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Optional dev tool - remove later */}
//       {/* <button
//         onClick={() => setTimeLeft(5)}
//         className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50"
//       >
//         Simulate ~5s left (dev)
//       </button> */}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import CodeEditor from "../../components/coding/CodeEditor";
import useAssessmentSession from "../../hooks/useAssessmentSession";
import AssessmentTimer from "../../components/assessment/AssessmentTimer";
import AssessmentGuard from "../../components/assessment/AssessmentGuard";

export default function CodingTestPage() {
  const jobId = "YOUR_JOB_ID_HERE"; // ← Replace with real jobId from route/props later
  const { session, timeLeft, submitted, handleSubmit } = useAssessmentSession(jobId);

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [problemCollapsed, setProblemCollapsed] = useState(false);
  const [outputCollapsed, setOutputCollapsed] = useState(false);
  const [outputHeight, setOutputHeight] = useState(220);
  const resizerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("terminal");

  // Per-challenge persistent state
  const [challengeStates, setChallengeStates] = useState({});
  const [isReady, setIsReady] = useState(false);

  // Initialize state for each challenge when session loads
  useEffect(() => {
    if (session?.challenges) {
      const initialStates = {};
      session.challenges.forEach((ch) => {
        initialStates[ch.challengeId] = {
          code: "// Write your solution here...\n",
          language: "javascript",
          output: "",
          testResults: [],
          summary: null,
        };
      });
      setChallengeStates(initialStates);
    }
  }, [session?.challenges]);

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

  // Resizer logic
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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-2xl font-bold text-green-600">
        Test Submitted Successfully ✓
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-xl">
        Loading assessment session...
      </div>
    );
  }

  if (!session.challenges?.length) {
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
          {/* Header */}
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
                className={`px-6 py-2 rounded font-medium text-sm transition-colors ${loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {loading ? "Running..." : "Run Code"}
              </button>

              <button
                onClick={() => handleSubmit(false)}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
              >
                Submit Test
              </button>
            </div>
          </header>

          <AssessmentGuard
            onViolation={(reason) => handleSubmit(true)}
            maxViolations={1} // Strict: auto-submit on first violation
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

          <div className="flex flex-1 overflow-hidden">
            {/* Problem Description Panel */}
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

            {/* Editor + Output Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Editor */}
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

              {/* Resizer */}
              {!outputCollapsed && (
                <div
                  ref={resizerRef}
                  className="h-2 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors"
                />
              )}

              {/* Output Panel */}
              <div
                className="bg-white border-t flex flex-col transition-all duration-300"
                style={{ height: outputCollapsed ? "44px" : `${outputHeight + 44}px` }}
              >
                <div className="h-11 flex items-center justify-between px-5 border-b bg-gray-100">
                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-1.5 text-xs font-semibold rounded ${activeTab === "terminal"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() => setActiveTab("terminal")}
                    >
                      Terminal
                    </button>
                    <button
                      className={`px-4 py-1.5 text-xs font-semibold rounded ${activeTab === "tests"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
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
                    // Tests tab
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

          {/* Optional dev tool - remove later */}
          {/* <button
        onClick={() => setTimeLeft(5)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        Simulate ~5s left (dev)
      </button> */}
        </>
      )}
    </div>
  );
}