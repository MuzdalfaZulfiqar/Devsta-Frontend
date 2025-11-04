import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import GeneralInfoStep from "../../components/onboarding/GeneralInfoStep";
import ExperienceStep from "../../components/onboarding/ExperienceStep";
import SkillsStep from "../../components/onboarding/SkillsStep";
import ResumeStep from "../../components/onboarding/ResumeStep";
import ReviewStep from "../../components/onboarding/ReviewStep";
import { getOnboarding, saveOnboarding, deleteResume } from "../../api/onboarding";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal";
import { getCurrentUser } from "../../api/user";

const steps = ["General Info", "Experience", "Skills", "Resume", "Review"];

const experienceMap = {
  Internship: "intern",
  "Entry-level": "student",
  Junior: "junior",
  "Mid-level": "mid",
  Senior: "senior",
  Lead: "lead",
  Manager: "lead",
};

const roleMap = {
  "Frontend Developer": "frontend",
  "Backend Developer": "backend",
  "Full-Stack Developer": "fullstack",
  "Data Scientist": "data-science",
  "ML Engineer": "ml",
  "Mobile Developer": "mobile",
  "UI/UX Designer": "ui-ux",
};

export default function Onboarding() {
  const { token, setUser, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: null,
    experienceLevel: "",
    primaryRole: "",
    topSkills: [],
    resume: null,
  });

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const data = await getOnboarding(token);
        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            topSkills: data.topSkills || [],
          }));
        }
      } catch (err) {
        console.log("No onboarding data yet.");
      }

      if (user?.email && !formData.email) {
        setFormData((prev) => ({
          ...prev,
          email: user.email,
        }));
      }
    })();
  }, [token, user?.email]);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (updates) => {
    setFormData((prev) => {
      const normalized = { ...updates };

      if (updates.experienceLevel && experienceMap[updates.experienceLevel]) {
        normalized.experienceLevel = experienceMap[updates.experienceLevel];
      }
      if (updates.primaryRole && roleMap[updates.primaryRole]) {
        normalized.primaryRole = roleMap[updates.primaryRole];
      }
      if (updates.topSkills) {
        normalized.topSkills = updates.topSkills.map((s) => s.toLowerCase());
      }

      return { ...prev, ...normalized };
    });
  };

  const handleDeleteResume = async () => {
    if (!token) return;
    try {
      await deleteResume(token);
      setFormData((prev) => ({ ...prev, resume: null, resumeUrl: "" }));
    } catch (err) {
      alert("Error deleting resume.");
    }
  };

  const handleFinish = async () => {
    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      if (!formData.experienceLevel || !formData.primaryRole) {
        throw new Error("Experience level and primary role are required");
      }
      if (!formData.topSkills?.length) {
        throw new Error("At least one skill is required");
      }
      if (!formData.name) {
        throw new Error("Name is required");
      }

      await saveOnboarding({ ...formData, complete: true }, token);
      const freshUser = await getCurrentUser(token);
      setUser(freshUser);
      setShowSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      alert(`Error saving onboarding: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <GeneralInfoStep formData={formData} setFormData={handleChange} nextStep={handleNext} />;
      case 1:
        return <ExperienceStep formData={formData} setFormData={handleChange} nextStep={handleNext} prevStep={handleBack} />;
      case 2:
        return <SkillsStep formData={formData} setFormData={handleChange} nextStep={handleNext} prevStep={handleBack} />;
      case 3:
        return <ResumeStep formData={formData} setFormData={handleChange} nextStep={handleNext} prevStep={handleBack} onDeleteResume={handleDeleteResume} />;
      case 4:
        return <ReviewStep data={formData} onBack={handleBack} onComplete={handleFinish} loading={loading} />;
      default:
        return null;
    }
  };

  // ✅ Progress percentage
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-700">
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
            Step {currentStep + 1}: {steps[currentStep]}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-10 overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-primary to-teal-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="transition-opacity duration-500">
          {renderStep()}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
          Note: Fields marked with <span className="text-red-500">*</span> are required.
        </p>

        <SuccessModal
          open={showSuccess}
          message="Onboarding completed successfully!"
          onClose={() => {
            setShowSuccess(false);
            navigate("/dashboard");
          }}
        />
      </div>
    </div>
  );
}
