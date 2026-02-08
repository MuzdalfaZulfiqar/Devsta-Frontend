import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { applyForJob, uploadResumeForJob, getMyApplications } from "../../api/company/jobApplications";
import { showToast } from "../../utils/toast";
import { BACKEND_URL } from "../../../config";

export default function ApplyJobModal({ job, onClose, onApplied }) {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    githubProfile: "",
    linkedinProfile: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      githubProfile: user.githubUrl || "",
      linkedinProfile: user.linkedinUrl || "",
    });

    (async () => {
      try {
        const myApps = await getMyApplications(token);
        const existingApp = myApps.find((app) => app.job._id === job._id);

        if (existingApp?.developerSnapshot?.resumeUrl) {
          setResumeUrl(`${BACKEND_URL}/api/developer/jobApplications/${job._id}/resume`);
        } else if (user.resumeUrl) {
          setResumeUrl(`${BACKEND_URL}/api/users/resume/${user._id}`);
        } else {
          setResumeUrl("");
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    })();
  }, [user, job, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job?._id) return;

    try {
      setLoading(true);

      const myApps = await getMyApplications(token);
      const existingApp = myApps.find((app) => app.job._id === job._id);

      if (!existingApp) {
        await applyForJob(job._id, formData, token);
        showToast("Application submitted successfully", "success");
      }

      if (resumeFile) {
        await uploadResumeForJob(job._id, resumeFile, token);
        setResumeUrl(`${BACKEND_URL}/api/developer/jobApplications/${job._id}/resume`);
        showToast("New resume uploaded successfully", "success");
      }

      onApplied?.();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to apply or upload resume", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    if (resumeFile) {
      window.open(URL.createObjectURL(resumeFile), "_blank");
    } else if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      showToast("No resume available", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Apply for "{job.title}"</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <MdClose className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Form - scrollbar hidden */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-4 overflow-y-auto max-h-[80vh]"
          style={{
            // Hide scrollbar cross-browser
            msOverflowStyle: "none", // IE and Edge
            scrollbarWidth: "none", // Firefox
          }}
        >
          {/* Hide scrollbar in WebKit browsers (Chrome, Safari, new Edge) */}
          <style jsx>{`
            form::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>

            {(resumeUrl || resumeFile) && (
              <p className="text-sm mb-1">
                <button
                  type="button"
                  onClick={handleViewResume}
                  className="text-primary hover:underline"
                >
                  {resumeFile ? "Preview newly selected resume" : "View resume from your profile"}
                </button>
              </p>
            )}

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Keep your current resume or upload a new one to replace it (optional, max 5MB)
            </p>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
            <input
              type="text"
              name="githubProfile"
              value={formData.githubProfile}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
            <input
              type="text"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-opacity-90 transition-colors ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}