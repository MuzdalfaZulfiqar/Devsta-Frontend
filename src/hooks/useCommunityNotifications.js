// src/hooks/useCommunityNotifications.js
import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { getPendingRequestsCount } from "../api/connections";
import {
  getUnreadNotificationCount,
  fetchNotifications,
  markNotificationsRead,
} from "../api/notifications";

export function useCommunityNotifications() {
  const { socket } = useSocket();

  const [pendingCount, setPendingCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // 1) Initial counts (when page loads)
  useEffect(() => {
    (async () => {
      try {
        const [pending, unread] = await Promise.all([
          getPendingRequestsCount(),
          getUnreadNotificationCount(),
        ]);
        setPendingCount(pending);
        setUnreadNotifCount(unread);
      } catch (err) {
        console.error("Failed to load initial community counts", err);
      }
    })();
  }, []);

  // 2) Real-time updates from Socket.IO (for notifications)
  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdated = ({ count }) => {
      setUnreadNotifCount(count);
    };

    const handleNewNotification = ({ notification }) => {
      setNotifications((prev) =>
        notificationsLoaded ? [notification, ...prev] : prev
      );
      setUnreadNotifCount((c) => c + 1);
    };

    socket.on("notifications:unreadCountUpdated", handleUnreadUpdated);
    socket.on("notifications:new", handleNewNotification);

    return () => {
      socket.off("notifications:unreadCountUpdated", handleUnreadUpdated);
      socket.off("notifications:new", handleNewNotification);
    };
  }, [socket, notificationsLoaded]);

  // 3) Load notifications list (when Notifications tab opened)
  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const items = await fetchNotifications();
      setNotifications(items);
      setNotificationsLoaded(true);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // 4) Mark notifications as read (and reset badge)
  const markAllAsRead = useCallback(async () => {
    try {
      await markNotificationsRead();
      setUnreadNotifCount(0);
      // we don't change the list; just mark them read in backend
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  }, []);

  // 5) Optional: manual refresh for pending connections (e.g. after accept/decline)
  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingRequestsCount();
      setPendingCount(count);
    } catch (err) {
      console.error("Failed to refresh pending connections count", err);
    }
  }, []);

  return {
    pendingCount,
    unreadNotifCount,
    notifications,
    notificationsLoaded,
    loadingNotifications,
    loadNotifications,
    markAllAsRead,
    refreshPendingCount,
  };
}
