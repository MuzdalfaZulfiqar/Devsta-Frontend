import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { loginUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("devsta_token", token);
      // optionally: fetch user profile with this token
    //   loginUser({ token });
    }
  }, []);

  return <h1>Dashboard</h1>;
}
