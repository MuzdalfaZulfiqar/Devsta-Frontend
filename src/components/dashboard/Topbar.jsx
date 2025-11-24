// // File: src/components/dashboard/Topbar.jsx
// import { Bell, X } from "lucide-react";
// import { useState } from "react";
// import { useNotifications } from "../../context/NotificationContext";

// export default function Topbar() {
//   const { notifications, removeNotification } = useNotifications();

//   return (
//     <div className="bg-white dark:bg-black border-b border-primary/20 px-6 h-16 flex justify-end items-center font-fragment text-gray-800 dark:text-white">
//       <NotificationBell
//         notifications={notifications}
//         removeNotification={removeNotification}
//       />
//     </div>
//   );
// }

// /* 🔔 Notification Bell */
// export function NotificationBell({ notifications, removeNotification }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen((p) => !p)}
//         className="relative focus:outline-none"
//       >
//         <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-primary" />
//         {notifications.length > 0 && (
//           <span className="absolute -top-1 -right-1 bg-primary text-xs rounded-full px-1 text-white">
//             {notifications.length}
//           </span>
//         )}
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 border border-primary/20 rounded-lg shadow-lg z-50">
//           {notifications.length === 0 ? (
//             <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
//               No notifications
//             </p>
//           ) : (
//             <ul className="max-h-60 overflow-y-auto">
//               {notifications.map((n) => (
//                 <li
//                   key={n.id}
//                   className="flex justify-between items-start p-3 border-b border-gray-200 dark:border-gray-800 text-sm"
//                 >
//                   <div className="flex-1 text-gray-800 dark:text-gray-200">
//                     <p>{n.message}</p>
//                     {n.action && (
//                       <button
//                         onClick={n.action.onClick}
//                         className="text-primary text-xs mt-1 hover:underline"
//                       >
//                         {n.action.label}
//                       </button>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => removeNotification(n.id)}
//                     className="ml-2 text-gray-400 hover:text-primary"
//                   >
//                     <X size={14} />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// File: src/components/dashboard/Topbar.jsx
import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useSocket } from "../../context/SocketContext";
import {
  fetchNotifications,
  markNotificationsRead,
} from "../../api/notifications";

export default function Topbar() {
  const {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    setFromServer,
  } = useNotifications();

  const { socket } = useSocket();
  const [loading, setLoading] = useState(false);

  // 🔹 1) Initial load from backend → into NotificationContext
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const items = await fetchNotifications();
        // items are your backend notifications (with _id, text, createdAt, etc.)
        setFromServer(items);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [setFromServer]);

  // 🔹 2) Realtime: listen to "notifications:new" from Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = ({ notification }) => {
      // `notification` is whatever backend sends (same as before)
      addNotification({
        type: "system",
        title: notification.title || "Notification",
        message: notification.text || notification.message || "",
        createdAt: notification.createdAt,
        raw: notification,
      });
    };

    socket.on("notifications:new", handleNewNotification);

    return () => {
      socket.off("notifications:new", handleNewNotification);
    };
  }, [socket, addNotification]);

  // 🔹 3) Mark all as read (backend + context)
  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead(); // backend
      markAllAsRead(); // local context
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-black border-b border-primary/20 px-6 h-16 flex justify-end items-center font-fragment text-gray-800 dark:text-white">
      <NotificationBell
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loading}
        removeNotification={removeNotification}
        markAsRead={markAsRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
}

/* 🔔 Notification Bell */
export function NotificationBell({
  notifications,
  unreadCount,
  loading,
  removeNotification,
  markAsRead,
  onMarkAllRead,
}) {
  const [open, setOpen] = useState(false);

  const hasNotifications = notifications && notifications.length > 0;

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative focus:outline-none"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-xs rounded-full px-1 text-white min-w-[18px] text-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 border border-primary/20 rounded-lg shadow-lg z-50">
          {/* Header row */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-semibold">Notifications</span>
            <button
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
              className={`text-xs ${
                unreadCount === 0
                  ? "text-gray-400 cursor-default"
                  : "text-primary hover:underline"
              }`}
            >
              Mark all as read
            </button>
          </div>

          {/* States */}
          {loading && !hasNotifications && (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              Loading notifications...
            </p>
          )}

          {!loading && !hasNotifications && (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </p>
          )}

          {!loading && hasNotifications && (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex justify-between items-start p-3 border-b border-gray-200 dark:border-gray-800 text-sm cursor-pointer ${
                    n.read
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800/60"
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex-1 text-gray-800 dark:text-gray-200">
                    {n.title && (
                      <p className="text-xs font-semibold mb-0.5">
                        {n.title}
                      </p>
                    )}
                    <p>{n.message}</p>
                    {n.createdAt && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // don’t also mark as read
                      removeNotification(n.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-primary"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
