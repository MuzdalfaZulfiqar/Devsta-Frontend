// // src/pages/company/FirstStageApplicantsPage.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
// import {
//   getFirstStageApplicants,
//   saveInterviewScore,
//   addDraftApplicants,
//   removeDraftApplicants,
//   getDraftApplicants,
// } from "../../api/company/jobs";
// import { showToast } from "../../utils/toast";
// // ADD these two imports alongside your other imports
// import RubricBuilderModal from "../../components/company/RubricBuilderModal";
// import ScorecardModal from "../../components/company/ScorecardModal";
// import {
//   Github,
//   Download,
//   Eye,
//   Star,
//   ClipboardCheck,
//   CheckSquare,
//   Square,
//   Code,
// } from "lucide-react";
// import { BACKEND_URL } from "../../../config";
// import BackButton from "../../components/BackButton";
// import ConfirmModal from "../../components/ConfirmModal";
// const TABS = [
//   { key: "applied", label: "Applied" },
//   { key: "assessment", label: "In Assessment" },
//   { key: "shortlisted", label: "Shortlisted" },
//   { key: "final", label: "Final Decisions" },
// ];

// export default function FirstStageApplicantsPage() {
//   const { jobId } = useParams();

//   const [activeTab, setActiveTab] = useState("applied");
//   const [job, setJob] = useState(null);
//   const [applicants, setApplicants] = useState([]);
//   const [counts, setCounts] = useState({ applied: 0, assessment: 0, shortlisted: 0 });
//   const [loading, setLoading] = useState(true);

//   // Draft selection from backend
//   const [draftCount, setDraftCount] = useState(0);
//   const [draftApplicants, setDraftApplicants] = useState([]); // array of IDs

//   // Interview modal state
//   const [interviewOpen, setInterviewOpen] = useState(false);
//   const [selectedApp, setSelectedApp] = useState(null);
//   const [interviewScore, setInterviewScore] = useState("");

//   const [evaluating, setEvaluating] = useState(false);
//   const [evalMessage, setEvalMessage] = useState(null);

//   const [codingModalOpen, setCodingModalOpen] = useState(false);
//   const [selectedApplicant, setSelectedApplicant] = useState(null);
//   const [sessionData, setSessionData] = useState(null);
//   const [loadingSession, setLoadingSession] = useState(false);

//   const [showEvalConfirm, setShowEvalConfirm] = useState(false);
//   const [shortlisting, setShortlisting] = useState(false);
//   const [showShortlistConfirm, setShowShortlistConfirm] = useState(false);

//   const [showSentChallengesModal, setShowSentChallengesModal] = useState(false);

//   // Add these states
//   const [scheduleOpen, setScheduleOpen] = useState(false);
//   const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
//   const [scheduledAt, setScheduledAt] = useState("");
//   const [interviewNotes, setInterviewNotes] = useState("");


//   const [showMoveToFinalConfirm, setShowMoveToFinalConfirm] = useState(false);

//   const [showFinalDecisionConfirm, setShowFinalDecisionConfirm] = useState(false);
//   const [pendingDecision, setPendingDecision] = useState(null); // { decision: "hired"|"rejected", applicationId: string }

//   const [showInterviewStatusConfirm, setShowInterviewStatusConfirm] = useState(false);
//   const [pendingInterviewStatus, setPendingInterviewStatus] = useState(null);

//   const [scheduling, setScheduling] = useState(false);

//   // ── NEW: rubric + scorecard modal state ──
//   const [rubricOpen, setRubricOpen] = useState(false);
//   const [scorecardOpen, setScorecardOpen] = useState(false);
//   const [scorecardApp, setScorecardApp] = useState(null);


//   const [sendTestModalOpen, setSendTestModalOpen] = useState(false);
//   const [sendTestTarget, setSendTestTarget] = useState(null);
//   const [sendTestStart, setSendTestStart] = useState("");
//   const [sendTestEnd, setSendTestEnd] = useState("");
//   const [sendingTest, setSendingTest] = useState(false);

//   const openSendTestModal = (app) => {
//     setSendTestTarget(app);
//     setSendTestStart("");
//     setSendTestEnd("");
//     setSendTestModalOpen(true);
//   };

//   const confirmSendTestToOne = async () => {
//     if (!sendTestEnd) { showToast("Please select an expiry date/time", 5000); return; }
//     const now = new Date(), end = new Date(sendTestEnd);
//     const start = sendTestStart ? new Date(sendTestStart) : null;
//     if (end <= now) { showToast("Expiry date must be in the future", 5000); return; }
//     if (start && start >= end) { showToast("Start must be before expiry", 5000); return; }

//     setSendingTest(true);
//     try {
//       const token = localStorage.getItem("companyToken");
//       const res = await fetch(
//         `${BACKEND_URL}/api/company/jobs/${jobId}/applications/${sendTestTarget._id}/send-test`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//           body: JSON.stringify({
//             availableFrom: sendTestStart || undefined,
//             availableUntil: sendTestEnd,
//           }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send test");
//       showToast(`Test sent to ${sendTestTarget.developerSnapshot?.name}!`, 5000);
//       setSendTestModalOpen(false);
//       await fetchApplicants();
//     } catch (err) {
//       showToast(err.message || "Failed to send test", 5000);
//     } finally {
//       setSendingTest(false);
//     }
//   };
//   // ─────────────────────────────────────────────
//   // Refresh draft selection from backend
//   // ─────────────────────────────────────────────
//   const refreshDraftSelection = async () => {
//     try {
//       const data = await getDraftApplicants(jobId);
//       setDraftCount(data.count);
//       setDraftApplicants(data.draftSelectedApplicants.map((app) => app._id.toString()));
//     } catch (err) {
//       console.error("Failed to refresh draft selection:", err);
//       showToast("Could not load selected candidates", 5000);
//     }
//   };
//   function TestStatusBadge({ assessment }) {
//     const isExpired =
//       assessment?.expiresAt &&
//       new Date(assessment.expiresAt) < new Date() &&
//       !["submitted", "evaluated"].includes(assessment?.status);

//     if (!assessment?.status || isExpired) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300">
//           {isExpired ? "⏰ Expired" : "– Not Sent"}
//         </span>
//       );
//     }

//     const map = {
//       invited: { label: "📨 Invited", cls: "bg-blue-100 text-blue-700 border-blue-200" },
//       in_progress: { label: "⏳ In Progress", cls: "bg-amber-100 text-amber-700 border-amber-200" },
//       submitted: { label: "✅ Submitted", cls: "bg-green-100 text-green-700 border-green-200" },
//       evaluated: { label: "🎯 Evaluated", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
//     };

//     const config = map[assessment.status] || map.invited;

//     return (
//       <div className="flex flex-col gap-0.5">
//         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.cls}`}>
//           {config.label}
//         </span>
//         {assessment.expiresAt && (
//           <span className="text-xs text-gray-400">
//             Exp: {new Date(assessment.expiresAt).toLocaleDateString()}
//           </span>
//         )}
//       </div>
//     );
//   }

//   // ─────────────────────────────────────────────
//   // Resume view/download (unchanged)
//   // ─────────────────────────────────────────────
//   const handleViewResume = async (userId) => {
//     try {
//       const token = localStorage.getItem("companyToken");
//       const response = await fetch(
//         `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!response.ok) throw new Error("Failed to fetch resume");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Failed to view resume", 5000);
//     }
//   };

//   const handleDownloadResume = async (userId) => {
//     try {
//       const token = localStorage.getItem("companyToken");
//       const response = await fetch(
//         `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!response.ok) throw new Error("Failed to download resume");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "resume.pdf";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Failed to download resume", 5000);
//     }
//   };

//   // New function
//   const handleShortlistSelected = () => {
//     if (draftApplicants.length === 0) {
//       showToast("No candidates selected to shortlist", 5000);
//       return;
//     }
//     setShowShortlistConfirm(true);
//   };

//   const confirmShortlist = async () => {
//     setShowShortlistConfirm(false);
//     setShortlisting(true);

//     try {
//       const token = localStorage.getItem("companyToken");
//       const response = await fetch(
//         `${BACKEND_URL}/api/company/jobs/${jobId}/shortlist-selected`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ applicationIds: draftApplicants }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to shortlist");
//       }

//       showToast(data.message || `Shortlisted ${data.shortlistedCount} candidates!`, 5000);

//       // Refresh everything
//       await fetchApplicants();
//       await fetchCounts();
//       await refreshDraftSelection(); // clears draft count

//     } catch (err) {
//       console.error("Shortlist error:", err);
//       showToast(err.message || "Failed to shortlist applicants", 5000);
//     } finally {
//       setShortlisting(false);
//     }
//   };



//   // ─────────────────────────────────────────────
//   // Fetch counts for tabs
//   // ─────────────────────────────────────────────


//   const fetchCounts = async () => {
//     try {
//       const [a, b, c, f] = await Promise.all([
//         getFirstStageApplicants(jobId, "applied"),
//         getFirstStageApplicants(jobId, "assessment"),
//         getFirstStageApplicants(jobId, "shortlisted"),
//         getFirstStageApplicants(jobId, "final"),   // new
//       ]);
//       setCounts({
//         applied: a?.applicants?.length || 0,
//         assessment: b?.applicants?.length || 0,
//         shortlisted: c?.applicants?.length || 0,
//         final: f?.applicants?.length || 0,   // new
//       });
//     } catch (err) {
//       console.warn("Counts fetch failed:", err.message);
//     }
//   };



//   // ─────────────────────────────────────────────
//   // Fetch applicants for current tab
//   // ─────────────────────────────────────────────
//   const fetchApplicants = async () => {
//     setLoading(true);
//     try {
//       const data = await getFirstStageApplicants(jobId, activeTab);
//       setJob(data.job);
//       setApplicants(Array.isArray(data.applicants) ? data.applicants : []);
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Failed to load applicants", 5000);
//       setApplicants([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!jobId) return;

//     fetchApplicants();
//     fetchCounts();
//     refreshDraftSelection(); // Load draft selection on mount / tab change

//     // No need to clear draft on tab change — it persists in DB
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [jobId, activeTab]);

//   // ─────────────────────────────────────────────
//   // Selection actions (now backend-powered)
//   // ─────────────────────────────────────────────
//   const toggleSelectOne = async (applicationId) => {
//     const isCurrentlySelected = draftApplicants.includes(applicationId);

//     try {
//       if (isCurrentlySelected) {
//         await removeDraftApplicants(jobId, [applicationId]);
//       } else {
//         await addDraftApplicants(jobId, [applicationId]);
//       }
//       await refreshDraftSelection(); // Sync UI
//     } catch (err) {
//       showToast("Failed to update selection", 5000);
//     }
//   };

//   const toggleSelectAll = async () => {
//     const allIds = applicants.map((a) => String(a._id));

//     try {
//       // If already all selected → remove all
//       if (allIds.every((id) => draftApplicants.includes(id))) {
//         await removeDraftApplicants(jobId, allIds);
//       } else {
//         // Add all (backend will deduplicate)
//         await addDraftApplicants(jobId, allIds);
//       }
//       await refreshDraftSelection();
//     } catch (err) {
//       showToast("Failed to select all", 5000);
//     }
//   };

//   const openInterviewModal = (app) => {
//     setSelectedApp(app);
//     setInterviewScore(app?.interviewScore ?? "");
//     setInterviewOpen(true);
//   };
//   const onSaveInterview = async () => {
//     try {
//       if (!selectedApp?._id) return;
//       const score = Number(interviewScore);
//       if (Number.isNaN(score) || score < 0 || score > 100) {
//         showToast("Interview score must be between 0 and 100", 5000);
//         return;
//       }

//       const token = localStorage.getItem("companyToken");
//       const res = await fetch(
//         `${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${selectedApp._id}/save-score`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ score }),
//         }
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to save score");
//       }

