import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");

    // Handle OAuth callback
    if (token) {
      localStorage.setItem("devsta_token", token);
      
      // If user data is provided in URL params, log them in
      if (userData) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userData));
          loginUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      // Clear URL parameters after processing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [loginUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 md:p-8 font-fragment">
      <div className="w-full sm:w-[90%] md:w-[70%] max-w-4xl bg-gradient-to-br from-primary/90 via-black/80 to-teal-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center gap-6 border border-primary/50">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/devsta-logo.png" alt="Devsta Logo" className="h-16 md:h-20 object-contain" />
        </div>
        
        {/* Welcome Message */}
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
          {user ? `Welcome back, ${user.name}!` : "Welcome to Devsta!"}
        </h1>
        <p className="text-gray-300 text-center text-sm md:text-base">
          {user
            ? "Ready to explore your projects and tasks?"
            : "Please login or sign up to get started."}
        </p>

        {/* Quick Action Buttons */}
        {user && (
          <div className="flex flex-col md:flex-row gap-4 mt-4 w-full justify-center">
            <button className="bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-6 rounded-lg font-medium transition">
              View Projects
            </button>
            <button className="bg-primary/80 hover:bg-primary/90 text-white py-2.5 px-6 rounded-lg font-medium transition">
              Manage Account
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem("devsta_token");
                localStorage.removeItem("devsta_user");
                window.location.href = "/login";
              }}
              className="bg-red-600 hover:bg-red-700 text-white py-2.5 px-6 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        )}

        {/* Login/Signup buttons if not logged in */}
        {!user && (
          <div className="flex flex-col md:flex-row gap-4 mt-4 w-full justify-center">
            <button 
              onClick={() => navigate("/login")}
              className="bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-6 rounded-lg font-medium transition"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/")}
              className="bg-primary/80 hover:bg-primary/90 text-white py-2.5 px-6 rounded-lg font-medium transition"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Optional Image or Illustration */}
        <div className="mt-6">
          <img
            src="/dashboard-illustration.svg"
            alt="Dashboard Illustration"
            className="w-64 md:w-80 mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
