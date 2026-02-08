import { useEffect, useState } from "react";
import { getActiveJobs } from "../../api/company/publicJobs";
import DeveloperJobCard from "./DeveloperJobCard";
import JobFilters from "./JobFilters";
import { useAuth } from "../../context/AuthContext";

export default function AllJobsTab({ onSelectJob, onCompanyClick }) {
  const { token } = useAuth(); 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    jobMode: "",
    employmentType: "",
    experienceLevel: "",
    location: "",
    
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);

      getActiveJobs(cleanFilters(filters), token)
        .then(setJobs)
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, token]);

  return (
    <div className="flex flex-col gap-6 font-fragment">
      {/* 🔍 Filters NEVER unmount */}
      <JobFilters filters={filters} setFilters={setFilters} />

      {/* ⏳ Loading state ONLY for results */}
      {loading && (
        <p className="text-gray-400 text-sm">Updating results…</p>
      )}

      {/* Results */}
      {!loading && !jobs.length ? (
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
    </div>
  );
}

function cleanFilters(filters) {
  const cleaned = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length) {
      cleaned[key] = value.join(","); // skills
    } else if (value !== "" && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
}
