import { ArrowLeft, ArrowRight } from "lucide-react";

export default function GeneralInfoStep({ formData, setFormData, nextStep }) {
  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary">Step 1: General Info</h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-white rounded px-3 py-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

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
            Email is fetched from your account and cannot be changed.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            className="w-full border border-white rounded px-3 py-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:bg-teal-700 transition"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
