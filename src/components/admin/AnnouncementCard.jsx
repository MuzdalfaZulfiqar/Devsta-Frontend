import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

export default function AnnouncementCard({ title, message, category, createdAt }) {
  const badge = {
    Maintenance: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    News: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Update: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    Event: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  }[category] || "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-full max-w-sm rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden font-fragment"
    >
      <div className="p-5">
        {/* Header: Icon + Title + Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Megaphone className="text-primary" size={18} />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${badge}`}
          >
            {category}
          </span>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
          {message}
        </p>
      </div>

      {/* Footer: Date always bottom-right */}
      <div className="px-5 pb-4">
        <time className="text-xs text-gray-500 dark:text-gray-500 float-right">
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        <div className="clear-both" />
      </div>
    </motion.div>
  );
}