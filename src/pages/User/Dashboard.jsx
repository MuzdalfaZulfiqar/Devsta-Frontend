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
import { BACKEND_URL } from "../../../config";
import ValidatedSkills from "../../components/dashboard/ValidatedSkills";
import AnnouncementCard from "../../components/admin/AnnouncementCard";

export default function Dashboard() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [isValidating, setIsValidating] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  // Fetch live announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setAnnouncements(data);

          // Push to notifications
          data.forEach((ann) => {
            addNotification({
  id: `announcement-${ann._id}`,
  title: ann.title,
  message: ann.message,
  category: ann.category,
  type: "announcement",
  icon: "megaphone",
});

          });
        }
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };

    fetchAnnouncements();
  }, [token, addNotification]);

  useEffect(() => {
    if (user && !user.onboardingCompleted) navigate("/welcome");

    if (user && !user.githubConnected) {
      addNotification({
        id: "github-not-connected",
        message:
          "Your GitHub is not connected. Connect it to unlock full DevSta features.",
        action: { label: "Connect", onClick: () => setShowGithubModal(true) },
      });
    }
  }, [user, navigate, addNotification]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-fragment transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Loading your dashboard, please wait...
          </p>
        </div>
      </div>
    );
  }

  // Resume Upload Handler
  const handleResumeUpload = async (file) => {
    try {
      const response = await uploadResume(file, token);
      setUser((prev) => ({ ...prev, resumeUrl: response.resumeUrl }));
      setShowResumeModal(false);

      setInfoTitle("Resume Uploaded");
      setInfoMessage("Your resume has been uploaded successfully!");
      setInfoOpen(true);
    } catch (err) {
      setInfoTitle("Upload Failed");
      setInfoMessage(err.message || "Failed to upload resume");
      setInfoOpen(true);
    }
  };

  // Skill Validation Handler
  const validateSkills = async () => {

    const sourcesCount =
      (user.topSkills?.length > 0 ? 1 : 0) +
      (user.githubConnected ? 1 : 0) +
      (user.resumeUrl ? 1 : 0) +
      (user.hasAttemptedQuiz ? 1 : 0);

    if (sourcesCount < 2) {
      setInfoTitle("Add More Sources");
      setInfoMessage(
        "Please connect at least one more data source (e.g., Resume, GitHub, or Skill Test) before running skill validation. This helps ensure your DevSta profile score is accurate."
      );

      setInfoOpen(true);
      return; // ⛔ stop here
    }
    try {
      setIsValidating(true);
      const response = await fetch(
        `${BACKEND_URL}/api/users/profile/validate-skills`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Skill validation failed");

      let nextStep = "";
      if (user.resumeUrl && !user.githubConnected)
        nextStep =
          "You’ve uploaded your resume — connect your GitHub to improve your score accuracy.";
      else if (!user.resumeUrl && user.githubConnected)
        nextStep =
          "You’ve connected GitHub — upload your resume to improve your score accuracy.";
      else if (!user.resumeUrl && !user.githubConnected)
        nextStep =
          "Upload your resume and connect your GitHub to get a more complete score.";

      setInfoTitle("Skills Validated");
      setInfoMessage(
        `Your DevSta profile score has been generated successfully!\n\n${nextStep}`
      );
      setInfoOpen(true);

      setUser((prev) => ({
        ...prev,
        topSkills: data.skills || prev.topSkills,
        validatedSkills: data.validated_skills,
        profileScore: data.profile_score,
        skillsValidated: true,
      }));
    } catch (err) {
      setInfoTitle("Validation Failed");
      setInfoMessage(err.message || "Failed to validate skills");
      setInfoOpen(true);
    } finally {
      setIsValidating(false);
    }
  };

  // Count available sources for Validate Skills card
  // Count available sources for Validate Skills card
  const sourcesAvailable = [
    user?.topSkills?.length > 0,
    user?.githubConnected,
    !!user?.resumeUrl,
    user.hasAttemptedQuiz,
  ];
  const allSourcesAvailable = sourcesAvailable.every(Boolean);

  // Scroll helper for "View Results"
  const scrollToSkillsCard = () => {
    const element = document.getElementById("validated-skills-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setInfoTitle("View Your Skills");
      setInfoMessage("Here’s your validated skills and confidence scores.");
      setInfoOpen(true);
    }
  };

  // Dynamic Validate Skills card
  const validateSkillsCard = user.skillsValidated
    ? {
      title: "View Your Validated Skills",
      description:
        "Your skills have been validated. Click below to view your confidence scores and profile ranking.",
      actionLabel: "View Results",
      onAction: scrollToSkillsCard,
    }
    : {
      title: "Validate Skills",
      description:
        "Analyze your data (Resume, GitHub, or Skill Test) to generate your DevSta profile score.",
      actionLabel: isValidating ? "Validating..." : "Validate Skills",
      onAction: validateSkills,
      isValidating,
    };

  // To-Do / Action cards
  const todoCards = [
    !user.githubConnected && {
      title: "Connect GitHub",
      description:
        "Link your GitHub to showcase your repositories and stats on DevSta.",
      actionLabel: "Connect GitHub",
      onAction: () => setShowGithubModal(true),
    },
    !user.resumeUrl && {
      title: "Upload Resume",
      description:
        "Upload your resume to apply for jobs and collaborations seamlessly.",
      actionLabel: "Upload Resume",
      onAction: () => setShowResumeModal(true),
    },
    !user.hasAttemptedQuiz && {
      title: "DevSta Skill Test",
      description:
        "Evaluate your technical proficiency and get your DevSta Score.",
      actionLabel: "Start Test",
      onAction: () => navigate("/skill-test"),
    },
    // Only show Validate Skills card if at least one source is missing
    validateSkillsCard,
  ].filter(Boolean);

  // Completed / Achievements cards
  const completedCards = [
    user.githubConnected && {
      title: "GitHub Connected",
      description: "Your GitHub account is linked successfully.",
      actionLabel: "View GitHub",
      onAction: () => navigate("/dashboard/profile"),
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
        setInfoMessage(
          `You’ve completed the DevSta Skill Test!\nScore: ${user.latestQuizScore} / ${user.latestQuizOutOf}`
        );
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
            Here's an overview of your DevSta dashboard. Complete your actions or
            view your achievements.
          </p>
        </div>

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Announcements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((ann) => (
                <AnnouncementCard
  key={ann._id}
  title={ann.title}
  message={ann.message}
  category={ann.category}
  createdAt={ann.createdAt}
/>

              ))}
            </div>
          </div>
        )}


        {/* To-Do / Actions Section */}
        {todoCards.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Next Steps for You
            </h2>
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
            <h2 className="text-lg font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
              Achievements
            </h2>
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

        {/* Validated Skills Section */}
        {(user.skillsValidated || allSourcesAvailable) && (
          <div id="validated-skills-section" className="mt-8">
            <ValidatedSkills
              validatedSkills={user.validatedSkills}
              profileScore={user.profileScore}
              user={user}
              onValidate={validateSkills} // actual rerun function
              isValidating={isValidating} // show spinner
            />
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
