// // import { useParams } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
// // import { fetchUserById } from "../../api/connections"; // you should create this API

// // export default function PublicProfilePage() {
// //   const { userId } = useParams();
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const loadUser = async () => {
// //       try {
// //         const data = await fetchUserById(userId);
// //         setUser(data);
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadUser();
// //   }, [userId]);

// //   if (loading) return <p>Loading profile...</p>;
// //   if (!user) return <p>User not found.</p>;

// //   return (
// //     <div className="max-w-3xl mx-auto p-4">
// //       {/* Avatar + Basic Info */}
// //       <div className="flex items-center gap-6 mb-6">
// //         <DevstaAvatar user={user} size={100} />
// //         <div>
// //           <h1 className="text-2xl font-bold">{user.name}</h1>
// //           <p className="text-gray-500">{user.primaryRole || "Developer"}</p>
// //         </div>
// //       </div>

// //       {/* Skills */}
// //       {user.topSkills && user.topSkills.length > 0 && (
// //         <div className="flex flex-wrap gap-2 mb-4">
// //           {user.topSkills.map((skill, i) => (
// //             <span
// //               key={i}
// //               className="px-3 py-1 rounded-full text-sm font-medium"
// //               style={{
// //                 backgroundColor: getSkillColor(skill),
// //                 color: "#111827",
// //               }}
// //             >
// //               {skill.replace("custom:", "")}
// //             </span>
// //           ))}
// //         </div>
// //       )}

// //       {/* About / Bio */}
// //       {user.bio && (
// //         <div className="mb-4">
// //           <h3 className="font-semibold mb-1">About</h3>
// //           <p>{user.bio}</p>
// //         </div>
// //       )}

// //       {/* Contact / Social Links (optional) */}
// //       {user.socialLinks && (
// //         <div>
// //           <h3 className="font-semibold mb-1">Connect</h3>
// //           <div className="flex gap-3">
// //             {Object.entries(user.socialLinks).map(([key, url]) => (
// //               <a
// //                 key={key}
// //                 href={url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-primary hover:underline"
// //               >
// //                 {key}
// //               </a>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // You can reuse the getSkillColor function from UserCard
// // function getSkillColor(skill) {
// //   const colors = [
// //     "#E0F7FA", "#FFF3E0", "#F3E5F5", "#E8F5E9",
// //     "#FFFDE7", "#E1F5FE", "#FBE9E7", "#FCE4EC",
// //     "#EDE7F6", "#F1F8E9"
// //   ];
// //   let hash = 0;
// //   for (let i = 0; i < skill.length; i++) {
// //     hash = skill.charCodeAt(i) + ((hash << 5) - hash);
// //   }
// //   return colors[Math.abs(hash) % colors.length];
// // }


// // // src/pages/User/PublicProfilePage.jsx
// // import { useParams } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
// // import { fetchUserById } from "../../api/connections";

// // export default function PublicProfilePage() {
// //   const { userId } = useParams();

// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const load = async () => {
// //       try {
// //         const data = await fetchUserById(userId);
// //         setUser(data);
// //       } catch (e) {
// //         console.error(e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     load();
// //   }, [userId]);

// //   if (loading) return <p className="text-center">Loading…</p>;
// //   if (!user) return <p className="text-center text-red-500">User not found.</p>;

// //   return (
// //     <div className="max-w-3xl mx-auto">
// //       {/* BACK BUTTON REMOVED — now controlled by parent layout */}

// //       {/* ---- Profile UI ---- */}
// //       <div className="flex items-center gap-6 mb-6">
// //         <DevstaAvatar user={user} size={100} />
// //         <div>
// //           <h1 className="text-2xl font-bold">{user.name}</h1>
// //           <p className="text-gray-500">{user.primaryRole || "Developer"}</p>
// //         </div>
// //       </div>

// //       {/* Skills */}
// //       {user.topSkills?.length > 0 && (
// //         <div className="flex flex-wrap gap-2 mb-4">
// //           {user.topSkills.map((skill, i) => (
// //             <span
// //               key={i}
// //               className="px-3 py-1 rounded-full text-sm font-medium"
// //               style={{
// //                 backgroundColor: getSkillColor(skill),
// //                 color: "#111827",
// //               }}
// //             >
// //               {skill.replace("custom:", "")}
// //             </span>
// //           ))}
// //         </div>
// //       )}

// //       {/* Bio */}
// //       {user.bio && (
// //         <div className="mb-4">
// //           <h3 className="font-semibold mb-1">About</h3>
// //           <p>{user.bio}</p>
// //         </div>
// //       )}

// //       {/* Social Links */}
// //       {user.socialLinks && (
// //         <div>
// //           <h3 className="font-semibold mb-1">Connect</h3>
// //           <div className="flex gap-3">
// //             {Object.entries(user.socialLinks).map(([k, url]) => (
// //               <a
// //                 key={k}
// //                 href={url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-primary hover:underline"
// //               >
// //                 {k}
// //               </a>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /* keep your getSkillColor */
// // function getSkillColor(skill) {
// //   const colors = [
// //     "#E0F7FA","#FFF3E0","#F3E5F5","#E8F5E9","#FFFDE7",
// //     "#E1F5FE","#FBE9E7","#FCE4EC","#EDE7F6","#F1F8E9"
// //   ];
// //   let hash = 0;
// //   for (let i = 0; i < skill.length; i++) {
// //     hash = skill.charCodeAt(i) + ((hash << 5) - hash);
// //   }
// //   return colors[Math.abs(hash) % colors.length];
// // }



// // src/pages/User/PublicProfilePage.jsx
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
// import { fetchUserById } from "../../api/connections";
// import { UserPlus, Github } from "lucide-react";

// export default function PublicProfilePage() {
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await fetchUserById(userId);
//         setUser(data);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [userId]);

//   if (loading) return <p className="text-center py-10">Loading…</p>;
//   if (!user) return <p className="text-center text-red-500 py-10">User not found.</p>;

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
//         <div className="flex items-center gap-4">
//           <DevstaAvatar user={user} size={120} />
//           <div className="flex flex-col gap-2">
//             <h1 className="text-3xl font-bold truncate">{user.name}</h1>
//             <p className="text-gray-500 text-lg">{user.primaryRole || "Developer"}</p>
//           </div>
//         </div>

//         {/* GitHub + Connect buttons */}
//         <div className="flex gap-2 flex-wrap">
//           {user.githubUrl && (
//             <a
//               href={user.githubUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
//             >
//               <Github size={18} /> GitHub
//             </a>
//           )}

//           {!user.isSelf && (
//             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-sm">
//               <UserPlus size={18} /> Connect
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ABOUT */}
//       {user.bio && (
//         <section className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-2 text-lg">About</h3>
//           <p className="text-gray-700 dark:text-gray-200">{user.bio}</p>
//         </section>
//       )}

