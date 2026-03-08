// import { useState, useEffect ,useCallback} from "react";
// import { useAuth } from "../../context/AuthContext";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useNavigate } from "react-router-dom";
// import { useNotifications } from "../../context/NotificationContext";
// import GithubConnectModal from "../../components/dashboard/GithubConnectModal";
// import ResumeUploadModal from "../../components/dashboard/ResumeUploadModal";
// import DashboardCard from "../../components/dashboard/DashboardCard";
// import InfoModal from "../../components/InfoModal";
// import GitHub from "../../components/profile/tabs/GitHub";
// import { uploadResume } from "../../api/onboarding";
// import { BACKEND_URL } from "../../../config";
// import ValidatedSkills from "../../components/dashboard/ValidatedSkills";
// import AnnouncementCard from "../../components/admin/AnnouncementCard";
// import { FiAlertTriangle, FiX } from "react-icons/fi";

// export default function Dashboard() {
//   const { user, token, setUser } = useAuth();
//   const navigate = useNavigate();
//   const { addNotification } = useNotifications();

//   const [hasModerationAlerts, setHasModerationAlerts] = useState(false);
//   const [moderationAlertCount, setModerationAlertCount] = useState(0);

//   const [isValidating, setIsValidating] = useState(false);
//   const [showGithubModal, setShowGithubModal] = useState(false);
//   const [showResumeModal, setShowResumeModal] = useState(false);
//   const [infoOpen, setInfoOpen] = useState(false);
//   const [infoTitle, setInfoTitle] = useState("");
//   const [infoMessage, setInfoMessage] = useState("");

//   const [announcements, setAnnouncements] = useState([]);
//   const [hasPendingCodingTest, setHasPendingCodingTest] = useState(false);

//   const [moderationItems, setModerationItems] = useState([]);

//   const [dismissedModerationAlerts, setDismissedModerationAlerts] = useState(false);


//   // / ✅ NEW: Trigger to force refresh when moderation changes
//     const [refreshTrigger, setRefreshTrigger] = useState(0);

//      const checkModerationAlerts = useCallback(async () => {
//         try {
//           const res = await fetch(
//             `${BACKEND_URL}/api/notifications?types=content_moderation_removed,comment_flagged_on_your_post&unreadOnly=true&limit=5`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           if (res.ok) {
//             const data = await res.json();
//             const items = data.items || [];
//             setModerationItems(items);
//             setModerationAlertCount(items.length);
//             setHasModerationAlerts(items.length > 0);

//             // ✅ If user dismissed alerts but there are no more items, reset dismiss state
//             if (items.length === 0) {
//               setDismissedModerationAlerts(false);
//             }
//           }
//         } catch (err) {
//           console.warn("Moderation alerts fetch failed", err);
//         }
//       }, [token]);
//   // Fetch live announcements
//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/users/announcements`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setAnnouncements(data);

//           // Push to notifications
//           data.forEach((ann) => {
//             addNotification({
//               id: `announcement-${ann._id}`,
//               title: ann.title,
//               message: ann.message,
//               category: ann.category,
//               type: "announcement",
//               icon: "megaphone",
//             });

//           });
//         }
//       } catch (err) {
//         console.error("Failed to fetch announcements", err);
//       }
//     };

//     fetchAnnouncements();
//   }, [token, addNotification]);

//   // ✅ Check moderation alerts on mount AND when refreshTrigger changes
//   useEffect(() => {
//     if (user && token) {
//       checkModerationAlerts();
//     }
//   }, [user, token, refreshTrigger, checkModerationAlerts]);

//   // ✅ NEW: Expose refresh function globally so PostCard/CommentSection can trigger it
//   useEffect(() => {
//     // Store the refresh function on window so other components can call it
//     window._refreshModerationAlerts = () => {
//       setRefreshTrigger(prev => prev + 1);
//     };

//     return () => {
//       delete window._refreshModerationAlerts;
//     };
//   }, []);


//   // Check for pending coding tests (invited assessments)
//   useEffect(() => {
//     const checkPendingTests = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/developer/test/invited-tests`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (res.ok && data.invitedTests?.length > 0) {
//           setHasPendingCodingTest(true);

//           // Optional: Notify once
//           addNotification({
//             id: "pending-coding-test",
//             title: "Coding Test Invited!",
//             message: `You have been invited to take a coding test for ${data.invitedTests[0].job.title}.`,
//             category: "assessment",
//             type: "info",
//             icon: "code",
//             action: {
//               label: "Start Test",
//               onClick: () => navigate("/dashboard/coding-test")
//             }
//           });
//         }
//       } catch (err) {
//         console.error("Failed to check pending tests", err);
//       }
//     };

//     if (token) {
//       checkPendingTests();
//     }
//   }, [token, navigate, addNotification]);
//   useEffect(() => {
//     if (user && !user.onboardingCompleted) navigate("/welcome");

//     if (user && !user.githubConnected) {
//       addNotification({
//         id: "github-not-connected",
//         message:
//           "Your GitHub is not connected. Connect it to unlock full DevSta features.",
//         action: { label: "Connect", onClick: () => setShowGithubModal(true) },
//       });
//     }
//   }, [user, navigate, addNotification]);

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-fragment transition-colors duration-300">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-700 dark:text-gray-300 text-lg">
//             Loading your dashboard, please wait...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Resume Upload Handler
//   const handleResumeUpload = async (file) => {
//     try {
//       const response = await uploadResume(file, token);
//       setUser((prev) => ({ ...prev, resumeUrl: response.resumeUrl }));
//       setShowResumeModal(false);

//       setInfoTitle("Resume Uploaded");
//       setInfoMessage("Your resume has been uploaded successfully!");
//       setInfoOpen(true);
//     } catch (err) {
//       setInfoTitle("Upload Failed");
//       setInfoMessage(err.message || "Failed to upload resume");
//       setInfoOpen(true);
//     }
//   };

//   // Skill Validation Handler
//   const validateSkills = async () => {

//     const sourcesCount =
//       (user.topSkills?.length > 0 ? 1 : 0) +
//       (user.githubConnected ? 1 : 0) +
//       (user.resumeUrl ? 1 : 0) +
//       (user.hasAttemptedQuiz ? 1 : 0);

//     if (sourcesCount < 2) {
//       setInfoTitle("Add More Sources");
//       setInfoMessage(
//         "Please connect at least one more data source (e.g., Resume, GitHub, or Skill Test) before running skill validation. This helps ensure your DevSta profile score is accurate."
//       );

//       setInfoOpen(true);
//       return; // ⛔ stop here
//     }
//     try {
//       setIsValidating(true);
//       const response = await fetch(
//         `${BACKEND_URL}/api/users/profile/validate-skills`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.msg || "Skill validation failed");

//       let nextStep = "";
//       if (user.resumeUrl && !user.githubConnected)
//         nextStep =
//           "You’ve uploaded your resume — connect your GitHub to improve your score accuracy.";
//       else if (!user.resumeUrl && user.githubConnected)
//         nextStep =
//           "You’ve connected GitHub — upload your resume to improve your score accuracy.";
//       else if (!user.resumeUrl && !user.githubConnected)
//         nextStep =
//           "Upload your resume and connect your GitHub to get a more complete score.";

