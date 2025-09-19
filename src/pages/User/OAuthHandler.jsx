import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function OAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      loginUser(token)
        .then(() => navigate("/dashboard", { replace: true }))
        .catch(() => navigate("/login", { replace: true }));
    } else {
      navigate("/login", { replace: true });
    }
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
      <span>Logging in...</span>
    </div>
  );
}
