import { BACKEND_URL } from "../../config";

export const getOnboarding = async (token) => {
  const res = await fetch(`${BACKEND_URL}/api/users/onboarding`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch onboarding data");
  return res.json();
};

export const saveOnboarding = async (data, token) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "resume" && data.resume instanceof File) {
      formData.append("resume", data.resume);
    } else if (Array.isArray(data[key])) {
      data[key].forEach((item) => formData.append(key, item));
    } else if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  const res = await fetch(`${BACKEND_URL}/api/users/onboarding`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to save onboarding data");
  return res.json();
};

export const deleteResume = async (token) => {
  const res = await fetch(`${BACKEND_URL}/api/users/onboarding/resume`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete resume");
  return res.json();
};
