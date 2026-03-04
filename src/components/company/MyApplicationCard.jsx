// // src/components/company/MyApplicationCard.jsx
// import {
//   MapPin,
//   BriefcaseBusiness,
//   Building2,
//   ChevronRight,
//   Code,
//   CalendarCheck,
//   Video,
//   CheckCircle2,
//   Clock,
// } from "lucide-react";
// import ApplicationStatusBadge from "./ApplicationStatusBadge";
// import { useNavigate } from "react-router-dom";
// import { showToast } from "../../utils/toast";
// import { BACKEND_URL } from "../../../config";
// import ConfirmModal from "../ConfirmModal";
// import { useState } from "react";

// export default function MyApplicationCard({ application, onViewJob, onRefresh }) {
//   const navigate = useNavigate();
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   // Defensive destructuring
//   const app = application || {};
//   const job = app.job || {};
//   const status = app.status || "unknown";
//   const appliedAt = app.appliedAt;
//   const assessment = app.assessment || {};
//   const interview = app.interview || {};
//   const testSessionStatus = app.testSessionStatus || {};

//   const appliedDate = appliedAt
//     ? new Date(appliedAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "N/A";

//   const interviewDateTime = interview?.scheduledAt
//     ? new Date(interview.scheduledAt).toLocaleString("en-PK", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       })
//     : null;

//   // ─── Test availability logic ────────────────────────────────────────
//   const now = new Date();

//   const isInvited = status === "assessment" && assessment.status === "invited";

//   const expiresAt = assessment.expiresAt ? new Date(assessment.expiresAt) : null;
//   const availableFrom = assessment.availableFrom ? new Date(assessment.availableFrom) : null;
//   const availableUntil = assessment.availableUntil ? new Date(assessment.availableUntil) : expiresAt;

//   const isExpired = expiresAt && now > expiresAt;
//   const isNotYetAvailable = availableFrom && now < availableFrom;
//   const isCurrentlyAvailable = isInvited && !isExpired && !isNotYetAvailable;

//   const hasSession = testSessionStatus.hasSession === true;
//   const sessionStatus = testSessionStatus.status || null;

//   // Format dates with time (Pakistan-friendly)
//   const formatDateTime = (date) => {
//     if (!date) return "N/A";
//     return date.toLocaleString("en-PK", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const availableFromStr = availableFrom ? formatDateTime(availableFrom) : "Immediately after invite";
//   const availableUntilStr = availableUntil ? formatDateTime(availableUntil) : "No expiry set";

//   // ─── Decide what to show for test action ─────────────────────────────
//   let testActionElement = null;

//   if (isInvited) {
//     if (isExpired) {
//       testActionElement = (
//         <div className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-100 text-red-800 font-semibold rounded-lg text-sm shadow-md cursor-not-allowed">
//           <Code className="h-4 w-4" />
//           Test Expired
//         </div>
//       );
//     } else if (isNotYetAvailable) {
//       testActionElement = (
//         <div className="inline-flex flex-col items-start gap-1 px-5 py-2.5 bg-amber-50 text-amber-800 font-medium rounded-lg text-sm shadow-md border border-amber-200 w-full sm:w-auto">
//           <div className="flex items-center gap-1.5">
//             <Clock className="h-4 w-4" />
//             <span>Test not yet available</span>
//           </div>
//           <div className="text-xs opacity-90 mt-0.5">
//             Starts on: {availableFromStr}
//           </div>
//         </div>
//       );
//     } else if (isCurrentlyAvailable) {
//       if (hasSession && (sessionStatus === "submitted" || sessionStatus === "auto-submitted")) {
//         testActionElement = (
//           <div className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-500 text-white font-semibold rounded-lg text-sm shadow-md cursor-not-allowed opacity-90">
//             <Code className="h-4 w-4" />
//             Test Already Submitted
//           </div>
//         );
//       } else if (hasSession && sessionStatus === "in-progress") {
//         testActionElement = (
//           <button
//             onClick={() => job._id && navigate(`/dashboard/coding-test/${job._id}`)}
//             className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors text-sm shadow-md"
//           >
//             <Code className="h-4 w-4" />
//             Continue Coding Test
//           </button>
//         );
//       } else {
//         testActionElement = (
//           <button
//             onClick={() => job._id && navigate(`/dashboard/coding-test/${job._id}`)}
//             className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
//           >
//             <Code className="h-4 w-4" />
//             Start Coding Test
//           </button>
//         );
//       }
//     }
//   }

