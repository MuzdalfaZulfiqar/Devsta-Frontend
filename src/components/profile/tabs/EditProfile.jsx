// import Select from "react-select";
// import { useState, useEffect, useMemo } from "react";
// import { Pencil, Check, Plus, X } from "lucide-react";
// import { useAuth } from "../../../context/AuthContext";
// import { updateUserProfile } from "../../../api/profile";
// import SuccessModal from "../../SuccessModal";
// import ErrorModal from "../../ErrorModal";
// import { BACKEND_URL } from "../../../../config";
// import Resume from "../../profile/tabs/Resume";

// /* ---------- styles & helpers ---------- */
// const selectStyles = {
//   control: (base, state) => ({
//     ...base,
//     backgroundColor: "transparent",
//     borderColor: state.isFocused ? "#086972" : "#d1d5db",
//     borderRadius: "0.5rem",
//     boxShadow: "none",
//     "&:hover": { borderColor: "#086972" },
//     minHeight: 42,
//   }),
//   menu: (base) => ({
//     ...base,
//     backgroundColor: "#ffffff",
//     color: "#000000",
//     zIndex: 50,
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isSelected
//       ? "#086972"
//       : state.isFocused
//       ? "#e6f4f1"
//       : "#ffffff",
//     color: state.isSelected ? "#ffffff" : "#000000",
//     cursor: "pointer",
//   }),
//   singleValue: (base) => ({ ...base, color: "#111827" }),
//   placeholder: (base) => ({ ...base, color: "#6b7280" }),
// };

// const slugify = (str) =>
//   String(str)
//     .toLowerCase()
//     .replace(/[^a-z0-9+.# ]/g, "")
//     .trim()
//     .replace(/\s+/g, "-");

// const unslug = (slug) =>
//   String(slug)
//     .replace(/[-+.#]+/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// const prettyLabel = (val) =>
//   String(val)
//     .split("-")
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(" ");

// /** Normalize any meta item into a {value, label} option */
// const toOption = (item) => {
//   if (typeof item === "string") {
//     return { value: item, label: prettyLabel(item) };
//   }
//   if (item && typeof item === "object") {
//     // common keys for "value"
//     const rawVal =
//       item.value ??
//       item.key ??
//       item.code ??
//       item.slug ??
//       item.id ??
//       item.name ??
//       item.title;

//     const val = rawVal != null ? String(rawVal) : "";
//     const lab =
//       item.label ??
//       item.name ??
//       item.title ??
//       (val ? prettyLabel(val) : "");

//     return { value: val, label: String(lab) };
//   }
//   return { value: "", label: "" };
// };

// export default function EditProfile({ user }) {
//   const { token, setUser } = useAuth();

//   const [form, setForm] = useState({
//     name: user?.name || "",
//     phone: user?.phone || "",
//     experienceLevel: user?.experienceLevel || "",
//     primaryRole: user?.primaryRole || "",
//     topSkills: Array.isArray(user?.topSkills) ? user.topSkills : [],
//   });

//   const [expOptions, setExpOptions] = useState([]);   // fetched experience levels
//   const [roleOptions, setRoleOptions] = useState([]); // fetched roles (+ Other)
//   const [allSkills, setAllSkills] = useState([]);     // fetched skills

//   const [editField, setEditField] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [errorOpen,   setErrorOpen] = useState(false);
//   const [message,     setMessage] = useState("");

//   // role “Other” input
//   const [customRoleLabel, setCustomRoleLabel] = useState("");

//   // skills “Other” input
//   const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
//   const [customSkillLabel, setCustomSkillLabel] = useState("");
//   const [skillError, setSkillError] = useState("");

//   const inputBoxClass =
//     "mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-transparent text-gray-900 dark:text-white";
//   const boxContainer =
//     "bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg";

//   /* ---------- load meta lists (same endpoints as onboarding) ---------- */
//   useEffect(() => {
//     let cancelled = false;

//     const headers = { "Content-Type": "application/json" };
//     if (token) headers.Authorization = `Bearer ${token}`;

