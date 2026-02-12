// src/components/company/DeveloperJobCard.jsx
import React from 'react';
import {
  MdBusiness,
  MdLocationOn,
  MdWork,
  MdPeople,
  MdAccessTime
} from 'react-icons/md';

export default function DeveloperJobCard({ job, onClick }) {
  const {
    _id,
    title,
    company = {},
    location,
    jobMode,
    requiredSkills = [],
    createdAt,
    employmentType = 'Full-time',
    salary,
    experienceLevel,
    totalApplicants = 0,
    remote = false,
    hasApplied = false,
  } = job;

  const timeAgo = (date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const formatSalary = () => {
    if (!salary?.min || !salary?.max) return null;

    const { currency, min, max, period } = salary;

    const formattedAmount = currency === 'USD'
      ? `$${min.toLocaleString()} – $${max.toLocaleString()}`
      : `${currency} ${min.toLocaleString()} – ${max.toLocaleString()}`;

    // Add "per" before unit
    let unitText = '';
    if (period) {
      const periodLower = period.toLowerCase();
      if (periodLower === 'hour') unitText = 'per hour';
      else if (periodLower === 'day') unitText = 'per day';
      else if (periodLower === 'week') unitText = 'per week';
      else if (periodLower === 'month') unitText = 'per month';
      else if (periodLower === 'year') unitText = 'per year';
      else if (periodLower === 'project') unitText = 'project';
      else if (periodLower === 'stipend') unitText = 'stipend';
      else unitText = `per ${period}`;
    }

    return {
      amount: formattedAmount,
      unit: unitText ? unitText : period || '',
    };
  };

  const salaryInfo = formatSalary();
  const modeText = jobMode
    ? jobMode.charAt(0).toUpperCase() + jobMode.slice(1)
    : (location || 'Remote');

  return (
    <div
      onClick={() => onClick(_id)}
      className={`
    group relative
    bg-white border border-gray-200 rounded-2xl
    pt-12 pb-6 px-4 sm:px-6      // ← smaller padding on mobile
    hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10
    transition-all duration-300 cursor-pointer
    flex flex-col overflow-hidden
    ${hasApplied ? "opacity-80" : "hover:shadow-xl hover:border-primary/60"}
  `}
    >
      {hasApplied && (
        <div className="absolute top-3 left-3 z-20">
          <span className="
        bg-green-50 text-green-800
        text-xs sm:text-sm font-semibold
        px-3 py-1 rounded-full
        border border-green-200/70
        shadow-sm whitespace-nowrap
      ">
            Already Applied
          </span>
        </div>
      )}

      {/* rest remains the same */}

      {/* Subtle gradient overlay on hover */}
      <div className="
        absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
      " />
      {/* Header - Company + Title + Salary */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-5">
        {/* Company Logo */}
        {company?.logo ? (
          <img
            src={company.logo}
            alt={company.companyName || 'Company'}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-gray-200/80 group-hover:border-primary/40 transition-colors flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200/80 group-hover:border-primary/40 transition-colors flex-shrink-0">
            <MdBusiness className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <h3 className="
            font-bold text-lg sm:text-xl text-gray-900
            group-hover:text-primary transition-colors
            line-clamp-2 leading-tight
          ">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                {company?.companyName || 'Company'}
              </p>
            </div>

            {/* Salary - responsive */}
            {salaryInfo && (
              <div className="text-right flex-shrink-0 mt-2 sm:mt-0">
                <p className="font-extrabold text-lg sm:text-2xl text-primary tracking-tight">
                  {salaryInfo.amount}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                  {salaryInfo.unit}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Quick tags */}
      {/* Quick tags */}
      <div className="flex flex-wrap gap-2 mb-5 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
          <MdLocationOn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {modeText}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
          <MdWork className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {employmentType}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
          <MdWork className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {experienceLevel || 'Experience level not specified'}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
          <MdPeople className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {totalApplicants} {totalApplicants === 1 ? 'applicant' : 'applicants'}
        </span>

        {remote && (
          <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs sm:text-sm">
            Remote
          </span>
        )}
      </div>


      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
        {requiredSkills.slice(0, 6).map(skill => (
          <span
            key={skill}
            className="text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
          >
            {skill}
          </span>
        ))}
        {requiredSkills.length > 6 && (
          <span className="text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg">
            +{requiredSkills.length - 6}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 pt-4 border-t border-gray-100 text-sm text-gray-500">
        <div className="flex items-center gap-2 font-medium">
          <MdAccessTime className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {timeAgo(createdAt)}
        </div>

        <span className="font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 sm:mt-0">
          View details →
        </span>
      </div>
    </div>
  );
}