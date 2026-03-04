// // src/components/company/JobDetailCard.jsx
// export default function JobDetailCard({ job, loading }) {
//   if (loading) {
//     return (
//       <div className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm animate-pulse">
//         <div className="h-8 w-3/5 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           <div className="h-5 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
//           <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
//           <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
//           <div className="h-5 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
//         </div>
//         <div className="space-y-3">
//           <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
//           <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
//           <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm text-gray-500 text-center">
//         Job information not available
//       </div>
//     );
//   }

//   // Format salary nicely
//   const formatSalary = () => {
//     if (!job.salary?.min || !job.salary?.max) return "Not specified";
//     const { min, max, currency = "USD", period = "month" } = job.salary;
//     return `${currency} ${min.toLocaleString()} – ${max.toLocaleString()} / ${period}`;
//   };

//   return (
//     <div className="mb-8 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
//       {/* Job Title */}
//       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5">
//         {job.title || "Untitled Job"}
//       </h2>

//       {/* Key Meta Information */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-7 text-sm text-gray-600 dark:text-gray-300">
//         <div className="flex items-center">
//           <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Experience Level:</span>
//           <span className="capitalize">{job.experienceLevel || "Not specified"}</span>
//         </div>

//         <div className="flex items-center">
//           <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Employment Type:</span>
//           <span className="capitalize">{job.employmentType || "Not specified"}</span>
//         </div>

//         <div className="flex items-center">
//           <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Location / Mode:</span>
//           <span>
//             {job.location || "Remote"}
//             {job.jobMode && job.jobMode !== "remote" && ` (${job.jobMode})`}
//           </span>
//         </div>

//         <div className="flex items-center">
//           <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Salary Range:</span>
//           <span>{formatSalary()}</span>
//         </div>

//         <div className="sm:col-span-2 lg:col-span-1 flex items-start">
//           <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2 mt-1">Required Skills:</span>
//           <span>{job.requiredSkills?.join(", ") || "None listed"}</span>
//         </div>
//       </div>

//       {/* Subtle divider */}
//       <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

//       {/* Job Description */}
//       <div>
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
//           Description
//         </h3>
//         <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
//           {job.description || "No description provided."}
//         </p>
//       </div>
//     </div>
//   );
// }

// src/components/company/JobDetailCard.jsx
export default function JobDetailCard({ job, loading }) {
  if (loading) {
    return (
      <div className="mb-6 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm animate-pulse">
        <div className="h-7 w-3/5 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mb-6 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm text-gray-500 text-center">
        Job information not available
      </div>
    );
  }

  // Format salary nicely
  const formatSalary = () => {
    if (!job.salary?.min || !job.salary?.max) return "Not specified";
    const { min, max, currency = "USD", period = "month" } = job.salary;
    return `${currency} ${min.toLocaleString()} – ${max.toLocaleString()} / ${period}`;
  };

  return (
    <div className="mb-6 p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      {/* Job Title */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {job.title || "Untitled Job"}
      </h2>

      {/* Key Meta Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Experience Level:</span>
          <span className="capitalize">{job.experienceLevel || "Not specified"}</span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Employment Type:</span>
          <span className="capitalize">{job.employmentType || "Not specified"}</span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Location / Mode:</span>
          <span>
            {job.location || "Remote"}
            {job.jobMode && job.jobMode !== "remote" && ` (${job.jobMode})`}
          </span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">Salary Range:</span>
          <span>{formatSalary()}</span>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 flex items-start">
          <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2 mt-1">Required Skills:</span>
          <span>{job.requiredSkills?.join(", ") || "None listed"}</span>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

      {/* Job Description */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Description
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-6 whitespace-pre-line">
          {job.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}