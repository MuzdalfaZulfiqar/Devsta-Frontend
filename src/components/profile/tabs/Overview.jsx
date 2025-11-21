// import GeneralInfo from "./GeneralInfo";
// import Skills from "./Skills";
// import Resume from "./Resume";
// import GitHub from "./GitHub";
// import { useNavigate } from "react-router-dom";
// import { FiUser } from "react-icons/fi"; 

// export default function Overview({ user }) {
//   const navigate = useNavigate();


//     const handleViewPublicProfile = () => {
//     // Navigate to the public profile route with user ID
//     navigate(`/dashboard/community/profile/${user._id}`);
//   };
//   return (
//     <div className="flex flex-col gap-8 w-full">
// <div className="flex justify-end">
//   <button
//     onClick={handleViewPublicProfile}
//     className="
//       flex items-center gap-2 px-5 py-2 rounded-full 
//       bg-primary text-white font-semibold 
//       shadow-md hover:shadow-lg 
//       hover:bg-primary/90 transition 
//       duration-300 ease-in-out
//     "
//   >
//     <FiUser size={20} />
//     View Public Profile
//   </button>
// </div>
//       <GeneralInfo user={user} />
//       <Skills user={user} />
//       <Resume user={user} />
//       <GitHub user={user} />

        
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import GeneralInfo from "./GeneralInfo";
// import Skills from "./Skills";
// import Resume from "./Resume";
// import GitHub from "./GitHub";
// import { useNavigate } from "react-router-dom";
// import { FiUser } from "react-icons/fi";
// import { getMyProfile } from "../../../api/profile";

// export default function Overview({ user }) {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const handleViewPublicProfile = () => {
//     navigate(`/dashboard/community/profile/${user._id}`);
//   };

//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         const data = await getMyProfile();
//         setProfile(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProfile();
//   }, []);

//   return (
//     <div className="flex flex-col gap-8 w-full">
//       <div className="flex justify-end">
//         <button
//           onClick={handleViewPublicProfile}
//           className="
//             flex items-center gap-2 px-5 py-2 rounded-full 
//             bg-primary text-white font-semibold 
//             shadow-md hover:shadow-lg 
//             hover:bg-primary/90 transition 
//             duration-300 ease-in-out
//           "
//         >
//           <FiUser size={20} />
//           View Public Profile
//         </button>
//       </div>

//       {/* Existing Sections */}
//       <GeneralInfo user={user} />
//       <Skills user={user} />
//       <Resume user={user} />
//       <GitHub user={user} />

//       {/* Read-only Profile Overview */}
//       {loading ? (
//         <p className="text-gray-500 animate-pulse">Loading profile...</p>
//       ) : profile ? (
//         <div className="flex flex-col gap-6">


//           {/* BIO */}
//           {/* BIO */}
// <div className="flex flex-col gap-2">
//   <p className="text-gray-500 text-sm font-medium">Bio</p>
//   <div className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-4 shadow-sm">
//     <p className="text-gray-900 dark:text-white font-medium whitespace-pre-line">
//       {profile.bio || "No bio added yet"}
//     </p>
//   </div>
// </div>

// {/* INTERESTS */}
// <div className="flex flex-col gap-2">
//   <p className="text-gray-500 text-sm font-medium">Interests</p>
//   {profile.interests?.length ? (
//     <div className="flex flex-wrap gap-2">
//       {profile.interests.map((i, idx) => (
//         <span
//           key={`${i}-${idx}`}
//           className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs font-medium bg-primary/10 dark:bg-primary/20 transition hover:bg-primary/20 dark:hover:bg-primary/30"
//         >
//           {i}
//         </span>
//       ))}
//     </div>
//   ) : (
//     <p className="text-gray-500 text-sm">No interests added</p>
//   )}
// </div>

// {/* EDUCATION */}
// <div className="flex flex-col gap-2">
//   <p className="text-gray-500 text-sm font-medium">Education</p>
//   {profile.education?.length ? (
//     <div className="grid gap-3">
//       {profile.education.map((edu) => (
//         <div
//           key={edu._id}
//           className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-4 shadow-sm hover:shadow-md transition"
//         >
//           <p className="font-semibold text-gray-900 dark:text-white">
//             {edu.degreeTitle || edu.level}{" "}
//             {edu.fieldOfStudy && (
//               <span className="text-gray-700 dark:text-gray-300">• {edu.fieldOfStudy}</span>
//             )}
//           </p>
//           <p className="text-sm text-gray-600 dark:text-gray-300">{edu.institution}</p>
//           <p className="text-xs text-gray-500 mt-1">
//             {edu.startYear || "—"} – {edu.endYear || "Present"}
//             {typeof edu.marksPercent === "number" && ` • ${edu.marksPercent}%`}
//           </p>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <p className="text-gray-500 text-sm">No education added yet</p>
//   )}
// </div>

