import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { generateResume, generateTailoredResume } from "../../api/resume";

export default function ResumePage() {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState("resume");
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch resume on load
  useEffect(() => {
    setLoading(true);
    generateResume(token)
      .then((res) => {
        if (res.data) setResumeData(res.data);
        else setError(res.msg || "Failed to fetch resume");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Tab Component
  const Tab = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "text-primary border-primary"
          : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <DashboardLayout user={user}>
      <div className="w-full">
        {/* Tabs */}
        <div className="flex gap-6 px-6 border-b">
          <Tab label="Resume" active={activeTab === "resume"} onClick={() => setActiveTab("resume")} />
          <Tab label="Portfolio" active={activeTab === "portfolio"} onClick={() => setActiveTab("portfolio")} />
        </div>

        <main className="px-6 py-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : activeTab === "resume" ? (
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(resumeData?.resumeJson, null, 2)}</pre>
          ) : (
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(resumeData?.portfolioJson, null, 2)}</pre>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
