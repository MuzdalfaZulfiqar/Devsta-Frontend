import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyApplications } from "../../api/company/jobApplications";
import MyApplicationCard from "../../components/company/MyApplicationCard";
import { showToast } from "../../utils/toast";

export default function MyApplicationsPage({ onViewJob }) {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const LIMIT = 6;

  // 🔹 Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 Fetch applications with pagination & debounced search
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getMyApplications(
          { page, limit: LIMIT, search: debouncedSearch },
          token
        );
        setApplications(data.applications);
        setPagination(data.pagination);
      } catch (err) {
        showToast(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, debouncedSearch, token]);

  return (
    <div className="flex flex-col gap-5">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search jobs, company…"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="border rounded-lg px-4 py-2 w-full"
      />

      {/* 📦 Applications */}
      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse py-10 text-center">
          Loading your applications…
        </p>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold">No applications yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            When you apply to jobs, they’ll appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 mt-2">
            {applications.map((app) => (
              <MyApplicationCard
                key={app._id}
                application={app}
                onViewJob={onViewJob}
              />
            ))}
          </div>

          {/* 📄 Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6">
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
                    page === i + 1 ? "bg-primary text-white" : "bg-gray-200"
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
        </>
      )}
    </div>
  );
}
