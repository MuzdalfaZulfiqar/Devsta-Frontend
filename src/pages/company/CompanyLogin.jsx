// // src/pages/company/CompanyLogin.jsx
// import { useState } from "react";
// import { Mail, Lock } from "lucide-react";
// import { loginCompany } from "../../api/company/auth";
// import SuccessModal from "../../components/SuccessModal";
// import ErrorModal from "../../components/ErrorModal";
// import { useCompanyAuth } from "../../context/CompanyAuthContext";
// import { useNavigate } from "react-router-dom";

// export default function CompanyLogin() {
//   const { login } = useCompanyAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [errorOpen, setErrorOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrorOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = await loginCompany(form);

//       // Store token & company info + redirect
//       login(data.token, data.company);

//       setModalMessage("Login successful. Redirecting...");
//       setSuccessOpen(true);
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message ||
//         err.message ||
//         "Invalid email or password";
//       setModalMessage(errorMsg);
//       setErrorOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center px-5 sm:px-6 lg:px-8 py-12">
//       {/* Background decoration – same style as register */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white/80 to-cyan-50/40" />
//         <div className="absolute -left-32 top-20 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
//         <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 w-full max-w-md space-y-10">
//         {/* Header */}
//         <div className="text-center">
//           <div className="mx-auto h-14 w-14 rounded-xl bg-[#086972] flex items-center justify-center text-white shadow-md">
//             <Lock size={28} />
//           </div>
//           <h2 className="mt-6 text-3xl font-bold text-gray-900">
//             Recruiter Login
//           </h2>
//           <p className="mt-2 text-gray-600">
//             Access your dashboard and job postings
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-white px-8 py-10 shadow-xl border border-gray-200/70 rounded-2xl">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Business email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                 <input
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={form.email}
//                   onChange={handleChange}
//                   className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition placeholder-gray-500"
//                   placeholder="name@company.com"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                 <input
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={form.password}
//                   onChange={handleChange}
//                   className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition placeholder-gray-500"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

          

//             <button
//               type="submit"
//               disabled={loading}
//               className={`
//                 w-full py-3 px-4 
//                 bg-[#086972] hover:bg-[#086972]/95 
//                 text-white font-medium rounded-lg 
//                 transition shadow-sm hover:shadow
//                 disabled:opacity-60 disabled:cursor-not-allowed
//                 flex items-center justify-center gap-2
//               `}
//             >
//               {loading ? (
//                 <>
//                   <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 "Sign in"
//               )}
//             </button>
//           </form>

//           <div className="mt-8 text-center text-sm text-gray-600">
//             Don't have a company account yet?{" "}
//             <button
//               onClick={() => navigate("/company/register")}
//               className="text-[#086972] hover:underline font-medium"
//             >
//               Create account
//             </button>
//           </div>
//         </div>

//         <p className="text-center text-xs text-gray-500">
//           By signing in, you agree to our{" "}
//           <a href="#" className="text-gray-700 hover:underline">Terms</a> and{" "}
//           <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
//         </p>
//       </div>

//       <SuccessModal
//         open={successOpen}
//         message={modalMessage}
//         onClose={() => setSuccessOpen(false)}
//       />

//       <ErrorModal
//         open={errorOpen}
//         message={modalMessage}
//         onClose={() => setErrorOpen(false)}
//       />
//     </div>
//   );
// }
// 


// working one with new UI

// // src/pages/company/CompanyLogin.jsx
// import { useState } from "react";
// import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
// import { loginCompany } from "../../api/company/auth";
// import SuccessModal from "../../components/SuccessModal";
// import ErrorModal from "../../components/ErrorModal";
// import { useCompanyAuth } from "../../context/CompanyAuthContext";
// import { useNavigate } from "react-router-dom";

// export default function CompanyLogin() {
//   const { login } = useCompanyAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [errorOpen, setErrorOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrorOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const data = await loginCompany(form);
//       login(data.token, data.company);
//       setModalMessage("Login successful. Redirecting...");
//       setSuccessOpen(true);
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || err.message || "Invalid email or password";
//       setModalMessage(errorMsg);
//       setErrorOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputCls =
//     "w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-300 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white";

//   return (
//     <div className="min-h-screen flex font-fragment">
//       {/* ── LEFT ── */}
//       <div className="hidden lg:flex w-[48%] min-h-screen bg-primary flex-col justify-between px-16 py-14 relative overflow-hidden">
//         {/* grid texture */}
//         <div
//           className="absolute inset-0 pointer-events-none opacity-[0.05]"
//           style={{
//             backgroundImage:
//               "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
//             backgroundSize: "44px 44px",
//           }}
//         />
//         {/* orbs */}
//         <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
//         <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-black/10 pointer-events-none" />

//         {/* Logo */}
//         <div className="relative z-10 flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-base">
//             D
//           </div>
//           <div>
//             <p className="text-white font-black text-base leading-none tracking-wide">Devsta</p>
//             <p className="text-white/45 text-[9.5px] font-bold tracking-widest uppercase mt-0.5">Recruiter Portal</p>
//           </div>
//         </div>

//         {/* Headline */}
//         <div className="relative z-10">
//           <p className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase mb-4">Welcome back</p>
//           <h1 className="text-white font-black text-5xl leading-[1.1] mb-6">
//             Your next<br />great hire<br />
//             <span className="text-white/25">starts here.</span>
//           </h1>
//           <p className="text-white/48 text-[15px] leading-relaxed max-w-xs">
//             Access your recruiter dashboard and connect with the engineers who build things that matter.
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="relative z-10">
//           <p className="text-white/30 text-xs tracking-wide">Devsta · Smart Recruitment Platform</p>
//         </div>
//       </div>

