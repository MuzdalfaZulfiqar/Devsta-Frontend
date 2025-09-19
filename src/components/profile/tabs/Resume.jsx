import { useState } from "react";
import ResumeUploadModal from "../../../components/dashboard/ResumeUploadModal";
import { uploadResume } from "../../../api/onboarding";
import { useAuth } from "../../../context/AuthContext";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModal from "../../../components/ErrorModal";

export default function Resume({ user }) {
  const { token, setUser } = useAuth();

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ✅ Handle resume upload
  const handleResumeUpload = async (file) => {
    try {
      const response = await uploadResume(file, token);

      // Update user state
      setUser((prev) => ({
        ...prev,
        resumeUrl: response.resumeUrl,
      }));

      setShowResumeModal(false);

      setModalMessage("Your resume has been uploaded successfully!");
      setSuccessOpen(true);
    } catch (err) {
      setModalMessage(err.message || "Failed to upload resume");
      setErrorOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-lg font-semibold text-white">Resume</h2>

      {user.resumeUrl ? (
        <a
          href={user.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-black border border-primary rounded-lg p-4 hover:border-white/40 transition"
        >
          <p className="text-white font-medium">View Resume</p>
        </a>
      ) : (
        <div className="bg-black border border-white/20 p-4 rounded-lg text-gray-400 flex flex-col gap-3">
          <p>No resume uploaded</p>
          <button
            onClick={() => setShowResumeModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            Upload Resume
          </button>
        </div>
      )}

      {/* ✅ Modals */}
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
