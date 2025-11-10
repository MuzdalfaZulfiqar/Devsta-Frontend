import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
        >
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onCancel}
          >
            <IoClose size={20} />
          </button>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>

          {/* Message */}
          <p className="text-gray-600 text-sm mb-5 leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>

            <button
              className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark font-semibold"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
