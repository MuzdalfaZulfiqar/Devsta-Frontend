import Select from "react-select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

const experienceOptions = [
  { value: "intern", label: "Internship" },
  { value: "student", label: "Entry-level" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const roleOptions = [
  { value: "frontend", label: "Frontend Developer" },
  { value: "backend", label: "Backend Developer" },
  { value: "fullstack", label: "Full-Stack Developer" },
  { value: "data-science", label: "Data Scientist" },
  { value: "ml", label: "ML Engineer" },
  { value: "mobile", label: "Mobile Developer" },
  { value: "ui-ux", label: "UI/UX Designer" },
];

export default function ExperienceStep({ formData, setFormData, nextStep, prevStep }) {
  const [touched, setTouched] = useState({});

  const hasExperience = Boolean(formData.experienceLevel);
  const hasRole = Boolean(formData.primaryRole);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = () => {
    // mark both as touched so errors show if empty
    setTouched({ experienceLevel: true, primaryRole: true });

    if (hasExperience && hasRole) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Step 2: Experience & Role</h2>
      <p className="text-sm text-gray-400">
        Select your experience level and primary role.
      </p>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Experience Level <span className="text-red-500">*</span>
        </label>
        <Select
          options={experienceOptions}
          value={experienceOptions.find(
            (opt) => opt.value === formData.experienceLevel
          ) || null}
          onChange={(selected) =>
            setFormData({ ...formData, experienceLevel: selected?.value || "" })
          }
          onBlur={() => handleBlur("experienceLevel")}
          placeholder="Select your level"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              borderColor: "#fff",
              color: "#fff",
              boxShadow: "none",
              "&:hover": { borderColor: "#fff" },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#086972",
              color: "#fff",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#ffffff33" : "#086972",
              color: "#fff",
              ":hover": { backgroundColor: "#ffffff55" },
            }),
            singleValue: (base) => ({ ...base, color: "#fff" }),
          }}
        />
        {!hasExperience && touched.experienceLevel && (
          <p className="text-red-500 text-xs mt-1">
            Experience level is required.
          </p>
        )}
      </div>

      {/* Primary Role */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Primary Role <span className="text-red-500">*</span>
        </label>
        <Select
          options={roleOptions}
          value={roleOptions.find(
            (opt) => opt.value === formData.primaryRole
          ) || null}
          onChange={(selected) =>
            setFormData({ ...formData, primaryRole: selected?.value || "" })
          }
          onBlur={() => handleBlur("primaryRole")}
          placeholder="Select your role"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              borderColor: "#fff",
              color: "#fff",
              boxShadow: "none",
              "&:hover": { borderColor: "#fff" },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#086972",
              color: "#fff",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#ffffff33" : "#086972",
              color: "#fff",
              ":hover": { backgroundColor: "#ffffff55" },
            }),
            singleValue: (base) => ({ ...base, color: "#fff" }),
          }}
        />
        {!hasRole && touched.primaryRole && (
          <p className="text-red-500 text-xs mt-1">Primary role is required.</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 rounded transition bg-primary text-white hover:opacity-90"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
