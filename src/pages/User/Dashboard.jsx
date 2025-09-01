import { useEffect, useState } from "react";
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
    const code = params.get("code"); // GitHub OAuth code
    const access_token = params.get("access_token"); // Alternative token parameter
    const error = params.get("error"); // OAuth error
    const state = params.get("state"); // OAuth state parameter

    // Enhanced debugging for GitHub OAuth
    console.log("🔍 Dashboard OAuth Debug:");
    console.log("Current URL:", window.location.href);
    console.log("URL Search:", window.location.search);
    console.log("Token:", token);
    console.log("Code:", code);
    console.log("User data:", userData);
    console.log("Access token:", access_token);
    console.log("Error:", error);
    console.log("State:", state);

    // Handle OAuth errors
    if (error) {
      console.error("❌ OAuth error:", error);
      navigate("/login");
      return;
    }

    // Handle OAuth callback - hide all authentication details
    if (token || access_token || code) {
      console.log("✅ OAuth callback detected, processing...");
      setIsProcessingAuth(true);
      
      // Immediately clear URL parameters to hide authentication details
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("✅ URL parameters cleared");
      
      // Store token silently (handle different token parameter names)
      const authToken = token || access_token;
      if (authToken) {
        localStorage.setItem("devsta_token", authToken);
        console.log("✅ Token stored in localStorage");
      }
      
      // If user data is provided in URL params, log them in
      if (userData) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userData));
          loginUser(parsedUser);
          console.log("✅ User logged in successfully:", parsedUser);
        } catch (error) {
          console.error("❌ Error parsing user data:", error);
        }
      }
      
      // If we have a code but no user data, this might be a GitHub OAuth code
      if (code && !userData) {
        console.log("⚠️ GitHub OAuth code received but no user data");
        console.log("This suggests the backend needs to process the code");
        
        // Try to exchange the code for user data (optional enhancement)
        // This would require an additional API call to your backend
        // For now, we'll just show the loading state
      }
      
      // Hide processing state after a brief moment
      setTimeout(() => {
        setIsProcessingAuth(false);
        console.log("✅ Authentication processing complete");
      }, 500);
    } else {
      console.log("ℹ️ No OAuth parameters detected");
      
      // Check if we're on a GitHub OAuth callback URL pattern
      const currentPath = window.location.pathname;
      if (currentPath.includes('github') || currentPath.includes('oauth') || currentPath.includes('callback')) {
        console.log("⚠️ Detected potential OAuth callback URL pattern");
        console.log("This might be a GitHub OAuth callback that needs processing");
        // You might want to redirect to a specific handler or show a message
      }
    }
  }, [loginUser, navigate]);

  // Show loading state while processing authentication
  if (isProcessingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4 md:p-8 font-fragment">
        <div className="w-full sm:w-[90%] md:w-[70%] max-w-4xl bg-gradient-to-br from-primary/90 via-black/80 to-teal-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center gap-6 border border-primary/50">
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/devsta-logo.png" alt="Devsta Logo" className="h-16 md:h-20 object-contain" />
          </div>
          
          {/* Loading Message */}
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
            <h2 className="text-xl md:text-2xl font-semibold text-white text-center">
              Setting up your account...
            </h2>
            <p className="text-gray-300 text-center text-sm md:text-base">
              Please wait while we complete your authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }
    }

    // Handle OAuth callback - hide all authentication details
    if (token || access_token || code) {
      setIsProcessingAuth(true);
      
      // Immediately clear URL parameters to hide authentication details
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Store token silently (handle different token parameter names)
      const authToken = token || access_token;
      if (authToken) {
        localStorage.setItem("devsta_token", authToken);
      }
      
      // If user data is provided in URL params, log them in
      if (userData) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userData));
          loginUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      // If we have a code but no user data, try to fetch user data
      if (code && !userData) {
        // This might be a GitHub OAuth code that needs to be exchanged
        console.log("OAuth code received, backend should handle this");
        // You might want to make an API call here to exchange the code for user data
        // For now, we'll just show the loading state
      }
      
      // Hide processing state after a brief moment
      setTimeout(() => {
        setIsProcessingAuth(false);
      }, 500);
    }

    // Debug: Log all URL parameters to understand what's being received
    if (window.location.search) {
      console.log("URL parameters received:", window.location.search);
      console.log("Token:", token);
      console.log("Code:", code);
      console.log("User data:", userData);
    }
  }, [loginUser, navigate]);

  // Show loading state while processing authentication
  if (isProcessingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4 md:p-8 font-fragment">
        <div className="w-full sm:w-[90%] md:w-[70%] max-w-4xl bg-gradient-to-br from-primary/90 via-black/80 to-teal-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center gap-6 border border-primary/50">
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/devsta-logo.png" alt="Devsta Logo" className="h-16 md:h-20 object-contain" />
          </div>
          
          {/* Loading Message */}
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
            <h2 className="text-xl md:text-2xl font-semibold text-white text-center">
              Setting up your account...
            </h2>
            <p className="text-gray-300 text-center text-sm md:text-base">
              Please wait while we complete your authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
