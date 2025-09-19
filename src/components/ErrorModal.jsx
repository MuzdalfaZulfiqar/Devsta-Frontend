import { XCircle } from "lucide-react";

export default function ErrorModal({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-black border border-red-800 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center font-fragment">
        <XCircle className="mx-auto text-red-500 w-14 h-14 mb-4" />
        <h2 className="text-lg font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 border border-red-500 text-red-500 bg-transparent rounded-lg hover:bg-red-600 hover:text-white transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
