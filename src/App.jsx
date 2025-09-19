import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Dashboard from "./pages/User/Dashboard";
import Onboarding from "./pages/User/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./pages/User/WelcomePage";
import OAuthHandler from "./pages/User/OAuthHandler";
import ProfilePage from "./pages/User/ProfilePage";

function App() {
  const { user, showWelcome, setShowWelcome } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-handler" element={<OAuthHandler />} />
        
        {/* Protected routes */}
        <Route path="/welcome" element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute requireOnboarding={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/profile" element={
          <ProtectedRoute requireOnboarding={true}>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Signup />} />
      </Routes>

    </div>
  );
}


export default App;

