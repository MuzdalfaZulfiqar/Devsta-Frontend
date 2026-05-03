// import React from "react";
// import { X } from "lucide-react";

// export default function GoalModal({
//   open,
//   onClose,
//   goal,
//   goalForm,
//   setGoalForm,
//   onSubmit,
//   savingGoal,
//   generating,
//   onGenerate,
// }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[65] overflow-y-auto bg-slate-950/60 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
//       <div className="flex min-h-full items-start justify-center sm:items-center">
//         <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:rounded-[30px]">
//           <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-primary px-4 py-4 pr-14 text-white sm:px-6 sm:py-5">
//             <button
//               type="button"
//               onClick={onClose}
//               className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
//             >
//               <X size={18} />
//             </button>

//             <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-xs sm:tracking-[0.24em]">
//               Set your next target
//             </p>

//             <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
//               {goal?._id ? "Update your growth target" : "Create a new growth target"}
//             </h2>

//             <p className="mt-1 max-w-2xl text-xs leading-5 text-white/75 sm:text-sm">
//               Define the role, focus, and learning preferences so DevSta can generate a useful journey and roadmap.
//             </p>
//           </div>

//           <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
//             <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Target name
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.targetTitle}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, targetTitle: event.target.value }))
//                     }
//                     placeholder="Web Development"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Target role
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.targetRole}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, targetRole: event.target.value }))
//                     }
//                     placeholder="Frontend Developer"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Target company
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.targetCompany}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, targetCompany: event.target.value }))
//                     }
//                     placeholder="Meta"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Experience level
//                   </label>
//                   <select
//                     value={goalForm.experienceLevel}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, experienceLevel: event.target.value }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["intern", "junior", "mid", "senior", "lead", "other"].map((value) => (
//                       <option key={value} value={value}>
//                         {value.charAt(0).toUpperCase() + value.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Timeline
//                   </label>
//                   <select
//                     value={goalForm.timeline}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, timeline: event.target.value }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["1 month", "3 months", "6 months", "12 months"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Weekly availability
//                   </label>
//                   <select
//                     value={goalForm.weeklyAvailability}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, weeklyAvailability: event.target.value }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["3 hours", "5 hours", "10 hours", "15+ hours"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Preferred resource type
//                   </label>
//                   <select
//                     value={goalForm.preferredResourceType}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, preferredResourceType: event.target.value }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["Video", "Course", "Documentation", "Mixed"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Budget preference
//                   </label>
//                   <select
//                     value={goalForm.budgetPreference}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, budgetPreference: event.target.value }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["Free only", "Free + paid"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Preferred difficulty
//                   </label>
//                   <select
//                     value={goalForm.preferredDifficulty}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, preferredDifficulty: event.target.value }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["Beginner", "Intermediate", "Advanced", "Adaptive"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Focus skills
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.focusSkillsText}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({ ...previous, focusSkillsText: event.target.value }))
//                     }
//                     placeholder="react, angular, typescript, testing, performance"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                   <p className="mt-2 text-xs text-slate-400">Enter comma-separated skills.</p>
//                 </div>
//               </div>
//             </div>

//             <div className="shrink-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur sm:p-6">
//               <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={savingGoal}
//                   className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
//                 >
//                   {savingGoal ? "Saving..." : goal?._id ? "Update target" : "Save target"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={onGenerate}
//                   disabled={generating || !goal?._id}
//                   className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
//                 >
//                   {generating ? "Generating..." : "Generate journey"}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/skills/GoalModal.jsx
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

const REQUIRED_FIELDS = {
  targetTitle: "Target name is required.",
  targetRole: "Target role is required.",
  targetCompany: "Target company is required.",
};

function validateGoalForm(goalForm) {
  const errors = {};

  if (!String(goalForm?.targetTitle || "").trim()) {
    errors.targetTitle = REQUIRED_FIELDS.targetTitle;
  }

  if (!String(goalForm?.targetRole || "").trim()) {
    errors.targetRole = REQUIRED_FIELDS.targetRole;
  }

  if (!String(goalForm?.targetCompany || "").trim()) {
    errors.targetCompany = REQUIRED_FIELDS.targetCompany;
  }

  return errors;
}

function RequiredMark() {
  return <span className="ml-1 text-rose-500">*</span>;
}

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-2 text-xs font-medium text-rose-600">{message}</p>;
}

function getInputClass(hasError) {
  return `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
    hasError
      ? "border-rose-400 bg-rose-50/40 focus:border-rose-500"
      : "border-slate-300 focus:border-primary"
  }`;
}

