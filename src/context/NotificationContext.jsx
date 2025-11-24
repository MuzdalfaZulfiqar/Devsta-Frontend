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

  const addNotification = useCallback((payload) => {
    // payload: { type, title, message, entityType, entityId, meta }
    const id = crypto.randomUUID?.() || String(Date.now());
    setNotifications((prev) => [
      {
        id,
        read: false,
        createdAt: new Date().toISOString(),
        ...payload,
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
    };
  }, [notifications, addNotification, markAsRead, markAllAsRead, removeNotification]);

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
