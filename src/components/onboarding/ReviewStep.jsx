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
      <h2 className="text-xl font-bold text-primary">Review Your Information</h2>
      <p className="text-sm text-gray-400">Review the details before submitting.</p>

      <div className="space-y-4 rounded-lg p-6 bg-black border border-gray-800 shadow-sm">
        <div className="flex justify-between border-b border-gray-800 pb-2">
          <span className="font-medium text-gray-300">Name</span>
          <span className="text-white">{data.name || "-"}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-2">
          <span className="font-medium text-gray-300">Email</span>
          <span className="text-white">{data.email || "-"}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-2">
          <span className="font-medium text-gray-300">Phone</span>
          <span className="text-white">{phoneText}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-2">
          <span className="font-medium text-gray-300">Experience Level</span>
          <span className="text-white">{data.experienceLevel || "-"}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-2">
          <span className="font-medium text-gray-300">Primary Role</span>
          <span className="text-white">{data.primaryRole || "-"}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-2">
          <span className="font-medium text-gray-300">Top Skills</span>
          <span className="text-white">{data.topSkills?.join(", ") || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-300">Resume</span>
          <span className="text-white">{resumeText}</span>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded border border-gray-700 text-white hover:bg-gray-800 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onComplete}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
