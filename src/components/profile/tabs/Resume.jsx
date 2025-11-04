import { useState } from "react";
import ResumeUploadModal from "../../../components/dashboard/ResumeUploadModal";
import { uploadResume } from "../../../api/onboarding";
import { useAuth } from "../../../context/AuthContext";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModal from "../../../components/ErrorModal";
import { BACKEND_URL } from "../../../../config";
import { Eye, Download, Upload } from "lucide-react";

export default function Resume({ user, editable = false }) {
  const { token, setUser } = useAuth();

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleResumeUpload = async (file) => {
    try {
      const response = await uploadResume(file, token);
      setUser((prev) => ({ ...prev, resumeUrl: response.resumeUrl }));
      setShowResumeModal(false);
      setModalMessage("Your resume has been updated successfully!");
      setSuccessOpen(true);
    } catch (err) {
      setModalMessage(err.message || "Failed to upload resume");
      setErrorOpen(true);
    }
  };

  const handleViewResume = () => {
    const previewUrl = `${BACKEND_URL}/api/users/resume/${user._id}`;
    window.open(previewUrl, "_blank");
  };

  const handleDownloadResume = () => {
    const downloadUrl = `${BACKEND_URL}/api/users/resume/${user._id}`;
    fetch(downloadUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "resume.pdf";
        link.click();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume</h2>

      {user.resumeUrl ? (
        <div className="flex flex-wrap items-center gap-4">
          {/* View button */}
          <button
            onClick={handleViewResume}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition text-sm font-medium"
          >
            <Eye className="w-4 h-4" /> View Resume
          </button>

          {/* Download button */}
          <button
            onClick={handleDownloadResume}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Download
          </button>

          {/* Replace button → only for editable mode */}
          {editable && (
            <button
              onClick={() => setShowResumeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition text-sm font-medium"
            >
              <Upload className="w-4 h-4" /> Replace Resume
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            No resume uploaded yet
          </span>

          {/* Upload button for overview and edit */}
          <button
            onClick={() => setShowResumeModal(true)}
            className={`inline-flex w-fit items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${editable ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700" : "bg-primary text-white hover:bg-primary/80"
              }`}
          >
            <Upload className="w-4 h-4" /> Upload Resume
          </button>
        </div>
      )}

      {/* Modals */}
      <SuccessModal
        open={successOpen}
        message={modalMessage}
        onClose={() => setSuccessOpen(false)}
      />
      <ErrorModal
        open={errorOpen}
        message={modalMessage}
        onClose={() => setErrorOpen(false)}
      />

      {showResumeModal && (
        <ResumeUploadModal
          open={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          onUpload={handleResumeUpload}
        />
      )}
    </div>
  );
}
