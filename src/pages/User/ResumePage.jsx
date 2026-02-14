// ResumePage.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { generateResume } from "../../api/resume";
import { Eye, Download, RefreshCw } from "lucide-react";
import { BACKEND_URL } from "../../../config";

export default function ResumePage() {
  const { user, token } = useAuth();

  const [activeTab] = useState("resume"); // keeping for future, but currently unused
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scanMessages = [
    "Initializing document analysis...",
    "Reading personal & contact information...",
    "Mapping professional experience timeline...",
    "Extracting education, certifications & credentials...",
    "Identifying core competencies and technical skills...",
    "Evaluating achievements, metrics & business impact...",
    "Optimizing phrasing for ATS & recruiter readability...",
    "Structuring content using modern resume standards...",
    "Applying professional typography & layout rules...",
    "Performing final consistency & formatting validation...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    fetchExistingResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % scanMessages.length);
    }, 2200); // slightly slower for realism

    return () => clearInterval(interval);
  }, [loading]);

  const fetchExistingResume = async () => {
    if (!user?._id) return;
    setLoading(true);

    try {
      const pdfUrl = `${BACKEND_URL}/api/resume/${user._id}`;
      // Optional: HEAD request to check existence without downloading
      const head = await fetch(pdfUrl, { method: "HEAD" });
      if (head.ok) {
        setResumeData({ resumePdfUrl: pdfUrl, updatedAt: new Date() });
      }
    } catch (err) {
      // 404 or network error → no resume exists yet
      setResumeData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!user?._id) {
      setError("Authentication error. Please sign in again.");
      return;
    }

    setError("");
    setLoading(true);
    setResumeData(null);

    try {
      const response = await generateResume({ userId: user._id }, token);

      if (response?.resumePdfUrl) {
        setResumeData({
          resumePdfUrl: response.resumePdfUrl,
          updatedAt: new Date(),
        });
      } else {
        throw new Error("No resume URL received");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    if (!resumeData?.resumePdfUrl) return;
    window.open(resumeData.resumePdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadResume = () => {
    if (!resumeData?.resumePdfUrl) return;

    fetch(resumeData.resumePdfUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Download failed");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Resume_${user?.name || "Professional"}_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not download resume. Please try viewing it first.");
      });
  };

  // ────────────────────────────────────────────────
  //  UI
  // ────────────────────────────────────────────────

  return (
    <DashboardLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-black">Professional Resume</h1>
            <p className="mt-2 text-gray-600">
              AI-generated, ATS-optimized resume based on your profile
            </p>
          </div>

          <button
            onClick={handleGenerateResume}
            disabled={loading}
            className={`
              flex items-center justify-center gap-2 min-w-[180px] px-6 py-3 rounded-lg font-medium
              transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40
              ${
                loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : resumeData
                  ? "bg-white border-2 border-primary text-primary hover:bg-primary/5"
                  : "bg-primary text-white hover:bg-primary/90"
              }
            `}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing…
              </>
            ) : resumeData ? (
              <>
                <RefreshCw className="w-5 h-5" />
                Regenerate
              </>
            ) : (
              "Generate Resume"
            )}
          </button>
        </div>

        {/* ─── Loading / Scanner ─── */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="relative h-96 bg-gray-50 flex items-center justify-center">
              {/* Paper texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
                  `,
                  backgroundSize: "22px 32px",
                }}
              />

              {/* Scanner beam */}
              <div className="absolute inset-x-8 top-0 bottom-0 flex items-center justify-center">
                <div className="w-full max-w-3xl h-1.5 bg-gradient-to-r from-transparent via-primary/70 to-transparent rounded-full shadow-xl shadow-primary/30 animate-scan" />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center px-8 max-w-xl">
                <p className="text-xl font-medium text-black mb-5 transition-opacity duration-300">
                  {scanMessages[messageIndex]}
                </p>

                <div className="h-1.5 w-64 mx-auto bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-[2200ms] ease-linear"
                    style={{ width: `${((messageIndex + 1) / scanMessages.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <style jsx>{`
              @keyframes scan {
                0% {
                  transform: translateY(-150%);
                  opacity: 0.3;
                }
                10% {
                  opacity: 0.9;
                }
                50% {
                  transform: translateY(150%);
                  opacity: 0.9;
                }
                60% {
                  opacity: 0.9;
                }
                95% {
                  opacity: 0.3;
                }
                100% {
                  transform: translateY(-150%);
                  opacity: 0.3;
                }
              }
              .animate-scan {
                animation: scan 5.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              }
            `}</style>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 p-5 bg-red-50 border border-red-200 text-red-800 rounded-xl">
            {error}
          </div>
        )}

        {/* Result / Actions */}
        {resumeData && !loading && (
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleViewResume}
                className="flex items-center gap-2 px-7 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <Eye size={18} /> View Resume
              </button>

              <button
                onClick={handleDownloadResume}
                className="flex items-center gap-2 px-7 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                <Download size={18} /> Download PDF
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Last generated: {resumeData.updatedAt.toLocaleDateString()} • ATS-friendly format
            </p>
          </div>
        )}

        {/* Empty state */}
        {!resumeData && !loading && !error && (
          <div className="mt-12 text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-black mb-3">
              Ready to create your professional resume?
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Our AI will analyze your profile, optimize content for ATS systems, and generate a clean, modern resume in seconds.
            </p>
            <button
              onClick={handleGenerateResume}
              className="px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium shadow-md"
            >
              Generate My Resume
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}