//     const fetchJson = async (url) => {
//       const res = await fetch(url, { headers, credentials: "include" });
//       if (!res.ok) {
//         const t = await res.text().catch(() => "");
//         throw new Error(`${res.status} ${res.statusText} – ${t || url}`);
//       }
//       return res.json();
//     };

//     (async () => {
//       try {
//         const [expData, roleData, skillsData] = await Promise.all([
//           fetchJson(`${BACKEND_URL}/api/experience/levels`),
//           fetchJson(`${BACKEND_URL}/api/experience/roles`),
//           fetchJson(`${BACKEND_URL}/api/skills`),
//         ]);

//         if (cancelled) return;

//         // Normalize to {value,label}
//         const expOpts = (Array.isArray(expData) ? expData : [])
//           .map(toOption)
//           .filter((o) => o.value);

//         const baseRoleOpts = (Array.isArray(roleData) ? roleData : [])
//           .map(toOption)
//           .filter((o) => o.value);

//         const rolesWithOther = [
//           ...baseRoleOpts,
//           { value: "other", label: "Other" },
//         ];

//         // skills kept as raw keys/strings (buttons), but normalize shape if objects
//         const skills = (Array.isArray(skillsData) ? skillsData : []).map((s) =>
//           typeof s === "string" ? s : s?.key ?? s?.value ?? s?.name ?? ""
//         ).filter(Boolean);

//         setExpOptions(expOpts);
//         setRoleOptions(rolesWithOther);
//         setAllSkills(skills);
//       } catch (e) {
//         console.error("Meta fetch failed:", e);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [token]);

//   /* ---------- prefill custom role if existing value is custom:<slug> ---------- */
//   useEffect(() => {
//     if (user?.primaryRole && String(user.primaryRole).startsWith("custom:")) {
//       const raw = String(user.primaryRole).slice(7);
//       setCustomRoleLabel(unslug(raw));
//       setForm((prev) => ({ ...prev, primaryRole: "other" }));
//     }
//   }, [user?.primaryRole]);

//   /* ---------- Select values ---------- */
//   const experienceSelectValue = useMemo(() => {
//     return expOptions.find((o) => o.value === form.experienceLevel) || null;
//   }, [expOptions, form.experienceLevel]);

//   const roleSelectValue = useMemo(() => {
//     if (!form.primaryRole) return null;
//     if (form.primaryRole === "other" || form.primaryRole.startsWith("custom:")) {
//       return roleOptions.find((o) => o.value === "other") || { value: "other", label: "Other" };
//     }
//     return roleOptions.find((o) => o.value === form.primaryRole) || null;
//   }, [roleOptions, form.primaryRole]);

//   /* ---------- Read-mode pretty role ---------- */
//   const prettyRole = useMemo(() => {
//     const val = form.primaryRole;
//     if (!val) return "-";
//     if (val.startsWith("custom:")) return `Custom: ${unslug(val.slice(7))}`;
//     if (val === "other") return customRoleLabel ? `Custom: ${customRoleLabel}` : "Other";
//     const found = roleOptions.find((r) => r.value === val);
//     return found?.label || prettyLabel(val);
//   }, [form.primaryRole, customRoleLabel, roleOptions]);

//   /* ---------- handlers ---------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const toggleSkill = (skill) => {
//     setSkillError("");
//     setForm((prev) => ({
//       ...prev,
//       topSkills: prev.topSkills.includes(skill)
//         ? prev.topSkills.filter((s) => s !== skill)
//         : [...prev.topSkills, skill],
//     }));
//   };

//   const addCustomSkill = () => {
//     const raw = customSkillLabel.trim();
//     if (!raw) {
//       setSkillError("Please enter a skill name.");
//       return;
//     }
//     const key = `custom:${slugify(raw)}`;
//     if (form.topSkills.includes(key)) {
//       setSkillError("This skill is already added.");
//       return;
//     }
//     setForm((prev) => ({ ...prev, topSkills: [...prev.topSkills, key] }));
//     setCustomSkillLabel("");
//     setShowCustomSkillInput(false);
//     setSkillError("");
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const payload = { ...form };

//       // If “Other” is selected, send the custom role label to backend.
//       if (form.primaryRole === "other") {
//         payload.customRoleLabel = customRoleLabel.trim();
//       } else {
//         delete payload.customRoleLabel;
//       }

