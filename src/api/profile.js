import { BACKEND_URL } from "../../config";

export async function updateUserProfile(data, token) {
  const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.msg || "Failed to update profile");
  return result.user;
}

// api/profile.js
export async function getMyProfile() {
  const token = localStorage.getItem("devsta_token");

  const res = await fetch(`${BACKEND_URL}/api/profile/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // <-- include JWT
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to fetch profile");
  }

  return res.json();
}
