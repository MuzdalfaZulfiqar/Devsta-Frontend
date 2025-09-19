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
    const value = data[key];
    
    // ✅ Skip email field as it cannot be changed
    if (key === "email") {
      return;
    }
    
    if (key === "resume" && value instanceof File) {
      formData.append("resume", value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          formData.append(key, item);
        }
      });
    } else if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  // Log FormData contents for debugging
  console.log("saveOnboarding - FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const res = await fetch(`${BACKEND_URL}/api/users/onboarding`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });

  let responseData;
  try {
    responseData = await res.json();
  } catch (e) {
    console.error("Failed to parse response JSON:", e);
    throw new Error("Server returned invalid response");
  }

  console.log("saveOnboarding - Response:", { status: res.status, data: responseData });

  if (!res.ok) {
    const errorMessage = responseData.msg || responseData.message || `HTTP ${res.status}: Failed to save onboarding data`;
    console.error("saveOnboarding - Error:", errorMessage);
    throw new Error(errorMessage);
  }
  
  return responseData;
};

export const deleteResume = async (token) => {
  const res = await fetch(`${BACKEND_URL}/api/users/onboarding/resume`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete resume");
  return res.json();
};
