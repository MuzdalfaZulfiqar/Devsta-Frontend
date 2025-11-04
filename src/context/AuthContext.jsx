// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/user";
import { BACKEND_URL } from "../../config";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false); // ✅ show welcome page
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const storedToken = localStorage.getItem("devsta_token");

    const finalToken = tokenFromUrl || storedToken;

    if (finalToken) {
      setToken(finalToken);
      localStorage.setItem("devsta_token", finalToken);

      getCurrentUser(finalToken)
        .then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem("devsta_user", JSON.stringify(freshUser));

          if (!freshUser.onboardingCompleted) {
            setShowWelcome(true); // show Welcome page first
            navigate("/welcome");
          } else {
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          console.error("Failed to load user:", err);
          logoutUser();
        });
    }

    // Clean URL token (preserve current path)
    if (tokenFromUrl) window.history.replaceState({}, document.title, window.location.pathname);
  }, []);


  const loginUser = async (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem("devsta_token", jwtToken);

    try {
      const freshUser = await getCurrentUser(jwtToken);
      setUser(freshUser);
      localStorage.setItem("devsta_user", JSON.stringify(freshUser));

      if (!freshUser.onboardingCompleted) {
        setShowWelcome(true);
        navigate("/welcome");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      logoutUser();
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setShowWelcome(false);
    localStorage.removeItem("devsta_user");
    localStorage.removeItem("devsta_token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        showWelcome,
        setShowWelcome,
        setUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
