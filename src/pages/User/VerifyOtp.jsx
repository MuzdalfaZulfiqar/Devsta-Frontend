import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config";
import SuccessModal from "../../components/SuccessModal";

export default function ResetPassword() {
  const navigate = useNavigate();

  const storedEmail = sessionStorage.getItem("resetEmail") || "";
  const storedOtp = sessionStorage.getItem("resetOtp") || "";

  const [form, setForm] = useState({
    email: storedEmail,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); 
    setMsg("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setMsg(data.msg);
      setSuccessModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 text-sm">
            Enter the OTP you received and choose a new password.
          </p>

          <form onSubmit={handleVerify} className="space-y-3">
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
            />

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition"
            />

            {msg && <p className="text-green-600">{msg}</p>}
            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Reset Password
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold hover:underline"
            >
              Return to Login
            </button>
          </p>
        </div>
      </div>

      <SuccessModal
        open={successModal}
        message="Password reset successful! Click continue to login."
        onClose={() => navigate("/login")}
      />
    </>
  );
}
