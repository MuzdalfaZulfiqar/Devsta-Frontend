// export default function Skills({ user }) {
//   const skills = user.topSkills || [];
//   const interests = user.interests || [];

//   return (
//     <div className="flex flex-col gap-6 w-full">
//       <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Interests</h2>

//       <div className="flex flex-col md:flex-row gap-6">

//         {/* SKILLS CARD */}
//         <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
//           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Top Skills</p>
//           {skills.length > 0 ? (
//             <div className="flex flex-wrap gap-3">
//               {skills.map((skill) => (
//                 <span
//                   key={skill}
//                   className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added</p>
//           )}
//         </div>

//         {/* INTERESTS CARD */}
//         <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
//           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Interests</p>
//           {interests.length > 0 ? (
//             <div className="flex flex-wrap gap-3">
//               {interests.map((interest, idx) => (
//                 <span
//                   key={`${interest}-${idx}`}
//                   className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
//                 >
//                   {interest}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 dark:text-gray-400 text-sm">No interests added</p>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default function Skills({ user }) {
//   const topSkills = user.topSkills || [];
//   const interests = user.interests || [];

//   // ✅ validatedSkills is an object: { "React": 0.82, "Node": 0.74 }
//   const validatedSkillsObj = user.validatedSkills || {};
//   const aiValidatedSkills = Object.keys(validatedSkillsObj);

//   const prettifyCustom = (skill) => {
//     if (!skill) return "";
//     if (skill.startsWith("custom:")) {
//       return skill
//         .replace("custom:", "")
//         .replace(/-/g, " ")
//         .replace(/\b\w/g, (c) => c.toUpperCase());
//     }
//     return skill;
//   };

//   return (
//     <div className="flex flex-col gap-6 w-full">
//       <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//         Skills & Interests
//       </h2>

//       <div className="flex flex-col gap-6">
//         {/* ===== TOP SKILLS + AI VALIDATED SKILLS ===== */}
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* TOP SKILLS CARD */}
//           <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
//             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
//               Top Skills (You added)
//             </p>

//             {topSkills.length > 0 ? (
//               <div className="flex flex-wrap gap-3">
//                 {topSkills.map((skill) => (
//                   <span
//                     key={skill}
//                     className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
//                   >
//                     {prettifyCustom(skill)}
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 dark:text-gray-400 text-sm">
//                 No top skills added
//               </p>
//             )}
//           </div>

//           {/* AI VALIDATED SKILLS CARD */}
//           <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
//             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
//               AI Validated Skills (from Resume/GitHub/Test)
//             </p>

//             {aiValidatedSkills.length > 0 ? (
//               <div className="flex flex-wrap gap-3">
//                 {aiValidatedSkills.map((skill) => (
//                   <span
//                     key={skill}
//                     title={`Score: ${validatedSkillsObj[skill]}`}
//                     className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 dark:text-gray-400 text-sm">
//                 No AI validated skills yet
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ===== INTERESTS CARD ===== */}
//         <div className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
//           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
//             Interests
//           </p>

//           {interests.length > 0 ? (
//             <div className="flex flex-wrap gap-3">
//               {interests.map((interest, idx) => (
//                 <span
//                   key={`${interest}-${idx}`}
//                   className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
//                 >
//                   {interest}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 dark:text-gray-400 text-sm">
//               No interests added
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function Skills({ user }) {
  const topSkills = user?.topSkills || [];
  const interests = user?.interests || [];

  // ✅ validatedSkills is stored as an object: { "React": 0.82, "Node": 0.74 }
  const validatedSkillsObj =
    user?.validatedSkills && typeof user.validatedSkills === "object"
      ? user.validatedSkills
      : {};

  const aiValidatedSkills = Object.keys(validatedSkillsObj);

  const prettifyCustom = (skill) => {
    if (!skill) return "";
    if (skill.startsWith("custom:")) {
      return skill
        .replace("custom:", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return skill;
  };

  const formatScore = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return "";
    // 0.82 -> 82%
    if (n <= 1) return `${Math.round(n * 100)}%`;
    return `${Math.round(n)}%`;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Skills & Interests
      </h2>

      <div className="flex flex-col gap-6">
        {/* ===== TOP SKILLS + AI VALIDATED SKILLS ===== */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* TOP SKILLS CARD */}
          <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              Top Skills (You added)
            </p>

            {topSkills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {topSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
                  >
                    {prettifyCustom(skill)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No top skills added
              </p>
            )}
          </div>

          {/* AI VALIDATED SKILLS CARD */}
          <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              AI Validated Skills (from Resume/GitHub/Test)
            </p>

            {aiValidatedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {aiValidatedSkills.map((skill) => (
                  <span
                    key={skill}
                    title={`Score: ${formatScore(validatedSkillsObj[skill]) || validatedSkillsObj[skill]}`}
                    className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No AI validated skills yet
              </p>
            )}
          </div>
        </div>

        {/* ===== INTERESTS CARD ===== */}
        <div className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Interests
          </p>

          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, idx) => (
                <span
                  key={`${interest}-${idx}`}
                  className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No interests added
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