//       showToast("Interview score saved.", 5000);
//       setInterviewOpen(false);
//       setSelectedApp(null);
//       setInterviewScore("");

//       // Refresh table to show updated score
//       await fetchApplicants();
//     } catch (err) {
//       showToast(err.message || "Failed to save interview score", 5000);
//     }
//   };
//   const openCodingModal = async (app) => {
//     setSelectedApplicant(app);
//     setCodingModalOpen(true);
//     setLoadingSession(true);
//     setSessionData(null);

//     try {
//       const token = localStorage.getItem("companyToken");
//       const response = await fetch(
//         `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/applicant/${app._id}/coding-session`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to load coding details");

//       const data = await response.json();
//       setSessionData(data);
//     } catch (err) {
//       console.error(err);
//       showToast("Could not load coding details", 5000);
//       setCodingModalOpen(false);
//     } finally {
//       setLoadingSession(false);
//     }
//   };

//   // ─────────────────────────────────────────────
//   // Table headers per tab
//   // ─────────────────────────────────────────────

//   const tableHead = useMemo(() => {
//     // if (activeTab === "applied") {
//     //   return ["", "Name", "Email", "Phone", "Applied", "ML Scores", "Resume", "GitHub"];
//     // }
//     if (activeTab === "applied") {
//       return ["", "Name", "Email", "Phone", "Test Status", "Applied", "ML Scores", "Resume", "GitHub", "Action"];
//     }
//     if (activeTab === "assessment") {
//       return ["", "Name", "Email", "Phone", "Assessment", "Coding Score", "Applied", "Resume", "GitHub"];
//     }
//     if (activeTab === "shortlisted") {
//       return ["", "Name", "Email", "Phone", "Test", "Interview Score", "Applied", "Resume", "GitHub", "Actions", "Coding", "Interview"];
//     }

//     return [];
//   }, [activeTab]);


//   // Applicants who haven't received a test yet (or whose invite expired)
//   const uninvitedApplicants = useMemo(() => {
//     if (activeTab !== "applied") return [];
//     return applicants.filter(a => {
//       const s = a.assessment?.status;
//       if (!s) return true; // never sent
//       if (s === "expired") return true;
//       // check if expired by date even if status not updated
//       if (a.assessment?.expiresAt && new Date(a.assessment.expiresAt) < new Date()
//         && !["submitted", "evaluated"].includes(s)) return true;
//       return false;
//     });
//   }, [applicants, activeTab]);

//   const invitedApplicants = useMemo(() =>
//     applicants.filter(a => !uninvitedApplicants.some(u => u._id === a._id)),
//     [applicants, uninvitedApplicants]
//   );

//   // Of the selected (draft) applicants, how many are actually eligible (not yet invited)?
//   const eligibleDraftCount = useMemo(() =>
//     draftApplicants.filter(id => uninvitedApplicants.some(a => String(a._id) === id)).length,
//     [draftApplicants, uninvitedApplicants]
//   );
//   const allVisibleSelected = useMemo(() => {
//     if (!["applied", "assessment", "shortlisted"].includes(activeTab)) return false;
//     const ids = applicants.map((a) => String(a._id));
//     return ids.length > 0 && ids.every((id) => draftApplicants.includes(id));
//   }, [activeTab, applicants, draftApplicants]);

//   const handleEvaluateAll = async () => {
//     // Instead of window.confirm, show custom modal
//     setShowEvalConfirm(true);
//   };

//   const confirmEvaluate = async () => {
//     setShowEvalConfirm(false); // close modal
//     setEvaluating(true);
//     setEvalMessage(null);

//     try {
//       const token = localStorage.getItem("companyToken");
//       const response = await fetch(
//         `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/evaluate-submissions`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Evaluation request failed");
//       }

//       setEvalMessage({
//         type: "success",
//         text: data.message || `Evaluated ${data.evaluatedSubmissions || 0} submissions across ${data.evaluatedSessions || 0} tests`,
//       });

//       // Refresh data
//       await fetchApplicants();
//       await fetchCounts();
//     } catch (err) {
//       console.error("Evaluation error:", err);
//       setEvalMessage({
//         type: "error",
//         text: err.message || "Failed to start evaluation",
//       });
//     } finally {
//       setEvaluating(false);
//     }
//   };
//   // Updated handler – now opens modal instead of confirm()
//   const handleUpdateInterview = (newStatus, applicationId) => {
//     setPendingInterviewStatus({ status: newStatus, applicationId });
//     setShowInterviewStatusConfirm(true);
//   };

//   // New confirmation handler that does the actual API call
//   const confirmUpdateInterview = async () => {
//     if (!pendingInterviewStatus) return;

//     const { status, applicationId } = pendingInterviewStatus;

//     setShowInterviewStatusConfirm(false);
//     setPendingInterviewStatus(null);

//     try {
//       const token = localStorage.getItem("companyToken");
//       const res = await fetch(
//         `${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${applicationId}/interview-status`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status }),
//         }
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to update interview status");
//       }

//       showToast(`Interview marked as ${status}`, 5000);
//       await fetchApplicants(); // Refresh table
//     } catch (err) {
//       console.error("Update interview status error:", err);
//       showToast(err.message || "Could not update status", 5000);
//     }
//   };
//   const handleMoveToFinal = () => {
//     if (draftApplicants.length === 0) {
//       showToast("No candidates selected to move to final stage", 5000);
//       return;
//     }

//     // Show custom modal instead of window.confirm
//     setShowMoveToFinalConfirm(true);
//   };

//   const confirmMoveToFinal = async () => {
//     setShowMoveToFinalConfirm(false);
//     setShortlisting(true); // reuse loading state

//     try {
//       const token = localStorage.getItem("companyToken");
//       const response = await fetch(
//         `${BACKEND_URL}/api/company/jobs/${jobId}/move-to-final`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ applicationIds: draftApplicants }),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to move candidates");
//       }

//       showToast(
//         data.message || `Moved ${data.movedCount || draftCount} candidates to final stage!`,
//         5000
//       );

//       // Refresh everything
//       await fetchApplicants();
//       await fetchCounts();
//       await refreshDraftSelection(); // clears checkboxes
//     } catch (err) {
//       console.error("Move to final error:", err);
//       showToast(err.message || "Failed to move to final stage", 5000);
//     } finally {
//       setShortlisting(false);
//     }
//   };

//   // Add this for Hire / Reject after interview is completed
//   const handleFinalDecision = (decision, applicationId) => {
//     setPendingDecision({ decision, applicationId });
//     setShowFinalDecisionConfirm(true);
//   };


//   const confirmFinalDecision = async () => {
//     if (!pendingDecision) return;

//     const { decision, applicationId } = pendingDecision;
//     setShowFinalDecisionConfirm(false);
//     setPendingDecision(null);

//     try {
//       const token = localStorage.getItem("companyToken");
//       const res = await fetch(
//         `${BACKEND_URL}/api/company/jobs/${jobId}/applications/${applicationId}/final-decision`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ decision }),
//         }
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to make decision");
//       }

//       showToast(
//         `Candidate marked as ${decision === "hired" ? "Hired" : "Rejected"}`,
//         5000
//       );

//       await fetchApplicants(); // Refresh table
//     } catch (err) {
//       console.error("Final decision error:", err);
//       showToast(err.message || "Failed to update final decision", 5000);
//     }
//   };

//   return (
//     <CompanyDashboardLayout>

//       <BackButton to={`/company/jobs/${jobId}`} className="mb-6" />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">


//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
//             Applicants Pipeline
//           </h1>
//           {job && (
//             <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
//               {job.title}
//             </p>
//           )}
//         </div>
//         {activeTab === "applied" && (
//           <div className="flex items-center gap-3">
//             {uninvitedApplicants.length > 0 && (
//               <button
//                 onClick={async () => {
//                   const token = localStorage.getItem("companyToken");
//                   // Clear then add only uninvited
//                   await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}/draft-applicants`,
//                     { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//                   await addDraftApplicants(jobId, uninvitedApplicants.map(a => String(a._id)));
//                   await refreshDraftSelection();
//                   showToast(`Selected ${uninvitedApplicants.length} uninvited candidate(s)`, 3000);
//                 }}
//                 className="text-sm text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
//               >
//                 Select all uninvited ({uninvitedApplicants.length})
//               </button>
//             )}
//             <span className="text-sm text-gray-600 dark:text-gray-300">
//               Selected: <span className="font-semibold">{draftCount}</span>
//               {eligibleDraftCount !== draftCount && draftCount > 0 && (
//                 <span className="ml-1 text-amber-600">({eligibleDraftCount} eligible for test)</span>
//               )}
//             </span>
//           </div>
//         )}
        
//         {activeTab === "applied" && applicants.length > 0 && (
//           <div className="flex items-center gap-3 text-sm">
//             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200">
//               ⏰ <strong>{uninvitedApplicants.length}</strong> not sent
//             </span>
//             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
//               📨 <strong>{invitedApplicants.length}</strong> invited
//             </span>
//           </div>
//         )}
//         {/* Configure / View Sent Challenges – show in Applied + Assessment tabs only */}
//         {["applied", "assessment"].includes(activeTab) && (
//           <div className="mb-8 flex flex-wrap gap-4">
//             {job && job.selectedChallenges?.length > 0 ? (
//               // Challenges already configured & sent → show View only
//               <button
//                 onClick={() => setShowSentChallengesModal(true)}
//                 className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg shadow-sm transition bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 <Code size={18} />
//                 View Sent Challenges
//               </button>
//             ) : (
//               // No challenges sent yet → show Configure (only active if something selected)
//               <Link
//                 to={`/company/jobs/${jobId}/challenges`}
//                 className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg shadow-sm transition ${draftCount === 0
//                   ? "bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none"
//                   : "bg-indigo-600 hover:bg-indigo-700 text-white"
//                   }`}
//               >
//                 <Code size={18} />
//                 Configure Coding Test & Send
//                 {draftCount > 0 && ` (${draftCount} selected)`}
//               </Link>
//             )}
//           </div>
//         )}
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="flex flex-wrap gap-2">
//             {TABS.map((t) => {
//               const isActive = activeTab === t.key;
//               const count = counts[t.key] ?? 0;
//               return (
//                 <button
//                   key={t.key}
//                   onClick={() => setActiveTab(t.key)}
//                   className={`px-4 py-2 rounded-full text-sm font-semibold border transition
//             ${isActive
//                       ? "bg-primary text-white border-primary"
//                       : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-primary/5"
//                     }`}
//                 >
//                   {t.label}{" "}
//                   <span className={`${isActive ? "text-white/90" : "text-gray-500 dark:text-gray-400"}`}>
//                     ({count})
//                   </span>
//                 </button>
//               );
//             })}

//             {/* Evaluate All – only assessment */}
//             {activeTab === "assessment" && (
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={handleEvaluateAll}
//                   disabled={evaluating || loading}
//                   className={`
//             inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all
//             ${evaluating ? "bg-gray-400 text-white cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
//           `}
//                 >
//                   {evaluating ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Evaluating...
//                     </>
//                   ) : (
//                     "Evaluate All Submitted Tests"
//                   )}
//                 </button>
//                 {evalMessage && (
//                   <div className={`text-sm px-4 py-2 rounded-lg ${evalMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                     {evalMessage.text}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Shortlist Selected – only assessment */}
//             {activeTab === "assessment" && (
//               <button
//                 onClick={handleShortlistSelected}
//                 disabled={shortlisting || draftCount === 0}
//                 className={`
//           inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all
//           ${shortlisting || draftCount === 0
//                     ? "bg-gray-400 text-white cursor-not-allowed"
//                     : "bg-green-600 hover:bg-green-700 text-white"}
//         `}
//               >
//                 {shortlisting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Shortlisting...
//                   </>
//                 ) : (
//                   `Shortlist Selected (${draftCount})`
//                 )}
//               </button>
//             )}

