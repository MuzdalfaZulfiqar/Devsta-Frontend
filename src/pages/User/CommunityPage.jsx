// // src/pages/User/CommunityPage.jsx
// import { Outlet, NavLink } from "react-router-dom";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";

// export default function CommunityPage() {
//   const { user } = useAuth();

//   const Tab = ({ to, label }) => (
//     <NavLink
//       to={to}
//       end
//       className={({ isActive }) =>
//         `px-3 py-2 text-[14px] font-[600] border-b-2 
//         ${isActive ? "text-primary border-primary" : "text-gray-500 border-transparent"}`
//       }
//     >
//       {label}
//     </NavLink>
//   );

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col w-full h-full">

//         {/* Tabs */}
//         <div className="flex gap-6 pt-0.5 pb-0 py-1 border-b border-primary/20">

//           <Tab to="/dashboard/community" label="Explore" />
//           <Tab to="/dashboard/community/feed" label="Feed" />
//           <Tab to="/dashboard/community/connections" label="Connections" />
//           <Tab to="/dashboard/community/messaging" label="Messaging" />
//           <Tab to="/dashboard/community/notifications" label="Notifications" />

//         </div>

//         {/* CONTENT */}
//         <main className="flex-1 px-4 py-4 overflow-hidden">
//           <Outlet />
//         </main>

//       </div>
//     </DashboardLayout>
//   );
// }

// // src/pages/User/CommunityPage.jsx
// import { Outlet, NavLink } from "react-router-dom";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";
// import { useSocket } from "../../context/SocketContext"; // ✅ NEW

// export default function CommunityPage() {
//   const { user } = useAuth();
//   const { unreadChatsCount } = useSocket(); // ✅ get unread chats from global socket

//   const Tab = ({ to, label, showBadge = false, badgeCount = 0 }) => (
//     <NavLink
//       to={to}
//       end
//       className={({ isActive }) =>
//         `px-3 py-2 text-[14px] font-[600] border-b-2 flex items-center gap-2
//         ${isActive ? "text-primary border-primary" : "text-gray-500 border-transparent"}`
//       }
//     >
//       <span>{label}</span>

//       {/* ✅ Optional unread badge (used for Messaging) */}
//       {showBadge && badgeCount > 0 && (
//         <span className="min-w-[20px] px-2 py-[2px] text-[11px] rounded-full bg-primary text-white text-center">
//           {badgeCount > 99 ? "99+" : badgeCount}
//         </span>
//       )}
//     </NavLink>
//   );

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col w-full h-full">
//         {/* Tabs */}
//         <div className="flex gap-6 pt-0.5 pb-0 py-1 border-b border-primary/20">
//           <Tab to="/dashboard/community" label="Explore" />
//           <Tab to="/dashboard/community/feed" label="Feed" />
//           <Tab to="/dashboard/community/connections" label="Connections" />

//           {/* ✅ Messaging tab with unread badge */}
//           <Tab
//             to="/dashboard/community/messaging"
//             label="Messaging"
//             showBadge={true}
//             badgeCount={unreadChatsCount}
//           />

//           <Tab
//             to="/dashboard/community/notifications"
//             label="Notifications"
//           />
//         </div>

//         {/* CONTENT */}
//         <main className="flex-1 px-4 py-4 overflow-hidden">
//           <Outlet />
//         </main>
//       </div>
//     </DashboardLayout>
//   );
// }


// src/pages/User/CommunityPage.jsx
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

import { getPendingRequestsCount } from "../../api/connections";
import {
  getUnreadNotificationCount,
  markNotificationsRead,
} from "../../api/notifications";

export default function CommunityPage() {
  const { user } = useAuth();
  const { unreadChatsCount, socket } = useSocket();
  const location = useLocation();

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // 👉 Initial load: pending connections + unread notifications
  useEffect(() => {
    (async () => {
      try {
        const [pending, unread] = await Promise.all([
          getPendingRequestsCount(),
          getUnreadNotificationCount(),
        ]);
        setPendingRequestsCount(pending);
        setUnreadNotifCount(unread);
      } catch (err) {
        console.error("Failed to load community counts:", err);
      }
    })();
  }, []);

  // 👉 Live updates for notifications count via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdated = ({ count }) => {
      setUnreadNotifCount(count);
    };

    socket.on("notifications:unreadCountUpdated", handleUnreadUpdated);

    return () => {
      socket.off("notifications:unreadCountUpdated", handleUnreadUpdated);
    };
  }, [socket]);

  // 👉 When user opens Notifications tab, mark all as read + clear badge
  useEffect(() => {
    const isNotificationsRoute = location.pathname.endsWith("/notifications");
    if (!isNotificationsRoute) return;

    (async () => {
      try {
        await markNotificationsRead();
        setUnreadNotifCount(0);
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    })();
  }, [location.pathname]);

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

          {/* Connections tab with pending requests badge */}
          <Tab
            to="/dashboard/community/connections"
            label="Connections"
            showBadge={true}
            badgeCount={pendingRequestsCount}
          />

          {/* Messaging tab with unread chats badge (already from SocketContext) */}
          <Tab
            to="/dashboard/community/messaging"
            label="Messaging"
            showBadge={true}
            badgeCount={unreadChatsCount}
          />

          {/* Notifications tab with unread notifications badge */}
          <Tab
            to="/dashboard/community/notifications"
            label="Notifications"
            showBadge={true}
            badgeCount={unreadNotifCount}
          />
        </div>

        {/* CONTENT */}
        <main className="flex-1 px-4 py-4 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </DashboardLayout>
  );
}
