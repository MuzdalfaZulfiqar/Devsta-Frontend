// src/api/connections.js
import { BACKEND_URL } from "../../config";

const getToken = () => localStorage.getItem("devsta_token");

const authHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// CONNECTIONS LIST (users list with connection context)
export const fetchConnections = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BACKEND_URL}/api/connections${query ? `?${query}` : ""}`;

  const res = await fetch(url, { method: "GET", headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch connections");
  }
  return res.json();
};

export const fetchUserById = async (userId) => {
  const res = await fetch(`${BACKEND_URL}/api/connections/${userId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch user");
  }
  return res.json();
};

export const sendRequest = async (to) => {
  const res = await fetch(`${BACKEND_URL}/api/connections/requests`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ to }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send request");
  }
  return res.json();
};

export const acceptRequest = async (id) => {
  const res = await fetch(
    `${BACKEND_URL}/api/connections/requests/${id}/accept`,
    { method: "PATCH", headers: authHeaders() }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to accept request");
  }
  return res.json();
};

export const declineRequest = async (id) => {
  const res = await fetch(
    `${BACKEND_URL}/api/connections/requests/${id}/decline`,
    { method: "PATCH", headers: authHeaders() }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to decline request");
  }
  return res.json();
};

export const cancelRequest = async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/connections/requests/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to cancel request");
  }
  return res.json();
};

export const getPendingRequestsCount = async () => {
  const res = await fetch(
    `${BACKEND_URL}/api/connections/requests/pending/count`,
    { method: "GET", headers: authHeaders() }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch pending requests count");
  }
  const data = await res.json();
  return typeof data.count === "number" ? data.count : 0;
};

// ✅ EXPLORE RECOMMENDATIONS (ML-only + server-filtered)
export const fetchExploreRecommendedUsers = async (limit = 30) => {
  const url = `${BACKEND_URL}/api/recommendations/explore?limit=${limit}`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch explore recommendations");
  }
  return res.json();
};
