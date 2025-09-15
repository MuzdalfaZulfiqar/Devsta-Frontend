// import { ArrowLeft, ArrowRight } from "lucide-react";
// import Select from "react-select";

// // Reverse maps for displaying current value
// const experienceMap = {
//   "Internship": "intern",
//   "Entry-level": "student",
//   "Junior": "junior",
//   "Mid-level": "mid",
//   "Senior": "senior",
//   "Lead": "lead",
//   "Manager": "lead",
// };
// const roleMap = {
//   "Frontend Developer": "frontend",
//   "Backend Developer": "backend",
//   "Full-Stack Developer": "fullstack",
//   "Data Scientist": "data-science",
//   "ML Engineer": "ml",
//   "Mobile Developer": "mobile",
//   "UI/UX Designer": "ui-ux",
// };

// const reverseExperienceMap = Object.fromEntries(
//   Object.entries(experienceMap).map(([k, v]) => [v, k])
// );
// const reverseRoleMap = Object.fromEntries(
//   Object.entries(roleMap).map(([k, v]) => [v, k])
// );

// const selectStyles = {
//   control: (base) => ({
//     ...base,
//     backgroundColor: "transparent",
//     borderColor: "#fff",
//     color: "#fff",
//     boxShadow: "none",
//     minHeight: "40px",
//     "&:hover": { borderColor: "#fff" },
//   }),
//   menu: (base) => ({
//     ...base,
//     backgroundColor: "#086972",
//     color: "#fff",
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isSelected ? "#ffffff33" : "#086972",
//     color: "#fff",
//     ":hover": { backgroundColor: "#ffffff55" },
//   }),
//   singleValue: (base) => ({ ...base, color: "#fff" }),
//   placeholder: (base) => ({ ...base, color: "#aaa" }),
// };

// export default function ExperienceStep({ formData, setFormData, nextStep, prevStep }) {
//   const experienceOptions = Object.keys(experienceMap).map(label => ({
//     value: experienceMap[label],
//     label,
//   }));
//   const roleOptions = Object.keys(roleMap).map(label => ({
//     value: roleMap[label],
//     label,
//   }));

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-bold text-primary">Step 2: Experience & Role</h2>

//       <div className="space-y-3">
//         <div>
//           <label className="text-sm font-medium mb-1 block">Experience Level</label>
//           <Select
//   options={experienceOptions}
//   value={experienceOptions.find(opt => opt.value === formData.experienceLevel) || null}
//   onChange={(selected) =>
//     setFormData(prev => ({ ...prev, experienceLevel: selected?.value || "" }))
//   }
//   styles={selectStyles}
//   placeholder="Select your level"
// />
//         </div>

//         <div>
//           <label className="text-sm font-medium mb-1 block">Primary Role</label>
//           <Select
//   options={roleOptions}
//   value={roleOptions.find(opt => opt.value === formData.primaryRole) || null}
//   onChange={(selected) =>
//     setFormData(prev => ({ ...prev, primaryRole: selected?.value || "" }))
//   }
//   styles={selectStyles}
//   placeholder="Select your role"
// />

//         </div>
//       </div>

//       <div className="flex justify-between pt-6">
//         <button
//           onClick={prevStep}
//           className="flex items-center gap-2 px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-primary transition"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>
//         <button
//           onClick={nextStep}
//           className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:bg-teal-700 transition"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
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
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
