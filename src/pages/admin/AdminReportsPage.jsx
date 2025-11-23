import { useState } from "react";
import AdminDashboardLayout from "../../components/admin/AdminDashboardLayout";
import { FileText, Users, ShieldCheck, Download } from "lucide-react";
import { showToast } from "../../utils/toast";
import { BACKEND_URL } from "../../../config";

export default function AdminReportsPage() {
  const [loadingReport, setLoadingReport] = useState(null);

  const downloadReport = async (endpoint, filename) => {
    try {
      setLoadingReport(filename); // ✅ Set loading for this report
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        showToast("Failed to download report", "error");
        setLoadingReport(null);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      showToast(
        `${filename.replace(/_/g, " ").replace(".csv", "")} downloaded`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast("Download failed", "error");
    } finally {
      setLoadingReport(null); // ✅ Reset loading
    }
  };

  const reports = [
    {
      title: "Users Report",
      description: "All users, roles, blocked users & account creation dates.",
      icon: Users,
      filename: "users_report.csv",
      endpoint: "/api/admin/reports/users",
      color: "bg-blue-500",
    },
    {
      title: "Posts Report",
      description: "All posts, authors, visibility state & timestamps.",
      icon: FileText,
      filename: "posts_report.csv",
      endpoint: "/api/admin/reports/posts",
      color: "bg-green-500",
    },
   
  ];

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.title}
              className="rounded-xl border border-gray-300 dark:border-gray-700 p-5 shadow-sm bg-white dark:bg-black transition hover:shadow-md"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${report.color}`}
              >
                <report.icon size={22} />
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold mt-4">{report.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {report.description}
              </p>

              {/* Download Button */}
              <button
                onClick={() =>
                  downloadReport(report.endpoint, report.filename)
                }
                className={`mt-5 w-full py-2 flex items-center justify-center gap-2 rounded-md font-semibold transition 
                  ${
                    loadingReport === report.filename
                      ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                disabled={loadingReport === report.filename}
              >
                {loadingReport === report.filename ? (
                  <span>Downloading...</span>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Download CSV</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
