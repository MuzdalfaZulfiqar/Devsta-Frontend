// import { useEffect, useState } from "react";
// import Select from "react-select";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { BACKEND_URL } from "../../../config";   // adjust path if needed

// export default function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
//   const [skillsOptions, setSkillsOptions] = useState([]);
//   const [touched, setTouched] = useState(false);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/skills`);
//         if (!res.ok) throw new Error("Failed to fetch skills");
//         const data = await res.json();
//         setSkillsOptions(data.map(s => ({ value: s.key, label: s.label })));
//       } catch (err) {
//         console.error("Failed to fetch skills:", err);
//       }
//     };
//     fetchSkills();
//   }, []);

//   const hasSkills = Array.isArray(formData.topSkills) && formData.topSkills.length > 0;

//   const handleNext = () => {
//     if (!hasSkills) {
//       setTouched(true); // show error
//       return;
//     }
//     nextStep();
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold text-primary">Skills</h2>
//       <p className="text-sm text-gray-400">
//         Select your top skills to showcase your expertise.
//       </p>

//       <div>
//         <label className="block text-sm font-medium mb-1">
//           Top Skills (choose at least one) <span className="text-red-500">*</span>
//         </label>
//         <Select
//           isMulti
//           value={skillsOptions.filter(o => formData.topSkills.includes(o.value))}
//           onChange={(selected) =>
//             setFormData({ topSkills: selected.map(s => s.value) })
//           }
//           onBlur={() => setTouched(true)}
//           options={skillsOptions}
//           styles={{
//             control: (base) => ({
//               ...base,
//               backgroundColor: "transparent",
//               borderColor: "#fff",
//               color: "#fff",
//               boxShadow: "none",
//               minHeight: "40px",
//               "&:hover": { borderColor: "#fff" },
//             }),
//             menu: (base) => ({ ...base, backgroundColor: "#086972", color: "#fff" }),
//             option: (base, state) => ({
//               ...base,
//               backgroundColor: state.isSelected ? "#ffffff33" : "#086972",
//               color: "#fff",
//               ":hover": { backgroundColor: "#ffffff55" },
//             }),
//             multiValue: (base) => ({ ...base, backgroundColor: "#ffffff33", color: "#fff" }),
//             multiValueLabel: (base) => ({ ...base, color: "#fff" }),
//             singleValue: (base) => ({ ...base, color: "#fff" }),
//           }}
//         />
//         {!hasSkills && touched && (
//           <p className="text-red-500 text-xs mt-1">
//             Please select at least one skill.
//           </p>
//         )}
//       </div>

//       <div className="flex justify-between pt-6">
//         <button
//           type="button"
//           onClick={prevStep}
//           className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>
//         <button
//           type="button"
//           onClick={handleNext}
//           className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import Select from "react-select";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { BACKEND_URL } from "../../../config";

// export default function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
//   const [skillsOptions, setSkillsOptions] = useState([]);
//   const [touched, setTouched] = useState(false);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/skills`);
//         if (!res.ok) throw new Error("Failed to fetch skills");
//         const data = await res.json();
//         setSkillsOptions(data.map((s) => ({ value: s.key, label: s.label })));
//       } catch (err) {
//         console.error("Failed to fetch skills:", err);
//       }
//     };
//     fetchSkills();
//   }, []);

//   const hasSkills = Array.isArray(formData.topSkills) && formData.topSkills.length > 0;

//   const handleNext = () => {
//     if (!hasSkills) {
//       setTouched(true);
//       return;
//     }
//     nextStep();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Description */}
//       <p className="text-sm text-gray-400">
//         Select your top skills to showcase your expertise.
//       </p>

//       {/* Skills Dropdown */}
//       <div>
//         <label className="block text-sm font-medium mb-1">
//           Top Skills (choose at least one) <span className="text-red-500">*</span>
//         </label>
//         <Select
//   isMulti
//   value={skillsOptions.filter((o) => formData.topSkills.includes(o.value))}
//   onChange={(selected) =>
//     setFormData({ topSkills: selected.map((s) => s.value) })
//   }
//   onBlur={() => setTouched(true)}
//   options={skillsOptions}
//   placeholder="Select your skills"
//   styles={{
//    control: (base, state) => ({
//   ...base,
//   backgroundColor: "transparent",
//   borderColor: state.isFocused
//     ? "#086972" // teal focus
//     : "#9ca3af", // subtle gray when idle
//   borderRadius: "0.5rem",
//   boxShadow: "none",
//   "&:hover": { borderColor: "#086972" },
//   minHeight: "42px",
//   color: "#fff",
//   transition: "border-color 0.2s ease",
// }),

