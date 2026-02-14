
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { getFirstStageApplicants } from "../../api/company/jobs";
import { showToast } from "../../utils/toast";
import { FileText, Github, Download, Eye } from "lucide-react";
import { BACKEND_URL } from "../../../config";

export default function FirstStageApplicantsPage() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await getFirstStageApplicants(jobId);
      setJob(data.job);
      setApplicants(data.applicants);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to load applicants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplicants();
  }, [jobId]);

 const handleViewResume = async (userId) => {
  try {
    const token = localStorage.getItem("companyToken");

    const response = await fetch(
      `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch resume");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");
  } catch (err) {
    console.error(err);
  }
};

const handleDownloadResume = async (userId) => {
  try {
    const token = localStorage.getItem("companyToken");

    const response = await fetch(
      `${BACKEND_URL}/api/company/jobs/${jobId}/${userId}/resume`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to download resume");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <CompanyDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            First Stage Applicants
          </h1>
          {job && (
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {job.title}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Loading applicants...
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            No applicants found for this position yet.
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/70">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Resume
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      GitHub
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {applicants.map((app) => {
                    const dev = app.developerSnapshot || app.developer;
                    return (
                      <tr
                        key={app._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                          {dev.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {dev.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {dev.phone || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {dev.resumeUrl ? (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleViewResume(dev._id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
                              >
                                <Eye size={15} />
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadResume(dev._id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                <Download size={15} />
                                Download
                              </button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {dev.githubProfile?.html_url ? (
                            <a
                              href={dev.githubProfile.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                              <Github size={16} />
                              GitHub
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}