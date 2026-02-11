// src/components/company/CompanyInfoCard.jsx
import React from 'react';
import { 
  MdBusiness, 
  MdLanguage, 
  MdCalendarToday, 
  MdPeople, 
  MdClose,
  MdWork,
  MdLocationOn,
  MdArrowForward,
} from 'react-icons/md';

export default function CompanyInfoCard({ 
  company, 
  activeJobs = [],        // ← pass array of active jobs here
  onClose, 
  onViewJob               // ← new prop: (jobId) => void
}) {

  if (!company) {
    return (
      <div className="p-6 text-center text-gray-500">
        No company information available
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <MdClose className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex items-center gap-4 pr-12">
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.companyName} logo`}
              className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
              <MdBusiness className="w-7 h-7 text-gray-600" />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              {company.companyName}
            </h2>
            {company.industry && (
              <p className="text-sm text-gray-600 mt-1">{company.industry}</p>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
        {/* About */}
        {company.description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
              {company.description}
            </p>
          </div>
        )}

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {company.website && (
            <div className="flex items-start gap-3">
              <MdLanguage className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Website</p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}

          {company.companySize && company.companySize !== "" && (
            <div className="flex items-start gap-3">
              <MdPeople className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Company Size</p>
                <p className="text-sm text-gray-600">{company.companySize}</p>
              </div>
            </div>
          )}

          {company.foundedYear && (
            <div className="flex items-start gap-3">
              <MdCalendarToday className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Founded</p>
                <p className="text-sm text-gray-600">{company.foundedYear}</p>
              </div>
            </div>
          )}
        </div>

        {/* ────────────────────────────────────────────────
            Active Jobs Section
        ──────────────────────────────────────────────── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>Active Jobs ({activeJobs.length})</span>
          </h3>

          {activeJobs.length === 0 ? (
            <div className="text-gray-500 text-sm py-4">
              No active job openings at the moment.
            </div>
          ) : (
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div
                  key={job._id}
                  className="
                    p-4 border border-gray-200 rounded-lg
                    hover:border-primary/40 transition-colors
                    bg-gray-50/40
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {job.title}
                      </h4>
                      <div className="mt-1.5 flex flex-wrap gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MdWork className="w-3.5 h-3.5" />
                          {job.employmentType}
                        </div>
                        <div className="flex items-center gap-1">
                          <MdLocationOn className="w-3.5 h-3.5" />
                          {job.jobMode || job.location || 'Remote'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onViewJob?.(job._id)}
                      className="
                        flex items-center gap-1.5 px-3 py-1.5
                        text-sm font-medium text-primary
                        hover:bg-primary/5 rounded-md transition-colors
                        flex-shrink-0
                      "
                    >
                      View
                      <MdArrowForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
        Company profile • Last updated{' '}
        {company.updatedAt 
          ? new Date(company.updatedAt).toLocaleDateString() 
          : '—'}
      </div>
    </div>
  );
}