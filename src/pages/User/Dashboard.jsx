import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser } from "../../api/user";
import GithubConnectModal from "../../components/dashboard/GithubConnectModal";

export default function Dashboard() {
  const { user, token, loginUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGithubModal, setShowGithubModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const freshUser = await getCurrentUser(token);
        loginUser(freshUser, token); // ✅ keep updated
        if (!freshUser.githubConnected) {
          setShowGithubModal(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, loginUser]);

  if (loading) return <p className="text-white">Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white font-fragment">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <img
          src={user?.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full mt-4"
        />

        <div className="mt-6">
          <h2 className="text-xl font-semibold">GitHub Stats</h2>
          {user?.githubConnected ? (
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

      {/* 🚨 Show modal if GitHub not connected */}
      {showGithubModal && <GithubConnectModal />}
    </div>
  );
}
