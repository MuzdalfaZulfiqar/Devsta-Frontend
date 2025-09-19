// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, requireOnboarding = false }) {
//   const { user, token } = useAuth();

//   // Case 1: Not logged in → kick to login
//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Case 2: User logged in but not onboarded → force onboarding
//   if (requireOnboarding && !user.onboardingCompleted) {
//   return <Navigate to="/onboarding" replace />;
// }

//   // Case 3: Logged in & onboarded (or onboarding not required) → show content
//   return children;
// }


// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, requireOnboarding = false }) {
//   const { user, token } = useAuth();
//   const location = useLocation();

//   // Case 1: Not logged in → redirect to login
//   if (!token || !user) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // Case 2: User logged in but onboarding NOT completed
//   // If route requires onboarding → force onboarding
//   if (requireOnboarding && !user.onboardingCompleted) {
//     return <Navigate to="/onboarding" replace state={{ from: location }} />;
//   }

//   // Case 3: User logged in, onboarding incomplete, landing on "/" → redirect to welcome
//   if (!user.onboardingCompleted && location.pathname === "/") {
//     return <Navigate to="/welcome" replace />;
//   }

//   // Case 4: Logged in & onboarded (or onboarding not required) → show content
//   return children;
// }


// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, requireOnboarding = false }) {
//   const { user, token } = useAuth();
//   const location = useLocation();

//   // Case 1: Not logged in → redirect to login
//   if (!token || !user) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // Case 2: Logged in, onboarding NOT completed
//   if (!user.onboardingCompleted) {
//     // Allow access to WelcomePage
//     if (location.pathname === "/welcome") {
//       return children;
//     }

//     // If route requires onboarding → force onboarding
//     if (requireOnboarding) {
//       return <Navigate to="/onboarding" replace state={{ from: location }} />;
//     }

//     // Any other route → redirect to welcome
//     return <Navigate to="/welcome" replace />;
//   }

//   // Case 3: Logged in & onboarded (or onboarding not required) → show content
//   return children;
// }

// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, requireOnboarding = false }) {
//   const { user, token } = useAuth();
//   const location = useLocation();

//   // Case 1: Not logged in → redirect to login
//   if (!token || !user) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // Case 2: User logged in, onboarding NOT completed
//   if (!user.onboardingCompleted) {
//     // Allow access to WelcomePage or Onboarding
//     if (location.pathname === "/welcome" || location.pathname === "/onboarding") {
//       return children;
//     }

//     // If route requires onboarding → force onboarding
//     if (requireOnboarding) {
//       return <Navigate to="/onboarding" replace state={{ from: location }} />;
//     }

//     // Any other route → redirect to welcome
//     return <Navigate to="/welcome" replace />;
//   }

//   // Case 3: Logged in & onboarded (or onboarding not required) → show content
//   return children;
// }


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
