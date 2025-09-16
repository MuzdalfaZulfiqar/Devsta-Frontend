// import { useAuth } from "../../context/AuthContext";
// import GithubConnectModal from "../../components/dashboard/GithubConnectModal";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { Star, GitFork, Users, BookOpen, UserPlus } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useNotifications } from "../../context/NotificationContext";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const { addNotification, removeNotification } = useNotifications();

//   // ⏳ Show GitHub connect modal occasionally (1 in 3 visits)
//   useEffect(() => {
//     if (user && !user.githubConnected) {
//       const randomChance = Math.random();
//       if (randomChance < 0.33) setShowModal(true);
//     }
//   }, [user]);

//   // 🔔 Manage GitHub reminder notification
//  useEffect(() => {
//   if (!user) return;

//   if (!user.githubConnected) {
//     addNotification({
//       id: "github-connect",
//       message: "Connect your GitHub to unlock full features.",
//       action: {
//         label: "Connect",
//         onClick: () => setShowModal(true),
//       },
//     });
//   } else {
//     removeNotification("github-connect");
//   }
// }, [user, addNotification, removeNotification]);


//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black text-white font-fragment">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-300 text-lg">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Stats with icons
//   const stats = [
//     {
//       label: "Repositories",
//       value: user.githubStats?.totalRepos,
//       icon: <BookOpen size={18} className="text-blue-400" />,
//     },
//     {
//       label: "Stars",
//       value: user.githubStats?.totalStars,
//       icon: <Star size={18} className="text-yellow-400" />,
//     },
//     {
//       label: "Forks",
//       value: user.githubStats?.totalForks,
//       icon: <GitFork size={18} className="text-green-400" />,
//     },
//     {
//       label: "Followers",
//       value: user.githubStats?.followers,
//       icon: <Users size={18} className="text-primary" />,
//     },
//     {
//       label: "Following",
//       value: user.githubStats?.following,
//       icon: <UserPlus size={18} className="text-purple-400" />,
//     },
//   ];

//   return (
//     <DashboardLayout user={user}>
//       <div className="space-y-8">
//         {/* ✅ Welcome Section */}
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold">Welcome Back!</h1>
//           <p className="text-gray-400 text-sm sm:text-base mt-1">
//             Here’s what’s happening in your DevSta dashboard today 🚀
//           </p>
//         </div>

//         {/* ✅ GitHub Stats (only if connected) */}
//         {user.githubConnected && (
//           <div className="space-y-8">
//             <h2 className="text-xl font-semibold mb-4">GitHub Stats</h2>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {stats.map(
//                 (stat) =>
//                   stat.value !== undefined && (
//                     <div
//                       key={stat.label}
//                       className="bg-gray-950 border border-gray-800 p-4 rounded-lg flex flex-col items-start hover:border-primary transition"
//                     >
//                       <div className="flex items-center gap-2">
//                         {stat.icon}
//                         <p className="text-gray-400 text-xs sm:text-sm">
//                           {stat.label}
//                         </p>
//                       </div>
//                       <p className="text-lg sm:text-2xl font-bold text-white mt-1">
//                         {stat.value}
//                       </p>
//                     </div>
//                   )
//               )}
//             </div>

