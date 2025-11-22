// src/api/notifications.js
import { BACKEND_URL } from "../../config";

const getToken = () => localStorage.getItem("devsta_token");

//
// -----------------------------------------------
// GET UNREAD NOTIFICATIONS COUNT
// GET /api/notifications/unread/count
// -----------------------------------------------
export const getUnreadNotificationCount = async () => {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/notifications/unread/count`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch unread notifications count");
  }

  const data = await res.json();
  return typeof data.count === "number" ? data.count : 0;
};

//
// -----------------------------------------------
// FETCH NOTIFICATIONS LIST
// GET /api/notifications
// -----------------------------------------------
export const fetchNotifications = async () => {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch notifications");
  }

  const data = await res.json();
  return data.items || [];
};

//
// -----------------------------------------------
// MARK ALL NOTIFICATIONS AS READ
// POST /api/notifications/mark-read
// -----------------------------------------------
export const markNotificationsRead = async () => {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/notifications/mark-read`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to mark notifications as read");
  }

  return res.json();
};
