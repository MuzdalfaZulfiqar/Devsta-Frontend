// src/pages/developer/MyApplicationsPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyApplications } from "../../api/company/jobApplications";
import MyApplicationCard from "../../components/company/MyApplicationCard";
import { showToast } from "../../utils/toast";

export default function MyApplicationsPage({ onViewJob }) {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 Fetch applications
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyApplications(token);
        setApplications(data);
        setFilteredApps(data);
      } catch (err) {
        showToast(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // 🔹 Apply search filter
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredApps(
        applications.filter((app) => {
          const { job } = app;
          return (
            !search ||
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company?.companyName.toLowerCase().includes(search.toLowerCase())
          );
        })
      );
    }, 200); // debounce

    return () => clearTimeout(timeout);
  }, [search, applications]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 text-sm animate-pulse">
          Loading your applications…
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold text-gray-900">
            No applications yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            When you apply to jobs, they’ll appear here so you can easily track them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 🔍 Search input */}
      <input
        type="text"
        placeholder="Search jobs, company…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full"
      />

      {/* 🔹 Applications grid */}
      {filteredApps.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">
          No applications match your search
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-3 lg:gap-6 mt-2">
          {filteredApps.map((app) => (
            <MyApplicationCard
              key={app._id}
              application={app}
              onViewJob={onViewJob}
            />
          ))}
        </div>
      )}
    </div>
  );
}
