import { BACKEND_URL } from "../../config";

export async function fetchRoles() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/experience/roles`); // use backend URL
    if (!res.ok) throw new Error("Failed to fetch roles");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching roles:", err);
    return [];
  }
}
