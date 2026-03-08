// src/components/dashboard/PendingSummaryCards.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCode,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiVideo,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

// ── Single summary card ──────────────────────────────────────────────────────
function SummaryCard({ type, count, items, onGoToApplications }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const isTest = type === "test";

  const accentClasses = isTest
    ? {
        wrapper:
          "border-red-400 dark:border-red-500 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/40 dark:to-amber-950/30 ring-1 ring-red-300 dark:ring-red-800 shadow-lg shadow-red-100 dark:shadow-red-900/20",
        badge: "bg-red-500 text-white",
        icon: "bg-red-100 dark:bg-red-800/60 text-red-600 dark:text-red-300",
        expandRow:
          "hover:bg-red-50/80 dark:hover:bg-red-900/20 border-red-100 dark:border-red-900",
        actionBtn: "bg-red-500 hover:bg-red-600 text-white",
        chevronColor: "text-red-500",
        dot: "bg-red-500",
        pingColor: "bg-red-400",
        label: "Assessment Pending",
        Icon: FiCode,
        expandedBg: "bg-red-50/60 dark:bg-red-950/20",
        divider: "border-red-200 dark:border-red-800",
        urgentText: "text-red-600 dark:text-red-400",
      }
    : {
        wrapper:
          "border-blue-300 dark:border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 shadow-md shadow-blue-100 dark:shadow-blue-900/20",
        badge: "bg-blue-500 text-white",
        icon: "bg-blue-100 dark:bg-blue-800/60 text-blue-600 dark:text-blue-300",
        expandRow:
          "hover:bg-blue-50/80 dark:hover:bg-blue-900/20 border-blue-100 dark:border-blue-900",
        actionBtn: "bg-blue-500 hover:bg-blue-600 text-white",
        chevronColor: "text-blue-500",
        dot: "bg-blue-500",
        pingColor: "bg-blue-400",
        label: "Interview Scheduled",
        Icon: FiCalendar,
        expandedBg: "bg-blue-50/60 dark:bg-blue-950/20",
        divider: "border-blue-200 dark:border-blue-800",
        urgentText: "text-green-600 dark:text-green-400",
      };

  const { Icon } = accentClasses;

  return (
    <motion.div
      layout
      className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${accentClasses.wrapper}`}
    >
      {/* ── Collapsed header — always visible ── */}
      <div className="p-5 flex items-center gap-4">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accentClasses.icon}`}
        >
          <Icon size={20} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {/* Pulsing badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-2.5 py-0.5 rounded-full ${accentClasses.badge}`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accentClasses.pingColor}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${accentClasses.dot}`}
                />
              </span>
              {count} {count === 1 ? accentClasses.label : accentClasses.label + "s"}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {isTest
              ? count === 1
                ? `Complete your coding test for ${items[0]?.job?.title || "a position"}`
                : `You have ${count} coding assessments awaiting`
              : count === 1
              ? `Scheduled for ${
                  items[0]?.interview?.scheduledAt
                    ? new Date(items[0].interview.scheduledAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })
                    : "upcoming"
                } — ${items[0]?.job?.title || "a position"}`
              : `${count} upcoming interviews`}
          </p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <FiChevronUp className={accentClasses.chevronColor} size={18} />
          ) : (
            <FiChevronDown className={accentClasses.chevronColor} size={18} />
          )}
        </button>
      </div>

      {/* ── Expanded rows ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-2 space-y-2 ${accentClasses.expandedBg}`}>
              <div className={`border-t ${accentClasses.divider} pt-3`} />

              {isTest
                ? items.map((test, i) => {
                    const expiresAt = test.assessment?.expiresAt;
                    const isUrgent =
                      expiresAt &&
                      new Date(expiresAt) - new Date() < 1000 * 60 * 60 * 24;

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border ${accentClasses.expandRow} transition-colors`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {test.job?.title || "Coding Assessment"}
                          </p>
                          {expiresAt && (
                            <p
                              className={`text-xs flex items-center gap-1 mt-0.5 font-medium ${
                                isUrgent
                                  ? accentClasses.urgentText + " font-bold"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              <FiClock size={10} />
                              Expires{" "}
                              {new Date(expiresAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {isUrgent && " ⚠"}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                : items.map((app, i) => {
                    const scheduledAt = app.interview?.scheduledAt;
                    const videoLink = app.interview?.videoLink;
                    const isToday =
                      scheduledAt &&
                      new Date(scheduledAt).toDateString() ===
                        new Date().toDateString();
                    const notConfirmed = !app.interview?.confirmedByDeveloper;

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border ${accentClasses.expandRow} transition-colors`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {app.job?.title || "Interview"}
                          </p>
                          <p
                            className={`text-xs flex items-center gap-1 mt-0.5 font-medium ${
                              isToday
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <FiCalendar size={10} />
                            {scheduledAt
                              ? isToday
                                ? `Today at ${new Date(scheduledAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}`
                                : new Date(scheduledAt).toLocaleString([], {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                              : "Scheduled"}
                            {isToday && " 🟢"}
                          </p>
                          {notConfirmed && (
                            <p className="text-xs text-orange-500 dark:text-orange-400 flex items-center gap-1 mt-0.5">
                              <FiAlertCircle size={10} />
                              Not confirmed yet
                            </p>
                          )}
                        </div>

                        {/* Join button if today */}
                        {videoLink && isToday && (
                          <a
                            href={videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiVideo size={11} />
                            Join
                          </a>
                        )}
                      </div>
                    );
                  })}

              {/* CTA */}
              <button
                onClick={onGoToApplications}
                className={`w-full mt-1 mb-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${accentClasses.actionBtn}`}
              >
                View in My Applications
                <FiArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Exported wrapper — renders 0, 1, or 2 cards ─────────────────────────────
export default function PendingSummaryCards({ pendingTests = [], scheduledInterviews = [] }) {
  const navigate = useNavigate();

  const goToApplications = () =>
    navigate("/dashboard/jobs#my-applications-section");

  if (!pendingTests.length && !scheduledInterviews.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pendingTests.length > 0 && (
        <SummaryCard
          type="test"
          count={pendingTests.length}
          items={pendingTests}
          onGoToApplications={goToApplications}
        />
      )}
      {scheduledInterviews.length > 0 && (
        <SummaryCard
          type="interview"
          count={scheduledInterviews.length}
          items={scheduledInterviews}
          onGoToApplications={goToApplications}
        />
      )}
    </div>
  );
}
