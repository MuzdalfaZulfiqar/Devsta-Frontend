import React, { useEffect, useState } from "react";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { getMyJobs, toggleJobStatus, deleteJob } from "../../api/company/jobs";
import JobCard from "../../components/company/JobCard";
import ConfirmModal from "../../components/ConfirmModal";
import { showToast } from "../../utils/toast";
import EditJobModal from "./EditJobModal";
import Select from "react-select"; // react-select import

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState({ value: "latest", label: "Latest" }); // react-select
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const LIMIT = 6;

  // const loadJobs = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getMyJobs();
  //     setJobs(data);
  //   } catch (err) {
  //     console.error("Failed to load jobs", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await getMyJobs({
        page,
        limit: LIMIT,
        search: searchQuery,
        status: filter,
        sort: sortOrder.value,
      });

      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      showToast("Failed to load jobs ❌");
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   loadJobs();
  // }, []);

  useEffect(() => {
    loadJobs();
  }, [page, searchQuery, filter, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filter, sortOrder]);


  const handleToggle = async (id) => {
    try {
      await toggleJobStatus(id);
      loadJobs();
      showToast("Job status updated successfully!");
    } catch (err) {
      console.error("Failed to toggle job status", err);
      showToast("Failed to update job status. ❌");
    }
  };

  const handleDelete = (id) => {
    setDeleteJobId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteJob(deleteJobId);
      setModalOpen(false);
      setDeleteJobId(null);
      loadJobs();
      showToast("Job deleted successfully!");
    } catch (err) {
      console.error("Failed to delete job", err);
      showToast("Failed to delete job. ❌");
    }
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setEditModalOpen(true);
  };

  // Filter + search + sort


  // react-select styles
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "#086972" : "#d1d5db",
      borderRadius: "0.5rem",
      boxShadow: "none",
      "&:hover": { borderColor: "#086972" },
      minHeight: "42px",
    }),
    menu: (base) => ({ ...base, backgroundColor: "#fff", color: "#000", zIndex: 50 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#086972" : state.isFocused ? "#e6f4f1" : "#fff",
      color: state.isSelected ? "#fff" : "#000",
    }),
    singleValue: (base) => ({ ...base, color: "#086972" }),
  };

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
  ];


  return (
    <CompanyDashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Job Postings</h1>

        {/* Filter + Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["all", "active", "closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full font-medium ${filter === f
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  } transition`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap items-center">
            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, location, or skill..."
              className="w-full sm:w-80 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />

            {/* Styled Sort Dropdown */}
            <div className="w-40">
              <Select
                value={sortOrder}
                onChange={(selected) => setSortOrder(selected)}
                options={sortOptions}
                styles={selectStyles}
                isSearchable={false}
              />
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No jobs found.</p>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}


        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${page === i + 1
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
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}


        {/* Confirm Delete Modal */}
        <ConfirmModal
          open={modalOpen}
          title="Delete Job"
          message="Are you sure you want to delete this job? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setModalOpen(false)}
        />

        {/* Edit Job Modal */}
        <EditJobModal
          job={editJob}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdated={loadJobs}
        />
      </div>
    </CompanyDashboardLayout>
  );
}
