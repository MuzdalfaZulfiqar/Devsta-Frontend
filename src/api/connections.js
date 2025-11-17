import { BACKEND_URL } from "../../config";

// Helper to get token
const getToken = () => localStorage.getItem("devsta_token");

//
// -----------------------------------------------
// FETCH CONNECTIONS LIST
// -----------------------------------------------
export const fetchConnections = async (params = {}) => {
  const token = getToken();

  const query = new URLSearchParams(params).toString();
  const url = `${BACKEND_URL}/api/connections${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch connections");
  }

  return response.json();
};

//
// -----------------------------------------------
// FETCH SINGLE USER (connection context)
// -----------------------------------------------
export const fetchUserById = async (userId) => {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/connections/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
};

//
// -----------------------------------------------
// SEND CONNECTION REQUEST
// POST /api/connections/requests
// body: { to: userId }
// -----------------------------------------------
export const sendRequest = async (to) => {
  const token = getToken();

  const res = await fetch(`${BACKEND_URL}/api/connections/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ to }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send request");
  }

  return res.json();
};

//
// -----------------------------------------------
// ACCEPT REQUEST
// PATCH /api/connections/requests/:id/accept
// -----------------------------------------------
export const acceptRequest = async (id) => {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/connections/requests/${id}/accept`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to accept request");

  return res.json();
};

//
// -----------------------------------------------
// DECLINE REQUEST
// PATCH /api/connections/requests/:id/decline
// -----------------------------------------------
export const declineRequest = async (id) => {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/connections/requests/${id}/decline`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to decline request");

  return res.json();
};

//
// -----------------------------------------------
// CANCEL REQUEST (sent by me)
// DELETE /api/connections/requests/:id
// -----------------------------------------------
export const cancelRequest = async (id) => {
  const token = getToken();

  const res = await fetch(
    `${BACKEND_URL}/api/connections/requests/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to cancel request");

  return res.json();
};
