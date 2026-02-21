// src/api/company/publicJobs.js
import { BACKEND_URL } from "../../../config";

const BASE_URL = `${BACKEND_URL}/api/developer/publicjobs`;


export const getActiveJobs = async (
  {
    page = 1,
    limit = 6,
    search = "",
    companyId,
    jobMode,
    employmentType,
    experienceLevel,
    location,
  } = {},
  token
) => {
  const rawParams = {
  page,
  limit,
  search,
  companyId,
  jobMode,
  employmentType,
  experienceLevel,
  location,
};

const params = new URLSearchParams(
  Object.entries(rawParams).filter(
    ([_, v]) => v !== undefined && v !== "" && v !== null
  )
);


  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message);

  return json;
};

/* ─────────────── GET SINGLE JOB (supports hasApplied) ─────────────── */
export const getJobById = async (jobId, token) => {
  const res = await fetch(`${BASE_URL}/${jobId}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch job");
  }

  return json;
};

/* ─────────────── GET JOBS BY COMPANY ─────────────── */
// export const getJobsByCompany = async (companyId) => {
//   const res = await fetch(`${BASE_URL}?companyId=${companyId}`);
//   const json = await res.json();

//   if (!res.ok) {
//     throw new Error(json.message || "Failed to fetch company jobs");
//   }

//   return json;
// };

export const getJobsByCompany = async (companyId, token) => {
  const res = await fetch(`${BASE_URL}?companyId=${companyId}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch company jobs");
  return json;
};

/* ─────────────── GET COMPANY PUBLIC PROFILE ─────────────── */
export const getCompanyById = async (companyId) => {
  const res = await fetch(`${BASE_URL}/company/${companyId}`);

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch company");
  }

  return json;
};



