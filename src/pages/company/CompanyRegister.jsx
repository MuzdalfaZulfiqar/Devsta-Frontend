import { useState } from "react";
import { Building2, Mail, Lock, Globe, BriefcaseBusiness } from "lucide-react";
import { registerCompany } from "../../api/company/auth";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import { useNavigate } from "react-router-dom";

export default function CompanyRegister() {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    industry: "",
    website: "",
    companySize: "",
  });

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerCompany(form);
      setModalMessage("Company account created. You can now log in.");
      setSuccessOpen(true);
      setForm({ companyName: "", email: "", password: "", industry: "", website: "", companySize: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Registration failed.";
      setModalMessage(errorMsg);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center px-5 sm:px-6 lg:px-8 py-12">
      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white/80 to-cyan-50/40" />
        <div className="absolute -left-32 top-20 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-[#086972] flex items-center justify-center text-white shadow-md">
            <Building2 size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Recruiter Account
          </h2>
          <p className="mt-2 text-gray-600">
            Post jobs and hire great developers
          </p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-10 shadow-xl border border-gray-200/70 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Company name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="companyName"
                  type="text"
                  required
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Optional fields in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Industry / focus
                </label>
                <div className="relative">
                  <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="industry"
                    type="text"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
                    placeholder="e.g. Software, AI..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company size
                </label>
                <select
                  name="companySize"
                  value={form.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition bg-white"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1–10</option>
                  <option value="11-50">11–50</option>
                  <option value="51-200">51–200</option>
                  <option value="201-500">201–500</option>
                  <option value="501-1000">501–1,000</option>
                  <option value="1001+">1,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Website (optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
                  placeholder="https://yourcompany.com"
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
                disabled:opacity-60
                flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Company Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/company/login")}
              className="text-[#086972] hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          By creating an account you agree to our{" "}
          <a href="#" className="text-gray-700 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
        </p>
      </div>

      <SuccessModal open={successOpen} message={modalMessage} onClose={() => navigate("/company/login")} />
      <ErrorModal open={errorOpen} message={modalMessage} onClose={() => setErrorOpen(false)} />
    </div>
  );
}