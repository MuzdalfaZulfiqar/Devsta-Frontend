import { BACKEND_URL } from "../../config";

function getHeaders() {
  const token = localStorage.getItem("devsta_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

//  STEP 1: GAP ANALYSIS ONLY
export async function getGapAnalysis({ role, company, experience }) {
  const res = await fetch(`${BACKEND_URL}/api/roadmap/gap`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ role, company, experience }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to get gap analysis");
  return data;
}

// 🔥 STEP 2: FULL ROADMAP
export async function generateRoadmap(payload) {
  const res = await fetch(`${BACKEND_URL}/api/roadmap/generate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const responseData = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(responseData.message || "Failed to generate roadmap");

  return responseData;
}

export async function getRoadmaps() {
  const res = await fetch(`${BACKEND_URL}/api/roadmap/`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch roadmaps");
  return data;
}