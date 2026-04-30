// import { ArrowLeft } from "lucide-react";

// export default function ReviewStep({ data, onBack, onComplete, loading = false }) {
//   const resumeText =
//     data?.resume?.name
//       ? data.resume.name
//       : data?.resumeUrl
//         ? "Uploaded"
//         : "Not uploaded";
//   const phoneText =
//     data?.phone && String(data.phone).trim()
//       ? String(data.phone).trim()
//       : "Not added";

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <h2 className="text-xl font-bold text-primary">Review Your Information</h2>
//       <p className="text-sm text-gray-600 dark:text-gray-400">
//         Review the details before submitting.
//       </p>

//       {/* Review Card */}
//       <div className="space-y-4 rounded-lg p-6 bg-transparent border border-gray-300 dark:border-gray-700 shadow-sm transition-colors">
//         {[
//           ["Name", data.name || "-"],
//           ["Email", data.email || "-"],
//           ["Phone", phoneText],
//           ["Experience Level", data.experienceLevel || "-"],
//           ["Primary Role", data.primaryRole || "-"],
//           ["Top Skills", data.topSkills?.join(", ") || "-"],
//           ["Resume", resumeText],
//         ].map(([label, value], i, arr) => (
//           <div
//             key={label}
//             className={`flex justify-between items-center ${i !== arr.length - 1 ? "border-b border-gray-200 dark:border-gray-800 pb-2" : ""
//               }`}
//           >
//             <span className="font-medium text-gray-700 dark:text-gray-300">
//               {label}
//             </span>
//             <span className="text-gray-900 dark:text-gray-100">{value}</span>
//           </div>
//         ))}
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between pt-6">
//         {/* Back Button — same theme as before */}
//         <button
//           type="button"
//           onClick={onBack}
//           className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 
//                      text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
//                      transition-colors"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>

//         {/* Submit Button */}
//         <button
//           type="button"
//           onClick={onComplete}
//           disabled={loading}
//           className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${loading
//               ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//               : "bg-primary text-white hover:bg-[#075f5d] shadow-md hover:shadow-lg"
//             }`}
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </div>
//     </div>
//   );
// }

import { ArrowLeft, CheckCircle2, User, Mail, Phone, Briefcase, Award, Code, FileText, Loader2 } from "lucide-react";

export default function ReviewStep({ data, onBack, onComplete, loading = false }) {
  const resumeText = data?.resume?.name
    ? data.resume.name
    : data?.resumeUrl
      ? "Uploaded"
      : "Not uploaded";

  const phoneText = data?.phone && String(data.phone).trim()
    ? String(data.phone).trim()
    : "Not added";

  // Data mapping with icons for a high-end feel
  const reviewItems = [
    { label: "Name", value: data.name || "-", icon: <User size={18} /> },
    { label: "Email", value: data.email || "-", icon: <Mail size={18} /> },
    { label: "Phone", value: phoneText, icon: <Phone size={18} /> },
    { label: "Experience", value: data.experienceLevel || "-", icon: <Briefcase size={18} /> },
    { label: "Role", value: data.primaryRole || "-", icon: <Award size={18} /> },
    { label: "Top Skills", value: data.topSkills?.join(", ") || "-", icon: <Code size={18} /> },
    { label: "Resume", value: resumeText, icon: <FileText size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- Header Section --- */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-2">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Final Review
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Ensure all your professional details are correct before we finalize your profile.
        </p>
      </div>

      {/* --- Review Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviewItems.map((item, i) => (
          <div
            key={item.label}
            className={`group p-4 rounded-2xl border transition-all duration-300
              ${item.label === "Top Skills" ? "md:col-span-2" : "col-span-1"}
              border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900/40 
              hover:border-primary/50 hover:shadow-md hover:shadow-primary/5`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Navigation --- */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <button
          type="button"
          onClick={onComplete}
          disabled={loading}
          className={`
            relative overflow-hidden flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300
            ${loading 
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed" 
              : "bg-primary text-white shadow-[0_10px_20px_-10px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_15px_25px_-10px_rgba(var(--primary-rgb),0.6)] hover:-translate-y-0.5 active:scale-95"
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Submit Profile</span>
          )}
        </button>
      </div>
    </div>
  );
}