import Select from "react-select";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const canNext = Boolean(formData.experienceLevel) && Boolean(formData.primaryRole);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Step 2: Experience & Role</h2>
      <p className="text-sm text-gray-400">Select your experience level and primary role.</p>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium mb-1">Experience Level</label>
        <Select
          options={experienceOptions}
          value={experienceOptions.find(opt => opt.value === formData.experienceLevel) || null}
          onChange={(selected) => setFormData({ ...formData, experienceLevel: selected?.value || "" })}
          placeholder="Select your level"
          styles={{
            control: (base) => ({ ...base, backgroundColor: "transparent", borderColor: "#fff", color: "#fff", boxShadow: "none", "&:hover": { borderColor: "#fff" } }),
            menu: (base) => ({ ...base, backgroundColor: "#086972", color: "#fff" }),
            option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#ffffff33" : "#086972", color: "#fff", ":hover": { backgroundColor: "#ffffff55" } }),
            singleValue: (base) => ({ ...base, color: "#fff" }),
          }}
        />
      </div>

      {/* Primary Role */}
      <div>
        <label className="block text-sm font-medium mb-1">Primary Role</label>
        <Select
          options={roleOptions}
          value={roleOptions.find(opt => opt.value === formData.primaryRole) || null}
          onChange={(selected) => setFormData({ ...formData, primaryRole: selected?.value || "" })}
          placeholder="Select your role"
          styles={{
            control: (base) => ({ ...base, backgroundColor: "transparent", borderColor: "#fff", color: "#fff", boxShadow: "none", "&:hover": { borderColor: "#fff" } }),
            menu: (base) => ({ ...base, backgroundColor: "#086972", color: "#fff" }),
            option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#ffffff33" : "#086972", color: "#fff", ":hover": { backgroundColor: "#ffffff55" } }),
            singleValue: (base) => ({ ...base, color: "#fff" }),
          }}
        />
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
          disabled={!canNext}
          aria-disabled={!canNext}
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
