// src/components/company/JobDetailsModal.jsx
import React, { useEffect, useState } from "react";
import {
  MdClose,
  MdLocationOn,
  MdWork,
  MdPeople,
  MdAttachMoney,
  MdCheckCircle,
  MdBusiness,
  MdAccessTime,
} from "react-icons/md";
import { getJobById } from "../../api/company/publicJobs";
import ApplyJobModal from "./ApplyJobModal";
import { showToast } from "../../utils/toast";
// 🔴 NEW: Import useAuth to get token
import { useAuth } from "../../context/AuthContext";

export default function JobDetailsModal({
  jobId,
  onClose,
  onViewCompany,
  context = "browse",
}) {
  // 🔴 NEW: Get authToken from context (assuming it's exposed in AuthContext)
  const { token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);


  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    setError(null);

    // 🔴 MODIFIED: Pass token to getJobById for hasApplied flag
    getJobById(jobId, token)
      .then((data) => setJob(data))
      .catch((err) => setError(err.message || "Failed to load job details"))
      .finally(() => setLoading(false));
  }, [jobId, token]); // 🔴 Added token to deps

  const timeAgo = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "—";

    const now = new Date();
    const diffMs = now - parsed;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const formatSalary = () => {
    if (!job?.salary?.min || !job?.salary?.max) return "Not specified";

    const { currency, min, max, period } = job.salary;
    const range = `${min.toLocaleString()} – ${max.toLocaleString()}`;

    if (period === "hour") return `${currency} ${range}/hr`;
    if (period === "month") return `${currency} ${range}/mo`;
    if (period === "project") return `${currency} ${range} (project)`;
    return `${currency} ${range}/yr`;
  };

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="
          bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl 
          shadow-2xl overflow-hidden border border-gray-200
          flex flex-col
        "
      >
        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <MdClose className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading job details...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : job ? (
            <div className="p-6 space-y-6">
              {/* Top section: Logo + Title + Company */}
              <div className="flex items-start gap-4">
                {/* Logo */}
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.companyName}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                    <MdBusiness className="w-7 h-7 text-gray-600" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {job.title}
                  </h2>


                  <button
                    onClick={() => onViewCompany?.(job.company)}
                    className="mt-1 inline-flex items-center gap-1.5 text-primary hover:underline text-[15px] font-medium"
                  >
                    <MdBusiness className="w-4 h-4" />
                    {job.company?.companyName || "Company"}
                  </button>
                </div>
              </div>

              {/* Metadata line */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MdLocationOn className="w-4 h-4 text-primary" />
                  {job.location || job.jobMode || "Remote"}
                </div>
                <div className="flex items-center gap-1.5">
                  <MdWork className="w-4 h-4 text-primary" />
                  {job.employmentType || "Full-time"}
                </div>
                <div className="flex items-center gap-1.5">
                  <MdPeople className="w-4 h-4 text-primary" />
                  {job.totalApplicants || 0} applicants
                </div>
              </div>

              {/* Salary box */}
              <div className="px-5 py-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <MdAttachMoney className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {formatSalary()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {job.salary?.period ? `per ${job.salary.period}` : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {job.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="
                        px-3 py-1 text-sm font-medium
                        border border-primary/40 text-primary
                        bg-primary/5 rounded-full
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 my-2"></div>

              {/* About this role */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About this role
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
                  {job.description || "No description provided."}
                </p>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Requirements
                  </h3>
                  <ul className="space-y-2.5">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700">
                        <MdCheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits?.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Benefits & Perks
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className="
                            flex items-center gap-3 px-4 py-3 
                            bg-gray-50 rounded-lg border border-gray-200
                            text-gray-800 text-sm
                          "
                        >
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Posted */}
              <div className="pt-3 text-sm text-gray-500 flex items-center gap-2">
                <MdAccessTime className="w-4 h-4" />
                Posted {timeAgo(job.createdAt)}
              </div>
            </div>
          ) : null}
        </div>

        {/* <div className="px-6 py-5 border-t bg-gray-50 flex flex-col sm:flex-row gap-3">
          {job && !job.hasApplied && context !== "application" && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg"
            >
              Apply Now
            </button>
          )}

          {job && job.hasApplied && (
            <div
              className="
        flex-1 px-6 py-3
        bg-green-50 text-green-700
        rounded-lg text-center font-medium
      "
            >
              You have already applied to this job
            </div>
          )}

          {showApplyModal && job && (
            <ApplyJobModal
              job={job}
              onClose={() => setShowApplyModal(false)}
              onApplied={() => setShowApplyModal(false)}
            />
          )}

          <button
            onClick={() => onViewCompany?.(job?.company)}
            disabled={!job?.company}
            className="
      flex-1 sm:flex-none px-6 py-3 border border-gray-300 
      text-gray-800 font-medium rounded-lg 
      hover:bg-gray-100 transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
    "
          >
            View Company
          </button>
        </div> */}
        <div className="px-6 py-5 border-t bg-gray-50 flex flex-col sm:flex-row gap-3">
          {/* Apply Now button only in browse context and not applied */}
          {job && context === "browse" && !job.hasApplied && !showApplyModal && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg"
            >
              Apply Now
            </button>
          )}

          {/* Already applied */}
          {job && job.hasApplied && (
            <div
              className="
        flex-1 px-6 py-3
        bg-green-50 text-green-700
        rounded-lg text-center font-medium
      "
            >
              You have already applied to this job
            </div>
          )}

          {/* ApplyJobModal */}
          {showApplyModal && job && (
            <ApplyJobModal
              job={job}
              onClose={() => setShowApplyModal(false)}
              onApplied={() => setShowApplyModal(false)}
            />
          )}

          {/* View Company */}
          <button
            onClick={() => onViewCompany?.(job?.company)}
            disabled={!job?.company}
            className="
      flex-1 sm:flex-none px-6 py-3 border border-gray-300 
      text-gray-800 font-medium rounded-lg 
      hover:bg-gray-100 transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
    "
          >
            View Company
          </button>
        </div>

      </div>
    </div>
  );
}