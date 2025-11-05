// // src/api/auth.js
// import { BACKEND_URL } from "../../config";

// export async function signupUser(form) {
//   const res = await fetch(`${BACKEND_URL}/api/users/signup`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(form),
//   });

//   let data;
//   try {
//     data = await res.json();
//   } catch (e) {
//     throw new Error("Server returned invalid response");
//   }

//   if (!res.ok) throw new Error(data.msg || "Signup failed");
//   return data; // { user, token }
// }

// export async function loginUser(form) {
//   const res = await fetch(`${BACKEND_URL}/api/users/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(form),
//   });

//   let data;
//   try {
//     data = await res.json();
//   } catch (e) {
//     throw new Error("Server returned invalid response");
//   }

//   if (!res.ok) throw new Error(data.msg || "Login failed");
//   return data; // { user, token }
// }



import { BACKEND_URL } from "../../config";

// --- SIGNUP ---
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

// --- LOGIN ---
export async function loginUser(form) {
  const res = await fetch(`${BACKEND_URL}/api/users/login`, {
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

  if (!res.ok) throw new Error(data.msg || "Login failed");
  return data; // { user, token }
}

// --- TOKEN VALIDATION (NEW) ---
export async function validateToken(token) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/validate-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return false; // token invalid or expired
    }

    const data = await res.json();
    return data.valid === true;
  } catch (err) {
    console.error("Token validation error:", err);
    return false;
  }
}