//       {/* SKILLS */}
//       {user.topSkills?.length > 0 && (
//         <section className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-2 text-lg">Skills</h3>
//           <div className="flex flex-wrap gap-2">
//             {user.topSkills.map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium"
//               >
//                 {skill.replace("custom:", "")}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* INTERESTS */}
//       {user.interests?.length > 0 && (
//         <section className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-2 text-lg">Interests</h3>
//           <div className="flex flex-wrap gap-2">
//             {user.interests.map((interest, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium"
//               >
//                 {interest}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* EDUCATION */}
//       {user.education?.length > 0 && (
//         <section className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-3 text-lg">Education</h3>
//           <div className="space-y-3">
//             {user.education.map((edu) => (
//               <div key={edu._id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
//                 <div className="flex justify-between items-center mb-1">
//                   <h4 className="font-semibold">{edu.degreeTitle} in {edu.fieldOfStudy}</h4>
//                   <span className="text-gray-500 text-sm">
//                     {edu.startYear} – {edu.endYear || "Present"}
//                   </span>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
//                 <p className="text-gray-500 text-sm mt-1">Marks: {edu.marksPercent}%</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* EXPERIENCE */}
//       {user.experience?.length > 0 && (
//         <section className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-3 text-lg">Experience</h3>
//           <div className="space-y-3">
//             {user.experience.map((exp) => (
//               <div key={exp._id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
//                 <div className="flex justify-between items-center mb-1">
//                   <h4 className="font-semibold">{exp.position} @ {exp.company}</h4>
//                   <span className="text-gray-500 text-sm">
//                     {new Date(exp.startDate).getFullYear()} – {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
//                   </span>
//                 </div>
//                 {exp.description && <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>}
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* SOCIAL LINKS */}
//       {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
//         <section className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-2 text-lg">Connect</h3>
//           <div className="flex gap-3 flex-wrap">
//             {Object.entries(user.socialLinks).map(([k, url]) => (
//               <a
//                 key={k}
//                 href={url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-3 py-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-sm"
//               >
//                 {k}
//               </a>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }


