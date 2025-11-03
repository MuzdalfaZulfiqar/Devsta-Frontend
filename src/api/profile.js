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
