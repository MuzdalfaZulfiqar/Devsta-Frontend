// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { loginUser as loginAPI } from "../../api/auth";
// import { BACKEND_URL } from "../../../config";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const { loginUser } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const data = await loginAPI(form);

//       // ✅ Only pass token to loginUser
//       await loginUser(data.token);

//       setModalType("success");
//       setSuccessMessage("Logged in successfully!");
//       setShowModal(true);

//       // Navigate after successful login
//       setTimeout(() => {
//         setShowModal(false);
//         // Navigation will be handled by AuthContext based on onboarding status
//       }, 1000);
//     } catch (err) {
//       setError(err.message);
//       setModalType("error");
//       setShowModal(true);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${BACKEND_URL}/api/users/auth/google`;
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-black font-fragment p-4 md:p-8">
//       {/* ... form UI stays same ... */}
//        {/* Card Container */}
//       <div className="w-full sm:w-[90%] md:w-[70%] max-w-4xl h-auto bg-gradient-to-br from-primary/90 via-black/90 to-teal-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-4 border-[1px] border-primary/50">

//         {/* Logo */}
//         <div className="flex justify-end">
//           <img src="/devsta-logo.png" alt="Devsta Logo" className="h-12 md:h-12 object-contain" />
//         </div>

//         {/* Welcome Message */}
//         <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-1">
//           Welcome Back!
//         </h1>
//         <p className="text-gray-300 text-center text-sm md:text-base mb-4">
//           Please login to continue to Devsta
//         </p>

//         {/* Form + Google Login */}
//         <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full text-sm md:text-base p-2.5 bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full text-sm md:text-base p-2.5 bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition"
//               required
//             />
//             <button
//               type="submit"
//               className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition font-medium text-sm md:text-base"
//             >
//               Login
//             </button>

//             {/* Signup Prompt */}
//             <p className="text-gray-300 text-xs md:text-sm text-center mt-2">
//               Don't have an account?{" "}
//               <a
//                 href="/signup"
//                 className="text-primary font-medium hover:underline"
//               >
//                 Sign Up
//               </a>
//             </p>
//           </form>

//           {/* OR Separator */}
//           <div className="flex flex-col md:flex-row items-center justify-center w-full md:w-auto my-4 md:my-0">
//             {/* Mobile: horizontal */}
//             <div className="flex md:hidden items-center w-full">
//               <div className="flex-grow h-px bg-primary/70"></div>
//               <span className="mx-2 text-gray-300 text-xs font-medium">OR</span>
//               <div className="flex-grow h-px bg-primary/70"></div>
//             </div>
//             {/* Desktop: vertical */}
//             <div className="hidden md:flex flex-col items-center h-full px-4">
//               <div className="flex-grow w-px bg-primary/70"></div>
//               <span className="my-2 text-gray-300 text-xs font-medium">OR</span>
//               <div className="flex-grow w-px bg-primary/70"></div>
//             </div>
//           </div>

//           {/* Social Login Buttons */}
//           <div className="flex-1 flex flex-col justify-center w-full gap-3">
//             {/* GitHub Login */}
//             {/* <button
//               onClick={handleGitHubLogin}
//               className="w-full flex items-center justify-center gap-2 border border-gray-400 bg-black/20 py-2.5 rounded-lg hover:bg-black/40 transition font-medium text-sm md:text-base text-white"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               Continue with GitHub
//             </button> */}
            
//             {/* Google Login */}
//             <button
//               onClick={handleGoogleLogin}
//               className="w-full flex items-center justify-center gap-2 border border-gray-400 bg-black/20 py-2.5 rounded-lg hover:bg-black/40 transition font-medium text-sm md:text-base text-white"
//             >
//               <img
//                 src="https://www.svgrepo.com/show/355037/google.svg"
//                 alt="Google Logo"
//                 className="w-4 h-4"
//               />
//               Continue with Google
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
//           <div className="relative bg-gradient-to-br from-primary/90 via-black/90 to-teal-900/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl w-[90vw] max-w-xs md:max-w-md text-center border border-primary/50">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-gray-400 hover:text-teal-400 transition text-base md:text-lg focus:outline-none p-1 rounded-full bg-black/30"
//               aria-label="Close"
//               type="button"
//             >
//               <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
//                 <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </button>
//             <h3
//               className={`text-xl md:text-2xl font-semibold mb-5 ${modalType === "success" ? "text-teal-400" : "text-red-400"}`}
//             >
//               {modalType === "success" ? "Success!" : "Error!"}
//             </h3>
//             <p className="text-white mb-6 text-sm md:text-base">
//               {modalType === "success" ? successMessage : error}
//             </p>
//             <button
//               onClick={() => setShowModal(false)}
//               className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition text-base"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { loginUser as loginAPI } from "../../api/auth";
// import { BACKEND_URL } from "../../../config";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const { loginUser } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleCheckbox = (e) => setRememberMe(e.target.checked);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const data = await loginAPI(form);

