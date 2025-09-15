// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/User/Login";
// import Signup from "./pages/User/Signup";
// import Dashboard from "./pages/User/Dashboard";
// import Onboarding from "./pages/User/Onboarding";
// import ProtectedRoute from "./components/ProtectedRoute";
// import WelcomePage from "./pages/User/WelcomePage";

// function App() {
//   const { user, showWelcome, setShowWelcome } = useAuth();

//   return (
//       <div className="min-h-screen bg-black text-white">
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/welcome" element={<WelcomePage />} />
//           {/* Onboarding route (must be logged in but not necessarily onboarded yet) */}
//           <Route
//             path="/onboarding"
//             element={
//               <ProtectedRoute>
//                 <Onboarding />
//               </ProtectedRoute>
//             }
//           />

//           {/* Dashboard route (requires onboarding to be complete) */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute requireOnboarding={true}>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Dashboard from "./pages/User/Dashboard";
import Onboarding from "./pages/User/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./pages/User/WelcomePage";
import OAuthHandler from "./pages/User/OAuthHandler";

function App() {
  const { user, showWelcome, setShowWelcome } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
  {/* Public routes */}
  <Route path="/" element={<Signup />} />
  <Route path="/login" element={<Login />} />
<Route path="/oauth-handler" element={<OAuthHandler />} />
  {/* Always define welcome route */}
  <Route
    path="/welcome"
    element={
      <ProtectedRoute>
        <WelcomePage />
      </ProtectedRoute>
    }
  />

  {/* Onboarding */}
  <Route
    path="/onboarding"
    element={
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    }
  />

  {/* Dashboard */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute requireOnboarding={true}>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  {/* Fallback */}
  <Route path="*" element={<Signup />} />
</Routes>

    </div>
  );
}


export default App;