//       const updatedUser = await updateUserProfile(payload, token);
//       setUser(updatedUser);
//       setMessage("Profile updated successfully!");
//       setSuccessOpen(true);
//       setEditField(null);
//     } catch (err) {
//       setMessage(err?.message || "Failed to update profile");
//       setErrorOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="flex flex-col gap-10 w-full">
//       {/* GENERAL INFO */}
//       <div className="flex flex-col gap-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//             General Info
//           </h2>
//           <button
//             onClick={() =>
//               setEditField(editField === "general" ? null : "general")
//             }
//             className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
//           >
//             {editField === "general" ? <Check size={18} /> : <Pencil size={18} />}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {["name", "phone"].map((field) => (
//             <div key={field} className={boxContainer}>
//               <p className="text-gray-500 dark:text-gray-400 text-sm font-medium capitalize">
//                 {field}
//               </p>
//               {editField === "general" ? (
//                 <input
//                   type="text"
//                   name={field}
//                   value={form[field]}
//                   onChange={handleChange}
//                   className={inputBoxClass}
//                 />
//               ) : (
//                 <p className="text-gray-900 dark:text-white font-semibold mt-1">
//                   {form[field] || "-"}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* EXPERIENCE & ROLE */}
//       <div className="flex flex-col gap-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//             Experience & Role
//           </h2>
//           <button
//             onClick={() =>
//               setEditField(editField === "experience" ? null : "experience")
//             }
//             className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
//           >
//             {editField === "experience" ? <Check size={18} /> : <Pencil size={18} />}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Experience */}
//           <div className={boxContainer}>
//             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
//               Experience Level
//             </p>
//             {editField === "experience" ? (
//               <Select
//                 options={expOptions}
//                 value={experienceSelectValue}
//                 onChange={(selected) =>
//                   setForm({ ...form, experienceLevel: selected?.value || "" })
//                 }
//                 placeholder="Select experience level"
//                 styles={selectStyles}
//               />
//             ) : (
//               <div className="mt-1 text-gray-900 dark:text-white font-semibold">
//                 {experienceSelectValue?.label ||
//                   prettyLabel(form.experienceLevel) ||
//                   "-"}
//               </div>
//             )}
//           </div>

//           {/* Role + Other input */}
//           <div className={boxContainer}>
//             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
//               Primary Role
//             </p>
//             {editField === "experience" ? (
//               <>
//                 <Select
//                   options={roleOptions}
//                   value={roleSelectValue}
//                   onChange={(selected) => {
//                     const val = selected?.value || "";
//                     setForm((prev) => ({ ...prev, primaryRole: val }));
//                     if (val !== "other") setCustomRoleLabel("");
//                   }}
//                   placeholder="Select your role"
//                   styles={selectStyles}
//                 />
//                 {form.primaryRole === "other" && (
//                   <div className="mt-3">
//                     <label className="text-sm text-gray-600 dark:text-gray-300">
//                       Enter your role
//                     </label>
//                     <input
//                       type="text"
//                       value={customRoleLabel}
//                       onChange={(e) => setCustomRoleLabel(e.target.value)}
//                       placeholder="e.g., Data Analyst"
//                       className={inputBoxClass}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       Will be saved as{" "}
//                       <code>custom:{slugify(customRoleLabel || "")}</code>.
//                     </p>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="mt-1 text-gray-900 dark:text-white font-semibold">
//                 {prettyRole}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* SKILLS */}
//       <div className="flex flex-col gap-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//             Top Skills
//           </h2>
//           <button
//             onClick={() =>
//               setEditField(editField === "skills" ? null : "skills")
//             }
//             className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
//           >
//             {editField === "skills" ? <Check size={18} /> : <Pencil size={18} />}
//           </button>
//         </div>

//         {editField === "skills" ? (
//           <>
//             <p className="text-gray-500 dark:text-gray-400 text-sm">
//               Selected skills are highlighted. Click + to add or × to remove.
//             </p>

