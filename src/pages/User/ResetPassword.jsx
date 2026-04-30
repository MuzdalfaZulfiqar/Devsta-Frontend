import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [resetToken, setResetToken] = useState("");
  const [email, setEmail] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);

  // Load data from sessionStorage on component mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("resetToken");
    const storedEmail = sessionStorage.getItem("resetEmail");
    
    if (!storedToken || !storedEmail) {
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
    } else {
      setResetToken(storedToken);
      setEmail(storedEmail);
      setChecking(false);
    }
  }, [navigate]);

  // Password strength validation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!resetToken) {
      setError("Session expired. Please request a new OTP.");
      setTimeout(() => navigate("/forgot-password"), 2000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.msg);

      setMsg(data.msg);
      setPasswordReset(true);
      
      // Clear session storage AFTER showing success message
      setTimeout(() => {
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");
        navigate("/login");
      }, 3000); // Increased to 3 seconds so user can read success message
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking for session
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-fragment p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking session...</p>
        </div>
      </div>
    );
  }

  // Only show session expired message if not already reset
  if ((!resetToken || !email) && !passwordReset && !msg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-fragment p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">Session expired. Please request a new OTP.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-primary text-white px-6 py-2 rounded"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  // If password reset is successful, show only success message
  if (passwordReset && msg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-fragment p-4">
        <div className="w-full max-w-[440px] text-center">
          <div className="bg-white border border-green-200 rounded-2xl p-8 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 mx-auto">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">{msg}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div className="bg-primary h-1 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-fragment p-4">
      <div className="w-full max-w-[440px]">
        <div className="mb-10 text-center">
          <div className="inline-block p-3 rounded-xl border-2 border-primary/10 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">New Password</h1>
          <p className="text-gray-500 mt-2">Secure your account with a strong password.</p>
          <p className="text-gray-400 text-xs mt-1 break-all">{email}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordReset}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all outline-none disabled:bg-gray-50"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-3.5 text-gray-400"
                  disabled={passwordReset}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Strength Bar */}
              {newPassword && !passwordReset && (
                <div className="flex gap-1.5 h-1 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-colors ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-100"
                      }`} 
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordReset}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all outline-none disabled:bg-gray-50"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-3 top-3.5 text-gray-400"
                  disabled={passwordReset}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && !passwordReset && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Display error message */}
            {error && !passwordReset && (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !newPassword || newPassword !== confirmPassword || passwordReset}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}