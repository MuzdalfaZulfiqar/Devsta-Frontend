// // src/components/SuccessModal.jsx
// import { CheckCircle } from "lucide-react";

// export default function SuccessModal({ open, message, onClose }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//       <div className="bg-black border border-gray-800 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center font-fragment">
//         <CheckCircle className="mx-auto text-primary w-16 h-16 mb-4" />
//         <h2 className="text-xl font-bold text-white mb-2">Success!</h2>
//         <p className="text-gray-400 mb-6">{message}</p>
//         <button
//           onClick={onClose}
//           className="px-6 py-2 border border-white text-white bg-transparent rounded-lg hover:bg-primary hover:border-primary transition-all"
//         >
//           Continue →
//         </button>
//       </div>
//     </div>
//   );
// }


import { CheckCircle, X } from "lucide-react";

export default function SuccessModal({ open, message, onClose }) {
  if (!open) return null;

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

        <CheckCircle className="mx-auto text-primary w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Success!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white bg-transparent rounded-lg hover:bg-primary hover:border-primary transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
