// src/components/company/ManualChallengeModal.jsx
import { useState, useEffect } from "react";

export default function ManualChallengeModal({ isOpen, onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [timeLimit, setTimeLimit] = useState(30);
  const [constraints, setConstraints] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", expected_output: "" }]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setProblemStatement(initialData.problemStatement || "");
      setDifficulty(initialData.difficulty || "Intermediate");
      setTimeLimit(initialData.timeLimit || 30);
      setConstraints(initialData.constraints || "");
      setTestCases(
        initialData.testCases?.length > 0
          ? initialData.testCases
          : [{ input: "", expected_output: "" }]
      );
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle("");
    setProblemStatement("");
    setDifficulty("Intermediate");
    setTimeLimit(30);
    setConstraints("");
    setTestCases([{ input: "", expected_output: "" }]);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", expected_output: "" }]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const invalid = testCases.some((tc) => !tc.input.trim() || !tc.expected_output.trim());
    if (invalid) {
      alert("Please fill both Input and Expected Output for every test case.");
      return;
    }

    const payload = { title, problemStatement, difficulty,timeLimit: Number(timeLimit), constraints, testCases };
    onSubmit(payload);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="
          bg-white dark:bg-gray-850 
          rounded-2xl 
          shadow-2xl 
          max-w-2xl w-full mx-4 
          max-h-[92vh] 
          flex flex-col 
          border border-gray-200 dark:border-gray-700
          overflow-hidden
        "
      >
        {/* Header with close button */}
        <div className="relative px-8 py-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-10">
            {initialData ? "Edit Manual Challenge" : "Add Manual Challenge"}
          </h2>

          {/* Close (×) button */}
          <button
            onClick={onClose}
            className="
              absolute right-6 top-6 
              text-gray-500 hover:text-gray-700 
              dark:text-gray-400 dark:hover:text-gray-200 
              text-2xl leading-none 
              focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full
              transition-colors
            "
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="
            flex-1 
            overflow-y-auto 
            scrollbar-hide 
            px-8 py-7
          "
        >
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="
                  w-full px-4 py-2.5 border rounded-lg 
                  border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  outline-none transition-all
                "
              />
            </div>

            {/* Problem Statement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Problem Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                required
                rows={5}
                className="
                  w-full px-4 py-2.5 border rounded-lg 
                  border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  outline-none transition-all resize-y min-h-[120px]
                "
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="
                  w-full px-4 py-2.5 border rounded-lg 
                  border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  outline-none transition-all
                "
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Recommended Time Limit (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="5"
                max="180"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                required
                className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 30"
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Suggested: Easy ≈ 20 min, Intermediate ≈ 35 min, Hard ≈ 60+ min
              </p>
            </div>

            {/* Constraints */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Constraints (optional)
              </label>
              <textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                rows={3}
                className="
                  w-full px-4 py-2.5 border rounded-lg 
                  border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  outline-none transition-all resize-y
                "
              />
            </div>

            {/* Test Cases */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Cases <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddTestCase}
                  className="
                    text-blue-600 hover:text-blue-700 
                    dark:text-blue-400 dark:hover:text-blue-300 
                    text-sm font-medium transition-colors
                  "
                >
                  + Add Test Case
                </button>
              </div>

              <div className="space-y-5">
                {testCases.map((tc, index) => (
                  <div
                    key={index}
                    className="
                      p-5 bg-gray-50 dark:bg-gray-900/50 
                      rounded-xl border border-gray-200 dark:border-gray-700
                    "
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Test Case {index + 1}
                      </span>
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(index)}
                          className="
                            text-red-500 hover:text-red-600 
                            dark:text-red-400 dark:hover:text-red-300 
                            text-sm transition-colors
                          "
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Input"
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                        required
                        className="
                          w-full px-4 py-2.5 border rounded-lg 
                          border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-900 
                          text-gray-900 dark:text-white 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          outline-none transition-all
                        "
                      />
                      <input
                        type="text"
                        placeholder="Expected Output"
                        value={tc.expected_output}
                        onChange={(e) => handleTestCaseChange(index, "expected_output", e.target.value)}
                        required
                        className="
                          w-full px-4 py-2.5 border rounded-lg 
                          border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-900 
                          text-gray-900 dark:text-white 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          outline-none transition-all
                        "
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons – always visible at bottom */}
            <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="
                  px-7 py-2.5 bg-gray-200 dark:bg-gray-700 
                  text-gray-800 dark:text-gray-200 
                  rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                  transition-colors font-medium
                "
              >
                Cancel
              </button>
              <button
                type="submit"
                className="
                  px-7 py-2.5 bg-green-600 hover:bg-green-700 
                  text-white rounded-lg 
                  transition-colors font-medium shadow-sm
                "
              >
                {initialData ? "Update Challenge" : "Save Challenge"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}