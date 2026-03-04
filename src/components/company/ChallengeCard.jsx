// components/company/ChallengeCard.jsx
export default function ChallengeCard({
  challenge,
  onEdit,
  onDelete,
  onAIAction,
  isSelected,
  onToggleInclude,
  timeLimit,
  onTimeChange,
}) {
  const canInclude = challenge.status === "accepted" || challenge.type === "manual";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {challenge.title}
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              challenge.type === "ai"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {challenge.type === "ai" ? "AI Generated" : "Manual"}
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              challenge.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : challenge.difficulty === "Intermediate"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            } dark:bg-opacity-20`}
          >
            {challenge.difficulty}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Time: {challenge.timeLimit || "N/A"} min
          </span>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 text-base leading-relaxed">
        {challenge.problemStatement}
      </p>

      {challenge.constraints && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Constraints:</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{challenge.constraints}</p>
        </div>
      )}

      {challenge.testCases?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Test Cases:</h4>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 text-sm">
            {challenge.testCases.map((tc, index) => (
              <li key={index}>
                Input: {tc.input} | Expected Output: {tc.expected_output}
              </li>
            ))}
          </ul>
        </div>
      )}

      {challenge.type === "ai" && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Status:</h4>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              challenge.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : challenge.status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } dark:bg-opacity-20`}
          >
            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-end items-center">
        {challenge.type === "manual" && (
          <>
            <button
              onClick={() => onEdit(challenge)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(challenge._id, challenge.type)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </>
        )}

        {challenge.type === "ai" && challenge.status === "pending" && (
          <>
            <button
              onClick={() => onAIAction(challenge._id, "accepted")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Accept
            </button>
            <button
              onClick={() => onAIAction(challenge._id, "rejected")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Reject
            </button>
          </>
        )}

        {canInclude && (
          <>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              Include in Test
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onToggleInclude(challenge._id, e.target.checked)}
                className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Time (min):
              </label>
              <input
                type="number"
                min="5"
                value={timeLimit}
                onChange={(e) => onTimeChange(challenge._id, e.target.value)}
                className="w-20 px-2 py-1 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}