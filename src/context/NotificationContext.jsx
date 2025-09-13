import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // ✅ Stable function (doesn’t re-create each render)
  const addNotification = useCallback((notif) => {
    setNotifications((prev) => {
      if (notif.id && prev.some((n) => n.id === notif.id)) {
        return prev;
      }
      return [...prev, { id: notif.id || Date.now(), ...notif }];
    });
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
