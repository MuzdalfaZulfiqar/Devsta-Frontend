// // src/pages/company/CreateJob.jsx
// import { useState, useEffect, useRef } from "react";
// import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
// import { createJob } from "../../api/company/jobs";
// import SuccessModal from "../../components/SuccessModal";
// import ErrorModal from "../../components/ErrorModal";
// import CreatableSelect from "react-select/creatable";
// import Select from "react-select";
// import { MessageCircleWarning } from "lucide-react";

// // ✅ Shared dropdown styles
// const selectStyles = {
//   control: (base, state) => ({
//     ...base,
//     backgroundColor: "transparent",
//     borderColor: state.isFocused ? "#086972" : "#d1d5db",
//     borderRadius: "0.5rem",
//     boxShadow: "none",
//     "&:hover": { borderColor: "#086972" },
//     minHeight: "42px",
//   }),
//   menu: (base) => ({
//     ...base,
//     backgroundColor: "#ffffff",
//     zIndex: 50,
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isSelected
//       ? "#086972"
//       : state.isFocused
//         ? "#d1f2ec"
//         : "#ffffff",
//     color: state.isSelected ? "#ffffff" : "#000000",
//     cursor: "pointer",
//   }),
//   multiValue: (base) => ({
//     ...base,
//     backgroundColor: "#086972",
//   }),
//   multiValueLabel: (base) => ({ ...base, color: "#ffffff" }),
//   multiValueRemove: (base) => ({
//     ...base,
//     color: "#ffffff",
//     ":hover": { backgroundColor: "#065c63" },
//   }),
//   singleValue: (base) => ({ ...base, color: "#111827" }),
//   placeholder: (base) => ({ ...base, color: "#9ca3af" }),
// };

// export default function CreateJob() {
//   const locationBoxRef = useRef(null);
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
//     salaryPeriod: null,
//   });

//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [errorOpen, setErrorOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const [typingLocation, setTypingLocation] = useState("");
//   const [locationSuggestions, setLocationSuggestions] = useState([]);

//   const experienceOptions = [
//     { value: "junior", label: "Junior" },
//     { value: "mid", label: "Mid" },
//     { value: "senior", label: "Senior" },
//   ];

//   const employmentOptions = [
//     { value: "full-time", label: "Full-time" },
//     { value: "part-time", label: "Part-time" },
//     { value: "internship", label: "Internship" },
//     { value: "contract", label: "Contract" },
//   ];

//   const jobModeOptions = [
//     { value: "remote", label: "Remote" },
//     { value: "hybrid", label: "Hybrid" },
//     { value: "onsite", label: "Onsite" },
//   ];

//   const salaryPeriodOptions = [
//     { value: "hour", label: "Per Hour" },
//     { value: "month", label: "Per Month" },
//     { value: "year", label: "Per Year" },
//     { value: "project", label: "Per Project" },
//     { value: "stipend", label: "Stipend" },
//   ];


//   // ✅ Location suggestions (debounced + safe)
//   useEffect(() => {
//     if (!typingLocation) {
//       setLocationSuggestions([]);
//       return;
//     }

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

//   // ✅ Click outside → lock location
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         locationBoxRef.current &&
//         !locationBoxRef.current.contains(e.target)
//       ) {
//         if (!form.location && typingLocation) {
//           setForm((p) => ({ ...p, location: typingLocation }));
//         }
//         setLocationSuggestions([]);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [typingLocation, form.location]);

//   const resetForm = () => {
//     setForm({
//       title: "",
//       description: "",
//       requirements: [],
//       benefits: [],
//       requiredSkills: [],
//       experienceLevel: null,
//       employmentType: null,
//       jobMode: null,
//       location: "",
//       salaryMin: "",
//       salaryMax: "",
//       currency: "",
//       salaryPeriod: null,
//     });
//     setTypingLocation("");
//     setLocationSuggestions([]);
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // ✅ Final compulsory fields check
// if (
//   !form.title ||
//   !form.description ||
//   !form.requiredSkills.length ||
//   !form.experienceLevel ||
//   !form.employmentType ||
//   !form.jobMode ||
//   !form.currency ||
//   !form.salaryPeriod ||
//   !form.requirements.length ||
//   !form.benefits.length
// ) {
//   setModalMessage("All fields are compulsory. Please complete the form.");
//   setErrorOpen(true);
//   setLoading(false);
//   return;
// }

