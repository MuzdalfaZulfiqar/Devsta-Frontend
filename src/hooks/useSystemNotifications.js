// src/hooks/useSystemNotifications.js
import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useNotifications } from "../context/NotificationContext";
import { fetchNotifications, markNotificationsRead } from "../api/notifications";

export function useSystemNotifications() {
  const { socket } = useSocket();
  const {
    setFromServer,
    addNotification,
    markAllAsRead: markAllLocalAsRead,
    notifications,
  } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  // 1) Load notifications from backend (initial)
  useEffect(() => {
    if (loadedOnce) return;

    (async () => {
      try {
        setLoading(true);
        const items = await fetchNotifications();
        setFromServer(items);
        setLoadedOnce(true);
      } catch (err) {
        console.error("Failed to load system notifications:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadedOnce, setFromServer]);

  // 2) Socket: new notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = ({ notification }) => {
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

  // 3) Mark all as read on backend + in context
  const markAllAsRead = useCallback(async () => {
    try {
      await markNotificationsRead(); // backend
      markAllLocalAsRead(); // local context
    } catch (err) {
      console.error("Failed to mark notifications as read (system):", err);
    }
  }, [markAllLocalAsRead]);

  return {
    loading,
    notifications,
    markAllAsRead,
  };
}