//       setInfoTitle("Skills Validated");
//       setInfoMessage(
//         `Your DevSta profile score has been generated successfully!\n\n${nextStep}`
//       );
//       setInfoOpen(true);

//       setUser((prev) => ({
//         ...prev,
//         topSkills: data.skills || prev.topSkills,
//         validatedSkills: data.validated_skills,
//         profileScore: data.profile_score,
//         skillsValidated: true,
//       }));
//     } catch (err) {
//       setInfoTitle("Validation Failed");
//       setInfoMessage(err.message || "Failed to validate skills");
//       setInfoOpen(true);
//     } finally {
//       setIsValidating(false);
//     }
//   };

//   // Count available sources for Validate Skills card
//   // Count available sources for Validate Skills card
//   const sourcesAvailable = [
//     user?.topSkills?.length > 0,
//     user?.githubConnected,
//     !!user?.resumeUrl,
//     user.hasAttemptedQuiz,
//   ];
//   const allSourcesAvailable = sourcesAvailable.every(Boolean);

//   // Scroll helper for "View Results"
//   const scrollToSkillsCard = () => {
//     const element = document.getElementById("validated-skills-section");
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//       setInfoTitle("View Your Skills");
//       setInfoMessage("Here’s your validated skills and confidence scores.");
//       setInfoOpen(true);
//     }
//   };

//   // Dynamic Validate Skills card
//   const validateSkillsCard = user.skillsValidated
//     ? {
//       title: "View Your Validated Skills",
//       description:
//         "Your skills have been validated. Click below to view your confidence scores and profile ranking.",
//       actionLabel: "View Results",
//       onAction: scrollToSkillsCard,
//     }
//     : {
//       title: "Validate Skills",
//       description:
//         "Analyze your data (Resume, GitHub, or Skill Test) to generate your DevSta profile score.",
//       actionLabel: isValidating ? "Validating..." : "Validate Skills",
//       onAction: validateSkills,
//       isValidating,
//     };

//   // To-Do / Action cards
//   const todoCards = [
//     !user.githubConnected && {
//       title: "Connect GitHub",
//       description:
//         "Link your GitHub to showcase your repositories and stats on DevSta.",
//       actionLabel: "Connect GitHub",
//       onAction: () => setShowGithubModal(true),
//     },
//     !user.resumeUrl && {
//       title: "Upload Resume",
//       description:
//         "Upload your resume to apply for jobs and collaborations seamlessly.",
//       actionLabel: "Upload Resume",
//       onAction: () => setShowResumeModal(true),
//     },
//     !user.hasAttemptedQuiz && {
//       title: "DevSta Skill Test",
//       description:
//         "Evaluate your technical proficiency and get your DevSta Score.",
//       actionLabel: "Start Test",
//       onAction: () => navigate("/skill-test"),
//     },
//     hasPendingCodingTest && {
//       title: "Pending Coding Tests",
//       description:
//         "You have been invited to take coding assessments for some jobs. Go to My Applications to start them.",
//       actionLabel: "Go to My Applications",
//       onAction: () => {
//         navigate("/dashboard/jobs#my-applications-section");
//       },
//       highlight: true,
//     },
//     // Only show Validate Skills card if at least one source is missing
//     validateSkillsCard,
//   ].filter(Boolean);

//   // Completed / Achievements cards
//   const completedCards = [
//     user.githubConnected && {
//       title: "GitHub Connected",
//       description: "Your GitHub account is linked successfully.",
//       actionLabel: "View GitHub",
//       onAction: () => navigate("/dashboard/profile"),
//       completed: true,
//     },
//     user.resumeUrl && {
//       title: "Resume Uploaded",
//       description: "Your resume is uploaded and ready for applications.",
//       actionLabel: "View Resume in Profile",
//       onAction: () => navigate("/dashboard/profile"),
//       completed: true,
//     },
//     user.hasAttemptedQuiz && {
//       title: "Skill Test Completed",
//       description: `You’ve completed the DevSta Skill Test! Score: ${user.latestQuizScore} / ${user.latestQuizOutOf}`,
//       actionLabel: "View Result",
//       onAction: () => {
//         setInfoTitle("Skill Test Result");
//         setInfoMessage(
//           `You’ve completed the DevSta Skill Test!\nScore: ${user.latestQuizScore} / ${user.latestQuizOutOf}`
//         );
//         setInfoOpen(true);
//       },
//       completed: true,
//     },
//   ].filter(Boolean);

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col gap-8 w-full">
//         {/* Welcome */}
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
//             Welcome Back, {user.name || "User"}!
//           </h1>
//           <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-base mt-1">
//             Here's an overview of your DevSta dashboard. Complete your actions or
//             view your achievements.
//           </p>
//         </div>

//         {/* {hasModerationAlerts && (
//   <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-xl p-5 mb-8 shadow-sm">
//     <div className="flex items-start gap-4">
//       <div className="bg-amber-100 p-3 rounded-full">
//         <FiAlertTriangle className="text-amber-600 text-2xl" />
//       </div>

//       <div className="flex-1">
//         <h3 className="font-bold text-amber-800 text-lg mb-1">
//           Moderation Action Required
//         </h3>

//         <p className="text-amber-800 mb-3">
//           {moderationAlertCount === 1
//             ? "One comment on your post was flagged or automatically removed."
//             : `${moderationAlertCount} comments on your posts were flagged or removed.`}
//         </p>

//         <p className="text-sm text-amber-700 mb-4">
//           These may include harassment, hate speech, or guideline violations. 
//           Review them to keep the community safe.
//         </p>

//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => navigate("/notifications?filter=moderation")}
//             className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
//           >
//             View Details & Affected Posts
//           </button>

//           <button
//             onClick={() => setHasModerationAlerts(false)}
//             className="text-amber-700 hover:text-amber-900 px-4 py-2.5 rounded-lg hover:bg-amber-50 transition"
//           >
//             Dismiss for now
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )} */}
//      {/* ✅ Moderation Alerts with Real-Time Updates */}
//         {hasModerationAlerts && moderationItems.length > 0 && !dismissedModerationAlerts && (
//           <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-xl p-6 mb-8 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
//             <div className="flex items-center justify-between gap-4 mb-5">
//               <div className="flex items-center gap-4">
//                 <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
//                   <FiAlertTriangle className="text-amber-600 text-2xl" />
//                 </div>
//                 <h3 className="font-bold text-amber-900 text-xl">
//                   Moderation Alert — {moderationAlertCount} issue{moderationAlertCount !== 1 ? 's' : ''} on your posts
//                 </h3>
//               </div>

//               {/* Dismiss button */}
//               <button
//                 onClick={() => setDismissedModerationAlerts(true)}
//                 className="flex-shrink-0 p-2 hover:bg-amber-200/50 rounded-lg transition-colors"
//                 title="Dismiss alerts"
//               >
//                 <FiX className="text-amber-700 hover:text-amber-900" size={24} />
//               </button>
//             </div>

//             <div className="space-y-4">
//               {moderationItems.map((notif) => {
//                 const postId = notif.data?.postId;
//                 if (!postId) return null;

//                 const isFlagged = notif.type.includes('flagged');
//                 const label = isFlagged ? "Flagged Comment" : "Removed Comment";

