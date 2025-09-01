// import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");
    const error = params.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login");
      return;
    }

    if (token && userData) {
      setIsProcessingAuth(true);

      // Hide URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      // Store JWT
      localStorage.setItem("devsta_token", token);

      // Store user in context
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        loginUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }

      setTimeout(() => setIsProcessingAuth(false), 500);
    }
  }, [loginUser, navigate]);

  if (isProcessingAuth) {
    return <div>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-fragment">
      <img
        src={user.avatar}
        alt={`${user.name} avatar`}
        className="w-24 h-24 rounded-full mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
      <p className="text-gray-300 mb-4">{user.email}</p>

      {user.githubStats && (
        <div className="flex gap-6 mb-4">
          <div>
            <h2 className="font-semibold">{user.githubStats.public_repos}</h2>
            <p className="text-gray-400 text-sm">Public Repos</p>
          </div>
          <div>
            <h2 className="font-semibold">{user.githubStats.followers}</h2>
            <p className="text-gray-400 text-sm">Followers</p>
          </div>
          <div>
            <h2 className="font-semibold">{user.githubStats.following}</h2>
            <p className="text-gray-400 text-sm">Following</p>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("devsta_token");
          localStorage.removeItem("devsta_user");
          navigate("/login");
        }}
        className="bg-red-600 hover:bg-red-700 py-2 px-6 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}