// src/api/auth.js
import { BACKEND_URL } from "../../config";

export async function signupUser(form) {
  const res = await fetch(`${BACKEND_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Server returned invalid response");
  }

  if (!res.ok) throw new Error(data.msg || "Signup failed");
  return data; // { user, token }
}
