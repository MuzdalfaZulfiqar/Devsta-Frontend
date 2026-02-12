// src/api/resume.js
import { BACKEND_URL } from "../../config";

// src/api/resume.js
const API_BASE = "/api/resume-portfolio"; // ← update this


export async function generateResume(token) {
  const formData = new FormData();
  formData.append("user_profile", JSON.stringify({})); // minimal payload
  const res = await fetch(`${BACKEND_URL}${API_BASE}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}

export async function generateTailoredResume(jobId, token) {
  const formData = new FormData();
  formData.append("jobId", jobId);
  const res = await fetch(`${BACKEND_URL}${API_BASE}/generate-tailored`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}
