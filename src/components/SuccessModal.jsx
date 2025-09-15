// src/components/SuccessModal.jsx
import { CheckCircle } from "lucide-react";

export default function SuccessModal({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-black border border-gray-800 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center font-fragment">
        <CheckCircle className="mx-auto text-primary w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Success!</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 border border-white text-white bg-transparent rounded-lg hover:bg-primary hover:border-primary transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
