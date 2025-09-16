import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import GeneralInfoStep from "../../components/onboarding/GeneralInfoStep";
import ExperienceStep from "../../components/onboarding/ExperienceStep";
import SkillsStep from "../../components/onboarding/SkillsStep";
import ResumeStep from "../../components/onboarding/ResumeStep";
import GithubStep from "../../components/onboarding/GithubStep";
import ReviewStep from "../../components/onboarding/ReviewStep";
import { getOnboarding, saveOnboarding, deleteResume } from "../../api/onboarding";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal";
import { getCurrentUser } from "../../api/user"; 
const steps = ["General Info", "Experience", "Skills", "Resume", "GitHub", "Review"];

// Maps to match backend enums
const experienceMap = {
  "Internship": "intern",
  "Entry-level": "student",
  "Junior": "junior",
  "Mid-level": "mid",
  "Senior": "senior",
  "Lead": "lead",
  "Manager": "lead",
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
  const navigate = useNavigate(); // <-- add this
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experienceLevel: "",
    primaryRole: "",
    topSkills: [],
    resume: null,
    githubUrl: "",
    githubConnected: false,
  });

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const data = await getOnboarding(token);
        if (data) {
          setFormData(prev => ({
            ...prev,
            ...data,
            topSkills: data.topSkills || [],
            githubConnected: !!data.githubUrl,
          }));
        }
      } catch (err) {
        console.log("No onboarding data yet.");
      }
    })();
  }, [token]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Normalize values before saving
 const handleChange = (updates) => {
  setFormData(prev => {
    const normalized = { ...updates };

    // Only normalize if user sent display labels
    if (updates.experienceLevel && experienceMap[updates.experienceLevel]) {
      normalized.experienceLevel = experienceMap[updates.experienceLevel];
    }
    if (updates.primaryRole && roleMap[updates.primaryRole]) {
      normalized.primaryRole = roleMap[updates.primaryRole];
    }
    if (updates.topSkills) {
      normalized.topSkills = updates.topSkills.map(s => s.toLowerCase());
    }

    return { ...prev, ...normalized };
  });
};


  const handleDeleteResume = async () => {
    if (!token) return;
    try {
      await deleteResume(token);
      setFormData(prev => ({ ...prev, resume: null, resumeUrl: "" }));
    } catch (err) {
      alert("Error deleting resume.");
    }
  };

  // const handleFinish = async () => {
  //   if (!token) return;
  //   setLoading(true);
  //   try {
  //     // Create FormData if resume exists
  //     const payload = new FormData();
  //     Object.keys(formData).forEach(key => {
  //       if (key === "resume" && formData.resume instanceof File) {
  //         payload.append("resume", formData.resume);
  //       } else if (Array.isArray(formData[key])) {
  //         formData[key].forEach(item => payload.append(key, item));
  //       } else if (formData[key] !== undefined && formData[key] !== null) {
  //         payload.append(key, formData[key]);
  //       }
  //     });
  //     payload.append("complete", true);

  //     await saveOnboarding(payload, token);
  //     alert("Onboarding completed successfully!");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     alert(err.message || "Error saving onboarding.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// const handleFinish = async () => {
//   if (!token) return;
//   setLoading(true);
//   try {
//     // just send plain object, helper builds FormData for us
//     await saveOnboarding({ ...formData, complete: true }, token);

//     setShowSuccess(true);
//   } catch (err) {
//     alert(err.message || "Error saving onboarding.");
//   } finally {
//     setLoading(false);
//   }
// };
// const handleFinish = async () => {
//   if (!token) return;
//   setLoading(true);
//   try {
//     await saveOnboarding(formData, token);

//     // ✅ refresh global user
//     const freshUser = await getCurrentUser(token);
//     setUser(freshUser);

//     setShowSuccess(true);
//     setTimeout(() => navigate("/dashboard"), 1500);
//   } catch (err) {
//     console.error(err);
//     alert("Error saving onboarding");
//   } finally {
//     setLoading(false);
//   }
// };

const handleFinish = async () => {
  if (!token) return;
  setLoading(true);
  try {
    await saveOnboarding({ ...formData, complete: true }, token);

    // refresh user
    const freshUser = await getCurrentUser(token);
    setUser(freshUser);

    setShowSuccess(true);
    setTimeout(() => navigate("/dashboard"), 1500);
  } catch (err) {
    console.error(err);
    alert("Error saving onboarding");
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  if (user?.onboardingCompleted) {
    navigate("/dashboard"); // redirect if they already finished
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
        return <GithubStep formData={formData} setFormData={handleChange} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <ReviewStep data={formData} onBack={handleBack} onComplete={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Step {currentStep + 1}: {steps[currentStep]}
      </h2>
      <div className="mb-8">{renderStep()}</div>

            <SuccessModal
        open={showSuccess}
        message="Onboarding completed successfully!"
        onClose={() => {
          setShowSuccess(false);
          navigate("/dashboard"); // <-- redirect after closing modal
        }}
      />

    </div>
  );
}
