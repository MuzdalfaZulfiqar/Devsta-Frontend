// // export default function Skills({ user }) {
// //   return (
// //     <div className="flex flex-col gap-6 w-full">


// //       <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>

// //       {user.topSkills.length > 0 ? (
// //         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
// //           {user.topSkills.map((skill) => (
// //             <div
// //               key={skill}
// //               className="bg-white dark:bg-gray-900 border border-primary px-3 py-2 rounded-full text-center text-sm font-medium text-primary"
// //             >
// //               {skill}
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <p className="text-gray-500 dark:text-gray-400">No skills added</p>
// //       )}

// //     </div>
// //   );
// // }


// export default function Skills({ user }) {
//   const skills = user.topSkills || [];
//   const interests = user.interests || [];

//   return (
//     <div className="flex flex-col gap-6 w-full">
//       <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Interests</h2>

//       <div className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-6">
        
//         {/* SKILLS */}
//         <div>
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

//         {/* INTERESTS */}
//         <div>
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

export default function Skills({ user }) {
  const skills = user.topSkills || [];
  const interests = user.interests || [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Interests</h2>

      <div className="flex flex-col md:flex-row gap-6">

        {/* SKILLS CARD */}
        <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Top Skills</p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs sm:text-sm font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added</p>
          )}
        </div>

        {/* INTERESTS CARD */}
        <div className="flex-1 bg-white dark:bg-gray-900 border border-primary rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Interests</p>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">No interests added</p>
          )}
        </div>

      </div>
    </div>
  );
}
