
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config";
import { Shield, CheckCircle, ChevronLeft } from "lucide-react";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  const email = sessionStorage.getItem("resetEmail") || "";

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;
    
    setError(""); 
    setMsg(""); 
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      
      sessionStorage.setItem("resetToken", data.resetToken);
      navigate("/reset-password");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMsg("");
    setResendLoading(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.msg);
      
      setMsg("New OTP sent successfully! Check your email.");
      setOtp(new Array(6).fill("")); // Clear OTP fields
      inputRefs.current[0]?.focus(); // Focus first input
      
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-fragment p-4">
      <div className="w-full max-w-[440px]">
        <div className="mb-10 text-center">
          <div className="inline-block p-3 rounded-xl border-2 border-primary/10 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">Verify Identity</h1>
          <p className="text-gray-500 mt-2">Enter the code sent to <span className="text-primary font-semibold">{email}</span></p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 bg-white border-gray-200 rounded-xl focus:border-primary focus:ring-0 transition-all outline-none bg-gray-50 text-primary"
                />
              ))}
            </div>

            {msg && (
              <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm font-medium border border-green-200 flex items-center gap-2">
                <CheckCircle size={16}/>
                {msg}
              </div>
            )}
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              Didn't receive code?{" "}
              <button 
                onClick={handleResendOtp} 
                disabled={resendLoading}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend"}
              </button>
            </p>
            <button 
              onClick={() => navigate("/forgot-password")}
              className="flex items-center justify-center gap-2 text-gray-400 hover:text-black text-xs mx-auto transition-colors"
            >
              <ChevronLeft size={14} /> Use different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}