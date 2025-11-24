// import { createContext, useContext, useState, useCallback } from "react";

// const NotificationContext = createContext();

// export function NotificationProvider({ children }) {
//   const [notifications, setNotifications] = useState([]);

//   // ✅ Stable function (doesn’t re-create each render)
//   const addNotification = useCallback((notif) => {
//     setNotifications((prev) => {
//       if (notif.id && prev.some((n) => n.id === notif.id)) {
//         return prev;
//       }
//       return [...prev, { id: notif.id || Date.now(), ...notif }];
//     });
//   }, []);

//   const removeNotification = useCallback((id) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   }, []);

//   return (
//     <NotificationContext.Provider
//       value={{ notifications, addNotification, removeNotification }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// export const useNotifications = () => useContext(NotificationContext);

// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // 👉 Use this when loading notifications from backend (full list)
  const setFromServer = useCallback((items) => {
    setNotifications(
      (items || []).map((n) => ({
        id: n._id || crypto.randomUUID?.() || String(Date.now()),
        read: n.isRead ?? n.read ?? false,
        createdAt: n.createdAt || new Date().toISOString(),
        title: n.title || "Notification",
        message: n.text || n.message || "",
        raw: n, // keep original object if you need it
      }))
    );
  }, []);

  // 👉 Use this for new notifications (e.g. from socket)
  const addNotification = useCallback((payload) => {
    const id = crypto.randomUUID?.() || String(Date.now());
    setNotifications((prev) => [
      {
        id,
        read: false,
        createdAt: payload.createdAt || new Date().toISOString(),
        title: payload.title || "Notification",
        message: payload.message || "",
        raw: payload.raw || null,
        type: payload.type || "system",
      },
      ...prev,
    ]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(() => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    return {
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      setFromServer, // 👈 expose this
    };
  }, [notifications, addNotification, markAsRead, markAllAsRead, removeNotification, setFromServer]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
