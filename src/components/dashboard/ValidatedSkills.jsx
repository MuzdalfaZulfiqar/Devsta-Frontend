// export default function ValidatedSkills({ validatedSkills, profileScore, user, onValidate, isValidating }) {
//   if (!user || !validatedSkills || Object.keys(validatedSkills).length === 0) {
//     return (
//       <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
//         No validated skills yet. Run the validation to see your confidence scores.
//       </div>
//     );
//   }

//   // Count available sources
//   const sourcesAvailable = [
//     user?.topSkills?.length > 0,
//     user?.githubConnected,
//     !!user?.resumeUrl,
//     profileScore > 0,
//   ];
//   const sourceCount = sourcesAvailable.filter(Boolean).length;

//   const showPartialWarning = sourceCount < 4;

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
//                 className={`h-2.5 rounded-full bg-primary ${getBarOpacity(score)} transition-all duration-700`}
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

//       {/* Re-run Validation Button */}
//       {onValidate && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={onValidate}
//             disabled={isValidating}
//             className="px-6 py-2 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
//           >
//             {isValidating ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               "Re-run Validation"
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Optional: npm install lucide-react or use a standard SVG

export default function ValidatedSkills({ validatedSkills, profileScore, user, onValidate, isValidating }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!user || !validatedSkills || Object.keys(validatedSkills).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          No validated skills yet. Run the validation to see your confidence scores.
        </p>
      </div>
    );
  }

  const sourcesAvailable = [
    user?.topSkills?.length > 0,
    user?.githubConnected,
    !!user?.resumeUrl,
    profileScore > 0,
  ];
  const sourceCount = sourcesAvailable.filter(Boolean).length;
  const showPartialWarning = sourceCount < 4;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
      
      {/* --- COLLAPSIBLE HEADER --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg bg-primary/10 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronDown size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Skill Validation
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Object.keys(validatedSkills).length} Skills Verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Global Score</span>
                <span className="text-xl font-black text-primary leading-none">{profileScore ?? 0}</span>
            </div>
        </div>
      </button>

      {/* --- COLLAPSIBLE CONTENT --- */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-6 pt-0">
          
          {/* Partial Warning */}
          {showPartialWarning && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 mb-6">
              <p className="text-amber-800 dark:text-amber-300 text-xs font-medium leading-relaxed">
                <span className="font-bold text-amber-600">Boost Score:</span>
                <span className="ml-1 opacity-80">
                  {!user.resumeUrl && "• Upload Resume "}
                  {!user.githubConnected && "• Connect GitHub "}
                  {!user.topSkills?.length && "• Take Skill Test "}
                </span>
              </p>
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(validatedSkills).map(([skill, score]) => {
              const percentage = Math.round(score * 100);
              const circumference = 2 * Math.PI * 16;
              const offset = circumference - (percentage / 100) * circumference;

              return (
                <div 
                  key={skill} 
                  className="group relative overflow-hidden bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl transition-all hover:border-primary/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="z-10">
                      <h3 className="text-lg font-bold capitalize text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                        {skill}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                        Competency
                      </p>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                        <circle
                          cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="4" fill="transparent"
                          strokeDasharray={circumference}
                          style={{ strokeDashoffset: offset }}
                          strokeLinecap="round"
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Decorative BG letter */}
                  <div className="absolute -bottom-2 -right-2 text-6xl font-black text-gray-200/10 dark:text-gray-700/10 select-none pointer-events-none uppercase">
                    {skill.charAt(0)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          {onValidate && (
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={onValidate}
                disabled={isValidating}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Refresh Analytics"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}