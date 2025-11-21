// src/hooks/useAdminAuth.js
import { useState } from "react";
import { adminLogin } from "../api/admin";

export const useAdminAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin(username, password);

      if (res.token) {
        localStorage.setItem("adminToken", res.token);
        setToken(res.token);
        return true;
      } else {
        setError(res.message || "Login failed");
        return false;
      }
    } catch (err) {
      setError(err.message || "Server error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  return { token, login, logout, loading, error };
};
