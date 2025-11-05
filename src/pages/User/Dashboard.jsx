
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import GithubConnectModal from "../../components/dashboard/GithubConnectModal";
import ResumeUploadModal from "../../components/dashboard/ResumeUploadModal";
import DashboardCard from "../../components/dashboard/DashboardCard";
import InfoModal from "../../components/InfoModal";
import GitHub from "../../components/profile/tabs/GitHub";
import { uploadResume } from "../../api/onboarding";

export default function Dashboard() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Info modal states
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState(""); // added
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (user && !user.onboardingCompleted) navigate("/welcome");

    if (user && !user.githubConnected) {
      addNotification({
        id: "github-not-connected",
        message: "Your GitHub is not connected. Connect it to unlock full DevSta features.",
        action: { label: "Connect", onClick: () => setShowGithubModal(true) },
      });
    }
  }, [user, navigate, addNotification]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-fragment transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Loading your dashboard, please wait...</p>
        </div>
      </div>
    );
  }

  const handleResumeUpload = async (file) => {
    try {
      const response = await uploadResume(file, token);
      setUser((prev) => ({ ...prev, resumeUrl: response.resumeUrl }));
      setShowResumeModal(false);

      // set modal with title + message
      setInfoTitle("Resume Uploaded");
      setInfoMessage("Your resume has been uploaded successfully!");
      setInfoOpen(true);
    } catch (err) {
      setInfoTitle("Upload Failed");
      setInfoMessage(err.message || "Failed to upload resume");
      setInfoOpen(true);
    }
  };

  // To-Do / Action cards
  const todoCards = [
    !user.githubConnected && {
      title: "Connect GitHub",
      description: "Link your GitHub to showcase your repositories and stats on DevSta.",
      actionLabel: "Connect GitHub",
      onAction: () => setShowGithubModal(true),
    },
    !user.resumeUrl && {
      title: "Upload Resume",
      description: "Upload your resume to apply for jobs and collaborations seamlessly.",
      actionLabel: "Upload Resume",
      onAction: () => setShowResumeModal(true),
    },
    !user.hasAttemptedQuiz && {
      title: "DevSta Skill Test",
      description: "Evaluate your technical proficiency and get your DevSta Score.",
      actionLabel: "Start Test",
      onAction: () => navigate("/skill-test"),
    },
  ].filter(Boolean);

  // Completed / Achievements cards
  const completedCards = [
    user.githubConnected && {
      title: "GitHub Connected",
      description: "Your GitHub account is linked successfully.",
      actionLabel: "View GitHub",
      onAction: () => navigate("/profile/github"),
      completed: true,
    },
    user.resumeUrl && {
      title: "Resume Uploaded",
      description: "Your resume is uploaded and ready for applications.",
      actionLabel: "View Resume in Profile",
      onAction: () => navigate("/dashboard/profile"),
      completed: true,
    },
    user.hasAttemptedQuiz && {
      title: "Skill Test Completed",
      description: `You’ve completed the DevSta Skill Test! Score: ${user.latestQuizScore} / ${user.latestQuizOutOf}`,
      actionLabel: "View Result",
      onAction: () => {
        setInfoTitle("Skill Test Result");
        setInfoMessage(`You’ve completed the DevSta Skill Test!\nScore: ${user.latestQuizScore} / ${user.latestQuizOutOf}`);
        setInfoOpen(true);
      },
      completed: true,
    },
  ].filter(Boolean);

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-8 w-full">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back, {user.name || "User"}!
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-base mt-1">
            Here's an overview of your DevSta dashboard. Complete your actions or view your achievements.
          </p>
        </div>

        {/* To-Do / Actions Section */}
        {todoCards.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Next Steps for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {todoCards.map((card) => (
                <DashboardCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        )}

        {/* Completed / Achievements Section */}
        {completedCards.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCards.map((card) => (
                <DashboardCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        )}

        {/* GitHub Stats Section */}
        {user.githubConnected && (
          <div className="mt-8">
            <GitHub user={user} />
          </div>
        )}
      </div>

      {/* Info Modal */}
      <InfoModal
        open={infoOpen}
        title={infoTitle}
        message={infoMessage}
        onClose={() => setInfoOpen(false)}
      />

      {/* GitHub Connect Modal */}
      {showGithubModal && !user.githubConnected && (
        <GithubConnectModal open={showGithubModal} onClose={() => setShowGithubModal(false)} />
      )}

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <ResumeUploadModal open={showResumeModal} onClose={() => setShowResumeModal(false)} onUpload={handleResumeUpload} />
      )}
    </DashboardLayout>
  );
}
