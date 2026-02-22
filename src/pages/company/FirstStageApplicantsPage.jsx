
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
// import { getFirstStageApplicants } from "../../api/company/jobs";
// import { showToast } from "../../utils/toast";
// import { FileText, Github, Download, Eye } from "lucide-react";
// import { BACKEND_URL } from "../../../config";

// export default function FirstStageApplicantsPage() {
//   const { jobId } = useParams();
//   const [applicants, setApplicants] = useState([]);
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchApplicants = async () => {
//     setLoading(true);
//     try {
//       const data = await getFirstStageApplicants(jobId);
//       setJob(data.job);
//       setApplicants(data.applicants);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Failed to load applicants", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (jobId) fetchApplicants();
//   }, [jobId]);

//  const handleViewResume = async (userId) => {
//   try {
//     const token = localStorage.getItem("companyToken");

//     const response = await fetch(
//       `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) throw new Error("Failed to fetch resume");

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     window.open(url, "_blank");
//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleDownloadResume = async (userId) => {
//   try {
//     const token = localStorage.getItem("companyToken");

//     const response = await fetch(
//       `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) throw new Error("Failed to download resume");

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "resume.pdf";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   } catch (err) {
//     console.error(err);
//   }
// };

//   return (
//     <CompanyDashboardLayout>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
//             First Stage Applicants
//           </h1>
//           {job && (
//             <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
//               {job.title}
//             </p>
//           )}
//         </div>

//         {loading ? (
//           <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//             Loading applicants...
//           </div>
//         ) : applicants.length === 0 ? (
//           <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
//             No applicants found for this position yet.
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-900/70">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
//                       Applied
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
//                       Resume
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
//                       GitHub
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {applicants.map((app) => {
//                     const dev = app.developerSnapshot || app.developer;
//                     return (
//                       <tr
//                         key={app._id}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
//                           {dev.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                           {dev.email}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                           {dev.phone || "—"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                           {new Date(app.appliedAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {dev.resumeUrl ? (
//                             <div className="flex items-center gap-3">
//                               <button
//                                 onClick={() => handleViewResume(dev._id)}
//                                 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
//                               >
//                                 <Eye size={15} />
//                                 View
//                               </button>
//                               <button
//                                 onClick={() => handleDownloadResume(dev._id)}
//                                 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                               >
//                                 <Download size={15} />
//                                 Download
//                               </button>
//                             </div>
//                           ) : (
//                             "—"
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {dev.githubProfile?.html_url ? (
//                             <a
//                               href={dev.githubProfile.html_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
//                             >
//                               <Github size={16} />
//                               GitHub
//                             </a>
//                           ) : (
//                             "—"
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </CompanyDashboardLayout>
//   );
// }

// src/pages/company/FirstStageApplicantsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import {
  getFirstStageApplicants,
  sendTestToApplicant,
  saveInterviewScore,
} from "../../api/company/jobs";
import { showToast } from "../../utils/toast";
import { Github, Download, Eye, Send, Star, ClipboardCheck } from "lucide-react";
import { BACKEND_URL } from "../../../config";

const TABS = [
  { key: "applied", label: "Applied" },
  { key: "assessment", label: "In Assessment" },
  { key: "shortlisted", label: "Shortlisted" },
];

export default function FirstStageApplicantsPage() {
  const { jobId } = useParams();

  const [activeTab, setActiveTab] = useState("applied");
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [counts, setCounts] = useState({ applied: 0, assessment: 0, shortlisted: 0 });
  const [loading, setLoading] = useState(true);

  // Interview modal state
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewScore, setInterviewScore] = useState("");

  // ─────────────────────────────────────────────
  // Resume view/download
  // ─────────────────────────────────────────────
  const handleViewResume = async (userId) => {
    try {
      const token = localStorage.getItem("companyToken");

      const response = await fetch(
        `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch resume");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to view resume", "error");
    }
  };

  const handleDownloadResume = async (userId) => {
    try {
      const token = localStorage.getItem("companyToken");

      const response = await fetch(
        `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to download resume");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to download resume", "error");
    }
  };

  // ─────────────────────────────────────────────
  // Fetch counts for tabs
  // ─────────────────────────────────────────────
  const fetchCounts = async () => {
    try {
      const [a, b, c] = await Promise.all([
        getFirstStageApplicants(jobId, "applied"),
        getFirstStageApplicants(jobId, "assessment"),
        getFirstStageApplicants(jobId, "shortlisted"),
      ]);

      setCounts({
        applied: a?.applicants?.length || 0,
        assessment: b?.applicants?.length || 0,
        shortlisted: c?.applicants?.length || 0,
      });
    } catch (err) {
      console.warn("Counts fetch failed:", err.message);
    }
  };

  // ─────────────────────────────────────────────
  // Fetch applicants for current tab
  // ─────────────────────────────────────────────
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await getFirstStageApplicants(jobId, activeTab);
      setJob(data.job);
      setApplicants(Array.isArray(data.applicants) ? data.applicants : []);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to load applicants", "error");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    fetchApplicants();
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, activeTab]);

  // ─────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────
  const onSendTest = async (applicationId) => {
    try {
      await sendTestToApplicant(jobId, applicationId);
      showToast("Test sent. Candidate moved to In Assessment.", "success");
      await fetchCounts();
      await fetchApplicants();
    } catch (err) {
      showToast(err.message || "Failed to send test", "error");
    }
  };

  const openInterviewModal = (app) => {
    setSelectedApp(app);
    setInterviewScore(app?.interviewScore ?? "");
    setInterviewOpen(true);
  };

  const onSaveInterview = async () => {
    try {
      if (!selectedApp?._id) return;

      const score = Number(interviewScore);
      if (Number.isNaN(score) || score < 0 || score > 100) {
        showToast("Interview score must be between 0 and 100", "error");
        return;
      }

      await saveInterviewScore(jobId, selectedApp._id, score);
      showToast("Interview score saved.", "success");

      setInterviewOpen(false);
      setSelectedApp(null);
      setInterviewScore("");

      await fetchCounts();
      await fetchApplicants();
    } catch (err) {
      showToast(err.message || "Failed to save interview score", "error");
    }
  };

  // ─────────────────────────────────────────────
  // Table headers per tab
  // ─────────────────────────────────────────────
  const tableHead = useMemo(() => {
    if (activeTab === "applied") {
      return ["Name", "Email", "Phone", "Applied", "ML Scores", "Resume", "GitHub", "Action"];
    }
    if (activeTab === "assessment") {
      return ["Name", "Email", "Phone", "Assessment", "Applied", "Resume", "GitHub"];
    }
    return ["Name", "Email", "Phone", "Test", "Interview", "Applied", "Resume", "GitHub", "Action"];
  }, [activeTab]);

  return (
    <CompanyDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Applicants Pipeline
          </h1>
          {job && (
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {job.title}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            const count = counts[t.key] ?? 0;

            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition
                  ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-primary/5"
                  }`}
              >
                {t.label}{" "}
                <span className={`${isActive ? "text-white/90" : "text-gray-500 dark:text-gray-400"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading / Empty / Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Loading applicants...
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            No applicants found in this stage.
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/70">
                  <tr>
                    {tableHead.map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {applicants.map((app) => {
                    const dev = app.developerSnapshot || app.developer || {};
                    const appliedDate = app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "—";
                    const ml = app.mlScores || null;
                    const assessment = app.assessment || null;

                    return (
                      <tr
                        key={app._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
                      >
                        {/* Name */}
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                          {dev.name || "—"}
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {dev.email || "—"}
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {dev.phone || "—"}
                        </td>

                        {activeTab === "applied" && (
                          <>
                            {/* Applied */}
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                              {appliedDate}
                            </td>

                            {/* ML Scores */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {ml ? (
                                <div className="flex flex-wrap gap-2">
                                  <ScorePill label="Match" value={ml.match} />
                                  <ScorePill label="Exp" value={ml.experience} />
                                  <ScorePill label="Cred" value={ml.credibility} />
                                  <ScorePill label="Rank" value={ml.screening} strong />
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">—</span>
                              )}
                            </td>

                            {/* Resume */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dev.resumeUrl ? (
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleViewResume(dev._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
                                  >
                                    <Eye size={15} />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDownloadResume(dev._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <Download size={15} />
                                    Download
                                  </button>
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* GitHub */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dev.githubProfile?.html_url ? (
                                <a
                                  href={dev.githubProfile.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                  <Github size={16} />
                                  GitHub
                                </a>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* Action */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => onSendTest(app._id)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                              >
                                <Send size={16} />
                                Send Test
                              </button>
                            </td>
                          </>
                        )}

                        {activeTab === "assessment" && (
                          <>
                            {/* Assessment */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                                  <ClipboardCheck size={16} className="text-primary" />
                                  {assessment?.status ? titleCase(assessment.status) : "Invited"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Invited: {assessment?.invitedAt ? new Date(assessment.invitedAt).toLocaleDateString() : "—"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Expires: {assessment?.expiresAt ? new Date(assessment.expiresAt).toLocaleDateString() : "—"}
                                </span>
                              </div>
                            </td>

                            {/* Applied */}
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                              {appliedDate}
                            </td>

                            {/* Resume */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dev.resumeUrl ? (
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleViewResume(dev._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
                                  >
                                    <Eye size={15} />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDownloadResume(dev._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <Download size={15} />
                                    Download
                                  </button>
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* GitHub */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dev.githubProfile?.html_url ? (
                                <a
                                  href={dev.githubProfile.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                  <Github size={16} />
                                  GitHub
                                </a>
                              ) : (
                                "—"
                              )}
                            </td>
                          </>
                        )}

                        {activeTab === "shortlisted" && (
                          <>
                            {/* Test */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <ScorePill label="Test" value={app.codingChallengeScore ?? 0} strong />
                            </td>

                            {/* Interview */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {app.interviewScore != null ? (
                                <ScorePill label="Interview" value={app.interviewScore} />
                              ) : (
                                <span className="text-gray-500 text-sm">—</span>
                              )}
                            </td>

                            {/* Applied */}
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                              {appliedDate}
                            </td>

                            {/* Resume */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dev.resumeUrl ? (
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleViewResume(dev._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
                                  >
                                    <Eye size={15} />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDownloadResume(dev._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <Download size={15} />
                                    Download
                                  </button>
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* GitHub */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dev.githubProfile?.html_url ? (
                                <a
                                  href={dev.githubProfile.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                  <Github size={16} />
                                  GitHub
                                </a>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* Action */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => openInterviewModal(app)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition"
                              >
                                <Star size={16} />
                                {app.interviewScore != null ? "Update Interview" : "Add Interview"}
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Interview Modal */}
        {interviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Interview Score</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedApp?.developerSnapshot?.name || "Candidate"}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Score (0–100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={interviewScore}
                  onChange={(e) => setInterviewScore(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 78"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setInterviewOpen(false);
                      setSelectedApp(null);
                      setInterviewScore("");
                    }}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={onSaveInterview}
                    className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}

function ScorePill({ label, value, strong = false }) {
  const v = Number(value ?? 0);
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border
      ${strong ? "bg-primary/10 text-primary border-primary/30" : "bg-gray-100 text-gray-700 border-gray-200"}
    `}
      title={`${label}: ${v}`}
    >
      <span className="opacity-80">{label}</span>
      <span className="tabular-nums">{Number.isFinite(v) ? v.toFixed(0) : "0"}</span>
    </span>
  );
}

function titleCase(s) {
  const str = String(s || "");
  return str.charAt(0).toUpperCase() + str.slice(1).replaceAll("_", " ");
}