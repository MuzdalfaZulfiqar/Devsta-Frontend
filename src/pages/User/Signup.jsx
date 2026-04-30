// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { signupUser } from "../../api/auth";
// import { BACKEND_URL } from "../../../config";
// import { useNavigate } from "react-router-dom";
// import { Zap, BadgeCheck, Eye, EyeOff } from "lucide-react";

// export default function Signup() {
//   const { loginUser } = useAuth();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // "success" | "error"
//   const [showPassword, setShowPassword] = useState(false);

//   const [validationErrors, setValidationErrors] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const navigate = useNavigate();

//   const validateInput = () => {
//     let errors = { name: "", email: "", password: "" };
//     let valid = true;

//     if (!form.name.trim()) {
//       errors.name = "Name is required.";
//       valid = false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(form.email)) {
//       errors.email = "Invalid email format.";
//       valid = false;
//     }

//     if (form.password.length < 8) {
//       errors.password = "Password must be at least 8 characters.";
//       valid = false;
//     }

//     setValidationErrors(errors);
//     return valid;
//   };


//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateInput()) return; // stop submission if invalid

//     try {
//       const data = await signupUser(form);
//       await loginUser(data.token);
//       setModalType("success");
//       setSuccessMessage("Account created successfully!");
//       setShowModal(true);
//       setTimeout(() => setShowModal(false), 100);
//     } catch (err) {
//       setError(err.message);
//       setModalType("error");
//       setShowModal(true);
//     }
//   };

//   const handleGoogleSignup = () => {
//     window.location.href = `${BACKEND_URL}/api/users/auth/google`;
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background-dark text-black dark:text-white font-fragment transition-colors duration-300">
//       <div className="container mx-auto px-4 lg:px-12 py-8 lg:py-12 h-screen flex items-center">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center h-full">
//           {/* Left Section */}
//           <div className="text-center lg:text-left px-2 lg:pl-6 xl:pl-10 flex flex-col justify-center h-full">
//             <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-snug lg:leading-tight xl:leading-[1.15]">
//               Build Your Verified Developer Identity with{" "}
//               <span className="text-primary">AI</span>
//             </h1>

//             <p className="mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base lg:text-base xl:text-lg text-gray-700 dark:text-gray-300 max-w-md lg:max-w-sm xl:max-w-md mx-auto lg:mx-0 leading-relaxed">
//               DevSta helps you create an AI-verified portfolio that showcases your skills and contributions — setting you apart in the tech industry.
//             </p>

//             {/* Stats Section */}
//             <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 xl:space-x-10">
//               <div className="flex items-center space-x-2 sm:space-x-3">
//                 <Zap className="text-primary w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6" />
//                 <div>
//                   <p className="font-bold text-base sm:text-lg lg:text-lg xl:text-xl text-primary">95%</p>
//                   <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-gray-600 dark:text-gray-300">Faster Verification</p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-2 sm:space-x-3">
//                 <BadgeCheck className="text-primary w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6" />
//                 <div>
//                   <p className="font-bold text-base sm:text-lg lg:text-lg xl:text-xl text-primary">100k+</p>
//                   <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-gray-600 dark:text-gray-300">Verified Profiles</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Signup Card */}
//           <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-7 xl:p-8 w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-md mx-auto border border-gray-200 dark:border-gray-700 flex flex-col justify-center h-full">
//             <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-center">
//               Create Your Account
//             </h2>
//             <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-5 sm:mb-6 lg:mb-5 xl:mb-6 text-sm sm:text-base lg:text-base xl:text-lg">
//               Join the future of developer recognition.
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-4 overflow-auto max-h-[70vh] p-[3px]">

//               {["name", "email"].map((field, index) => (
//                 <div key={index} className="flex flex-col">
//                   <input
//                     type="text"
//                     name={field}
//                     value={form[field]}
//                     onChange={handleChange}
//                     placeholder={
//                       field === "name"
//                         ? "Full Name"
//                         : "Email Address"
//                     }
//                     className="w-full px-3 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
//                     required
//                   />
//                   {validationErrors[field] && (
//                     <span className="text-red-500 text-xs sm:text-sm mt-1">
//                       {validationErrors[field]}
//                     </span>
//                   )}
//                 </div>
//               ))}

//               {/* Password field with eye button */}
//               <div className="flex flex-col">
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     placeholder="Password"
//                     className="w-full px-3 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
//                     title={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//                 {validationErrors.password && (
//                   <span className="text-red-500 text-xs sm:text-sm mt-1">
//                     {validationErrors.password}
//                   </span>
//                 )}
//               </div>


//               <button
//                 type="submit"
//                 className="group relative w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 sm:py-2.5 lg:py-2.5 xl:py-3 px-4 rounded-lg overflow-hidden transition-colors duration-300 ease-in-out text-sm sm:text-base lg:text-base xl:text-lg"
//               >
//                 {/* subtle "water" swipe element */}
//                 <span className="absolute -left-24 -top-8 w-40 h-40 bg-white/10 rounded-full blur-lg transform translate-x-0 transition-transform duration-700 ease-out group-hover:translate-x-64 group-hover:opacity-100 opacity-0 pointer-events-none"></span>

//                 {/* gentle overlay stripe for extra wet effect */}
//                 <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 pointer-events-none"></span>

//                 <span className="relative">Create Account</span>
//               </button>
//               {/* Login Prompt under form */}
//               <p className="text-gray-500 text-xs sm:text-sm lg:text-sm text-center mt-2">
//                 Already a user?{" "}
//                 <a href="/login" className="text-primary font-medium hover:underline">
//                   Login here
//                 </a>
//               </p>