//   // ─── Interview confirmation handler ─────────────────────────────────
//   const handleOpenConfirm = () => {
//     setShowConfirmModal(true);
//   };

//   const handleConfirmInterview = async () => {
//     setShowConfirmModal(false);

//     try {
//       const token = localStorage.getItem("devsta_token");
//       if (!token) {
//         showToast("Please login again", "error");
//         return;
//       }

//       const res = await fetch(
//         `${BACKEND_URL}/api/interview/jobs/${job._id}/applications/${app._id}/confirm-interview`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.msg || err.message || "Failed to confirm interview");
//       }

//       showToast("Interview confirmed successfully!", "success");

//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (err) {
//       console.error("Confirmation error:", err);
//       showToast(err.message || "Could not confirm interview", "error");
//     }
//   };

//   return (
//     <>
//       <div
//         className="
//           group relative rounded-2xl border border-gray-200/70 bg-white p-5
//           transition-all duration-200 hover:border-gray-300 hover:shadow-lg
//           flex flex-col justify-between 
//         "
//       >
//         <div className="mb-4 flex items-center justify-between">
//           <ApplicationStatusBadge status={status} />
//           <time className="text-xs font-medium text-gray-500">
//             Applied on {appliedDate}
//           </time>
//         </div>

//         <div className="space-y-2.5 flex-grow">
//           <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
//             {job.title || "Job (data incomplete)"}
//           </h3>

//           <div className="flex items-center gap-1.5 text-sm text-gray-600">
//             <Building2 className="h-4 w-4 text-gray-500" />
//             <span className="line-clamp-1 font-medium">
//               {job.company?.companyName || "Company"}
//             </span>
//           </div>

//           <div className="flex flex-wrap gap-2.5 pt-1">
//             <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
//               <MapPin className="h-3.5 w-3.5 text-gray-500" />
//               {job.location || job.jobMode || "Remote"}
//             </div>
//             <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
//               <BriefcaseBusiness className="h-3.5 w-3.5 text-gray-500" />
//               {job.employmentType || "Full-time"}
//             </div>
//           </div>

//           {/* Assessment Window Display */}
//           {isInvited && (
//             <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm">
//               <div className="font-medium text-indigo-800 mb-1.5 flex items-center gap-1.5">
//                 <Code className="h-4 w-4" />
//                 Assessment Period
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-xs">
//                 <div>
//                   <span className="font-semibold">From:</span><br />
//                   {availableFromStr}
//                 </div>
//                 <div>
//                   <span className="font-semibold">Until:</span><br />
//                   {availableUntilStr}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Interview scheduled info */}
//           {interview?.status === "scheduled" && interviewDateTime && (
//             <div className="mt-3 flex items-center gap-2 text-sm text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-lg">
//               <Clock size={16} />
//               <span>Interview: {interviewDateTime}</span>
//             </div>
//           )}
//         </div>

//         <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
//           <button
//             onClick={() => job._id && onViewJob(job._id)}
//             disabled={!job._id}
//             className={`
//               px-4 py-2 text-white font-semibold rounded-lg text-sm transition-colors
//               ${job._id ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-400 cursor-not-allowed opacity-70"}
//             `}
//           >
//             View Details
//             <ChevronRight className="h-4 w-4 inline ml-1" />
//           </button>

//           {testActionElement}

//           {/* Interview Actions */}
//           {interview?.status === "scheduled" && (
//             <>
//               {!interview.confirmedByDeveloper ? (
//                 <button
//                   onClick={handleOpenConfirm}
//                   className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm shadow-md"
//                 >
//                   <CalendarCheck className="h-4 w-4" />
//                   Confirm Interview
//                 </button>
//               ) : (
//                 <div className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-100 text-green-800 font-semibold rounded-lg text-sm shadow-md cursor-default">
//                   <CheckCircle2 className="h-4 w-4" />
//                   Confirmed
//                 </div>
//               )}

//               {interview.confirmedByDeveloper && (
//                 <a
//                   href={interview.videoLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
//                 >
//                   <Video className="h-4 w-4" />
//                   Join Interview
//                 </a>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <ConfirmModal
//         open={showConfirmModal}
//         title="Confirm Interview?"
//         message={`Are you sure you want to confirm the interview for "${job.title}" scheduled on ${interviewDateTime || "the given time"}?`}
//         confirmLabel="Yes, Confirm"
//         cancelLabel="Cancel"
//         onConfirm={handleConfirmInterview}
//         onCancel={() => setShowConfirmModal(false)}
//       />
//     </>
//   );
// }

