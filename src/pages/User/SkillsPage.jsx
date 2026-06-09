
import React, { useEffect, useMemo, useState } from "react";
import {
  addMySkillTimeLog,
  completeMySkillLesson,
  generateMySkillInsights,
  getMySkillGraph,
  getMySkillGoal,
  getMySkillGoals,
  getMySkillRoadmaps,
  getMySkillsDashboard,
  getMySkillRoadmapProgress,
  initMySkillRoadmapProgress,
  saveMySkillGoal,
  deleteMySkillRoadmap,
} from "../../api/user/skillInsights";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import LessonCompleteModal from "../../components/skills/LessonCompleteModal";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2, Target } from "lucide-react";

import ActivityTab from "../../components/skills/skillsPage/ActivityTab";
import GoalModal from "../../components/skills/skillsPage/GoalModal";
import JourneyTab from "../../components/skills/skillsPage/JourneyTab";
import OverviewTab from "../../components/skills/skillsPage/OverviewTab";
import RoadmapTab from "../../components/skills/skillsPage/RoadmapTab";
import { DEFAULT_GOAL_FORM, TABS } from "../../components/skills/skillsPage/constants";
import {
  fillGoalFormFromGoal,
  getFocusSkillsArray,
  getGoalIdFromRoadmap,
  getGroupedGraphNodes,
} from "../../components/skills/skillsPage/skillPageUtils";

