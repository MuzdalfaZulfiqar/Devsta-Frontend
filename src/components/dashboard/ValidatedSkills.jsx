// import React from "react";

// export default function ValidatedSkills({ validatedSkills, profileScore }) {
//   if (!validatedSkills || Object.keys(validatedSkills).length === 0) {
//     return (
//       <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
//         No validated skills yet. Run the validation to see your confidence scores.
//       </div>
//     );
//   }

//   // color function based on confidence
//   const getColor = (score) => {
//     if (score >= 0.8) return "from-green-500 to-emerald-500";
//     if (score >= 0.5) return "from-yellow-400 to-amber-500";
//     return "from-red-500 to-pink-500";
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
//       <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//         Your Validated Skills
//       </h2>

//       <div className="space-y-4">
//         {Object.entries(validatedSkills).map(([skill, score]) => (
//           <div key={skill}>
//             <div className="flex justify-between mb-1">
//               <span className="capitalize text-gray-800 dark:text-gray-200 font-medium">{skill}</span>
//               <span className="text-gray-600 dark:text-gray-400 text-sm">
//                 {Math.round(score * 100)}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
//               <div
//                 className={`h-2.5 rounded-full bg-gradient-to-r ${getColor(
//                   score
//                 )} transition-all duration-700`}
//                 style={{ width: `${score * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
//         <p className="text-gray-600 dark:text-gray-300 text-sm">
//           <strong>Overall DevSta Profile Score:</strong> {profileScore ?? 0}/100
//         </p>
//       </div>
//     </div>
//   );
// }


// import React from "react";

// export default function ValidatedSkills({ validatedSkills, profileScore }) {
//   if (!validatedSkills || Object.keys(validatedSkills).length === 0) {
//     return (
//       <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
//         No validated skills yet. Run the validation to see your confidence scores.
//       </div>
//     );
//   }

//   // simpler color function based on confidence
//   const getBarOpacity = (score) => {
//     if (score >= 0.8) return "opacity-100";
//     if (score >= 0.5) return "opacity-80";
//     return "opacity-60";
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
//       <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//         Your Validated Skills
//       </h2>

//       <div className="space-y-4">
//         {Object.entries(validatedSkills).map(([skill, score]) => (
//           <div key={skill}>
//             <div className="flex justify-between mb-1">
//               <span className="capitalize text-gray-800 dark:text-gray-200 font-medium">
//                 {skill}
//               </span>
//               <span className="text-gray-600 dark:text-gray-400 text-sm">
//                 {Math.round(score * 100)}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
//               <div
//                 className={`h-2.5 rounded-full bg-primary ${getBarOpacity(
//                   score
//                 )} transition-all duration-700`}
//                 style={{ width: `${score * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
//         <p className="text-gray-600 dark:text-gray-300 text-sm">
//           <strong>Overall DevSta Profile Score:</strong> {profileScore ?? 0}/100
//         </p>
//       </div>
//     </div>
//   );
// }
// import React from "react";

// export default function ValidatedSkills({ validatedSkills, profileScore, user }) {
//   if (!user || !validatedSkills || Object.keys(validatedSkills).length === 0) {
//     return (
//       <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
//         No validated skills yet. Run the validation to see your confidence scores.
//       </div>
//     );
//   }

//   // ✅ Count available sources
//   const sourcesAvailable = [
//     user?.topSkills?.length > 0,
//     user?.githubConnected,
//     !!user?.resumeUrl,
//     profileScore > 0, // count only if > 0
//   ];
//   const sourceCount = sourcesAvailable.filter(Boolean).length;

//   // Determine warning visibility
//   const showPartialWarning = sourceCount < 4; // show warning if not all sources

//   // simpler color function based on confidence
//   const getBarOpacity = (score) => {
//     if (score >= 0.8) return "opacity-100";
//     if (score >= 0.5) return "opacity-80";
//     return "opacity-60";
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
//       <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//         Your Validated Skills
//       </h2>

//       {/* Partial Warning */}
//       {showPartialWarning && (
//         <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-xl shadow-sm p-4 mb-6 text-center">
//           <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
//             Your skills validation is partially complete. Please{" "}
//             {!user.resumeUrl && "upload your resume, "}
//             {!user.githubConnected && "connect your GitHub, "}
//             {!user.topSkills?.length && "complete the skill test, "}
//             {(!profileScore || profileScore === 0) && "validate your skills"} to get a full DevSta profile score.
//           </p>
//         </div>
//       )}

//       {/* Skills List */}
//       <div className="space-y-4">
//         {Object.entries(validatedSkills).map(([skill, score]) => (
//           <div key={skill}>
//             <div className="flex justify-between mb-1">
//               <span className="capitalize text-gray-800 dark:text-gray-200 font-medium">
//                 {skill}
//               </span>
//               <span className="text-gray-600 dark:text-gray-400 text-sm">
//                 {Math.round(score * 100)}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
//               <div
//                 className={`h-2.5 rounded-full bg-primary ${getBarOpacity(
//                   score
//                 )} transition-all duration-700`}
//                 style={{ width: `${score * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Overall Score */}
//       <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
//         <p className="text-gray-600 dark:text-gray-300 text-sm">
//           <strong>Overall DevSta Profile Score:</strong> {profileScore ?? 0}/100
//         </p>
//       </div>
//     </div>
//   );
// }


import React from "react";

export default function ValidatedSkills({ validatedSkills, profileScore, user, onValidate, isValidating }) {
  if (!user || !validatedSkills || Object.keys(validatedSkills).length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
        No validated skills yet. Run the validation to see your confidence scores.
      </div>
    );
  }

  // Count available sources
  const sourcesAvailable = [
    user?.topSkills?.length > 0,
    user?.githubConnected,
    !!user?.resumeUrl,
    profileScore > 0,
  ];
  const sourceCount = sourcesAvailable.filter(Boolean).length;

  const showPartialWarning = sourceCount < 4;

  const getBarOpacity = (score) => {
    if (score >= 0.8) return "opacity-100";
    if (score >= 0.5) return "opacity-80";
    return "opacity-60";
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Your Validated Skills
      </h2>

      {/* Partial Warning */}
      {showPartialWarning && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-xl shadow-sm p-4 mb-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
            Your skills validation is partially complete. Please{" "}
            {!user.resumeUrl && "upload your resume, "}
            {!user.githubConnected && "connect your GitHub, "}
            {!user.topSkills?.length && "complete the skill test, "}
            {(!profileScore || profileScore === 0) && "validate your skills"} to get a full DevSta profile score.
          </p>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-4">
        {Object.entries(validatedSkills).map(([skill, score]) => (
          <div key={skill}>
            <div className="flex justify-between mb-1">
              <span className="capitalize text-gray-800 dark:text-gray-200 font-medium">
                {skill}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {Math.round(score * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full bg-primary ${getBarOpacity(score)} transition-all duration-700`}
                style={{ width: `${score * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Score */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          <strong>Overall DevSta Profile Score:</strong> {profileScore ?? 0}/100
        </p>
      </div>

      {/* Re-run Validation Button */}
      {onValidate && (
        <div className="mt-6 text-center">
          <button
            onClick={onValidate}
            disabled={isValidating}
            className="px-6 py-2 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            {isValidating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Re-run Validation"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
