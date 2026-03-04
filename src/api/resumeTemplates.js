// src/api/resumeTemplates.js
import axios from "axios";
import { BACKEND_URL } from "../../config";

export async function getResumeTemplates(token) {
  if (!token) throw new Error("User not authenticated");

  const res = await axios.get(`${BACKEND_URL}/api/resume/templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data?.templates || [];
}