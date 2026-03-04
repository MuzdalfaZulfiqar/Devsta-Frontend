import { BACKEND_URL } from "../../config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("devsta_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}
export const getTestSessionStatus = async (jobId) => {
  const res = await fetch(
    `${BACKEND_URL}/api/developer/test/${jobId}/session-status`,
    {
      headers: getAuthHeaders(), // ✅ use helper
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to check test status");

  return data;
};