//             {/* NEW: Move to Final Decision – only shortlisted */}
//             {activeTab === "shortlisted" && (
//               <button
//                 onClick={handleMoveToFinal}   // ← you need to add this function (see below)
//                 disabled={shortlisting || draftCount === 0}
//                 className={`
//           inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all
//           ${shortlisting || draftCount === 0
//                     ? "bg-gray-400 text-white cursor-not-allowed"
//                     : "bg-purple-600 hover:bg-purple-700 text-white"}
//         `}
//               >
//                 {shortlisting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Moving...
//                   </>
//                 ) : (
//                   `Move to Final (${draftCount})`
//                 )}
//               </button>
//             )}
//           </div>

//           {/* Selected count – show in applied AND shortlisted now */}
//           {(activeTab === "applied" || activeTab === "shortlisted") && (
//             <div className="flex items-center gap-3">
//               <span className="text-sm text-gray-600 dark:text-gray-300">
//                 Selected: <span className="font-semibold">{draftCount}</span>
//               </span>
//             </div>
//           )}

//         </div>

//         {/* ── Configure Rubric button – shortlisted tab only ── */}
//         {activeTab === "shortlisted" && (
//           <div className="mb-5 flex items-center gap-3">
//             <button
//               onClick={() => setRubricOpen(true)}
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition"
//             >
//               Configure Interview Rubric
//             </button>
//             {job?.interviewRubric?.length > 0 && (
//               <span className="text-xs text-gray-500 dark:text-gray-400">
//                 {job.interviewRubric.length} criteria defined
//               </span>
//             )}
//           </div>
//         )}
//         {/* Loading / Empty / Table */}
//         {loading ? (
//           <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//             Loading applicants...
//           </div>
//         ) : applicants.length === 0 ? (
//           <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
//             No applicants found in this stage.
//           </div>
//         ) : activeTab === "final" ? (
//           // ─── CLEAN FINAL TAB – NO DUPLICATION ───
//           <div className="space-y-12">
//             {/* Pending Final Decision */}
//             <section>
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-400 flex items-center gap-3">
//                   <span>Pending Final Decision</span>
//                   <span className="text-lg font-semibold bg-amber-100 dark:bg-amber-900/40 px-3 py-1 rounded-full">
//                     {applicants.filter(a => a.status === "final_review").length}
//                   </span>
//                 </h3>
//               </div>

