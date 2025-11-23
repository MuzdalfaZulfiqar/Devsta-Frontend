

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
  return request(`/api/conversations/${conversationId}/messages`, "POST", {
    text,
  });
};

// ✅ NEW: mark a conversation as read for current user
export const markConversationAsRead = (conversationId) => {
  return request(
    `/api/conversations/${conversationId}/mark-read`,
    "POST"
  );
};

// NEW: send file message (PDF/Word/Excel/PPT etc.) using FormData
export const sendFileMessage = async (conversationId, file, text = "") => {
  const token = localStorage.getItem("devsta_token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("conversationId", conversationId);
  if (text && text.trim()) {
    formData.append("text", text.trim());
  }

  const res = await fetch(`${BACKEND_URL}/api/messages/with-file`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.msg || "File message failed");
  }

  return res.json();
};

export const createGroupConversation = (name, memberIds) => {
  return request("/api/conversations/group", "POST", { name, memberIds });
};

export const updateGroupConversation = (conversationId, updates) => {
  return request(
    `/api/conversations/group/${conversationId}`,
    "PATCH",
    updates
  );
};

// Group-related APIs
export const getGroupMembers = (groupId) =>
  request(`/api/conversations/group/${groupId}/members`);

export const promoteAdmin = (groupId, userId) =>
  request(`/api/conversations/group/${groupId}/promote`, "PATCH", { userId });

export const demoteAdmin = (groupId, userId) =>
  request(`/api/conversations/group/${groupId}/demote`, "PATCH", { userId });

export const updateGroup = (groupId, updates) =>
  request(`/api/conversations/group/${groupId}`, "PATCH", updates);

export const leaveGroup = (groupId) =>
  request(`/api/conversations/group/${groupId}/leave`, "POST");

export const deleteGroup = (groupId) =>
  request(`/api/conversations/group/${groupId}`, "DELETE");

export const addMembersToGroup = (groupId, memberIds) =>
  updateGroup(groupId, { addMembers: memberIds });
