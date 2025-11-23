
// src/components/dashboard/ResumeUploadModal.jsx
import { Upload, X } from "lucide-react";
import { useState } from "react";

export default function ResumeUploadModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  if (!open) return null;

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      setFile(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="relative bg-white dark:bg-[#0a0a0a] border border-white/20 dark:border-gray-700 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center font-fragment transition-colors duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-primary transition"
        >
          <X size={20} />
        </button>

        <Upload className="mx-auto text-primary w-12 h-12 mb-3" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Upload Resume
        </h2>

        {!file ? (
          <label className="block">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <span className="px-6 py-2 border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-transparent rounded-lg cursor-pointer hover:bg-primary hover:border-primary transition-all">
              Choose File
            </span>
          </label>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-4 truncate">{file.name}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleUpload}
                className="px-5 py-2 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white bg-transparent rounded-lg hover:bg-primary hover:border-primary transition-all"
              >
                Upload
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
