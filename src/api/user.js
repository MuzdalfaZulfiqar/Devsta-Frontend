// import { BACKEND_URL } from "../../config";

// export async function getCurrentUser(token) {
//   const res = await fetch(`${BACKEND_URL}/api/users/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   let data;
//   try {
//     data = await res.json();
//   } catch (e) {
//     throw new Error("Server returned invalid response");
//   }

//   if (!res.ok) throw new Error(data.msg || "Failed to fetch user");
//   return data; // full user object with githubProfile, githubRepos, githubStats, etc.
// }



import { BACKEND_URL } from "../../config";
export async function getCurrentUser(token) {
  const res = await fetch(`${BACKEND_URL}/api/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Server returned invalid response");
  }

  if (!res.ok) throw new Error(data.msg || data.message || "Failed to fetch user");

  // If backend wraps user: { user: {...} }, return inner object; else return data.
  return data.user ?? data;
}