//             {/* Recent Repositories */}
//             {user.githubRepos && user.githubRepos.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">
//                   Recent Repositories
//                 </h3>
//                 <div className="grid gap-3">
//                   {user.githubRepos.slice(0, 3).map((repo) => (
//                     <a
//                       key={repo.id}
//                       href={repo.html_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="block bg-gray-950 p-4 rounded-lg border border-gray-800 hover:border-primary transition"
//                     >
//                       <div className="flex justify-between items-center">
//                         <p className="font-medium text-sm sm:text-base text-white">
//                           {repo.name}
//                         </p>
//                         <span className="text-[10px] sm:text-xs text-gray-400">
//                           {repo.language}
//                         </span>
//                       </div>
//                       <p className="text-gray-400 text-sm mt-1 flex gap-4">
//                         <span className="flex items-center gap-1">
//                           <Star size={14} className="text-yellow-400" />
//                           {repo.stargazers_count}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <GitFork size={14} className="text-green-400" />
//                           {repo.forks_count}
//                         </span>
//                       </p>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Organizations */}
//             {user.githubOrgs && user.githubOrgs.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Organizations</h3>
//                 <div className="flex gap-3 flex-wrap">
//                   {user.githubOrgs.map((org) => (
//                     <a
//                       key={org.id}
//                       href={org.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 px-3 py-2 bg-gray-950 rounded-lg border border-gray-800 hover:border-primary transition"
//                     >
//                       {org.avatar_url && (
//                         <img
//                           src={org.avatar_url}
//                           alt={org.login}
//                           className="w-6 h-6 rounded-full"
//                         />
//                       )}
//                       <span className="text-sm text-gray-300">{org.login}</span>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* 🔔 Modal appears sometimes */}
//       {showModal && !user.githubConnected && (
//         <GithubConnectModal onClose={() => setShowModal(false)} />
//       )}
//     </DashboardLayout>
//   );
// }

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Star, GitFork, Users, BookOpen, UserPlus } from "lucide-react";
import GithubConnectModal from "../../components/dashboard/GithubConnectModal";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { addNotification, removeNotification, notifications } = useNotifications();

 useEffect(() => {
  if (user && !user.onboardingCompleted) {
    navigate("/welcome"); // or "/onboarding" directly
  }
}, [user, navigate]);


  // Show GitHub connect modal occasionally (1 in 3 visits)
  // useEffect(() => {
  //   if (user && !user.githubConnected) {
  //     if (Math.random() < 0.33) setShowModal(true);
  //   }
  // }, [user]);

  // GitHub reminder notification
  useEffect(() => {
    if (!user) return;

    if (!user.githubConnected) {
      addNotification({
        id: "github-connect",
        message: "Connect your GitHub to unlock full features.",
        action: { label: "Connect", onClick: () => setShowModal(true) },
      });
    } else {
      removeNotification("github-connect");
    }
  }, [user, addNotification, removeNotification]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white font-fragment">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Repositories", value: user.githubStats?.totalRepos, icon: <BookOpen size={18} className="text-primary" /> },
    { label: "Stars", value: user.githubStats?.totalStars, icon: <Star size={18} className="text-yellow-400" /> },
    { label: "Forks", value: user.githubStats?.totalForks, icon: <GitFork size={18} className="text-green-400" /> },
    { label: "Followers", value: user.githubStats?.followers, icon: <Users size={18} className="text-primary" /> },
    { label: "Following", value: user.githubStats?.following, icon: <UserPlus size={18} className="text-purple-400" /> },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-8 w-full">
        {/* Welcome Section */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Welcome Back!</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Here’s what’s happening in your DevSta dashboard today
          </p>
        </div>

        {/* GitHub Stats */}
        {user.githubConnected && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-white">GitHub Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map(
                (stat) =>
                  stat.value !== undefined && (
                    <div
                      key={stat.label}
                      className="bg-black border border-primary/20 p-4 rounded-lg flex flex-col items-start hover:border-primary transition"
                    >
                      <div className="flex items-center gap-2">
                        {stat.icon}
                        <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                  )
              )}
            </div>

            {/* Recent Repositories */}
            {user.githubRepos?.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3">Recent Repositories</h3>
                <div className="grid gap-3">
                  {user.githubRepos.slice(0, 3).map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-black p-4 rounded-lg border border-primary/20 hover:border-primary transition"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm sm:text-base text-white">{repo.name}</p>
                        <span className="text-[10px] sm:text-xs text-gray-400">{repo.language}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 flex gap-4">
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork size={14} className="text-green-400" />
                          {repo.forks_count}
                        </span>
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Organizations */}
            {user.githubOrgs?.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3">Organizations</h3>
                <div className="flex gap-3 flex-wrap">
                  {user.githubOrgs.map((org) => (
                    <a
                      key={org.id}
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-black rounded-lg border border-primary/20 hover:border-primary transition"
                    >
                      {org.avatar_url && (
                        <img src={org.avatar_url} alt={org.login} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-sm text-gray-300">{org.login}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GitHub Connect Modal */}
      {showModal && !user.githubConnected && (
        <GithubConnectModal
  open={showModal && !user.githubConnected}
  onClose={() => setShowModal(false)}
/>

      )}
    </DashboardLayout>
  );
}

