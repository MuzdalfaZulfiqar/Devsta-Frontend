// import { useState, useRef, useCallback } from "react";
// import axios from "axios";
// import {
//   Mic, MicOff, Volume2, VolumeX, RotateCcw,
//   ChevronRight, Clock, Star, MessageSquare
// } from "lucide-react";
// import TalkingAvatar from "../avatar/TalkingAvatar";
// import { useSpeech } from "../../../hooks/useSpeech";

// const API = "http://localhost:5000";

// const PHASES = [
//   { key: "General", label: "General", emoji: "🎯" },
//   { key: "Technical", label: "Technical", emoji: "💻" },
//   { key: "Behavioral", label: "Behavioral", emoji: "🧠" },
//   { key: "System Design", label: "System Design", emoji: "🏗️" },
// ];

// export default function MockInterview({ userProfile, roadmapData }) {
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [sessionStatus, setSessionStatus] = useState("idle"); // idle | active | done
//   const [feedback, setFeedback] = useState(null);
//   const [score, setScore] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPhase, setSelectedPhase] = useState("General");
//   const [isMuted, setIsMuted] = useState(false);
//   const [error, setError] = useState(null);
//   const [turnCount, setTurnCount] = useState(0);
//   const [pastSessions, setPastSessions] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);

//   const avatarRef = useRef(null);
//   const token = localStorage.getItem("devsta_token") || localStorage.getItem("token");

//   const { 
//     isListening, isSpeaking, transcript, setTranscript,
//     sttSupported, startListening, stopListening, speak, cancelSpeech 
//   } = useSpeech();

//   const handleSpeak = useCallback((text) => {
//     if (isMuted) return;
//     // Try avatar first, fallback to browser TTS
//     if (avatarRef.current?.speakText) {
//       try {
//         avatarRef.current.speakText(text);
//         return;
//       } catch (e) {}
//     }
//     speak(text);
//   }, [isMuted, speak]);

//   // ── Start Session ────────────────────────────────────────────
//   const startSession = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post(
//         `${API}/api/interview-session/start`,
//         {
//           roadmapId: roadmapData?._id || null,
//           targetRole: roadmapData?.role || userProfile?.targetRole || "Software Engineer",
//           targetCompany: roadmapData?.company || "",
//           experience: roadmapData?.experience || userProfile?.experienceLevel || "mid",
//           phase: selectedPhase,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSessionId(res.data.sessionId);
//       setCurrentQuestion(res.data.question);
//       setSessionStatus("active");
//       setTurnCount(0);
//       setHistory([{ role: "interviewer", content: res.data.question, type: res.data.type }]);
//       setTranscript("");

//       // Speak the first question
//       setTimeout(() => handleSpeak(res.data.question), 500);
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message;
//       if (msg.includes("n8n")) {
//         setError("n8n is not running. Run: docker run -p 5678:5678 n8nio/n8n");
//       } else {
//         setError(`Failed to start: ${msg}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Submit Answer ─────────────────────────────────────────────
//   const submitAnswer = async () => {
//     const answer = stopListening();
//     const finalAnswer = (answer || transcript).trim();

//     if (!finalAnswer || !sessionId) return;

//     cancelSpeech();
//     setLoading(true);
//     setHistory((prev) => [...prev, { role: "candidate", content: finalAnswer }]);
//     setTranscript("");

//     try {
//       const res = await axios.post(
//         `${API}/api/interview-session/continue`,
//         { sessionId, userAnswer: finalAnswer },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setTurnCount(res.data.turnCount || turnCount + 1);

//       if (res.data.done) {
//         setSessionStatus("done");
//         setFeedback(res.data.feedback);
//         setScore(res.data.score);
//         if (res.data.feedback && !isMuted) {
//           setTimeout(() => speak(res.data.feedback.substring(0, 300)), 500);
//         }
//       } else {
//         setCurrentQuestion(res.data.question);
//         setHistory((prev) => [
//           ...prev,
//           { role: "interviewer", content: res.data.question, type: res.data.type },
//         ]);
//         setTimeout(() => handleSpeak(res.data.question), 300);
//       }
//     } catch (err) {
//       setError("Failed to submit answer. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Reset ─────────────────────────────────────────────────────
//   const reset = async () => {
//     cancelSpeech();
//     if (sessionId && sessionStatus === "active") {
//       try {
//         await axios.patch(
//           `${API}/api/interview-session/abandon/${sessionId}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } catch (e) {}
//     }
//     setSessionId(null);
//     setCurrentQuestion("");
//     setTranscript("");
//     setSessionStatus("idle");
//     setFeedback(null);
//     setScore(null);
//     setHistory([]);
//     setError(null);
//     setTurnCount(0);
//   };

