// src/components/coding/CodingEnvironment.jsx
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Terminal, FileCode, Code2 } from "lucide-react";
import * as ResizablePanels from "react-resizable-panels";

const LANGUAGE_TEMPLATES = {
  javascript: `// Write your solution here
function solution(input) {
  // TODO
  return input;
}

// Test locally:
console.log(solution("test input"));`,
  python: `# Write your solution here
def solution(input):
    # TODO
    return input

# Test locally:
print(solution("test input"))`,
  java: `public class Solution {
    public static String solution(String input) {
        // TODO
        return input;
    }

    public static void main(String[] args) {
        System.out.println(solution("test input"));
    }
}`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

string solution(string input) {
    // TODO
    return input;
}

int main() {
    cout << solution("test input") << endl;
    return 0;
}`,
};

export default function CodingEnvironment() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput("Running...\n");

    setTimeout(() => {
      setOutput((prev) =>
        prev +
        `Mock execution complete.\n` +
        `Language: ${language}\n` +
        `Code length: ${code.length} chars\n` +
        `Sample output: "Hello from mock runner!"\n`
      );
      setIsRunning(false);
    }, 1200);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang]);
    setOutput("");
  };

  const getExtension = () => {
    switch (language) {
      case "javascript":
        return "js";
      case "python":
        return "py";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "txt";
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100">
      {/* Top Bar */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <FileCode className="w-6 h-6 text-blue-400" />
          <h1 className="text-lg font-semibold">Coding Challenge</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-gray-400" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium transition-all ${
              isRunning
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
            }`}
          >
            <Play size={18} />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Split Layout */}
      <ResizablePanels.PanelGroup
        direction="horizontal"
        className="flex-1"
      >
        {/* Left Panel */}
        <ResizablePanels.Panel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 text-sm font-medium">
              solution.{getExtension()}
            </div>

            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                }}
              />
            </div>
          </div>
        </ResizablePanels.Panel>

        {/* Resize Handle */}
        <ResizablePanels.PanelResizeHandle className="w-2 bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center">
          <div className="w-1 h-8 bg-gray-600 rounded-full" />
        </ResizablePanels.PanelResizeHandle>

        {/* Right Panel */}
        <ResizablePanels.Panel defaultSize={40} minSize={30}>
          <div className="h-full flex flex-col">
            {/* Console */}
            <div className="flex-1 flex flex-col min-h-0 border-b border-gray-800">
              <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center gap-2">
                <Terminal size={18} className="text-gray-400" />
                <span className="font-medium">Console Output</span>
              </div>

              <pre className="flex-1 p-4 bg-gray-950 overflow-auto font-mono text-sm whitespace-pre-wrap break-words">
                {output || "Click 'Run Code' to execute your solution..."}
              </pre>
            </div>

            {/* Test Cases */}
            <div className="h-1/3 min-h-[180px] bg-gray-900 flex flex-col">
              <div className="px-4 py-2 border-b border-gray-800 font-medium">
                Sample Test Cases
              </div>

              <div className="flex-1 p-4 overflow-auto text-sm space-y-4">
                <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                  <div className="font-medium mb-1 text-green-400">
                    Test Case 1 - Passed (mock)
                  </div>

                  <div className="text-gray-300">
                    Input:{" "}
                    <code className="bg-gray-900 px-1.5 py-0.5 rounded">
                      test input
                    </code>
                    <br />
                    Expected:{" "}
                    <code className="bg-gray-900 px-1.5 py-0.5 rounded">
                      expected output
                    </code>
                    <br />
                    Your output:{" "}
                    <code className="bg-gray-900 px-1.5 py-0.5 rounded">
                      expected output
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanels.Panel>
      </ResizablePanels.PanelGroup>
    </div>
  );
}