//     // ✅ Validate Job Mode
//     if (!form.jobMode?.value) {
//       setModalMessage("Please select job mode.");
//       setErrorOpen(true);
//       setLoading(false);
//       return;
//     }

//     // ✅ Validate Location for onsite/hybrid
//     if (
//       (form.jobMode.value === "onsite" || form.jobMode.value === "hybrid") &&
//       !form.location.trim()
//     ) {
//       setModalMessage("Location is required for onsite or hybrid jobs.");
//       setErrorOpen(true);
//       setLoading(false);
//       return;
//     }

//     // ✅ Validate Currency
//     if (!form.currency) {
//       setModalMessage("Please select a salary currency.");
//       setErrorOpen(true);
//       setLoading(false);
//       return;
//     }

//     if (!form.requirements.length) {
//       setModalMessage("Please add at least one job requirement.");
//       setErrorOpen(true);
//       setLoading(false);
//       return;
//     }

//     if (!form.salaryPeriod?.value) {
//       setModalMessage("Please select salary period.");
//       setErrorOpen(true);
//       setLoading(false);
//       return;
//     }


//     try {
//       await createJob({
//         title: form.title,
//         description: form.description,
//         requirements: form.requirements.map((r) => r.value),
//         benefits: form.benefits.map((b) => b.value),
//         requiredSkills: form.requiredSkills.map((s) => s.value),
//         experienceLevel: form.experienceLevel?.value,
//         employmentType: form.employmentType?.value,
//         jobMode: form.jobMode?.value,
//         location: form.jobMode.value === "remote" ? "Remote" : form.location,
//         salary: {
//           currency: form.currency,
//           min: form.salaryMin || undefined,
//           max: form.salaryMax || undefined,
//           period: form.salaryPeriod?.value,
//         },
//       });




//       setModalMessage("Job has been posted successfully.");
//       setSuccessOpen(true);
//       resetForm();
//     } catch (err) {
//       setModalMessage(err.message || "Failed to create job.");
//       setErrorOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <CompanyDashboardLayout>
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white border rounded-2xl shadow-sm p-8">
//           {/* <h1 className="text-3xl font-bold mb-6">Post a New Job</h1> */}
//           <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>

//           <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-700">
//             <MessageCircleWarning className="inline-block mr-2" size={20} />
//             All fields are mandatory. Please complete every section before posting the job.
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               placeholder="Job Title *"
//               className="input"
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               required
//             />

//             <textarea
//               placeholder="Job Description *"
//               className="input h-32"
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               required
//             />

//             <CreatableSelect
//               isMulti
//               placeholder="Required Skills *"
//               styles={selectStyles}
//               value={form.requiredSkills}
//               onChange={(v) => setForm({ ...form, requiredSkills: v })}
//             />

//             <Select
//               placeholder="Select Experience *"
//               styles={selectStyles}
//               options={experienceOptions}
//               value={form.experienceLevel}
//               onChange={(v) => setForm({ ...form, experienceLevel: v })}
//             />

//             <Select
//               placeholder="Select Employment Type *"
//               styles={selectStyles}
//               options={employmentOptions}
//               value={form.employmentType}
//               onChange={(v) => setForm({ ...form, employmentType: v })}
//             />

//             {/* ---------------- JOB MODE ---------------- */}
//             <Select
//               placeholder="Select Job Mode *"
//               styles={selectStyles}
//               options={jobModeOptions}
//               value={form.jobMode}
//               onChange={(v) =>
//                 setForm({ ...form, jobMode: v, location: "" })
//               }
//             />

