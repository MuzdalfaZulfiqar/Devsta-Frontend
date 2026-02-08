import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { getMyJobs } from "../../api/company/jobs";

export default function CompanyDashboardPage() {
  const company = JSON.parse(localStorage.getItem("companyInfo") || "{}");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getMyJobs();
      setJobs(data || []);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.isActive).length;
  const closedJobs = jobs.filter((j) => !j.isActive).length;

  return (
    <CompanyDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {company?.companyName || "Company"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
            Manage your job postings and recruitment process
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
            Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Jobs */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Jobs Posted
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3">
                {loading ? "—" : totalJobs}
              </p>
            </div>

            {/* Active Jobs */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Jobs
              </p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-500 mt-3">
                {loading ? "—" : activeJobs}
              </p>
            </div>

            {/* Closed Jobs */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Closed Jobs
              </p>
              <p className="text-4xl font-bold text-gray-700 dark:text-gray-300 mt-3">
                {loading ? "—" : closedJobs}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
            Quick Actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/company/jobs/new")}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Post New Job
            </button>

            <button
              onClick={() => navigate("/company/jobs")}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              View All Jobs
            </button>

            {/* You can add more actions later */}
            {/* 
            <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              View Applications
            </button>
            */}
          </div>
        </div>

        {/* Optional future sections */}
        {/* Recent Applications, Pending Tasks, etc. */}
      </div>
    </CompanyDashboardLayout>
  );
}