export default function SkillsPage() {
  const { user, token, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [savingGoal, setSavingGoal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [roadmapActionLoading, setRoadmapActionLoading] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [dashboard, setDashboard] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState(null);
  const [graph, setGraph] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState("");
  const [selectedRoadmapProgress, setSelectedRoadmapProgress] = useState(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  const [goalForm, setGoalForm] = useState(DEFAULT_GOAL_FORM);
  const [pendingLesson, setPendingLesson] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [expandedRoadmapIds, setExpandedRoadmapIds] = useState([]);
  const [expandedMilestoneIds, setExpandedMilestoneIds] = useState([]);

  const graphGroups = useMemo(() => getGroupedGraphNodes(graph), [graph]);

  const metrics = dashboard?.metrics || {
    skillScore: 0,
    hoursInvested30d: 0,
    skillsClosedThisMonth: 0,
    pathCompletionPercent: 0,
  };

  const recentAchievements = dashboard?.recentAchievements || [];

  const selectedRoadmap =
    roadmaps.find((roadmap) => String(roadmap._id) === String(selectedRoadmapId)) || null;

  const completedLessonIds = new Set(
    (selectedRoadmapProgress?.completedLessonIds || []).map((id) => String(id))
  );

  async function loadDashboardOnly() {
    const response = await getMySkillsDashboard();
    setDashboard(response?.dashboard || null);
  }

  async function handleDeleteRoadmap(roadmapId) {
    const roadmapToDelete = roadmaps.find(
      (roadmap) => String(roadmap._id) === String(roadmapId)
    );
  
    const confirmed = window.confirm(
      `Are you sure you want to delete "${roadmapToDelete?.title || "this roadmap"}"? This action cannot be undone.`
    );
  
    if (!confirmed) return;
  
    try {
      setRoadmapActionLoading(`delete-${roadmapId}`);
      setStatusMessage("");
      setErrorMessage("");
  
      await deleteMySkillRoadmap(roadmapId);
  
      setExpandedRoadmapIds((previous) =>
        previous.filter((id) => String(id) !== String(roadmapId))
      );
      setExpandedMilestoneIds([]);
  
      const preferredRoadmapId =
        String(selectedRoadmapId) === String(roadmapId) ? "" : selectedRoadmapId;
  
      await reloadRoadmapsAndKeepSelection(preferredRoadmapId);
      await loadDashboardOnly();
  
      setStatusMessage("Roadmap deleted successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete roadmap");
    } finally {
      setRoadmapActionLoading("");
    }
  }
  
  async function loadRoadmapContext(roadmap) {
    if (!roadmap?._id) {
      setSelectedRoadmapId("");
      setSelectedRoadmapProgress(null);
      setGraph(null);
      setSelectedGraphNode(null);
      return;
    }

    setSelectedRoadmapId(roadmap._id);

    const goalId = getGoalIdFromRoadmap(roadmap);

    const [progressResponse, graphResponse] = await Promise.all([
      getMySkillRoadmapProgress(roadmap._id).catch(() => ({ progress: null })),
      goalId ? getMySkillGraph(goalId).catch(() => ({ graph: null })) : Promise.resolve({ graph: null }),
    ]);

    const graphData = graphResponse?.graph || null;

    setSelectedRoadmapProgress(progressResponse?.progress || null);
    setGraph(graphData);

    if (graphData?.nodes?.length) {
      const targetNode = graphData.nodes.find((node) => node.type === "target") || graphData.nodes[0];
      setSelectedGraphNode(targetNode || null);
    } else {
      setSelectedGraphNode(null);
    }
  }

  async function loadSkillsPageData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [dashboardResponse, goalsResponse, activeGoalResponse, roadmapsResponse] = await Promise.all([
        getMySkillsDashboard(),
        getMySkillGoals(),
        getMySkillGoal(),
        getMySkillRoadmaps("", { scope: "all" }),
      ]);

      const goalsData = goalsResponse?.goals || [];
      const activeGoalData = activeGoalResponse?.goal || null;
      const allRoadmaps = roadmapsResponse?.roadmaps || [];

      setDashboard(dashboardResponse?.dashboard || null);
      setGoals(goalsData);
      setGoal(activeGoalData || null);
      setGoalForm(fillGoalFormFromGoal(activeGoalData || null, DEFAULT_GOAL_FORM));
      setRoadmaps(allRoadmaps);

      if (allRoadmaps.length) {
        await loadRoadmapContext(allRoadmaps[0]);
      } else {
        setSelectedRoadmapId("");
        setSelectedRoadmapProgress(null);
        setGraph(null);
        setSelectedGraphNode(null);
      }
    } catch (error) {
      console.error("loadSkillsPageData error:", error);
      setErrorMessage(error.message || "Failed to load skills page");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkillsPageData();
  }, []);

  useEffect(() => {
    if (!statusMessage) return undefined;

    const timer = setTimeout(() => {
      setStatusMessage("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  async function reloadRoadmapsAndKeepSelection(preferredRoadmapId = selectedRoadmapId) {
    const roadmapsResponse = await getMySkillRoadmaps("", { scope: "all" });
    const allRoadmaps = roadmapsResponse?.roadmaps || [];
    setRoadmaps(allRoadmaps);

    const roadmapToSelect =
      allRoadmaps.find((roadmap) => String(roadmap._id) === String(preferredRoadmapId)) ||
      allRoadmaps[0] ||
      null;

    if (roadmapToSelect) {
      await loadRoadmapContext(roadmapToSelect);
    } else {
      await loadRoadmapContext(null);
    }
  }

  async function handleSaveGoal(event) {
    event.preventDefault();

    try {
      setSavingGoal(true);
      setStatusMessage("");
      setErrorMessage("");

      const payload = {
        goalId: goal?._id || undefined,
        targetTitle: goalForm.targetTitle.trim(),
        targetRole: goalForm.targetRole.trim(),
        targetCompany: goalForm.targetCompany.trim(),
        experienceLevel: goalForm.experienceLevel || "other",
        focusSkills: getFocusSkillsArray(goalForm.focusSkillsText),
        timeline: goalForm.timeline,
        weeklyAvailability: goalForm.weeklyAvailability,
        preferredResourceType: goalForm.preferredResourceType,
        budgetPreference: goalForm.budgetPreference,
        preferredDifficulty: goalForm.preferredDifficulty,
        setAsActive: true,
      };

      const response = await saveMySkillGoal(payload);
      const savedGoal = response?.goal || null;

      setGoal(savedGoal);
      setGoalForm(fillGoalFormFromGoal(savedGoal, DEFAULT_GOAL_FORM));

      const goalsResponse = await getMySkillGoals();
      setGoals(goalsResponse?.goals || []);

      await loadDashboardOnly();
      setStatusMessage(goal?._id ? "Target updated successfully." : "Target saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to save target");
    } finally {
      setSavingGoal(false);
    }
  }

  async function handleGenerateInsights(goalId = goal?._id) {
    if (!goalId) {
      setErrorMessage("Please save a target first.");
      return;
    }

    try {
      setGenerating(true);
      setStatusMessage("");
      setErrorMessage("");

      const response = await generateMySkillInsights(goalId);
      const generatedRoadmap = response?.roadmaps?.[0] || null;

      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(generatedRoadmap?._id || selectedRoadmapId);

      setActiveTab("roadmap");
      setShowGoalModal(false);
      setStatusMessage("Journey and roadmap generated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to generate insights");
    } finally {
      setGenerating(false);
    }
  }

  function handleCreateNewTarget() {
    setGoal(null);
    setGoalForm(DEFAULT_GOAL_FORM);
    setShowGoalModal(true);
    setStatusMessage("");
    setErrorMessage("");
  }

  function handleEditGoal(selectedGoal) {
    setGoal(selectedGoal);
    setGoalForm(fillGoalFormFromGoal(selectedGoal, DEFAULT_GOAL_FORM));
    setShowGoalModal(true);
    setStatusMessage("");
    setErrorMessage("");
  }

  async function handleViewGoalRoadmaps(selectedGoal) {
    const firstRoadmap = roadmaps.find(
      (roadmap) => getGoalIdFromRoadmap(roadmap) === String(selectedGoal._id)
    );

    if (firstRoadmap) {
      await loadRoadmapContext(firstRoadmap);
      setActiveTab("roadmap");
      return;
    }

    setGoal(selectedGoal);
    setGoalForm(fillGoalFormFromGoal(selectedGoal, DEFAULT_GOAL_FORM));
    await handleGenerateInsights(selectedGoal._id);
  }

  async function handleSelectRoadmap(roadmap) {
    try {
      setStatusMessage("");
      setErrorMessage("");
      await loadRoadmapContext(roadmap);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load roadmap details");
    }
  }

  async function handleInitializeProgress(roadmapId) {
    try {
      setRoadmapActionLoading(`init-${roadmapId}`);
      await initMySkillRoadmapProgress(roadmapId);
      await loadRoadmapContext(selectedRoadmap);
      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(roadmapId);
      setStatusMessage("Roadmap progress initialized successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to initialize roadmap progress");
    } finally {
      setRoadmapActionLoading("");
    }
  }

  function handleCompleteLesson(roadmapId, lesson) {
    setPendingLesson({ ...lesson, roadmapId });
  }
  async function refreshCurrentUserAfterSkillSync() {
    if (!token || !setUser) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) return;
  
      const freshUser = await response.json();
      setUser(freshUser.user ?? freshUser);
    } catch (error) {
      console.warn("Failed to refresh user after skill sync:", error);
    }
  }
  async function handleLessonConfirm({ lessonId, minutes, understanding, note }) {
    if (!pendingLesson?.roadmapId) return;

    const roadmapId = pendingLesson.roadmapId;

    try {
      setRoadmapActionLoading(`lesson-${lessonId}`);
      setStatusMessage("");
      setErrorMessage("");

      const response = await completeMySkillLesson(roadmapId, lessonId, {
        minutes,
        understanding,
        note,
      });

      // ✅ Backend now returns the refreshed user after syncing completed skills into topSkills.
      if (response?.updatedUser && setUser) {
        setUser(response.updatedUser);
      } else {
        await refreshCurrentUserAfterSkillSync();
      }

      await loadRoadmapContext(selectedRoadmap);
      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(roadmapId);

      const addedSkills = response?.skillSync?.topSkillsAdded || [];
      setStatusMessage(
        addedSkills.length
          ? `Learning saved. Added to top skills: ${addedSkills.slice(0, 4).join(", ")}${
              addedSkills.length > 4 ? "..." : ""
            }.`
          : "Learning log saved successfully."
      );
    } catch (error) {
      setErrorMessage(error.message || "Failed to save learning log");
    } finally {
      setRoadmapActionLoading("");
      setPendingLesson(null);
    }
  }

  async function handleAddQuickTimeLog(roadmapId) {
    try {
      setRoadmapActionLoading(`timelog-${roadmapId}`);

      await addMySkillTimeLog(roadmapId, {
        minutes: 60,
        note: "Quick 1 hour study log",
        source: "manual",
      });

      await loadRoadmapContext(selectedRoadmap);
      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(roadmapId);

      setStatusMessage("1 hour time log added successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to add time log");
    } finally {
      setRoadmapActionLoading("");
    }
  }

  function toggleExpandedRoadmap(roadmapId) {
    const id = String(roadmapId);

    setExpandedRoadmapIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  }

  function toggleExpandedMilestone(milestoneId) {
    const id = String(milestoneId);

    setExpandedMilestoneIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  }

  const activityItems = [
    ...(selectedRoadmapProgress?.achievements || []).map((item) => ({
      type: "achievement",
      date: item.awardedAt || new Date().toISOString(),
      title: item.title,
      subtitle: item.linkedSkill || "Achievement unlocked",
      impact: item.impactScore || 0,
    })),
    ...(selectedRoadmapProgress?.timeLogs || []).map((item, index) => ({
      type: "timelog",
      date: item.date || new Date().toISOString(),
      title: `${item.minutes || 0} minutes logged`,
      subtitle: item.note || item.source || `Study session ${index + 1}`,
      impact: item.minutes || 0,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <DashboardLayout user={user}>
      <LessonCompleteModal
        lesson={pendingLesson}
        onConfirm={handleLessonConfirm}
        onClose={() => setPendingLesson(null)}
      />

      <GoalModal
        open={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        goal={goal}
        goalForm={goalForm}
        setGoalForm={setGoalForm}
        onSubmit={handleSaveGoal}
        savingGoal={savingGoal}
        generating={generating}
        onGenerate={() => handleGenerateInsights(goal?._id)}
      />

      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <div className="flex gap-4 overflow-x-auto">
            {TABS.map((tab) => {
              const label =
                tab === "overview" ? "Overview" : tab === "journey" ? "Journey" : tab === "roadmap" ? "Roadmap" : "Activity";

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-2 py-1 text-sm font-bold transition-colors duration-200 ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-primary dark:text-gray-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCreateNewTarget}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Target size={16} />
            Set your goal
          </button>
        </div>

        <main className="flex-1 overflow-auto bg-slate-50 px-4 py-5">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
          ) : (
            <div className={activeTab === "roadmap" ? "w-full space-y-8" : "mx-auto max-w-7xl space-y-8"}>
              {statusMessage ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm">
                  <style>{`@keyframes skillStatusCountdown { from { width: 100%; } to { width: 0%; } }`}</style>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                    <p>{statusMessage}</p>
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 bg-primary" style={{ animation: "skillStatusCountdown 10s linear forwards" }} />
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {activeTab === "overview" ? (
                <OverviewTab
                  goals={goals}
                  roadmaps={roadmaps}
                  metrics={metrics}
                  recentAchievements={recentAchievements}
                  onCreateTarget={handleCreateNewTarget}
                  onViewRoadmaps={handleViewGoalRoadmaps}
                  onEditGoal={handleEditGoal}
                />
              ) : null}

              {activeTab === "journey" ? (
                <JourneyTab
                  roadmaps={roadmaps}
                  selectedRoadmapId={selectedRoadmapId}
                  selectedRoadmapProgress={selectedRoadmapProgress}
                  selectedRoadmap={selectedRoadmap}
                  graph={graph}
                  graphGroups={graphGroups}
                  selectedGraphNode={selectedGraphNode}
                  onSelectRoadmap={handleSelectRoadmap}
                  roadmapActionLoading={roadmapActionLoading}
                  onDeleteRoadmap={handleDeleteRoadmap}
                  onCreateTarget={handleCreateNewTarget}
                  onSelectGraphNode={setSelectedGraphNode}
                />
              ) : null}

              {activeTab === "roadmap" ? (
                <RoadmapTab
                  roadmaps={roadmaps}
                  selectedRoadmapId={selectedRoadmapId}
                  selectedRoadmapProgress={selectedRoadmapProgress}
                  selectedRoadmap={selectedRoadmap}
                  metrics={metrics}
                  completedLessonIds={completedLessonIds}
                  expandedRoadmapIds={expandedRoadmapIds}
                  expandedMilestoneIds={expandedMilestoneIds}
                  roadmapActionLoading={roadmapActionLoading}
                  onCreateTarget={handleCreateNewTarget}
                  onSelectRoadmap={handleSelectRoadmap}
                  onDeleteRoadmap={handleDeleteRoadmap}
                  onToggleRoadmap={toggleExpandedRoadmap}
                  onToggleMilestone={toggleExpandedMilestone}
                  onStartRoadmap={handleInitializeProgress}
                  onAddQuickLog={handleAddQuickTimeLog}
                  onCompleteLesson={handleCompleteLesson}
                />
              ) : null}

              {activeTab === "activity" ? (
                <ActivityTab
                  metrics={metrics}
                  recentAchievements={recentAchievements}
                  selectedRoadmapProgress={selectedRoadmapProgress}
                  activityItems={activityItems}
                />
              ) : null}
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