//             <div className="flex flex-wrap gap-2">
//               {allSkills.length > 0 ? (
//                 <>
//                   {allSkills.map((skill) => {
//                     const isSelected = form.topSkills.includes(skill);
//                     return (
//                       <button
//                         key={skill}
//                         type="button"
//                         onClick={() => toggleSkill(skill)}
//                         className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
//                           isSelected
//                             ? "bg-primary text-white border-primary shadow-sm"
//                             : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-600 dark:text-gray-300 hover:border-primary"
//                         }`}
//                       >
//                         {isSelected ? <X size={14} /> : <Plus size={14} />}
//                         {skill}
//                       </button>
//                     );
//                   })}
//                   {/* reveal Other (custom) skill input */}
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowCustomSkillInput((s) => !s);
//                       setSkillError("");
//                     }}
//                     className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
//                       showCustomSkillInput
//                         ? "bg-primary text-white border-primary shadow-sm"
//                         : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-600 dark:text-gray-300 hover:border-primary"
//                     }`}
//                   >
//                     <Plus size={14} />
//                     Other
//                   </button>
//                 </>
//               ) : (
//                 <p className="text-gray-500 text-sm">Loading skills...</p>
//               )}
//             </div>

//             {showCustomSkillInput && (
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
//                 <input
//                   type="text"
//                   value={customSkillLabel}
//                   onChange={(e) => {
//                     setCustomSkillLabel(e.target.value);
//                     if (skillError) setSkillError("");
//                   }}
//                   placeholder="Add a custom skill (e.g., System Design)"
//                   className={inputBoxClass}
//                 />
//                 <button
//                   type="button"
//                   onClick={addCustomSkill}
//                   className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80 transition"
//                 >
//                   Add
//                 </button>
//               </div>
//             )}
//             {skillError && (
//               <p className="text-red-500 text-xs mt-1">{skillError}</p>
//             )}

//             {form.topSkills.length > 0 && (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {form.topSkills.map((s) => (
//                   <span
//                     key={s}
//                     className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-primary px-3 py-1.5 rounded-full text-sm font-medium text-primary"
//                   >
//                     {s}
//                     <button
//                       type="button"
//                       onClick={() => toggleSkill(s)}
//                       className="text-primary hover:text-primary/80"
//                       title="Remove"
//                     >
//                       <X size={14} />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </>
//         ) : form.topSkills.length > 0 ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//             {form.topSkills.map((skill) => (
//               <div
//                 key={skill}
//                 className="bg-white dark:bg-gray-900 border border-primary px-3 py-2 rounded-full text-center text-sm font-medium text-primary"
//               >
//                 {skill}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 dark:text-gray-400">No skills added</p>
//         )}
//       </div>

//       {/* RESUME SECTION */}
//       <div className="flex flex-col gap-6">
//         <Resume user={user} editable />
//       </div>

//       {/* SAVE BUTTON */}
//       {editField && (
//         <div>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       )}

//       <SuccessModal
//         open={successOpen}
//         message={message}
//         onClose={() => setSuccessOpen(false)}
//       />
//       <ErrorModal
//         open={errorOpen}
//         message={message}
//         onClose={() => setErrorOpen(false)}
//       />
//     </div>
//   );
// }
import Select from "react-select";
import { useState, useEffect, useMemo } from "react";
import { Pencil, Check, Plus, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { updateUserProfile } from "../../../api/profile";
import SuccessModal from "../../SuccessModal";
import ErrorModal from "../../ErrorModal";
import { BACKEND_URL } from "../../../../config";
import Resume from "../../profile/tabs/Resume";

/* ---------- styles & helpers ---------- */
const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#086972" : "#d1d5db",
    borderRadius: "0.5rem",
    boxShadow: "none",
    "&:hover": { borderColor: "#086972" },
    minHeight: 42,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    color: "#000000",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#086972"
      : state.isFocused
      ? "#e6f4f1"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#000000",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#111827" }),
  placeholder: (base) => ({ ...base, color: "#6b7280" }),
};

