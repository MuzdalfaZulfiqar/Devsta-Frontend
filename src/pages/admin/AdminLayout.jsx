import { Routes, Route } from "react-router-dom";
import AdminAuthProvider from "../../context/AdminAuthContext";
import AdminLogin from "./AdminLogin";
import AdminProtectedRoute from "../../components/admin/AdminProtectedRoute";

// Admin pages
import AdminUsersPage from "./AdminUsersPage";
import AdminPostsPage from "./AdminPostsPage";
import AdminCommentsPage from "./AdminCommentsPage";
import AdminDashboardPage from "./adminDashboardPage";

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="login" element={<AdminLogin />} />

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="users"
          element={
            <AdminProtectedRoute>
              <AdminUsersPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="posts"
          element={
            <AdminProtectedRoute>
              <AdminPostsPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="comments"
          element={
            <AdminProtectedRoute>
              <AdminCommentsPage />
            </AdminProtectedRoute>
          }
        />

        {/* Default route */}
        <Route
          path=""
          element={
            <AdminProtectedRoute>
              <AdminUsersPage />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
}
