import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import GithubConnectModal from "../../components/dashboard/GithubConnectModal";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ResumeUploadModal from "../../components/dashboard/ResumeUploadModal";
import { uploadResume } from "../../api/onboarding"; 
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

export default function Dashboard() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      navigate("/welcome");
    }

    if (user && !user.githubConnected) {
      addNotification({
        id: "github-not-connected",
        message:
          "Your GitHub is not connected. Connect it to unlock full DevSta features.",
        action: {
          label: "Connect",
          onClick: () => setShowGithubModal(true),
        },
      });
    }
  }, [user, navigate, addNotification]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white font-fragment">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300 text-lg">
            Loading your dashboard, please wait...
          </p>
        </div>
      </div>
    );
  }

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

      // Show success modal
      setModalMessage("Your resume has been uploaded successfully!");
      setSuccessOpen(true);
    } catch (err) {
      // Show error modal
      setModalMessage(err.message || "Failed to upload resume");
      setErrorOpen(true);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-8 w-full">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome Back, {user.name || "User"}!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Here is an overview of your DevSta dashboard. Access your projects,
            tasks, and resources from here.
          </p>
        </div>

        {/* Action Cards Section */}
        <div className="flex flex-col gap-4">
          {!user.githubConnected && (
            <DashboardCard
              title="Connect GitHub"
              description="Link your GitHub to showcase your repositories and stats on DevSta."
              actionLabel="Connect GitHub"
              onAction={() => setShowGithubModal(true)}
            />
          )}

          {!user.resumeUrl && (
            <DashboardCard
              title="Upload Resume"
              description="Upload your resume to apply for jobs and collaborations seamlessly."
              actionLabel="Upload Resume"
              onAction={() => setShowResumeModal(true)}
            />
          )}
        </div>
      </div>

      {/* ✅ Success & Error Modals */}
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

      {/* GitHub Connect Modal */}
      {showGithubModal && !user.githubConnected && (
        <GithubConnectModal
          open={showGithubModal}
          onClose={() => setShowGithubModal(false)}
        />
      )}

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <ResumeUploadModal
          open={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          onUpload={handleResumeUpload}
        />
      )}
    </DashboardLayout>
  );
}
