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
              className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 ${modalType === "success" ? "text-primary" : "text-red-500"
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
