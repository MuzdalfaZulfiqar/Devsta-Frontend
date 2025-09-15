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
      // Set token in AuthContext
      loginUser(token)
        .then(() => {
          // Navigate to dashboard after login
          navigate("/dashboard", { replace: true });
        })
        .catch(() => {
          navigate("/login", { replace: true });
        });
    } else {
      // No token → fallback to login
      navigate("/login", { replace: true });
    }
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      Logging in...
    </div>
  );
}
