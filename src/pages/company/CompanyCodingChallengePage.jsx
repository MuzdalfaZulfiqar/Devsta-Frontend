// src/components/company/CompanyCodingChallengePage.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { useCompanyAuth } from "../../context/CompanyAuthContext";
import {
  getJobChallenges,
  generateAIChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  updateChallengeStatus,
} from "../../api/company/challenges";
import ConfirmModal from "../../components/ConfirmModal";
import { saveJobTestConfig } from "../../api/company/jobs";
import { showToast } from "../../utils/toast";
import { getJobById } from "../../api/company/jobs";
import AIChallengeModal from "../../components/company/AIChallengeModal";
import JobDetailCard from "../../components/company/JobDetailCard";
import ChallengeCard from "../../components/company/ChallengeCard";
import ManualChallengeModal from "../../components/company/ManualChallengeModal";

export default function CompanyCodingChallengePage() {
  const { jobId } = useParams();
  const { token } = useCompanyAuth();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);

  const [isAIChallengeModalOpen, setIsAIChallengeModalOpen] = useState(false);
  const [isManualChallengeModalOpen, setIsManualChallengeModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");

  // Test configuration states
  const [selectedIds, setSelectedIds] = useState([]);
  const [challengeTimes, setChallengeTimes] = useState({});
  const [totalTimeOverride, setTotalTimeOverride] = useState(0);

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  // Tabs
  const [activeTab, setActiveTab] = useState("pending");

  // Filtered lists
  const pendingChallenges = useMemo(
    () => challenges.filter((c) => c.type === "ai" && c.status === "pending"),
    [challenges]
  );

  const acceptedChallenges = useMemo(
    () =>
      challenges.filter(
        (c) => (c.type === "ai" && c.status === "accepted") || c.type === "manual"
      ),
    [challenges]
  );

  const rejectedChallenges = useMemo(
    () => challenges.filter((c) => c.type === "ai" && c.status === "rejected"),
    [challenges]
  );

  // Selected only from accepted
  const selectedChallenges = useMemo(
    () =>
      selectedIds
        .map((id) => acceptedChallenges.find((c) => c._id === id))
        .filter(Boolean)
        .sort((a, b) => selectedIds.indexOf(a._id) - selectedIds.indexOf(b._id)),
    [selectedIds, acceptedChallenges]
  );

  // Real sum of individual challenge times (for validation & display)
  const realSumOfTimes = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const challenge = acceptedChallenges.find((c) => c._id === id);
      return sum + (challengeTimes[id] || challenge?.timeLimit || 30);
    }, 0);
  }, [selectedIds, acceptedChallenges, challengeTimes]);

  // Display total (override if set, else real sum)
  const displayedTotalTime = totalTimeOverride || realSumOfTimes;

  // Fetch data
  const fetchChallenges = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getJobChallenges(jobId);
      setChallenges(data.challenges || []);
    } catch (err) {
      showToast(err.message || "Failed to load challenges", 4000);
    } finally {
      setLoading(false);
    }
  };

  const fetchJob = async () => {
    if (!token) return;
    setLoadingJob(true);
    try {
      const data = await getJobById(jobId);
      setJob(data);
    } catch (err) {
      showToast(err.message || "Failed to load job details", 4000);
    } finally {
      setLoadingJob(false);
    }
  };

  useEffect(() => {
    if (jobId && token) {
      fetchChallenges();
      fetchJob();
    }
  }, [jobId, token]);

  // Pre-fill selected config
  useEffect(() => {
    if (job?.selectedChallenges) {
      const ids = job.selectedChallenges.map((s) => s.challengeId.toString());
      setSelectedIds(ids);

      const times = {};
      job.selectedChallenges.forEach((s) => {
        times[s.challengeId.toString()] = s.timeLimit;
      });
      setChallengeTimes(times);

      setTotalTimeOverride(job.testTotalTime || 0);
    }
  }, [job]);

  // Handlers
  const handleToggleInclude = (challengeId, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, challengeId] : prev.filter((id) => id !== challengeId)
    );
  };

  const handleTimeChange = (challengeId, newTime) => {
    setChallengeTimes((prev) => ({ ...prev, [challengeId]: Number(newTime) }));
  };

  const handleSaveTestConfig = async () => {
    if (selectedIds.length === 0) {
      showToast("Select at least one challenge to include.", 4000);
      return;
    }

    // Prevent save if override is set AND shorter than real sum
    if (totalTimeOverride > 0 && totalTimeOverride < realSumOfTimes) {
      showToast(
        `Total time (${totalTimeOverride} min) is less than the sum of individual challenge times (${realSumOfTimes} min). Please increase total time or set it to 0 (auto-sum).`,
        7000
      );
      return;
    }

    try {
      const selected = selectedIds.map((id, index) => {
        const challenge = acceptedChallenges.find((c) => c._id === id);
        return {
          challengeId: id,
          timeLimit: challengeTimes[id] || challenge?.timeLimit || 30,
          order: index,
        };
      });

      const config = {
        selectedChallenges: selected,
        testTotalTime: totalTimeOverride || 0,
      };

      await saveJobTestConfig(jobId, config);
      showToast("Test configuration saved successfully!", 4000);
      fetchJob();
    } catch (err) {
      showToast(err.message || "Failed to save configuration.", 4000);
    }
  };

  const handleAIAction = async (id, action) => {
    const previousStatus = challenges.find((c) => c._id === id)?.status;
    setChallenges((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: action } : c))
    );

    try {
      await updateChallengeStatus(jobId, id, action);
      showToast(`Challenge ${action} successfully!`, 4000);
    } catch (err) {
      setChallenges((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: previousStatus || "pending" } : c))
      );
      showToast(err.message || "Failed to update status.", 4000);
    }
  };

  const handleManualSubmit = async (payload) => {
    try {
      if (editingChallenge) {
        await updateChallenge(jobId, editingChallenge._id, payload);
        showToast("Challenge updated successfully!", 4000);
      } else {
        await createChallenge(jobId, payload);
        showToast("Challenge created successfully!", 4000);
      }
      setIsManualChallengeModalOpen(false);
      setEditingChallenge(null);
      fetchChallenges();
    } catch (err) {
      showToast(err.message || "Failed to save challenge.", 4000);
    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setIsManualChallengeModalOpen(true);
  };

  const handleDelete = (id, type) => {
    if (type === "ai") return;
    setChallengeToDelete({ id, type });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!challengeToDelete) return;
    const { id } = challengeToDelete;

    try {
      await deleteChallenge(jobId, id);
      showToast("Manual challenge deleted successfully!", 4000);
      fetchChallenges();
    } catch (err) {
      showToast(err.message || "Failed to delete challenge.", 4000);
    } finally {
      setShowDeleteConfirm(false);
      setChallengeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setChallengeToDelete(null);
  };

  const handleGenerateAI = async ({ numberOfChallenges, difficulty }) => {
    if (!token || !job?.isActive) return;

    setIsGeneratingAI(true);
    setGenerationStatus("Analyzing job description...");
    setIsAIChallengeModalOpen(false);

    const messages = [
      "Analyzing the job description...",
      "Understanding required skills...",
      "Brainstorming creative coding problems...",
      "Matching the perfect difficulty level...",
      "Crafting detailed problem statements...",
      "Designing realistic test cases...",
      "Ensuring uniqueness and no duplicates...",
      "Polishing challenge quality...",
      "Almost ready — AI is thinking deeply...",
      "Final sanity check on generated challenges...",
      "Preparing your new coding challenges...",
    ];
    let messageIndex = 0;
    const interval = setInterval(() => {
      setGenerationStatus(messages[messageIndex % messages.length]);
      messageIndex++;
    }, 3000);

    try {
      const payload = {
        jobId: job._id,
        jobTitle: job.title,
        requiredSkills: job.requiredSkills,
        experienceLevel: job.experienceLevel,
        jobDescription: job.description,
        number_of_challenges: numberOfChallenges,
        difficulty,
        existing_problem_statements: challenges.map((c) => c.problemStatement),
      };

      const data = await generateAIChallenge(jobId, payload);

      const newChallenges = data.challenges.map((c) => ({
        ...c,
        type: "ai",
        status: "pending",
      }));

      setChallenges((prev) => [...newChallenges, ...prev]);
      showToast(
        `${newChallenges.length} AI challenge(s) generated! Check the Pending tab.`,
        4000
      );
    } catch (err) {
      console.error("AI generation failed:", err);
      showToast(err.message || "Failed to generate AI challenges.", 4000);
    } finally {
      clearInterval(interval);
      setIsGeneratingAI(false);
      setGenerationStatus("");
    }
  };

  return (
    <CompanyDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <JobDetailCard job={job} loading={loadingJob} />

        {!loadingJob && !job && (
          <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200">
            <p className="font-medium">Job information could not be loaded.</p>
            <p className="text-sm mt-1">Please refresh or check if the job exists.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 my-8">
          <button
            onClick={() => setIsAIChallengeModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            disabled={loadingJob || !job}
          >
            Generate AI Challenges
          </button>
          <button
            onClick={() => {
              setEditingChallenge(null);
              setIsManualChallengeModalOpen(true);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            disabled={loadingJob || !job}
          >
            Add Manual Challenge
          </button>
        </div>

        {!loading && challenges.length > 0 && (
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            <nav className="flex space-x-8 min-w-max" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition-all ${
                  activeTab === "pending"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                Pending ({pendingChallenges.length})
              </button>

              <button
                onClick={() => setActiveTab("accepted")}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition-all ${
                  activeTab === "accepted"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                Accepted ({acceptedChallenges.length})
              </button>

              <button
                onClick={() => setActiveTab("rejected")}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition-all ${
                  activeTab === "rejected"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                Rejected ({rejectedChallenges.length})
              </button>
            </nav>
          </div>
        )}

        {activeTab === "accepted" && acceptedChallenges.length > 0 && !loading && !loadingJob && job && (
          <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Test Configuration
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Select from accepted challenges below to include in the coding test. Customize time limits and set optional total duration.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Total Test Time (minutes):
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={totalTimeOverride}
                    onChange={(e) => setTotalTimeOverride(Number(e.target.value))}
                    placeholder="0 = auto-sum selected"
                    className="w-32 px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  {totalTimeOverride === 0 && selectedIds.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      (Auto: {realSumOfTimes} min)
                    </span>
                  )}
                </div>

                {/* Live warning when override is too short */}
                {totalTimeOverride > 0 && totalTimeOverride < realSumOfTimes && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
                    Warning: Total time ({totalTimeOverride} min) is less than the sum of challenge times ({realSumOfTimes} min). 
                    Candidates may run out of time — consider increasing it or setting to 0.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSaveTestConfig}
                disabled={selectedIds.length === 0}
                className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-sm min-w-[180px] ${
                  selectedIds.length === 0
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Save Configuration
              </button>

              <button
                onClick={() => setIsDrawerOpen(true)}
                disabled={selectedIds.length === 0}
                className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-sm min-w-[220px] ${
                  selectedIds.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                View Selected ({selectedIds.length})
              </button>
            </div>
          </div>
        )}

        {/* Challenges list */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Loading challenges...
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
              No coding challenges yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start by generating AI challenges or adding manual ones above.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Empty states */}
            {activeTab === "pending" && pendingChallenges.length === 0 && (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No pending AI challenges.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Click "Generate AI Challenges" above to create some.
                </p>
              </div>
            )}

            {activeTab === "accepted" && acceptedChallenges.length === 0 && (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No accepted challenges yet.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Accept AI-generated challenges from the Pending tab or add manual ones.
                </p>
              </div>
            )}

            {activeTab === "rejected" && rejectedChallenges.length === 0 && (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No rejected challenges yet.
                </p>
              </div>
            )}

            {(activeTab === "pending"
              ? pendingChallenges
              : activeTab === "accepted"
              ? acceptedChallenges
              : rejectedChallenges
            ).map((challenge) => (
              <ChallengeCard
                key={challenge._id}
                challenge={challenge}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAIAction={handleAIAction}
                isSelected={selectedIds.includes(challenge._id)}
                onToggleInclude={handleToggleInclude}
                timeLimit={challengeTimes[challenge._id] || challenge.timeLimit || 30}
                onTimeChange={handleTimeChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Challenge?"
        message="This will permanently remove the manual challenge. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Generating Overlay */}
      {isGeneratingAI && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-2xl max-w-md w-full mx-4 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-slow"></div>
              </div>

              <div className="text-lg font-medium text-gray-800 dark:text-gray-200 min-h-[1.5rem]">
                {generationStatus || "Generating AI challenges..."}
              </div>

              <div className="text-4xl text-blue-600 dark:text-blue-400 tracking-widest">
                <span className="animate-pulse inline-block">.</span>
                <span className="animate-pulse delay-150 inline-block">.</span>
                <span className="animate-pulse delay-300 inline-block">.</span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                This usually takes 10–40 seconds depending on complexity
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Challenges Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Selected Challenges ({selectedChallenges.length})
            </h3>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            These challenges will be included in the coding test, in this order.
          </p>

          {selectedChallenges.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No challenges selected yet.</p>
          ) : (
            <ul className="space-y-4">
              {selectedChallenges.map((ch, index) => (
                <li key={ch._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {index + 1}. {ch.title}
                      </span>
                      <span className="ml-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {ch.difficulty}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {challengeTimes[ch._id] || ch.timeLimit || 30} min
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-sm font-medium">
              <span>Total Time:</span>
              <span>{displayedTotalTime} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      <AIChallengeModal
        isOpen={isAIChallengeModalOpen}
        onClose={() => setIsAIChallengeModalOpen(false)}
        onSubmit={handleGenerateAI}
      />

      <ManualChallengeModal
        isOpen={isManualChallengeModalOpen}
        onClose={() => {
          setIsManualChallengeModalOpen(false);
          setEditingChallenge(null);
        }}
        onSubmit={handleManualSubmit}
        initialData={editingChallenge}
      />
    </CompanyDashboardLayout>
  );
}