//               {applicants.filter(a => a.status === "final_review").length === 0 ? (
//                 <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-10 text-center">
//                   <p className="text-amber-700 dark:text-amber-300 text-lg font-medium">
//                     No candidates awaiting final decision yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-50 dark:bg-gray-900/60">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Test Score</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Interview Score</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {applicants
//                         .filter(a => a.status === "final_review")
//                         .map(app => (
//                           <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
//                             <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
//                               {app.developerSnapshot?.name || "—"}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                               {app.developerSnapshot?.email || "—"}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <ScorePill label="Test" value={app.codingChallengeScore ?? "—"} strong />
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {app.interviewScore != null ? (
//                                 <ScorePill label="Interview" value={app.interviewScore} />
//                               ) : "—"}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-right flex gap-3 justify-end">
//                               <button
//                                 onClick={() => handleFinalDecision("hired", app._id)}
//                                 className="px-4 py-1.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-sm"
//                               >
//                                 Hire
//                               </button>
//                               <button
//                                 onClick={() => handleFinalDecision("rejected", app._id)}
//                                 className="px-4 py-1.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm"
//                               >
//                                 Reject
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>

//             {/* Hired Section */}
//             <section>
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center gap-3">
//                   <span>Hired Candidates</span>
//                   <span className="text-lg font-semibold bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">
//                     {applicants.filter(a => a.status === "hired").length}
//                   </span>
//                 </h3>
//               </div>

//               {applicants.filter(a => a.status === "hired").length === 0 ? (
//                 <div className="bg-green-50/40 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-10 text-center">
//                   <p className="text-green-700 dark:text-green-300 text-lg font-medium">
//                     No candidates hired yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-50 dark:bg-gray-900/60">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Test Score</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Interview Score</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {applicants
//                         .filter(a => a.status === "hired")
//                         .map(app => (
//                           <tr key={app._id} className="bg-green-50/20 dark:bg-green-950/10">
//                             <td className="px-6 py-4 whitespace-nowrap font-medium">{app.developerSnapshot?.name || "—"}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{app.developerSnapshot?.email || "—"}</td>
//                             <td className="px-6 py-4 whitespace-nowrap"><ScorePill label="Test" value={app.codingChallengeScore ?? "—"} strong /></td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {app.interviewScore != null ? <ScorePill label="Interview" value={app.interviewScore} /> : "—"}
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>

//             {/* Rejected Section */}
//             <section>
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 flex items-center gap-3">
//                   <span>Not Selected / Rejected</span>
//                   <span className="text-lg font-semibold bg-red-100 dark:bg-red-900/40 px-3 py-1 rounded-full">
//                     {applicants.filter(a => a.status === "rejected").length}
//                   </span>
//                 </h3>
//               </div>

//               {applicants.filter(a => a.status === "rejected").length === 0 ? (
//                 <div className="bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-10 text-center">
//                   <p className="text-red-700 dark:text-red-300 text-lg font-medium">
//                     No candidates rejected yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-50 dark:bg-gray-900/60">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Test Score</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Interview Score</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {applicants
//                         .filter(a => a.status === "rejected")
//                         .map(app => (
//                           <tr key={app._id} className="bg-red-50/20 dark:bg-red-950/5">
//                             <td className="px-6 py-4 whitespace-nowrap font-medium">{app.developerSnapshot?.name || "—"}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{app.developerSnapshot?.email || "—"}</td>
//                             <td className="px-6 py-4 whitespace-nowrap"><ScorePill label="Test" value={app.codingChallengeScore ?? "—"} strong /></td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {app.interviewScore != null ? <ScorePill label="Interview" value={app.interviewScore} /> : "—"}
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           </div>
//         ) : (
//           // ─── NORMAL TABLE FOR OTHER TABS (applied, assessment, shortlisted) ───
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-900/70">
//                   <tr>
//                     {tableHead.map((h, idx) => {
//                       if (
//                         ["applied", "assessment", "shortlisted"].includes(activeTab) &&
//                         idx === 0
//                       ) {
//                         return (
//                           <th
//                             key="select"
//                             className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                           >
//                             <button
//                               onClick={toggleSelectAll}
//                               className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary"
//                               title={allVisibleSelected ? "Unselect all" : "Select all"}
//                             >
//                               {allVisibleSelected ? <CheckSquare size={18} /> : <Square size={18} />}
//                             </button>
//                           </th>
//                         );
//                       }
//                       return (
//                         <th
//                           key={h}
//                           className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                         >
//                           {h}
//                         </th>
//                       );
//                     })}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {applicants.map((app) => {
//                     const dev = app.developerSnapshot || app.developer || {};
//                     const appliedDate = app.appliedAt
//                       ? new Date(app.appliedAt).toLocaleDateString()
//                       : "—";
//                     const ml = app.mlScores || null;
//                     const assessment = app.assessment || null;
//                     const appId = String(app._id);
//                     const isChecked = draftApplicants.includes(appId);

//                     return (
//                       <tr
//                         key={app._id}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
//                       >
//                         {["applied", "assessment", "shortlisted"].includes(activeTab) && (
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <button
//                               onClick={() => toggleSelectOne(appId)}
//                               className="inline-flex items-center text-gray-700 dark:text-gray-200 hover:text-primary"
//                               title={isChecked ? "Unselect" : "Select"}
//                             >
//                               {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
//                             </button>
//                           </td>
//                         )}
//                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
//                           {dev.name || "—"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                           {dev.email || "—"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                           {dev.phone || "—"}
//                         </td>

//                         {/* KEEP YOUR EXISTING COLUMN LOGIC FOR APPLIED / ASSESSMENT / SHORTLISTED */}
//                         {/* Paste your existing conditional columns here, e.g.: */}
//                         {activeTab === "applied" && (
//                           <>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <TestStatusBadge assessment={app.assessment} />
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                               {appliedDate}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {ml ? (
//                                 <div className="flex flex-wrap gap-2">
//                                   <ScorePill label="Match" value={ml.match} />
//                                   <ScorePill label="Exp" value={ml.experience} />
//                                   <ScorePill label="Cred" value={ml.credibility} />
//                                   <ScorePill label="Rank" value={ml.screening} strong />
//                                 </div>
//                               ) : (
//                                 <span className="text-gray-500 text-sm">—</span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {dev.resumeUrl ? (
//                                 <div className="flex items-center gap-3">
//                                   <button
//                                     onClick={() => handleViewResume(dev._id)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
//                                   >
//                                     <Eye size={15} />
//                                     View
//                                   </button>
//                                   <button
//                                     onClick={() => handleDownloadResume(dev._id)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                                   >
//                                     <Download size={15} />
//                                     Download
//                                   </button>
//                                 </div>
//                               ) : (
//                                 "—"
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {dev.githubProfile?.html_url ? (
//                                 <a
//                                   href={dev.githubProfile.html_url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
//                                 >
//                                   <Github size={16} />
//                                   GitHub
//                                 </a>
//                               ) : (
//                                 "—"
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {(() => {
//                                 const alreadyInvited = app.assessment?.status &&
//                                   !["expired"].includes(app.assessment.status) &&
//                                   !(app.assessment?.expiresAt && new Date(app.assessment.expiresAt) < new Date()
//                                     && !["submitted", "evaluated"].includes(app.assessment.status));

//                                 if (alreadyInvited) {
//                                   return (
//                                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
//                                       ✓ Test Sent
//                                     </span>
//                                   );
//                                 }

//                                 if (!job?.selectedChallenges?.length) {
//                                   return <span className="text-xs text-gray-400">Configure test first</span>;
//                                 }

//                                 return (
//                                   <button
//                                     onClick={() => openSendTestModal(app)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white transition shadow-sm"
//                                   >
//                                     Send Test
//                                   </button>
//                                 );
//                               })()}
//                             </td>
//                           </>
//                         )}

//                         {activeTab === "assessment" && (
//                           <>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex flex-col gap-1">
//                                 <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
//                                   <ClipboardCheck size={16} className="text-primary" />
//                                   {assessment?.status ? titleCase(assessment.status) : "Invited"}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   Invited: {assessment?.invitedAt ? new Date(assessment.invitedAt).toLocaleDateString() : "—"}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   Expires: {assessment?.expiresAt ? new Date(assessment.expiresAt).toLocaleDateString() : "—"}
//                                 </span>
//                               </div>
//                             </td>

//                             {/* NEW: Coding Score Column */}
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {app.codingChallengeScore != null ? (
//                                 <button
//                                   onClick={() => openCodingModal(app)}  // Make it clickable to open modal
//                                   className="focus:outline-none"  // Optional: for better UX
//                                 >
//                                   <ScorePill
//                                     label="Coding"
//                                     value={app.codingChallengeScore}
//                                     strong  // Makes it bold/emphasized like ranks
//                                   />
//                                 </button>
//                               ) : (
//                                 <span className="text-gray-500 text-sm">Not evaluated</span>
//                               )}
//                             </td>

//                             <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                               {appliedDate}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {dev.resumeUrl ? (
//                                 <div className="flex items-center gap-3">
//                                   <button onClick={() => handleViewResume(dev._id)} className="...">
//                                     <Eye size={15} /> View
//                                   </button>
//                                   <button onClick={() => handleDownloadResume(dev._id)} className="...">
//                                     <Download size={15} /> Download
//                                   </button>
//                                 </div>
//                               ) : "—"}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {dev.githubProfile?.html_url ? (
//                                 <a href={dev.githubProfile.html_url} target="_blank" className="...">
//                                   <Github size={16} /> GitHub
//                                 </a>
//                               ) : "—"}
//                             </td>
//                           </>
//                         )}

//                         {activeTab === "shortlisted" && (
//                           <>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <ScorePill label="Test" value={app.codingChallengeScore ?? 0} strong />
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {app.interviewScore != null ? (
//                                 <ScorePill label="Interview Score" value={app.interviewScore} />
//                               ) : (
//                                 <span className="text-gray-500 text-sm">—</span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
//                               {appliedDate}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {dev.resumeUrl ? (
//                                 <div className="flex items-center gap-3">
//                                   <button
//                                     onClick={() => handleViewResume(dev._id)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
//                                   >
//                                     <Eye size={15} />
//                                     View
//                                   </button>
//                                   <button
//                                     onClick={() => handleDownloadResume(dev._id)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                                   >
//                                     <Download size={15} />
//                                     Download
//                                   </button>
//                                 </div>
//                               ) : (
//                                 "—"
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {dev.githubProfile?.html_url ? (
//                                 <a
//                                   href={dev.githubProfile.html_url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
//                                 >
//                                   <Github size={16} />
//                                   GitHub
//                                 </a>
//                               ) : (
//                                 "—"
//                               )}
//                             </td>

//                             {/* Interview Score */}
//                             {/* Interview Scorecard */}
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <button
//                                 onClick={() => {
//                                   setScorecardApp(app);
//                                   setScorecardOpen(true);
//                                 }}
//                                 disabled={app.interview?.status !== "completed"}
//                                 title={app.interview?.status !== "completed" ? "Mark interview as Completed first" : "Fill scorecard"}
//                                 className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border transition
//       ${app.interview?.status === "completed"
//                                     ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30"
//                                     : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                                   }`}
//                               >
//                                 <Star size={16} />
//                                 {app.interviewScore != null ? "Update Scorecard" : "Score Interview"}
//                               </button>
//                             </td>

//                             {/* Coding Details */}
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {app.codingChallengeScore != null && (
//                                 <button
//                                   onClick={() => openCodingModal(app)}
//                                   className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
//                                 >
//                                   <Code size={14} />
//                                   Coding
//                                 </button>
//                               )}
//                             </td>

//                             {/* Interview Actions Column */}
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {app.interview?.status === "scheduled" ? (
//                                 <div className="flex flex-col gap-2 text-sm">
//                                   <div className="font-medium text-blue-600">
//                                     {new Date(app.interview.scheduledAt).toLocaleString("en-PK", {
//                                       dateStyle: "medium",
//                                       timeStyle: "short",
//                                     })}
//                                   </div>

//                                   <a
//                                     href={app.interview.videoLink}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 hover:underline text-xs"
//                                   >
//                                     Join Room
//                                   </a>

//                                   <div className="flex gap-2 mt-1">
//                                     <button
//                                       onClick={() => handleUpdateInterview("completed", app._id)}
//                                       className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
//                                     >
//                                       Completed
//                                     </button>
//                                     <button
//                                       onClick={() => handleUpdateInterview("no_show", app._id)}
//                                       className="px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700"
//                                     >
//                                       No-show
//                                     </button>
//                                     <button
//                                       onClick={() => handleUpdateInterview("cancelled", app._id)}
//                                       className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
//                                     >
//                                       Cancel
//                                     </button>
//                                   </div>
//                                 </div>
//                               ) : app.interview?.status === "completed" ? (
//                                 <div className="flex gap-2">
//                                   <span className="text-green-600 font-medium">Interview Completed</span>
//                                 </div>
//                               ) : (
//                                 <button
//                                   onClick={() => {
//                                     setSelectedAppForInterview(app);
//                                     setScheduleOpen(true);
//                                     setScheduledAt("");
//                                     setInterviewNotes("");
//                                   }}
//                                   className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
//                                 >
//                                   Schedule Interview
//                                 </button>
//                               )}
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Interview Modal */}
//         {interviewOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//             <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//               <div className="px-6 py-4 border-b">

//                 <h2 className="text-lg font-bold text-gray-900">Interview Score</h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {selectedApp?.developerSnapshot?.name || "Candidate"}
//                 </p>
//               </div>
//               <div className="p-6 space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Score (0–100)
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={interviewScore}
//                   onChange={(e) => setInterviewScore(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//                   placeholder="e.g. 78"
//                 />
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     onClick={() => {
//                       setInterviewOpen(false);
//                       setSelectedApp(null);
//                       setInterviewScore("");
//                     }}
//                     className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={onSaveInterview}
//                     className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
//                   >
//                     Save
//                   </button>
//                 </div>
//                 <small className="text-gray">Make sure to mark the interview status before adding score</small>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Custom Confirm Modal for Evaluate All */}
//       <ConfirmModal
//         open={showEvalConfirm}
//         title="Evaluate All Submitted Tests?"
//         message="This will run AI evaluation on every submitted coding test for this job.This action may take a few moments depending on the number of submissions. Continue?"
//         confirmLabel="Yes, Evaluate"
//         cancelLabel="Cancel"
//         onConfirm={confirmEvaluate}
//         onCancel={() => setShowEvalConfirm(false)}
//       />

//       <ConfirmModal
//         open={showShortlistConfirm}
//         title="Shortlist Selected Candidates?"
//         message={`This will move ${draftCount} selected candidate(s) from "In Assessment" to "Shortlisted". Continue?`}
//         confirmLabel="Yes, Shortlist"
//         cancelLabel="Cancel"
//         onConfirm={confirmShortlist}
//         onCancel={() => setShowShortlistConfirm(false)}
//       />

//       <ConfirmModal
//         open={showMoveToFinalConfirm}
//         title="Move to Final Decisions?"
//         message={`This will move ${draftCount} selected candidate(s) from "Shortlisted" to "Final Decisions" stage for review and final hire/reject decision. Continue?`}
//         confirmLabel="Yes, Move"
//         cancelLabel="Cancel"
//         onConfirm={confirmMoveToFinal}
//         onCancel={() => setShowMoveToFinalConfirm(false)}
//       />


//       <ConfirmModal
//         open={showFinalDecisionConfirm}
//         title={`Confirm ${pendingDecision?.decision === "hired" ? "Hiring" : "Rejecting"} Candidate?`}
//         message={`Are you sure you want to ${pendingDecision?.decision === "hired" ? "hire" : "reject"} this candidate? This action cannot be undone.`}
//         confirmLabel={pendingDecision?.decision === "hired" ? "Yes, Hire" : "Yes, Reject"}
//         cancelLabel="Cancel"
//         onConfirm={confirmFinalDecision}
//         onCancel={() => {
//           setShowFinalDecisionConfirm(false);
//           setPendingDecision(null);
//         }}
//       />

//       <ConfirmModal
//         open={showInterviewStatusConfirm}
//         title={`Mark Interview as "${pendingInterviewStatus?.status}"?`}
//         message={`Are you sure you want to mark this interview as "${pendingInterviewStatus?.status}"? This cannot be undone.`}
//         confirmLabel="Yes, Update"
//         cancelLabel="Cancel"
//         onConfirm={confirmUpdateInterview}
//         onCancel={() => {
//           setShowInterviewStatusConfirm(false);
//           setPendingInterviewStatus(null);
//         }}
//       />
//       {/* Modal: View Sent Challenges */}
//       {job && showSentChallengesModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
//             {/* Header */}
//             <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                 Sent Coding Challenges ({job.selectedChallenges.length})
//               </h2>
//               <button
//                 onClick={() => setShowSentChallengesModal(false)}
//                 className="text-3xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 overflow-y-auto flex-1 space-y-6">
//               {job.selectedChallenges.length === 0 ? (
//                 <p className="text-center text-gray-500 py-10">
//                   No challenges have been sent for this job yet.
//                 </p>
//               ) : (
//                 job.selectedChallenges.map((sel, index) => {
//                   const ch = sel.challengeId || {}; // fallback
//                   return (
//                     <div
//                       key={sel._id || index}
//                       className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                     >
//                       {/* Challenge Header */}
//                       <div className="px-5 py-3 bg-gray-100 dark:bg-gray-700 border-b flex justify-between items-center">
//                         <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
//                           {ch.title || `Challenge ${index + 1}`}
//                         </h3>
//                         <div className="flex items-center gap-3">
//                           <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
//                             {sel.timeLimit || ch.timeLimit || 30} min
//                           </span>
//                           <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
//                             {ch.difficulty || "—"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Problem Statement */}
//                       <div className="p-5">
//                         <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Problem Statement
//                         </h4>
//                         <div className="prose dark:prose-invert text-sm max-h-60 overflow-y-auto">
//                           <p className="whitespace-pre-wrap">
//                             {ch.problemStatement || "No problem statement available."}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             {/* Footer */}
//             <div className="p-4 border-t flex justify-end bg-gray-50 dark:bg-gray-800">
//               <button
//                 onClick={() => setShowSentChallengesModal(false)}
//                 className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {scheduleOpen && selectedAppForInterview && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//             <div className="px-6 py-4 border-b">
//               <h2 className="text-lg font-bold text-gray-900">Schedule Interview</h2>
//               <p className="text-sm text-gray-600 mt-1">
//                 For {selectedAppForInterview.developerSnapshot?.name}
//               </p>
//             </div>
//             <div className="p-6 space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Date & Time (PKT)
//               </label>
//               <input
//                 type="datetime-local"
//                 value={scheduledAt}
//                 onChange={(e) => setScheduledAt(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//                 disabled={scheduling} // optional: disable input while loading
//               />
//               <label className="block text-sm font-medium text-gray-700">
//                 Notes (optional)
//               </label>
//               <textarea
//                 value={interviewNotes}
//                 onChange={(e) => setInterviewNotes(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//                 rows={3}
//                 placeholder="e.g., Focus on React skills"
//                 disabled={scheduling}
//               />
//               <div className="flex gap-3 pt-2">
//                 <button
//                   onClick={() => setScheduleOpen(false)}
//                   disabled={scheduling}
//                   className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={async () => {
//                     if (!scheduledAt) {
//                       showToast("Please select a date and time", 5000);
//                       return;
//                     }

//                     setScheduling(true);
//                     try {
//                       const token = localStorage.getItem("companyToken");
//                       const response = await fetch(
//                         `${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${selectedAppForInterview._id}/schedule-interview`,
//                         {
//                           method: "POST",
//                           headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                           },
//                           body: JSON.stringify({ scheduledAt, notes: interviewNotes }),
//                         }
//                       );
//                       const data = await response.json();
//                       if (!response.ok) throw new Error(data.message || "Failed to schedule");

//                       showToast("Interview scheduled and notified!", 5000);
//                       setScheduleOpen(false);
//                       setScheduledAt("");
//                       setInterviewNotes("");
//                       fetchApplicants(); // Refresh list
//                     } catch (err) {
//                       showToast(err.message || "Failed to schedule", 5000);
//                     } finally {
//                       setScheduling(false);
//                     }
//                   }}
//                   disabled={scheduling}
//                   className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2
//               ${scheduling
//                       ? "bg-blue-400 cursor-not-allowed"
//                       : "bg-primary hover:bg-primary/90"
//                     }`}
//                 >
//                   {scheduling ? (
//                     <>
//                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Scheduling...
//                     </>
//                   ) : (
//                     "Schedule & Notify"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ==================== CODING DETAILS MODAL ==================== */}
//       {codingModalOpen && selectedApplicant && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
//           <div className="bg-white dark:bg-gray-900 w-full max-w-6xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">

//             {/* Header */}
//             <div className="sticky top-0 bg-white dark:bg-gray-900 border-b px-6 py-4 flex justify-between items-center z-10">
//               <div>
//                 <h2 className="text-2xl font-bold">
//                   Coding Assessment Results
//                 </h2>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   {selectedApplicant.developerSnapshot?.name || selectedApplicant.developer?.name}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setCodingModalOpen(false)}
//                 className="text-3xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Body */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-8">
//               {loadingSession ? (
//                 <div className="text-center py-20 text-gray-500">Loading coding details...</div>
//               ) : sessionData ? (
//                 <>
//                   <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl flex justify-between items-center">
//                     <div>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Total Score</p>
//                       <p className="text-4xl font-bold text-indigo-600">
//                         {sessionData.application.codingChallengeScore?.toFixed(2) || "—"}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
//                       <p className="font-medium capitalize">{sessionData.session.status}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-6">
//                     {sessionData.session.submissions.map((sub, index) => (
//                       <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
//                         <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 font-medium flex justify-between">
//                           <span>Challenge {index + 1}: {sub.title}</span>
//                           {sub.score !== null && (
//                             <span className="text-indigo-600 font-bold">Score: {sub.score.toFixed(2)}</span>
//                           )}
//                         </div>

//                         <div className="p-6 space-y-6">
//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h5 className="font-medium mb-2">Problem Statement</h5>
//                               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
//                                 {sub.problemStatement || "No description available"}
//                               </p>
//                             </div>
//                             <div>
//                               <h5 className="font-medium mb-2">Submitted Code ({sub.language})</h5>
//                               <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto max-h-80 text-sm font-mono">
//                                 {sub.code || "// No code submitted"}
//                               </pre>
//                             </div>
//                           </div>

//                           {sub.evaluation && (
//                             <div className="bg-white dark:bg-gray-800 border rounded-xl p-5">
//                               <div className="grid grid-cols-3 gap-4 mb-6 text-center">
//                                 <div>
//                                   <p className="text-xs text-gray-500">Correctness</p>
//                                   <p className="text-2xl font-bold">{(sub.evaluation.correctness * 100).toFixed(0)}%</p>
//                                 </div>
//                                 <div>
//                                   <p className="text-xs text-gray-500">Performance</p>
//                                   <p className="text-2xl font-bold">{(sub.evaluation.performance * 100).toFixed(0)}%</p>
//                                 </div>
//                                 <div>
//                                   <p className="text-xs text-gray-500">Code Quality</p>
//                                   <p className="text-2xl font-bold">{(sub.evaluation.codeQuality * 100).toFixed(0)}%</p>
//                                 </div>
//                               </div>

//                               {sub.evaluation.aiReview && (
//                                 <div className="space-y-4">
//                                   <h5 className="font-semibold">AI Review</h5>
//                                   <p className="text-gray-700 dark:text-gray-300">
//                                     {sub.evaluation.aiReview.feedback}
//                                   </p>

//                                   <div className="grid md:grid-cols-2 gap-6">
//                                     <div>
//                                       <h6 className="text-green-600 font-medium">Strengths</h6>
//                                       <ul className="list-disc pl-5 text-sm">
//                                         {sub.evaluation.aiReview.strengths?.map((s, i) => <li key={i}>{s}</li>)}
//                                       </ul>
//                                     </div>
//                                     <div>
//                                       <h6 className="text-amber-600 font-medium">Suggestions</h6>
//                                       <ul className="list-disc pl-5 text-sm">
//                                         {sub.evaluation.aiReview.improvements?.map((s, i) => <li key={i}>{s}</li>)}
//                                       </ul>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center py-20 text-gray-500">No data available</div>
//               )}
//             </div>

//             <div className="p-4 border-t flex justify-end bg-white dark:bg-gray-900">
//               <button
//                 onClick={() => setCodingModalOpen(false)}
//                 className="px-8 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ── Rubric Builder Modal ── */}
//       {rubricOpen && (
//         <RubricBuilderModal
//           jobId={jobId}
//           onClose={() => setRubricOpen(false)}
//           onSaved={(rubric) => {
//             // Patch the rubric into local job state so the count updates immediately
//             setJob(prev => prev ? { ...prev, interviewRubric: rubric } : prev);
//           }}
//         />
//       )}

//       {/* ── Scorecard Modal ── */}
//       {scorecardOpen && scorecardApp && (
//         <ScorecardModal
//           jobId={jobId}
//           application={scorecardApp}
//           onClose={() => {
//             setScorecardOpen(false);
//             setScorecardApp(null);
//           }}
//           onSaved={(newScore) => {
//             // Update the score in local applicants state immediately
//             setApplicants(prev =>
//               prev.map(a =>
//                 a._id === scorecardApp._id
//                   ? { ...a, interviewScore: newScore }
//                   : a
//               )
//             );
//           }}
//         />
//       )}

//       {sendTestModalOpen && sendTestTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//             <div className="px-6 py-4 border-b">
//               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Send Coding Test</h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 To: <strong>{sendTestTarget.developerSnapshot?.name}</strong>
//               </p>
//             </div>
//             <div className="p-6 space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Available from <span className="text-gray-400">(optional)</span>
//                 </label>
//                 <input type="datetime-local" value={sendTestStart}
//                   onChange={e => setSendTestStart(e.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600" />
//                 <p className="mt-1 text-xs text-gray-500">Empty = available immediately</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Expires on <span className="text-red-500">*</span>
//                 </label>
//                 <input type="datetime-local" value={sendTestEnd}
//                   onChange={e => setSendTestEnd(e.target.value)} required
//                   className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600" />
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button onClick={() => setSendTestModalOpen(false)} disabled={sendingTest}
//                   className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50">
//                   Cancel
//                 </button>
//                 <button onClick={confirmSendTestToOne} disabled={sendingTest || !sendTestEnd}
//                   className={`flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition
//               ${sendingTest || !sendTestEnd ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
//                   {sendingTest ? "Sending..." : "Send Invitation"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}


//     </CompanyDashboardLayout>
//   );
// }

// function ScorePill({ label, value, strong = false }) {
//   const v = Number(value ?? 0);
//   let displayValue = "0.00";
//   let colorClass = "bg-gray-100 text-gray-700 border-gray-200";

//   if (Number.isFinite(v)) {
//     displayValue = v.toFixed(2);
//     if (v >= 0.80) colorClass = "bg-green-100 text-green-800 border-green-300";
//     else if (v >= 0.60) colorClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
//     else colorClass = "bg-red-100 text-red-800 border-red-300";
//   }

//   return (
//     <span
//       className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border
//         ${strong ? "bg-primary/10 text-primary border-primary/30" : colorClass}`}
//       title={`${label}: ${displayValue}`}
//     >
//       <span className="opacity-80">{label}</span>
//       <span className="tabular-nums font-bold">{displayValue}</span>
//     </span>
//   );
// }

// function titleCase(s) {
//   const str = String(s || "");
//   return str.charAt(0).toUpperCase() + str.slice(1).replaceAll("_", " ");
// }


// src/pages/company/FirstStageApplicantsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import {
  getFirstStageApplicants,
  saveInterviewScore,
  addDraftApplicants,
  removeDraftApplicants,
  getDraftApplicants,
  clearDraftApplicants,
} from "../../api/company/jobs";
import { showToast } from "../../utils/toast";
import RubricBuilderModal from "../../components/company/RubricBuilderModal";
import ScorecardModal from "../../components/company/ScorecardModal";
import {
  Github,
  Download,
  Eye,
  Star,
  ClipboardCheck,
  CheckSquare,
  Square,
  Code,
  Send,
  Clock,
  Mail,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { BACKEND_URL } from "../../../config";
import BackButton from "../../components/BackButton";
import ConfirmModal from "../../components/ConfirmModal";

const TABS = [
  { key: "applied", label: "Applied" },
  { key: "assessment", label: "In Assessment" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "final", label: "Final Decisions" },
];

// ─── Reusable Send Test Modal ────────────────────────────────────────────────
function SendTestModal({ open, target, onClose, onConfirm, loading }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (open) { setStart(""); setEnd(""); }
  }, [open]);

  if (!open || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Send Coding Test</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              To: <span className="font-medium text-gray-700 dark:text-gray-300">{target.developerSnapshot?.name}</span>
            </p>
          </div>
          <button onClick={onClose} disabled={loading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Available from <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <p className="mt-1 text-xs text-gray-400">Leave empty — link activates immediately</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Expires on <span className="text-red-500">*</span>
              </label>
              <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)}
                disabled={loading} required
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition">
              Cancel
            </button>
            <button
              onClick={() => onConfirm({ availableFrom: start || undefined, availableUntil: end })}
              disabled={loading || !end}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition
                ${loading || !end ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <><Send size={15} /> Send Invitation</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Test Status Badge ────────────────────────────────────────────────────────
function TestStatusBadge({ assessment }) {
  const isExpiredByDate =
    assessment?.expiresAt &&
    new Date(assessment.expiresAt) < new Date() &&
    !["submitted", "evaluated"].includes(assessment?.status);

  if (!assessment?.status || isExpiredByDate || assessment.status === "expired") {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700/60 dark:text-gray-400 dark:border-gray-600">
          {isExpiredByDate || assessment?.status === "expired"
            ? <><Clock size={11} /> Expired</>
            : "Not Sent"}
        </span>
        {assessment?.expiresAt && (isExpiredByDate || assessment?.status === "expired") && (
          <span className="text-xs text-gray-400">
            {new Date(assessment.expiresAt).toLocaleDateString()}
          </span>
        )}
      </div>
    );
  }

  const map = {
    invited:     { label: "Invited",      cls: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",   Icon: Mail },
    in_progress: { label: "In Progress",  cls: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400", Icon: Clock },
    submitted:   { label: "Submitted",    cls: "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400",  Icon: ClipboardCheck },
    evaluated:   { label: "Evaluated",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400", Icon: Star },
  };

  const config = map[assessment.status] || map.invited;
  const Icon = config.Icon;

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.cls}`}>
        <Icon size={11} />
        {config.label}
      </span>
      {assessment.expiresAt && (
        <span className="text-xs text-gray-400">
          Exp {new Date(assessment.expiresAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

export default function FirstStageApplicantsPage() {
  const { jobId } = useParams();

  const [activeTab, setActiveTab] = useState("applied");
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [counts, setCounts] = useState({ applied: 0, assessment: 0, shortlisted: 0, final: 0 });
  const [loading, setLoading] = useState(true);

  const [draftCount, setDraftCount] = useState(0);
  const [draftApplicants, setDraftApplicants] = useState([]);

  const [interviewOpen, setInterviewOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewScore, setInterviewScore] = useState("");

  const [evaluating, setEvaluating] = useState(false);
  const [evalMessage, setEvalMessage] = useState(null);

  const [codingModalOpen, setCodingModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);

  const [showEvalConfirm, setShowEvalConfirm] = useState(false);
  const [shortlisting, setShortlisting] = useState(false);
  const [showShortlistConfirm, setShowShortlistConfirm] = useState(false);
  const [showSentChallengesModal, setShowSentChallengesModal] = useState(false);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  const [showMoveToFinalConfirm, setShowMoveToFinalConfirm] = useState(false);
  const [showFinalDecisionConfirm, setShowFinalDecisionConfirm] = useState(false);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [showInterviewStatusConfirm, setShowInterviewStatusConfirm] = useState(false);
  const [pendingInterviewStatus, setPendingInterviewStatus] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  const [rubricOpen, setRubricOpen] = useState(false);
  const [scorecardOpen, setScorecardOpen] = useState(false);
  const [scorecardApp, setScorecardApp] = useState(null);

  // ── Unified Send Test Modal state ──
  const [sendTestModalOpen, setSendTestModalOpen] = useState(false);
  const [sendTestTarget, setSendTestTarget] = useState(null);
  const [sendingTest, setSendingTest] = useState(false);

  // const [eligibleDraftCount, setEligibleDraftCount] = useState(0);


  const openSendTestModal = (app) => {
    setSendTestTarget(app);
    setSendTestModalOpen(true);
  };

  const confirmSendTestToOne = async ({ availableFrom, availableUntil }) => {
    const now = new Date(), end = new Date(availableUntil);
    const start = availableFrom ? new Date(availableFrom) : null;
    if (end <= now) { showToast("Expiry date must be in the future", 5000); return; }
    if (start && start >= end) { showToast("Start must be before expiry", 5000); return; }

    setSendingTest(true);
    try {
      const token = localStorage.getItem("companyToken");
      const res = await fetch(
        `${BACKEND_URL}/api/company/jobs/${jobId}/applications/${sendTestTarget._id}/send-test`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ availableFrom, availableUntil }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send test");
      showToast(`Test invitation sent to ${sendTestTarget.developerSnapshot?.name}`, 4000);
      setSendTestModalOpen(false);
      setSendTestTarget(null);
      await fetchApplicants();
    } catch (err) {
      showToast(err.message || "Failed to send test", 5000);
    } finally {
      setSendingTest(false);
    }
  };

  // ─────────────────────────────────────────────
  const refreshDraftSelection = async () => {
    try {
      const data = await getDraftApplicants(jobId);
      setDraftCount(data.count);
      setDraftApplicants(data.draftSelectedApplicants.map((app) => app._id.toString()));
    } catch (err) {
      console.error("Failed to refresh draft selection:", err);
    }
  };



// const fetchEligibleDraftCount = async () => {
//   if (activeTab !== "applied") {
//     setEligibleDraftCount(0);
//     return;
//   }

//   try {
//     // Get fresh draft data every time (avoid stale state)
//     const draftData = await getDraftApplicants(jobId);
//     const draftIds = draftData.draftSelectedApplicants.map(app => app._id.toString());

//     // Use current applicants list
//     const eligible = draftIds.filter(id => {
//       const app = applicants.find(a => String(a._id) === id);
//       if (!app) return false;

//       const status = app.assessment?.status;
//       const isExpired =
//         status === "expired" ||
//         (app.assessment?.expiresAt &&
//           new Date(app.assessment.expiresAt) < new Date() &&
//           !["submitted", "evaluated"].includes(status));

//       return !isExpired && (!status || status === "applied");
//     });

//     console.log("Fresh eligible count:", eligible.length, "from draftIds:", draftIds.length);
//     setEligibleDraftCount(eligible.length);
//   } catch (err) {
//     console.error("Failed to calculate eligible draft count:", err);
//   }
// };
  const handleViewResume = async (userId) => {
    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Failed to fetch resume");
      const blob = await response.blob();
      window.open(window.URL.createObjectURL(blob), "_blank");
    } catch (err) { showToast(err.message || "Failed to view resume", 5000); }
  };

  const handleDownloadResume = async (userId) => {
    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Failed to download resume");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "resume.pdf";
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch (err) { showToast(err.message || "Failed to download resume", 5000); }
  };

  const handleShortlistSelected = () => {
    if (draftApplicants.length === 0) { showToast("No candidates selected", 5000); return; }
    setShowShortlistConfirm(true);
  };

  const confirmShortlist = async () => {
    setShowShortlistConfirm(false);
    setShortlisting(true);
    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}/shortlist-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicationIds: draftApplicants }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to shortlist");
      showToast(data.message || `Shortlisted ${data.shortlistedCount} candidates!`, 5000);
      await fetchApplicants(); await fetchCounts(); await refreshDraftSelection();
    } catch (err) {
      showToast(err.message || "Failed to shortlist applicants", 5000);
    } finally { setShortlisting(false); }
  };

  const fetchCounts = async () => {
    try {
      const [a, b, c, f] = await Promise.all([
        getFirstStageApplicants(jobId, "applied"),
        getFirstStageApplicants(jobId, "assessment"),
        getFirstStageApplicants(jobId, "shortlisted"),
        getFirstStageApplicants(jobId, "final"),
      ]);
      setCounts({
        applied: a?.applicants?.length || 0,
        assessment: b?.applicants?.length || 0,
        shortlisted: c?.applicants?.length || 0,
        final: f?.applicants?.length || 0,
      });
    } catch (err) { console.warn("Counts fetch failed:", err.message); }
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await getFirstStageApplicants(jobId, activeTab);
      setJob(data.job);
      setApplicants(Array.isArray(data.applicants) ? data.applicants : []);
    } catch (err) {
      showToast(err.message || "Failed to load applicants", 5000);
      setApplicants([]);
    } finally { setLoading(false); }
  };

  // useEffect(() => {
  //   if (!jobId) return;
  //   fetchApplicants(); fetchCounts(); refreshDraftSelection();
  // }, [jobId, activeTab]);
// useEffect(() => {
//   if (!jobId) return;

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       // Load applicants + counts first
//       await Promise.all([fetchApplicants(), fetchCounts()]);

//       // Then load draft selection (depends on applicants being ready)
//       await refreshDraftSelection();

//       // Finally calculate eligible count (now has fresh applicants + draft)
//       if (activeTab === "applied") {
//         await fetchEligibleDraftCount();
//       }
//     } catch (err) {
//       console.error("Data loading failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadData();
// }, [jobId, activeTab]);

useEffect(() => {
  if (!jobId) return;
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchApplicants(), fetchCounts()]);
      await refreshDraftSelection();
      // ← remove the fetchEligibleDraftCount call entirely
    } catch (err) {
      console.error("Data loading failed:", err);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [jobId, activeTab]);

  const toggleSelectOne = async (applicationId) => {
    const isSelected = draftApplicants.includes(applicationId);
    try {
      if (isSelected) await removeDraftApplicants(jobId, [applicationId]);
      else await addDraftApplicants(jobId, [applicationId]);
      await refreshDraftSelection();
    } catch (err) { showToast("Failed to update selection", 5000); }
  };

  const toggleSelectAll = async () => {
    const allIds = applicants.map((a) => String(a._id));
    try {
      if (allIds.every((id) => draftApplicants.includes(id))) {
        await removeDraftApplicants(jobId, allIds);
      } else {
        await addDraftApplicants(jobId, allIds);
      }
      await refreshDraftSelection();
    } catch (err) { showToast("Failed to select all", 5000); }
  };

  const openInterviewModal = (app) => {
    setSelectedApp(app); setInterviewScore(app?.interviewScore ?? ""); setInterviewOpen(true);
  };

  const onSaveInterview = async () => {
    try {
      if (!selectedApp?._id) return;
      const score = Number(interviewScore);
      if (Number.isNaN(score) || score < 0 || score > 100) {
        showToast("Interview score must be between 0 and 100", 5000); return;
      }
      const token = localStorage.getItem("companyToken");
      const res = await fetch(
        `${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${selectedApp._id}/save-score`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ score }) }
      );
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Failed to save score"); }
      showToast("Interview score saved.", 5000);
      setInterviewOpen(false); setSelectedApp(null); setInterviewScore("");
      await fetchApplicants();
    } catch (err) { showToast(err.message || "Failed to save interview score", 5000); }
  };

  const openCodingModal = async (app) => {
    setSelectedApplicant(app); setCodingModalOpen(true); setLoadingSession(true); setSessionData(null);
    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(
        `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/applicant/${app._id}/coding-session`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to load coding details");
      setSessionData(await response.json());
    } catch (err) {
      showToast("Could not load coding details", 5000); setCodingModalOpen(false);
    } finally { setLoadingSession(false); }
  };

  // ─── Derived state for Applied tab ───────────────────────────────────────
  const uninvitedApplicants = useMemo(() => {
    if (activeTab !== "applied") return [];
    return applicants.filter(a => {
      const s = a.assessment?.status;
      if (!s) return true;
      if (s === "expired") return true;
      if (a.assessment?.expiresAt && new Date(a.assessment.expiresAt) < new Date()
          && !["submitted", "evaluated"].includes(s)) return true;
      return false;
    });
  }, [applicants, activeTab]);

  const invitedApplicants = useMemo(() =>
    applicants.filter(a => !uninvitedApplicants.some(u => u._id === a._id)),
    [applicants, uninvitedApplicants]
  );

    const eligibleDraftCount = useMemo(() =>
  draftApplicants.filter(id => uninvitedApplicants.some(a => String(a._id) === id)).length,
  [draftApplicants, uninvitedApplicants]
);


  // const eligibleDraftCount = useMemo(() =>
  //   draftApplicants.filter(id => uninvitedApplicants.some(a => String(a._id) === id)).length,
  //   [draftApplicants, uninvitedApplicants]
  // );

  const tableHead = useMemo(() => {
    if (activeTab === "applied") return ["", "Name", "Email", "Phone", "Test Status", "Applied", "ML Scores", "Resume", "GitHub", "Action"];
    if (activeTab === "assessment") return ["", "Name", "Email", "Phone", "Assessment", "Coding Score", "Applied", "Resume", "GitHub"];
    if (activeTab === "shortlisted") return ["", "Name", "Email", "Phone", "Test", "Interview Score", "Applied", "Resume", "GitHub", "Actions", "Coding", "Interview"];
    return [];
  }, [activeTab]);

  const allVisibleSelected = useMemo(() => {
    if (!["applied", "assessment", "shortlisted"].includes(activeTab)) return false;
    const ids = applicants.map((a) => String(a._id));
    return ids.length > 0 && ids.every((id) => draftApplicants.includes(id));
  }, [activeTab, applicants, draftApplicants]);

  const handleEvaluateAll = () => setShowEvalConfirm(true);

  const confirmEvaluate = async () => {
    setShowEvalConfirm(false); setEvaluating(true); setEvalMessage(null);
    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(
        `${BACKEND_URL}/api/company/jobs/challenges/job/${jobId}/evaluate-submissions`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Evaluation request failed");
      setEvalMessage({ type: "success", text: data.message || `Evaluated ${data.evaluatedSubmissions || 0} submissions` });
      await fetchApplicants(); await fetchCounts();
    } catch (err) {
      setEvalMessage({ type: "error", text: err.message || "Failed to start evaluation" });
    } finally { setEvaluating(false); }
  };

  const handleUpdateInterview = (newStatus, applicationId) => {
    setPendingInterviewStatus({ status: newStatus, applicationId });
    setShowInterviewStatusConfirm(true);
  };

  const confirmUpdateInterview = async () => {
    if (!pendingInterviewStatus) return;
    const { status, applicationId } = pendingInterviewStatus;
    setShowInterviewStatusConfirm(false); setPendingInterviewStatus(null);
    try {
      const token = localStorage.getItem("companyToken");
      const res = await fetch(
        `${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${applicationId}/interview-status`,
        { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) }
      );
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Failed to update"); }
      showToast(`Interview marked as ${status}`, 5000);
      await fetchApplicants();
    } catch (err) { showToast(err.message || "Could not update status", 5000); }
  };

  const handleMoveToFinal = () => {
    if (draftApplicants.length === 0) { showToast("No candidates selected", 5000); return; }
    setShowMoveToFinalConfirm(true);
  };

  const confirmMoveToFinal = async () => {
    setShowMoveToFinalConfirm(false); setShortlisting(true);
    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}/move-to-final`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicationIds: draftApplicants }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to move candidates");
      showToast(data.message || `Moved ${data.movedCount || draftCount} candidates to final stage!`, 5000);
      await fetchApplicants(); await fetchCounts(); await refreshDraftSelection();
    } catch (err) { showToast(err.message || "Failed to move to final stage", 5000); }
    finally { setShortlisting(false); }
  };

  const handleFinalDecision = (decision, applicationId) => {
    setPendingDecision({ decision, applicationId }); setShowFinalDecisionConfirm(true);
  };

  const confirmFinalDecision = async () => {
    if (!pendingDecision) return;
    const { decision, applicationId } = pendingDecision;
    setShowFinalDecisionConfirm(false); setPendingDecision(null);
    try {
      const token = localStorage.getItem("companyToken");
      const res = await fetch(
        `${BACKEND_URL}/api/company/jobs/${jobId}/applications/${applicationId}/final-decision`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ decision }) }
      );
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Failed to make decision"); }
      showToast(`Candidate marked as ${decision === "hired" ? "Hired" : "Rejected"}`, 5000);
      await fetchApplicants();
    } catch (err) { showToast(err.message || "Failed to update final decision", 5000); }
  };

  return (
    <CompanyDashboardLayout>
      <BackButton to={`/company/jobs/${jobId}`} className="mb-6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applicants Pipeline</h1>
          {job && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{job.title}</p>}
        </div>

        {/* ── Applied tab: info bar ─────────────────────────────────────────── */}
        {activeTab === "applied" && applicants.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
            {/* Status summary */}
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                <Clock size={13} className="text-gray-400" />
                {uninvitedApplicants.length} not sent
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-medium">
                <Mail size={13} />
                {invitedApplicants.length} invited
              </span>
            </div>

            {/* Selection info + shortcut */}
            <div className="flex items-center gap-3 text-sm">
              {uninvitedApplicants.length > 0 && (
                <button
                  onClick={async () => {
                    try {
                      await clearDraftApplicants(jobId);
                      await addDraftApplicants(jobId, uninvitedApplicants.map(a => String(a._id)));
                      await refreshDraftSelection();
                      showToast(`Selected ${uninvitedApplicants.length} uninvited candidate(s)`, 3000);
                    } catch (err) { showToast("Failed to select uninvited", 5000); }
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium underline underline-offset-2 transition"
                >
                  Select all uninvited ({uninvitedApplicants.length})
                </button>
              )}
              <span className="text-gray-600 dark:text-gray-300">
                Selected: <strong>{draftCount}</strong>
                {eligibleDraftCount !== draftCount && draftCount > 0 && (
                  <span className="ml-1.5 text-amber-500 font-medium">({eligibleDraftCount} eligible)</span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* ── Configure / View challenges button ───────────────────────────── */}
        {["applied", "assessment"].includes(activeTab) && (
          <div className="mb-6">
            {job?.selectedChallenges?.length > 0 ? (
              // <button
              //   onClick={() => setShowSentChallengesModal(true)}
              //   className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              // >
              //   <Code size={15} /> View Configured Challenges
              // </button>
              <div className="flex items-center gap-3">
    <button onClick={() => setShowSentChallengesModal(true)}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition">
      <Code size={15} /> View Challenges
    </button>
    <Link to={`/company/jobs/${jobId}/challenges`}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400 transition">
      <Code size={15} /> Reconfigure
    </Link>
  </div>
            ) : (
              <Link
                to={`/company/jobs/${jobId}/challenges`}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition
                  ${eligibleDraftCount === 0
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed pointer-events-none"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
              >
                <Code size={15} />
                Configure Coding Test & Send
                {eligibleDraftCount > 0 && <span className="ml-0.5 opacity-80">({eligibleDraftCount} eligible)</span>}
              </Link>
            )}
            {activeTab === "applied" && eligibleDraftCount === 0 && draftCount === 0 && (
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Select uninvited candidates above to enable this
              </p>
            )}
          </div>
        )}

        {/* ── Tabs + action buttons ─────────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            const count = counts[t.key] ?? 0;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition
                  ${isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-primary/5"}`}>
                {t.label} <span className={isActive ? "text-white/80" : "text-gray-400"}>({count})</span>
              </button>
            );
          })}

          {/* Assessment actions */}
          {activeTab === "assessment" && (
            <>
              <button onClick={handleEvaluateAll} disabled={evaluating || loading}
                className={`ml-1 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition
                  ${evaluating ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
                {evaluating ? <><Loader2 size={14} className="animate-spin" /> Evaluating…</> : "Evaluate Submitted Tests"}
              </button>
              <button onClick={handleShortlistSelected} disabled={shortlisting || draftCount === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition
                  ${shortlisting || draftCount === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}>
                {shortlisting ? <><Loader2 size={14} className="animate-spin" /> Shortlisting…</> : `Shortlist (${draftCount})`}
              </button>
            </>
          )}

          {/* Shortlisted actions */}
          {activeTab === "shortlisted" && (
            <button onClick={handleMoveToFinal} disabled={shortlisting || draftCount === 0}
              className={`ml-1 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition
                ${shortlisting || draftCount === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}>
              {shortlisting ? <><Loader2 size={14} className="animate-spin" /> Moving…</> : `Move to Final (${draftCount})`}
            </button>
          )}
        </div>

        {/* Eval result message */}
        {evalMessage && activeTab === "assessment" && (
          <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${evalMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {evalMessage.text}
          </div>
        )}

        {/* Rubric builder – shortlisted only */}
        {activeTab === "shortlisted" && (
          <div className="mb-5 flex items-center gap-3">
            <button onClick={() => setRubricOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition">
              Configure Interview Rubric
            </button>
            {job?.interviewRubric?.length > 0 && (
              <span className="text-xs text-gray-400">{job.interviewRubric.length} criteria defined</span>
            )}
          </div>
        )}

        {/* ── Table ──────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={18} className="animate-spin" /> Loading applicants…
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            No applicants found in this stage.
          </div>
        ) : activeTab === "final" ? (
          // ── Final tab ──────────────────────────────────────────────────────
          <div className="space-y-10">
            {[
              { key: "final_review", label: "Pending Final Decision", color: "amber" },
              { key: "hired",        label: "Hired",                  color: "green" },
              { key: "rejected",     label: "Not Selected",           color: "red" },
            ].map(({ key, label, color }) => {
              const group = applicants.filter(a => a.status === key);
              return (
                <section key={key}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className={`text-lg font-semibold text-${color}-700 dark:text-${color}-400`}>{label}</h3>
                    <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-400`}>
                      {group.length}
                    </span>
                  </div>
                  {group.length === 0 ? (
                    <div className={`p-8 text-center rounded-xl border border-${color}-200 dark:border-${color}-800 bg-${color}-50/40 dark:bg-${color}-950/20 text-${color}-600 dark:text-${color}-400 text-sm`}>
                      None yet.
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/60">
                          <tr>
                            {["Name","Email","Test Score","Interview Score", ...(key === "final_review" ? ["Actions"] : [])].map(h => (
                              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {group.map(app => (
                            <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                              <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{app.developerSnapshot?.name || "—"}</td>
                              <td className="px-6 py-3 text-gray-500">{app.developerSnapshot?.email || "—"}</td>
                              <td className="px-6 py-3"><ScorePill label="Test" value={app.codingChallengeScore ?? "—"} strong /></td>
                              <td className="px-6 py-3">{app.interviewScore != null ? <ScorePill label="Int." value={app.interviewScore} /> : "—"}</td>
                              {key === "final_review" && (
                                <td className="px-6 py-3">
                                  <div className="flex gap-2">
                                    <button onClick={() => handleFinalDecision("hired", app._id)}
                                      className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition">Hire</button>
                                    <button onClick={() => handleFinalDecision("rejected", app._id)}
                                      className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition">Reject</button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          // ── Normal table (applied / assessment / shortlisted) ───────────────
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/70">
                  <tr>
                    {tableHead.map((h, idx) => (
                      <th key={h || idx} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {idx === 0 && ["applied","assessment","shortlisted"].includes(activeTab) ? (
                          <button onClick={toggleSelectAll} title={allVisibleSelected ? "Deselect all" : "Select all"}
                            className="text-gray-500 hover:text-primary transition">
                            {allVisibleSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                        ) : h}
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
                    const appId = String(app._id);
                    const isChecked = draftApplicants.includes(appId);

                    // For applied tab: is this applicant already invited (not expired)?
                    const alreadyInvited = activeTab === "applied" && app.assessment?.status &&
                      !["expired"].includes(app.assessment.status) &&
                      !(app.assessment?.expiresAt && new Date(app.assessment.expiresAt) < new Date()
                        && !["submitted","evaluated"].includes(app.assessment.status));

                    return (
                      <tr key={app._id}
                        className={`transition-colors duration-100 hover:bg-gray-50 dark:hover:bg-gray-700/30
                          ${alreadyInvited ? "bg-blue-50/30 dark:bg-blue-900/5" : ""}`}>

                        {/* Checkbox */}
                        {["applied","assessment","shortlisted"].includes(activeTab) && (
                          <td className="px-5 py-3.5">
                            <button onClick={() => toggleSelectOne(appId)}
                              className="text-gray-400 hover:text-primary transition">
                              {isChecked ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                            </button>
                          </td>
                        )}

                        {/* Common: Name / Email / Phone */}
                        <td className="px-5 py-3.5 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100 text-sm">{dev.name || "—"}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{dev.email || "—"}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{dev.phone || "—"}</td>

                        {/* ── Applied tab columns ── */}
                        {activeTab === "applied" && (
                          <>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <TestStatusBadge assessment={app.assessment} />
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">{appliedDate}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {ml ? (
                                <div className="flex flex-wrap gap-1.5">
                                  <ScorePill label="Match" value={ml.match} />
                                  <ScorePill label="Exp" value={ml.experience} />
                                  <ScorePill label="Cred" value={ml.credibility} />
                                  <ScorePill label="Rank" value={ml.screening} strong />
                                </div>
                              ) : <span className="text-gray-400 text-sm">—</span>}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {dev.resumeUrl ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleViewResume(dev._id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition">
                                    <Eye size={12} /> View
                                  </button>
                                  <button onClick={() => handleDownloadResume(dev._id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition">
                                    <Download size={12} /> DL
                                  </button>
                                </div>
                              ) : "—"}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {dev.githubProfile?.html_url ? (
                                <a href={dev.githubProfile.html_url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition">
                                  <Github size={14} /> GitHub
                                </a>
                              ) : "—"}
                            </td>
                            {/* Action column */}
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {alreadyInvited ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-500 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                                  <Mail size={11} /> Sent
                                </span>
                              ) : !job?.selectedChallenges?.length ? (
                                <span className="text-xs text-gray-400">Configure test first</span>
                              ) : (
                                <button onClick={() => openSendTestModal(app)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm">
                                  <Send size={11} /> Send Test
                                </button>
                              )}
                            </td>
                          </>
                        )}

                        {/* ── Assessment tab columns ── */}
                        {activeTab === "assessment" && (
                          <>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                                  <ClipboardCheck size={13} className="text-primary" />
                                  {assessment?.status ? titleCase(assessment.status) : "Invited"}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Exp: {assessment?.expiresAt ? new Date(assessment.expiresAt).toLocaleDateString() : "—"}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {app.codingChallengeScore != null ? (
                                <button onClick={() => openCodingModal(app)}>
                                  <ScorePill label="Score" value={app.codingChallengeScore} strong />
                                </button>
                              ) : <span className="text-xs text-gray-400">Not evaluated</span>}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">{appliedDate}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {dev.resumeUrl ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleViewResume(dev._id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition">
                                    <Eye size={12} /> View
                                  </button>
                                  <button onClick={() => handleDownloadResume(dev._id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition">
                                    <Download size={12} /> DL
                                  </button>
                                </div>
                              ) : "—"}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {dev.githubProfile?.html_url ? (
                                <a href={dev.githubProfile.html_url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition">
                                  <Github size={14} /> GitHub
                                </a>
                              ) : "—"}
                            </td>
                          </>
                        )}

                        {/* ── Shortlisted tab columns ── */}
                        {activeTab === "shortlisted" && (
                          <>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <ScorePill label="Test" value={app.codingChallengeScore ?? 0} strong />
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {app.interviewScore != null
                                ? <ScorePill label="Int." value={app.interviewScore} />
                                : <span className="text-xs text-gray-400">—</span>}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">{appliedDate}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {dev.resumeUrl ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleViewResume(dev._id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition">
                                    <Eye size={12} /> View
                                  </button>
                                  <button onClick={() => handleDownloadResume(dev._id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200 transition">
                                    <Download size={12} /> DL
                                  </button>
                                </div>
                              ) : "—"}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {dev.githubProfile?.html_url ? (
                                <a href={dev.githubProfile.html_url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition">
                                  <Github size={14} /> GitHub
                                </a>
                              ) : "—"}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <button
                                onClick={() => { setScorecardApp(app); setScorecardOpen(true); }}
                                disabled={app.interview?.status !== "completed"}
                                title={app.interview?.status !== "completed" ? "Mark interview as Completed first" : "Fill scorecard"}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition
                                  ${app.interview?.status === "completed"
                                    ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30"
                                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"}`}>
                                <Star size={12} />
                                {app.interviewScore != null ? "Update Score" : "Score"}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {app.codingChallengeScore != null && (
                                <button onClick={() => openCodingModal(app)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
                                  <Code size={12} /> Details
                                </button>
                              )}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {app.interview?.status === "scheduled" ? (
                                <div className="flex flex-col gap-1.5 text-xs">
                                  <span className="font-medium text-blue-600">
                                    {new Date(app.interview.scheduledAt).toLocaleString("en-PK", { dateStyle: "short", timeStyle: "short" })}
                                  </span>
                                  <a href={app.interview.videoLink} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline">Join Room</a>
                                  <div className="flex gap-1 mt-0.5">
                                    <button onClick={() => handleUpdateInterview("completed", app._id)}
                                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">Done</button>
                                    <button onClick={() => handleUpdateInterview("no_show", app._id)}
                                      className="px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition">No-show</button>
                                    <button onClick={() => handleUpdateInterview("cancelled", app._id)}
                                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Cancel</button>
                                  </div>
                                </div>
                              ) : app.interview?.status === "completed" ? (
                                <span className="text-xs font-medium text-green-600">Completed</span>
                              ) : (
                                <button
                                  onClick={() => { setSelectedAppForInterview(app); setScheduleOpen(true); setScheduledAt(""); setInterviewNotes(""); }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">
                                  Schedule
                                </button>
                              )}
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
      </div>

      {/* ── Unified Send Test Modal ─────────────────────────────────────────── */}
      <SendTestModal
        open={sendTestModalOpen}
        target={sendTestTarget}
        onClose={() => { setSendTestModalOpen(false); setSendTestTarget(null); }}
        onConfirm={confirmSendTestToOne}
        loading={sendingTest}
      />

      {/* ── Confirm modals ──────────────────────────────────────────────────── */}
      <ConfirmModal open={showEvalConfirm} title="Evaluate All Submitted Tests?"
        message="This will run AI evaluation on every submitted test for this job. Continue?"
        confirmLabel="Yes, Evaluate" cancelLabel="Cancel"
        onConfirm={confirmEvaluate} onCancel={() => setShowEvalConfirm(false)} />

      <ConfirmModal open={showShortlistConfirm} title="Shortlist Selected Candidates?"
        message={`Move ${draftCount} candidate(s) to "Shortlisted"?`}
        confirmLabel="Yes, Shortlist" cancelLabel="Cancel"
        onConfirm={confirmShortlist} onCancel={() => setShowShortlistConfirm(false)} />

      <ConfirmModal open={showMoveToFinalConfirm} title="Move to Final Decisions?"
        message={`Move ${draftCount} candidate(s) to the "Final Decisions" stage?`}
        confirmLabel="Yes, Move" cancelLabel="Cancel"
        onConfirm={confirmMoveToFinal} onCancel={() => setShowMoveToFinalConfirm(false)} />

      <ConfirmModal open={showFinalDecisionConfirm}
        title={`Confirm ${pendingDecision?.decision === "hired" ? "Hiring" : "Rejecting"}?`}
        message={`Are you sure you want to ${pendingDecision?.decision === "hired" ? "hire" : "reject"} this candidate? This cannot be undone.`}
        confirmLabel={pendingDecision?.decision === "hired" ? "Yes, Hire" : "Yes, Reject"} cancelLabel="Cancel"
        onConfirm={confirmFinalDecision} onCancel={() => { setShowFinalDecisionConfirm(false); setPendingDecision(null); }} />

      <ConfirmModal open={showInterviewStatusConfirm}
        title={`Mark as "${pendingInterviewStatus?.status}"?`}
        message={`Mark this interview as "${pendingInterviewStatus?.status}"?`}
        confirmLabel="Yes, Update" cancelLabel="Cancel"
        onConfirm={confirmUpdateInterview} onCancel={() => { setShowInterviewStatusConfirm(false); setPendingInterviewStatus(null); }} />

      {/* ── Interview Score Modal ──────────────────────────────────────────── */}
      {interviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Interview Score</h2>
                <p className="text-sm text-gray-500">{selectedApp?.developerSnapshot?.name}</p>
              </div>
              <button onClick={() => { setInterviewOpen(false); setSelectedApp(null); setInterviewScore(""); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Score (0–100)</label>
                <input type="number" min="0" max="100" value={interviewScore} onChange={e => setInterviewScore(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
                <p className="mt-1.5 text-xs text-gray-400">Ensure interview is marked Completed before scoring.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setInterviewOpen(false); setSelectedApp(null); setInterviewScore(""); }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={onSaveInterview}
                  className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                  Save Score
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Interview Modal ───────────────────────────────────────── */}
      {scheduleOpen && selectedAppForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Schedule Interview</h2>
                <p className="text-sm text-gray-500">For {selectedAppForInterview.developerSnapshot?.name}</p>
              </div>
              <button onClick={() => setScheduleOpen(false)} disabled={scheduling}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date & Time</label>
                <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} disabled={scheduling}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)} rows={3} disabled={scheduling}
                  placeholder="e.g., Focus on React skills"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setScheduleOpen(false)} disabled={scheduling}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition">
                  Cancel
                </button>
                <button disabled={scheduling}
                  onClick={async () => {
                    if (!scheduledAt) { showToast("Please select a date and time", 5000); return; }
                    setScheduling(true);
                    try {
                      const token = localStorage.getItem("companyToken");
                      const response = await fetch(
                        `${BACKEND_URL}/api/interview/jobs/${jobId}/applications/${selectedAppForInterview._id}/schedule-interview`,
                        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ scheduledAt, notes: interviewNotes }) }
                      );
                      const data = await response.json();
                      if (!response.ok) throw new Error(data.message || "Failed to schedule");
                      showToast("Interview scheduled and notified!", 5000);
                      setScheduleOpen(false); setScheduledAt(""); setInterviewNotes("");
                      fetchApplicants();
                    } catch (err) { showToast(err.message || "Failed to schedule", 5000); }
                    finally { setScheduling(false); }
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition
                    ${scheduling ? "bg-blue-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}`}>
                  {scheduling ? <><Loader2 size={14} className="animate-spin" /> Scheduling…</> : "Schedule & Notify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View Sent Challenges Modal ─────────────────────────────────────── */}
      {job && showSentChallengesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configured Challenges ({job.selectedChallenges.length})
              </h2>
              <button onClick={() => setShowSentChallengesModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {job.selectedChallenges.map((sel, index) => {
                const ch = sel.challengeId || {};
                return (
                  <div key={sel._id || index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-b flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {index + 1}. {ch.title || `Challenge ${index + 1}`}
                      </h3>
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                          {sel.timeLimit || ch.timeLimit || 30} min
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          {ch.difficulty || "—"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                        {ch.problemStatement || "No problem statement available."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={() => setShowSentChallengesModal(false)}
                className="px-5 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Coding Details Modal ───────────────────────────────────────────── */}
      {codingModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-6xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Coding Assessment Results</h2>
                <p className="text-sm text-gray-500">{selectedApplicant.developerSnapshot?.name}</p>
              </div>
              <button onClick={() => setCodingModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {loadingSession ? (
                <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                  <Loader2 size={18} className="animate-spin" /> Loading coding details…
                </div>
              ) : sessionData ? (
                <>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Score</p>
                      <p className="text-4xl font-bold text-indigo-600">
                        {sessionData.application.codingChallengeScore?.toFixed(2) || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-sm font-medium capitalize">{sessionData.session.status}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {sessionData.session.submissions.map((sub, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 flex justify-between items-center">
                          <span className="font-medium text-sm">Challenge {index + 1}: {sub.title}</span>
                          {sub.score !== null && (
                            <span className="text-indigo-600 font-bold text-sm">Score: {sub.score.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-sm font-medium mb-2">Problem Statement</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{sub.problemStatement || "No description"}</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-2">Submitted Code ({sub.language})</h5>
                              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto max-h-72 text-xs font-mono">{sub.code || "// No code submitted"}</pre>
                            </div>
                          </div>
                          {sub.evaluation && (
                            <div className="border rounded-xl p-5">
                              <div className="grid grid-cols-3 gap-4 mb-5 text-center">
                                {[["Correctness", sub.evaluation.correctness], ["Performance", sub.evaluation.performance], ["Code Quality", sub.evaluation.codeQuality]].map(([label, val]) => (
                                  <div key={label}>
                                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                                    <p className="text-2xl font-bold">{(val * 100).toFixed(0)}%</p>
                                  </div>
                                ))}
                              </div>
                              {sub.evaluation.aiReview && (
                                <div className="space-y-3">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{sub.evaluation.aiReview.feedback}</p>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <h6 className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Strengths</h6>
                                      <ul className="space-y-1">{sub.evaluation.aiReview.strengths?.map((s, i) => <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex gap-1.5"><span className="text-green-500 mt-0.5">•</span>{s}</li>)}</ul>
                                    </div>
                                    <div>
                                      <h6 className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wide">Suggestions</h6>
                                      <ul className="space-y-1">{sub.evaluation.aiReview.improvements?.map((s, i) => <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex gap-1.5"><span className="text-amber-500 mt-0.5">•</span>{s}</li>)}</ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : <div className="text-center py-20 text-gray-400 text-sm">No data available</div>}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={() => setCodingModalOpen(false)}
                className="px-6 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rubric + Scorecard ─────────────────────────────────────────────── */}
      {rubricOpen && (
        <RubricBuilderModal jobId={jobId} onClose={() => setRubricOpen(false)}
          onSaved={(rubric) => setJob(prev => prev ? { ...prev, interviewRubric: rubric } : prev)} />
      )}
      {scorecardOpen && scorecardApp && (
        <ScorecardModal jobId={jobId} application={scorecardApp}
          onClose={() => { setScorecardOpen(false); setScorecardApp(null); }}
          onSaved={(newScore) => setApplicants(prev =>
            prev.map(a => a._id === scorecardApp._id ? { ...a, interviewScore: newScore } : a))} />
      )}
    </CompanyDashboardLayout>
  );
}

// ─── Score Pill ───────────────────────────────────────────────────────────────
function ScorePill({ label, value, strong = false }) {
  const v = Number(value ?? 0);
  let colorClass = "bg-gray-100 text-gray-600 border-gray-200";
  if (Number.isFinite(v)) {
    if (v >= 0.80) colorClass = "bg-green-100 text-green-700 border-green-200";
    else if (v >= 0.60) colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
    else colorClass = "bg-red-100 text-red-700 border-red-200";
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border
      ${strong ? "bg-primary/10 text-primary border-primary/20" : colorClass}`}
      title={`${label}: ${Number.isFinite(v) ? v.toFixed(2) : "—"}`}>
      <span className="opacity-70">{label}</span>
      <span className="font-bold tabular-nums">{Number.isFinite(v) ? v.toFixed(2) : "—"}</span>
    </span>
  );
}

function titleCase(s) {
  return String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1).replaceAll("_", " ");
}