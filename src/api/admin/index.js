// src/api/admin/index.js
import { BACKEND_URL } from "../../../config";

const BASE_URL = `${BACKEND_URL}/api/admin`;

// Helper for POST requests
const post = async (url, token, body) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
};


// Helper for GET requests
const get = async (url, token) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Helper for PUT requests
const put = async (url, token, body = null) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });
  return res.json();
};

// Helper for DELETE requests
const del = async (url, token) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// -------------------- AUTH --------------------
export const adminLogin = async (username, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

// -------------------- POSTS --------------------
export const fetchAllPosts = (token) => get("/posts", token);
export const hidePost = (postId, token) => put(`/posts/hide/${postId}`, token);
export const unhidePost = (postId, token) => put(`/posts/unhide/${postId}`, token);
export const deletePost = (postId, token) => del(`/posts/${postId}`, token);


// -------------------- COMMENTS --------------------
export const fetchAllComments = (token) => get("/comments", token); // <--- add this
export const hideComment = (commentId, token) => put(`/comments/hide/${commentId}`, token);
export const unhideComment = (commentId, token) => put(`/comments/unhide/${commentId}`, token);
export const deleteComment = (commentId, token) => del(`/comments/${commentId}`, token);


// -------------------- USERS --------------------
export const fetchAllUsers = (token) => get("/users", token);
export const blockUser = (userId, token) => put(`/users/block/${userId}`, token);
export const unblockUser = (userId, token) => put(`/users/unblock/${userId}`, token);
export const deleteUser = (userId, token) => del(`/users/${userId}`, token);

// -------------------- ANALYTICS --------------------
export const fetchAnalytics = (token) => get("/analytics", token);

// -------------------- ANNOUNCEMENTS --------------------
export const fetchAnnouncements = (token) => get("/announcements", token);
export const createAnnouncement = (data, token) => post("/announcements", token, data);
export const deleteAnnouncement = (id, token) => del(`/announcements/${id}`, token);

// ✅ NEW: Post announcement to platform
export const postAnnouncement = (id, token) => put(`/announcements/post/${id}`, token);