import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function GeneralInfoStep({ formData, setFormData, nextStep }) {
  const [touched, setTouched] = useState({}); // track touched fields

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
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary">Step 1: General Info</h2>

      <div className="space-y-3">
        {/* Name */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Name"
            className="w-full border border-white rounded px-3 py-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {!hasName && touched.name && (
            <p className="text-red-500 text-xs mt-1">Full name is required.</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            readOnly
            className="w-full border border-white rounded px-3 py-2 bg-transparent text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">
            Email address cannot be changed.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Phone Number <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+92 312 3456789"
            className="w-full border border-white rounded px-3 py-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={() => {
            if (canNext) nextStep();
            else setTouched({ name: true }); // force show error if user just clicks
          }}
          disabled={!canNext}
          aria-disabled={!canNext}
          className={`flex items-center gap-2 px-6 py-2 rounded transition ${
            canNext
              ? "bg-primary text-white hover:bg-teal-700"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
