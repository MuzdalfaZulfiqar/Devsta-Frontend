import { Info } from "lucide-react";

export default function InfoModal({ open, title, message, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="relative bg-white dark:bg-[#0a0a0a] border border-white/20 dark:border-gray-700 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center font-fragment transition-colors duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-primary transition"
        >
          ✕
        </button>

        {/* Primary Info Icon */}
        <Info className="mx-auto text-primary w-16 h-16 mb-4" />

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">{message}</p>

        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white bg-transparent rounded-lg hover:bg-primary hover:border-primary transition-all"
        >
          OK
        </button>
      </div>
    </div>
  );
}
