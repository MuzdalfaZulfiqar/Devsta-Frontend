// src/api/company/profile.js
import { BACKEND_URL } from "../../../config";

const BASE_URL = `${BACKEND_URL}/api/company/auth`;

export const getCompanyProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch profile");
  return json.company;
};

export const updateCompanyProfile = async (token, formData) => {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // ────────────────────────────────
      // VERY IMPORTANT: DO NOT set Content-Type when sending FormData
      // Browser sets it automatically with correct boundary
      // ────────────────────────────────
    },
    body: formData, // must be FormData object
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update profile");
  }

  const json = await res.json();
  return json.company;
};