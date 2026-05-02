// src/pages/company/CompanyForgotPassword.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, RefreshCw, Eye, EyeOff } from "lucide-react";
import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetCompanyPassword,
} from "../../api/company/passwordReset";

// ── Steps: "email" → "otp" → "reset" → "done" ────────────────────────────
const STEPS = ["email", "otp", "reset", "done"];

export default function CompanyForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Please enter your email address.");
    setLoading(true);
    try {
      await requestPasswordResetOtp(email.trim());
      setStep("otp");
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input helpers ────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1); // max 1 digit per box
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) return setError("Please enter the full 6-digit code.");
    setLoading(true);
    try {
      await verifyPasswordResetOtp(email.trim(), code);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await requestPasswordResetOtp(email.trim());
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ───────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await resetCompanyPassword(email.trim(), otp.join(""), newPassword);
      setStep("done");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared input class ───────────────────────────────────────────────────
  const inputCls =
    "w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-300 outline-none transition focus:border-[#086972] focus:ring-2 focus:ring-[#086972]/10 focus:bg-white";

  // ── Progress bar ─────────────────────────────────────────────────────────
  const stepIndex = STEPS.indexOf(step);
  const progressPct = Math.round((stepIndex / 3) * 100);

  return (
    <div className="min-h-screen flex font-fragment">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[42%] min-h-screen bg-[#086972] flex-col justify-between px-16 py-14 relative overflow-hidden">
        {/* grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-black/10 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-base">
            D
          </div>
          <div>
            <p className="text-white font-black text-base leading-none tracking-wide">Devsta</p>
            <p className="text-white/45 text-[9.5px] font-bold tracking-widest uppercase mt-0.5">Recruiter Portal</p>
          </div>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <p className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase mb-4">Account recovery</p>
          <h1 className="text-white font-black text-5xl leading-[1.1] mb-6">
            Locked<br />out?<br />
            <span className="text-white/25">We've got you.</span>
          </h1>
          <p className="text-white/48 text-[15px] leading-relaxed max-w-xs">
            Enter your email, verify with a one-time code, and set a new password in under a minute.
          </p>

          {/* Steps indicator */}
          <div className="mt-10 space-y-4">
            {[
              { n: 1, label: "Enter your email" },
              { n: 2, label: "Verify OTP code" },
              { n: 3, label: "Set new password" },
            ].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all
                    ${stepIndex >= n
                      ? "bg-white text-[#086972] border-white"
                      : "bg-white/10 text-white/40 border-white/20"
                    }`}
                >
                  {stepIndex > n ? "✓" : n}
                </div>
                <span
                  className={`text-sm font-semibold transition-all ${
                    stepIndex >= n ? "text-white" : "text-white/35"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-xs tracking-wide">Devsta · Smart Recruitment Platform</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center px-10 lg:px-20">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#086972] flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="text-[#086972] font-black text-base">Devsta</span>
          </div>

          {/* Progress bar */}
          {step !== "done" && (
            <div className="mb-8">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <span>Progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#086972] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* ── STEP: EMAIL ── */}
          {step === "email" && (
            <>
              <p className="text-[#086972] text-[10.5px] font-bold tracking-[0.18em] uppercase mb-2.5">Step 1 of 3</p>
              <h2 className="text-gray-900 font-black text-[26px] leading-tight mb-2">Forgot your password?</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Enter the email linked to your recruiter account and we'll send you a 6-digit code.
              </p>

              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="name@company.com"
                      className={`${inputCls} pl-10`}
                      autoFocus
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#086972] hover:bg-[#086972]/90 active:scale-[0.99] text-white text-sm font-black rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm tracking-wide"
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <>Send Code <ArrowRight size={14} /></>}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-7">
                Remembered it?{" "}
                <button onClick={() => navigate("/company/login")} className="text-[#086972] font-bold hover:underline">
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* ── STEP: OTP ── */}
          {step === "otp" && (
            <>
              <p className="text-[#086972] text-[10.5px] font-bold tracking-[0.18em] uppercase mb-2.5">Step 2 of 3</p>
              <h2 className="text-gray-900 font-black text-[26px] leading-tight mb-2">Check your inbox</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-1">
                We sent a 6-digit code to
              </p>
              <p className="text-gray-700 font-semibold text-sm mb-8 truncate">{email}</p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP digit boxes */}
                <div>
                  <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-3">
                    Verification Code
                  </label>
                  <div className="flex gap-2.5 justify-between" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-black border-2 rounded-xl bg-gray-50 text-gray-900 outline-none transition
                          focus:border-[#086972] focus:ring-2 focus:ring-[#086972]/15 focus:bg-white
                          border-gray-200"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Code expires in 10 minutes.</p>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#086972] hover:bg-[#086972]/90 active:scale-[0.99] text-white text-sm font-black rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm tracking-wide"
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Verifying...</> : <>Verify Code <ArrowRight size={14} /></>}
                </button>
              </form>

              {/* Resend */}
              <div className="mt-5 text-center">
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="flex items-center gap-1.5 mx-auto text-sm font-semibold text-gray-500 hover:text-[#086972] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw size={13} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-4">
                Wrong email?{" "}
                <button onClick={() => { setStep("email"); setError(""); setOtp(["","","","","",""]); }}
                  className="text-[#086972] font-bold hover:underline">
                  Go back
                </button>
              </p>
            </>
          )}

          {/* ── STEP: RESET ── */}
          {step === "reset" && (
            <>
              <p className="text-[#086972] text-[10.5px] font-bold tracking-[0.18em] uppercase mb-2.5">Step 3 of 3</p>
              <h2 className="text-gray-900 font-black text-[26px] leading-tight mb-2">Set new password</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Choose a strong password you haven't used before.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                      placeholder="Min. 8 characters"
                      className={`${inputCls} pl-10 pr-10`}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {/* Strength hint */}
                  {newPassword.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength =
                          newPassword.length >= 12 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)
                            ? 4
                            : newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
                            ? 3
                            : newPassword.length >= 8
                            ? 2
                            : 1;
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              level <= strength
                                ? strength === 1
                                  ? "bg-red-400"
                                  : strength === 2
                                  ? "bg-yellow-400"
                                  : strength === 3
                                  ? "bg-blue-400"
                                  : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      placeholder="Repeat your password"
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-[11px] mt-1 font-medium">Passwords don't match yet.</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-green-500 text-[11px] mt-1 font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} /> Passwords match
                    </p>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#086972] hover:bg-[#086972]/90 active:scale-[0.99] text-white text-sm font-black rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm tracking-wide"
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Resetting...</> : <>Reset Password <ArrowRight size={14} /></>}
                </button>
              </form>
            </>
          )}

          {/* ── STEP: DONE ── */}
          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-gray-900 font-black text-[26px] leading-tight mb-3">Password reset!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                Your password has been updated. You can now sign in with your new credentials.
              </p>
              <button
                onClick={() => navigate("/company/login")}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#086972] hover:bg-[#086972]/90 active:scale-[0.99] text-white text-sm font-black rounded-xl transition-all shadow-sm tracking-wide"
              >
                Back to Sign In <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
