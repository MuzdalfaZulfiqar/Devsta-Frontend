import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ReviewStep({ data, onBack, onComplete }) {
  const resumeText =
    data?.resume?.name
      ? data.resume.name
      : data?.resumeUrl
        ? "Uploaded"
        : "Not uploaded";
  const phoneText = (data?.phone && String(data.phone).trim())
    ? String(data.phone).trim()
    : "Not added"
  return (
    <div className="space-y-6 bg-black">
      <h2 className="text-xl font-bold text-primary">Review Your Information</h2>
      <p className="text-sm text-gray-400">
        Review the details.
      </p>

      <div className="space-y-4 border border-white rounded-lg p-6">
        <div className="flex justify-between">
          <span className="font-medium text-white">Name:</span>
          <span className="text-white">{data.name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-white">Email:</span>
          <span className="text-white">{data.email || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-white">Phone:</span>
          <span className="text-white">{phoneText}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-white">Experience Level:</span>
          <span className="text-white">{data.experienceLevel || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-white">Primary Role:</span>
          <span className="text-white">{data.primaryRole || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-white">Top Skills:</span>
          <span className="text-white">{data.topSkills?.join(", ") || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-white">Resume:</span>
          <span className="text-white">{resumeText}</span>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
