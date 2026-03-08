// // src/pages/company/EditJobModal.jsx
// import { useState, useEffect, useRef } from "react";
// import CreatableSelect from "react-select/creatable";
// import Select from "react-select";
// import { updateJob } from "../../api/company/jobs";
// import { showToast } from "../../utils/toast";

// export default function EditJobModal({ job, open, onClose, onUpdated }) {
//   const locationBoxRef = useRef(null);

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       backgroundColor: "transparent",
//       borderColor: state.isFocused ? "#086972" : "#d1d5db",
//       borderRadius: "0.5rem",
//       boxShadow: "none",
//       "&:hover": { borderColor: "#086972" },
//       minHeight: "42px",
//     }),
//     menu: (base) => ({
//       ...base,
//       backgroundColor: "#ffffff",
//       maxHeight: 200,
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "#086972"
//         : state.isFocused
//           ? "#d1f2ec"
//           : "#ffffff",
//       color: state.isSelected ? "#ffffff" : "#000000",
//       cursor: "pointer",
//     }),
//     multiValue: (base) => ({ ...base, backgroundColor: "#086972" }),
//     multiValueLabel: (base) => ({ ...base, color: "#ffffff" }),
//     multiValueRemove: (base) => ({
//       ...base,
//       color: "#ffffff",
//       ":hover": { backgroundColor: "#065c63" },
//     }),
//     singleValue: (base) => ({ ...base, color: "#111827" }),
//     placeholder: (base) => ({ ...base, color: "#9ca3af" }),
//   };
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     requirements: [],
//     benefits: [],
//     requiredSkills: [],
//     experienceLevel: null,
//     employmentType: null,
//     jobMode: null,
//     location: "",
//     salaryMin: "",
//     salaryMax: "",
//     currency: "",
//     salaryPeriod: null, // new
//   });


//   const [typingLocation, setTypingLocation] = useState("");
//   const [locationSuggestions, setLocationSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Prefill form when job changes
//   useEffect(() => {
//     if (!job) return;
//     setForm({
//       title: job.title,
//       description: job.description,
//       requirements: job.requirements?.map(r => ({ label: r, value: r })) || [],
//       benefits: job.benefits?.map(b => ({ label: b, value: b })) || [],
//       requiredSkills: job.requiredSkills.map(s => ({ label: s, value: s })),
//       experienceLevel: job.experienceLevel ? { value: job.experienceLevel, label: job.experienceLevel } : null,
//       employmentType: job.employmentType ? { value: job.employmentType, label: job.employmentType } : null,
//       jobMode: job.jobMode ? { value: job.jobMode, label: job.jobMode } : null,
//       location: job.location || "",
//       salaryMin: job.salary?.min || "",
//       salaryMax: job.salary?.max || "",
//       currency: job.salary?.currency || "",
//       salaryPeriod: job.salary?.period ? { value: job.salary.period, label: job.salary.period } : null, // new
//     });
//     setTypingLocation(job.location || "");
//   }, [job]);

//   // Location suggestions (debounced)
//   useEffect(() => {
//     if (!typingLocation) return setLocationSuggestions([]);
//     const controller = new AbortController();
//     const timer = setTimeout(async () => {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             typingLocation
//           )}&limit=5`,
//           { signal: controller.signal }
//         );
//         const data = await res.json();
//         setLocationSuggestions(data.map((i) => i.display_name));
//       } catch (err) {
//         if (err.name !== "AbortError") console.error(err);
//       }
//     }, 400);
//     return () => {
//       clearTimeout(timer);
//       controller.abort();
//     };
//   }, [typingLocation]);

//   // Click outside location → lock custom location
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (locationBoxRef.current && !locationBoxRef.current.contains(e.target)) {
//         if (!form.location && typingLocation) {
//           setForm((p) => ({ ...p, location: typingLocation }));
//         }
//         setLocationSuggestions([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [typingLocation, form.location]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await updateJob(job._id, {
//         title: form.title,
//         description: form.description,
//         requiredSkills: form.requiredSkills.map(s => s.value),
//         experienceLevel: form.experienceLevel?.value,
//         employmentType: form.employmentType?.value,
//         jobMode: form.jobMode?.value,
//         location: form.jobMode?.value === "remote" ? "Remote" : form.location,
//         salary: {
//           min: form.salaryMin || undefined,
//           max: form.salaryMax || undefined,
//           currency: form.currency,
//           period: form.salaryPeriod?.value,
//         },
//         requirements: form.requirements.map(r => r.value),
//         benefits: form.benefits.map(b => b.value),
//       });

//       showToast("Job updated successfully!");
//       onUpdated();
//       onClose();
//     } catch (err) {
//       showToast(err.message || "Failed to update job ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-10">
//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-5xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Job</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg font-bold"
//           >
//             ✖
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Job Title */}
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
//           <input
//             placeholder="Job Title"
//             className="input w-full"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             required
//           />

