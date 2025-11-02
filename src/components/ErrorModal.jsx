// import { XCircle } from "lucide-react";

// export default function ErrorModal({ open, message, onClose }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//       <div className="bg-black border border-red-800 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center font-fragment">
//         <XCircle className="mx-auto text-red-500 w-14 h-14 mb-4" />
//         <h2 className="text-lg font-bold text-red-500 mb-2">Error</h2>
//         <p className="text-gray-400 mb-6">{message}</p>
//         <button
//           onClick={onClose}
//           className="px-6 py-2 border border-red-500 text-red-500 bg-transparent rounded-lg hover:bg-red-600 hover:text-white transition-all"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

import { XCircle, X } from "lucide-react";

export default function ErrorModal({ open, message, onClose }) {
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

        <XCircle className="mx-auto text-red-500 w-14 h-14 mb-4" />
        <h2 className="text-lg font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="px-6 py-2 border border-red-500 text-red-500 bg-transparent rounded-lg hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
