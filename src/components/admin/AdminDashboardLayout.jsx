// src/components/admin/AdminDashboardLayout.jsx

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { fetchAnalytics } from "../../api/admin";

export default function AdminDashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { token, logout } = useAdminAuth();
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    if (token) {
      fetchAnalytics(token).then(setAnalytics).catch(console.error);
    }
  }, [token]);

  const handleLogout = () => logout();

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-fragment transition-colors duration-300">
      {/* Sidebar */}
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} onLogout={handleLogout} />

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-56">
        {/* Topbar */}
        <div className="sticky top-0 z-40">
          <div className="hidden lg:block">
            <AdminTopbar analytics={analytics} />
          </div>
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-primary/20 bg-gray-50 dark:bg-black">
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-800 dark:text-white text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