//                 return (
//                   <div
//                     key={notif._id}
//                     onClick={() =>
//                       navigate(
//                         `/dashboard/community/feed?post=${postId}&showComments=true&highlight=flagged`
//                       )
//                     }
//                     className="bg-white border border-amber-200 rounded-lg p-4 cursor-pointer hover:bg-amber-50 hover:border-amber-400 transition-all flex justify-between items-center group"
//                   >
//                     <div className="flex-1">
//                       <p className="font-semibold text-amber-800 group-hover:text-amber-900">
//                         {label}
//                       </p>
//                       <p className="text-sm text-gray-700 mt-1 line-clamp-2">
//                         {notif.text}
//                       </p>
//                     </div>
//                     <span className="text-primary font-medium text-sm ml-4 group-hover:underline flex-shrink-0">
//                       Go to Post →
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>

//             {moderationAlertCount > 5 && (
//               <button
//                 onClick={() => navigate("/dashboard/community/feed")}
//                 className="mt-4 text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
//               >
//                 See all {moderationAlertCount} issues <span aria-hidden="true">→</span>
//               </button>
//             )}

//             <p className="text-xs text-amber-700 mt-4 pt-4 border-t border-amber-200">
//               You can dismiss this alert. Re-review flagged posts anytime by visiting the feed.
//             </p>
//           </div>
//         )}

