import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { BACKEND_URL } from "../../../config";

export default function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [touched, setTouched] = useState(false);

  // state for "Other"
  const [showOther, setShowOther] = useState(false);
  const [customSkillText, setCustomSkillText] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/skills`);
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();

        // Map to react-select options
        const base = data.map((s) => ({ value: s.key, label: s.label }));

        // Also include already-added custom ones (so they render in chips after reload)
        const existingCustomKeys = (formData.topSkills || []).filter((k) => k.startsWith("custom:"));
        const customAsOptions = existingCustomKeys.map((k) => ({
          value: k,
          label: labelFromCustomKey(k),
        }));

        setSkillsOptions(uniqueByValue([...base, ...customAsOptions]));
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };
    fetchSkills();
  }, []);

  const selectedOptions = useMemo(() => {
    const keys = Array.isArray(formData.topSkills) ? formData.topSkills : [];
    return skillsOptions.filter((o) => keys.includes(o.value));
  }, [skillsOptions, formData.topSkills]);

  const hasSkills = selectedOptions.length > 0;

  // when select changes
  const handleChange = (selected) => {
    const values = (selected || []).map((s) => s.value);
    setFormData({ topSkills: values });

    // toggle "Other" input
    setShowOther(values.includes("other"));
  };

  const handleAddCustom = async (e) => {
    e?.preventDefault();
    const label = customSkillText.trim();
    if (!label) return;

    // Generate a stable custom key: custom:slug
    const key = "custom:" + slugify(label);

    // Avoid duplicates
    const alreadyInForm = (formData.topSkills || []).includes(key);
    const alreadyInOptions = skillsOptions.some((o) => o.value === key);
    if (alreadyInForm || alreadyInOptions) {
      setCustomSkillText("");
      return;
    }

    setAdding(true);
    try {
      // Add to options for chip rendering
      const newOption = { value: key, label };
      setSkillsOptions((opts) => uniqueByValue([...opts, newOption]));

      // Add to selected skills (replace 'other' if you want to hide it after adding)
      const nextSkills = (formData.topSkills || []).filter((k) => k !== "other");
      nextSkills.push(key);

      // If you still want “Other” to remain selected, remove the filter above.
      setFormData({ topSkills: nextSkills });

      // Reset input
      setCustomSkillText("");
      setShowOther(false); // close the input once added (optional UX)
    } finally {
      setAdding(false);
    }
  };

  const handleNext = () => {
    if (!hasSkills) {
      setTouched(true);
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Select your top skills to showcase your expertise.
      </p>

      <div>
        <label className="text-sm font-semibold mb-1 block text-gray-800 dark:text-gray-200">
          Top Skills (choose at least one) <span className="text-red-500">*</span>
        </label>

        <Select
          isMulti
          value={selectedOptions}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          options={skillsOptions}
          placeholder="Select your skills"
          styles={selectStyles}
        />

        {/* "Other" input appears when Other is selected */}
        {showOther && (
          <form onSubmit={handleAddCustom} className="mt-3 flex gap-2 items-center">
            <input
              type="text"
              value={customSkillText}
              onChange={(e) => setCustomSkillText(e.target.value)}
              placeholder="Type your skill (e.g., GraphQL, Redux)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#086972]"
            />
            <button
              type="submit"
              disabled={!customSkillText.trim() || adding}
              className="inline-flex items-center gap-1 rounded-md bg-[#086972] px-3 py-2 text-white hover:bg-[#065c63] disabled:opacity-50"
            >
              <Plus size={16} /> Add
            </button>
          </form>
        )}

        {!hasSkills && touched && (
          <p className="text-red-500 text-xs mt-1">Please select at least one skill.</p>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 
                     text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${hasSkills
              ? "bg-primary text-white hover:bg-[#065c63] shadow-md hover:shadow-lg"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          disabled={!hasSkills}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/** ---------- helpers ---------- */

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, "") // allow common tech chars like + . #
    .trim()
    .replace(/\s+/g, "-");
}

function labelFromCustomKey(key) {
  // "custom:graphql-apollo" -> "graphql apollo"
  return key.replace(/^custom:/, "").replace(/-/g, " ");
}

function uniqueByValue(arr) {
  const map = new Map();
  arr.forEach((o) => map.set(o.value, o));
  return Array.from(map.values());
}

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#086972" : "#d1d5db",
    borderRadius: "0.5rem",
    boxShadow: "none",
    "&:hover": { borderColor: "#086972" },
    minHeight: "42px",
    transition: "border-color 0.2s ease",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    color: "#000000",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#086972" : state.isFocused ? "#d1f2ec" : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#000000",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",
    fontWeight: state.isSelected ? 600 : 400,
    ":active": { backgroundColor: "#086972", color: "#ffffff" },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#086972",
    color: "#ffffff",
    borderRadius: "6px",
    paddingInline: "4px",
  }),
  multiValueLabel: (base) => ({ ...base, color: "#ffffff", fontWeight: 500 }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#ffffff",
    ":hover": { backgroundColor: "#065c63", color: "#ffffff" },
  }),
  singleValue: (base) => ({ ...base, color: "#111827" }),
  placeholder: (base) => ({ ...base, color: "#9ca3af" }),
};
