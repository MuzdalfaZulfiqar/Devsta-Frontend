import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import Topbar, { NotificationBell } from "../dashboard/Topbar";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

export default function ProfileLayout({ user, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { notifications, removeNotification } = useNotifications();
  const { logoutUser } = useAuth();

  const handleLogout = () => logoutUser();

  return (
    <div className="flex w-full min-h-screen bg-black text-white font-fragment">
      {/* Sidebar */}
      <ProfileSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
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
          {/* Desktop Topbar */}
          <div className="hidden lg:block">
            <Topbar user={user} />
          </div>

          {/* Mobile Topbar */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-black">
            <img src="/devsta-logo.png" alt="Devsta Logo" className="h-11" />
            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                removeNotification={removeNotification}
              />
              <button
                onClick={() => setIsOpen(true)}
                className="text-white text-2xl flex items-center justify-center"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-black">
          {children(activeTab)}
        </main>
      </div>
    </div>
  );
}