//       {/* ── RIGHT ── */}
//       <div className="flex-1 min-h-screen bg-white flex items-center justify-center px-10 lg:px-20">
//         <div className="w-full max-w-sm">
//           {/* Mobile logo */}
//           <div className="flex lg:hidden items-center gap-2 mb-10">
//             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">D</div>
//             <span className="text-primary font-black text-base">Devsta</span>
//           </div>

//           <p className="text-primary text-[10.5px] font-bold tracking-[0.18em] uppercase mb-2.5">Recruiter access</p>
//           <h2 className="text-gray-900 font-black text-[26px] leading-tight mb-2">Sign in to your account</h2>
//           <p className="text-gray-400 text-sm leading-relaxed mb-8">
//             Enter your credentials to access the recruiter dashboard.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
//                 Business Email
//               </label>
//               <div className="relative">
//                 <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
//                 <input
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="name@company.com"
//                   className={`${inputCls} pl-10`}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
//                 <input
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className={`${inputCls} pl-10`}
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 active:scale-[0.99] text-white text-sm font-black rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm tracking-wide"
//             >
//               {loading ? (
//                 <><Loader2 size={15} className="animate-spin" /> Signing in...</>
//               ) : (
//                 <>Sign In <ArrowRight size={14} /></>
//               )}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-400 mt-7">
//             Don't have an account?{" "}
//             <button
//               onClick={() => navigate("/company/register")}
//               className="text-primary font-bold hover:underline"
//             >
//               Create one
//             </button>
//           </p>
//           <p className="text-center text-[11px] text-gray-300 mt-3 leading-relaxed">
//             By signing in you agree to our{" "}
//             <a href="#" className="underline text-gray-400 hover:text-gray-600">Terms</a> and{" "}
//             <a href="#" className="underline text-gray-400 hover:text-gray-600">Privacy Policy</a>
//           </p>
//         </div>
//       </div>

//       <SuccessModal open={successOpen} message={modalMessage} onClose={() => setSuccessOpen(false)} />
//       <ErrorModal open={errorOpen} message={modalMessage} onClose={() => setErrorOpen(false)} />
//     </div>
//   );
// }


// src/pages/company/CompanyLogin.jsx
// ── CHANGE from original: added "Forgot password?" link below the submit button
import { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { loginCompany } from "../../api/company/auth";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import { useCompanyAuth } from "../../context/CompanyAuthContext";
import { useNavigate } from "react-router-dom";

export default function CompanyLogin() {
  const { login } = useCompanyAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
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
      login(data.token, data.company);
      setModalMessage("Login successful. Redirecting...");
      setSuccessOpen(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Invalid email or password";
      setModalMessage(errorMsg);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-300 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white";

  return (
    <div className="min-h-screen flex font-fragment">
      {/* ── LEFT ── */}
      <div className="hidden lg:flex w-[48%] min-h-screen bg-primary flex-col justify-between px-16 py-14 relative overflow-hidden">
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

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-base">
            D
          </div>
          <div>
            <p className="text-white font-black text-base leading-none tracking-wide">Devsta</p>
            <p className="text-white/45 text-[9.5px] font-bold tracking-widest uppercase mt-0.5">Recruiter Portal</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase mb-4">Welcome back</p>
          <h1 className="text-white font-black text-5xl leading-[1.1] mb-6">
            Your next<br />great hire<br />
            <span className="text-white/25">starts here.</span>
          </h1>
          <p className="text-white/48 text-[15px] leading-relaxed max-w-xs">
            Access your recruiter dashboard and connect with the engineers who build things that matter.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-xs tracking-wide">Devsta · Smart Recruitment Platform</p>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center px-10 lg:px-20">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="text-primary font-black text-base">Devsta</span>
          </div>

          <p className="text-primary text-[10.5px] font-bold tracking-[0.18em] uppercase mb-2.5">Recruiter access</p>
          <h2 className="text-gray-900 font-black text-[26px] leading-tight mb-2">Sign in to your account</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Enter your credentials to access the recruiter dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                Business Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <div>
              {/* Label row with inline "Forgot?" link */}
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em]">
                  Password
                </label>
                {/* ── NEW: Forgot password link ── */}
                <button
                  type="button"
                  onClick={() => navigate("/company/forgot-password")}
                  className="text-[10.5px] font-bold text-primary hover:underline uppercase tracking-[0.13em]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 active:scale-[0.99] text-white text-sm font-black rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm tracking-wide"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-7">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/company/register")}
              className="text-primary font-bold hover:underline"
            >
              Create one
            </button>
          </p>
          <p className="text-center text-[11px] text-gray-300 mt-3 leading-relaxed">
            By signing in you agree to our{" "}
            <a href="#" className="underline text-gray-400 hover:text-gray-600">Terms</a> and{" "}
            <a href="#" className="underline text-gray-400 hover:text-gray-600">Privacy Policy</a>
          </p>
        </div>
      </div>

      <SuccessModal open={successOpen} message={modalMessage} onClose={() => setSuccessOpen(false)} />
      <ErrorModal open={errorOpen} message={modalMessage} onClose={() => setErrorOpen(false)} />
    </div>
  );
}
