// /**
//  * src/api/monetizationApi.js
//  * All HTTP calls for Module 5 go through this file.
//  * Swap BASE_URL to your production domain in .env.
//  */

// const BASE =  "http://localhost:5000/api/monetization";

// // ── Generic fetch wrapper ────────────────────────────────────────────────────

// async function request(method, path, body, isFormData = false) {
//   const headers = {};
//   const token = localStorage.getItem("devsta_token");
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   if (!isFormData) headers["Content-Type"] = "application/json";

//   const res = await fetch(`${BASE}${path}`, {
//     method,
//     headers,
//     body: isFormData ? body : body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({ error: "Unknown error" }));
//     throw new Error(err.error || `HTTP ${res.status}`);
//   }
//   return res;
// }

// // ── API methods ──────────────────────────────────────────────────────────────

// /** Kick off analysis for a GitHub URL. Returns { job_id, status } */
// export async function ingestGitHub(url) {
//   const res = await request("POST", "/ingest/github", { url });
//   return res.json();
// }

// /** Kick off analysis for a local zip upload. Returns { job_id, status } */
// export async function ingestUpload(file) {
//   const form = new FormData();
//   form.append("file", file);
//   const res = await request("POST", "/ingest/upload", form, true);
//   return res.json();
// }

// /** Poll job status. Returns { job_id, status, progress, error? } */
// export async function getJobStatus(jobId) {
//   const res = await request("GET", `/jobs/${jobId}`);
//   return res.json();
// }

// /** Fetch full analysis result. Returns AnalysisResponse. */
// export async function getResults(jobId) {
//   const res = await request("GET", `/results/${jobId}`);
//   return res.json();
// }

// /** Return a Blob for the PDF report to trigger browser download. */
// export async function downloadReport(jobId, format = "pdf") {
//   const token = localStorage.getItem("devsta_token");
//   const res = await fetch(`${BASE}/report/${jobId}?format=${format}`, {
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//   });
//   if (!res.ok) throw new Error(`Report download failed: HTTP ${res.status}`);
//   return res.blob();
// }
/**
 * src/api/monetizationApi.js
 * All HTTP calls for Module 5 go through this file.
 * Swap BASE_URL to your production domain in .env.
 */

const BASE = "http://localhost:5000/api/monetization";

// ── Generic fetch wrapper ────────────────────────────────────────────────────

async function request(method, path, body, isFormData = false) {
  const headers = {};
  const token = localStorage.getItem("devsta_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res;
}

// ── API methods ──────────────────────────────────────────────────────────────

/** Kick off analysis for a GitHub URL. Returns { job_id, status } */
export async function ingestGitHub(url) {
  const res = await request("POST", "/ingest/github", { url });
  return res.json();
}

/** Kick off analysis for a local zip upload. Returns { job_id, status } */
export async function ingestUpload(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await request("POST", "/ingest/upload", form, true);
  return res.json();
}

/** Poll job status. Returns { job_id, status, progress, error? } */
export async function getJobStatus(jobId) {
  const res = await request("GET", `/jobs/${jobId}`);
  return res.json();
}

/** Fetch full analysis result. Returns AnalysisResponse. */
export async function getResults(jobId) {
  const res = await request("GET", `/results/${jobId}`);
  return res.json();
}

/** Fetch all past jobs newest-first. Powers the History tab (FE-4). */
export async function getHistory(limit = 50) {
  const res = await request("GET", `/history?limit=${limit}`);
  return res.json();
}

/** Delete a job record from the database. */
export async function deleteJob(jobId) {
  await request("DELETE", `/jobs/${jobId}`);
}

/** Return a Blob for the PDF report to trigger browser download.
 *  For HTML format, opens in a new tab instead. */
export async function downloadReport(jobId, format = "pdf") {
  const token = localStorage.getItem("devsta_token");
  const res = await fetch(`${BASE}/report/${jobId}?format=${format}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Report download failed: HTTP ${res.status}`);

  if (format === "html") {
    const html = await res.text();
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    return null;
  }

  return res.blob();
}