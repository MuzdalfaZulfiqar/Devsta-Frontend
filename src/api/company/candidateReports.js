// src/api/company/candidateReports.js
import { BACKEND_URL } from "../../../config";

/**
 * Get comprehensive report for a single candidate
 */
export const getCandidateReport = async (jobId, applicationId) => {
  try {
    const token = localStorage.getItem("companyToken");
    const response = await fetch(
      `${BACKEND_URL}/api/reports/${jobId}/applications/${applicationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch candidate report");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get bulk report for all candidates in a job
 */
export const getJobCandidatesReport = async (jobId, status = "all") => {
  try {
    const token = localStorage.getItem("companyToken");
    const response = await fetch(
      `${BACKEND_URL}/api/reports/${jobId}/candidates?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch bulk report");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Export candidates report as CSV
 */
export const exportReportAsCSV = async (jobId, status = "all") => {
  try {
    const data = await getJobCandidatesReport(jobId, status);
    
    if (!data.reports || data.reports.length === 0) {
      throw new Error("No candidates to export");
    }

    // Prepare CSV headers
    const headers = [
      "Candidate Name",
      "Email",
      "Status",
      "Skill Match (%)",
      "Coding Score",
      "Interview Score",
      "Applied Date",
    ];

    // Prepare CSV rows
    const rows = data.reports.map((report) => [
      report.candidateName || "—",
      report.email || "—",
      report.status || "—",
      report.skillMatchScore || "—",
      report.codingScore || "—",
      report.interviewScore || "—",
      new Date(report.appliedAt).toLocaleDateString(),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${data.jobTitle}_candidates_report.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw error;
  }
};