//             {/* ---------------- LOCATION (ONLY FOR HYBRID/ONSITE) ---------------- */}
//             {(form.jobMode?.value === "hybrid" || form.jobMode?.value === "onsite") && (
//               <div className="relative mt-4" ref={locationBoxRef}>
//                 <input
//                   placeholder="Search or type location *"
//                   className="input"
//                   value={typingLocation}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     setTypingLocation(val);
//                     setForm((p) => ({ ...p, location: val }));
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       const finalLocation = locationSuggestions[0] || typingLocation;
//                       setTypingLocation(finalLocation);
//                       setForm((p) => ({ ...p, location: finalLocation }));
//                       setLocationSuggestions([]);
//                     }
//                   }}
//                 />

//                 {locationSuggestions.length > 0 && (
//                   <ul className="absolute z-50 bg-white border w-full mt-1 rounded-md shadow">
//                     {locationSuggestions.map((loc, i) => (
//                       <li
//                         key={i}
//                         className="px-4 py-2 hover:bg-primary/20 cursor-pointer"
//                         onClick={() => {
//                           setTypingLocation(loc);
//                           setForm((p) => ({ ...p, location: loc }));
//                           setLocationSuggestions([]);
//                         }}
//                       >
//                         {loc}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {typingLocation && locationSuggestions.length === 0 && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     Using custom location: <span className="font-semibold">{typingLocation}</span>
//                   </p>
//                 )}
//               </div>
//             )}


//             <div className="flex gap-4 mt-4 items-center">
//               {/* Currency */}
//               <div className="w-32">
//                 <Select
//                   placeholder="Currency *"
//                   styles={selectStyles}
//                   options={[
//                     { value: "USD", label: "USD" },
//                     { value: "CAD", label: "CAD" },
//                     { value: "PKR", label: "PKR" },
//                     { value: "EUR", label: "EUR" },
//                     { value: "GBP", label: "GBP" },
//                   ]}
//                   value={form.currency ? { value: form.currency, label: form.currency } : null}
//                   onChange={(v) => setForm({ ...form, currency: v.value })}
//                 />
//               </div>

//               {/* Min/Max Salary */}
//               <input
//                 placeholder="Min Salary *"
//                 className="input flex-1"
//                 value={form.salaryMin}
//                 onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
//               />
//               <input
//                 placeholder="Max Salary *"
//                 className="input flex-1"
//                 value={form.salaryMax}
//                 onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
//               />
//             </div>

//             <Select
//               placeholder="Salary Period *"
//               styles={selectStyles}
//               options={salaryPeriodOptions}
//               value={form.salaryPeriod}
//               onChange={(v) => setForm({ ...form, salaryPeriod: v })}
//             />


//             <CreatableSelect
//               isMulti
//               placeholder="Job Requirements (press enter to add new one) *"
//               styles={selectStyles}
//               value={form.requirements}
//               onChange={(v) => setForm({ ...form, requirements: v })}
//             />
//             <CreatableSelect
//               isMulti
//               placeholder="What benefits/perks will employees get? (press enter to add new one) *"
//               styles={selectStyles}
//               value={form.benefits}
//               onChange={(v) => setForm({ ...form, benefits: v })}
//             />



//             <button
//               disabled={loading}
//               className="w-full py-3 bg-primary text-white rounded-xl font-semibold"
//             >
//               {loading ? "Posting..." : "Post Job"}
//             </button>
//           </form>
//         </div>
//       </div>

//       <SuccessModal
//         open={successOpen}
//         message={modalMessage}
//         onClose={() => setSuccessOpen(false)}
//       />
//       <ErrorModal
//         open={errorOpen}
//         message={modalMessage}
//         onClose={() => setErrorOpen(false)}
//       />
//     </CompanyDashboardLayout>
//   );
// }


// src/pages/company/CreateJob.jsx
import { useState, useEffect, useRef } from "react";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { createJob } from "../../api/company/jobs";
import SuccessModal from "../../components/SuccessModal";
import { showToast } from "../../utils/toast";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { MessageCircleWarning } from "lucide-react";