//   // ─────────────────────────────────────────────────────────────
//   // RENDER: IDLE
//   // ─────────────────────────────────────────────────────────────
//   if (sessionStatus === "idle") {
//     return (
//       <div className="max-w-2xl space-y-5">
//         <div className="p-7 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
//           <div className="flex items-center gap-3 mb-5">
//             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">
//               🎙️
//             </div>
//             <div>
//               <h2 className="text-lg font-black text-gray-900 dark:text-white">
//                 AI Mock Interview
//               </h2>
//               <p className="text-xs text-gray-500">Real interviewer-style conversation with live feedback</p>
//             </div>
//           </div>

//           {/* Role info */}
//           <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-4 text-sm">
//             <div>
//               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Role</span>
//               <span className="font-bold text-gray-800 dark:text-white">
//                 {roadmapData?.role || "Software Engineer"}
//               </span>
//             </div>
//             <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
//             <div>
//               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Level</span>
//               <span className="font-bold text-gray-800 dark:text-white capitalize">
//                 {roadmapData?.experience || "Mid"}
//               </span>
//             </div>
//             {roadmapData?.company && (
//               <>
//                 <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
//                 <div>
//                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Company</span>
//                   <span className="font-bold text-gray-800 dark:text-white">{roadmapData.company}</span>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Phase Selection */}
//           <div className="mb-6">
//             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
//               Focus Area
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {PHASES.map((p) => (
//                 <button
//                   key={p.key}
//                   onClick={() => setSelectedPhase(p.key)}
//                   className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border flex items-center gap-2 ${
//                     selectedPhase === p.key
//                       ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
//                       : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/40 hover:bg-primary/5"
//                   }`}
//                 >
//                   <span>{p.emoji}</span>
//                   {p.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Info box */}
//           <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-xs text-blue-700 dark:text-blue-300 space-y-1">
//             <p className="font-bold">How it works:</p>
//             <p>• The AI will ask you 6 interview questions</p>
//             <p>• Click the mic button to record your answer</p>
//             <p>• The AI follows up based on your answers — just like a real interview</p>
//             <p>• You'll get a detailed score and feedback at the end</p>
//           </div>

//           {!sttSupported && (
//             <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-xs text-amber-700 dark:text-amber-300">
//               ⚠️ Speech recognition needs Chrome or Edge. You can also type your answers.
//             </div>
//           )}

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm text-red-600 dark:text-red-400">
//               {error}
//             </div>
//           )}

//           <button
//             onClick={startSession}
//             disabled={loading}
//             className="w-full py-3.5 rounded-2xl bg-primary text-white font-black text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Connecting to AI...
//               </>
//             ) : (
//               <>Start Interview <ChevronRight className="w-4 h-4" /></>
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ─────────────────────────────────────────────────────────────
//   // RENDER: DONE
//   // ─────────────────────────────────────────────────────────────
//   if (sessionStatus === "done") {
//     const scoreColor =
//       score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";
//     const scoreBg =
//       score >= 80 ? "bg-emerald-50 dark:bg-emerald-900/20" : score >= 60 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-rose-50 dark:bg-rose-900/20";

//     return (
//       <div className="max-w-2xl space-y-5">
//         <div className={`p-8 rounded-[2rem] ${scoreBg} border border-gray-200 dark:border-gray-800 text-center`}>
//           <div className="text-5xl mb-3">
//             {score >= 80 ? "🎉" : score >= 60 ? "👍" : "💪"}
//           </div>
//           <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
//             Interview Complete
//           </h2>
//           {score !== null && (
//             <p className={`text-5xl font-black mt-3 mb-1 ${scoreColor}`}>
//               {score}
//               <span className="text-lg text-gray-400 font-normal">/100</span>
//             </p>
//           )}
//           <p className="text-sm text-gray-500 mb-6">{turnCount} questions answered</p>
//         </div>

//         {feedback && (
//           <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
//             <div className="flex items-center gap-2 mb-3">
//               <Star className="w-4 h-4 text-amber-500" />
//               <span className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                 Interviewer Feedback
//               </span>
//             </div>
//             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
//               {feedback}
//             </p>
//           </div>
//         )}

//         {/* Conversation replay */}
//         <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
//           <div className="flex items-center gap-2 mb-4">
//             <MessageSquare className="w-4 h-4 text-gray-400" />
//             <span className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//               Conversation Recap
//             </span>
//           </div>
//           <div className="space-y-3 max-h-64 overflow-y-auto">
//             {history.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
//                     msg.role === "candidate"
//                       ? "bg-primary text-white"
//                       : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={reset}
//           className="w-full py-3 rounded-2xl bg-primary text-white font-black text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
//         >
//           <RotateCcw className="w-4 h-4" /> New Session
//         </button>
//       </div>
//     );
//   }

//   // ─────────────────────────────────────────────────────────────
//   // RENDER: ACTIVE
//   // ─────────────────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col xl:flex-row gap-6">
//       {/* ── Avatar Panel ─────────────────────────────── */}
//       <div className="w-full xl:w-72 shrink-0">
//         <div className="h-72 xl:h-full max-h-[420px] rounded-[2rem] overflow-hidden relative bg-gray-900">
//           <TalkingAvatar ref={avatarRef} isSpeaking={isSpeaking} />

//           {/* Speaking animation overlay */}
//           {(isSpeaking) && (
//             <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
//               <div className="flex gap-0.5 items-end h-4">
//                 {[1, 3, 2, 4, 1, 3, 2].map((h, i) => (
//                   <div
//                     key={i}
//                     className="w-1 bg-primary rounded-full"
//                     style={{
//                       height: `${h * 4}px`,
//                       animation: `pulse 0.${6 + i}s ease-in-out infinite alternate`,
//                     }}
//                   />
//                 ))}
//               </div>
//               <span className="text-[10px] text-white font-bold uppercase tracking-widest">
//                 Speaking
//               </span>
//             </div>
//           )}

//           {/* Turn counter */}
//           <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
//             <Clock className="w-3 h-3 text-gray-300" />
//             <span className="text-[10px] text-white font-bold">
//               {turnCount}/6
//             </span>
//           </div>

//           {/* Mute toggle */}
//           <button
//             onClick={() => {
//               setIsMuted((m) => !m);
//               if (!isMuted) cancelSpeech();
//             }}
//             className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition"
//           >
//             {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
//           </button>
//         </div>
//       </div>

//       {/* ── Conversation Panel ────────────────────────── */}
//       <div className="flex-1 flex flex-col gap-4 min-h-0">
//         {/* Current Question */}
//         <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
//           <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
//             Interviewer
//           </p>
//           {loading && !currentQuestion ? (
//             <div className="flex items-center gap-2 text-gray-400 text-sm">
//               <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
//               Thinking...
//             </div>
//           ) : (
//             <p className="text-base font-semibold text-gray-800 dark:text-white leading-relaxed">
//               {currentQuestion}
//             </p>
//           )}
//         </div>

//         {/* Chat History (last few messages) */}
//         {history.length > 1 && (
//           <div className="max-h-36 overflow-y-auto space-y-2 px-1">
//             {history.slice(0, -1).map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
//                     msg.role === "candidate"
//                       ? "bg-primary/90 text-white"
//                       : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Answer Input */}
//         <div className="p-5 rounded-[2rem] bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
//           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
//             Your Answer
//           </p>

//           {/* Transcript display / text input fallback */}
//           {sttSupported ? (
//             <div className="min-h-[72px] text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
//               {transcript || (
//                 <span className="text-gray-400 italic text-sm">
//                   {isListening
//                     ? "🔴 Listening... speak your answer"
//                     : "Press the mic button to answer"}
//                 </span>
//               )}
//             </div>
//           ) : (
//             <textarea
//               value={transcript}
//               onChange={(e) => setTranscript(e.target.value)}
//               placeholder="Type your answer here..."
//               rows={3}
//               className="w-full mb-4 p-3 text-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
//             />
//           )}

//           <div className="flex items-center gap-3">
//             {/* Mic Button */}
//             {sttSupported && (
//               <button
//                 onClick={isListening ? () => stopListening() : startListening}
//                 disabled={isSpeaking || loading}
//                 className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 ${
//                   isListening
//                     ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105"
//                     : "bg-primary hover:opacity-90 text-white shadow-md shadow-primary/20"
//                 }`}
//               >
//                 {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
//               </button>
//             )}

//             {/* Submit */}
//             <button
//               onClick={submitAnswer}
//               disabled={!transcript.trim() || loading}
//               className="flex-1 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm hover:opacity-90 transition disabled:opacity-30 flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
//               ) : (
//                 <>Submit Answer <ChevronRight className="w-4 h-4" /></>
//               )}
//             </button>

//             {/* End Session */}
//             <button
//               onClick={reset}
//               className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//               title="End session"
//             >
//               <RotateCcw className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-sm text-red-600 dark:text-red-400">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useCallback } from "react";
// import axios from "axios";
// import {
//   Mic, MicOff, Volume2, VolumeX, RotateCcw,
//   ChevronRight, Clock, Star, MessageSquare
// } from "lucide-react";
// import TalkingAvatar from "../avatar/TalkingAvatar";
// import { useSpeech } from "../../../hooks/useSpeech";

// const API = "http://localhost:5000";

// const PHASES = [
//   { key: "General", label: "General", emoji: "🎯" },
//   { key: "Technical", label: "Technical", emoji: "💻" },
//   { key: "Behavioral", label: "Behavioral", emoji: "🧠" },
//   { key: "System Design", label: "System Design", emoji: "🏗️" },
// ];

// export default function MockInterview({ userProfile, roadmapData }) {
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [sessionStatus, setSessionStatus] = useState("idle");
//   const [feedback, setFeedback] = useState(null);
//   const [score, setScore] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPhase, setSelectedPhase] = useState("General");
//   const [isMuted, setIsMuted] = useState(false);
//   const [error, setError] = useState(null);
//   const [turnCount, setTurnCount] = useState(0);

//   const avatarRef = useRef(null);
//   const token = localStorage.getItem("devsta_token") || localStorage.getItem("token");

//   const { 
//     isListening, isSpeaking, transcript, setTranscript,
//     sttSupported, startListening, stopListening, speak, cancelSpeech 
//   } = useSpeech();

//   const handleSpeak = useCallback((text) => {
//     if (isMuted) return;
//     if (avatarRef.current?.speakText) {
//       try {
//         avatarRef.current.speakText(text);
//         return;
//       } catch (e) {
//         console.warn("Avatar speak failed, using TTS fallback");
//       }
//     }
//     speak(text);
//   }, [isMuted, speak]);

//   // Start Session
//   const startSession = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post(
//         `${API}/api/interview-session/start`,
//         {
//           roadmapId: roadmapData?._id || null,
//           targetRole: roadmapData?.role || userProfile?.targetRole || "Software Engineer",
//           targetCompany: roadmapData?.company || "",
//           experience: roadmapData?.experience || userProfile?.experienceLevel || "mid",
//           phase: selectedPhase,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSessionId(res.data.sessionId);
//       setCurrentQuestion(res.data.question);
//       setSessionStatus("active");
//       setTurnCount(0);
//       setHistory([{ role: "interviewer", content: res.data.question, type: res.data.type }]);
//       setTranscript("");

//       setTimeout(() => handleSpeak(res.data.question), 600);
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message;
//       setError(msg.includes("n8n") 
//         ? "n8n is not running. Start it with Docker." 
//         : `Failed to start: ${msg}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Submit Answer
//   const submitAnswer = async () => {
//     const finalAnswer = (stopListening() || transcript).trim();
//     if (!finalAnswer || !sessionId) return;

//     cancelSpeech();
//     setLoading(true);
//     setHistory(prev => [...prev, { role: "candidate", content: finalAnswer }]);
//     setTranscript("");

//     try {
//       const res = await axios.post(
//         `${API}/api/interview-session/continue`,
//         { sessionId, userAnswer: finalAnswer },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setTurnCount(res.data.turnCount || turnCount + 1);

//       if (res.data.done) {
//         setSessionStatus("done");
//         setFeedback(res.data.feedback);
//         setScore(res.data.score);
//         if (res.data.feedback && !isMuted) {
//           setTimeout(() => speak(res.data.feedback.substring(0, 300)), 500);
//         }
//       } else {
//         setCurrentQuestion(res.data.question);
//         setHistory(prev => [
//           ...prev,
//           { role: "interviewer", content: res.data.question, type: res.data.type }
//         ]);
//         setTimeout(() => handleSpeak(res.data.question), 400);
//       }
//     } catch (err) {
//       setError("Failed to submit answer. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = async () => {
//     cancelSpeech();
//     if (sessionId && sessionStatus === "active") {
//       try {
//         await axios.patch(`${API}/api/interview-session/abandon/${sessionId}`, {}, 
//           { headers: { Authorization: `Bearer ${token}` } });
//       } catch (e) {}
//     }

//     setSessionId(null);
//     setCurrentQuestion("");
//     setTranscript("");
//     setSessionStatus("idle");
//     setFeedback(null);
//     setScore(null);
//     setHistory([]);
//     setError(null);
//     setTurnCount(0);
//   };

//   // IDLE SCREEN (unchanged)
//   if (sessionStatus === "idle") {
//     return (
//       <div className="max-w-2xl space-y-5">
//         {/* Your existing idle UI - unchanged */}
//         <div className="p-7 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
//           {/* ... keep your idle content as is ... */}
//           <button
//             onClick={startSession}
//             disabled={loading}
//             className="w-full py-3.5 rounded-2xl bg-primary text-white font-black text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
//           >
//             {loading ? "Connecting to AI..." : "Start Interview"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // DONE SCREEN (unchanged - you can keep it)
//   if (sessionStatus === "done") {
//     // ... your existing done screen ...
//     return <div>...</div>; // keep as is
//   }

//   // ACTIVE INTERVIEW SCREEN - IMPROVED LAYOUT
//   return (
//     <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
//       {/* BIG AVATAR PANEL - LEFT SIDE */}
//       <div className="lg:w-5/12 xl:w-2/5 shrink-0">
//         <div className="h-full min-h-[500px] lg:min-h-[620px] rounded-[2rem] overflow-hidden relative bg-gray-900 shadow-xl">
//           <TalkingAvatar ref={avatarRef} isSpeaking={isSpeaking} />

//           {/* Speaking Indicator */}
//           {isSpeaking && (
//             <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
//               <div className="flex gap-1">
//                 {[1,3,2,4].map((h,i) => (
//                   <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{height: `${h*5}px`}} />
//                 ))}
//               </div>
//               <span className="text-white text-sm font-medium">Speaking</span>
//             </div>
//           )}

//           {/* Turn Counter */}
//           <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 text-white text-sm">
//             <Clock className="w-4 h-4" />
//             Question {turnCount}/6
//           </div>

//           {/* Mute Button */}
//           <button
//             onClick={() => setIsMuted(!isMuted)}
//             className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition"
//           >
//             {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>

//       {/* CONVERSATION PANEL - RIGHT SIDE */}
//       <div className="flex-1 flex flex-col gap-5 min-h-0">
//         {/* Current Question */}
//         <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex-1 overflow-auto">
//           <p className="text-xs font-black uppercase tracking-widest text-primary mb-3">INTERVIEWER</p>
//           <p className="text-lg leading-relaxed text-gray-800 dark:text-white">
//             {currentQuestion || (loading && "Thinking...")}
//           </p>
//         </div>

//         {/* Answer Area */}
//         <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
//           <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">YOUR ANSWER</p>

//           {sttSupported ? (
//             <div className="min-h-[100px] p-4 bg-white dark:bg-gray-900 rounded-2xl border mb-5 text-gray-700 dark:text-gray-300">
//               {transcript || <span className="italic text-gray-400">
//                 {isListening ? "🎤 Listening... Speak now" : "Click mic to start speaking"}
//               </span>}
//             </div>
//           ) : (
//             <textarea
//               value={transcript}
//               onChange={(e) => setTranscript(e.target.value)}
//               placeholder="Type your answer here..."
//               rows={4}
//               className="w-full p-4 rounded-2xl border bg-white dark:bg-gray-900 mb-5"
//             />
//           )}

//           <div className="flex gap-3">
//             {sttSupported && (
//               <button
//                 onClick={isListening ? stopListening : startListening}
//                 disabled={isSpeaking || loading}
//                 className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all ${
//                   isListening ? "bg-rose-500 scale-105" : "bg-primary hover:bg-primary/90"
//                 }`}
//               >
//                 {isListening ? <MicOff size={28} /> : <Mic size={28} />}
//               </button>
//             )}

//             <button
//               onClick={submitAnswer}
//               disabled={!transcript.trim() || loading}
//               className="flex-1 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-base hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {loading ? "Submitting..." : "Submit Answer"} <ChevronRight />
//             </button>

//             <button onClick={reset} className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
//               <RotateCcw className="w-5 h-5 mx-auto" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// working----
// import { useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { Mic, MicOff, LogOut } from "lucide-react";
// // import TalkingAvatar from "../avatar/TalkingAvatar";
// import { useSpeech } from "../../../hooks/useSpeech";
// // import TalkingAvatar2D from "../avatar/TalkingAvatar";
// import ThreeAvatar from "../avatar/ThreeAvatar";

// const TalkingAvatar = ThreeAvatar; // ← switch to 2D avatar if needed

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const PHASES = [
//   { key: "General", label: "General" },
//   { key: "Technical", label: "Technical" },
//   { key: "Behavioral", label: "Behavioral" },
//   { key: "System Design", label: "System Design" },
// ];

// export default function MockInterview({ userProfile, roadmapData }) {
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [currentType, setCurrentType] = useState("technical");
//   const [sessionStatus, setSessionStatus] = useState("idle");
//   const [feedback, setFeedback] = useState(null);
//   const [score, setScore] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPhase, setSelectedPhase] = useState("Technical");
//   const [isMuted, setIsMuted] = useState(false);
//   const [error, setError] = useState(null);
//   const [turnCount, setTurnCount] = useState(0);
//   const [elapsedSeconds, setElapsedSeconds] = useState(0);

//   const avatarRef = useRef(null);
//   const timerRef = useRef(null);
//   const token = localStorage.getItem("devsta_token") || localStorage.getItem("token");

//   const {
//     isListening, isSpeaking, transcript, setTranscript,micError,
//     sttSupported, startListening, stopListening, speak, cancelSpeech, sttMode, setTypedTranscript,
//   } = useSpeech();

 
//   const formatTime = (s) => {
//     const m = Math.floor(s / 60).toString().padStart(2, "0");
//     const sec = (s % 60).toString().padStart(2, "0");
//     return `${m}:${sec}`;
//   };

//   const startTimer = () => {
//     timerRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
//   };
//   const stopTimer = () => clearInterval(timerRef.current);

//   // const handleSpeak = useCallback(
//   //   (text) => {
//   //     if (isMuted) return;
//   //     if (avatarRef.current?.speakText) {
//   //       try { avatarRef.current.speakText(text); return; } catch (e) {}
//   //     }
//   //     speak(text);
//   //   },
//   //   [isMuted, speak]
//   // );

//   // Replace handleSpeak with this:
// const handleSpeak = useCallback((text, onEnd) => {
//   if (isMuted) { onEnd?.(); return; }
//   if (avatarRef.current?.speakText) {
//     avatarRef.current.speakText(text, onEnd);
//     return;
//   }
//   speak(text, { onEnd });
// }, [isMuted, speak]);

// const startSession = async () => {
//   setLoading(true);
//   setError(null);
//   try {
//     const res = await axios.post(
//       `${API}/api/interview-session/start`,
//       {
//         roadmapId: roadmapData?._id || null,
//         targetRole: roadmapData?.role || "Software Engineer",
//         targetCompany: roadmapData?.company || "",
//         experience: roadmapData?.experience || "mid",
//         phase: selectedPhase,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setSessionId(res.data.sessionId);
//     setCurrentQuestion(res.data.question);
//     setCurrentType(res.data.type || "technical");
//     setSessionStatus("active");
//     setTurnCount(0);
//     setHistory([]);
//     setElapsedSeconds(0);
//     startTimer();
//     // speak first question → auto-open mic when done
//     setTimeout(() => {
//       handleSpeak(res.data.question, () => startListening());
//     }, 800);
//   } catch (err) {
//     setError(err.response?.data?.message || "Failed to connect. Is n8n running?");
//   } finally {
//     setLoading(false);
//   }
// };
// const submitAnswer = async () => {
//   // grab BOTH sources immediately before any state changes
//   const refAnswer = stopListening();
//   const stateAnswer = transcript;
//   const finalAnswer = (refAnswer || stateAnswer).trim();

//   if (!finalAnswer) {
//     setError("No answer recorded. Press the mic button and speak first.");
//     return;
//   }
//   if (!sessionId) return;

//   cancelSpeech();
//   setError(null);
//   setLoading(true);

//   // save to history BEFORE clearing transcript
//   const questionSnapshot = currentQuestion;
//   setHistory(p => [
//     ...p,
//     { role: "interviewer", content: questionSnapshot },
//     { role: "candidate", content: finalAnswer },
//   ]);

//   // clear transcript AFTER saving
//   setTranscript("");

//   avatarRef.current?.setThinking(true);

//   try {
//     const res = await axios.post(
//       `${API}/api/interview-session/continue`,
//       { sessionId, userAnswer: finalAnswer },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     avatarRef.current?.setThinking(false);
//     setTurnCount(res.data.turnCount || turnCount + 1);

//     if (res.data.done) {
//       stopTimer();
//       setSessionStatus("done");
//       setFeedback(res.data.feedback);
//       setScore(res.data.score);
//     } else {
//       setCurrentQuestion(res.data.question);
//       setCurrentType(res.data.type || "technical");
//       handleSpeak(res.data.question, () => startListening());
//     }
//   } catch (err) {
//     avatarRef.current?.setThinking(false);
//     setError("Failed to submit answer. Please try again.");
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };

//   const reset = async () => {
//     cancelSpeech();
//     stopTimer();
//     if (sessionId && sessionStatus === "active") {
//       try {
//         await axios.patch(
//           `${API}/api/interview-session/abandon/${sessionId}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } catch (e) {}
//     }
//     setSessionId(null); setCurrentQuestion(""); setTranscript("");
//     setSessionStatus("idle"); setFeedback(null); setScore(null);
//     setHistory([]); setError(null); setTurnCount(0); setElapsedSeconds(0);
//   };

//   // ── IDLE ──────────────────────────────────────────────────────
//   if (sessionStatus === "idle") {
//     return (
//       <div className="flex items-center justify-center min-h-[600px]">
//         <div className="w-full max-w-md space-y-5">
//           <div>
//             <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
//               AI Mock Interview
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Realistic interviewer — follow-up questions, live feedback, score at the end.
//             </p>
//           </div>
//           <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
//             <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex gap-4 text-sm">
//               <div>
//                 <span className="text-xs text-gray-400 block mb-0.5">Role</span>
//                 <span className="font-bold text-gray-800 dark:text-white">
//                   {roadmapData?.role || "Software Engineer"}
//                 </span>
//               </div>
//               <div className="w-px bg-gray-200 dark:bg-gray-700" />
//               <div>
//                 <span className="text-xs text-gray-400 block mb-0.5">Level</span>
//                 <span className="font-bold text-gray-800 dark:text-white capitalize">
//                   {roadmapData?.experience || "Mid"}
//                 </span>
//               </div>
//               {roadmapData?.company && (
//                 <>
//                   <div className="w-px bg-gray-200 dark:bg-gray-700" />
//                   <div>
//                     <span className="text-xs text-gray-400 block mb-0.5">Company</span>
//                     <span className="font-bold text-gray-800 dark:text-white">
//                       {roadmapData.company}
//                     </span>
//                   </div>
//                 </>
//               )}
//             </div>
//             <div>
//               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                 Focus area
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 {PHASES.map((p) => (
//                   <button
//                     key={p.key}
//                     onClick={() => setSelectedPhase(p.key)}
//                     className={`py-2.5 rounded-xl text-sm font-bold border transition ${
//                       selectedPhase === p.key
//                         ? "bg-primary text-white border-primary"
//                         : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/40"
//                     }`}
//                   >
//                     {p.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             {error && (
//               <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
//                 {error}
//               </div>
//             )}
//             <button
//               onClick={startSession}
//               disabled={loading}
//               className="w-full py-3 rounded-2xl bg-primary text-white font-black text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : "Start interview"}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── DONE ──────────────────────────────────────────────────────
//   if (sessionStatus === "done") {
//     const scoreColor =
//       score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";
//     return (
//       <div className="flex items-center justify-center min-h-[600px]">
//         <div className="w-full max-w-lg space-y-4">
//           <div className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
//             <p className="text-4xl mb-3">
//               {score >= 80 ? "🎉" : score >= 60 ? "👍" : "💪"}
//             </p>
//             <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
//               Interview Complete
//             </h2>
//             {score !== null && (
//               <p className={`text-5xl font-black mt-3 ${scoreColor}`}>
//                 {score}
//                 <span className="text-base text-gray-400 font-normal">/100</span>
//               </p>
//             )}
//           </div>
//           {feedback && (
//             <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
//               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
//                 Feedback
//               </p>
//               <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
//                 {feedback}
//               </p>
//             </div>
//           )}
//           <button
//             onClick={reset}
//             className="w-full py-3 rounded-2xl bg-primary text-white font-black text-sm hover:opacity-90 transition"
//           >
//             New session
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── ACTIVE — 35% LEFT / 65% RIGHT ────────────────────────────
//   return (
//     <div
//       className="flex rounded-[2rem] overflow-hidden border border-gray-200 dark:border-gray-800"
//       style={{ minHeight: "700px" }}
//     >
//       {/* ── LEFT PANEL: 35% ──────────────────────────────────── */}
//       <div
//         className="flex flex-col p-6 gap-5 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
//         style={{ width: "35%" }}
//       >
//         {/* Status */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5">
//             <span
//               className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
//                 isSpeaking
//                   ? "bg-orange-500 animate-pulse"
//                   : isListening
//                   ? "bg-purple-500 animate-pulse"
//                   : "bg-emerald-500"
//               }`}
//             />
//             {isSpeaking ? "Speaking" : isListening ? "Listening..." : "Active"}
//           </div>
//           <span className="text-xs text-gray-400 tabular-nums font-medium">
//             {formatTime(elapsedSeconds)}
//           </span>
//         </div>

//         {/* Question card */}
//         <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 gap-3">
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 capitalize">
//               {currentType}
//             </span>
//             <span className="text-[10px] text-gray-400">
//               Q{turnCount + 1} / 6
//             </span>
//           </div>
//           <p className="text-sm font-bold text-gray-800 dark:text-white leading-relaxed flex-1">
//             {loading && !currentQuestion ? (
//               <span className="flex items-center gap-2 text-gray-400 text-sm font-normal">
//                 <span className="w-3.5 h-3.5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin inline-block" />
//                 Thinking...
//               </span>
//             ) : (
//               currentQuestion
//             )}
//           </p>
//         </div>

//         {/* Chat history */}
//         {history.length > 0 && (
//           <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
//             {history.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[88%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
//                     msg.role === "candidate"
//                       ? "bg-primary text-white"
//                       : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Session meta */}
//         <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex-wrap">
//           {[
//             { label: "Role", value: roadmapData?.role || "Engineer" },
//             { label: "Level", value: roadmapData?.experience || "Mid" },
//             { label: "Focus", value: selectedPhase },
//           ].map((m, i) => (
//             <div key={i} className="flex flex-col gap-0.5">
//               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
//                 {m.label}
//               </span>
//               <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
//                 {m.value}
//               </span>
//             </div>
//           ))}
//         </div>

//         {error && (
//           <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-xs text-red-600 dark:text-red-400">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* ── RIGHT PANEL: 65% — Avatar ─────────────────────────── */}
//       <div className="flex flex-col" style={{ width: "65%" }}>

//         {/* Avatar — fills all space */}
//         <div className="flex-1 relative" style={{ minHeight: "580px" }}>
//           <TalkingAvatar
//             ref={avatarRef}
//             isSpeaking={isSpeaking}
//             isMuted={isMuted}
//             onToggleMute={() => {
//               setIsMuted((m) => !m);
//               if (!isMuted) cancelSpeech();
//             }}
//           />
//         </div>

//         {/* Controls bar — sits below avatar inside the dark panel */}
//        {/* Controls bar */}
// <div
//   className="flex flex-col gap-3 px-6 py-5 border-t border-white/[0.06]"
//   style={{ background: "#0d0d12" }}
// >
//   {/* Network error warning */}
//   {sttMode === "typing" && (
//     <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
//       Voice unavailable (network issue) — type your answer below instead
//     </div>
//   )}

//   {/* Transcript / input area */}
//   {sttMode === "typing" ? (
//     // Typing mode — show a real textarea
//     <textarea
//       value={transcript}
//       onChange={(e) => setTypedTranscript(e.target.value)}
//       placeholder="Type your answer here..."
//       rows={3}
//       className="w-full rounded-xl px-4 py-3 text-sm text-white/90 resize-none outline-none"
//       style={{
//         background: "rgba(127,119,221,0.08)",
//         border: "1px solid rgba(127,119,221,0.4)",
//         minHeight: 80,
//       }}
//     />
//   ) : (
//     // Speech mode — show transcript
//     <div
//       className={`rounded-xl px-4 py-3 text-sm leading-relaxed transition-all ${
//         isListening
//           ? "border border-purple-500/50 text-white/90"
//           : "border border-white/[0.07] text-white/40"
//       }`}
//       style={{
//         minHeight: 48,
//         background: isListening ? "rgba(127,119,221,0.08)" : "rgba(255,255,255,0.03)",
//       }}
//     >
//       {transcript || (
//         <span className="italic text-sm">
//           {isListening ? "Listening — speak your answer..." : "Press mic to start answering"}
//         </span>
//       )}
//     </div>
//   )}

//   {/* Buttons */}
//   <div className="flex items-center gap-3">
//     {/* Mic — hidden in typing mode */}
//     {sttMode === "speech" && (
//       <button
//         onClick={isListening ? stopListening : startListening}
//         disabled={isSpeaking || loading}
//         className={`w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0 ${
//           isListening ? "bg-orange-600 scale-105" : "bg-purple-600 hover:bg-purple-500"
//         }`}
//         style={isListening ? {
//           animation: "mic-pulse 1.5s ease-in-out infinite"
//         } : {}}
//       >
//         {isListening
//           ? <MicOff style={{ width: 22, height: 22, color: "white" }} />
//           : <Mic style={{ width: 22, height: 22, color: "white" }} />
//         }
//       </button>
//     )}

//     {/* Submit */}
//     <button
//       onClick={submitAnswer}
//       disabled={loading || !transcript.trim()}
//       className="flex-1 h-12 rounded-xl text-sm font-bold transition disabled:opacity-30"
//       style={{
//         border: "0.5px solid rgba(255,255,255,0.14)",
//         background: "rgba(255,255,255,0.07)",
//         color: "rgba(255,255,255,0.8)",
//       }}
//     >
//       {loading ? (
//         <span className="flex items-center justify-center gap-2">
//           <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
//         </span>
//       ) : (
//         sttMode === "typing" ? "Send answer" : "Submit answer"
//       )}
//     </button>

//     {/* End session */}
//     <button
//       onClick={reset}
//       className="w-12 h-12 rounded-xl flex items-center justify-center transition"
//       style={{
//         border: "0.5px solid rgba(255,255,255,0.08)",
//         background: "rgba(255,255,255,0.03)",
//         color: "rgba(255,255,255,0.25)",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.background = "rgba(239,68,68,0.12)";
//         e.currentTarget.style.color = "#f87171";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.background = "rgba(255,255,255,0.03)";
//         e.currentTarget.style.color = "rgba(255,255,255,0.25)";
//       }}
//     >
//       <LogOut style={{ width: 16, height: 16 }} />
//     </button>
//   </div>
// </div>
//       </div>

//       <style>{`
//         @keyframes mic-pulse {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.4); }
//           50% { box-shadow: 0 0 0 10px rgba(234,88,12,0); }
//         }
//       `}</style>
//     </div>
//   );
// }