const slugify = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const unslug = (slug) =>
  String(slug)
    .replace(/[-+.#]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const prettyLabel = (val) =>
  String(val)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const isOther = (opt) => {
  const v = String(opt?.value ?? "").toLowerCase();
  const l = String(opt?.label ?? "").toLowerCase();
  return v === "other" || l === "other";
};

const dedupeByValue = (arr) => {
  const seen = new Set();
  return arr.filter((o) => {
    const key = String(o.value).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/** Normalize any meta item into a {value, label} option */
const toOption = (item) => {
  if (typeof item === "string") {
    return { value: item, label: prettyLabel(item) };
  }
  if (item && typeof item === "object") {
    // common keys for "value"
    const rawVal =
      item.value ??
      item.key ??
      item.code ??
      item.slug ??
      item.id ??
      item.name ??
      item.title;

    const val = rawVal != null ? String(rawVal) : "";
    const lab =
      item.label ??
      item.name ??
      item.title ??
      (val ? prettyLabel(val) : "");

    return { value: val, label: String(lab) };
  }
  return { value: "", label: "" };
};

export default function EditProfile({ user }) {
  const { token, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    experienceLevel: user?.experienceLevel || "",
    primaryRole: user?.primaryRole || "",
    topSkills: Array.isArray(user?.topSkills)
      ? user.topSkills
          .map((s) =>
            typeof s === "string" ? s : s?.value ?? s?.key ?? s?.name ?? ""
          )
          .filter(Boolean)
      : [],
  });

  const [expOptions, setExpOptions] = useState([]); // fetched experience levels
  const [roleOptions, setRoleOptions] = useState([]); // fetched roles (+ maybe Other)
  const [allSkills, setAllSkills] = useState([]); // fetched skills

  const [editField, setEditField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [message, setMessage] = useState("");

  // role “Other” input
  const [customRoleLabel, setCustomRoleLabel] = useState("");

  // skills “Other” input
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [customSkillLabel, setCustomSkillLabel] = useState("");
  const [skillError, setSkillError] = useState("");

  const inputBoxClass =
    "mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-transparent text-gray-900 dark:text-white";
  const boxContainer =
    "bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg";

  /* ---------- load meta lists (same endpoints as onboarding) ---------- */
  useEffect(() => {
    let cancelled = false;

    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const fetchJson = async (url) => {
      const res = await fetch(url, { headers, credentials: "include" });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} – ${t || url}`);
      }
      return res.json();
    };

    (async () => {
      try {
        const [expData, roleData, skillsData] = await Promise.all([
          fetchJson(`${BACKEND_URL}/api/experience/levels`),
          fetchJson(`${BACKEND_URL}/api/experience/roles`),
          fetchJson(`${BACKEND_URL}/api/skills`),
        ]);

        if (cancelled) return;

        // Normalize to {value,label}
        const expOpts = (Array.isArray(expData) ? expData : [])
          .map(toOption)
          .filter((o) => o.value);

        const baseRoleOpts = (Array.isArray(roleData) ? roleData : [])
          .map(toOption)
          .filter((o) => o.value);

        const backendHasOther = baseRoleOpts.some(isOther);
        const rolesWithOther = backendHasOther
          ? baseRoleOpts
          : [...baseRoleOpts, { value: "other", label: "Other" }];

        // skills kept as raw keys/strings (buttons), but normalize shape if objects
        const skills = (Array.isArray(skillsData) ? skillsData : [])
          .map((s) => (typeof s === "string" ? s : s?.key ?? s?.value ?? s?.name ?? ""))
          .filter(Boolean);

        setExpOptions(expOpts);
        setRoleOptions(dedupeByValue(rolesWithOther));
        setAllSkills(skills);
      } catch (e) {
        console.error("Meta fetch failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /* ---------- know the exact backend "Other" value ---------- */
  const otherRoleValue = useMemo(() => {
    const found = roleOptions.find(isOther);
    return found?.value || "other";
  }, [roleOptions]);

  /* ---------- prefill custom role if existing value is custom:<slug> ---------- */
  useEffect(() => {
    if (user?.primaryRole && String(user.primaryRole).startsWith("custom:")) {
      const raw = String(user.primaryRole).slice(7);
      setCustomRoleLabel(unslug(raw));
      setForm((prev) => ({ ...prev, primaryRole: otherRoleValue }));
    }
  }, [user?.primaryRole, otherRoleValue]);

  /* ---------- Select values ---------- */
  const experienceSelectValue = useMemo(() => {
    return expOptions.find((o) => o.value === form.experienceLevel) || null;
  }, [expOptions, form.experienceLevel]);

  const roleSelectValue = useMemo(() => {
    if (!form.primaryRole) return null;

    const isOtherSelected =
      form.primaryRole === otherRoleValue ||
      String(form.primaryRole).startsWith("custom:");

    if (isOtherSelected) {
      return roleOptions.find(isOther) || { value: otherRoleValue, label: "Other" };
    }
    return roleOptions.find((o) => o.value === form.primaryRole) || null;
  }, [roleOptions, form.primaryRole, otherRoleValue]);

  /* ---------- Read-mode pretty role ---------- */
  const prettyRole = useMemo(() => {
    const val = form.primaryRole;
    if (!val) return "-";
    if (String(val).startsWith("custom:")) return `Custom: ${unslug(val.slice(7))}`;
    if (val === otherRoleValue)
      return customRoleLabel ? `Custom: ${customRoleLabel}` : "Other";
    const found = roleOptions.find((r) => r.value === val);
    return found?.label || prettyLabel(val);
  }, [form.primaryRole, customRoleLabel, roleOptions, otherRoleValue]);

  /* ---------- Skills: know if backend provided "Other" ---------- */
  const backendHasSkillOther = useMemo(
    () => allSkills.some((s) => slugify(s) === "other"),
    [allSkills]
  );

  /* ---------- handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setSkillError("");
    setForm((prev) => ({
      ...prev,
      topSkills: prev.topSkills.includes(skill)
        ? prev.topSkills.filter((s) => s !== skill)
        : [...prev.topSkills, skill],
    }));
  };

  const addCustomSkill = () => {
    const raw = customSkillLabel.trim();
    if (!raw) {
      setSkillError("Please enter a skill name.");
      return;
    }
    const key = `custom:${slugify(raw)}`;
    if (form.topSkills.includes(key)) {
      setSkillError("This skill is already added.");
      return;
    }
    setForm((prev) => ({ ...prev, topSkills: [...prev.topSkills, key] }));
    setCustomSkillLabel("");
    setShowCustomSkillInput(false);
    setSkillError("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = { ...form };

      // If “Other” is selected, send the custom role label to backend.
      if (form.primaryRole === otherRoleValue) {
        payload.customRoleLabel = customRoleLabel.trim();
      } else {
        delete payload.customRoleLabel;
      }

      const updatedUser = await updateUserProfile(payload, token);
      setUser(updatedUser);
      setMessage("Profile updated successfully!");
      setSuccessOpen(true);
      setEditField(null);
    } catch (err) {
      setMessage(err?.message || "Failed to update profile");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* GENERAL INFO */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            General Info
          </h2>
          <button
            onClick={() =>
              setEditField(editField === "general" ? null : "general")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
          >
            {editField === "general" ? <Check size={18} /> : <Pencil size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "phone"].map((field) => (
            <div key={field} className={boxContainer}>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium capitalize">
                {field}
              </p>
              {editField === "general" ? (
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className={inputBoxClass}
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-semibold mt-1">
                  {form[field] || "-"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIENCE & ROLE */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Experience & Role
          </h2>
          <button
            onClick={() =>
              setEditField(editField === "experience" ? null : "experience")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
          >
            {editField === "experience" ? <Check size={18} /> : <Pencil size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Experience */}
          <div className={boxContainer}>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Experience Level
            </p>
            {editField === "experience" ? (
              <Select
                options={expOptions}
                value={experienceSelectValue}
                onChange={(selected) =>
                  setForm({ ...form, experienceLevel: selected?.value || "" })
                }
                placeholder="Select experience level"
                styles={selectStyles}
              />
            ) : (
              <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                {experienceSelectValue?.label ||
                  prettyLabel(form.experienceLevel) ||
                  "-"}
              </div>
            )}
          </div>

          {/* Role + Other input */}
          <div className={boxContainer}>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Primary Role
            </p>
            {editField === "experience" ? (
              <>
                <Select
                  options={roleOptions}
                  value={roleSelectValue}
                  onChange={(selected) => {
                    const val = selected?.value || "";
                    setForm((prev) => ({ ...prev, primaryRole: val }));
                    if (val !== otherRoleValue) setCustomRoleLabel("");
                  }}
                  placeholder="Select your role"
                  styles={selectStyles}
                />
                {form.primaryRole === otherRoleValue && (
                  <div className="mt-3">
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Enter your role
                    </label>
                    <input
                      type="text"
                      value={customRoleLabel}
                      onChange={(e) => setCustomRoleLabel(e.target.value)}
                      placeholder="e.g., Data Analyst"
                      className={inputBoxClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Will be saved as{" "}
                      <code>custom:{slugify(customRoleLabel || "")}</code>.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                {prettyRole}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Skills
          </h2>
          <button
            onClick={() =>
              setEditField(editField === "skills" ? null : "skills")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
          >
            {editField === "skills" ? <Check size={18} /> : <Pencil size={18} />}
          </button>
        </div>

        {editField === "skills" ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Selected skills are highlighted. Click + to add or × to remove.
            </p>

            <div className="flex flex-wrap gap-2">
              {allSkills.length > 0 ? (
                <>
                  {allSkills.map((skill) => {
                    const norm = slugify(skill);
                    const isSelected = form.topSkills.includes(skill);

                    // If this is backend "Other", use it to toggle the custom input
                    if (norm === "other") {
                      return (
                        <button
                          key="__other-skill"
                          type="button"
                          onClick={() => {
                            setShowCustomSkillInput((s) => !s);
                            setSkillError("");
                          }}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
                            showCustomSkillInput
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-600 dark:text-gray-300 hover:border-primary"
                          }`}
                        >
                          <Plus size={14} />
                          Other
                        </button>
                      );
                    }

                    // Regular skill toggle as before
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-600 dark:text-gray-300 hover:border-primary"
                        }`}
                      >
                        {isSelected ? <X size={14} /> : <Plus size={14} />}
                        {skill}
                      </button>
                    );
                  })}

                  {/* Only show our manual Other chip if backend didn't provide one */}
                  {!backendHasSkillOther && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomSkillInput((s) => !s);
                        setSkillError("");
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition ${
                        showCustomSkillInput
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-600 dark:text-gray-300 hover:border-primary"
                      }`}
                    >
                      <Plus size={14} />
                      Other
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">Loading skills...</p>
              )}
            </div>

            {showCustomSkillInput && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                <input
                  type="text"
                  value={customSkillLabel}
                  onChange={(e) => {
                    setCustomSkillLabel(e.target.value);
                    if (skillError) setSkillError("");
                  }}
                  placeholder="Add a custom skill (e.g., System Design)"
                  className={inputBoxClass}
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80 transition"
                >
                  Add
                </button>
              </div>
            )}
            {skillError && (
              <p className="text-red-500 text-xs mt-1">{skillError}</p>
            )}

            {form.topSkills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {form.topSkills.map((s) => {
                  const label = s.startsWith("custom:")
                    ? unslug(s.slice(7))
                    : s;
                  return (
                    <span
                      key={s}
                      className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-primary px-3 py-1.5 rounded-full text-sm font-medium text-primary"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => toggleSkill(s)}
                        className="text-primary hover:text-primary/80"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </>
        ) : form.topSkills.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {form.topSkills.map((skill) => {
              const label = skill.startsWith("custom:")
                ? unslug(skill.slice(7))
                : skill;
              return (
                <div
                  key={skill}
                  className="bg-white dark:bg-gray-900 border border-primary px-3 py-2 rounded-full text-center text-sm font-medium text-primary"
                >
                  {label}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No skills added</p>
        )}
      </div>

      {/* RESUME SECTION */}
      <div className="flex flex-col gap-6">
        <Resume user={user} editable />
      </div>

      {/* SAVE BUTTON */}
      {editField && (
        <div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      <SuccessModal
        open={successOpen}
        message={message}
        onClose={() => setSuccessOpen(false)}
      />
      <ErrorModal
        open={errorOpen}
        message={message}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}
