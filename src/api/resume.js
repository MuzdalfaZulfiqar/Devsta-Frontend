import { BACKEND_URL } from "../../config";
import axios from "axios";

/**
 * Generate resume for current user
 * @param {Object} payload - { userId, job_description, required_skills }
 * @param {string} token - JWT token from AuthContext
 */
export async function generateResume(payload, token) {
  if (!token) throw new Error("User not authenticated");

  try {
    const res = await axios.post(`${BACKEND_URL}/api/resume/generate`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error generating resume:", err);
    throw err.response?.data || err;
  }
}