// {/* EXPERIENCE */}
// <div className="flex flex-col gap-2">
//   <p className="text-gray-500 text-sm font-medium">Experience</p>
//   {profile.experience?.length ? (
//     <div className="grid gap-3">
//       {profile.experience.map((exp) => (
//         <div
//           key={exp._id}
//           className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-4 shadow-sm hover:shadow-md transition"
//         >
//           <p className="font-semibold text-gray-900 dark:text-white">
//             {exp.position}{" "}
//             {exp.company && (
//               <span className="text-gray-700 dark:text-gray-300">• {exp.company}</span>
//             )}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             {exp.jobType ? `${exp.jobType} • ` : ""}
//             {exp.startDate ? exp.startDate.slice(0, 10) : "—"} –{" "}
//             {exp.endDate ? exp.endDate.slice(0, 10) : "Present"}
//           </p>
//           {exp.description && (
//             <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
//               {exp.description}
//             </p>
//           )}
//         </div>
//       ))}
//     </div>
//   ) : (
//     <p className="text-gray-500 text-sm">No experience added yet</p>
//   )}
// </div>

//         </div>
//       ) : (
//         <p className="text-gray-500">Profile not found.</p>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import GeneralInfo from "./GeneralInfo";
import Skills from "./Skills";
import Resume from "./Resume";
import GitHub from "./GitHub";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { getMyProfile } from "../../../api/profile";

export default function Overview({ user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleViewPublicProfile = () => {
    navigate(`/dashboard/community/profile/${user._id}`);
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* Top button */}
      <div className="flex justify-end">
        <button
          onClick={handleViewPublicProfile}
          className="
            flex items-center gap-2 px-5 py-2 rounded-full 
            bg-primary text-white font-semibold 
            shadow-md hover:shadow-lg 
            hover:bg-primary/90 transition 
            duration-300 ease-in-out
          "
        >
          <FiUser size={20} />
          View Public Profile
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading profile...</p>
      ) : profile ? (
        <>
          {/* ===== GENERAL INFO + BIO ===== */}
          <GeneralInfo user={{ ...user, bio: profile.bio }} />

          {/* ===== SKILLS + INTERESTS ===== */}
          <Skills user={{ ...user, topSkills: user.topSkills || [], interests: profile.interests || [] }} />

          {/* ===== RESUME ===== */}
          <Resume user={user} />

         
          {/* ===== EDUCATION ===== */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
            {profile.education?.length ? (
              <div className="grid gap-3">
                {profile.education.map((edu) => (
                  <div
                    key={edu._id}
                    className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {edu.degreeTitle || edu.level}{" "}
                      {edu.fieldOfStudy && (
                        <span className="text-gray-700 dark:text-gray-300">• {edu.fieldOfStudy}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{edu.institution}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {edu.startYear || "—"} – {edu.endYear || "Present"}
                      {typeof edu.marksPercent === "number" && ` • ${edu.marksPercent}%`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No education added yet</p>
            )}
          </div>

          {/* ===== EXPERIENCE ===== */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
            {profile.experience?.length ? (
              <div className="grid gap-3">
                {profile.experience.map((exp) => (
                  <div
                    key={exp._id}
                    className="bg-white dark:bg-gray-900 border border-primary rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {exp.position}{" "}
                      {exp.company && (
                        <span className="text-gray-700 dark:text-gray-300">• {exp.company}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {exp.jobType ? `${exp.jobType} • ` : ""}
                      {exp.startDate ? exp.startDate.slice(0, 10) : "—"} –{" "}
                      {exp.endDate ? exp.endDate.slice(0, 10) : "Present"}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No experience added yet</p>
            )}
          </div>

           {/* ===== GITHUB ===== */}
          <GitHub user={user} />

        </>
      ) : (
        <p className="text-gray-500">Profile not found.</p>
      )}
    </div>
  );
}
