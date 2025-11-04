import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function GeneralInfoStep({ formData, setFormData, nextStep }) {
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const hasName = (formData.name || "").trim().length > 0;
  const hasEmail = (formData.email || "").trim().length > 0;
  const canNext = hasName && hasEmail;

  return (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Please provide your basic information to continue.
      </p>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-800 dark:text-gray-200">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {!hasName && touched.name && (
            <p className="text-red-500 text-xs mt-1">Full name is required.</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-800 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            readOnly
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 
                       bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Email address cannot be changed.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-semibold mb-1 block text-gray-800 dark:text-gray-200">
            Phone Number{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+92 312 3456789"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={() => {
            if (canNext) nextStep();
            else setTouched({ name: true });
          }}
          disabled={!canNext}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all
            ${
              canNext
                ? "bg-primary text-white hover:bg-teal-700 shadow-md hover:shadow-lg"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
