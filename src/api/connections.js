import { BACKEND_URL } from "../../config";

export const fetchConnections = async (params = {}) => {
  const token = localStorage.getItem("devsta_token");

  // Build query string
  const query = new URLSearchParams(params).toString();
  const url = `${BACKEND_URL}/api/connections${query ? `?${query}` : ""}`;


  // Fetch request
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Handle errors
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Network request failed");
  }

  return response.json();
};


export const fetchUserById = async (userId) => {
  const token = localStorage.getItem("devsta_token");
  const res = await fetch(`${BACKEND_URL}/api/connections/${userId}`, {
    headers: { 
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};
