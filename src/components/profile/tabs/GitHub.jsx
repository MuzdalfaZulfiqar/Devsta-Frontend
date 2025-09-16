// import { Star, GitFork, Users, UserPlus, BookOpen } from "lucide-react";
// import GithubConnectModal from "../../dashboard/GithubConnectModal"; // optional if you want modal support
// import { useState } from "react";

// export default function GitHub({ user }) {
//   const [showModal, setShowModal] = useState(false);

//   if (!user) return null;

//   const stats = [
//     { label: "Repositories", value: user.githubStats?.totalRepos, icon: <BookOpen size={18} className="text-primary" /> },
//     { label: "Stars", value: user.githubStats?.totalStars, icon: <Star size={18} className="text-yellow-400" /> },
//     { label: "Forks", value: user.githubStats?.totalForks, icon: <GitFork size={18} className="text-green-400" /> },
//     { label: "Followers", value: user.githubStats?.followers, icon: <Users size={18} className="text-primary" /> },
//     { label: "Following", value: user.githubStats?.following, icon: <UserPlus size={18} className="text-purple-400" /> },
//   ];

//   return (
//     <div className="flex flex-col gap-8 w-full">
//       {/* GitHub Stats */}
//       {user.githubConnected ? (
//         <>
//           <h2 className="text-lg font-semibold text-white">GitHub Stats</h2>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {stats.map(
//               (stat) =>
//                 stat.value !== undefined && (
//                   <div
//                     key={stat.label}
//                     className="bg-black border border-primary/20 p-4 rounded-lg flex flex-col items-start hover:border-primary transition"
//                   >
//                     <div className="flex items-center gap-2">
//                       {stat.icon}
//                       <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
//                     </div>
//                     <p className="text-lg sm:text-2xl font-bold text-white mt-1">
//                       {stat.value}
//                     </p>
//                   </div>
//                 )
//             )}
//           </div>

//           {/* Recent Repositories */}
//           {user.githubRepos?.length > 0 && (
//             <div>
//               <h3 className="text-base font-semibold text-white mb-3">Recent Repositories</h3>
//               <div className="grid gap-3">
//                 {user.githubRepos.slice(0, 3).map((repo) => (
//                   <a
//                     key={repo.id}
//                     href={repo.html_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block bg-black p-4 rounded-lg border border-primary/20 hover:border-primary transition"
//                   >
//                     <div className="flex justify-between items-center">
//                       <p className="font-medium text-sm sm:text-base text-white">{repo.name}</p>
//                       <span className="text-[10px] sm:text-xs text-gray-400">{repo.language}</span>
//                     </div>
//                     <p className="text-gray-400 text-sm mt-1 flex gap-4">
//                       <span className="flex items-center gap-1">
//                         <Star size={14} className="text-yellow-400" />
//                         {repo.stargazers_count}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <GitFork size={14} className="text-green-400" />
//                         {repo.forks_count}
//                       </span>
//                     </p>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Organizations */}
//           {user.githubOrgs?.length > 0 && (
//             <div>
//               <h3 className="text-base font-semibold text-white mb-3">Organizations</h3>
//               <div className="flex gap-3 flex-wrap">
//                 {user.githubOrgs.map((org) => (
//                   <a
//                     key={org.id}
//                     href={org.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-3 py-2 bg-black rounded-lg border border-primary/20 hover:border-primary transition"
//                   >
//                     {org.avatar_url && (
//                       <img src={org.avatar_url} alt={org.login} className="w-6 h-6 rounded-full" />
//                     )}
//                     <span className="text-sm text-gray-300">{org.login}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-gray-400">
//           <p>GitHub not connected</p>
//           <button
//             onClick={() => setShowModal(true)}
//             className="mt-3 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/80"
//           >
//             Connect GitHub
//           </button>

//           {showModal && (
//             <GithubConnectModal
//               open={showModal}
//               onClose={() => setShowModal(false)}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Star, GitFork, Users, UserPlus, BookOpen } from "lucide-react";
import GithubConnectModal from "../../dashboard/GithubConnectModal"; // optional modal support

export default function GitHub({ user }) {
  const [showModal, setShowModal] = useState(false);

  if (!user) return null;

  const stats = [
    { label: "Repositories", value: user.githubStats?.totalRepos, icon: <BookOpen size={18} className="text-primary" /> },
    { label: "Stars", value: user.githubStats?.totalStars, icon: <Star size={18} className="text-yellow-400" /> },
    { label: "Forks", value: user.githubStats?.totalForks, icon: <GitFork size={18} className="text-green-400" /> },
    { label: "Followers", value: user.githubStats?.followers, icon: <Users size={18} className="text-primary" /> },
    { label: "Following", value: user.githubStats?.following, icon: <UserPlus size={18} className="text-purple-400" /> },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {user.githubConnected ? (
        <>
          <h2 className="text-lg font-semibold text-white">GitHub Stats</h2>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map(
              (stat) =>
                stat.value !== undefined && (
                  <div
                    key={stat.label}
                    className="bg-black border border-primary p-4 rounded-lg flex flex-col items-start"
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
                    className="block bg-black p-4 rounded-lg border border-primary"
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
                    className="flex items-center gap-2 px-3 py-2 bg-black rounded-lg border border-primary"
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
        </>
      ) : (
        <div className="text-gray-400">
          <p>GitHub not connected</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/80"
          >
            Connect GitHub
          </button>

          {showModal && (
            <GithubConnectModal
              open={showModal}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