//           {/* Description */}
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Description</label>
//           <textarea
//             placeholder="Job Description"
//             className="input h-32 w-full"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             required
//           />

//           {/* Required Skills */}
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Required Skills</label>
//           <CreatableSelect
//             isMulti
//             placeholder="Add skills..."
//             styles={selectStyles}
//             value={form.requiredSkills}
//             onChange={(v) => setForm({ ...form, requiredSkills: v })}
//             menuPortalTarget={document.body}
//             menuPosition="fixed"
//           />

//           {/* Row: Experience | Employment Type | Job Mode */}
//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {/* Experience */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
//               <Select
//                 placeholder="Select Experience"
//                 styles={selectStyles}
//                 options={[
//                   { value: "junior", label: "Junior" },
//                   { value: "mid", label: "Mid" },
//                   { value: "senior", label: "Senior" },
//                 ]}
//                 value={form.experienceLevel}
//                 onChange={(v) => setForm({ ...form, experienceLevel: v })}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//               />
//             </div>

//             {/* Employment Type */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Employment Type</label>
//               <Select
//                 placeholder="Select Employment Type"
//                 styles={selectStyles}
//                 options={[
//                   { value: "full-time", label: "Full-time" },
//                   { value: "part-time", label: "Part-time" },
//                   { value: "internship", label: "Internship" },
//                   { value: "contract", label: "Contract" },
//                 ]}
//                 value={form.employmentType}
//                 onChange={(v) => setForm({ ...form, employmentType: v })}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//               />
//             </div>

//             {/* Job Mode */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Mode</label>
//               <Select
//                 placeholder="Select Job Mode"
//                 styles={selectStyles}
//                 options={[
//                   { value: "remote", label: "Remote" },
//                   { value: "hybrid", label: "Hybrid" },
//                   { value: "onsite", label: "Onsite" },
//                 ]}
//                 value={form.jobMode}
//                 onChange={(v) => setForm({ ...form, jobMode: v, location: "" })}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//               />
//             </div>
//           </div>

//           {/* Location (only for hybrid/onsite) */}
//           {(form.jobMode?.value === "hybrid" || form.jobMode?.value === "onsite") && (
//             <div className="relative mt-2" ref={locationBoxRef}>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
//               <input
//                 placeholder="Search or type location"
//                 className="input w-full"
//                 value={typingLocation}
//                 onChange={(e) => {
//                   setTypingLocation(e.target.value);
//                   setForm({ ...form, location: e.target.value });
//                 }}
//               />
//               {locationSuggestions.length > 0 && (
//                 <ul className="absolute z-50 bg-white border w-full mt-1 rounded-md shadow max-h-48 overflow-auto">
//                   {locationSuggestions.map((loc, i) => (
//                     <li
//                       key={i}
//                       className="px-4 py-2 hover:bg-primary/20 cursor-pointer"
//                       onClick={() => {
//                         setTypingLocation(loc);
//                         setForm({ ...form, location: loc });
//                         setLocationSuggestions([]);
//                       }}
//                     >
//                       {loc}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//               {typingLocation && locationSuggestions.length === 0 && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   Using custom location: <span className="font-semibold">{typingLocation}</span>
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Row: Currency | Min Salary | Max Salary */}
//           <div className="grid grid-cols-3 gap-4 mt-2">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
//               <Select
//                 placeholder="Currency"
//                 styles={selectStyles}
//                 options={["USD", "CAD", "PKR", "EUR", "GBP"].map((c) => ({ value: c, label: c }))}
//                 value={form.currency ? { value: form.currency, label: form.currency } : null}
//                 onChange={(v) => setForm({ ...form, currency: v.value })}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Salary</label>
//               <input
//                 placeholder="Min Salary"
//                 className="input w-full"
//                 value={form.salaryMin}
//                 onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Salary</label>
//               <input
//                 placeholder="Max Salary"
//                 className="input w-full"
//                 value={form.salaryMax}
//                 onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salary Period</label>
//             <Select
//               placeholder="Salary Period"
//               styles={selectStyles}
//               options={[
//                 { value: "hour", label: "Per Hour" },
//                 { value: "month", label: "Per Month" },
//                 { value: "year", label: "Per Year" },
//                 { value: "project", label: "Per Project" },
//                 { value: "stipend", label: "Stipend" },
//               ]}
//               value={form.salaryPeriod}
//               onChange={(v) => setForm({ ...form, salaryPeriod: v })}
//             />
//           </div>