//       // ✅ Only pass token to loginUser
//       await loginUser(data.token, rememberMe); // Optional: use rememberMe flag in context if needed

//       setModalType("success");
//       setSuccessMessage("Logged in successfully!");
//       setShowModal(true);

//       setTimeout(() => setShowModal(false), 1000);
//     } catch (err) {
//       setError(err.message);
//       setModalType("error");
//       setShowModal(true);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${BACKEND_URL}/api/users/auth/google`;
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background-dark text-black dark:text-white font-fragment transition-colors duration-300">
//       <div className="container mx-auto px-4 lg:px-12 py-8 lg:py-12 h-screen flex items-center">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center h-full">
//           {/* Left Section */}
//           <div className="text-center lg:text-left px-2 lg:pl-6 xl:pl-10 flex flex-col justify-center h-full">
//             <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-snug lg:leading-tight xl:leading-[1.15]">
//               Welcome Back to <span className="text-primary">DevSta</span>
//             </h1>
//             <p className="mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base lg:text-base xl:text-lg text-gray-700 dark:text-gray-300 max-w-md lg:max-w-sm xl:max-w-md mx-auto lg:mx-0 leading-relaxed">
//               Login to access your AI-verified developer portfolio.
//             </p>
//           </div>

//           {/* Login Card */}
//           <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-7 xl:p-8 w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-md mx-auto border border-gray-200 dark:border-gray-700 flex flex-col justify-center h-full">
//             <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-center mb-2">
//               Login
//             </h2>
//             <p className="text-center text-gray-500 dark:text-gray-400 mb-5 sm:mb-6 text-sm sm:text-base lg:text-base xl:text-lg">
//               Continue to your DevSta account
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-4 overflow-auto max-h-[70vh]">
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 className="w-full px-3 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className="w-full px-3 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
//                 required
//               />

//               {/* Remember Me */}
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="rememberMe"
//                   checked={rememberMe}
//                   onChange={handleCheckbox}
//                   className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
//                 />
//                 <label htmlFor="rememberMe" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-base xl:text-lg">
//                   Remember Me
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 sm:py-2.5 lg:py-2.5 xl:py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base lg:text-base xl:text-lg"
//               >
//                 Login
//               </button>

//               {/* Signup Prompt */}
//               <p className="text-gray-300 text-xs sm:text-sm lg:text-sm text-center mt-2">
//                 Don't have an account?{" "}
//                 <a href="/signup" className="text-primary font-medium hover:underline">
//                   Sign Up
//                 </a>
//               </p>

//               {/* OR Separator */}
//               <div className="relative flex py-2 sm:py-2.5 lg:py-2.5 xl:py-3 items-center">
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
//                 <span className="flex-shrink mx-2 sm:mx-3 text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-sm xl:text-base">
//                   OR
//                 </span>
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
//               </div>

//               {/* Google Login */}
//               <button
//                 onClick={handleGoogleLogin}
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
//             <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 ${modalType === "success" ? "text-primary" : "text-red-500"}`}>
//               {modalType === "success" ? "Success!" : "Error!"}
//             </h3>
//             <p className="text-gray-800 dark:text-gray-300 mb-5 sm:mb-6 text-xs sm:text-sm lg:text-base">
//               {modalType === "success" ? successMessage : error}
//             </p>
//             <button
//               onClick={() => setShowModal(false)}
//               className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition text-sm sm:text-base lg:text-base xl:text-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { loginUser as loginAPI } from "../../api/auth";
// import { BACKEND_URL } from "../../../config";
// import { useNavigate } from "react-router-dom";
// import { Zap, BadgeCheck } from "lucide-react";

// export default function Login() {
//   const { loginUser } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // "success" | "error"

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleCheckbox = (e) => setRememberMe(e.target.checked);

