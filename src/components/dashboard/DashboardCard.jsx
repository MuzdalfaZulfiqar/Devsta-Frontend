
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function DashboardCard({ title, description, actionLabel, onAction, completed }) {
  return (
    <motion.div
      layout
      whileHover={{ y: completed ? 0 : -4 }}
      className={`relative rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-all duration-300 border
        ${completed
          ? "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        }`}
    >
      {/* Badge */}
      {!completed && (
        <span className="absolute top-3 right-3 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-semibold">
          Pending
        </span>
      )}

      {/* Card Content */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          {!completed && <span className="animate-bounce text-primary">⚡</span>}
          <h3 className={`text-lg font-semibold tracking-wide ${completed ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"}`}>
            {title}
          </h3>
        </div>
        <p className={`${completed ? "text-gray-600 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"} text-sm`}>
          {description}
        </p>
      </div>

      {/* Action Button */}
      {actionLabel && (
        <button
          onClick={onAction}
          className={`mt-4 px-5 py-2 rounded-xl font-semibold transition-all duration-200
            ${completed
              ? "bg-white text-primary border border-gray-300 dark:border-gray-600 hover:bg-primary hover:text-white"
              : "bg-primary text-white hover:bg-primary/90 shadow-sm"
            }`}
        >
          {completed && <CheckCircle className="inline w-4 h-4 mr-2 text-green-500" />}
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
