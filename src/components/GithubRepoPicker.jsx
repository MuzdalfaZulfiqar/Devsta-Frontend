import { useState, useEffect } from "react";
import axios from "axios";
import { Github, Star, GitFork, Check, Loader2, Info } from "lucide-react";
import { BACKEND_URL } from "../../config";
import { useAuth } from "../context/AuthContext";

const LANG_COLORS = {
  JavaScript:  "#f7df1e",
  TypeScript:  "#2b7489",
  Python:      "#3572A5",
  Go:          "#00ADD8",
  Rust:        "#dea584",
  Java:        "#b07219",
  "C++":       "#f34b7d",
  "C#":        "#178600",
  Ruby:        "#701516",
  PHP:         "#4F5D95",
  Swift:       "#F05138",
  Kotlin:      "#A97BFF",
  Dart:        "#00B4AB",
  Shell:       "#89e051",
  HTML:        "#e34c26",
  CSS:         "#563d7c",
};

export default function GithubRepoPicker({ onSaved }) {
  const { user, token } = useAuth();

  const [repos,    setRepos]    = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (!user?._id || !token) return;
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/resume/repo-selection/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        setRepos(r.data.repos || []);
        setSelected(new Set(r.data.selectedIds || []));
      })
      .catch(() => setError("Failed to load GitHub repos."))
      .finally(() => setLoading(false));
  }, [user?._id, token]);

  const toggle = (id) => {
    setSaved(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 6) {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await axios.put(
        `${BACKEND_URL}/api/resume/repo-selection`,
        { selectedIds: [...selected] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      onSaved?.([...selected]);
    } catch {
      setError("Failed to save selection. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-sm text-gray-500 py-6 justify-center">
      <Loader2 className="w-4 h-4 animate-spin" />
      Loading your GitHub repos…
    </div>
  );

  if (error) return (
    <p className="text-sm text-red-500 py-4">{error}</p>
  );

  if (!repos.length) return (
    <div className="text-center py-8">
      <Github className="w-8 h-8 text-gray-300 mx-auto mb-2" />
      <p className="text-sm text-gray-500">
        No GitHub repos found.
        <br />Connect your GitHub account to enable this feature.
      </p>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Selected{" "}
            <span className="font-semibold text-gray-900">{selected.size}</span>
            {" "}/ 6 repos
          </span>
          {selected.size === 6 && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Max reached
            </span>
          )}
        </div>
        {selected.size === 0 && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            <Info className="w-3 h-3" />
            AI will auto-pick the best repos
          </div>
        )}
      </div>

      {/* Repo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {repos.map((repo) => {
          const isPicked   = selected.has(repo.id);
          const isDisabled = !isPicked && selected.size >= 6;

          return (
            <button
              key={repo.id}
              onClick={() => !isDisabled && toggle(repo.id)}
              disabled={isDisabled}
              className={[
                "text-left p-4 rounded-xl border-2 transition-all relative w-full",
                isPicked
                  ? "border-indigo-500 bg-indigo-50/50"
                  : isDisabled
                    ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-gray-300",
              ].join(" ")}
            >
              {/* Checkmark */}
              {isPicked && (
                <span className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}

              {/* Repo name */}
              <div className="flex items-center gap-1.5 mb-1 pr-7">
                <Github className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-sm truncate">
                  {repo.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 mb-3 leading-relaxed min-h-[2.5rem] line-clamp-3">
                {repo.description || (
                  <span className="italic text-gray-400">
                    No description — AI will write one
                  </span>
                )}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-3">
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        background: LANG_COLORS[repo.language] || "#888",
                      }}
                    />
                    <span className="text-xs text-gray-500">{repo.language}</span>
                  </div>
                )}
                <div className="ml-auto flex items-center gap-3">
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Star className="w-3 h-3" />
                      {repo.stars}
                    </span>
                  )}
                  {repo.forks > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <GitFork className="w-3 h-3" />
                      {repo.forks}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #4338ca, #6366f1)" }}
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            : saved
              ? <><Check className="w-4 h-4" /> Saved!</>
              : "Save selection"}
        </button>

        {selected.size > 0 && (
          <button
            onClick={() => { setSelected(new Set()); setSaved(false); }}
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
          >
            Clear selection
          </button>
        )}

        {saved && (
          <span className="text-xs text-green-600 font-medium">
            ✓ Will be included in your next resume generation
          </span>
        )}
      </div>
    </div>
  );
}