//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Requirements</label>

//             <CreatableSelect
//               isMulti
//               placeholder="Job Requirements (press enter)"
//               styles={selectStyles}
//               value={form.requirements}
//               onChange={(v) => setForm({ ...form, requirements: v })}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Benefits</label>
//             <CreatableSelect
//               isMulti
//               placeholder="What you will get (benefits, perks)"
//               styles={selectStyles}
//               value={form.benefits}
//               onChange={(v) => setForm({ ...form, benefits: v })}
//             />

//           </div>


//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-primary text-white rounded-xl font-semibold"
//           >
//             {loading ? "Updating..." : "Update Job"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/pages/company/EditJobModal.jsx
import { useState, useEffect, useRef } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { updateJob } from "../../api/company/jobs";
import { showToast } from "../../utils/toast";

export default function EditJobModal({ job, open, onClose, onUpdated }) {
  const locationBoxRef = useRef(null);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "#086972" : "#d1d5db",
      borderRadius: "0.5rem",
      boxShadow: "none",
      "&:hover": { borderColor: "#086972" },
      minHeight: "42px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#ffffff",
      maxHeight: 200,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#086972"
        : state.isFocused
          ? "#d1f2ec"
          : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#000000",
      cursor: "pointer",
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "#086972" }),
    multiValueLabel: (base) => ({ ...base, color: "#ffffff" }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#ffffff",
      ":hover": { backgroundColor: "#065c63" },
    }),
    singleValue: (base) => ({ ...base, color: "#111827" }),
    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: [],
    benefits: [],
    requiredSkills: [],
    experienceLevel: null,
    employmentType: null,
    jobMode: null,
    location: "",
    salaryMin: "",
    salaryMax: "",
    currency: "",
    salaryPeriod: null,
  });

  const [typingLocation, setTypingLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const clearError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  // Prefill form
  useEffect(() => {
    if (!job) return;
    setForm({
      title: job.title || "",
      description: job.description || "",
      requirements: job.requirements?.map((r) => ({ label: r, value: r })) || [],
      benefits: job.benefits?.map((b) => ({ label: b, value: b })) || [],
      requiredSkills: job.requiredSkills?.map((s) => ({ label: s, value: s })) || [],
      experienceLevel: job.experienceLevel ? { value: job.experienceLevel, label: job.experienceLevel } : null,
      employmentType: job.employmentType ? { value: job.employmentType, label: job.employmentType } : null,
      jobMode: job.jobMode ? { value: job.jobMode, label: job.jobMode } : null,
      location: job.location || "",
      salaryMin: job.salary?.min || "",
      salaryMax: job.salary?.max || "",
      currency: job.salary?.currency || "",
      salaryPeriod: job.salary?.period ? { value: job.salary.period, label: job.salary.period } : null,
    });
    setTypingLocation(job.location || "");
  }, [job]);

  // Location suggestions
  useEffect(() => {
    if (!typingLocation) return setLocationSuggestions([]);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(typingLocation)}&limit=5`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setLocationSuggestions(data.map((i) => i.display_name));
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [typingLocation]);

  // Click outside to lock custom location
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationBoxRef.current && !locationBoxRef.current.contains(e.target)) {
        if (!form.location && typingLocation) {
          setForm((p) => ({ ...p, location: typingLocation }));
        }
        setLocationSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [typingLocation, form.location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const payload = {
        title: form.title?.trim() || undefined,
        description: form.description?.trim() || undefined,
        requiredSkills: form.requiredSkills?.map((s) => s.value?.trim()).filter(Boolean),
        requirements: form.requirements?.map((r) => r.value?.trim()).filter(Boolean),
        benefits: form.benefits?.map((b) => b.value?.trim()).filter(Boolean),
        experienceLevel: form.experienceLevel?.value,
        employmentType: form.employmentType?.value,
        jobMode: form.jobMode?.value,
        location: form.jobMode?.value === "remote" ? "Remote" : form.location?.trim(),
        salary: {
          currency: form.currency || undefined,
          period: form.salaryPeriod?.value || undefined,
          min: form.salaryMin ? Number(form.salaryMin) : undefined,
          max: form.salaryMax ? Number(form.salaryMax) : undefined,
        },
      };

      // Clean undefined values
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || (Array.isArray(payload[key]) && payload[key].length === 0)) {
          delete payload[key];
        }
      });
      if (payload.salary) {
        Object.keys(payload.salary).forEach((key) => {
          if (payload.salary[key] === undefined) delete payload.salary[key];
        });
        if (Object.keys(payload.salary).length === 0) delete payload.salary;
      }

      await updateJob(job._id, payload);

      showToast("Job updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);

      if (err.status === 400 && Array.isArray(err.validationErrors)) {
        const newErrors = {};

        err.validationErrors.forEach((msg) => {
          const lowerMsg = msg.toLowerCase();

          if (lowerMsg.includes("title"))              newErrors.title = msg;
          else if (lowerMsg.includes("description"))   newErrors.description = msg;
          else if (lowerMsg.includes("requiredskills") || lowerMsg.includes("skill")) newErrors.requiredSkills = msg;
          else if (lowerMsg.includes("requirements"))  newErrors.requirements = msg;
          else if (lowerMsg.includes("benefits"))      newErrors.benefits = msg;
          else if (lowerMsg.includes("experiencelevel")) newErrors.experienceLevel = msg;
          else if (lowerMsg.includes("employmenttype")) newErrors.employmentType = msg;
          else if (lowerMsg.includes("jobmode"))       newErrors.jobMode = msg;
          else if (lowerMsg.includes("location"))      newErrors.location = msg;
          else if (
            lowerMsg.includes("salary") ||
            lowerMsg.includes("currency") ||
            lowerMsg.includes("period") ||
            lowerMsg.includes("min") ||
            lowerMsg.includes("max")
          ) {
            newErrors.salary = (newErrors.salary ? newErrors.salary + " • " : "") + msg;
          } else {
            setFormError((prev) => (prev ? `${prev}\n${msg}` : msg));
          }
        });

        setFieldErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && formError) {
          showToast(formError, "error");
        }
      } else {
        showToast(err.message || "Failed to update job", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
      hasError
        ? "border-red-500 focus:ring-red-500 bg-red-50"
        : "border-gray-300 focus:ring-primary focus:border-primary"
    }`;

  const getSelectErrorStyle = (hasError) =>
    hasError
      ? {
          control: (base) => ({
            ...base,
            borderColor: "#ef4444 !important",
            backgroundColor: "#fef2f2",
          }),
        }
      : selectStyles;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-10">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg whitespace-pre-line text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title *
            </label>
            <input
              className={inputClass(fieldErrors.title)}
              placeholder="e.g. Senior React Developer"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                clearError("title");
              }}
              required
            />
            {fieldErrors.title && <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Description *
            </label>
            <textarea
              className={inputClass(fieldErrors.description)}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                clearError("description");
              }}
              rows={6}
              required
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Required Skills *
            </label>
            <CreatableSelect
              isMulti
              styles={getSelectErrorStyle(fieldErrors.requiredSkills)}
              placeholder="Type skill and press enter (e.g. React, Node.js)..."
              value={form.requiredSkills}
              onChange={(v) => {
                setForm({ ...form, requiredSkills: v || [] });
                clearError("requiredSkills");
              }}
              menuPortalTarget={document.body}
            />
            {fieldErrors.requiredSkills && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.requiredSkills}</p>
            )}
          </div>

          {/* Experience | Employment Type | Job Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level *
              </label>
              <Select
                styles={getSelectErrorStyle(fieldErrors.experienceLevel)}
                placeholder="Select level"
                options={[
                  { value: "junior", label: "Junior" },
                  { value: "mid", label: "Mid-Level" },
                  { value: "senior", label: "Senior" },
                ]}
                value={form.experienceLevel}
                onChange={(v) => {
                  setForm({ ...form, experienceLevel: v });
                  clearError("experienceLevel");
                }}
                menuPortalTarget={document.body}
              />
              {fieldErrors.experienceLevel && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.experienceLevel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employment Type *
              </label>
              <Select
                styles={getSelectErrorStyle(fieldErrors.employmentType)}
                placeholder="Select type"
                options={[
                  { value: "full-time", label: "Full-time" },
                  { value: "part-time", label: "Part-time" },
                  { value: "internship", label: "Internship" },
                  { value: "contract", label: "Contract" },
                ]}
                value={form.employmentType}
                onChange={(v) => {
                  setForm({ ...form, employmentType: v });
                  clearError("employmentType");
                }}
                menuPortalTarget={document.body}
              />
              {fieldErrors.employmentType && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.employmentType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Mode *
              </label>
              <Select
                styles={getSelectErrorStyle(fieldErrors.jobMode)}
                placeholder="Select mode"
                options={[
                  { value: "remote", label: "Remote" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "onsite", label: "On-site" },
                ]}
                value={form.jobMode}
                onChange={(v) => {
                  setForm({ ...form, jobMode: v, location: v?.value === "remote" ? "Remote" : "" });
                  setTypingLocation(v?.value === "remote" ? "Remote" : "");
                  clearError("jobMode");
                  clearError("location");
                }}
                menuPortalTarget={document.body}
              />
              {fieldErrors.jobMode && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.jobMode}</p>
              )}
            </div>
          </div>

          {/* Location */}
          {(form.jobMode?.value === "hybrid" || form.jobMode?.value === "onsite") && (
            <div className="relative" ref={locationBoxRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location *
              </label>
              <input
                className={inputClass(fieldErrors.location)}
                placeholder="Search or type location (e.g. Karachi, Pakistan)"
                value={typingLocation}
                onChange={(e) => {
                  setTypingLocation(e.target.value);
                  setForm({ ...form, location: e.target.value });
                  clearError("location");
                }}
              />
              {locationSuggestions.length > 0 && (
                <ul className="absolute z-50 bg-white border w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                  {locationSuggestions.map((loc, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-gray-800"
                      onClick={() => {
                        setTypingLocation(loc);
                        setForm({ ...form, location: loc });
                        setLocationSuggestions([]);
                        clearError("location");
                      }}
                    >
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
              {typingLocation && locationSuggestions.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Using: <span className="font-medium">{typingLocation}</span>
                </p>
              )}
              {fieldErrors.location && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.location}</p>
              )}
            </div>
          )}

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency *
              </label>
              <Select
                styles={getSelectErrorStyle(fieldErrors.salary)}
                placeholder="Select currency"
                options={[
                  { value: "USD", label: "USD" },
                  { value: "PKR", label: "PKR" },
                  { value: "EUR", label: "EUR" },
                  { value: "GBP", label: "GBP" },
                  { value: "INR", label: "INR" },
                  { value: "CAD", label: "CAD" },
                ]}
                value={form.currency ? { value: form.currency, label: form.currency } : null}
                onChange={(v) => {
                  setForm({ ...form, currency: v?.value });
                  clearError("salary");
                }}
                menuPortalTarget={document.body}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Salary
              </label>
              <input
                type="number"
                className={inputClass(fieldErrors.salary)}
                placeholder="e.g. 50000"
                value={form.salaryMin}
                onChange={(e) => {
                  setForm({ ...form, salaryMin: e.target.value });
                  clearError("salary");
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Salary
              </label>
              <input
                type="number"
                className={inputClass(fieldErrors.salary)}
                placeholder="e.g. 120000"
                value={form.salaryMax}
                onChange={(e) => {
                  setForm({ ...form, salaryMax: e.target.value });
                  clearError("salary");
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Salary Period *
            </label>
            <Select
              styles={getSelectErrorStyle(fieldErrors.salary)}
              placeholder="Select period"
              options={[
                { value: "hour", label: "Per Hour" },
                { value: "month", label: "Per Month" },
                { value: "year", label: "Per Year" },
                { value: "project", label: "Per Project" },
                { value: "stipend", label: "Stipend" },
              ]}
              value={form.salaryPeriod}
              onChange={(v) => {
                setForm({ ...form, salaryPeriod: v });
                clearError("salary");
              }}
              menuPortalTarget={document.body}
            />
            {fieldErrors.salary && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.salary}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Requirements
            </label>
            <CreatableSelect
              isMulti
              styles={getSelectErrorStyle(fieldErrors.requirements)}
              placeholder="Add requirements (press enter)..."
              value={form.requirements}
              onChange={(v) => {
                setForm({ ...form, requirements: v || [] });
                clearError("requirements");
              }}
              menuPortalTarget={document.body}
            />
            {fieldErrors.requirements && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.requirements}</p>
            )}
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Benefits & Perks
            </label>
            <CreatableSelect
              isMulti
              styles={getSelectErrorStyle(fieldErrors.benefits)}
              placeholder="Add benefits (e.g. Health Insurance, Remote Work)..."
              value={form.benefits}
              onChange={(v) => {
                setForm({ ...form, benefits: v || [] });
                clearError("benefits");
              }}
              menuPortalTarget={document.body}
            />
            {fieldErrors.benefits && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.benefits}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 bg-primary text-white font-semibold rounded-xl shadow hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </div>
  );
}