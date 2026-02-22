import { BACKEND_URL } from "../../../config";

const BASE_URL = `${BACKEND_URL}/api/developer/jobApplications`;

// Apply for a job
export const applyForJob = async (jobId, data = {}, token) => {
  const res = await fetch(`${BASE_URL}/${jobId}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to apply for job");
  return json;
};

// Upload resume specifically for a job application
export const uploadResumeForJob = async (jobId, file, token) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${BASE_URL}/${jobId}/uploadResume`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || "Failed to upload resume");
  return json.resumeUrl;
};


export const getMyApplications = async (
  { page = 1, limit = 6, search = "" } = {},
  token
) => {
  const params = new URLSearchParams({ page, limit, search });
  const res = await fetch(`${BASE_URL}/my?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch applications");
  return json;
};

// Get backend URL for inline view/download
export const getApplicationResumeUrl = (jobId) => {
  return `${BASE_URL}/${jobId}/resume`; // ← protected backend endpoint
};
