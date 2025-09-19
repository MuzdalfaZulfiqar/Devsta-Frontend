import { useEffect, useState } from "react";
import Select from "react-select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BACKEND_URL } from "../../../config";   // adjust path if needed

export default function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/skills`);
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        setSkillsOptions(data.map(s => ({ value: s.key, label: s.label })));
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };
    fetchSkills();
  }, []);

  const hasSkills = Array.isArray(formData.topSkills) && formData.topSkills.length > 0;

  const handleNext = () => {
    if (!hasSkills) {
      setTouched(true); // show error
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Skills</h2>
      <p className="text-sm text-gray-400">
        Select your top skills to showcase your expertise.
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">
          Top Skills (choose at least one) <span className="text-red-500">*</span>
        </label>
        <Select
          isMulti
          value={skillsOptions.filter(o => formData.topSkills.includes(o.value))}
          onChange={(selected) =>
            setFormData({ topSkills: selected.map(s => s.value) })
          }
          onBlur={() => setTouched(true)}
          options={skillsOptions}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              borderColor: "#fff",
              color: "#fff",
              boxShadow: "none",
              minHeight: "40px",
              "&:hover": { borderColor: "#fff" },
            }),
            menu: (base) => ({ ...base, backgroundColor: "#086972", color: "#fff" }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#ffffff33" : "#086972",
              color: "#fff",
              ":hover": { backgroundColor: "#ffffff55" },
            }),
            multiValue: (base) => ({ ...base, backgroundColor: "#ffffff33", color: "#fff" }),
            multiValueLabel: (base) => ({ ...base, color: "#fff" }),
            singleValue: (base) => ({ ...base, color: "#fff" }),
          }}
        />
        {!hasSkills && touched && (
          <p className="text-red-500 text-xs mt-1">
            Please select at least one skill.
          </p>
        )}
      </div>

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
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
