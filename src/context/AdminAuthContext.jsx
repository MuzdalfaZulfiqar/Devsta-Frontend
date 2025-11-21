// src/context/AdminAuthContext.jsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();

export default function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Login function
  const login = async (loginFunc, username, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginFunc(username, password);

      if (res.token) {
        localStorage.setItem("adminToken", res.token);
        setToken(res.token);
        navigate("/admin/dashboard"); // redirect to admin dashboard
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

  // Logout function
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{ token, login, logout, loading, error }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
