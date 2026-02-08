// src/components/company/MyApplicationCard.jsx
import { 
  MapPin, 
  BriefcaseBusiness, 
  Building2, 
  ChevronRight 
} from "lucide-react";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

export default function MyApplicationCard({ application, onViewJob }) {
  const { job, status, appliedAt } = application;
  
  const appliedDate = new Date(appliedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="
      group relative
      rounded-2xl border border-gray-200/70 bg-white p-5
      transition-all duration-200
      hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100/70
      focus-within:border-primary/40 focus-within:shadow-md
      flex flex-col justify-between
    ">
      {/* Top row - Status + Applied date */}
      <div className="mb-4 flex items-center justify-between">
        <ApplicationStatusBadge status={status} />

        <time className="text-xs font-medium text-gray-500 tabular-nums">
          Applied on {appliedDate}
        </time>
      </div>

      {/* Job info */}
      <div className="space-y-2.5">
        <h3 className="
          line-clamp-2 
          text-lg font-semibold leading-tight text-gray-900
          group-hover:text-primary transition-colors
        ">
          {job.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span className="line-clamp-1 font-medium">
            {job.company?.companyName || "Company"}
          </span>
        </div>

        {/* Metadata pills */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <div className="
            flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 
            text-xs font-medium text-gray-700
          ">
            <MapPin className="h-3.5 w-3.5 text-gray-500" />
            {job.location || job.jobMode || "Remote"}
          </div>

          <div className="
            flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 
            text-xs font-medium text-gray-700
          ">
            <BriefcaseBusiness className="h-3.5 w-3.5 text-gray-500" />
            {job.employmentType || "Full-time"}
          </div>
        </div>
      </div>

      {/* Bottom row - right aligned button */}
      <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
        <button
          onClick={() => onViewJob(job._id)}
          className="
            inline-flex items-center gap-1.5
            px-4 py-2 bg-primary text-white font-semibold rounded-lg
            hover:bg-primary/90 transition-colors text-sm
          "
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Optional subtle gradient overlay on hover */}
      <div className="
        pointer-events-none absolute inset-0 
        rounded-2xl opacity-0 group-hover:opacity-30 
        bg-gradient-to-br from-primary/5 via-transparent to-transparent 
        transition-opacity duration-300
      "/>
    </div>
  );
}
