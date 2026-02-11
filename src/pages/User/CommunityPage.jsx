// src/pages/User/CommunityPage.jsx
import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { getPendingRequestsCount } from "../../api/connections";

export default function CommunityPage() {
  const { user } = useAuth();
  const { unreadChatsCount, socket } = useSocket();

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // ✅ Initial load: pending connections count
  useEffect(() => {
    (async () => {
      try {
        const pending = await getPendingRequestsCount();
        setPendingRequestsCount(typeof pending === "number" ? pending : 0);
      } catch (err) {
        console.error("Failed to load pending requests count:", err);
        setPendingRequestsCount(0);
      }
    })();
  }, []);

  // ✅ Live updates for pending connection requests via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handlePendingUpdated = ({ count }) => {
      setPendingRequestsCount(typeof count === "number" ? count : 0);
    };

    socket.on("connections:pendingCountUpdated", handlePendingUpdated);

    return () => {
      socket.off("connections:pendingCountUpdated", handlePendingUpdated);
    };
  }, [socket]);

  const Tab = ({ to, label, showBadge = false, badgeCount = 0 }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 text-[14px] font-[600] border-b-2 flex items-center gap-2
        ${isActive ? "text-primary border-primary" : "text-gray-500 border-transparent"}`
      }
    >
      <span>{label}</span>

      {showBadge && badgeCount > 0 && (
        <span className="min-w-[20px] px-2 py-[2px] text-[11px] rounded-full bg-primary text-white text-center">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </NavLink>
  );

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col w-full h-full">
        {/* Tabs */}
        <div className="flex gap-6 pt-0.5 pb-0 py-1 border-b border-primary/20">
          <Tab to="/dashboard/community" label="Explore" />
          <Tab to="/dashboard/community/feed" label="Feed" />

          <Tab
            to="/dashboard/community/connections"
            label="Connections"
            showBadge
            badgeCount={pendingRequestsCount}
          />

          <Tab
            to="/dashboard/community/messaging"
            label="Messaging"
            showBadge
            badgeCount={unreadChatsCount}
          />
        </div>

        {/* Content */}
        <main className="flex-1 px-4 py-4 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </DashboardLayout>
  );
}
