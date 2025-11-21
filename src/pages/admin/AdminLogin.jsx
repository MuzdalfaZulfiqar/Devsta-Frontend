// src/pages/admin/AdminLogin.jsx
import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { adminLogin } from "../../api/admin";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const { login, loading, error } = useAdminAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    const errors = {};
    if (!form.username.trim()) errors.username = "Username is required";
    if (!form.password) errors.password = "Password is required";

    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }

    await login(adminLogin, form.username.trim(), form.password);
  };

  return (
    <>
      {/* Full-Screen Spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Signing you in...
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Reduced shadow + less rounded */}
          <div className="bg-white dark:bg-black rounded-2xl shadow-md border border-primary/20 p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-primary/10 mb-6">
                <Lock size={40} className="text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                Admin Portal
              </h1>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                Sign in to manage your platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    disabled={loading}
                    className={`w-full pl-12 pr-5 py-4 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      validationErrors.username
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:border-primary"
                    } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>
                {validationErrors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {validationErrors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    disabled={loading}
                    className={`w-full pl-12 pr-5 py-4 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      validationErrors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:border-primary"
                    } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Server Error */}
              {error && !loading && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-5 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <LogIn size={22} />
                Sign In
              </button>
            </form>

            <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Protected access • {new Date().getFullYear()}
            </div>
          </div>

         
        </div>
      </div>
    </>
  );
}