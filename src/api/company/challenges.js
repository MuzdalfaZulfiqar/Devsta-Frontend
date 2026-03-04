// // api/company/challenges.js
// import { BACKEND_URL } from "../../../config";

// const getToken = () => localStorage.getItem("companyToken");

// // Fetch all challenges (AI + manual)
// export const getJobChallenges = async (jobId) => {
//   const token = getToken();
//   const res = await fetch(`${BACKEND_URL}/api/company/jobs/challenges/${jobId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error("Failed to fetch challenges");
//   return res.json();
// };

// // Generate AI challenge
// export const generateAIChallenge = async (jobId, payload = {}) => {
//   const token = getToken();
//   const res = await fetch(`${BACKEND_URL}/api/company/jobs/challenges/${jobId}/generate-challenge`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Failed to generate AI challenge");
//   return res.json();
// };

// // Manual challenge CRUD
// export const createChallenge = async (jobId, challenge) => {
//   const token = getToken();
//   const res = await fetch(`${BACKEND_URL}/api/company/jobs/challenges/${jobId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify(challenge),
//   });
//   if (!res.ok) throw new Error("Failed to create challenge");
//   return res.json();
// };

// export const updateChallenge = async (jobId, challengeId, challenge) => {
//   const token = getToken();
//   const res = await fetch(`${BACKEND_URL}/api/company/jobs/challenges/${jobId}/${challengeId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify(challenge),
//   });
//   if (!res.ok) throw new Error("Failed to update challenge");
//   return res.json();
// };

// export const deleteChallenge = async (jobId, challengeId) => {
//   const token = getToken();
//   const res = await fetch(`${BACKEND_URL}/api/company/jobs/challenges/${jobId}/${challengeId}`, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error("Failed to delete challenge");
//   return res.json();
// };

// api/company/challenges.js
import { BACKEND_URL } from "../../../config";

const getToken = () => localStorage.getItem("companyToken");

// ─── Fetch all challenges (AI + manual) ───
export const getJobChallenges = async (jobId) => {
  const token = getToken();
  const res = await fetch(`${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch challenges");
  return res.json();
};

// ─── Generate AI challenge ───
export const generateAIChallenge = async (jobId, payload = {}) => {
  const token = getToken();
  const res = await fetch(
    `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/generate-challenge`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Failed to generate AI challenge");
  return res.json();
};

// ─── Manual challenge CRUD ───

// Create manual challenge
// src/api/company/challenges.js

export const createChallenge = async (jobId, challenge) => {
  const token = getToken();
  const res = await fetch(
    `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/challenges`,   // ← add /challenges at the end
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(challenge),
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create challenge failed:", res.status, errorText);
    throw new Error("Failed to create challenge");
  }
  return res.json();
};

// Update manual challenge
// src/api/company/challenges.js

export const updateChallenge = async (jobId, challengeId, challenge) => {
  const token = getToken();
  const res = await fetch(
    `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/challenges/${challengeId}`,  // ← added /challenges/
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(challenge),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Update challenge failed:", res.status, errorText);
    throw new Error(`Failed to update challenge: ${errorText}`);
  }

  return res.json();
};

// Delete manual challenge
// src/api/company/challenges.js

// Delete manual challenge
export const deleteChallenge = async (jobId, challengeId) => {
  const token = getToken();
  const res = await fetch(
    `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/challenges/${challengeId}`,  // ← FIXED: added /challenges/
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Delete challenge failed:", res.status, errorText);
    throw new Error(`Failed to delete challenge: ${errorText || res.statusText}`);
  }

  return res.json(); // or just return true if no body expected
};

export const updateChallengeStatus = async (jobId, challengeId, status) => {
  const token = getToken();
  const res = await fetch(
    `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/challenges/${challengeId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};
