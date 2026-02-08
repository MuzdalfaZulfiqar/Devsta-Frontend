
import React from "react";
import { MapPin, Clock, DollarSign, RefreshCw, Users, Edit, Trash2, ChevronRight, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Status Badge ── */
export function JobStatusBadge({ isActive, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
        cursor-pointer select-none transition-colors duration-150
        ${isActive
          ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
      title="Click to toggle job status"
    >
      {isActive ? "Active" : "Closed"}
      <RefreshCw className="h-4.5 w-4.5" />
    </div>
  );
}

/* ── Job Card ── */
export default function JobCard({ job, onToggle, onEdit, onDelete }) {
  const navigate = useNavigate();
  const daysAgo = Math.floor(
    (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const requirementsList = job.requirements?.map(r => typeof r === "string" ? r : r.value) || [];
  const benefitsList = job.benefits?.map(b => typeof b === "string" ? b : b.value) || [];
  const hasRequirements = requirementsList.length > 0;
  const hasBenefits = benefitsList.length > 0;
  const hasexperienceLevel = job.experienceLevel && job.experienceLevel.trim() !== "";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top status bar */}
      <div className={`h-1 w-full ${job.isActive ? "bg-primary" : "bg-gray-400 dark:bg-gray-600"}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 flex-1">
            {job.title}
          </h3>

          <div className="flex items-center gap-2 shrink-0">
            <JobStatusBadge isActive={job.isActive} onToggle={() => onToggle(job._id)} />

            <button
              onClick={() => onEdit(job)}
              className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              title="Edit job"
            >
              <Edit className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={() => onDelete(job._id)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              title="Delete job"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Quick info row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4.5 w-4.5 text-gray-500" />
            <span className="font-medium">{job.jobMode === "remote" ? "Remote" : job.location || "—"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-gray-500" />
            <span className="font-medium">{job.employmentType || "—"}</span>
          </div>

          {job.salary && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4.5 w-4.5 text-gray-500" />
              <span className="font-medium">
                {job.salary.currency} {job.salary.min ?? "—"} – {job.salary.max ?? "—"}
                <span className="text-gray-500"> / {job.salary.period || "?"}</span>
              </span>
            </div>
          )}

          {hasexperienceLevel && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">
                {job.experienceLevel}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Description
          </h4>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {job.description || "No description provided."}
          </p>
        </div>

        {/* Required Skills */}
        {job.requiredSkills?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Requirements & Benefits */}
        {(hasRequirements || hasBenefits) && (
          <div className="mb-4">
            <div className={`grid gap-4 ${hasRequirements && hasBenefits ? "md:grid-cols-2" : "grid-cols-1"}`}>
              {hasRequirements && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Requirements
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {requirementsList.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasBenefits && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Benefits
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {benefitsList.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 font-medium">
            <Users className="h-4.5 w-4.5 text-primary" />
            <span>
              {job.totalApplicants} applicant{job.totalApplicants !== 1 ? "s" : ""}
            </span>
          </div>

          <button
            onClick={() => navigate(`/company/jobs/${job._id}/first-stage-applicants`)}
            className="px-2 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
          >
            View Applicants
          </button>

          <div>
            Posted {daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}
          </div>
        </div>
      </div>
    </div>
  );
}