// src/pages/User/PublicProfilePage.jsx
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
// import { fetchUserById } from "../../api/connections";
// import { UserPlus, Github, BookOpen, Briefcase, Tag, Info } from "lucide-react";

// export default function PublicProfilePage() {
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await fetchUserById(userId);
//         // Safe defaults for mapping
//         setUser({
//           topSkills: [],
//           interests: [],
//           education: [],
//           experience: [],
//           socialLinks: {},
//           githubProfile: {},
//           ...data,
//         });
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [userId]);

//   if (loading) return <p className="text-center py-10">Loading…</p>;
//   if (!user) return <p className="text-center text-red-500 py-10">User not found.</p>;

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
//         <div className="flex items-center gap-4">
//           {/* Use GitHub avatar if available */}
//           <DevstaAvatar user={user.githubProfile?.avatar_url ? { ...user, avatar: user.githubProfile.avatar_url } : user} size={120} />
//           <div className="flex flex-col gap-1">
//             <h1 className="text-3xl font-bold truncate">{user.name || user.githubProfile?.name}</h1>
//             <p className="text-gray-500 text-lg">{user.primaryRole || "Developer"}</p>
//           </div>
//         </div>

//         {/* GitHub + Connect buttons */}
//         <div className="flex gap-2 flex-wrap">
//           {user.githubProfile?.html_url && (
//             <a
//               href={user.githubProfile.html_url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 shadow-sm"
//             >
//               <Github size={18} /> GitHub
//             </a>
//           )}

//           {!user.isSelf && (
//             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-sm">
//               <UserPlus size={18} /> Connect
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ABOUT */}
//       {user.bio && (
//         <section className="p-4 rounded-xl shadow-sm flex items-start gap-2 border border-gray-200">
//           <Info size={20} className="text-primary mt-1" />
//           <div>
//             <h3 className="font-semibold mb-1 text-lg">About</h3>
//             <p className="text-gray-700">{user.bio}</p>
//           </div>
//         </section>
//       )}

