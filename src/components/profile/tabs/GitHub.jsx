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

//       <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Github</h2>
//       {user.githubConnected ? (
//         <>
//           {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub Stats</h2> */}

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {stats.map(
//               (stat) =>
//                 stat.value !== undefined && (
//                   <div
//                     key={stat.label}
//                     className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg flex flex-col items-start hover:border-primary/40 transition"
//                   >
//                     <div className="flex items-center gap-2">
//                       {stat.icon}
//                       <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{stat.label}</p>
//                     </div>
//                     <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
//                       {stat.value}
//                     </p>
//                   </div>
//                 )
//             )}
//           </div>

//           {user.githubRepos?.length > 0 && (
//             <div>
//               <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Recent Repositories</h3>
//               <div className="grid gap-3">
//                 {user.githubRepos.slice(0, 3).map((repo) => (
//                   <a
//                     key={repo.id}
//                     href={repo.html_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block bg-white dark:bg-gray-900 p-4 rounded-lg border border-primary hover:border-primary/40 transition"
//                   >
//                     <div className="flex justify-between items-center">
//                       <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{repo.name}</p>
//                       <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{repo.language}</span>
//                     </div>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex gap-4">
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

//           {user.githubOrgs?.length > 0 && (
//             <div>
//               <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Organizations</h3>
//               <div className="flex gap-3 flex-wrap">
//                 {user.githubOrgs.map((org) => (
//                   <a
//                     key={org.id}
//                     href={org.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-primary hover:border-primary/40 transition"
//                   >
//                     {org.avatar_url && (
//                       <img src={org.avatar_url} alt={org.login} className="w-6 h-6 rounded-full" />
//                     )}
//                     <span className="text-sm text-gray-700 dark:text-gray-300">{org.login}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-gray-500 dark:text-gray-400">
//           <p>GitHub not connected</p>
//           <button
//             onClick={() => setShowModal(true)}
//             className="mt-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
//           >
//             Connect GitHub
//           </button>

//           {showModal && <GithubConnectModal open={showModal} onClose={() => setShowModal(false)} />}
//         </div>
//       )}
//     </div>

//   );
// }



import { Star, GitFork, Users, UserPlus, BookOpen, FolderGit2 } from "lucide-react";
import GithubConnectModal from "../../dashboard/GithubConnectModal";
import PinReposModal from "../PinReposModal";
import { savePinnedRepos } from "../../../api/profile";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-900 p-4 rounded-lg border border-primary hover:border-primary/40 transition"
    >
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{repo.name}</p>
        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{repo.language}</span>
      </div>
      {repo.description && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2">{repo.description}</p>
      )}
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex gap-4">
        <span className="flex items-center gap-1">
          <Star size={14} className="text-yellow-400" /> {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={14} className="text-green-400" /> {repo.forks_count}
        </span>
      </p>
    </a>
  );
}

export default function GitHub({ user }) {
  const { token, setUser } = useAuth();
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const allRepos = user.githubRepos || [];
  const pinnedSet = new Set(user.pinnedRepos || []);
  const pinnedRepos = allRepos.filter((r) => pinnedSet.has(r.id));
  const displayRepos = pinnedRepos.length > 0 ? pinnedRepos : allRepos.slice(0, 3);
  const isShowingPinned = pinnedRepos.length > 0;

  const handleSave = async (repoIds) => {
    setSaving(true);
    try {
      const data = await savePinnedRepos(repoIds, token);
      setUser((prev) => ({ ...prev, pinnedRepos: data.user.pinnedRepos }));
      setShowPinModal(false);
    } catch (err) {
      console.error("Failed to save projects:", err);
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: "Repositories", value: user.githubStats?.totalRepos, icon: <BookOpen size={18} className="text-primary" /> },
    { label: "Stars", value: user.githubStats?.totalStars, icon: <Star size={18} className="text-yellow-400" /> },
    { label: "Forks", value: user.githubStats?.totalForks, icon: <GitFork size={18} className="text-green-400" /> },
    { label: "Followers", value: user.githubStats?.followers, icon: <Users size={18} className="text-primary" /> },
    { label: "Following", value: user.githubStats?.following, icon: <UserPlus size={18} className="text-purple-400" /> },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Github</h2>

      {user.githubConnected ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map(
              (stat) =>
                stat.value !== undefined && (
                  <div
                    key={stat.label}
                    className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg flex flex-col items-start hover:border-primary/40 transition"
                  >
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                )
            )}
          </div>

          {/* Repos section */}
          {allRepos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {isShowingPinned ? `Projects (${pinnedRepos.length})` : "Recent Repositories"}
                </h3>
                <button
                  onClick={() => setShowPinModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-primary text-primary hover:bg-primary/5 transition"
                >
                  <FolderGit2 size={13} />
                  Manage Projects
                </button>
              </div>
              {!isShowingPinned && (
                <p className="text-xs text-gray-400 mb-3">
                  Select which repos to feature as projects on your public profile.
                </p>
              )}
              <div className="grid gap-3">
                {displayRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
          )}

          {/* Orgs */}
          {user.githubOrgs?.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Organizations</h3>
              <div className="flex gap-3 flex-wrap">
                {user.githubOrgs.map((org) => (
                  <a
                    key={org.id}
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 rounded-lg border border-primary hover:border-primary/40 transition"
                  >
                    {org.avatar_url && (
                      <img src={org.avatar_url} alt={org.login} className="w-6 h-6 rounded-full" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{org.login}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">
          <p>GitHub not connected</p>
          <button
            onClick={() => setShowGithubModal(true)}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
          >
            Connect GitHub
          </button>
          {showGithubModal && (
            <GithubConnectModal open={showGithubModal} onClose={() => setShowGithubModal(false)} />
          )}
        </div>
      )}

      {showPinModal && (
        <PinReposModal
          repos={allRepos}
          pinnedIds={[...pinnedSet]}
          onSave={handleSave}
          onClose={() => setShowPinModal(false)}
          saving={saving}
        />
      )}
    </div>
  );
}