export default function GoalModal({
  open,
  onClose,
  goal,
  goalForm,
  setGoalForm,
  onSubmit,
  savingGoal,
  generating,
  onGenerate,
}) {
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => validateGoalForm(goalForm), [goalForm]);

  const showError = (fieldName) => Boolean(touched[fieldName] && errors[fieldName]);

  const markTouched = (fieldName) => {
    setTouched((previous) => ({
      ...previous,
      [fieldName]: true,
    }));
  };

  const markRequiredFieldsTouched = () => {
    setTouched((previous) => ({
      ...previous,
      targetTitle: true,
      targetRole: true,
      targetCompany: true,
    }));
  };

  const updateField = (fieldName, value) => {
    setGoalForm((previous) => ({
      ...previous,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const currentErrors = validateGoalForm(goalForm);

    if (Object.keys(currentErrors).length > 0) {
      markRequiredFieldsTouched();
      return;
    }

    onSubmit(event);
  };

  const handleGenerate = () => {
    const currentErrors = validateGoalForm(goalForm);

    if (Object.keys(currentErrors).length > 0) {
      markRequiredFieldsTouched();
      return;
    }

    onGenerate();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] overflow-y-auto bg-slate-950/60 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:rounded-[30px]">
          <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-primary px-4 py-4 pr-14 text-white sm:px-6 sm:py-5">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              aria-label="Close goal modal"
            >
              <X size={18} />
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-xs sm:tracking-[0.24em]">
              Set your next target
            </p>

            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
              {goal?._id ? "Update your growth target" : "Create a new growth target"}
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/75 sm:text-sm">
              Define the role, company, focus, and learning preferences so DevSta can generate a useful journey and roadmap.
            </p>
          </div>

          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit} noValidate>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                Please enter the details below to create a new growth target.
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target name
                    <RequiredMark />
                  </label>
                  <input
                    type="text"
                    value={goalForm.targetTitle}
                    onChange={(event) => updateField("targetTitle", event.target.value)}
                    onBlur={() => markTouched("targetTitle")}
                    placeholder="Web Development"
                    className={getInputClass(showError("targetTitle"))}
                    aria-invalid={showError("targetTitle")}
                  />
                  <FieldError message={showError("targetTitle") ? errors.targetTitle : ""} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target role
                    <RequiredMark />
                  </label>
                  <input
                    type="text"
                    value={goalForm.targetRole}
                    onChange={(event) => updateField("targetRole", event.target.value)}
                    onBlur={() => markTouched("targetRole")}
                    placeholder="Frontend Developer"
                    className={getInputClass(showError("targetRole"))}
                    aria-invalid={showError("targetRole")}
                  />
                  <FieldError message={showError("targetRole") ? errors.targetRole : ""} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target company
                    <RequiredMark />
                  </label>
                  <input
                    type="text"
                    value={goalForm.targetCompany}
                    onChange={(event) => updateField("targetCompany", event.target.value)}
                    onBlur={() => markTouched("targetCompany")}
                    placeholder="Meta"
                    className={getInputClass(showError("targetCompany"))}
                    aria-invalid={showError("targetCompany")}
                  />
                  <FieldError message={showError("targetCompany") ? errors.targetCompany : ""} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Experience level
                  </label>
                  <select
                    value={goalForm.experienceLevel}
                    onChange={(event) => updateField("experienceLevel", event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["intern", "junior", "mid", "senior", "lead", "other"].map((value) => (
                      <option key={value} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Timeline
                  </label>
                  <select
                    value={goalForm.timeline}
                    onChange={(event) => updateField("timeline", event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["1 month", "3 months", "6 months", "12 months"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Weekly availability
                  </label>
                  <select
                    value={goalForm.weeklyAvailability}
                    onChange={(event) => updateField("weeklyAvailability", event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["3 hours", "5 hours", "10 hours", "15+ hours"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred resource type
                  </label>
                  <select
                    value={goalForm.preferredResourceType}
                    onChange={(event) => updateField("preferredResourceType", event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["Video", "Course", "Documentation", "Mixed"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Budget preference
                  </label>
                  <select
                    value={goalForm.budgetPreference}
                    onChange={(event) => updateField("budgetPreference", event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["Free only", "Free + paid"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred difficulty
                  </label>
                  <select
                    value={goalForm.preferredDifficulty}
                    onChange={(event) => updateField("preferredDifficulty", event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["Beginner", "Intermediate", "Advanced", "Adaptive"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Focus skills
                    <span className="ml-2 text-xs font-normal text-slate-400">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={goalForm.focusSkillsText}
                    onChange={(event) => updateField("focusSkillsText", event.target.value)}
                    placeholder="react, angular, typescript, testing, performance"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Enter comma-separated skills. You may leave this empty.
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur sm:p-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingGoal}
                  className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
                >
                  {savingGoal ? "Saving..." : goal?._id ? "Update target" : "Save target"}
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating || !goal?._id}
                  className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
                >
                  {generating ? "Generating..." : "Generate journey"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}