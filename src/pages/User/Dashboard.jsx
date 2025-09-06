import { useAuth } from "../../context/AuthContext";
import GithubConnectModal from "../../components/dashboard/GithubConnectModal";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p className="text-white">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-black text-white font-fragment">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <img
          src={user.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full mt-4"
        />

        <div className="mt-6">
          <h2 className="text-xl font-semibold">GitHub Stats</h2>
          {user.githubConnected ? (
            <ul className="mt-2 space-y-1">
              <li>Repos: {user.githubStats.totalRepos}</li>
              <li>Stars: {user.githubStats.totalStars}</li>
              <li>Forks: {user.githubStats.totalForks}</li>
              <li>Followers: {user.githubStats.followers}</li>
              <li>Following: {user.githubStats.following}</li>
            </ul>
          ) : (
            <p>GitHub not connected</p>
          )}
        </div>
      </div>

      {/* ✅ Modal only shows if user has NOT connected GitHub */}
      {!user.githubConnected && <GithubConnectModal />}
    </div>
  );
}
