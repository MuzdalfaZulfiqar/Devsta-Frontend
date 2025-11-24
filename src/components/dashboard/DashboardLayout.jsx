// File: src/components/dashboard/DashboardLayout.jsx
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar, { NotificationBell } from "./Topbar";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ user, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, removeNotification } = useNotifications();
  const { logoutUser } = useAuth();

  const handleLogout = () => logoutUser();



  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-fragment transition-colors duration-300">
      {/* Sidebar */}


      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLogout={handleLogout}
        user={user}
      />

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
          {/* Desktop */}
          <div className="hidden lg:block">
            <Topbar user={user} />
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-primary/20 bg-gray-50 dark:bg-black">
            <img src="/devsta-logo.png" alt="Devsta Logo" className="h-11" />
            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                removeNotification={removeNotification}
              />
              <button
                onClick={() => setIsOpen(true)}
                className="text-gray-800 dark:text-white text-2xl"
              >
                ☰
              </button>
            </div>
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
