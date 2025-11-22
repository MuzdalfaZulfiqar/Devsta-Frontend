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


// src/pages/User/CommunityPage.jsx
import { Outlet, NavLink } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext"; // ✅ NEW

export default function CommunityPage() {
  const { user } = useAuth();
  const { unreadChatsCount } = useSocket(); // ✅ get unread chats from global socket

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

      {/* ✅ Optional unread badge (used for Messaging) */}
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
          <Tab to="/dashboard/community/connections" label="Connections" />

          {/* ✅ Messaging tab with unread badge */}
          <Tab
            to="/dashboard/community/messaging"
            label="Messaging"
            showBadge={true}
            badgeCount={unreadChatsCount}
          />

          <Tab
            to="/dashboard/community/notifications"
            label="Notifications"
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
