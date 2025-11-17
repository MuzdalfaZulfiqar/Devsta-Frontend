// src/api/chat.js
import { BACKEND_URL } from "../../config";

async function request(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("devsta_token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BACKEND_URL}${endpoint}`, options);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.msg || "Request failed");
  }

  return res.json();
}

// FIXED — all routes now include /api
export const listConversations = () => {
  return request("/api/conversations", "GET");
};

export const getMessages = (id) => {
  return request(`/api/conversations/${id}/messages`, "GET");
};

export const getOrCreateDirectConversation = (userId) => {
  return request("/api/conversations/direct", "POST", { userId });
};

export const sendMessage = (conversationId, text) => {
  return request(`/api/conversations/${conversationId}/messages`, "POST", { text });
};