//       {/* SKILLS */}
//       {user.topSkills?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Tag size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg">Skills</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {user.topSkills.map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full border border-gray-300 text-gray-800 text-sm font-medium"
//               >
//                 {skill.replace("custom:", "")}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* INTERESTS */}
//       {user.interests?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Tag size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg">Interests</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {user.interests.map((interest, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full border border-gray-300 text-gray-800 text-sm font-medium"
//               >
//                 {interest}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* EDUCATION */}
//       {user.education?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <BookOpen size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg">Education</h3>
//           </div>
//           <div className="space-y-3">
//             {user.education.map((edu) => (
//               <div key={edu._id} className="p-3 rounded-xl border border-gray-300">
//                 <div className="flex justify-between items-center mb-1">
//                   <h4 className="font-semibold">{edu.degreeTitle} in {edu.fieldOfStudy}</h4>
//                   <span className="text-gray-500 text-sm">
//                     {edu.startYear} – {edu.endYear || "Present"}
//                   </span>
//                 </div>
//                 <p className="text-gray-700">{edu.institution}</p>
//                 {edu.marksPercent && <p className="text-gray-500 text-sm mt-1">Marks: {edu.marksPercent}%</p>}
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* EXPERIENCE */}
//       {user.experience?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Briefcase size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg">Experience</h3>
//           </div>
//           <div className="space-y-3">
//             {user.experience.map((exp) => (
//               <div key={exp._id} className="p-3 rounded-xl border border-gray-300">
//                 <div className="flex justify-between items-center mb-1">
//                   <h4 className="font-semibold">{exp.position} @ {exp.company}</h4>
//                   <span className="text-gray-500 text-sm">
//                     {new Date(exp.startDate).getFullYear()} – {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
//                   </span>
//                 </div>
//                 {exp.description && <p className="text-gray-700">{exp.description}</p>}
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* SOCIAL LINKS */}
//       {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <UserPlus size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg">Connect</h3>
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             {Object.entries(user.socialLinks).map(([k, url]) => (
//               <a
//                 key={k}
//                 href={url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-3 py-1 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 text-sm font-medium flex items-center gap-1"
//               >
//                 {k}
//               </a>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }



// // src/pages/User/PublicProfilePage.jsx
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
// import { fetchUserById } from "../../api/connections";
// import { UserPlus, Github, BookOpen, Briefcase, Tag, Info } from "lucide-react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function PublicProfilePage() {
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const accentColor = "#e6f4f1"; // soft accent color for skills/interests

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await fetchUserById(userId);
//         setUser({
//           topSkills: [],
//           interests: [],
//           education: [],
//           experience: [],
//           socialLinks: {},
//           githubProfile: {},
//           ...data,
//         });
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [userId]);

//   if (loading) return <p className="text-center py-10">Loading…</p>;
//   if (!user) return <p className="text-center text-red-500 py-10">User not found.</p>;

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
//         <div className="flex items-center gap-4">
//           <DevstaAvatar user={user.githubProfile?.avatar_url ? { ...user, avatar: user.githubProfile.avatar_url } : user} size={120} />
//           <div className="flex flex-col gap-1">
//             <h1 className="text-3xl font-bold truncate">{user.name || user.githubProfile?.name}</h1>
//             <p className="text-gray-500 text-lg">{user.primaryRole || "Developer"}</p>
//           </div>
//         </div>

//         {/* GitHub + Connect buttons */}
//         <div className="flex gap-2 flex-wrap">
//           {user.githubProfile?.html_url && (
//             <a
//               href={user.githubProfile.html_url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 shadow-sm"
//             >
//               <Github size={18} /> GitHub
//             </a>
//           )}

//           {!user.isSelf && (
//             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-sm">
//               <UserPlus size={18} /> Connect
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ABOUT */}
//       {user.bio && (
//         <section className="p-4 rounded-xl shadow-sm flex items-start gap-2 border border-gray-200">
//           <Info size={20} className="text-primary mt-1" />
//           <div>
//             <h3 className="font-semibold mb-1 text-lg text-primary">{/* Accent color on header */}About</h3>
//             <p className="text-gray-700">{user.bio}</p>
//           </div>
//         </section>
//       )}

//       {/* SKILLS */}
//       {user.topSkills?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Tag size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg text-primary">Skills</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {user.topSkills.map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium"
//                 style={{ backgroundColor: accentColor }}
//               >
//                 {skill.replace("custom:", "")}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* INTERESTS */}
//       {user.interests?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Tag size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg text-primary">Interests</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {user.interests.map((interest, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium"
//                 style={{ backgroundColor: accentColor }}
//               >
//                 {interest}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* EDUCATION */}
//       {user.education?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <BookOpen size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg text-primary">Education</h3>
//           </div>
//           <div className="space-y-3">
//             {user.education.map((edu) => (
//               <div key={edu._id} className="p-3 rounded-xl border border-gray-300" style={{ backgroundColor: "#f9fdfd" }}>
//                 <div className="flex justify-between items-center mb-1">
//                   <h4 className="font-semibold">{edu.degreeTitle} in {edu.fieldOfStudy}</h4>
//                   <span className="text-gray-500 text-sm">
//                     {edu.startYear} – {edu.endYear || "Present"}
//                   </span>
//                 </div>
//                 <p className="text-gray-700">{edu.institution}</p>
//                 {edu.marksPercent && <p className="text-gray-500 text-sm mt-1">Marks: {edu.marksPercent}%</p>}
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* EXPERIENCE */}
//       {user.experience?.length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <Briefcase size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg text-primary">Experience</h3>
//           </div>
//           <div className="space-y-3">
//             {user.experience.map((exp) => (
//               <div key={exp._id} className="p-3 rounded-xl border border-gray-300" style={{ backgroundColor: "#f9fdfd" }}>
//                 <div className="flex justify-between items-center mb-1">
//                   <h4 className="font-semibold">{exp.position} @ {exp.company}</h4>
//                   <span className="text-gray-500 text-sm">
//                     {new Date(exp.startDate).getFullYear()} – {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
//                   </span>
//                 </div>
//                 {exp.description && <p className="text-gray-700">{exp.description}</p>}
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* SOCIAL LINKS */}
//       {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
//         <section className="p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <UserPlus size={20} className="text-primary" />
//             <h3 className="font-semibold text-lg text-primary">Connect</h3>
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             {Object.entries(user.socialLinks).map(([k, url]) => (
//               <a
//                 key={k}
//                 href={url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-3 py-1 rounded-xl border border-gray-300 text-gray-800 text-sm font-medium flex items-center gap-1"
//                 style={{ backgroundColor: accentColor }}
//               >
//                 {k}
//               </a>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
import { fetchUserById } from "../../api/connections";
import { UserPlus, Github, BookOpen, Briefcase, User, Zap, Star } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const accentColor = "#e6f4f1"; // soft accent for skills/interests

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUserById(userId);
        setUser({
          topSkills: [],
          interests: [],
          education: [],
          experience: [],
          socialLinks: {},
          githubProfile: {},
          ...data,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (!user) return <p className="text-center text-red-500 py-10">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
        <div className="flex items-center gap-4">
          <DevstaAvatar user={user.githubProfile?.avatar_url ? { ...user, avatar: user.githubProfile.avatar_url } : user} size={120} />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold truncate">{user.name || user.githubProfile?.name}</h1>
            <p className="text-gray-500 text-lg">{user.primaryRole || "Developer"}</p>
          </div>
        </div>

        {/* GitHub + Connect */}
        <div className="flex gap-2 flex-wrap">
          {user.githubProfile?.html_url && (
            <a
              href={user.githubProfile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 shadow-sm"
            >
              <Github size={18} /> GitHub
            </a>
          )}

          {!user.isSelf && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-sm">
              <UserPlus size={18} /> Connect
            </button>
          )}
        </div>
      </div>

      {/* ABOUT */}
      {user.bio && (
        <section className="p-4 rounded-xl shadow-sm flex items-start gap-2 border border-gray-200">
          <User size={20} className="text-primary mt-1" />
          <div>
            <h3 className="font-semibold mb-1 text-lg text-primary">About</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {user.topSkills?.length > 0 && (
        <section className="p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-primary" />
            <h3 className="font-semibold text-lg text-primary">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.topSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium"
                style={{ backgroundColor: accentColor }}
              >
                {skill.replace("custom:", "")}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* INTERESTS */}
      {user.interests?.length > 0 && (
        <section className="p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Star size={20} className="text-primary" />
            <h3 className="font-semibold text-lg text-primary">Interests</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium"
                style={{ backgroundColor: accentColor }}
              >
                {interest}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {user.education?.length > 0 && (
        <section className="p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={20} className="text-primary" />
            <h3 className="font-semibold text-lg text-primary">Education</h3>
          </div>
          <div className="space-y-3">
            {user.education.map((edu) => (
              <div key={edu._id} className="p-3 rounded-xl border border-gray-300" style={{ backgroundColor: "#f9fdfd" }}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">{edu.degreeTitle} in {edu.fieldOfStudy}</h4>
                  <span className="text-gray-500 text-sm">{edu.startYear} – {edu.endYear || "Present"}</span>
                </div>
                <p className="text-gray-700">{edu.institution}</p>
                {edu.marksPercent && <p className="text-gray-500 text-sm mt-1">Marks: {edu.marksPercent}%</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {user.experience?.length > 0 && (
        <section className="p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={20} className="text-primary" />
            <h3 className="font-semibold text-lg text-primary">Experience</h3>
          </div>
          <div className="space-y-3">
            {user.experience.map((exp) => (
              <div key={exp._id} className="p-3 rounded-xl border border-gray-300" style={{ backgroundColor: "#f9fdfd" }}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">{exp.position} @ {exp.company}</h4>
                  <span className="text-gray-500 text-sm">{new Date(exp.startDate).getFullYear()} – {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}</span>
                </div>
                {exp.description && <p className="text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SOCIAL LINKS */}
      {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
        <section className="p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={20} className="text-primary" />
            <h3 className="font-semibold text-lg text-primary">Connect</h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(user.socialLinks).map(([k, url]) => (
              <a
                key={k}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium flex items-center gap-1"
                style={{ backgroundColor: accentColor }}
              >
                {k}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
