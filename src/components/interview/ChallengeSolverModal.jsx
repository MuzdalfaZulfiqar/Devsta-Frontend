import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { X, Play, Bot, Send, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ChallengeSolverModal({
  challenge,
  roadmapId,
  phaseTitle,
  onClose,
  onSubmissionSaved,
}) {
  const [code, setCode] = useState(challenge.starter_code || "");
  const [language, setLanguage] = useState(challenge.language || "python");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [aiReview, setAiReview] = useState(null);
  const editorRef = useRef(null);

  const token = localStorage.getItem("devsta_token");

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Layer 1: Judge0 Execution (Run Tests)
  const runTests = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/submit-solution",
        {
          challengeId: challenge._id,
          code,
          language,
          roadmapId,
          phaseTitle,
          testOnly: true,           // only Judge0, no final save
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(res.data.results); // { passed, total, testResults: [...] }
    } catch (err) {
      alert(err.response?.data?.message || "Judge0 execution failed");
    } finally {
      setLoading(false);
    }
  };

  // Layer 2: AI Code Reviewer (Flash model via backend)
const getAiReview = async () => {
  setLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:5000/api/roadmap/ai-review",
      {
        code,
        language,
        problem: challenge.description,
        title: challenge.title
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAiReview(res.data.review);
  } catch (err) {
    console.error(err);
    alert("AI review failed: " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
  }
};

  // Full Submit (Judge0 + save submission)
  const submitSolution = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/submit-solution",
        {
          challengeId: challenge._id,
          code,
          language,
          roadmapId,
          phaseTitle,
          testOnly: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(res.data.results);
      onSubmissionSaved?.(res.data.submission);
      alert("✅ Solution submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b">
          <div>
            <h2 className="text-2xl font-black">{challenge.title}</h2>
            <p className="text-sm text-gray-500">{challenge.difficulty} • {language}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Problem Description */}
          <div className="w-2/5 border-r p-8 overflow-auto">
            <h3 className="font-black uppercase text-xs tracking-widest mb-3">Problem</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>

            {results && (
              <div className="mt-8">
                <h4 className="font-black text-sm mb-3">Test Results</h4>
                <div className="space-y-3">
                  {results.testResults.map((tc, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {tc.passed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-medium">Test {i + 1}</span>
                      <span className="text-gray-500 text-xs">{tc.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiReview && (
              <div className="mt-8 border-t pt-6">
                <h4 className="font-black text-sm mb-3 flex items-center gap-2">
                  <Bot className="w-4 h-4" /> AI Code Reviewer (Flash)
                </h4>
                <div className="prose text-sm text-gray-700 dark:text-gray-300">
                  {aiReview}
                </div>
              </div>
            )}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 flex flex-col">
            <div className="px-8 py-4 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-950">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent font-medium text-sm outline-none"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={runTests}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-black rounded-2xl disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Run Tests
                </button>

                <button
                  onClick={getAiReview}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-2xl disabled:opacity-50"
                >
                  <Bot className="w-4 h-4" />
                  AI Review
                </button>

                <button
                  onClick={submitSolution}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white text-sm font-black rounded-2xl disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={language === "python" ? "python" : language === "javascript" ? "javascript" : language === "typescript" ? "typescript" : language === "cpp" ? "cpp" : "java"}
                value={code}
                onChange={(value) => setCode(value)}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 15,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
                theme="vs-dark"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}