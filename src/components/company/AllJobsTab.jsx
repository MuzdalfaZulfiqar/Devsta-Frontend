

// src/components/company/AllJobsTab.jsx
import { useEffect, useMemo, useState } from "react";
import DeveloperJobCard from "./DeveloperJobCard";
import JobFilters from "./JobFilters";
import { useAuth } from "../../context/AuthContext";
import { getRecommendedJobs } from "../../api/jobs";

export default function AllJobsTab({
  onSelectJob,
  onCompanyClick,
  appliedJobIds = new Set(),  // ← lifted up from JobsPage
  onJobApplied,               // ← (jobId) => void, called when user applies
}) {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("match");
  const [page, setPage] = useState(1);
  const LIMIT = 6;

  const [filters, setFilters] = useState({
    search: "",
    jobMode: "",
    employmentType: "",
    experienceLevel: "",
    location: "",
  });

  // ── Seed appliedJobIds from API on first load ────────────────
  // We only seed — from then on JobsPage owns the set
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getRecommendedJobs({ k: 80 }, token);
        const fetched = Array.isArray(data.items) ? data.items : [];
        setItems(fetched);

        // Tell JobsPage about any jobs the API says we've already applied to
        fetched
          .filter((x) => x.job?.hasApplied)
          .forEach((x) => onJobApplied?.(x.job._id));
      } catch (err) {
        console.error("Failed to fetch recommended jobs", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [token]); // intentionally exclude onJobApplied from deps to avoid re-fetch

  useEffect(() => {
    setPage(1);
  }, [filters]);

  // const filteredItems = useMemo(() => {
  //   const f = cleanFilters(filters);


  //   return items.filter((x) => {
  //     const job = x.job || {};
  //     const title = (job.title || "").toLowerCase();
  //     const desc = (job.description || "").toLowerCase();
  //     const loc = (job.location || "").toLowerCase();
  //     const jobMode = (job.jobMode || "").toLowerCase();
  //     const employmentType = (job.employmentType || "").toLowerCase();
  //     const experienceLevel = (job.experienceLevel || "").toLowerCase();
  //     const requiredSkills = Array.isArray(job.requiredSkills)
  //       ? job.requiredSkills.map((s) => String(s).toLowerCase())
  //       : [];

  //     if (f.search) {
  //       const q = String(f.search).toLowerCase();
  //       const inSkills = requiredSkills.some((s) => s.includes(q));
  //       const inText = title.includes(q) || desc.includes(q) || loc.includes(q);
  //       if (!inSkills && !inText) return false;
  //     }

  //     if (f.location) {
  //       const q = String(f.location).toLowerCase();
  //       if (!loc.includes(q)) return false;
  //     }

  //     if (f.jobMode && jobMode !== String(f.jobMode).toLowerCase()) return false;
  //     if (f.employmentType && employmentType !== String(f.employmentType).toLowerCase()) return false;
  //     if (f.experienceLevel && experienceLevel !== String(f.experienceLevel).toLowerCase()) return false;

  //     return true;
  //   });
  // }, [items, filters]);

  const filteredItems = useMemo(() => {
  const f = cleanFilters(filters);
  const filtered = items.filter((x) => {
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

      if (f.jobMode && jobMode !== String(f.jobMode).toLowerCase()) return false;
      if (f.employmentType && employmentType !== String(f.employmentType).toLowerCase()) return false;
      if (f.experienceLevel && experienceLevel !== String(f.experienceLevel).toLowerCase()) return false;

      return true;
  });

  // Sort
  if (sortBy === "match") {
    filtered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } else {
    filtered.sort((a, b) =>
      new Date(b.job?.createdAt ?? 0) - new Date(a.job?.createdAt ?? 0)
    );
  }
  return filtered;
}, [items, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / LIMIT));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return filteredItems.slice(start, start + LIMIT);
  }, [filteredItems, page]);

  return (
    <div className="flex flex-col gap-6 font-fragment">
      <JobFilters filters={filters} setFilters={setFilters} />

      {loading && <p className="text-gray-400 text-sm">Updating results…</p>}

{/* Sort controls */}
<div className="flex items-center gap-2 text-sm">
  <span className="text-gray-500 font-medium">Sort by:</span>
  {[
    { key: "match", label: "Best match" },
    { key: "newest", label: "Newest" },
  ].map(({ key, label }) => (
    <button
      key={key}
      onClick={() => setSortBy(key)}
      className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
        sortBy === key
          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  ))}
</div>
      {!loading && pagedItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No recommended jobs match your filters</p>
      ) : (

        
        <div className="flex flex-col gap-4">
          {pagedItems.map((x) => (
            <DeveloperJobCard
              key={x.job?._id}
              job={{
                ...x.job,
                // Override hasApplied with the live set owned by JobsPage
                hasApplied: appliedJobIds.has(String(x.job?._id)),
              }}
              matchScore={x.score != null ? Math.round(x.score * 100) : null} 
              onClick={() => onSelectJob(x.job._id)}
            />
          ))}
        </div>
      )}

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
