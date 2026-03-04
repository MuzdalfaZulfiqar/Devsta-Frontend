// src/pages/ResumePage.jsx
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_URL } from "../../../config";
import { Eye, Download, CheckCircle, Pencil, Sparkles } from "lucide-react";
import { fetchResumePdf } from "../../api/resume";
import ResumeTemplateModal from "../../components/ResumeTemplateModal";
import ResumeEditModal from "../../components/ResumeEditModal";

export default function ResumePage() {
  const { user, token } = useAuth();

  const [resumeData, setResumeData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const refreshStatus = useCallback(async () => {
    if (!user?._id || !token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/resume/status/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data?.exists) {
        setResumeData({
          resumePdfUrl: data.resumePdfUrl,
          template: data.template,
          updatedAt: data.lastUpdated,
        });
      } else {
        setResumeData(null);
      }
    } catch {
      setResumeData(null);
    }
  }, [user?._id, token]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleViewResume = async () => {
    try {
      const blob = await fetchResumePdf(user._id, token);
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000);
    } catch (e) {
      console.error(e);
      alert("Failed to open resume. Please log in again.");
    }
  };

  const handleDownloadResume = async () => {
    try {
      const blob = await fetchResumePdf(user._id, token);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Resume_${user?.name || "Professional"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to download resume. Please log in again.");
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const onGeneratedOrExported = async (msg) => {
    await refreshStatus();
    showSuccess(msg);
  };

  const onEdited = async () => {
    await refreshStatus();
    showSuccess("Resume updated successfully!");
  };

  const hasResume = !!resumeData?.resumePdfUrl;

  return (
    <DashboardLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Professional Resume</h1>

          {/* ✅ State A: First time => only Generate */}
          {!hasResume ? (
            <button
              onClick={() => setIsGenerateOpen(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Resume
            </button>
          ) : (
            /* ✅ State B: Resume exists => Edit + Export */
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-5 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Pencil className="w-5 h-5" />
                Edit
              </button>
              <button
                onClick={() => setIsExportOpen(true)}
                className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate / Export
              </button>
            </div>
          )}
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-sm">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Actions if exists */}
        {hasResume && (
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleViewResume}
              className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" /> View Resume
            </button>
            <button
              onClick={handleDownloadResume}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> Download PDF
            </button>
          </div>
        )}

        {/* ✅ Template Modal: First-time Generate */}
        {isGenerateOpen && (
          <ResumeTemplateModal
            isOpen={isGenerateOpen}
            onClose={() => setIsGenerateOpen(false)}
            mode="generate"
            onSuccess={() => onGeneratedOrExported("Resume generated successfully!")}
          />
        )}

        {/* ✅ Template Modal: Export after exists (NO AI) */}
        {isExportOpen && (
          <ResumeTemplateModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            mode="export"
            onSuccess={() => onGeneratedOrExported("Resume exported successfully!")}
          />
        )}

        {/* ✅ Edit Modal: only after exists */}
        {isEditOpen && hasResume && (
          <ResumeEditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSuccess={onEdited}
          />
        )}
      </div>
    </DashboardLayout>
  );
}