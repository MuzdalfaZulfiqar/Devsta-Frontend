// src/api/recommendation.js
import axios from "axios";
import { BACKEND_URL } from "../config";

export async function getMyRecommendations(token, limit = 10) {
  const url = `${BACKEND_URL}/api/recommendations/me?limit=${limit}`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { userId, items: [...] }
}