//         {/* Announcements Section */}
//         {announcements.length > 0 && (
//           <div className="mt-8">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
//               Announcements
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {announcements.map((ann) => (
//                 <AnnouncementCard
//                   key={ann._id}
//                   title={ann.title}
//                   message={ann.message}
//                   category={ann.category}
//                   createdAt={ann.createdAt}
//                 />

//               ))}
//             </div>
//           </div>
//         )}


//         {/* To-Do / Actions Section */}
//         {todoCards.length > 0 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
//               Next Steps for You
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {todoCards.map((card) => (
//                 <DashboardCard key={card.title} {...card} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Completed / Achievements Section */}
//         {completedCards.length > 0 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
//               Achievements
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {completedCards.map((card) => (
//                 <DashboardCard key={card.title} {...card} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* GitHub Stats Section */}
//         {user.githubConnected && (
//           <div className="mt-8">
//             <GitHub user={user} />
//           </div>
//         )}

//         {/* Validated Skills Section */}
//         {(user.skillsValidated || allSourcesAvailable) && (
//           <div id="validated-skills-section" className="mt-8">
//             <ValidatedSkills
//               validatedSkills={user.validatedSkills}
//               profileScore={user.profileScore}
//               user={user}
//               onValidate={validateSkills} // actual rerun function
//               isValidating={isValidating} // show spinner
//             />
//           </div>
//         )}

//       </div>

//       {/* Info Modal */}
//       <InfoModal
//         open={infoOpen}
//         title={infoTitle}
//         message={infoMessage}
//         onClose={() => setInfoOpen(false)}
//       />

//       {/* GitHub Connect Modal */}
//       {showGithubModal && !user.githubConnected && (
//         <GithubConnectModal
//           open={showGithubModal}
//           onClose={() => setShowGithubModal(false)}
//         />
//       )}

//       {/* Resume Upload Modal */}
//       {showResumeModal && (
//         <ResumeUploadModal
//           open={showResumeModal}
//           onClose={() => setShowResumeModal(false)}
//           onUpload={handleResumeUpload}
//         />
//       )}
//     </DashboardLayout>
//   );
// }


// src/pages/Dashboard.jsx

// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "../../context/AuthContext";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useNavigate } from "react-router-dom";
// import { useNotifications } from "../../context/NotificationContext";
// import GithubConnectModal from "../../components/dashboard/GithubConnectModal";
// import ResumeUploadModal from "../../components/dashboard/ResumeUploadModal";
// import DashboardCard from "../../components/dashboard/DashboardCard";
// import InfoModal from "../../components/InfoModal";
// import GitHub from "../../components/profile/tabs/GitHub";
// import { uploadResume } from "../../api/onboarding";
// import { BACKEND_URL } from "../../../config";
// import ValidatedSkills from "../../components/dashboard/ValidatedSkills";
// import AnnouncementCard from "../../components/admin/AnnouncementCard";
// import { FiAlertTriangle, FiX } from "react-icons/fi";
// import { getFlaggedPostIdsForUser, getFlaggedCommentsForPost } from "../../api/post";

// export default function Dashboard() {
//   const { user, token, setUser } = useAuth();
//   const navigate = useNavigate();
//   const { addNotification } = useNotifications();

//   // const [hasModerationAlerts, setHasModerationAlerts] = useState(false);
//   // const [moderationAlertCount, setModerationAlertCount] = useState(0);

//   const [isValidating, setIsValidating] = useState(false);
//   const [showGithubModal, setShowGithubModal] = useState(false);
//   const [showResumeModal, setShowResumeModal] = useState(false);
//   const [infoOpen, setInfoOpen] = useState(false);
//   const [infoTitle, setInfoTitle] = useState("");
//   const [infoMessage, setInfoMessage] = useState("");

//   const [announcements, setAnnouncements] = useState([]);
//   const [hasPendingCodingTest, setHasPendingCodingTest] = useState(false);

//   // const [moderationItems, setModerationItems] = useState([]);
//   // const [dismissedModerationAlerts, setDismissedModerationAlerts] =
//   //   useState(false);

//   const [refreshTrigger, setRefreshTrigger] = useState(0);


//   // Add these instead:
//   const [flaggedAlerts, setFlaggedAlerts] = useState([]);
//   // Shape: [{ postId, commentId, commentText, commentAuthorName }]
//   const [dismissedAlertIds, setDismissedAlertIds] = useState(new Set());
//   const [alertsLoading, setAlertsLoading] = useState(false);

//   // ── 3. REPLACE checkModerationAlerts function ──────────────
//   // const checkModerationAlerts = useCallback(async () => {
//   //   if (!token) return;
//   //   setAlertsLoading(true);
//   //   try {
//   //     // Step 1: Get post IDs that have unreviewed flagged comments
//   //     const flaggedPostIds = await getFlaggedPostIdsForUser();

//   //     if (!flaggedPostIds.length) {
//   //       setFlaggedAlerts([]);
//   //       return;
//   //     }

//   //     // Step 2: For each post, get its flagged comments
//   //     const allAlerts = [];
//   //     await Promise.all(
//   //       flaggedPostIds.map(async (postId) => {
//   //         const comments = await getFlaggedCommentsForPost(postId);
//   //         comments.forEach((c) => {
//   //           allAlerts.push({
//   //             id: String(c._id),          // unique key
//   //             postId,
//   //             commentId: String(c._id),
//   //             commentText: c.text,
//   //             commentAuthorName: c.author?.name || "Unknown",
//   //           });
//   //         });
//   //       })
//   //     );

//   //     setFlaggedAlerts(allAlerts);

//   //     try {
//   //   const notifRes = await fetch(
//   //     `${BACKEND_URL}/api/notifications?types=comment_auto_hidden_on_your_post&unreadOnly=true&limit=20`,
//   //     { headers: { Authorization: `Bearer ${token}` } }
//   //   );
//   //   if (notifRes.ok) {
//   //     const notifData = await notifRes.json();
//   //     const autoHideAlerts = (notifData.items || []).map((n) => ({
//   //       id: `autohide-${n._id}`,
//   //       notificationId: n._id,  // for dismissal via API
//   //       postId: n.data?.postId,
//   //       commentId: n.data?.contentId,
//   //       commentText: n.text,
//   //       commentAuthorName: null,
//   //       isAutoHide: true,        // different badge in UI
//   //     }));

//   //     // Merge with flagged alerts (flagged = needs review, autoHide = FYI)
//   //     setFlaggedAlerts((prev) => [...prev, ...autoHideAlerts]);
//   //   }
//   // } catch (err) {
//   //   console.warn("Auto-hide notification fetch failed:", err);
//   // }
//   //   } catch (err) {
//   //     console.warn("Moderation alerts fetch failed", err);
//   //   } finally {
//   //     setAlertsLoading(false);
//   //   }
//   // }, [token]);


//   const checkModerationAlerts = useCallback(async () => {
//     if (!token) return;
//     setAlertsLoading(true);

//     try {
//       const allAlerts = [];

//       // ── BRANCH 1: flag_review comments (need post author action) ──
//       const flaggedPostIds = await getFlaggedPostIdsForUser();

//       if (flaggedPostIds.length > 0) {
//         await Promise.all(
//           flaggedPostIds.map(async (postId) => {
//             const comments = await getFlaggedCommentsForPost(postId);
//             comments.forEach((c) => {
//               allAlerts.push({
//                 id: String(c._id),
//                 postId,
//                 commentId: String(c._id),
//                 commentText: c.text,
//                 commentAuthorName: c.author?.name || "Unknown",
//                 isAutoHide: false,
//                 badge: "Flagged — Review Needed",
//               });
//             });
//           })
//         );
//       }

//       // ── BRANCH 2: auto_hide notifications (FYI — comment already gone) ──
//       // This runs REGARDLESS of whether flaggedPostIds was empty
//       try {
//         const notifRes = await fetch(
//           `${BACKEND_URL}/api/notifications?types=comment_auto_hidden_on_your_post&unreadOnly=true&limit=20`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (notifRes.ok) {
//           const notifData = await notifRes.json();
//           (notifData.items || []).forEach((n) => {
//             // Avoid duplicates if somehow both exist
//             const alreadyAdded = allAlerts.some(
//               (a) => a.commentId === n.data?.contentId
//             );
//             if (!alreadyAdded && n.data?.postId) {
//               allAlerts.push({
//                 id: `autohide-${n._id}`,
//                 notificationId: n._id,
//                 postId: n.data.postId,
//                 commentId: n.data?.contentId || null,
//                 commentText: "A comment was automatically removed by our moderation system.",
//                 commentAuthorName: null,
//                 isAutoHide: true,
//                 badge: "Auto-Removed",
//               });
//             }
//           });
//         }
//       } catch (err) {
//         console.warn("Auto-hide notification fetch failed:", err);
//       }

//       setFlaggedAlerts(allAlerts);
//     } catch (err) {
//       console.warn("Moderation alerts fetch failed:", err);
//       setFlaggedAlerts([]);
//     } finally {
//       setAlertsLoading(false);
//     }
//   }, [token]);

//   // ── 4. REPLACE handleDismissItem ───────────────────────────
//   // No API call needed — dismissal is purely cosmetic/local
//   const handleDismissAlert = useCallback((alertId) => {
//     setDismissedAlertIds((prev) => new Set([...prev, alertId]));
//   }, []);

//   const handleDismissAll = useCallback(() => {
//     setDismissedAlertIds(new Set(flaggedAlerts.map((a) => a.id)));
//   }, [flaggedAlerts]);

//   // Fetch live announcements
//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/users/announcements`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setAnnouncements(data);

//           data.forEach((ann) => {
//             addNotification({
//               id: `announcement-${ann._id}`,
//               title: ann.title,
//               message: ann.message,
//               category: ann.category,
//               type: "announcement",
//               icon: "megaphone",
//             });
//           });
//         }
//       } catch (err) {
//         console.error("Failed to fetch announcements", err);
//       }
//     };

//     fetchAnnouncements();
//   }, [token, addNotification]);

//   // Check moderation alerts on mount and when trigger changes
//   useEffect(() => {
//     if (user && token) {
//       checkModerationAlerts();
//     }
//   }, [user, token, refreshTrigger, checkModerationAlerts]);

//   // ✅ EXACT: Expose refresh function globally
//   useEffect(() => {
//     window._refreshModerationAlerts = () => {
//       setRefreshTrigger((prev) => prev + 1);
//     };

//     return () => {
//       delete window._refreshModerationAlerts;
//     };
//   }, []);

//   // Check for pending coding tests
//   useEffect(() => {
//     const checkPendingTests = async () => {
//       try {
//         const res = await fetch(
//           `${BACKEND_URL}/api/developer/test/invited-tests`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const data = await res.json();
//         if (res.ok && data.invitedTests?.length > 0) {
//           setHasPendingCodingTest(true);

//           addNotification({
//             id: "pending-coding-test",
//             title: "Coding Test Invited!",
//             message: `You have been invited to take a coding test for ${data.invitedTests[0].job.title}.`,
//             category: "assessment",
//             type: "info",
//             icon: "code",
//             action: {
//               label: "Start Test",
//               onClick: () => navigate("/dashboard/coding-test"),
//             },
//           });
//         }
//       } catch (err) {
//         console.error("Failed to check pending tests", err);
//       }
//     };

//     if (token) {
//       checkPendingTests();
//     }
//   }, [token, navigate, addNotification]);

//   useEffect(() => {
//     if (user && !user.onboardingCompleted) navigate("/welcome");

//     if (user && !user.githubConnected) {
//       addNotification({
//         id: "github-not-connected",
//         message:
//           "Your GitHub is not connected. Connect it to unlock full DevSta features.",
//         action: { label: "Connect", onClick: () => setShowGithubModal(true) },
//       });
//     }
//   }, [user, navigate, addNotification]);

//   // ── 7. COMPUTED VALUES ─────────────────────────────────────
//   const visibleAlerts = flaggedAlerts.filter((a) => !dismissedAlertIds.has(a.id));
//   const hasModerationAlerts = visibleAlerts.length > 0;

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-fragment transition-colors duration-300">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-700 dark:text-gray-300 text-lg">
//             Loading your dashboard, please wait...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const handleResumeUpload = async (file) => {
//     try {
//       const response = await uploadResume(file, token);
//       setUser((prev) => ({ ...prev, resumeUrl: response.resumeUrl }));
//       setShowResumeModal(false);

//       setInfoTitle("Resume Uploaded");
//       setInfoMessage("Your resume has been uploaded successfully!");
//       setInfoOpen(true);
//     } catch (err) {
//       setInfoTitle("Upload Failed");
//       setInfoMessage(err.message || "Failed to upload resume");
//       setInfoOpen(true);
//     }
//   };

//   const validateSkills = async () => {
//     const sourcesCount =
//       (user.topSkills?.length > 0 ? 1 : 0) +
//       (user.githubConnected ? 1 : 0) +
//       (user.resumeUrl ? 1 : 0) +
//       (user.hasAttemptedQuiz ? 1 : 0);

//     if (sourcesCount < 2) {
//       setInfoTitle("Add More Sources");
//       setInfoMessage(
//         "Please connect at least one more data source (e.g., Resume, GitHub, or Skill Test) before running skill validation. This helps ensure your DevSta profile score is accurate."
//       );

//       setInfoOpen(true);
//       return;
//     }
//     try {
//       setIsValidating(true);
//       const response = await fetch(
//         `${BACKEND_URL}/api/users/profile/validate-skills`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.msg || "Skill validation failed");

//       let nextStep = "";
//       if (user.resumeUrl && !user.githubConnected)
//         nextStep =
//           "You've uploaded your resume — connect your GitHub to improve your score accuracy.";
//       else if (!user.resumeUrl && user.githubConnected)
//         nextStep =
//           "You've connected GitHub — upload your resume to improve your score accuracy.";
//       else if (!user.resumeUrl && !user.githubConnected)
//         nextStep =
//           "Upload your resume and connect your GitHub to get a more complete score.";

//       setInfoTitle("Skills Validated");
//       setInfoMessage(
//         `Your DevSta profile score has been generated successfully!\n\n${nextStep}`
//       );
//       setInfoOpen(true);

//       setUser((prev) => ({
//         ...prev,
//         topSkills: data.skills || prev.topSkills,
//         validatedSkills: data.validated_skills,
//         profileScore: data.profile_score,
//         skillsValidated: true,
//       }));
//     } catch (err) {
//       setInfoTitle("Validation Failed");
//       setInfoMessage(err.message || "Failed to validate skills");
//       setInfoOpen(true);
//     } finally {
//       setIsValidating(false);
//     }
//   };

//   const sourcesAvailable = [
//     user?.topSkills?.length > 0,
//     user?.githubConnected,
//     !!user?.resumeUrl,
//     user.hasAttemptedQuiz,
//   ];
//   const allSourcesAvailable = sourcesAvailable.every(Boolean);

//   const scrollToSkillsCard = () => {
//     const element = document.getElementById("validated-skills-section");
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//       setInfoTitle("View Your Skills");
//       setInfoMessage("Here's your validated skills and confidence scores.");
//       setInfoOpen(true);
//     }
//   };

//   const validateSkillsCard = user.skillsValidated
//     ? {
//       title: "View Your Validated Skills",
//       description:
//         "Your skills have been validated. Click below to view your confidence scores and profile ranking.",
//       actionLabel: "View Results",
//       onAction: scrollToSkillsCard,
//     }
//     : {
//       title: "Validate Skills",
//       description:
//         "Analyze your data (Resume, GitHub, or Skill Test) to generate your DevSta profile score.",
//       actionLabel: isValidating ? "Validating..." : "Validate Skills",
//       onAction: validateSkills,
//       isValidating,
//     };

//   const todoCards = [
//     !user.githubConnected && {
//       title: "Connect GitHub",
//       description:
//         "Link your GitHub to showcase your repositories and stats on DevSta.",
//       actionLabel: "Connect GitHub",
//       onAction: () => setShowGithubModal(true),
//     },
//     !user.resumeUrl && {
//       title: "Upload Resume",
//       description:
//         "Upload your resume to apply for jobs and collaborations seamlessly.",
//       actionLabel: "Upload Resume",
//       onAction: () => setShowResumeModal(true),
//     },
//     !user.hasAttemptedQuiz && {
//       title: "DevSta Skill Test",
//       description: "Evaluate your technical proficiency and get your DevSta Score.",
//       actionLabel: "Start Test",
//       onAction: () => navigate("/skill-test"),
//     },
//     hasPendingCodingTest && {
//       title: "Pending Coding Tests",
//       description:
//         "You have been invited to take coding assessments for some jobs. Go to My Applications to start them.",
//       actionLabel: "Go to My Applications",
//       onAction: () => {
//         navigate("/dashboard/jobs#my-applications-section");
//       },
//       highlight: true,
//     },
//     validateSkillsCard,
//   ].filter(Boolean);

//   const completedCards = [
//     user.githubConnected && {
//       title: "GitHub Connected",
//       description: "Your GitHub account is linked successfully.",
//       actionLabel: "View GitHub",
//       onAction: () => navigate("/dashboard/profile"),
//       completed: true,
//     },
//     user.resumeUrl && {
//       title: "Resume Uploaded",
//       description: "Your resume is uploaded and ready for applications.",
//       actionLabel: "View Resume in Profile",
//       onAction: () => navigate("/dashboard/profile"),
//       completed: true,
//     },
//     user.hasAttemptedQuiz && {
//       title: "Skill Test Completed",
//       description: `You've completed the DevSta Skill Test! Score: ${user.latestQuizScore} / ${user.latestQuizOutOf}`,
//       actionLabel: "View Result",
//       onAction: () => {
//         setInfoTitle("Skill Test Result");
//         setInfoMessage(
//           `You've completed the DevSta Skill Test!\nScore: ${user.latestQuizScore} / ${user.latestQuizOutOf}`
//         );
//         setInfoOpen(true);
//       },
//       completed: true,
//     },
//   ].filter(Boolean);

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col gap-8 w-full">
//         {/* Welcome */}
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
//             Welcome Back, {user.name || "User"}!
//           </h1>
//           <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-base mt-1">
//             Here's an overview of your DevSta dashboard. Complete your actions or
//             view your achievements.
//           </p>
//         </div>

//         {/* ✅ EXACT: Moderation Alerts with dismiss individual items */}
//         {hasModerationAlerts && (
//           <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-xl p-6 mb-8 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
//             <div className="flex items-center justify-between gap-4 mb-5">
//               <div className="flex items-center gap-4">
//                 <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
//                   <FiAlertTriangle className="text-amber-600 text-2xl" />
//                 </div>
//                 <h3 className="font-bold text-amber-900 text-xl">
//                   Moderation Alert —{" "}
//                   {visibleAlerts.filter((a) => !a.isAutoHide).length > 0 &&
//                     `${visibleAlerts.filter((a) => !a.isAutoHide).length} flagged`}
//                   {visibleAlerts.filter((a) => !a.isAutoHide).length > 0 &&
//                     visibleAlerts.filter((a) => a.isAutoHide).length > 0 &&
//                     ", "}
//                   {visibleAlerts.filter((a) => a.isAutoHide).length > 0 &&
//                     `${visibleAlerts.filter((a) => a.isAutoHide).length} auto-removed`}
//                   {" "}comment{visibleAlerts.length !== 1 ? "s" : ""} on your posts
//                 </h3>

//               </div>
//               <button
//                 onClick={handleDismissAll}
//                 className="flex-shrink-0 p-2 hover:bg-amber-200/50 rounded-lg transition-colors"
//                 title="Dismiss all alerts"
//               >
//                 <FiX className="text-amber-700 hover:text-amber-900" size={24} />
//               </button>
//             </div>

//             <div className="space-y-3">

//               {visibleAlerts.map((alert) => (
//                 <div
//                   key={alert.id}
//                   className="bg-white border border-amber-200 rounded-lg p-4 hover:bg-amber-50 hover:border-amber-400 transition-all flex justify-between items-center group"
//                 >
//                   <div
//                     onClick={() =>
//                       alert.postId &&
//                       navigate(
//                         `/dashboard/community/feed?post=${alert.postId}&showComments=true&highlight=flagged`
//                       )
//                     }
//                     className={`flex-1 ${alert.postId ? "cursor-pointer" : ""}`}
//                   >
//                     {/* Badge */}
//                     <span
//                       className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${alert.isAutoHide
//                         ? "bg-red-100 text-red-700"
//                         : "bg-amber-100 text-amber-800"
//                         }`}
//                     >
//                       {alert.badge}
//                     </span>

//                     <p className="font-semibold text-amber-800 group-hover:text-amber-900 text-sm">
//                       {alert.isAutoHide
//                         ? "A comment on your post was removed by our system"
//                         : `Flagged comment by ${alert.commentAuthorName}`}
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                       {alert.commentText}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-2 ml-4 flex-shrink-0">
//                     {alert.postId && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           navigate(
//                             `/dashboard/community/feed?post=${alert.postId}&showComments=true&highlight=flagged`
//                           );
//                         }}
//                         className="text-primary font-medium text-sm hover:underline whitespace-nowrap"
//                       >
//                         {alert.isAutoHide ? "View Post →" : "Review →"}
//                       </button>
//                     )}
//                     <button
//                       onClick={() => {
//                         handleDismissAlert(alert.id);
//                         // For auto-hide alerts, also mark the notification as read via API
//                         if (alert.notificationId) {
//                           fetch(`${BACKEND_URL}/api/notifications/${alert.notificationId}/dismiss`, {
//                             method: "PATCH",
//                             headers: { Authorization: `Bearer ${token}` },
//                           }).catch(() => { }); // fire and forget
//                         }
//                       }}
//                       className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors"
//                       title="Dismiss"
//                     >
//                       <FiX className="text-amber-600 hover:text-amber-800" size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))}

//             </div>

//             <p className="text-xs text-amber-700 mt-4 pt-4 border-t border-amber-200">
//               💡 These alerts clear automatically once you hide or delete the flagged comment.
//               Dismiss is temporary — refresh to re-check.
//             </p>
//           </div>
//         )}
//         {/* Announcements Section */}
//         {announcements.length > 0 && (
//           <div className="mt-8">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
//               Announcements
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {announcements.map((ann) => (
//                 <AnnouncementCard
//                   key={ann._id}
//                   title={ann.title}
//                   message={ann.message}
//                   category={ann.category}
//                   createdAt={ann.createdAt}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* To-Do / Actions Section */}
//         {todoCards.length > 0 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
//               Next Steps for You
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {todoCards.map((card) => (
//                 <DashboardCard key={card.title} {...card} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Completed / Achievements Section */}
//         {completedCards.length > 0 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
//               Achievements
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {completedCards.map((card) => (
//                 <DashboardCard key={card.title} {...card} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* GitHub Stats Section */}
//         {user.githubConnected && (
//           <div className="mt-8">
//             <GitHub user={user} />
//           </div>
//         )}

//         {/* Validated Skills Section */}
//         {(user.skillsValidated || allSourcesAvailable) && (
//           <div id="validated-skills-section" className="mt-8">
//             <ValidatedSkills
//               validatedSkills={user.validatedSkills}
//               profileScore={user.profileScore}
//               user={user}
//               onValidate={validateSkills}
//               isValidating={isValidating}
//             />
//           </div>
//         )}
//       </div>

//       {/* Info Modal */}
//       <InfoModal
//         open={infoOpen}
//         title={infoTitle}
//         message={infoMessage}
//         onClose={() => setInfoOpen(false)}
//       />

//       {/* GitHub Connect Modal */}
//       {showGithubModal && !user.githubConnected && (
//         <GithubConnectModal
//           open={showGithubModal}
//           onClose={() => setShowGithubModal(false)}
//         />
//       )}

//       {/* Resume Upload Modal */}
//       {showResumeModal && (
//         <ResumeUploadModal
//           open={showResumeModal}
//           onClose={() => setShowResumeModal(false)}
//           onUpload={handleResumeUpload}
//         />
//       )}
//     </DashboardLayout>
//   );
// }

// src/pages/Dashboard.jsx

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import GithubConnectModal from "../../components/dashboard/GithubConnectModal";
import ResumeUploadModal from "../../components/dashboard/ResumeUploadModal";
import DashboardCard from "../../components/dashboard/DashboardCard";
import InfoModal from "../../components/InfoModal";
import GitHub from "../../components/profile/tabs/GitHub";
import { uploadResume } from "../../api/onboarding";
import { BACKEND_URL } from "../../../config";
import ValidatedSkills from "../../components/dashboard/ValidatedSkills";
import AnnouncementCard from "../../components/admin/AnnouncementCard";
import PendingActionsModal from "../../components/dashboard/PendingActionsModal";
import PendingSummaryCards from "../../components/dashboard/PendingSummaryCards";
import { FiAlertTriangle, FiX, FiCalendar, FiVideo } from "react-icons/fi";
import { getFlaggedPostIdsForUser, getFlaggedCommentsForPost } from "../../api/post";

export default function Dashboard() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [isValidating, setIsValidating] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [hasPendingCodingTest, setHasPendingCodingTest] = useState(false);

  const [flaggedAlerts, setFlaggedAlerts] = useState([]);
  const [dismissedAlertIds, setDismissedAlertIds] = useState(new Set());
  const [alertsLoading, setAlertsLoading] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ── Pending actions modal (tests + interviews) ──────────────
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [invitedTests, setInvitedTests] = useState([]);         // full objects
  const [scheduledInterviews, setScheduledInterviews] = useState([]);

  // ── Moderation alerts ───────────────────────────────────────
  const checkModerationAlerts = useCallback(async () => {
    if (!token) return;
    setAlertsLoading(true);

    try {
      const allAlerts = [];

      // BRANCH 1: flag_review comments
      const flaggedPostIds = await getFlaggedPostIdsForUser();
      if (flaggedPostIds.length > 0) {
        await Promise.all(
          flaggedPostIds.map(async (postId) => {
            const comments = await getFlaggedCommentsForPost(postId);
            comments.forEach((c) => {
              allAlerts.push({
                id: String(c._id),
                postId,
                commentId: String(c._id),
                commentText: c.text,
                commentAuthorName: c.author?.name || "Unknown",
                isAutoHide: false,
                badge: "Flagged — Review Needed",
              });
            });
          })
        );
      }

      // BRANCH 2: auto_hide notifications
      try {
        const notifRes = await fetch(
          `${BACKEND_URL}/api/notifications?types=comment_auto_hidden_on_your_post&unreadOnly=true&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          (notifData.items || []).forEach((n) => {
            const alreadyAdded = allAlerts.some(
              (a) => a.commentId === n.data?.contentId
            );
            if (!alreadyAdded && n.data?.postId) {
              allAlerts.push({
                id: `autohide-${n._id}`,
                notificationId: n._id,
                postId: n.data.postId,
                commentId: n.data?.contentId || null,
                commentText:
                  "A comment was automatically removed by our moderation system.",
                commentAuthorName: null,
                isAutoHide: true,
                badge: "Auto-Removed",
              });
            }
          });
        }
      } catch (err) {
        console.warn("Auto-hide notification fetch failed:", err);
      }

      setFlaggedAlerts(allAlerts);
    } catch (err) {
      console.warn("Moderation alerts fetch failed:", err);
      setFlaggedAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  }, [token]);

  const handleDismissAlert = useCallback((alertId) => {
    setDismissedAlertIds((prev) => new Set([...prev, alertId]));
  }, []);

  const handleDismissAll = useCallback(() => {
    setDismissedAlertIds(new Set(flaggedAlerts.map((a) => a.id)));
  }, [flaggedAlerts]);

  // ── Announcements ───────────────────────────────────────────
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setAnnouncements(data);
          data.forEach((ann) => {
            addNotification({
              id: `announcement-${ann._id}`,
              title: ann.title,
              message: ann.message,
              category: ann.category,
              type: "announcement",
              icon: "megaphone",
            });
          });
        }
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };
    fetchAnnouncements();
  }, [token, addNotification]);

  // ── Moderation alerts ───────────────────────────────────────
  useEffect(() => {
    if (user && token) {
      checkModerationAlerts();
    }
  }, [user, token, refreshTrigger, checkModerationAlerts]);

  useEffect(() => {
    window._refreshModerationAlerts = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
    return () => {
      delete window._refreshModerationAlerts;
    };
  }, []);

  // ── Pending tests + scheduled interviews ────────────────────
  useEffect(() => {
    if (!token) return;

    const checkPendingItems = async () => {
      try {
        // 1. Invited coding tests
        const testRes = await fetch(
          `${BACKEND_URL}/api/developer/test/invited-tests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const testData = await testRes.json();
        const tests = testData.invitedTests || [];

        if (tests.length > 0) {
          setInvitedTests(tests);
          setHasPendingCodingTest(true);
          addNotification({
            id: "pending-coding-test",
            title: "Coding Test Invited!",
            message: `You have been invited to take a coding test for ${
              tests[0].job?.title || "a position"
            }.`,
            category: "assessment",
            type: "info",
            icon: "code",
            action: {
              label: "Start Test",
              onClick: () =>
                navigate("/dashboard/jobs#my-applications-section"),
            },
          });
        }

        // 2. Scheduled interviews — developer's own applications with interview.status = "scheduled"
        const intRes = await fetch(
          `${BACKEND_URL}/api/interview/my-scheduled`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const interviews = intRes.ok
          ? (await intRes.json()).interviews || []
          : [];

        setScheduledInterviews(interviews);

        if (interviews.length > 0) {
          const next = interviews[0];
          const scheduledAt = next.interview?.scheduledAt;
          const isToday =
            scheduledAt &&
            new Date(scheduledAt).toDateString() === new Date().toDateString();

          addNotification({
            id: `scheduled-interview-${next._id}`,
            title: isToday ? "Interview TODAY!" : "Interview Scheduled",
            message: `Your interview for ${next.job?.title || "a position"} is ${
              scheduledAt
                ? `on ${new Date(scheduledAt).toLocaleDateString([], {
                    dateStyle: "medium",
                  })}`
                : "coming up"
            }.`,
            category: "interview",
            type: "info",
            icon: "calendar",
            action: {
              label: "View Details",
              onClick: () =>
                navigate("/dashboard/jobs#my-applications-section"),
            },
          });
        }

        // 3. Show modal on EVERY login if anything is pending
        //    (no sessionStorage gate — removed per user preference)
        if (tests.length > 0 || interviews.length > 0) {
          setTimeout(() => setShowPendingModal(true), 900);
        }
      } catch (err) {
        console.error("Failed to check pending items:", err);
      }
    };

    checkPendingItems();
  }, [token, navigate, addNotification]);

  // ── Onboarding redirect + GitHub nudge ─────────────────────
  useEffect(() => {
    if (user && !user.onboardingCompleted) navigate("/welcome");
    if (user && !user.githubConnected) {
      addNotification({
        id: "github-not-connected",
        message:
          "Your GitHub is not connected. Connect it to unlock full DevSta features.",
        action: { label: "Connect", onClick: () => setShowGithubModal(true) },
      });
    }
  }, [user, navigate, addNotification]);

  // ── Computed values ─────────────────────────────────────────
  const visibleAlerts = flaggedAlerts.filter(
    (a) => !dismissedAlertIds.has(a.id)
  );
  const hasModerationAlerts = visibleAlerts.length > 0;

  // ── Loading state ───────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-fragment transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Loading your dashboard, please wait...
          </p>
        </div>
      </div>
    );
  }

  // ── Handlers ────────────────────────────────────────────────
  const handleResumeUpload = async (file) => {
    try {
      const response = await uploadResume(file, token);
      setUser((prev) => ({ ...prev, resumeUrl: response.resumeUrl }));
      setShowResumeModal(false);
      setInfoTitle("Resume Uploaded");
      setInfoMessage("Your resume has been uploaded successfully!");
      setInfoOpen(true);
    } catch (err) {
      setInfoTitle("Upload Failed");
      setInfoMessage(err.message || "Failed to upload resume");
      setInfoOpen(true);
    }
  };

  const validateSkills = async () => {
    const sourcesCount =
      (user.topSkills?.length > 0 ? 1 : 0) +
      (user.githubConnected ? 1 : 0) +
      (user.resumeUrl ? 1 : 0) +
      (user.hasAttemptedQuiz ? 1 : 0);

    if (sourcesCount < 2) {
      setInfoTitle("Add More Sources");
      setInfoMessage(
        "Please connect at least one more data source (e.g., Resume, GitHub, or Skill Test) before running skill validation."
      );
      setInfoOpen(true);
      return;
    }
    try {
      setIsValidating(true);
      const response = await fetch(
        `${BACKEND_URL}/api/users/profile/validate-skills`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Skill validation failed");

      let nextStep = "";
      if (user.resumeUrl && !user.githubConnected)
        nextStep =
          "You've uploaded your resume — connect your GitHub to improve your score accuracy.";
      else if (!user.resumeUrl && user.githubConnected)
        nextStep =
          "You've connected GitHub — upload your resume to improve your score accuracy.";
      else if (!user.resumeUrl && !user.githubConnected)
        nextStep =
          "Upload your resume and connect your GitHub to get a more complete score.";

      setInfoTitle("Skills Validated");
      setInfoMessage(
        `Your DevSta profile score has been generated successfully!\n\n${nextStep}`
      );
      setInfoOpen(true);

      setUser((prev) => ({
        ...prev,
        topSkills: data.skills || prev.topSkills,
        validatedSkills: data.validated_skills,
        profileScore: data.profile_score,
        skillsValidated: true,
      }));
    } catch (err) {
      setInfoTitle("Validation Failed");
      setInfoMessage(err.message || "Failed to validate skills");
      setInfoOpen(true);
    } finally {
      setIsValidating(false);
    }
  };

  const scrollToSkillsCard = () => {
    const element = document.getElementById("validated-skills-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setInfoTitle("View Your Skills");
      setInfoMessage("Here's your validated skills and confidence scores.");
      setInfoOpen(true);
    }
  };

  const sourcesAvailable = [
    user?.topSkills?.length > 0,
    user?.githubConnected,
    !!user?.resumeUrl,
    user.hasAttemptedQuiz,
  ];
  const allSourcesAvailable = sourcesAvailable.every(Boolean);

  const validateSkillsCard = user.skillsValidated
    ? {
        title: "View Your Validated Skills",
        description:
          "Your skills have been validated. Click below to view your confidence scores and profile ranking.",
        actionLabel: "View Results",
        onAction: scrollToSkillsCard,
      }
    : {
        title: "Validate Skills",
        description:
          "Analyze your data (Resume, GitHub, or Skill Test) to generate your DevSta profile score.",
        actionLabel: isValidating ? "Validating..." : "Validate Skills",
        onAction: validateSkills,
        isValidating,
      };

  // ── Card lists ──────────────────────────────────────────────
  const todoCards = [
    !user.githubConnected && {
      title: "Connect GitHub",
      description:
        "Link your GitHub to showcase your repositories and stats on DevSta.",
      actionLabel: "Connect GitHub",
      onAction: () => setShowGithubModal(true),
    },
    !user.resumeUrl && {
      title: "Upload Resume",
      description:
        "Upload your resume to apply for jobs and collaborations seamlessly.",
      actionLabel: "Upload Resume",
      onAction: () => setShowResumeModal(true),
    },
    !user.hasAttemptedQuiz && {
      title: "DevSta Skill Test",
      description:
        "Evaluate your technical proficiency and get your DevSta Score.",
      actionLabel: "Start Test",
      onAction: () => navigate("/skill-test"),
    },
    validateSkillsCard,
  ].filter(Boolean);

  const completedCards = [
    user.githubConnected && {
      title: "GitHub Connected",
      description: "Your GitHub account is linked successfully.",
      actionLabel: "View GitHub",
      onAction: () => navigate("/dashboard/profile"),
      completed: true,
    },
    user.resumeUrl && {
      title: "Resume Uploaded",
      description: "Your resume is uploaded and ready for applications.",
      actionLabel: "View Resume in Profile",
      onAction: () => navigate("/dashboard/profile"),
      completed: true,
    },
    user.hasAttemptedQuiz && {
      title: "Skill Test Completed",
      description: `You've completed the DevSta Skill Test! Score: ${user.latestQuizScore} / ${user.latestQuizOutOf}`,
      actionLabel: "View Result",
      onAction: () => {
        setInfoTitle("Skill Test Result");
        setInfoMessage(
          `You've completed the DevSta Skill Test!\nScore: ${user.latestQuizScore} / ${user.latestQuizOutOf}`
        );
        setInfoOpen(true);
      },
      completed: true,
    },
  ].filter(Boolean);

  // ── Render ──────────────────────────────────────────────────
  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-8 w-full">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back, {user.name || "User"}!
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-base mt-1">
            Here's an overview of your DevSta dashboard. Complete your actions
            or view your achievements.
          </p>
        </div>

        {/* ── Moderation Alerts ── */}
        {hasModerationAlerts && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-xl p-6 mb-8 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                  <FiAlertTriangle className="text-amber-600 text-2xl" />
                </div>
                <h3 className="font-bold text-amber-900 text-xl">
                  Moderation Alert —{" "}
                  {visibleAlerts.filter((a) => !a.isAutoHide).length > 0 &&
                    `${visibleAlerts.filter((a) => !a.isAutoHide).length} flagged`}
                  {visibleAlerts.filter((a) => !a.isAutoHide).length > 0 &&
                    visibleAlerts.filter((a) => a.isAutoHide).length > 0 &&
                    ", "}
                  {visibleAlerts.filter((a) => a.isAutoHide).length > 0 &&
                    `${visibleAlerts.filter((a) => a.isAutoHide).length} auto-removed`}{" "}
                  comment{visibleAlerts.length !== 1 ? "s" : ""} on your posts
                </h3>
              </div>
              <button
                onClick={handleDismissAll}
                className="flex-shrink-0 p-2 hover:bg-amber-200/50 rounded-lg transition-colors"
                title="Dismiss all alerts"
              >
                <FiX className="text-amber-700 hover:text-amber-900" size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white border border-amber-200 rounded-lg p-4 hover:bg-amber-50 hover:border-amber-400 transition-all flex justify-between items-center group"
                >
                  <div
                    onClick={() =>
                      alert.postId &&
                      navigate(
                        `/dashboard/community/feed?post=${alert.postId}&showComments=true&highlight=flagged`
                      )
                    }
                    className={`flex-1 ${alert.postId ? "cursor-pointer" : ""}`}
                  >
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${
                        alert.isAutoHide
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {alert.badge}
                    </span>
                    <p className="font-semibold text-amber-800 group-hover:text-amber-900 text-sm">
                      {alert.isAutoHide
                        ? "A comment on your post was removed by our system"
                        : `Flagged comment by ${alert.commentAuthorName}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {alert.commentText}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {alert.postId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/dashboard/community/feed?post=${alert.postId}&showComments=true&highlight=flagged`
                          );
                        }}
                        className="text-primary font-medium text-sm hover:underline whitespace-nowrap"
                      >
                        {alert.isAutoHide ? "View Post →" : "Review →"}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDismissAlert(alert.id);
                        if (alert.notificationId) {
                          fetch(
                            `${BACKEND_URL}/api/notifications/${alert.notificationId}/dismiss`,
                            {
                              method: "PATCH",
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          ).catch(() => {});
                        }
                      }}
                      className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <FiX
                        className="text-amber-600 hover:text-amber-800"
                        size={18}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-amber-700 mt-4 pt-4 border-t border-amber-200">
              💡 These alerts clear automatically once you hide or delete the
              flagged comment. Dismiss is temporary — refresh to re-check.
            </p>
          </div>
        )}

        {/* ── Announcements ── */}
        {announcements.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Announcements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((ann) => (
                <AnnouncementCard
                  key={ann._id}
                  title={ann.title}
                  message={ann.message}
                  category={ann.category}
                  createdAt={ann.createdAt}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Pending Tests + Interviews — summary cards ── */}
        {(invitedTests.length > 0 || scheduledInterviews.length > 0) && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Requires Your Attention
            </h2>
            <PendingSummaryCards
              pendingTests={invitedTests}
              scheduledInterviews={scheduledInterviews}
            />
          </div>
        )}

        {/* ── To-Do / Actions ── */}
        {todoCards.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Next Steps for You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {todoCards.map((card) => (
                <DashboardCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        )}

        {/* ── Achievements ── */}
        {completedCards.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
              Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCards.map((card) => (
                <DashboardCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        )}

        {/* ── GitHub Stats ── */}
        {user.githubConnected && (
          <div className="mt-8">
            <GitHub user={user} />
          </div>
        )}

        {/* ── Validated Skills ── */}
        {(user.skillsValidated || allSourcesAvailable) && (
          <div id="validated-skills-section" className="mt-8">
            <ValidatedSkills
              validatedSkills={user.validatedSkills}
              profileScore={user.profileScore}
              user={user}
              onValidate={validateSkills}
              isValidating={isValidating}
            />
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <InfoModal
        open={infoOpen}
        title={infoTitle}
        message={infoMessage}
        onClose={() => setInfoOpen(false)}
      />

      {showGithubModal && !user.githubConnected && (
        <GithubConnectModal
          open={showGithubModal}
          onClose={() => setShowGithubModal(false)}
        />
      )}

      {showResumeModal && (
        <ResumeUploadModal
          open={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          onUpload={handleResumeUpload}
        />
      )}

      {/* ── Pending Actions Modal (tests + interviews) ── */}
      <PendingActionsModal
        open={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        pendingTests={invitedTests}
        scheduledInterviews={scheduledInterviews}
      />
    </DashboardLayout>
  );
}
