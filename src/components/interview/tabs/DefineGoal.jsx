// src/components/interview/tabs/DefineGoal.jsx
import { useState } from "react";
import { generateRoadmap, getGapAnalysis  } from "../../../api/roadmap";

const LOADING_STEPS = [
  "Analyzing your skill profile...",
  "Identifying skill gaps for your target role...",
  "Generating your personalized roadmap with AI...",
  "Finalizing phases and resources...",
];

export default function DefineGoal({ onRoadmapGenerated }) {
  const [form, setForm] = useState({ role: "", company: "", experience: "" });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  const isValid = form.role.trim() && form.experience;

  // const handleSubmit = async () => {
  //   if (!isValid || loading) return;
  //   setError(null);
  //   setLoading(true);
  //   setLoadingStep(0);

  //   const interval = setInterval(() => {
  //     setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
  //   }, 2500);

  //   try {
  //     const data = await generateRoadmap({
  //       role: form.role.trim(),
  //       company: form.company.trim(),
  //       experience: form.experience,
  //     });
  //     clearInterval(interval);
  //     onRoadmapGenerated(data);
  //   } catch (err) {
  //     clearInterval(interval);
  //     setError(err.message || "Failed to generate roadmap. Please try again.");
  //   } finally {
  //     setLoading(false);
  //     setLoadingStep(0);
  //   }
  // };

 const handleSubmit = async () => {
  if (!isValid || loading) return;

  setError(null);
  setLoading(true);
  setLoadingStep(0);

  try {
    // 🔥 STEP 1: GET GAP FIRST (FAST)
    const gapData = await getGapAnalysis({
      role: form.role.trim(),
      company: form.company.trim(),
      experience: form.experience,
    });

    // 👇 SHOW GAP IMMEDIATELY
    onRoadmapGenerated({
      role: form.role,
      company: form.company,
      experience: form.experience,
      gapAnalysis: gapData.gap_analysis,
      roadmap: null, // not ready yet
      loadingRoadmap: true,
    });

    // 🔥 STEP 2: GENERATE ROADMAP (SLOW)
    setLoadingStep(2);
const roadmapData = await generateRoadmap({
  role: form.role.trim(),
  company: form.company.trim(),
  experience: form.experience,
  gap: gapData.gap_analysis,
  job_skills: gapData.job_skills
});

    // 👇 UPDATE WITH FULL DATA
    onRoadmapGenerated({
      ...roadmapData,
      loadingRoadmap: false,
    });

  } catch (err) {
    setError(err.message || "Failed to generate roadmap.");
  } finally {
    setLoading(false);
    setLoadingStep(0);
  }
};
  if (loading) {
    return (
      <div className="max-w-2xl flex flex-col items-center gap-6 py-16">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
          />
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 animate-pulse">
            {LOADING_STEPS[loadingStep]}
          </p>
          <div className="flex gap-1.5 justify-center mt-4">
            {LOADING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= loadingStep
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            AI is working — this usually takes 15–30 seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-gray-600 dark:text-gray-400">
        Define your target role and let AI generate a personalized interview
        roadmap based on your skills.
      </p>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Target Role (e.g., Frontend Developer)"
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      />

      <input
        type="text"
        placeholder="Target Company (Optional)"
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />

      <select
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        value={form.experience}
        onChange={(e) => setForm({ ...form, experience: e.target.value })}
      >
        <option value="">Select Experience Level</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid</option>
        <option value="senior">Senior</option>
      </select>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-blue-700 dark:text-blue-300">
        AI will automatically analyze your profile skills and generate a
        personalized roadmap.
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className={`px-6 py-2.5 rounded-md font-semibold transition ${
          isValid
            ? "bg-primary text-white hover:opacity-90"
            : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
        }`}
      >
        Generate Roadmap
      </button>
    </div>
  );
}