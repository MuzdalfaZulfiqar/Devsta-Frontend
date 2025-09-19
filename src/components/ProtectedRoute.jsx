import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireOnboarding = false }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // Case 1: Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Case 2: User logged in, onboarding NOT completed
  if (!user.onboardingCompleted) {
    // Allow access to WelcomePage or Onboarding
    if (location.pathname === "/welcome" || location.pathname === "/onboarding") {
      return children;
    }

    // If route requires onboarding → force onboarding
    if (requireOnboarding) {
      return <Navigate to="/onboarding" replace state={{ from: location }} />;
    }

    // Any other route → redirect to welcome
    return <Navigate to="/welcome" replace />;
  }

  // Case 3: Logged in & onboarded (or onboarding not required) → show content
  return children;
}
