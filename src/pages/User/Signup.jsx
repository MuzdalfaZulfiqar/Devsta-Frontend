import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { signupUser } from "../../api/auth";
import { BACKEND_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "success" | "error"
const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const data = await signupUser(form);

    // Only pass token, AuthContext will fetch the user
    await loginUser(data.token);

    setModalType("success");
    setSuccessMessage("Account created successfully!");
    setShowModal(true);

    // Optional: close modal automatically after 1s
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

  const handleGitHubSignup = () => {
    window.location.href = `${BACKEND_URL}/api/users/auth/github`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black font-fragment tracking-wide p-4 md:p-8">
      {/* Card Container */}
      <div className="w-full sm:w-[90%] md:w-[70%] max-w-4xl h-auto bg-gradient-to-br from-primary/90 via-black/90 to-teal-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-4 border-[1px] border-primary/50">
        
        {/* Logo */}
        <div className="flex justify-end">
          <img
            src="/devsta-logo.png"
            alt="Devsta Logo"
            className="h-12 md:h-12 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-white text-center">
          Create Your Account
        </h2>

        {/* Form + Google Signup */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full text-sm md:text-base p-2.5 bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full text-sm md:text-base p-2.5 bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full text-sm md:text-base p-2.5 bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition font-medium text-sm md:text-base"
            >
              Sign Up
            </button>

            {/* Login Prompt under form */}
            <p className="text-gray-300 text-xs md:text-sm text-center mt-2">
              Already a user?{" "}
              <a
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Login here
              </a>
            </p>
          </form>

          {/* OR Separator */}
          <div className="flex flex-col md:flex-row items-center justify-center w-full md:w-auto my-4 md:my-0">
            {/* Mobile: horizontal */}
            <div className="flex md:hidden items-center w-full">
              <div className="flex-grow h-px bg-primary/70"></div>
              <span className="mx-2 text-gray-300 text-xs font-medium">OR</span>
              <div className="flex-grow h-px bg-primary/70"></div>
            </div>
            {/* Desktop: vertical */}
            <div className="hidden md:flex flex-col items-center h-full px-4">
              <div className="flex-grow w-px bg-primary/70"></div>
              <span className="my-2 text-gray-300 text-xs font-medium">OR</span>
              <div className="flex-grow w-px bg-primary/70"></div>
            </div>
          </div>

          {/* Social Signup Buttons */}
          <div className="flex-1 flex flex-col justify-center w-full gap-3">
            {/* GitHub Signup */}
            {/* <button
              onClick={handleGitHubSignup}
              className="w-full flex items-center justify-center gap-2 border border-gray-400 bg-black/20 py-2.5 rounded-lg hover:bg-black/40 transition font-medium text-sm md:text-base text-white"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Continue with GitHub
            </button> */}
            
            {/* Google Signup */}
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-2 border border-gray-400 bg-black/20 py-2.5 rounded-lg hover:bg-black/40 transition font-medium text-sm md:text-base text-white"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google Logo"
                className="w-4 h-4"
              />
              Continue with Google
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}

{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="relative bg-gradient-to-br from-primary/90 via-black/90 to-teal-900/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl w-[90vw] max-w-xs md:max-w-md text-center border border-primary/50">
      {/* Small Cross Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-teal-400 transition text-base md:text-lg focus:outline-none p-1 rounded-full bg-black/30"
        aria-label="Close"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <h3
        className={`text-xl md:text-2xl font-semibold mb-5 ${
          modalType === "success" ? "text-teal-400" : "text-red-400"
        }`}
      >
        {modalType === "success" ? "Success!" : "Error!"}
      </h3>
      <p className="text-white mb-6 text-sm md:text-base">
        {modalType === "success" ? successMessage : error}
      </p>
      <button
        onClick={() => setShowModal(false)}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition text-base"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
