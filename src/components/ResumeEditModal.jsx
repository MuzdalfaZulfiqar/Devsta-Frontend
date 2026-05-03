// // src/components/ResumeEditModal.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../../config";
// import { useAuth } from "../context/AuthContext";

// const emptyExperience = () => ({
//   position: "",
//   company: "",
//   start_date: "",
//   end_date: "",
//   description: "",
// });

// const emptyEducation = () => ({
//   degree: "",
//   field: "",
//   institution: "",
//   start_year: "",
//   end_year: "",
// });

// const emptyProject = () => ({
//   name: "",
//   description: "",
//   tech_stack: [],
//   github_url: "",
//   live_url: "",
// });

// const emptyCustomSection = () => ({
//   title: "Custom Section",
//   items: [{ title: "", subtitle: "", date: "", description: "", url: "" }],
// });

// export default function ResumeEditModal({ isOpen, onClose, onSuccess }) {
//   const { user, token } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [resumeJson, setResumeJson] = useState(null);

//   const scanMessages = [
//     "Saving your changes...",
//     "Rebuilding PDF with latest data...",
//     "Applying typography & spacing...",
//     "Updating your resume...",
//   ];
//   const [messageIndex, setMessageIndex] = useState(0);

//   useEffect(() => {
//     if (!saving) return;
//     const interval = setInterval(() => {
//       setMessageIndex((p) => (p + 1) % scanMessages.length);
//     }, 1500);
//     return () => clearInterval(interval);
//   }, [saving]);

//   useEffect(() => {
//     if (!isOpen || !user?._id || !token) return;

//     const run = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/resume/json/${user._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data?.resumeJson;
//         setResumeJson({
//           name: data?.name || "",
//           email: data?.email || "",
//           phone: data?.phone || "",
//           github_url: data?.github_url || "",
//           summary: data?.summary || "",
//           skills: Array.isArray(data?.skills) ? data.skills : [],
//           experience: Array.isArray(data?.experience) ? data.experience : [],
//           education: Array.isArray(data?.education) ? data.education : [],
//           projects: Array.isArray(data?.projects) ? data.projects : [],
//           additional_sections: Array.isArray(data?.additional_sections) ? data.additional_sections : [],
//         });
//       } catch (e) {
//         console.error(e);
//         setError(e.response?.data?.error || "Failed to load resume. Generate it first.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     run();
//   }, [isOpen, user?._id, token]);

//   useEffect(() => {
//     if (!isOpen) {
//       setResumeJson(null);
//       setError("");
//       setLoading(false);
//       setSaving(false);
//       setMessageIndex(0);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const update = (key, value) => setResumeJson((p) => ({ ...p, [key]: value }));

//   const updateArrItem = (key, idx, field, value) => {
//     setResumeJson((p) => ({
//       ...p,
//       [key]: p[key].map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
//     }));
//   };

//   const addItem = (key, factory) => {
//     setResumeJson((p) => ({
//       ...p,
//       [key]: [...(p[key] || []), factory()],
//     }));
//   };

//   const removeItem = (key, idx) => {
//     setResumeJson((p) => ({
//       ...p,
//       [key]: p[key].filter((_, i) => i !== idx),
//     }));
//   };

//   const addCustomSection = () => {
//     setResumeJson((p) => ({
//       ...p,
//       additional_sections: [...(p.additional_sections || []), emptyCustomSection()],
//     }));
//   };

//   const addCustomSectionItem = (secIdx) => {
//     setResumeJson((p) => ({
//       ...p,
//       additional_sections: p.additional_sections.map((sec, i) =>
//         i === secIdx
//           ? { ...sec, items: [...(sec.items || []), { title: "", subtitle: "", date: "", description: "", url: "" }] }
//           : sec
//       ),
//     }));
//   };

//   const updateCustomSection = (secIdx, field, value) => {
//     setResumeJson((p) => ({
//       ...p,
//       additional_sections: p.additional_sections.map((sec, i) =>
//         i === secIdx ? { ...sec, [field]: value } : sec
//       ),
//     }));
//   };

