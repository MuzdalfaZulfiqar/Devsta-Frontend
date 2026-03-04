// src/components/ResumeTemplateModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useAuth } from "../context/AuthContext";
import { getResumeTemplates } from "../api/resumeTemplates";

export default function ResumeTemplateModal({ isOpen, onClose, onSuccess, mode = "generate" }) {
  const { token } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState("classic_ats");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  const scanMessages = [
    "Preparing your resume...",
    "Applying selected template...",
    "Adjusting typography & spacing...",
    "Generating PDF document...",
    "Finalizing output...",
  ];

  useEffect(() => {
    if (!saving) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % scanMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [saving]);

  useEffect(() => {
    if (!isOpen || !token) return;

    (async () => {
      try {
        const list = await getResumeTemplates(token);
        setTemplates(list || []);
        if (list?.length) setTemplateId(list[0].id);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isOpen, token]);

  if (!isOpen) return null;

  const actionLabel = mode === "export" ? "Export PDF" : "Generate Resume";

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    setMessageIndex(0);

    try {
      const url = mode === "export" ? `${BACKEND_URL}/api/resume/export` : `${BACKEND_URL}/api/resume/generate`;
      await axios.post(
        url,
        { templateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto pt-8 pb-16">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4">
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "export" ? "Export Resume (PDF)" : "Generate Resume"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">
            ✕
          </button>
        </div>

        {saving ? (
          <div className="p-0">
            <div className="relative h-[380px] bg-gray-50 overflow-hidden rounded-b-2xl">
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 30px",
                }}
              />
              <div className="absolute inset-x-12 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                <div className="w-full max-w-3xl h-2 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent rounded-full shadow-2xl shadow-blue-400/40 animate-scan-beam" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8 text-center">
                <p className="text-xl font-medium text-gray-800 mb-4">
                  {scanMessages[messageIndex]}
                </p>
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((messageIndex + 1) / scanMessages.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose a Template</h3>

              {templates.length === 0 ? (
                <div className="text-sm text-gray-500">Loading templates...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`text-left p-4 rounded-xl border transition ${
                        templateId === t.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{t.description}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        Layout: {t.layout} • Style: {t.style}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        <div className="px-6 py-5 border-t bg-gray-50 flex items-center justify-end gap-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`px-8 py-2.5 rounded-lg font-medium text-white min-w-[180px] transition ${
              saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {actionLabel}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-beam {
          0% { transform: translateY(-120%); opacity: 0.4; }
          15% { opacity: 0.95; }
          50% { transform: translateY(120%); opacity: 0.95; }
          65% { opacity: 0.95; }
          98% { opacity: 0.4; }
          100% { transform: translateY(-120%); opacity: 0.4; }
        }
        .animate-scan-beam {
          animation: scan-beam 5.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}