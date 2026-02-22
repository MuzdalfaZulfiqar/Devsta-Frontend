import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://devsta-backend.onrender.com";

// export async function fetchRecommendedJobs(k = 10) {
//   const token = localStorage.getItem("token"); // adjust if you store it differently
//   const { data } = await axios.get(`${API_BASE}/api/jobs/recommended?k=${k}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data; // { userId, items: [{ score, job }] }
// }
export async function getRecommendedJobs({ k = 40 } = {}, token) {
  if (!token) throw new Error("Unauthorized: token missing");

  const { data } = await axios.get(`${API_BASE}/api/jobs/recommended?k=${k}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 15000,
  });

  return data; // { userId, items: [{ score, job }] }
}