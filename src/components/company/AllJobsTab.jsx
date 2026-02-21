// import { useEffect, useState } from "react";
// import { getActiveJobs } from "../../api/company/publicJobs";
// import DeveloperJobCard from "./DeveloperJobCard";
// import JobFilters from "./JobFilters";
// import { useAuth } from "../../context/AuthContext";

// export default function AllJobsTab({ onSelectJob, onCompanyClick }) {
//   const { token } = useAuth();

//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState(null);

//   const LIMIT = 6;

//   const [filters, setFilters] = useState({
//     search: "",
//     jobMode: "",
//     employmentType: "",
//     experienceLevel: "",
//     location: "",
//   });

//   // 🔁 Fetch jobs (paginated)
//   useEffect(() => {
//     const timeout = setTimeout(async () => {
//       try {
//         setLoading(true);

//         const data = await getActiveJobs(
//           {
//             ...cleanFilters(filters),
//             page,
//             limit: LIMIT,
//           },
//           token
//         );

//         setJobs(data.jobs);
//         setPagination(data.pagination);
//       } catch (err) {
//         console.error("Failed to fetch jobs", err);
//       } finally {
//         setLoading(false);
//       }
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [filters, page, token]);

//   // 🔁 Reset page when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [filters]);

//   return (
//     <div className="flex flex-col gap-6 font-fragment">
//       {/* 🔍 Filters */}
//       <JobFilters filters={filters} setFilters={setFilters} />

//       {/* ⏳ Loading */}
//       {loading && (
//         <p className="text-gray-400 text-sm">Updating results…</p>
//       )}

//       {/* Results */}
//       {!loading && jobs.length === 0 ? (
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

//       {/* 📄 Pagination (ONLY here) */}
//       {pagination && pagination.totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 pt-4">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//           >
//             Prev
//           </button>

//           {Array.from({ length: pagination.totalPages }).map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1 rounded ${
//                 page === i + 1
//                   ? "bg-primary text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             disabled={page === pagination.totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function cleanFilters(filters) {
//   const cleaned = {};
//   Object.entries(filters).forEach(([key, value]) => {
//     if (value !== "" && value !== null && value !== undefined) {
//       cleaned[key] = value;
//     }
//   });
//   return cleaned;
// }


import { useEffect, useMemo, useState } from "react";
import DeveloperJobCard from "./DeveloperJobCard";
import JobFilters from "./JobFilters";
import { useAuth } from "../../context/AuthContext";
import { getRecommendedJobs } from "../../api/jobs";

export default function AllJobsTab({ onSelectJob, onCompanyClick }) {
  const { token } = useAuth();

  const [items, setItems] = useState([]); // ML items: [{score, job}]
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const LIMIT = 6;

  const [filters, setFilters] = useState({
    search: "",
    jobMode: "",
    employmentType: "",
    experienceLevel: "",
    location: "",
  });

  // ✅ Fetch recommended jobs from ML (no filters here; we filter locally)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        // Increase k so filters still have results after filtering
        const data = await getRecommendedJobs({ k: 80 }, token);

        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error("Failed to fetch recommended jobs", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [token]);

  // 🔁 Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // ✅ Client-side filtering on recommended jobs
  const filteredItems = useMemo(() => {
    const f = cleanFilters(filters);

    return items.filter((x) => {
      const job = x.job || {};
      const title = (job.title || "").toLowerCase();
      const desc = (job.description || "").toLowerCase();
      const loc = (job.location || "").toLowerCase();

      const jobMode = (job.jobMode || "").toLowerCase();
      const employmentType = (job.employmentType || "").toLowerCase();
      const experienceLevel = (job.experienceLevel || "").toLowerCase();

      const requiredSkills = Array.isArray(job.requiredSkills)
        ? job.requiredSkills.map((s) => String(s).toLowerCase())
        : [];

      // Search: title + description + skills + location
      if (f.search) {
        const q = String(f.search).toLowerCase();
        const inSkills = requiredSkills.some((s) => s.includes(q));
        const inText = title.includes(q) || desc.includes(q) || loc.includes(q);
        if (!inSkills && !inText) return false;
      }

      if (f.location) {
        const q = String(f.location).toLowerCase();
        if (!loc.includes(q)) return false;
      }

      if (f.jobMode) {
        if (jobMode !== String(f.jobMode).toLowerCase()) return false;
      }

      if (f.employmentType) {
        if (employmentType !== String(f.employmentType).toLowerCase()) return false;
      }

      if (f.experienceLevel) {
        if (experienceLevel !== String(f.experienceLevel).toLowerCase()) return false;
      }

      return true;
    });
  }, [items, filters]);

  // ✅ Client-side pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / LIMIT));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return filteredItems.slice(start, start + LIMIT);
  }, [filteredItems, page]);

  return (
    <div className="flex flex-col gap-6 font-fragment">
      {/* 🔍 Filters */}
      <JobFilters filters={filters} setFilters={setFilters} />

      {/* ⏳ Loading */}
      {loading && <p className="text-gray-400 text-sm">Updating results…</p>}

      {/* Results */}
      {!loading && pagedItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No recommended jobs match your filters</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pagedItems.map((x) => (
            <DeveloperJobCard
              key={x.job?._id}
              job={x.job}
              onClick={() => onSelectJob(x.job._id)}
            />
          ))}
        </div>
      )}

      {/* 📄 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
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