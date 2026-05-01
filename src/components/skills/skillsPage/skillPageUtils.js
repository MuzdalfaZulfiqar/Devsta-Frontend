export function getFocusSkillsArray(text) {
    return String(text || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  
  export function fillGoalFormFromGoal(goal, defaultGoalForm) {
    if (!goal) return defaultGoalForm;
  
    return {
      ...defaultGoalForm,
      targetTitle: goal.targetTitle || "",
      targetRole: goal.targetRole || "",
      targetCompany: goal.targetCompany || "",
      experienceLevel: goal.experienceLevel || "other",
      focusSkillsText: Array.isArray(goal.focusSkills) ? goal.focusSkills.join(", ") : "",
      timeline: goal.timeline || defaultGoalForm.timeline,
      weeklyAvailability: goal.weeklyAvailability || defaultGoalForm.weeklyAvailability,
      preferredResourceType: goal.preferredResourceType || defaultGoalForm.preferredResourceType,
      budgetPreference: goal.budgetPreference || defaultGoalForm.budgetPreference,
      preferredDifficulty: goal.preferredDifficulty || defaultGoalForm.preferredDifficulty,
    };
  }
  
  export function getGoalIdFromRoadmap(roadmap) {
    return String(roadmap?.goal?._id || roadmap?.goal || "");
  }
  
  export function getGoalTitleFromRoadmap(roadmap) {
    return roadmap?.goal?.targetTitle || roadmap?.goal?.title || "Target";
  }
  
  export function getGoalRoleFromRoadmap(roadmap) {
    return (
      roadmap?.goal?.aiInterpretation?.inferredRole ||
      roadmap?.goal?.targetRole ||
      roadmap?.goal?.targetTitle ||
      "Custom target"
    );
  }
  
  export function getGroupedGraphNodes(graph) {
    const nodes = graph?.nodes || [];
  
    return {
      owned: nodes.filter((node) => node.type === "skill" && node.status === "owned"),
      learning: nodes.filter((node) => node.type === "skill" && node.status === "learning"),
      gap: nodes.filter((node) => node.type === "skill" && node.status === "gap"),
    };
  }
  
  export function getRoadmapCompletion(roadmap, progress) {
    return Number(
      progress?.metrics?.pathCompletionPercent ||
        roadmap?.progressMetrics?.pathCompletionPercent ||
        roadmap?.metrics?.pathCompletionPercent ||
        roadmap?.pathCompletionPercent ||
        0
    );
  }
  
  export function getRoadmapStatus(roadmap, progress) {
    const completion = getRoadmapCompletion(roadmap, progress);
    const status = String(
      progress?.status ||
        roadmap?.computedStatus ||
        roadmap?.progressStatus ||
        roadmap?.status ||
        ""
    ).toLowerCase();
  
    if (status === "completed" || completion >= 100) return "completed";
    return "active";
  }
  
  export function getRoadmapDotClass(roadmap, progress, selected = false) {
    const status = getRoadmapStatus(roadmap, progress);
  
    if (status === "completed") return "bg-emerald-500 ring-emerald-100";
    if (selected) return "bg-amber-400 ring-amber-100";
    return "bg-slate-300 ring-slate-100";
  }
  
  export function cleanMilestoneTitle(value = "") {
    return String(value || "")
      .replace(/^Milestone\s+\d+:\s*/i, "")
      .trim();
  }
  
  export function buildProviderUrl(provider, query) {
    const encoded = encodeURIComponent(query);
  
    if (provider === "youtube") {
      return `https://www.youtube.com/results?search_query=${encoded}`;
    }
  
    if (provider === "udemy") {
      return `https://www.udemy.com/courses/search/?q=${encoded}&sort=relevance`;
    }
  
    if (provider === "coursera") {
      return `https://www.coursera.org/search?query=${encoded}`;
    }
  
    return `https://developer.mozilla.org/en-US/search?q=${encoded}`;
  }
  
  export function normalizeResourceProvider(provider = "") {
    const value = String(provider || "").trim().toLowerCase();
  
    if (value.includes("youtube")) return "youtube";
    if (value.includes("udemy")) return "udemy";
    if (value.includes("coursera")) return "coursera";
    if (value.includes("mdn")) return "mdn";
    if (value.includes("documentation") || value.includes("docs")) return "documentation";
  
    return "default";
  }
  
  export function getRoadmapTargetRole(roadmap) {
    return (
      roadmap?.goal?.aiInterpretation?.inferredRole ||
      roadmap?.goal?.targetRole ||
      roadmap?.goal?.targetTitle ||
      roadmap?.title ||
      "Developer"
    );
  }
  
  export function buildFallbackLessonResources({ lesson, milestone, roadmap }) {
    const lessonTitle = lesson?.title || "Learning lesson";
    const milestoneTitle = cleanMilestoneTitle(milestone?.title || "Roadmap milestone");
    const targetRole = getRoadmapTargetRole(roadmap);
  
    const lessonQuery = `${lessonTitle} in ${milestoneTitle}`;
    const courseQuery = `${milestoneTitle} for ${targetRole}`;
  
    return [
      {
        provider: "YouTube",
        title: `YouTube tutorials for ${lessonQuery}`,
        url: buildProviderUrl("youtube", lessonQuery),
        type: "video",
        rating: 4.5,
        durationLabel: "Varies",
        isPaid: false,
      },
      {
        provider: "Udemy",
        title: `${milestoneTitle} — Udemy courses`,
        url: buildProviderUrl("udemy", courseQuery),
        type: "course",
        rating: 4.5,
        durationLabel: "Varies",
        isPaid: true,
      },
      {
        provider: "Coursera",
        title: `${milestoneTitle} — Coursera courses`,
        url: buildProviderUrl("coursera", courseQuery),
        type: "course",
        rating: 4.5,
        durationLabel: "Varies",
        isPaid: false,
      },
      {
        provider: "MDN Docs",
        title: `${lessonTitle} — MDN documentation`,
        url: buildProviderUrl("documentation", lessonQuery),
        type: "documentation",
        rating: 4.8,
        durationLabel: "Self-paced",
        isPaid: false,
      },
    ];
  }
  
  export function getDisplayResources({ lesson, milestone, roadmap }) {
    const fallbackResources = buildFallbackLessonResources({ lesson, milestone, roadmap });
    const incomingResources = Array.isArray(lesson?.resources) ? lesson.resources : [];
    const resourceMap = new Map();
  
    for (const resource of incomingResources) {
      const providerKey = normalizeResourceProvider(resource.provider);
  
      if (!resourceMap.has(providerKey)) {
        resourceMap.set(providerKey, resource);
      }
    }
  
    for (const resource of fallbackResources) {
      const providerKey = normalizeResourceProvider(resource.provider);
  
      if (!resourceMap.has(providerKey)) {
        resourceMap.set(providerKey, resource);
      }
    }
  
    return ["youtube", "udemy", "coursera", "documentation", "mdn"]
      .map((key) => resourceMap.get(key))
      .filter(Boolean)
      .slice(0, 4);
  }
  
  export function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  