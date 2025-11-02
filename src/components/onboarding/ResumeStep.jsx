// import { ArrowLeft, ArrowRight } from "lucide-react";

// export default function ResumeStep({ formData, setFormData, nextStep, prevStep, onDeleteResume }) {
//   const handleFileChange = (e) => setFormData({ resume: e.target.files?.[0] || null });
//   const handleSkip = () => {
//     setFormData((prev) => ({ ...prev, resume: undefined }));
//     nextStep();
//   };
//   const hasResume = Boolean(formData.resume);
//   const canNext = hasResume; 
//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold text-primary">Resume</h2>
//       <p className="text-sm text-gray-400">Upload your resume<span className="text-gray-400 text-xs">(optional)</span></p>

//       <div>
//         {formData.resume ? (
//           <div className="flex items-center justify-between gap-4">
//             <p className="text-white">{formData.resume.name}</p>
//             <button
//               type="button"
//               onClick={onDeleteResume}
//               className="px-3 py-1 border border-white text-white rounded hover:opacity-90"
//             >
//               Delete
//             </button>
//           </div>
//         ) : (
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx"
//             onChange={handleFileChange}
//             className="w-full bg-transparent border border-white rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         )}
//       </div>

//       {/* <div className="flex justify-between pt-6">
//         <button
//           type="button"
//           onClick={prevStep}
//           className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>
//         <div className="flex flex-col items-end gap-2">
//           <button
//             type="button"
//             onClick={nextStep}
//             disabled={!canNext}
//             aria-disabled={!canNext}
//             className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
//           >
//             Next <ArrowRight size={16} />
//           </button>

//           {!hasResume && (
//             <button
//               type="button"
//               onClick={handleSkip}
//               className="text-sm text-gray-300 underline hover:text-white"
//             >
//               Skip
//             </button>
//           )}
//         </div>
//       </div> */}

//       <div className="flex justify-between pt-6">
//   <button
//     type="button"
//     onClick={prevStep}
//     className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
//   >
//     <ArrowLeft size={16} /> Back
//   </button>

//   <div className="flex items-center gap-4">
//     {!hasResume && (
//       <button
//         type="button"
//         onClick={handleSkip}
//         className="text-sm text-gray-300 underline hover:text-white"
//       >
//         Skip
//       </button>
//     )}
//     <button
//       type="button"
//       onClick={nextStep}
//       disabled={!canNext}
//       aria-disabled={!canNext}
//       className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
//     >
//       Next <ArrowRight size={16} />
//     </button>
//   </div>
// </div>

//     </div>
//   );
// }


import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ResumeStep({ formData, setFormData, nextStep, prevStep, onDeleteResume }) {
  const handleFileChange = (e) => setFormData({ resume: e.target.files?.[0] || null });
  const handleSkip = () => {
    setFormData((prev) => ({ ...prev, resume: undefined }));
    nextStep();
  };

  const hasResume = Boolean(formData.resume);
  const canNext = hasResume;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Resume</h2>
      <p className="text-sm text-gray-400">
        Upload your resume <span className="text-gray-400 text-xs">(optional)</span>
      </p>

      {/* File Input / Uploaded File */}
      <div>
        {formData.resume ? (
          <div className="flex items-center justify-between gap-4 border border-[#086972] rounded-lg px-3 py-2 bg-transparent">
            <p className="text-white truncate">{formData.resume.name}</p>
            <button
              type="button"
              onClick={onDeleteResume}
              className="px-3 py-1 text-sm border border-[#086972] text-[#086972] rounded hover:bg-[#d1f2ec] hover:text-[#064d4c] transition"
            >
              Delete
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full bg-transparent border border-gray-400 rounded-lg px-3 py-2 text-white placeholder-gray-400 
            focus:outline-none focus:border-[#086972] focus:ring-2 focus:ring-[#086972]/40 transition"
          />
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

        <div className="flex items-center gap-4">
          {!hasResume && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-gray-700 underline hover:text-[#086972] transition"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={nextStep}
            disabled={!canNext}
            aria-disabled={!canNext}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              canNext
                ? "bg-[#086972] text-white hover:bg-[#075f5d]"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
