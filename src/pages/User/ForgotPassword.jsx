import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config";
import { Copy, Mail } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError(""); 
    setMsg("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setMsg(data.msg);
      setOtp(data.otp);
      setOtpGenerated(true);

      sessionStorage.setItem("resetEmail", email);
      sessionStorage.setItem("resetOtp", data.otp);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNext = () => navigate("/verify-otp");

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      
      {/* Logo on top */}
      <div className="mb-6">
        <img src="/devsta-logo.png" alt="DevSta Logo" className="w-20 h-20 mx-auto" />
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-sm text-center">
          Enter your registered email to receive an OTP for password reset.
        </p>

        <form onSubmit={handleRequestOTP} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={otpGenerated}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {msg && <p className="text-green-600">{msg}</p>}
          {error && <p className="text-red-500">{error}</p>}

          {otpGenerated && otp && (
            <div className="relative flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg text-gray-700">
              <span className="font-bold tracking-widest">{otp}</span>
              <button
                type="button"
                onClick={handleCopyOtp}
                className="text-gray-600 hover:text-primary flex items-center gap-1"
              >
                <Copy size={16} />
              </button>
              {copied && (
                <div className="absolute -top-6 right-3 bg-primary text-white text-xs px-2 py-1 rounded">
                  Copied
                </div>
              )}
            </div>
          )}

          {!otpGenerated ? (
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Get OTP
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Next →
            </button>
          )}
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
  );
}