// src/components/company/MyApplicationCard.jsx
import {
  MapPin,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Code,
  CalendarCheck,
  Video,
  CheckCircle2,
  Clock,
} from "lucide-react";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { BACKEND_URL } from "../../../config";
import ConfirmModal from "../ConfirmModal";
import { useState, useEffect } from "react";

export default function MyApplicationCard({ application, onViewJob, onRefresh }) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [now, setNow] = useState(new Date()); // live time for checks

  // Refresh 'now' every 30 seconds to update UI when interview time arrives
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Defensive destructuring
  const app = application || {};
  const job = app.job || {};
  const status = app.status || "unknown";
  const appliedAt = app.appliedAt;
  const assessment = app.assessment || {};
  const interview = app.interview || {};
  const testSessionStatus = app.testSessionStatus || {};

  const appliedDate = appliedAt
    ? new Date(appliedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const interviewDateTime = interview?.scheduledAt
    ? new Date(interview.scheduledAt).toLocaleString("en-PK", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  // ─── Test availability logic ────────────────────────────────────────
  const isInvited = status === "assessment" && assessment.status === "invited";

  const expiresAt = assessment.expiresAt ? new Date(assessment.expiresAt) : null;
  const availableFrom = assessment.availableFrom ? new Date(assessment.availableFrom) : null;
  const availableUntil = assessment.availableUntil ? new Date(assessment.availableUntil) : expiresAt;

  const isExpired = expiresAt && now > expiresAt;
  const isNotYetAvailable = availableFrom && now < availableFrom;
  const isCurrentlyAvailable = isInvited && !isExpired && !isNotYetAvailable;

  const hasSession = testSessionStatus.hasSession === true;
  const sessionStatus = testSessionStatus.status || null;

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return date.toLocaleString("en-PK", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const availableFromStr = availableFrom ? formatDateTime(availableFrom) : "Immediately after invite";
  const availableUntilStr = availableUntil ? formatDateTime(availableUntil) : "No expiry set";

  // ─── Test action element ─────────────────────────────────────────────
  let testActionElement = null;

  if (isInvited) {
    if (isExpired) {
      testActionElement = (
        <div className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-100 text-red-800 font-semibold rounded-lg text-sm shadow-md cursor-not-allowed">
          <Code className="h-4 w-4" />
          Test Expired
        </div>
      );
    } else if (isNotYetAvailable) {
      testActionElement = (
        <div className="inline-flex flex-col items-start gap-1 px-5 py-2.5 bg-amber-50 text-amber-800 font-medium rounded-lg text-sm shadow-md border border-amber-200 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Test not yet available</span>
          </div>
          <div className="text-xs opacity-90 mt-0.5">
            Starts on: {availableFromStr}
          </div>
        </div>
      );
    } else if (isCurrentlyAvailable) {
      if (hasSession && (sessionStatus === "submitted" || sessionStatus === "auto-submitted")) {
        testActionElement = (
          <div className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-500 text-white font-semibold rounded-lg text-sm shadow-md cursor-not-allowed opacity-90">
            <Code className="h-4 w-4" />
            Test Already Submitted
          </div>
        );
      } else if (hasSession && sessionStatus === "in-progress") {
        testActionElement = (
          <button
            onClick={() => job._id && navigate(`/dashboard/coding-test/${job._id}`)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors text-sm shadow-md"
          >
            <Code className="h-4 w-4" />
            Continue Coding Test
          </button>
        );
      } else {
        testActionElement = (
          <button
            onClick={() => job._id && navigate(`/dashboard/coding-test/${job._id}`)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
          >
            <Code className="h-4 w-4" />
            Start Coding Test
          </button>
        );
      }
    }
  }

  // ─── Interview join logic ────────────────────────────────────────────
  const interviewScheduledAt = interview?.scheduledAt ? new Date(interview.scheduledAt) : null;
  const isInterviewConfirmed = interview?.confirmedByDeveloper === true;
  const hasVideoLink = !!interview?.videoLink;

  // Allow joining 5 minutes early
  const bufferMs = 5 * 60 * 1000;
  const interviewStartWithBuffer = interviewScheduledAt
    ? new Date(interviewScheduledAt.getTime() - bufferMs)
    : null;

  const canJoinInterview =
    isInterviewConfirmed &&
    hasVideoLink &&
    interviewStartWithBuffer &&
    now >= interviewStartWithBuffer;

  let interviewActionElement = null;

  if (interview?.status === "scheduled") {
    if (!isInterviewConfirmed) {
      interviewActionElement = (
        <button
          onClick={() => setShowConfirmModal(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm shadow-md"
        >
          <CalendarCheck className="h-4 w-4" />
          Confirm Interview
        </button>
      );
    } else if (canJoinInterview) {
      interviewActionElement = (
        <a
          href={interview.videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
        >
          <Video className="h-4 w-4" />
          Join Interview
        </a>
      );
    } else {
      interviewActionElement = (
        <div className="inline-flex flex-col items-start gap-1 px-5 py-2.5 bg-blue-50 text-blue-800 font-medium rounded-lg text-sm shadow-md border border-blue-200 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Interview not started yet</span>
          </div>
          <div className="text-xs opacity-90 mt-0.5">
            Starts: {interviewDateTime} (join 5 min early)
          </div>
        </div>
      );
    }
  }

  // ─── Confirmation handler ────────────────────────────────────────────
  const handleOpenConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmInterview = async () => {
    setShowConfirmModal(false);

    try {
      const token = localStorage.getItem("devsta_token");
      if (!token) {
        showToast("Please login again", "error");
        return;
      }

      const res = await fetch(
        `${BACKEND_URL}/api/interview/jobs/${job._id}/applications/${app._id}/confirm-interview`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || err.message || "Failed to confirm interview");
      }

      showToast("Interview confirmed successfully!", "success");

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Confirmation error:", err);
      showToast(err.message || "Could not confirm interview", "error");
    }
  };

  return (
    <>
      <div
        className="
          group relative rounded-2xl border border-gray-200/70 bg-white p-5
          transition-all duration-200 hover:border-gray-300 hover:shadow-lg
          flex flex-col justify-between
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <ApplicationStatusBadge status={status} />
          <time className="text-xs font-medium text-gray-500">
            Applied on {appliedDate}
          </time>
        </div>

        <div className="space-y-2.5 flex-grow">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {job.title || "Job (data incomplete)"}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="line-clamp-1 font-medium">
              {job.company?.companyName || "Company"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              {job.location || job.jobMode || "Remote"}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-gray-500" />
              {job.employmentType || "Full-time"}
            </div>
          </div>

          {/* Assessment Window Display */}
          {isInvited && (
            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm">
              <div className="font-medium text-indigo-800 mb-1.5 flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                Assessment Period
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-xs">
                <div>
                  <span className="font-semibold">From:</span><br />
                  {availableFromStr}
                </div>
                <div>
                  <span className="font-semibold">Until:</span><br />
                  {availableUntilStr}
                </div>
              </div>
            </div>
          )}

          {/* Interview scheduled info */}
          {interview?.status === "scheduled" && interviewDateTime && (
            <div className="mt-3 flex items-center gap-2 text-sm text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-lg">
              <Clock size={16} />
              <span>Interview: {interviewDateTime}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={() => job._id && onViewJob(job._id)}
            disabled={!job._id}
            className={`
              px-4 py-2 text-white font-semibold rounded-lg text-sm transition-colors
              ${job._id ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-400 cursor-not-allowed opacity-70"}
            `}
          >
            View Details
            <ChevronRight className="h-4 w-4 inline ml-1" />
          </button>

          {testActionElement}

          {/* Interview Actions */}
          {interview?.status === "scheduled" && (
            <>
              {!interview.confirmedByDeveloper ? (
                <button
                  onClick={handleOpenConfirm}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm shadow-md"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Confirm Interview
                </button>
              ) : (
                <>
                  {canJoinInterview ? (
                    <a
                      href={interview.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
                    >
                      <Video className="h-4 w-4" />
                      Join Interview
                    </a>
                  ) : (
                    <div className="inline-flex flex-col items-start gap-1 px-5 py-2.5 bg-blue-50 text-blue-800 font-medium rounded-lg text-sm shadow-md border border-blue-200 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>Interview not started yet</span>
                      </div>
                      <div className="text-xs opacity-90 mt-0.5">
                        Starts: {interviewDateTime} (join 5 min early)
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Confirm Interview?"
        message={`Are you sure you want to confirm the interview for "${job.title}" scheduled on ${interviewDateTime || "the given time"}?`}
        confirmLabel="Yes, Confirm"
        cancelLabel="Cancel"
        onConfirm={handleConfirmInterview}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
}