//               <div className="relative flex py-2 sm:py-2.5 lg:py-2.5 xl:py-3 items-center">
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
//                 <span className="flex-shrink mx-2 sm:mx-3 text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-sm xl:text-base">
//                   OR
//                 </span>
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
//               </div>

//               <button
//                 onClick={handleGoogleSignup}
//                 type="button"
//                 className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-primary/10 text-gray-800 dark:text-gray-100 font-bold py-2 sm:py-2.5 lg:py-2.5 xl:py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base lg:text-base xl:text-lg"
//               >
//                 <img
//                   src="https://www.svgrepo.com/show/355037/google.svg"
//                   alt="Google Logo"
//                   className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6"
//                 />
//                 <span>Continue with Google</span>
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
//           <div className="relative bg-white dark:bg-gray-900 p-5 sm:p-6 lg:p-7 xl:p-8 rounded-2xl shadow-2xl w-[90vw] max-w-xs sm:max-w-sm lg:max-w-md text-center border border-primary/50">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-400 hover:text-primary transition text-sm sm:text-base"
//               type="button"
//             >
//               ✕
//             </button>
//             <h3
//               className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 ${modalType === "success" ? "text-primary" : "text-red-500"
//                 }`}
//             >
//               {modalType === "success" ? "Success!" : "Error!"}
//             </h3>
//             <p className="text-gray-800 dark:text-gray-300 mb-5 sm:mb-6 text-xs sm:text-sm lg:text-base">
//               {modalType === "success" ? successMessage : error}
//             </p>
//             <button
//               onClick={() => setShowModal(false)}
//               className="w-full bg-primary hover:bg-primary/90 text-white py-2 lg:py-3 rounded-lg font-medium transition text-sm sm:text-base lg:text-base"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { signupUser } from "../../api/auth";
import { BACKEND_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  BadgeCheck, 
  Eye, 
  EyeOff, 
  UserPlus, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";

export default function Signup() {
  /* --- LOGIC PRESERVED EXACTLY --- */
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const validateInput = () => {
    let errors = { name: "", email: "", password: "" };
    let valid = true;

    if (!form.name.trim()) {
      errors.name = "Name is required.";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.email = "Invalid email format.";
      valid = false;
    }

    if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    setValidationErrors(errors);
    return valid;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInput()) return;

    try {
      const data = await signupUser(form);
      await loginUser(data.token);
      setModalType("success");
      setSuccessMessage("Account created successfully!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      setError(err.message);
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${BACKEND_URL}/api/users/auth/google`;
  };
  /* --- END LOGIC --- */

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-fragment transition-colors duration-300">
      
      {/* Left Section: Branding & Modern Typography */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center px-12 xl:px-20 overflow-hidden">
        {/* Subtle Geometric Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full border-[80px] border-white" />
          <div className="absolute bottom-[20%] right-[-10%] w-48 h-48 bg-white/20 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-white/10">
            <UserPlus className="text-white w-4 h-4" />
            <span className="text-white text-xs font-black tracking-widest uppercase">Developer Enrollment</span>
          </div>

          <h1 className="text-white text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-8">
            JOIN THE <br />
            <span className="text-white/40">ELITE.</span>
          </h1>
          
          <p className="text-white/80 text-xl font-medium max-w-md mb-12 leading-relaxed">
            Create an AI-verified portfolio that sets you apart in the global tech industry.
          </p>

          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-start space-x-5">
              <div className="mt-1 bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/10 w-12 h-12 flex items-center justify-center shadow-inner">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg tracking-tight">95% Efficiency</h4>
                <p className="text-white/50 text-sm">Automated AI verification for instant credibility.</p>
              </div>
            </div>

            <div className="flex items-start space-x-5">
                         <div className="mt-1 bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/10 w-12 h-12 flex items-center justify-center shadow-inner">
                <BadgeCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg tracking-tight">100k+ Profiles</h4>
                <p className="text-white/50 text-sm">Trust by a global network of top-tier developers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-white dark:bg-black">
        <div className="w-full max-w-sm space-y-10">
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-black dark:text-white tracking-tight">Get Started</h2>
            <p className="text-gray-500 font-medium">Join the future of developer recognition.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-primary outline-none transition-all text-black dark:text-white font-medium"
                required
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs flex items-center mt-2 font-bold">
                  <AlertCircle className="w-3 h-3 mr-1" /> {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@email.com"
                className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-primary outline-none transition-all text-black dark:text-white font-medium"
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs flex items-center mt-2 font-bold">
                  <AlertCircle className="w-3 h-3 mr-1" /> {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-primary outline-none transition-all text-black dark:text-white font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs flex items-center mt-2 font-bold">
                  <AlertCircle className="w-3 h-3 mr-1" /> {validationErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-xl transition-all hover:bg-primary hover:text-white active:scale-[0.97] flex items-center justify-center space-x-2"
            >
              <span>CREATE ACCOUNT</span>
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleGoogleSignup}
              type="button"
              className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-primary text-black dark:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="G" className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm font-medium">
            Already have an account?{" "}
            <a href="/login" className="text-black dark:text-white font-black hover:text-primary transition underline decoration-primary underline-offset-4">
              Log In
            </a>
          </p>
        </div>
      </div>

      {/* Modal - Logic Preserved */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xs rounded-[2rem] p-8 shadow-2xl text-center relative overflow-hidden">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 rotate-12 ${
              modalType === "success" ? "bg-primary text-white" : "bg-red-500 text-white"
            }`}>
              {modalType === "success" ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white mb-2 uppercase tracking-tighter">
              {modalType === "success" ? "Welcome" : "Error"}
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-8 font-medium">
              {modalType === "success" ? successMessage : error}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-100 dark:bg-zinc-800 text-black dark:text-white py-4 rounded-xl font-black transition-all hover:bg-primary hover:text-white"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}