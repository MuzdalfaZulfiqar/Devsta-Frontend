// src/pages/company/CompanyLogin.jsx
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { loginCompany } from "../../api/company/auth";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import { useCompanyAuth } from "../../context/CompanyAuthContext";
import { useNavigate } from "react-router-dom";

export default function CompanyLogin() {
  const { login } = useCompanyAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginCompany(form);

      // Store token & company info + redirect
      login(data.token, data.company);

      setModalMessage("Login successful. Redirecting...");
      setSuccessOpen(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password";
      setModalMessage(errorMsg);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center px-5 sm:px-6 lg:px-8 py-12">
      {/* Background decoration – same style as register */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white/80 to-cyan-50/40" />
        <div className="absolute -left-32 top-20 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-[#086972] flex items-center justify-center text-white shadow-md">
            <Lock size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Recruiter Login
          </h2>
          <p className="mt-2 text-gray-600">
            Access your dashboard and job postings
          </p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-10 shadow-xl border border-gray-200/70 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition placeholder-gray-500"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

          

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-4 
                bg-[#086972] hover:bg-[#086972]/95 
                text-white font-medium rounded-lg 
                transition shadow-sm hover:shadow
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have a company account yet?{" "}
            <button
              onClick={() => navigate("/company/register")}
              className="text-[#086972] hover:underline font-medium"
            >
              Create account
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-gray-700 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
        </p>
      </div>

      <SuccessModal
        open={successOpen}
        message={modalMessage}
        onClose={() => setSuccessOpen(false)}
      />

      <ErrorModal
        open={errorOpen}
        message={modalMessage}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}