//   const validateInput = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(form.email)) {
//       setError("Invalid email format.");
//       return false;
//     }
//     if (form.password.length < 8) {
//       setError("Password must be at least 8 characters long.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateInput()) return;

//     try {
//       const data = await loginAPI(form);
//       await loginUser(data.token, rememberMe);

//       setModalType("success");
//       setSuccessMessage("Logged in successfully!");
//       setShowModal(true);

//       setTimeout(() => setShowModal(false), 1000);
//     } catch (err) {
//       setError(err.message || "Login failed. Please try again.");
//       setModalType("error");
//       setShowModal(true);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${BACKEND_URL}/api/users/auth/google`;
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background-dark font-fragment text-black dark:text-white transition-colors duration-300 p-4 md:p-8">
//       <div className="container mx-auto lg:px-12 py-8 lg:py-12 flex items-center">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
          
//           {/* Left Pane with Stats */}
//           <div className="hidden lg:flex flex-col justify-center px-2 lg:pl-6 xl:pl-10 h-full">
//             <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-snug lg:leading-tight xl:leading-[1.15]">
//               Welcome Back to <span className="text-primary">DevSta</span>
//             </h1>
//             <p className="mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base lg:text-base xl:text-lg text-gray-700 dark:text-gray-300 max-w-md lg:max-w-sm xl:max-w-md leading-relaxed">
//               Login to access your AI-verified developer portfolio and track your contributions.
//             </p>

//             {/* Stats Section */}
//             <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-start items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 xl:space-x-10">
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

//           {/* Login Card */}
//           <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-7 xl:p-8 w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-md mx-auto border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
//             <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-center mb-2">
//               Login
//             </h2>
//             <p className="text-center text-gray-500 dark:text-gray-400 mt-1 mb-5 sm:mb-6 text-sm sm:text-base lg:text-base xl:text-lg">
//               Continue to your DevSta account
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-4 overflow-auto max-h-[70vh]">
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 className="w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className="w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
//                 required
//               />

//               {/* Remember Me + Forgot Password */}
//               <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={handleCheckbox}
//                     className="w-4 h-4 text-primary border-gray-300 rounded"
//                   />
//                   Remember Me
//                 </label>
//                 <a href="/forgot-password" className="hover:underline text-primary">
//                   Forgot password?
//                 </a>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 sm:py-2.5 lg:py-2.5 xl:py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base lg:text-base xl:text-lg"
//               >
//                 Log In
//               </button>

//               {/* Signup Prompt */}
//               <p className="text-gray-500 text-xs sm:text-sm lg:text-sm text-center mt-2">
//                 Don't have an account?{" "}
//                 <a href="/signup" className="text-primary font-medium hover:underline">
//                   Sign Up
//                 </a>
//               </p>

//               {/* OR Separator */}
//               <div className="relative flex py-2 sm:py-2.5 lg:py-2.5 xl:py-3 items-center">
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
//                 <span className="flex-shrink mx-2 sm:mx-3 text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-sm xl:text-base">
//                   OR
//                 </span>
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
//               </div>

