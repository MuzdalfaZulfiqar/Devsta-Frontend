// // src/components/company/ApplyJobModal.jsx
// import React, { useState, useEffect } from "react";
// import { MdClose } from "react-icons/md";
// import { useAuth } from "../../context/AuthContext";
// import { applyForJob, uploadResumeForJob, getMyApplications } from "../../api/company/jobApplications";
// import { showToast } from "../../utils/toast";
// import { BACKEND_URL } from "../../../config";

// export default function ApplyJobModal({ job, onClose, onApplied }) {
//   const { user, token } = useAuth();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     githubProfile: "",
//     linkedinProfile: "",
//   });

//   const [resumeFile, setResumeFile] = useState(null);
//   const [resumeUrl, setResumeUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!user) return;

//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       phone: user.phone || "",
//       githubProfile: user.githubUrl || "",
//       linkedinProfile: user.linkedinUrl || "",
//     });

//     (async () => {
//       try {
//         // const myApps = await getMyApplications(token);
//         const myApps = await getMyApplications({ page: 1, limit: 6, search: "" }, token);

//         // const existingApp = myApps.find((app) => app.job._id === job._id);
//         const existingApp = myApps.applications.find((app) => app.job._id === job._id);


//         if (existingApp?.developerSnapshot?.resumeUrl) {
//           setResumeUrl(`${BACKEND_URL}/api/developer/jobApplications/${job._id}/resume`);
//         } else if (user.resumeUrl) {
//           setResumeUrl(`${BACKEND_URL}/api/users/resume/${user._id}`);
//         } else {
//           setResumeUrl("");
//         }
//       } catch (err) {
//         console.error("Failed to fetch applications", err);
//       }
//     })();
//   }, [user, job, token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setResumeFile(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!job?._id) return;

//     try {
//       setLoading(true);

//       // const myApps = await getMyApplications(token);
//       const myApps = await getMyApplications({ page: 1, limit: 6, search: "" }, token);

//       // const existingApp = myApps.find((app) => app.job._id === job._id);
//       const existingApp = myApps.applications.find((app) => app.job._id === job._id);


//       if (!existingApp) {
//         await applyForJob(job._id, formData, token);
//         showToast("Application submitted successfully", "success");
//       }

//       if (resumeFile) {
//         await uploadResumeForJob(job._id, resumeFile, token);
//         setResumeUrl(`${BACKEND_URL}/api/developer/jobApplications/${job._id}/resume`);
//         showToast("New resume uploaded successfully", "success");
//       }

//       onApplied?.();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       showToast(err.message || "Failed to apply or upload resume", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewResume = () => {
//     if (resumeFile) {
//       window.open(URL.createObjectURL(resumeFile), "_blank");
//     } else if (resumeUrl) {
//       window.open(resumeUrl, "_blank");
//     } else {
//       showToast("No resume available", "error");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="relative px-6 py-4 border-b">
//           <h2 className="text-xl font-bold text-gray-900">Apply for "{job.title}"</h2>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
//             aria-label="Close"
//           >
//             <MdClose className="w-6 h-6 text-gray-700" />
//           </button>
//         </div>

//         {/* Form - scrollbar hidden */}
//         <form
//           onSubmit={handleSubmit}
//           className="px-6 py-6 space-y-4 overflow-y-auto max-h-[80vh]"
//           style={{
//             // Hide scrollbar cross-browser
//             msOverflowStyle: "none", // IE and Edge
//             scrollbarWidth: "none", // Firefox
//           }}
//         >
//           {/* Hide scrollbar in WebKit browsers (Chrome, Safari, new Edge) */}
//           <style jsx>{`
//             form::-webkit-scrollbar {
//               display: none;
//             }
//           `}</style>

//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//             />
//           </div>

//           {/* Resume */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Resume *</label>

//             {(resumeUrl || resumeFile) && (
//               <p className="text-sm mb-1">
//                 <button
//                   type="button"
//                   onClick={handleViewResume}
//                   className="text-primary hover:underline"
//                 >
//                   {resumeFile ? "Preview newly selected resume" : "View resume from your profile"}
//                 </button>
//               </p>
//             )}

//             <input
//               type="file"
//               accept=".pdf,.jpg,.jpeg,.png"
//               onChange={handleFileChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Keep your current resume or upload a new one to replace it (optional, max 5MB)
//             </p>
//           </div>

//           {/* GitHub */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
//             <input
//               type="text"
//               name="githubProfile"
//               value={formData.githubProfile}
//               onChange={handleChange}
//               placeholder="Optional"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//             />
//           </div>

//           {/* LinkedIn */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
//             <input
//               type="text"
//               name="linkedinProfile"
//               value={formData.linkedinProfile}
//               onChange={handleChange}
//               placeholder="Optional"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 mt-2 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-opacity-90 transition-colors ${
//               loading ? "opacity-60 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/components/company/ApplyJobModal.jsx
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { applyForJob, uploadResumeForJob, getMyApplications } from "../../api/company/jobApplications";
import { showToast } from "../../utils/toast";
import { BACKEND_URL } from "../../../config";

