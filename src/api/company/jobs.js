import { BACKEND_URL } from "../../../config";

const BASE_URL = `${BACKEND_URL}/api/company/jobs`;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
});

// CREATE JOB
export const createJob = async (data) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to create job");
  }

  return json;
};

// GET COMPANY JOBS
export const getMyJobs = async () => {
  const res = await fetch(`${BASE_URL}/my`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch jobs");
  }

  return json;
};

// TOGGLE JOB STATUS (active / closed)
export const toggleJobStatus = async (jobId) => {
  const res = await fetch(`${BASE_URL}/${jobId}/toggle`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to update job status");
  }

  return json;
};

export const deleteJob = async (jobId) => {
  const res = await fetch(`${BASE_URL}/${jobId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete job");
  return json;
};

// api/company/jobs.js
export const updateJob = async (jobId, data) => {
  const res = await fetch(`${BASE_URL}/${jobId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Failed to update job");

  return json;
};


// GET FIRST STAGE APPLICANTS
export const getFirstStageApplicants = async (jobId) => {
  const res = await fetch(`${BASE_URL}/${jobId}/first-stage-applicants`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch applicants");
  return json;
};