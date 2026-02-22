// components/company/AIChallengeModal.jsx
import { useState } from "react";

export default function AIChallengeModal({ isOpen, onClose, onSubmit }) {
  const [numChallenges, setNumChallenges] = useState(1);
  const [difficulty, setDifficulty] = useState("Intermediate"); // default

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass both values to parent
    onSubmit({
      numberOfChallenges: Number(numChallenges),
      difficulty,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-96 max-w-[95vw]">
        <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
          Generate AI Challenges
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Number of challenges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Number of challenges
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={numChallenges}
              onChange={(e) => setNumChallenges(e.target.value)}
              className="
                w-full px-4 py-2.5 border rounded-lg 
                border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-900 
                text-gray-900 dark:text-white 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
            />
          </div>

          {/* Difficulty selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Difficulty level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="
                w-full px-4 py-2.5 border rounded-lg 
                border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-900 
                text-gray-900 dark:text-white 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
            >
              <option value="Easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-5 py-2 bg-gray-200 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200 
                rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                transition-colors
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                px-5 py-2 bg-blue-600 hover:bg-blue-700 
                text-white rounded-lg transition-colors
              "
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
