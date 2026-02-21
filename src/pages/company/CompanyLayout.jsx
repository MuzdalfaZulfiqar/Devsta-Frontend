import React from "react";
import { Routes, Route } from "react-router-dom";
import CompanyProtectedRoute from "../../components/company/CompanyProtectedRoute";

// Pages
import CompanyDashboardPage from "./CompanyDashboardPage";
import CompanyLogin from "./CompanyLogin";
import CompanyRegister from "./CompanyRegister";
import CreateJob from "./CreateJob";
import MyJobs from "./MyJobs";
import FirstStageApplicantsPage from "./FirstStageApplicantsPage";
import CompanyProfile from "./CompanyProfile";

export default function CompanyLayout() {
  return (
    <Routes>

      {/* Protected routes */}
      <Route
        path="dashboard"
        element={<CompanyProtectedRoute><CompanyDashboardPage /></CompanyProtectedRoute>}
      />
      <Route
        path="jobs/new"
        element={<CompanyProtectedRoute><CreateJob /></CompanyProtectedRoute>}
      />
      <Route
        path="jobs"
        element={<CompanyProtectedRoute><MyJobs /></CompanyProtectedRoute>}
      />
      <Route
        path="jobs/:jobId/first-stage-applicants"
        element={<CompanyProtectedRoute><FirstStageApplicantsPage /></CompanyProtectedRoute>}
      />
      <Route
        path="profile"
        element={<CompanyProtectedRoute><CompanyProfile /></CompanyProtectedRoute>}
      />
    </Routes>
  );
}

