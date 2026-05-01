import { BACKEND_URL } from "../../../config";

function getToken() {
  return localStorage.getItem("devsta_token");
}

async function parseResponse(res) {
  let data;

  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Server returned invalid response");
  }

  if (!res.ok) {
    throw new Error(data.msg || data.message || "Request failed");
  }

  return data;
}

function buildQueryString(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getSkillInsightsHealth() {
  const res = await fetch(`${BACKEND_URL}/api/skills-insights/health`);
  return parseResponse(res);
}

export async function getMySkillGoal() {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/skills-insights/goal`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res);
}

export async function saveMySkillGoal(payload) {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/skills-insights/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function generateMySkillInsights(goalId) {
  const token = getToken();

  const url = goalId
    ? `${BACKEND_URL}/api/skills-insights/goals/${goalId}/generate`
    : `${BACKEND_URL}/api/skills-insights/generate`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res);
}

export async function getMySkillGoals() {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/skills-insights/goals`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res);
}

export async function getMySkillGoalById(goalId) {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/skills-insights/goals/${goalId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res);
}

export async function setMyActiveSkillGoal(goalId) {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/goals/${goalId}/activate`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return parseResponse(res);
}

export async function archiveMySkillGoal(goalId) {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/goals/${goalId}/archive`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return parseResponse(res);
}

export async function getMySkillGraph(goalId = "") {
  const token = getToken();
  const query = buildQueryString({ goalId });

  const res = await fetch(`${BACKEND_URL}/api/skills-insights/graph${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res);
}

/**
 * Usage:
 * getMySkillRoadmaps(goalId) -> goal scoped roadmaps
 * getMySkillRoadmaps("", { scope: "all" }) -> all roadmaps
 */
export async function getMySkillRoadmaps(goalId = "", options = {}) {
  const token = getToken();

  const query = buildQueryString({
    goalId,
    scope: options.scope || "",
  });

  const res = await fetch(`${BACKEND_URL}/api/skills-insights/roadmaps${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res);
}

export async function getMySkillRoadmapById(roadmapId) {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/roadmaps/${roadmapId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return parseResponse(res);
}

export async function initMySkillRoadmapProgress(roadmapId) {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/roadmaps/${roadmapId}/progress/init`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return parseResponse(res);
}

export async function getMySkillRoadmapProgress(roadmapId) {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/roadmaps/${roadmapId}/progress`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return parseResponse(res);
}

export async function completeMySkillLesson(
  roadmapId,
  lessonId,
  { minutes, understanding, note } = {}
) {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/roadmaps/${roadmapId}/progress/lessons/${lessonId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        minutes: minutes || null,
        understanding: understanding || 3,
        note: note || "",
      }),
    }
  );

  return parseResponse(res);
}

export async function addMySkillTimeLog(roadmapId, payload) {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/roadmaps/${roadmapId}/progress/time-log`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return parseResponse(res);
}

export async function getMySkillsDashboard() {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/skills-insights/dashboard`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res);
}

export async function getMySkillAchievements({ limit = 5, skip = 0 } = {}) {
  const token = getToken();
  const query = buildQueryString({ limit, skip });

  const res = await fetch(
    `${BACKEND_URL}/api/skills-insights/achievements${query}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return parseResponse(res);
}