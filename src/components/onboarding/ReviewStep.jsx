import { ArrowLeft } from "lucide-react";

export default function ReviewStep({ data, onBack, onComplete, loading = false }) {
  const resumeText =
    data?.resume?.name
      ? data.resume.name
      : data?.resumeUrl
        ? "Uploaded"
        : "Not uploaded";
  const phoneText =
    data?.phone && String(data.phone).trim()
      ? String(data.phone).trim()
      : "Not added";

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-primary">Review Your Information</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Review the details before submitting.
      </p>

      {/* Review Card */}
      <div className="space-y-4 rounded-lg p-6 bg-transparent border border-gray-300 dark:border-gray-700 shadow-sm transition-colors">
        {[
          ["Name", data.name || "-"],
          ["Email", data.email || "-"],
          ["Phone", phoneText],
          ["Experience Level", data.experienceLevel || "-"],
          ["Primary Role", data.primaryRole || "-"],
          ["Top Skills", data.topSkills?.join(", ") || "-"],
          ["Resume", resumeText],
        ].map(([label, value], i, arr) => (
          <div
            key={label}
            className={`flex justify-between items-center ${i !== arr.length - 1 ? "border-b border-gray-200 dark:border-gray-800 pb-2" : ""
              }`}
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
            <span className="text-gray-900 dark:text-gray-100">{value}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {/* Back Button — same theme as before */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 
                     text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onComplete}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-primary text-white hover:bg-[#075f5d] shadow-md hover:shadow-lg"
            }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
