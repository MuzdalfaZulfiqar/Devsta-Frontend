// import { useEffect, useState } from "react";
// import { getActiveJobs } from "../../api/company/publicJobs";
// import DeveloperJobCard from "./DeveloperJobCard";
// import JobFilters from "./JobFilters";
// import { useAuth } from "../../context/AuthContext";

// export default function AllJobsTab({ onSelectJob, onCompanyClick }) {
//   const { token } = useAuth(); 
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     search: "",
//     jobMode: "",
//     employmentType: "",
//     experienceLevel: "",
//     location: "",
    
//   });
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setLoading(true);

//       getActiveJobs(cleanFilters(filters), token)
//         .then(setJobs)
//         .finally(() => setLoading(false));
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [filters, token]);

//   return (
//     <div className="flex flex-col gap-6 font-fragment">
//       {/* 🔍 Filters NEVER unmount */}
//       <JobFilters filters={filters} setFilters={setFilters} />

//       {/* ⏳ Loading state ONLY for results */}
//       {loading && (
//         <p className="text-gray-400 text-sm">Updating results…</p>
//       )}

//       {/* Results */}
//       {!loading && !jobs.length ? (
//         <p className="text-gray-500 text-sm">No jobs match your filters</p>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {jobs.map((job) => (
//             <DeveloperJobCard
//               key={job._id}
//               job={job}
//               onClick={() => onSelectJob(job._id)}
//               onCompanyClick={onCompanyClick}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function cleanFilters(filters) {
//   const cleaned = {};
//   Object.entries(filters).forEach(([key, value]) => {
//     if (Array.isArray(value) && value.length) {
//       cleaned[key] = value.join(","); // skills
//     } else if (value !== "" && value !== null && value !== undefined) {
//       cleaned[key] = value;
//     }
//   });
//   return cleaned;
// }



import { useEffect, useState } from "react";
import { getActiveJobs } from "../../api/company/publicJobs";
import DeveloperJobCard from "./DeveloperJobCard";
import JobFilters from "./JobFilters";
import { useAuth } from "../../context/AuthContext";

export default function AllJobsTab({ onSelectJob, onCompanyClick }) {
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const LIMIT = 6;

  const [filters, setFilters] = useState({
    search: "",
    jobMode: "",
    employmentType: "",
    experienceLevel: "",
    location: "",
  });

  // 🔁 Fetch jobs (paginated)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const data = await getActiveJobs(
          {
            ...cleanFilters(filters),
            page,
            limit: LIMIT,
          },
          token
        );

        setJobs(data.jobs);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, page, token]);

  // 🔁 Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="flex flex-col gap-6 font-fragment">
      {/* 🔍 Filters */}
      <JobFilters filters={filters} setFilters={setFilters} />

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-gray-400 text-sm">Updating results…</p>
      )}

      {/* Results */}
      {!loading && jobs.length === 0 ? (
        <p className="text-gray-500 text-sm">No jobs match your filters</p>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <DeveloperJobCard
              key={job._id}
              job={job}
              onClick={() => onSelectJob(job._id)}
              onCompanyClick={onCompanyClick}
            />
          ))}
        </div>
      )}

      {/* 📄 Pagination (ONLY here) */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function cleanFilters(filters) {
  const cleaned = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
}
