// // src/pages/company/CompanyRegister.jsx
// import { useState } from "react";
// import { Building2, Mail, Lock, Globe, BriefcaseBusiness } from "lucide-react";
// import { registerCompany } from "../../api/company/auth";
// import SuccessModal from "../../components/SuccessModal";
// import ErrorModal from "../../components/ErrorModal";
// import { useNavigate } from "react-router-dom";

// export default function CompanyRegister() {
//   const [form, setForm] = useState({
//     companyName: "",
//     email: "",
//     password: "",
//     industry: "",
//     website: "",
//     companySize: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [errorOpen, setErrorOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrorOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await registerCompany(form);
//       setModalMessage("Company account created. You can now log in.");
//       setSuccessOpen(true);
//       setForm({ companyName: "", email: "", password: "", industry: "", website: "", companySize: "" });
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || err.message || "Registration failed.";
//       setModalMessage(errorMsg);
//       setErrorOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center px-5 sm:px-6 lg:px-8 py-12">
//       {/* Background layers */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white/80 to-cyan-50/40" />
//         <div className="absolute -left-32 top-20 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
//         <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 w-full max-w-md space-y-10">
//         {/* Header */}
//         <div className="text-center">
//           <div className="mx-auto h-14 w-14 rounded-xl bg-[#086972] flex items-center justify-center text-white shadow-md">
//             <Building2 size={28} />
//           </div>
//           <h2 className="mt-6 text-3xl font-bold text-gray-900">
//             Create Recruiter Account
//           </h2>
//           <p className="mt-2 text-gray-600">
//             Post jobs and hire great developers
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-white px-8 py-10 shadow-xl border border-gray-200/70 rounded-2xl">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Company name *
//               </label>
//               <div className="relative">
//                 <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   name="companyName"
//                   type="text"
//                   required
//                   value={form.companyName}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
//                   placeholder="Your company name"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Business email *
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   name="email"
//                   type="email"
//                   required
//                   value={form.email}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
//                   placeholder="name@company.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   name="password"
//                   type="password"
//                   required
//                   value={form.password}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             {/* Optional fields in grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Industry / focus
//                 </label>
//                 <div className="relative">
//                   <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     name="industry"
//                     type="text"
//                     value={form.industry}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
//                     placeholder="e.g. Software, AI..."
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Company size
//                 </label>
//                 <select
//                   name="companySize"
//                   value={form.companySize}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition bg-white"
//                 >
//                   <option value="">Select size</option>
//                   <option value="1-10">1–10</option>
//                   <option value="11-50">11–50</option>
//                   <option value="51-200">51–200</option>
//                   <option value="201-500">201–500</option>
//                   <option value="501-1000">501–1,000</option>
//                   <option value="1001+">1,000+</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Website
//               </label>
//               <div className="relative">
//                 <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   name="website"
//                   type="url"
//                   value={form.website}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none transition"
//                   placeholder="https://yourcompany.com"
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
//                 disabled:opacity-60
//                 flex items-center justify-center gap-2
//               `}
//             >
//               {loading ? (
//                 <>
//                   <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Company Account"
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{" "}
//             <button
//               onClick={() => navigate("/company/login")}
//               className="text-[#086972] hover:underline font-medium"
//             >
//               Sign in
//             </button>
//           </div>
//         </div>

//         <p className="text-center text-xs text-gray-500">
//           By creating an account you agree to our{" "}
//           <a href="#" className="text-gray-700 hover:underline">Terms</a> and{" "}
//           <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
//         </p>
//       </div>

//       <SuccessModal open={successOpen} message={modalMessage} onClose={() => navigate("/company/login")} />
//       <ErrorModal open={errorOpen} message={modalMessage} onClose={() => setErrorOpen(false)} />
//     </div>
//   );
// }

// src/pages/company/CompanyRegister.jsx
import { useState } from "react";
import { Building2, Mail, Lock, Globe, BriefcaseBusiness, ArrowRight, Loader2 } from "lucide-react";
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

  const inputCls =
    "w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-300 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white";

  return (
    <div className="min-h-screen flex font-fragment">
      {/* ── LEFT ── */}
      <div className="hidden lg:flex w-[42%] min-h-screen bg-primary flex-col justify-between px-16 py-14 relative overflow-hidden">
        {/* grid texture */}
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

        {/* Headline */}
        <div className="relative z-10">
          <p className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase mb-4">Get started free</p>
          <h1 className="text-white font-black text-5xl leading-[1.1] mb-6">
            Hire engineers<br />who actually<br />
            <span className="text-white/25">ship.</span>
          </h1>
          <p className="text-white/48 text-[15px] leading-relaxed max-w-xs">
            Post your first role in minutes and let our AI surface the right candidates automatically.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs tracking-wide">Devsta · Smart Recruitment Platform</p>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center px-10 lg:px-16 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="text-primary font-black text-base">Devsta</span>
          </div>

          <p className="text-primary text-[10.5px] font-bold tracking-[0.18em] uppercase mb-2.5">Create recruiter account</p>
          <h2 className="text-gray-900 font-black text-[26px] leading-tight mb-2">Start hiring top talent</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-7">
            Set up your company profile and post your first role today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company name */}
            <div>
              <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  name="companyName"
                  type="text"
                  required
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                Business Email *
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            {/* Industry + Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                  Industry
                </label>
                <div className="relative">
                  <BriefcaseBusiness size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  <input
                    name="industry"
                    type="text"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="e.g. Software"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                  Company Size
                </label>
                <select
                  name="companySize"
                  value={form.companySize}
                  onChange={handleChange}
                  className={`${inputCls} px-4 cursor-pointer`}
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

            {/* Website */}
            <div>
              <label className="block text-[10.5px] font-bold text-gray-500 uppercase tracking-[0.13em] mb-2">
                Website
              </label>
              <div className="relative">
                <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 active:scale-[0.99] text-white text-sm font-black rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm tracking-wide mt-1"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Creating account...</>
              ) : (
                <>Create Company Account <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/company/login")}
              className="text-primary font-bold hover:underline"
            >
              Sign in
            </button>
          </p>
          <p className="text-center text-[11px] text-gray-300 mt-3 leading-relaxed">
            By creating an account you agree to our{" "}
            <a href="#" className="underline text-gray-400 hover:text-gray-600">Terms</a> and{" "}
            <a href="#" className="underline text-gray-400 hover:text-gray-600">Privacy Policy</a>
          </p>
        </div>
      </div>

      <SuccessModal open={successOpen} message={modalMessage} onClose={() => navigate("/company/login")} />
      <ErrorModal open={errorOpen} message={modalMessage} onClose={() => setErrorOpen(false)} />
    </div>
  );
}
