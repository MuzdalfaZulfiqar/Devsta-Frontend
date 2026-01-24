// src/api/post.js
import { BACKEND_URL } from "../../config";

/* ============================================
   Helper: Auth Headers
===============================================*/
function getHeaders(isJSON = true) {
  const token = localStorage.getItem("devsta_token");
  return {
    ...(isJSON && { "Content-Type": "application/json" }),
    Authorization: token ? `Bearer ${token}` : ""
  };
}

function getAuthHeader() {
  const token = localStorage.getItem("devsta_token");
  return token ? `Bearer ${token}` : "";
}

/* ============================================
   CREATE POST
   POST /api/posts/createpost
===============================================*/
export async function createPost({ text, visibility = "public", mediaFiles = [] }) {
  const form = new FormData();
  if (text) form.append("text", text);
  form.append("visibility", visibility);

  mediaFiles.forEach((file) => form.append("media", file));

  const res = await fetch(`${BACKEND_URL}/api/posts/createpost`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(), 
      // ❌ Do NOT set Content-Type for FormData
    },
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Failed to create post");
  return data;
}

/* ============================================
   FEED
===============================================*/
export async function getFeed(page = 1, limit = 20) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/listfeed?page=${page}&limit=${limit}`,
    { method: "GET", headers: getHeaders(false) }
  );

  if (!res.ok) throw new Error("Failed to fetch feed");
  return await res.json();
}

export async function getMyPosts(page = 1, limit = 20) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/myposts?page=${page}&limit=${limit}`,
    { method: "GET", headers: getHeaders(false) }
  );

  if (!res.ok) throw new Error("Failed to fetch your posts");
  return await res.json();
}

export async function getPostsByUser(userId, page = 1, limit = 20) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/user/${userId}?page=${page}&limit=${limit}`,
    { method: "GET", headers: getHeaders(false) }
  );

  if (!res.ok) throw new Error("Failed to fetch user posts");
  return await res.json();
}

export async function updatePost(postId, formData) {
  const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
    method: "PUT",
    headers: { Authorization: getAuthHeader() }, // don't set Content-Type for FormData
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Failed to update post");
  return data.post || data; // return the updated post object
}


/* ============================================
   DELETE POST
===============================================*/
export async function deletePost(postId) {
  const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });

  if (!res.ok) throw new Error("Failed to delete post");
  return await res.json();
}

/* ============================================
   LIKE / UNLIKE
===============================================*/
export async function likePost(postId) {
  const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
    method: "POST",
    headers: getHeaders(false),
  });

  if (!res.ok) throw new Error("Failed to like post");
  return await res.json();
}

export async function unlikePost(postId) {
  const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
    method: "DELETE",
    headers: getHeaders(false),
  });

  if (!res.ok) throw new Error("Failed to unlike post");
  return await res.json();
}

export async function listLikes(postId, page = 1, limit = 20) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/${postId}/likes?page=${page}&limit=${limit}`,
    { method: "GET", headers: getHeaders(false) }
  );
  if (!res.ok) throw new Error("Failed to fetch likes");
  return await res.json();
}

/* ============================================
   COMMENTS
===============================================*/
export async function addComment(postId, text) {
  const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to add comment");
  return await res.json();
}

export async function listComments(postId, page = 1, limit = 20) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/${postId}/comments?page=${page}&limit=${limit}`,
    { method: "GET", headers: getHeaders(false) }
  );

  if (!res.ok) throw new Error("Failed to fetch comments");
  return await res.json();
}

export async function updateComment(postId, commentId, text) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}`,
    {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify({ text }),
    }
  );

  if (!res.ok) throw new Error("Failed to update comment");
  return await res.json();
}

export async function deleteComment(postId, commentId) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}`,
    { method: "DELETE", headers: getHeaders(false) }
  );

  if (!res.ok) throw new Error("Failed to delete comment");
  return await res.json();
}


export async function toggleHideComment(postId, commentId, hidden) {
  const res = await fetch(
    `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/hide`,
    {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify({ hidden }),
    }
  );

  if (!res.ok) throw new Error("Failed to update comment visibility");
  return await res.json();
}
