import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // ✅ Add notification with optional static ID (prevents duplicates)
  const addNotification = (notif) => {
    setNotifications((prev) => {
      // If notif has static id and already exists, don’t add again
      if (notif.id && prev.some((n) => n.id === notif.id)) {
        return prev;
      }
      return [...prev, { id: notif.id || Date.now(), ...notif }];
    });
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
