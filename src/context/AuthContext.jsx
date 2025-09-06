import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("devsta_user");
    const storedToken = localStorage.getItem("devsta_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Login and persist to localStorage
  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("devsta_user", JSON.stringify(userData));
    localStorage.setItem("devsta_token", jwtToken);
  };

  // Logout and clear localStorage
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

// Hook for consuming AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