// Shared dropdown styles
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
    zIndex: 50,
  }),
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

export default function CreateJob() {
  const locationBoxRef = useRef(null);

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

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const [typingLocation, setTypingLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Updated options to match schema enums
  const experienceOptions = [
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid-Level" },
    { value: "senior", label: "Senior" },
  ];

  const employmentOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
  ];

  const jobModeOptions = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" },
  ];

  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "PKR", label: "PKR" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "INR", label: "INR" },
    { value: "CAD", label: "CAD" },
  ];

  const salaryPeriodOptions = [
    { value: "hour", label: "Per Hour" },
    { value: "month", label: "Per Month" },
    { value: "year", label: "Per Year" },
    { value: "project", label: "Per Project" },
    { value: "stipend", label: "Stipend" },
  ];

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

  // Click outside → lock custom location
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

  const clearError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  const resetForm = () => {
    setForm({
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
    setTypingLocation("");
    setLocationSuggestions([]);
    setFieldErrors({});
    setFormError(null);
  };

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

      // Clean payload
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || (Array.isArray(payload[key]) && !payload[key].length)) {
          delete payload[key];
        }
      });
      if (payload.salary) {
        Object.keys(payload.salary).forEach((key) => {
          if (payload.salary[key] === undefined) delete payload.salary[key];
        });
        if (Object.keys(payload.salary).length === 0) delete payload.salary;
      }

      await createJob(payload);

      showToast("Job posted successfully!", "success");
      setSuccessOpen(true);
      resetForm();
    } catch (err) {
      console.error("Create job failed:", err);

      if (err.status === 400 && Array.isArray(err.validationErrors)) {
        const newErrors = {};

        err.validationErrors.forEach((msg) => {
          const lower = msg.toLowerCase();

          if (lower.includes("title")) newErrors.title = msg;
          else if (lower.includes("description")) newErrors.description = msg;
          else if (lower.includes("requiredskills") || lower.includes("skill")) newErrors.requiredSkills = msg;
          else if (lower.includes("requirements")) newErrors.requirements = msg;
          else if (lower.includes("benefits")) newErrors.benefits = msg;
          else if (lower.includes("experiencelevel")) newErrors.experienceLevel = msg;
          else if (lower.includes("employmenttype")) newErrors.employmentType = msg;
          else if (lower.includes("jobmode")) newErrors.jobMode = msg;
          else if (lower.includes("location")) newErrors.location = msg;
          else if (lower.includes("salary") || lower.includes("currency") || lower.includes("period")) {
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
        showToast(err.message || "Failed to create job", "error");
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

  return (
    <CompanyDashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>

          <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex items-start gap-2">
            <MessageCircleWarning className="mt-0.5" size={20} />
            All required fields are marked. Validation messages will appear below fields if something is invalid.
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg whitespace-pre-line text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                className={inputClass(fieldErrors.title)}
                placeholder="e.g. Senior Full-Stack Developer"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
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
              {fieldErrors.description && <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>}
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills *</label>
              <CreatableSelect
                isMulti
                styles={getSelectErrorStyle(fieldErrors.requiredSkills)}
                placeholder="Type skill and press enter..."
                value={form.requiredSkills}
                onChange={(v) => {
                  setForm({ ...form, requiredSkills: v || [] });
                  clearError("requiredSkills");
                }}
                menuPortalTarget={document.body}
              />
              {fieldErrors.requiredSkills && <p className="mt-1 text-sm text-red-600">{fieldErrors.requiredSkills}</p>}
            </div>

            {/* Experience | Employment | Job Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
                <Select
                  styles={getSelectErrorStyle(fieldErrors.experienceLevel)}
                  placeholder="Select level"
                  options={experienceOptions}
                  value={form.experienceLevel}
                  onChange={(v) => {
                    setForm({ ...form, experienceLevel: v });
                    clearError("experienceLevel");
                  }}
                  menuPortalTarget={document.body}
                />
                {fieldErrors.experienceLevel && <p className="mt-1 text-sm text-red-600">{fieldErrors.experienceLevel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                <Select
                  styles={getSelectErrorStyle(fieldErrors.employmentType)}
                  placeholder="Select type"
                  options={employmentOptions}
                  value={form.employmentType}
                  onChange={(v) => {
                    setForm({ ...form, employmentType: v });
                    clearError("employmentType");
                  }}
                  menuPortalTarget={document.body}
                />
                {fieldErrors.employmentType && <p className="mt-1 text-sm text-red-600">{fieldErrors.employmentType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Mode *</label>
                <Select
                  styles={getSelectErrorStyle(fieldErrors.jobMode)}
                  placeholder="Select mode"
                  options={jobModeOptions}
                  value={form.jobMode}
                  onChange={(v) => {
                    setForm({
                      ...form,
                      jobMode: v,
                      location: v?.value === "remote" ? "Remote" : "",
                    });
                    setTypingLocation(v?.value === "remote" ? "Remote" : "");
                    clearError("jobMode");
                    clearError("location");
                  }}
                  menuPortalTarget={document.body}
                />
                {fieldErrors.jobMode && <p className="mt-1 text-sm text-red-600">{fieldErrors.jobMode}</p>}
              </div>
            </div>

            {/* Location */}
            {(form.jobMode?.value === "hybrid" || form.jobMode?.value === "onsite") && (
              <div className="relative" ref={locationBoxRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  className={inputClass(fieldErrors.location)}
                  placeholder="e.g. Karachi, Pakistan"
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
                {fieldErrors.location && <p className="mt-1 text-sm text-red-600">{fieldErrors.location}</p>}
              </div>
            )}

            {/* Salary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                <Select
                  styles={getSelectErrorStyle(fieldErrors.salary)}
                  placeholder="Select currency"
                  options={currencyOptions}
                  value={form.currency ? { value: form.currency, label: form.currency } : null}
                  onChange={(v) => {
                    setForm({ ...form, currency: v?.value });
                    clearError("salary");
                  }}
                  menuPortalTarget={document.body}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                <input
                  type="number"
                  className={inputClass(fieldErrors.salary)}
                  placeholder="e.g. 150000"
                  value={form.salaryMax}
                  onChange={(e) => {
                    setForm({ ...form, salaryMax: e.target.value });
                    clearError("salary");
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Period *</label>
              <Select
                styles={getSelectErrorStyle(fieldErrors.salary)}
                placeholder="Select period"
                options={salaryPeriodOptions}
                value={form.salaryPeriod}
                onChange={(v) => {
                  setForm({ ...form, salaryPeriod: v });
                  clearError("salary");
                }}
                menuPortalTarget={document.body}
              />
              {fieldErrors.salary && <p className="mt-1 text-sm text-red-600">{fieldErrors.salary}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Requirements *</label>
              <CreatableSelect
                isMulti
                styles={getSelectErrorStyle(fieldErrors.requirements)}
                placeholder="Add requirement (press enter)..."
                value={form.requirements}
                onChange={(v) => {
                  setForm({ ...form, requirements: v || [] });
                  clearError("requirements");
                }}
                menuPortalTarget={document.body}
              />
              {fieldErrors.requirements && <p className="mt-1 text-sm text-red-600">{fieldErrors.requirements}</p>}
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Benefits & Perks</label>
              <CreatableSelect
                isMulti
                styles={getSelectErrorStyle(fieldErrors.benefits)}
                placeholder="Add benefit/perk (press enter)..."
                value={form.benefits}
                onChange={(v) => {
                  setForm({ ...form, benefits: v || [] });
                  clearError("benefits");
                }}
                menuPortalTarget={document.body}
              />
              {fieldErrors.benefits && <p className="mt-1 text-sm text-red-600">{fieldErrors.benefits}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-6 bg-primary text-white font-semibold rounded-xl shadow hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        message="Job has been posted successfully!"
        onClose={() => setSuccessOpen(false)}
      />
    </CompanyDashboardLayout>
  );
}