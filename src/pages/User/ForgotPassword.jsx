import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config";
import { Mail, ArrowRight, ChevronLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError(""); 
    setMsg(""); 
    setLoading(true);
    setIsRegistered(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 404) {
          setIsRegistered(false);
          setMsg(data.msg);
          return;
        }
        throw new Error(data.msg);
      }
      
      setMsg(data.msg);
      setIsRegistered(true);
      
      if (data.isRegistered) {
        sessionStorage.setItem("resetEmail", email);
        setTimeout(() => navigate("/verify-otp"), 1500);
      }
      
    } catch (err) {
      setError(err.message);
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-fragment p-4">
      <div className="w-full max-w-[440px]">
        <div className="mb-10 text-center">
          <div className="inline-block p-3 rounded-xl border-2 border-primary/10 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">Reset Password</h1>
          <p className="text-gray-500 mt-2">Enter your email to receive a secure OTP code.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-black uppercase tracking-wider">Work Email</label>
              <input
                type="email"
                placeholder="dev@platform.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all outline-none text-black"
              />
            </div>

            {msg && (
              <div className={`p-3 rounded-lg text-sm font-medium border ${
                isRegistered 
                  ? "text-primary bg-primary/5 border-primary/20" 
                  : "text-amber-600 bg-amber-50 border-amber-200"
              }`}>
                {msg}
              </div>
            )}
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Always show the button - don't hide it */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-primary text-white py-4 rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Code"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Show signup link if user is not registered */}
          {!isRegistered && msg && (
            <div className="mt-4 text-center pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-primary font-bold hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          )}

          <button 
            onClick={() => navigate("/login")}
            className="w-full mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-black font-semibold text-sm transition-colors"
          >
            <ChevronLeft size={16} />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}