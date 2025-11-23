
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/user";
import { validateToken } from "../api/auth"; // 

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const storedToken = localStorage.getItem("devsta_token");
    const finalToken = tokenFromUrl || storedToken;
if (window.location.pathname.startsWith("/admin")) return;
    if (finalToken) {
      (async () => {
        // ⚡️ Step 1: validate the token with backend
        const isValid = await validateToken(finalToken);

        if (!isValid) {
          console.warn("Token invalid or expired, logging out...");
          logoutUser();
          return;
        }

        // ⚡️ Step 2: proceed with your original logic
        setToken(finalToken);
        localStorage.setItem("devsta_token", finalToken);

        getCurrentUser(finalToken)
          .then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem("devsta_user", JSON.stringify(freshUser));

            if (!freshUser.onboardingCompleted) {
              setShowWelcome(true);
              navigate("/welcome");
            } else {
              navigate("/dashboard");
            }
          })
          .catch((err) => {
            console.error("Failed to load user:", err);
            logoutUser();
          });
      })();
    }

    if (tokenFromUrl)
      window.history.replaceState({}, document.title, window.location.pathname);
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