//     menu: (base) => ({
//       ...base,
//       backgroundColor: "#0b0c10",
//       color: "#fff",
//       zIndex: 50,
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "#14b8a6"
//         : state.isFocused
//         ? "#115e59"
//         : "#0b0c10",
//       color: "#fff",
//       cursor: "pointer",
//     }),
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: "#115e59",
//       color: "#fff",
//       borderRadius: "6px",
//       paddingInline: "2px",
//     }),
//     multiValueLabel: (base) => ({
//       ...base,
//       color: "#fff",
//     }),
//     multiValueRemove: (base) => ({
//       ...base,
//       color: "#fff",
//       ":hover": {
//         backgroundColor: "#14b8a6",
//         color: "#000",
//       },
//     }),
//     singleValue: (base) => ({ ...base, color: "#fff" }),
//     placeholder: (base) => ({ ...base, color: "#9ca3af" }),
//   }}
// />

//         {!hasSkills && touched && (
//           <p className="text-red-500 text-xs mt-1">
//             Please select at least one skill.
//           </p>
//         )}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-between pt-6">
//         {/* Back Button (Visible & consistent) */}
//         <button
//   type="button"
//   onClick={prevStep}
//   className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 
//              text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
//              transition-colors"
// >
//   <ArrowLeft size={16} /> Back
// </button>


//         {/* Next Button */}
//         <button
//           type="button"
//           onClick={handleNext}
//           className="flex items-center gap-2 px-6 py-2 rounded bg-primary text-white hover:bg-[#0a7f80] transition-all"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import Select from "react-select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BACKEND_URL } from "../../../config";

export default function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/skills`);
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        setSkillsOptions(data.map((s) => ({ value: s.key, label: s.label })));
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };
    fetchSkills();
  }, []);

  const hasSkills = Array.isArray(formData.topSkills) && formData.topSkills.length > 0;

  const handleNext = () => {
    if (!hasSkills) {
      setTouched(true);
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Select your top skills to showcase your expertise.
      </p>

      {/* Skills Dropdown */}
      <div>
        <label className="text-sm font-semibold mb-1 block text-gray-800 dark:text-gray-200">
          Top Skills (choose at least one) <span className="text-red-500">*</span>
        </label>
        <Select
          isMulti
          value={skillsOptions.filter((o) => formData.topSkills.includes(o.value))}
          onChange={(selected) =>
            setFormData({ topSkills: selected.map((s) => s.value) })
          }
          onBlur={() => setTouched(true)}
          options={skillsOptions}
          placeholder="Select your skills"
          styles={{
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
  backgroundColor: (() => {
    if (state.isSelected) return "#086972";         // ✅ selected = solid primary
    if (state.isFocused) return "#d1f2ec";          // ✅ hover = light teal
    return "#ffffff";                               // default
  })(),
  color: state.isSelected ? "#ffffff" : "#000000",
  cursor: "pointer",
  transition: "background-color 0.2s ease, color 0.2s ease",
  fontWeight: state.isSelected ? 600 : 400,         // ✅ slightly bolder selected text
  ":active": {
    backgroundColor: "#086972",                     // ✅ when clicked
    color: "#ffffff",
  },
}),


  multiValue: (base) => ({
    ...base,
    backgroundColor: "#086972", // ✅ selected pill = brand primary
    color: "#ffffff",
    borderRadius: "6px",
    paddingInline: "4px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "#ffffff", // ✅ white text inside chip
    fontWeight: 500,
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#ffffff",
    ":hover": {
      backgroundColor: "#065c63", // ✅ darker primary hover
      color: "#ffffff",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
}}

        />
        {!hasSkills && touched && (
          <p className="text-red-500 text-xs mt-1">
            Please select at least one skill.
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 
                     text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
            hasSkills
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
