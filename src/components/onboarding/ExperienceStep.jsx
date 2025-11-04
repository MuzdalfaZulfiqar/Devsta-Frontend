import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { BACKEND_URL } from "../../../config";

export default function ExperienceStep({ formData, setFormData, nextStep, prevStep }) {
  const [expOptions, setExpOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touched, setTouched] = useState({});

  // "Other" role input state
  const [showOtherRole, setShowOtherRole] = useState(false);
  const [customRoleText, setCustomRoleText] = useState("");
  const [addingRole, setAddingRole] = useState(false);

  // Load lists once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [expRes, roleRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/experience/levels`),
          fetch(`${BACKEND_URL}/api/experience/roles`),
        ]);
        if (!expRes.ok) throw new Error("Failed to load experience levels");
        if (!roleRes.ok) throw new Error("Failed to load roles");

        const [expData, roleData] = await Promise.all([expRes.json(), roleRes.json()]);

        const expOpts = expData.map((e) => ({ value: e.key, label: e.label }));
        let rOpts = roleData.map((r) => ({ value: r.key, label: r.label }));

        // Ensure "Other" exists (in case constants forgot it)
        if (!rOpts.some((o) => o.value === "other")) {
          rOpts = [...rOpts, { value: "other", label: "Other" }];
        }

        // If a custom role is already selected (custom:*), add it so Select can render it
        if (formData?.primaryRole?.startsWith?.("custom:")) {
          rOpts = uniqueByValue([
            ...rOpts,
            { value: formData.primaryRole, label: labelFromCustomKey(formData.primaryRole) },
          ]);
        }

        if (mounted) {
          setExpOptions(expOpts);
          setRoleOptions(rOpts);
          setShowOtherRole(formData?.primaryRole === "other"); // keep UI consistent on reload
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasExperience = Boolean(formData.experienceLevel);
  const hasRoleChosen =
    Boolean(formData.primaryRole) && formData.primaryRole !== "other"; // block Next if still "other"

  const selectedExp = useMemo(
    () => expOptions.find((o) => o.value === formData.experienceLevel) || null,
    [expOptions, formData.experienceLevel]
  );

  const selectedRole = useMemo(() => {
    if (!formData.primaryRole) return null;
    // match either a known or custom role
    return (
      roleOptions.find((o) => o.value === formData.primaryRole) ||
      (formData.primaryRole.startsWith("custom:")
        ? { value: formData.primaryRole, label: labelFromCustomKey(formData.primaryRole) }
        : null)
    );
  }, [roleOptions, formData.primaryRole]);

  const handleExpChange = (sel) => {
    setFormData({ ...formData, experienceLevel: sel?.value || "" });
  };

  const handleRoleChange = (sel) => {
    const val = sel?.value || "";
    setFormData({ ...formData, primaryRole: val });
    setShowOtherRole(val === "other");
  };

  const handleAddCustomRole = async (e) => {
    e?.preventDefault();
    const label = customRoleText.trim();
    if (!label) return;

    const key = "custom:" + slugify(label);

    // Avoid duplicates; add to options for proper rendering
    const exists = roleOptions.some((o) => o.value === key);
    if (!exists) {
      setRoleOptions((opts) => uniqueByValue([...opts, { value: key, label }]));
    }

    // Set as chosen role and close "Other" input
    setFormData({ ...formData, primaryRole: key });
    setAddingRole(true);
    try {
      setCustomRoleText("");
      setShowOtherRole(false);
    } finally {
      setAddingRole(false);
    }
  };

  const handleNext = () => {
    setTouched({ experienceLevel: true, primaryRole: true });
    if (hasExperience && hasRoleChosen) nextStep();
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Select your experience level and primary role.
      </p>

      {/* Experience Level */}
      <div>
        <label className="text-sm font-semibold mb-1 block text-gray-800 dark:text-gray-200">
          Experience Level <span className="text-red-500">*</span>
        </label>
        <Select
          isLoading={loading}
          options={expOptions}
          value={selectedExp}
          onChange={handleExpChange}
          onBlur={() => setTouched((t) => ({ ...t, experienceLevel: true }))}
          placeholder="Select your level"
          styles={selectStyles}
        />
        {!hasExperience && touched.experienceLevel && (
          <p className="text-red-500 text-xs mt-1">Experience level is required.</p>
        )}
      </div>

      {/* Primary Role */}
      <div>
        <label className="text-sm font-semibold mb-1 block text-gray-800 dark:text-gray-200">
          Primary Role <span className="text-red-500">*</span>
        </label>
        <Select
          isLoading={loading}
          options={roleOptions}
          value={selectedRole}
          onChange={handleRoleChange}
          onBlur={() => setTouched((t) => ({ ...t, primaryRole: true }))}
          placeholder="Select your role"
          styles={selectStyles}
        />
        {/* Show "Other" input if Other is selected */}
        {showOtherRole && (
          <form onSubmit={handleAddCustomRole} className="mt-3 flex gap-2 items-center">
            <input
              type="text"
              value={customRoleText}
              onChange={(e) => setCustomRoleText(e.target.value)}
              placeholder="Type your role (e.g., Data Engineer, SRE)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#086972]"
            />
            <button
              type="submit"
              disabled={!customRoleText.trim() || addingRole}
              className="inline-flex items-center gap-1 rounded-md bg-[#086972] px-3 py-2 text-white hover:bg-[#065c63] disabled:opacity-50"
            >
              <Plus size={16} /> Add
            </button>
          </form>
        )}
        {/* Validation for role */}
        {!hasRoleChosen && touched.primaryRole && (
          <p className="text-red-500 text-xs mt-1">
            {formData.primaryRole === "other"
              ? "Please add a custom role."
              : "Primary role is required."}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 
                     text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasExperience || !hasRoleChosen}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
            hasExperience && hasRoleChosen
              ? "bg-primary text-white hover:bg-[#065c63] shadow-md hover:shadow-lg"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, "") // allow + . #
    .trim()
    .replace(/\s+/g, "-");
}
function labelFromCustomKey(key) {
  return key.replace(/^custom:/, "").replace(/-/g, " ");
}
function uniqueByValue(arr) {
  const map = new Map();
  arr.forEach((o) => map.set(o.value, o));
  return Array.from(map.values());
}

/* ---------- shared react-select styles ---------- */
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
  menu: (base) => ({ ...base, backgroundColor: "#ffffff", color: "#000000", zIndex: 50 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#086972" : state.isFocused ? "#e6f4f1" : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#000000",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#111827" }),
  placeholder: (base) => ({ ...base, color: "#9ca3af" }),
};
