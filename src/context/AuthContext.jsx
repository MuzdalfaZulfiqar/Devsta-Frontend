// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   // Load from localStorage on first render
//   useEffect(() => {
//     const storedUser = localStorage.getItem("devsta_user");
//     const storedToken = localStorage.getItem("devsta_token");
//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setToken(storedToken);
//     }
//   }, []);

//   // Login and persist to localStorage
//   const loginUser = (userData, jwtToken) => {
//     setUser(userData);
//     setToken(jwtToken);
//     localStorage.setItem("devsta_user", JSON.stringify(userData));
//     localStorage.setItem("devsta_token", jwtToken);
//   };

//   // Logout and clear localStorage
//   const logoutUser = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("devsta_user");
//     localStorage.removeItem("devsta_token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Hook for consuming AuthContext
// export function useAuth() {
//   return useContext(AuthContext);
// }


import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/user"; // ✅ ensure correct path

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load from localStorage or URL token on first render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const storedToken = localStorage.getItem("devsta_token");

    const finalToken = tokenFromUrl || storedToken;

    if (finalToken) {
      localStorage.setItem("devsta_token", finalToken);
      setToken(finalToken);

      // Fetch fresh user from backend
      getCurrentUser(finalToken)
        .then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem("devsta_user", JSON.stringify(freshUser));
        })
        .catch((err) => {
          console.error("Failed to load user:", err);
          logoutUser();
        });
    }

    // ✅ Clean URL (remove ?token=...)
    if (tokenFromUrl) {
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("devsta_user", JSON.stringify(userData));
    localStorage.setItem("devsta_token", jwtToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("devsta_user");
    localStorage.removeItem("devsta_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