//               {/* Google Login */}
//               <button
//                 onClick={handleGoogleLogin}
//                 type="button"
//                 className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-primary/10 text-gray-800 dark:text-gray-100 font-bold py-2.5 sm:py-2.5 lg:py-2.5 xl:py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base lg:text-base xl:text-lg"
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
//               className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 ${
//                 modalType === "success" ? "text-primary" : "text-red-500"
//               }`}
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
import { loginUser as loginAPI } from "../../api/auth";
import { BACKEND_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Users } from "lucide-react";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState({
  email: "",
  password: ""
});


  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "success" | "error"

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  

  const validateInput = () => {
  let errors = { email: "", password: "" };
  let valid = true;

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

   if (!validateInput()) return; // stop submission if invalid

    try {
      const data = await loginAPI(form);
      await loginUser(data.token);

      setModalType("success");
      setSuccessMessage("Logged in successfully!");
      setShowModal(true);

      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/users/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background-dark font-fragment text-black dark:text-white transition-colors duration-300 p-4 md:p-8">
      <div className="container mx-auto lg:px-12 py-8 lg:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
          
          {/* Left Pane with Two Stats */}
          <div className="hidden lg:flex flex-col justify-center px-2 lg:pl-6 xl:pl-10 h-full space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-snug lg:leading-tight xl:leading-[1.15]">
              Welcome Back to <span className="text-primary">DevSta</span>
            </h1>
            <p className="mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base lg:text-base xl:text-lg text-gray-700 dark:text-gray-300 max-w-md lg:max-w-sm xl:max-w-md leading-relaxed">
              Login to access your AI-verified developer portfolio and connect with the global developer network.
            </p>

            {/* Two Stats */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-start items-center space-y-3 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <BadgeCheck className="text-primary w-6 h-6 sm:w-7 sm:h-7" />
                <div>
                  <p className="font-bold text-base sm:text-lg lg:text-lg xl:text-xl text-primary">AI Verified</p>
                  <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-gray-600 dark:text-gray-300">Developer Identity</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="text-primary w-6 h-6 sm:w-7 sm:h-7" />
                <div>
                  <p className="font-bold text-base sm:text-lg lg:text-lg xl:text-xl text-primary">Global</p>
                  <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-gray-600 dark:text-gray-300">Developer Network</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-7 xl:p-8 w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-md mx-auto border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-center mb-2">
              Login
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-1 mb-5 sm:mb-6 text-sm sm:text-base lg:text-base xl:text-lg">
              Continue to your DevSta account
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-4 overflow-auto max-h-[70vh] p-[4px]">
              {/* <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
                required
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
                required
              /> */}


<div className="flex flex-col">
  <input
    type="email"
    name="email"
    value={form.email}
    onChange={handleChange}
    placeholder="Email Address"
    className="w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
    required
  />
  {validationErrors.email && (
    <span className="text-red-500 text-xs sm:text-sm mt-1">
      {validationErrors.email}
    </span>
  )}
</div>

<div className="flex flex-col">
  <input
    type="password"
    name="password"
    value={form.password}
    onChange={handleChange}
    placeholder="Password"
    className="w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base lg:text-base xl:text-lg"
    required
  />
  {validationErrors.password && (
    <span className="text-red-500 text-xs sm:text-sm mt-1">
      {validationErrors.password}
    </span>
  )}
</div>

             {/* Remember Me + Forgot Password */}
<div className="flex justify-start items-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
  <a href="/forgot-password" className="hover:underline text-primary">
    Forgot password?
  </a>
</div>



              <button
                type="submit"
                className="group relative w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 sm:py-2.5 lg:py-2.5 xl:py-3 px-4 rounded-lg overflow-hidden transition-colors duration-300 ease-in-out text-sm sm:text-base lg:text-base xl:text-lg"
              >
                {/* subtle "water" swipe element */}
                <span className="absolute -left-24 -top-8 w-40 h-40 bg-white/10 rounded-full blur-lg transform translate-x-0 transition-transform duration-700 ease-out group-hover:translate-x-64 group-hover:opacity-100 opacity-0 pointer-events-none"></span>

                {/* gentle overlay stripe for extra wet effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 pointer-events-none"></span>

                <span className="relative">Log In</span>
              </button>

              {/* Signup Prompt */}
              <p className="text-gray-500 text-xs sm:text-sm lg:text-sm text-center mt-2">
                Don't have an account?{" "}
                <a href="/signup" className="text-primary font-medium hover:underline">
                  Sign Up
                </a>
              </p>

              {/* OR Separator */}
              <div className="relative flex py-2 sm:py-2.5 lg:py-2.5 xl:py-3 items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-2 sm:mx-3 text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-sm xl:text-base">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-primary/10 text-gray-800 dark:text-gray-100 font-bold py-2.5 sm:py-2.5 lg:py-2.5 xl:py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base lg:text-base xl:text-lg"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google Logo"
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6"
                />
                <span>Continue with Google</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-white dark:bg-gray-900 p-5 sm:p-6 lg:p-7 xl:p-8 rounded-2xl shadow-2xl w-[90vw] max-w-xs sm:max-w-sm lg:max-w-md text-center border border-primary/50">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-400 hover:text-primary transition text-sm sm:text-base"
              type="button"
            >
              ✕
            </button>
            <h3
              className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 ${
                modalType === "success" ? "text-primary" : "text-red-500"
              }`}
            >
              {modalType === "success" ? "Success!" : "Error!"}
            </h3>
            <p className="text-gray-800 dark:text-gray-300 mb-5 sm:mb-6 text-xs sm:text-sm lg:text-base">
              {modalType === "success" ? successMessage : error}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-primary hover:bg-primary/90 text-white py-2 lg:py-3 rounded-lg font-medium transition text-sm sm:text-base lg:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
