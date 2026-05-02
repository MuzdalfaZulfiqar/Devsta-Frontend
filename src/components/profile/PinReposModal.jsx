import { useState } from "react";
import { Star, GitFork, X, Pin } from "lucide-react";

export default function PinReposModal({ repos, pinnedIds, onSave, onClose }) {
  const [selected, setSelected] = useState(new Set(pinnedIds));

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 6) return prev; // cap at 6
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Pin Repositories</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select up to 6 repos to feature on your profile ({selected.size}/6)
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Repo list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2">
          {repos.map((repo) => {
            const isPinned = selected.has(repo.id);
            const isDisabled = !isPinned && selected.size >= 6;
            return (
              <button
                key={repo.id}
                onClick={() => toggle(repo.id)}
                disabled={isDisabled}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isPinned
                    ? "border-primary bg-primary/5"
                    : isDisabled
                    ? "border-gray-200 dark:border-gray-700 opacity-40 cursor-not-allowed"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {repo.name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {isPinned && <Pin size={13} className="text-primary" />}
                    <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      isPinned ? "bg-primary border-primary" : "border-gray-300"
                    }`}>
                      {isPinned && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
                {repo.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{repo.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="flex items-center gap-1">
                    <Star size={11} /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={11} /> {repo.forks_count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave([...selected])}
            className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90"
          >
            Save ({selected.size} pinned)
          </button>
        </div>
      </div>
    </div>
  );
}