//   const updateCustomSectionItem = (secIdx, itemIdx, field, value) => {
//     setResumeJson((p) => ({
//       ...p,
//       additional_sections: p.additional_sections.map((sec, i) => {
//         if (i !== secIdx) return sec;
//         return {
//           ...sec,
//           items: (sec.items || []).map((it, j) => (j === itemIdx ? { ...it, [field]: value } : it)),
//         };
//       }),
//     }));
//   };

//   const handleSave = async () => {
//     if (!resumeJson || saving) return;

//     setSaving(true);
//     setError("");
//     setMessageIndex(0);

//     try {
//       await axios.put(
//         `${BACKEND_URL}/api/resume/json`,
//         { resumeJson },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       onSuccess?.();
//       onClose();
//     } catch (e) {
//       console.error(e);
//       setError(e.response?.data?.error || "Failed to save. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto pt-8 pb-16">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4">
//         <div className="px-6 py-5 border-b flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">Edit Resume</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">
//             ✕
//           </button>
//         </div>

//         {loading ? (
//           <div className="p-10 text-center text-gray-500">Loading resume...</div>
//         ) : saving ? (
//           <div className="p-0">
//             <div className="relative h-[380px] bg-gray-50 overflow-hidden rounded-b-2xl">
//               <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8 text-center">
//                 <p className="text-xl font-medium text-gray-800 mb-4">
//                   {scanMessages[messageIndex]}
//                 </p>
//                 <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-linear"
//                     style={{ width: `${((messageIndex + 1) / scanMessages.length) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="p-8 text-center text-red-600">{error}</div>
//         ) : (
//           resumeJson && (
//             <div className="p-6 space-y-10 max-h-[75vh] overflow-y-auto">
//               {/* Basic */}
//               <section>
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   {[
//                     { key: "name", label: "Full Name", placeholder: "John Doe" },
//                     { key: "email", label: "Email", placeholder: "john@example.com" },
//                     { key: "phone", label: "Phone", placeholder: "+92 300 1234567" },
//                     { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/username" },
//                   ].map(({ key, label, placeholder }) => (
//                     <div key={key} className="space-y-1">
//                       <label className="block text-sm font-medium text-gray-700">{label}</label>
//                       <input
//                         type="text"
//                         value={resumeJson[key] || ""}
//                         onChange={(e) => update(key, e.target.value)}
//                         placeholder={placeholder}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                     </div>
//                   ))}

//                   <div className="md:col-span-2 space-y-1">
//                     <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
//                     <textarea
//                       value={resumeJson.summary || ""}
//                       onChange={(e) => update("summary", e.target.value)}
//                       placeholder="3–5 lines summary..."
//                       rows={4}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                   </div>
//                 </div>
//               </section>

//               {/* Skills */}
//               <section>
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
//                 </div>
//                 <input
//                   type="text"
//                   value={(resumeJson.skills || []).join(", ")}
//                   onChange={(e) =>
//                     update(
//                       "skills",
//                       e.target.value
//                         .split(",")
//                         .map((s) => s.trim())
//                         .filter(Boolean)
//                     )
//                   }
//                   placeholder="React, Node.js, MongoDB..."
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </section>

//               {/* Experience */}
//               <section>
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
//                   <button
//                     type="button"
//                     onClick={() => addItem("experience", emptyExperience)}
//                     className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     + Add Experience
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {(resumeJson.experience || []).map((exp, idx) => (
//                     <div key={idx} className="p-5 border rounded-xl bg-gray-50/40">
//                       <div className="flex justify-end">
//                         <button
//                           type="button"
//                           onClick={() => removeItem("experience", idx)}
//                           className="text-sm text-red-600 hover:underline"
//                         >
//                           Remove
//                         </button>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">Position</label>
//                           <input
//                             value={exp.position || ""}
//                             onChange={(e) => updateArrItem("experience", idx, "position", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">Company</label>
//                           <input
//                             value={exp.company || ""}
//                             onChange={(e) => updateArrItem("experience", idx, "company", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">Start (YYYY-MM)</label>
//                           <input
//                             type="month"
//                             value={exp.start_date || ""}
//                             onChange={(e) => updateArrItem("experience", idx, "start_date", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">End (blank = present)</label>
//                           <input
//                             type="month"
//                             value={exp.end_date || ""}
//                             onChange={(e) => updateArrItem("experience", idx, "end_date", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                       </div>

//                       <div className="mt-4">
//                         <label className="block text-sm text-gray-600 mb-1">Description</label>
//                         <textarea
//                           rows={4}
//                           value={exp.description || ""}
//                           onChange={(e) => updateArrItem("experience", idx, "description", e.target.value)}
//                           className="w-full px-4 py-2 border rounded-lg"
//                           placeholder="• Achievement 1
// • Achievement 2"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Projects */}
//               <section>
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
//                   <button
//                     type="button"
//                     onClick={() => addItem("projects", emptyProject)}
//                     className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     + Add Project
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {(resumeJson.projects || []).map((proj, idx) => (
//                     <div key={idx} className="p-5 border rounded-xl bg-gray-50/40">
//                       <div className="flex justify-end">
//                         <button
//                           type="button"
//                           onClick={() => removeItem("projects", idx)}
//                           className="text-sm text-red-600 hover:underline"
//                         >
//                           Remove
//                         </button>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//                         <div className="md:col-span-2">
//                           <label className="block text-sm text-gray-600 mb-1">Project Name</label>
//                           <input
//                             value={proj.name || ""}
//                             onChange={(e) => updateArrItem("projects", idx, "name", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">GitHub URL</label>
//                           <input
//                             value={proj.github_url || ""}
//                             onChange={(e) => updateArrItem("projects", idx, "github_url", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">Live URL</label>
//                           <input
//                             value={proj.live_url || ""}
//                             onChange={(e) => updateArrItem("projects", idx, "live_url", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>

//                         <div className="md:col-span-2">
//                           <label className="block text-sm text-gray-600 mb-1">Tech Stack</label>
//                           <input
//                             value={(proj.tech_stack || []).join(", ")}
//                             onChange={(e) =>
//                               updateArrItem(
//                                 "projects",
//                                 idx,
//                                 "tech_stack",
//                                 e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
//                               )
//                             }
//                             className="w-full px-4 py-2 border rounded-lg"
//                             placeholder="React, Node.js, MongoDB..."
//                           />
//                         </div>
//                       </div>

//                       <div className="mt-4">
//                         <label className="block text-sm text-gray-600 mb-1">Description</label>
//                         <textarea
//                           rows={4}
//                           value={proj.description || ""}
//                           onChange={(e) => updateArrItem("projects", idx, "description", e.target.value)}
//                           className="w-full px-4 py-2 border rounded-lg"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Education */}
//               <section>
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Education</h3>
//                   <button
//                     type="button"
//                     onClick={() => addItem("education", emptyEducation)}
//                     className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     + Add Education
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {(resumeJson.education || []).map((edu, idx) => (
//                     <div key={idx} className="p-5 border rounded-xl bg-gray-50/40">
//                       <div className="flex justify-end">
//                         <button
//                           type="button"
//                           onClick={() => removeItem("education", idx)}
//                           className="text-sm text-red-600 hover:underline"
//                         >
//                           Remove
//                         </button>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">Degree</label>
//                           <input
//                             value={edu.degree || ""}
//                             onChange={(e) => updateArrItem("education", idx, "degree", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">Field</label>
//                           <input
//                             value={edu.field || ""}
//                             onChange={(e) => updateArrItem("education", idx, "field", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                         <div className="md:col-span-2">
//                           <label className="block text-sm text-gray-600 mb-1">Institution</label>
//                           <input
//                             value={edu.institution || ""}
//                             onChange={(e) => updateArrItem("education", idx, "institution", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">Start Year</label>
//                           <input
//                             value={edu.start_year || ""}
//                             onChange={(e) => updateArrItem("education", idx, "start_year", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-gray-600 mb-1">End Year</label>
//                           <input
//                             value={edu.end_year || ""}
//                             onChange={(e) => updateArrItem("education", idx, "end_year", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Custom Sections */}
//               <section>
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Custom Sections</h3>
//                   <button
//                     type="button"
//                     onClick={addCustomSection}
//                     className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90"
//                   >
//                     + Add Section
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {(resumeJson.additional_sections || []).map((sec, secIdx) => (
//                     <div key={secIdx} className="p-5 border rounded-xl bg-gray-50/40">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="md:col-span-2">
//                           <label className="block text-sm text-gray-600 mb-1">Section Title</label>
//                           <input
//                             value={sec.title || ""}
//                             onChange={(e) => updateCustomSection(secIdx, "title", e.target.value)}
//                             className="w-full px-4 py-2 border rounded-lg"
//                           />
//                         </div>
//                       </div>

//                       <div className="flex justify-between items-center mt-4">
//                         <div className="text-sm font-medium text-gray-700">Items</div>
//                         <button
//                           type="button"
//                           onClick={() => addCustomSectionItem(secIdx)}
//                           className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
//                         >
//                           + Add Item
//                         </button>
//                       </div>

//                       <div className="mt-3 space-y-3">
//                         {(sec.items || []).map((it, itemIdx) => (
//                           <div key={itemIdx} className="p-4 bg-white border rounded-xl">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                               <input
//                                 value={it.title || ""}
//                                 onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, "title", e.target.value)}
//                                 placeholder="Title"
//                                 className="w-full px-3 py-2 border rounded-lg"
//                               />
//                               <input
//                                 value={it.subtitle || ""}
//                                 onChange={(e) =>
//                                   updateCustomSectionItem(secIdx, itemIdx, "subtitle", e.target.value)
//                                 }
//                                 placeholder="Subtitle"
//                                 className="w-full px-3 py-2 border rounded-lg"
//                               />
//                               <input
//                                 value={it.date || ""}
//                                 onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, "date", e.target.value)}
//                                 placeholder="Date (e.g. 2025)"
//                                 className="w-full px-3 py-2 border rounded-lg"
//                               />
//                               <input
//                                 value={it.url || ""}
//                                 onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, "url", e.target.value)}
//                                 placeholder="URL (optional)"
//                                 className="w-full px-3 py-2 border rounded-lg"
//                               />
//                               <textarea
//                                 value={it.description || ""}
//                                 onChange={(e) =>
//                                   updateCustomSectionItem(secIdx, itemIdx, "description", e.target.value)
//                                 }
//                                 placeholder="Description"
//                                 rows={3}
//                                 className="w-full px-3 py-2 border rounded-lg md:col-span-2"
//                               />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           )
//         )}

//         <div className="px-6 py-5 border-t bg-gray-50 flex items-center justify-end gap-4 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
//             disabled={saving}
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSave}
//             disabled={saving || loading || !resumeJson}
//             className={`px-8 py-2.5 rounded-lg font-medium text-white min-w-[180px] transition ${
//               saving || loading || !resumeJson ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             Save & Update PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useAuth } from "../context/AuthContext";
import {
  X, ChevronDown, ChevronUp, Plus, Trash2, Loader2,
  CheckCircle, User, Briefcase, GraduationCap, Layers, FolderOpen, Tag,
} from "lucide-react";

// ─── Small helpers ────────────────────────────────────────────────────────────
function TagInput({ values = [], onChange, placeholder }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };
  const remove = (idx) => onChange(values.filter((_, i) => i !== idx));
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
            {v}
            <button onClick={() => remove(i)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={placeholder || "Type and press Enter"}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
        />
        <button onClick={add} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm">Add</button>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{children}</label>;
}

function TextInput({ value, onChange, placeholder, multiline, rows = 3 }) {
  const base = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-gray-800 placeholder-gray-300";
  return multiline
    ? <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${base} resize-none`} />
    : <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />;
}

// ─── Section wrapper with collapse ───────────────────────────────────────────
function Section({ icon: Icon, title, iconColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${iconColor}18` }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <span className="font-semibold text-gray-900 text-sm flex-1">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 py-5">{children}</div>}
    </div>
  );
}

// ─── Experience entry editor ──────────────────────────────────────────────────
function ExperienceEditor({ entries, onChange }) {
  const update = (idx, field, val) => {
    const next = [...entries];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const remove = (idx) => onChange(entries.filter((_, i) => i !== idx));
  const add = () => onChange([...entries, { position: "", company: "", start_date: "", end_date: "", description: "" }]);

  return (
    <div className="space-y-4">
      {entries.map((exp, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role {idx + 1}</span>
            <button onClick={() => remove(idx)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Job title</FieldLabel>
              <TextInput value={exp.position} onChange={(v) => update(idx, "position", v)} placeholder="Software Engineer" />
            </div>
            <div>
              <FieldLabel>Company</FieldLabel>
              <TextInput value={exp.company} onChange={(v) => update(idx, "company", v)} placeholder="Acme Corp" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Start (YYYY-MM)</FieldLabel>
              <TextInput value={exp.start_date} onChange={(v) => update(idx, "start_date", v)} placeholder="2022-01" />
            </div>
            <div>
              <FieldLabel>End (YYYY-MM or blank)</FieldLabel>
              <TextInput value={exp.end_date} onChange={(v) => update(idx, "end_date", v)} placeholder="Present" />
            </div>
          </div>
          <div>
            <FieldLabel>Bullet points (one per line, start with •)</FieldLabel>
            <TextInput value={exp.description} onChange={(v) => update(idx, "description", v)}
              placeholder={"• Led migration to microservices, reducing deploy time by 40%\n• Mentored 3 junior engineers"} multiline rows={4} />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all text-sm font-medium">
        <Plus className="w-4 h-4" /> Add role
      </button>
    </div>
  );
}

// ─── Project entry editor ─────────────────────────────────────────────────────
function ProjectEditor({ entries, onChange }) {
  const update = (idx, field, val) => {
    const next = [...entries];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const remove = (idx) => onChange(entries.filter((_, i) => i !== idx));
  const add = () => onChange([...entries, { name: "", description: "", tech_stack: [], github_url: "", live_url: "" }]);

  return (
    <div className="space-y-4">
      {entries.map((proj, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project {idx + 1}</span>
            <button onClick={() => remove(idx)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <FieldLabel>Project name</FieldLabel>
            <TextInput value={proj.name} onChange={(v) => update(idx, "name", v)} placeholder="My Awesome Project" />
          </div>
          <div>
            <FieldLabel>Description (2-3 sentences)</FieldLabel>
            <TextInput value={proj.description} onChange={(v) => update(idx, "description", v)} multiline rows={3}
              placeholder="A full-stack app that does X. Built with Y and Z. Achieved W." />
          </div>
          <div>
            <FieldLabel>Tech stack</FieldLabel>
            <TagInput values={proj.tech_stack || []} onChange={(v) => update(idx, "tech_stack", v)} placeholder="React, Node.js…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>GitHub URL</FieldLabel>
              <TextInput value={proj.github_url} onChange={(v) => update(idx, "github_url", v)} placeholder="https://github.com/…" />
            </div>
            <div>
              <FieldLabel>Live URL</FieldLabel>
              <TextInput value={proj.live_url} onChange={(v) => update(idx, "live_url", v)} placeholder="https://…" />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all text-sm font-medium">
        <Plus className="w-4 h-4" /> Add project
      </button>
    </div>
  );
}

// ─── Education entry editor ───────────────────────────────────────────────────
function EducationEditor({ entries, onChange }) {
  const update = (idx, field, val) => {
    const next = [...entries];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const remove = (idx) => onChange(entries.filter((_, i) => i !== idx));
  const add = () => onChange([...entries, { degree: "", field: "", institution: "", start_year: "", end_year: "" }]);

  return (
    <div className="space-y-4">
      {entries.map((edu, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entry {idx + 1}</span>
            <button onClick={() => remove(idx)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Degree</FieldLabel>
              <TextInput value={edu.degree} onChange={(v) => update(idx, "degree", v)} placeholder="Bachelor of Science" />
            </div>
            <div>
              <FieldLabel>Field of study</FieldLabel>
              <TextInput value={edu.field} onChange={(v) => update(idx, "field", v)} placeholder="Computer Science" />
            </div>
          </div>
          <div>
            <FieldLabel>Institution</FieldLabel>
            <TextInput value={edu.institution} onChange={(v) => update(idx, "institution", v)} placeholder="University of XYZ" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Start year</FieldLabel>
              <TextInput value={edu.start_year} onChange={(v) => update(idx, "start_year", v)} placeholder="2018" />
            </div>
            <div>
              <FieldLabel>End year</FieldLabel>
              <TextInput value={edu.end_year} onChange={(v) => update(idx, "end_year", v)} placeholder="2022" />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all text-sm font-medium">
        <Plus className="w-4 h-4" /> Add education
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function ResumeEditModal({ isOpen, onClose, onSuccess }) {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedOk, setSavedOk] = useState(false);

  // Resume sections as local state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState("classic_ats");

  useEffect(() => {
    if (!isOpen || !user?._id) return;
    setLoading(true);
    setError("");
    setSavedOk(false);

    axios.get(`${BACKEND_URL}/api/resume/json/${user._id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        const j = data.resumeJson || {};
        setName(j.name || "");
        setEmail(j.email || "");
        setPhone(j.phone || "");
        setGithubUrl(j.github_url || "");
        setSummary(j.summary || "");
        setSkills(j.skills || []);
        setExperience(j.experience || []);
        setProjects(j.projects || []);
        setEducation(j.education || []);
        setCurrentTemplate(data.template || "classic_ats");
      })
      .catch(() => setError("Failed to load resume data."))
      .finally(() => setLoading(false));
  }, [isOpen, user?._id, token]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSavedOk(false);

    const resumeJson = { name, email, phone, github_url: githubUrl, summary, skills, experience, projects, education };

    try {
      await axios.put(`${BACKEND_URL}/api/resume/json`,
        { resumeJson, templateId: currentTemplate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedOk(true);
      onSuccess?.();
      setTimeout(() => { setSavedOk(false); onClose(); }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Edit resume content</h2>
            <p className="text-xs text-gray-500 mt-0.5">Changes save directly — no AI call needed</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-sm text-red-500 py-4">{error}</div>
          ) : (
            <>
              {/* Contact */}
              <Section icon={User} title="Contact info" iconColor="#086972" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-3">
                  <div><FieldLabel>Full name</FieldLabel><TextInput value={name} onChange={setName} placeholder="Jane Doe" /></div>
                  <div><FieldLabel>Email</FieldLabel><TextInput value={email} onChange={setEmail} placeholder="jane@example.com" /></div>
                  <div><FieldLabel>Phone</FieldLabel><TextInput value={phone} onChange={setPhone} placeholder="+1 555-0100" /></div>
                  <div><FieldLabel>GitHub URL</FieldLabel><TextInput value={githubUrl} onChange={setGithubUrl} placeholder="https://github.com/…" /></div>
                </div>
              </Section>

              {/* Summary */}
              <Section icon={Layers} title="Professional summary" iconColor="#7c3aed">
                <FieldLabel>3-5 impactful lines about you</FieldLabel>
                <TextInput value={summary} onChange={setSummary} multiline rows={5}
                  placeholder="Full-stack engineer with 5 years of experience building scalable web applications. Passionate about clean architecture and developer experience. Led teams of up to 8 engineers across distributed environments." />
              </Section>

              {/* Skills */}
              <Section icon={Tag} title="Skills" iconColor="#0891b2">
                <FieldLabel>Type a skill and press Enter</FieldLabel>
                <TagInput values={skills} onChange={setSkills} placeholder="React, Node.js, PostgreSQL…" />
              </Section>

              {/* Experience */}
              <Section icon={Briefcase} title={`Experience (${experience.length})`} iconColor="#b45309">
                <ExperienceEditor entries={experience} onChange={setExperience} />
              </Section>

              {/* Projects */}
              <Section icon={FolderOpen} title={`Projects (${projects.length})`} iconColor="#086972" defaultOpen={false}>
                <ProjectEditor entries={projects} onChange={setProjects} />
              </Section>

              {/* Education */}
              <Section icon={GraduationCap} title={`Education (${education.length})`} iconColor="#475569" defaultOpen={false}>
                <EducationEditor entries={education} onChange={setEducation} />
              </Section>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-2xl">
            <p className="text-xs text-gray-400">Saving will re-render the PDF with your current template</p>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || savedOk}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #086972, #0891b2)" }}>
                {savedOk
                  ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                  : saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : "Save & update PDF"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
