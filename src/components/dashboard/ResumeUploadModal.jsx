// src/components/dashboard/ResumeUploadModal.jsx
import { Upload } from "lucide-react";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-black border border-gray-800 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center font-fragment">
        <Upload className="mx-auto text-primary w-12 h-12 mb-3" />
        <h2 className="text-lg font-semibold text-white mb-6">
          Upload Resume
        </h2>

        {!file ? (
          <>
            <label className="block">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <span className="px-6 py-2 border border-white text-white bg-transparent rounded-lg cursor-pointer hover:bg-primary hover:border-primary transition-all">
                Choose File
              </span>
            </label>
          </>
        ) : (
          <>
            <p className="text-gray-300 mb-4 truncate">{file.name}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleUpload}
                className="px-5 py-2 border border-white text-white bg-transparent rounded-lg hover:bg-primary hover:border-primary transition-all"
              >
                Upload
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-500 text-gray-300 bg-transparent rounded-lg hover:bg-gray-700 transition-all"
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
