// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// import Login from "./pages/User/Login";
// import Signup from "./pages/User/Signup";
// import Dashboard from "./pages/User/Dashboard";
// import Onboarding from "./pages/User/Onboarding";
// import ProtectedRoute from "./components/ProtectedRoute";
// import WelcomePage from "./pages/User/WelcomePage";
// import OAuthHandler from "./pages/User/OAuthHandler";
// import ProfilePage from "./pages/User/ProfilePage";
// import VerifyOtp from "./pages/User/VerifyOtp";
// import ForgotPassword from "./pages/User/ForgotPassword";
// import SkillTest from "./pages/User/SkillTest";
// import CommunityPage from "./pages/User/CommunityPage";
// import PublicProfilePage from "./pages/User/PublicProfilePage";
// import AllUsersWithProfile from "./components/networking/AllUsersWithProfile";
// import CommunityNotifications from "./pages/User/CommunityNotifications";
// import CommunityFeed from "./pages/User/CommunityFeed";
// import CommunityConnections from "./pages/User/CommunityConnections";
// import CommunityMessaging from "./pages/User/CommunityMessaging";
// import MyPublicProfilePageWrapper from "./pages/User/MyPublicProfilePageWrapper";


// import AdminLayout from "./pages/admin/AdminLayout";

// function App() {
//   const { user, showWelcome, setShowWelcome } = useAuth();

//   return (
//     <div className="min-h-screen">
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/oauth-handler" element={<OAuthHandler />} />

//         {/* Protected routes */}
//         <Route path="/welcome" element={
//           <ProtectedRoute>
//             <WelcomePage />
//           </ProtectedRoute>
//         } />

//         <Route path="/onboarding" element={
//           <ProtectedRoute>
//             <Onboarding />
//           </ProtectedRoute>
//         } />

//         <Route path="/dashboard" element={
//           <ProtectedRoute requireOnboarding={true}>
//             <Dashboard />
//           </ProtectedRoute>
//         } />

//         <Route path="/dashboard/profile" element={
//           <ProtectedRoute requireOnboarding={true}>
//             <ProfilePage />
//           </ProtectedRoute>
//         } />

//         <Route
//           path="/dashboard/community"
//           element={
//             <ProtectedRoute requireOnboarding={true}>
//               <CommunityPage />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AllUsersWithProfile />} />
//           <Route path="notifications" element={<CommunityNotifications />} />
//           <Route path="feed" element={<CommunityFeed />} />
//           <Route path="connections" element={<CommunityConnections />} />
//           <Route path="messaging" element={<CommunityMessaging />} />

//           <Route path=":userId" element={<AllUsersWithProfile />}>
//             <Route index element={<PublicProfilePage />} />
//           </Route>
//         </Route>

//         <Route
//           path="/dashboard/community/profile/:userId"
//           element={
//             <ProtectedRoute requireOnboarding={true}>
//               <MyPublicProfilePageWrapper />
//             </ProtectedRoute>
//           }
//         />



//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />

//         <Route path="/skill-test" element={<SkillTest />} />



//   {/* Admin routes */}
//         <Route path="/admin/*" element={<AdminLayout />} />
//         {/* Fallback */}
//         <Route path="*" element={<Signup />} />


//       </Routes>

//     </div>
//   );
// }


// export default App;


// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Dashboard from "./pages/User/Dashboard";
import Onboarding from "./pages/User/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./pages/User/WelcomePage";
import OAuthHandler from "./pages/User/OAuthHandler";
import ProfilePage from "./pages/User/ProfilePage";
import VerifyOtp from "./pages/User/VerifyOtp";
import ForgotPassword from "./pages/User/ForgotPassword";
import SkillTest from "./pages/User/SkillTest";
import CommunityPage from "./pages/User/CommunityPage";
import CommunityExplore from "./pages/User/CommunityExplore"; // ✅ NEW
import PublicProfilePage from "./pages/User/PublicProfilePage";
import AllUsersWithProfile from "./components/networking/AllUsersWithProfile";
import CommunityFeed from "./pages/User/CommunityFeed";
import CommunityConnections from "./pages/User/CommunityConnections";
import CommunityMessaging from "./pages/User/CommunityMessaging";
import MyPublicProfilePageWrapper from "./pages/User/MyPublicProfilePageWrapper";


import CompanyRegister from "./pages/company/CompanyRegister";
import CompanyLogin from "./pages/company/CompanyLogin";
import CompanyRegister from "./pages/company/CompanyRegister";
import CompanyLogin from "./pages/company/CompanyLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import CompanyLayout from "./pages/company/CompanyLayout";
import CompanyAuthProvider from "./context/CompanyAuthContext";
import CreateJob from "./pages/company/CreateJob";
import MyJobs from "./pages/company/MyJobs";
import CompanyProtectedRoute from "./components/company/CompanyProtectedRoute";
import JobsPage from "./pages/company/JobsPage";
import MyApplicationsPage from "./pages/company/MyApplicationsPage";
import FirstStageApplicantsPage from "./pages/company/FirstStageApplicantsPage";

function App() {
  const { user, showWelcome, setShowWelcome } = useAuth();

  return (
    <SocketProvider>
      <div className="min-h-screen">
      
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth-handler" element={<OAuthHandler />} />

          {/* Protected routes */}
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/community"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <CommunityPage />
              </ProtectedRoute>
            }
          >
            {/* ✅ EXPLORE NOW SHOWS RECOMMENDATIONS */}
            <Route index element={<CommunityExplore />} />

            <Route path="feed" element={<CommunityFeed />} />
            <Route path="connections" element={<CommunityConnections />} />
            <Route path="messaging" element={<CommunityMessaging />} />

            {/* user profile inside community */}
            <Route path=":userId" element={<AllUsersWithProfile />}>
              <Route index element={<PublicProfilePage />} />
            </Route>
          </Route>

          <Route
            path="/dashboard/community/profile/:userId"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <MyPublicProfilePageWrapper />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/jobs"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <JobsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/my-applications"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />


          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/skill-test" element={<SkillTest />} />

          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminLayout />} />

{/* // Company routes wrapped in CompanyAuthProvider */}
        <Route path="/company/*" element={
            <CompanyAuthProvider>
              <CompanyLayout />
            </CompanyAuthProvider>
          } />


           <Route
            path="/company/login"
            element={
              <CompanyAuthProvider>
                <CompanyLogin />
              </CompanyAuthProvider>
            }
          />
          <Route
            path="/company/register"
            element={
              <CompanyAuthProvider>
                <CompanyRegister />
              </CompanyAuthProvider>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Signup />} />
        </Routes>
      </div>
    </SocketProvider>
  );
}

export default App;