// ── Validators ───────────────────────────────────────────────
const validate = {
  name: (v) => {
    if (!v.trim()) return "Full name is required.";
    if (/\d/.test(v)) return "Name cannot contain numbers.";
    if (v.trim().length < 2) return "Name must be at least 2 characters.";
    if (!/^[a-zA-Z\s'\-\.]+$/.test(v)) return "Name can only contain letters, spaces, hyphens, or apostrophes.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Phone number is required.";

    // Allow only valid phone characters
    if (!/^[\d\s\+\-\(\)]+$/.test(v))
      return "Phone can only contain digits, spaces, +, -, or parentheses.";

    const digits = v.replace(/\D/g, "");

    // Pakistani local format: 11 digits starting with 03
    // e.g. 03001234567, 03434322333
    const pkLocal = /^03\d{9}$/;

    // Pakistani international format: +92 or 0092 followed by 10 digits
    // e.g. +923001234567, 00923001234567
    const pkIntl = /^(92|0092)\d{10}$/;

    // Generic international (non-PK): 7–15 digits total is the ITU-T E.164 standard
    const genericIntl = digits.length >= 7 && digits.length <= 15;

    // If it looks like a Pakistani number attempt (starts with 03, 92, 0092)
    // enforce strict PK rules
    if (/^(03|92|0092|\+92)/.test(v.trim())) {
      const normalised = digits.startsWith("92") ? digits : digits; // already stripped
      if (!pkLocal.test(digits) && !pkIntl.test(digits)) {
        if (digits.startsWith("03") && digits.length !== 11)
          return `Pakistani local numbers must be 11 digits starting with 03 (e.g. 03001234567). You entered ${digits.length}.`;
        if ((digits.startsWith("92") || digits.startsWith("0092")) && digits.length !== 12 && digits.length !== 14)
          return "Pakistani international format: +92 followed by 10 digits (e.g. +923001234567).";
        return "Invalid Pakistani phone number format.";
      }
      return "";
    }

    // For all other international numbers fall back to length check
    if (!genericIntl)
      return `Phone number must be between 7 and 15 digits. You entered ${digits.length}.`;

    return "";
  },
};

// ── Small inline error ───────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function ApplyJobModal({ job, onClose, onApplied }) {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    githubProfile: "",
    linkedinProfile: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      githubProfile: user.githubUrl || "",
      linkedinProfile: user.linkedinUrl || "",
    });

    (async () => {
      try {
        const myApps = await getMyApplications({ page: 1, limit: 6, search: "" }, token);
        const existingApp = myApps.applications.find((app) => app.job._id === job._id);

        if (existingApp?.developerSnapshot?.resumeUrl) {
          setResumeUrl(`${BACKEND_URL}/api/developer/jobApplications/${job._id}/resume`);
        } else if (user.resumeUrl) {
          setResumeUrl(`${BACKEND_URL}/api/users/resume/${user._id}`);
        } else {
          setResumeUrl("");
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    })();
  }, [user, job, token]);

  // ── Validate a single field ──────────────────────────────
  const validateField = (name, value) => {
    if (validate[name]) {
      return validate[name](value);
    }
    return "";
  };

  // ── Validate all required fields, return true if clean ──
  const validateAll = () => {
    const fieldsToCheck = ["name", "email", "phone"];
    const newErrors = {};
    fieldsToCheck.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    // Mark all as touched so errors show
    setTouched({ name: true, email: true, phone: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validate once the field has been touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      showToast("Resume must be under 5 MB.", "error");
      e.target.value = "";
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job?._id) return;

    if (!validateAll()) {
      showToast("Please fix the errors before submitting.", "error");
      return;
    }

    try {
      setLoading(true);

      const myApps = await getMyApplications({ page: 1, limit: 6, search: "" }, token);
      const existingApp = myApps.applications.find((app) => app.job._id === job._id);

      if (!existingApp) {
        await applyForJob(job._id, formData, token);
        showToast("Application submitted successfully", "success");
      }

      if (resumeFile) {
        await uploadResumeForJob(job._id, resumeFile, token);
        setResumeUrl(`${BACKEND_URL}/api/developer/jobApplications/${job._id}/resume`);
        showToast("New resume uploaded successfully", "success");
      }

      onApplied?.();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to apply or upload resume", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    if (resumeFile) {
      window.open(URL.createObjectURL(resumeFile), "_blank");
    } else if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      showToast("No resume available", "error");
    }
  };

  // Helper: input border colour based on validation state
  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 transition-colors ${
      touched[field] && errors[field]
        ? "border-red-400 focus:ring-red-400 bg-red-50"
        : touched[field] && !errors[field]
        ? "border-green-400 focus:ring-green-400"
        : "border-gray-300 focus:ring-primary"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Apply for "{job.title}"</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <MdClose className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Form — hidden scrollbar */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-4 overflow-y-auto max-h-[80vh]"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <style>{`form::-webkit-scrollbar { display: none; }`}</style>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Sarah Khan"
              className={inputClass("name")}
            />
            <FieldError msg={touched.name && errors.name} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. sarah@example.com"
              className={inputClass("email")}
            />
            <FieldError msg={touched.email && errors.email} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. +92 300 1234567"
              className={inputClass("phone")}
            />
            <FieldError msg={touched.phone && errors.phone} />
          </div>

          {/* Resume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>

            {(resumeUrl || resumeFile) && (
              <p className="text-sm mb-1">
                <button
                  type="button"
                  onClick={handleViewResume}
                  className="text-primary hover:underline"
                >
                  {resumeFile ? "Preview newly selected resume" : "View resume from your profile"}
                </button>
              </p>
            )}

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Keep your current resume or upload a new one (optional, max 5 MB — PDF/JPG/PNG)
            </p>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
            <input
              type="text"
              name="githubProfile"
              value={formData.githubProfile}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
            <input
              type="text"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-opacity-90 transition-colors ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
