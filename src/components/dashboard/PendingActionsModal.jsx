// src/components/dashboard/PendingActionsModal.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiCode, FiCalendar, FiX, FiArrowRight, FiVideo } from "react-icons/fi";

export default function PendingActionsModal({
  open,
  onClose,
  pendingTests = [],
  scheduledInterviews = [],
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const totalCount = pendingTests.length + scheduledInterviews.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — capped height, flex-col so header/footer are always visible */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "min(90vh, 580px)" }}
      >
        {/* Top urgency bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-orange-500 animate-pulse flex-shrink-0" />

        {/* ── HEADER — pinned, never scrolls ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                Action Required
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {totalCount === 1
                ? "You have 1 pending item"
                : `You have ${totalCount} pending items`}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Don't let these opportunities slip away
            </p>
          </div>

          {/* ✕ always visible, never scrolls away */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-4 flex-shrink-0"
            aria-label="Close"
          >
            <FiX className="text-gray-500" size={20} />
          </button>
        </div>

        {/* ── SCROLLABLE BODY — no visible scrollbar ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-6 pb-2 space-y-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Webkit scrollbar hide — inline so no extra CSS file needed */}
          <style>{`
            .modal-scroll-body::-webkit-scrollbar { display: none; }
          `}</style>

          {/* Pending Coding Tests */}
          {pendingTests.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 pt-1">
                Coding Assessments
              </p>
              <div className="space-y-2">
                {pendingTests.map((test, i) => {
                  const expiresAt = test.assessment?.expiresAt;
                  const isUrgent =
                    expiresAt &&
                    new Date(expiresAt) - new Date() < 1000 * 60 * 60 * 24;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        navigate("/dashboard/jobs#my-applications-section");
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all group text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-800/60 flex items-center justify-center flex-shrink-0">
                        <FiCode className="text-amber-600 dark:text-amber-300" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {test.job?.title || "Coding Test"}
                        </p>
                        <p
                          className={`text-xs flex items-center gap-1 mt-0.5 ${
                            isUrgent
                              ? "text-red-600 dark:text-red-400 font-semibold"
                              : "text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          <FiClock size={11} />
                          {expiresAt
                            ? `Expires ${new Date(expiresAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : "Awaiting your response"}
                          {isUrgent && " — Expiring soon!"}
                        </p>
                      </div>
                      <FiArrowRight
                        className="text-amber-500 group-hover:translate-x-1 transition-transform flex-shrink-0"
                        size={16}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scheduled Interviews */}
          {scheduledInterviews.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Scheduled Interviews
              </p>
              <div className="space-y-2">
                {scheduledInterviews.map((app, i) => {
                  const scheduledAt = app.interview?.scheduledAt;
                  const videoLink = app.interview?.videoLink;
                  const isToday =
                    scheduledAt &&
                    new Date(scheduledAt).toDateString() === new Date().toDateString();
                  const isPast = scheduledAt && new Date(scheduledAt) < new Date();

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        navigate("/dashboard/jobs#my-applications-section");
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800/60 flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="text-blue-600 dark:text-blue-300" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {app.job?.title || "Interview"}
                        </p>
                        <p
                          className={`text-xs flex items-center gap-1 mt-0.5 ${
                            isToday
                              ? "text-green-600 dark:text-green-400 font-semibold"
                              : "text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          <FiCalendar size={11} />
                          {scheduledAt
                            ? isToday
                              ? `Today at ${new Date(scheduledAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} — TODAY!`
                              : new Date(scheduledAt).toLocaleString([], {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                            : "Scheduled"}
                        </p>
                        {!app.interview?.confirmedByDeveloper && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5 font-medium">
                            ⚠ Not confirmed yet
                          </p>
                        )}
                      </div>
                      {videoLink && isToday && !isPast ? (
                        <a
                          href={videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                        >
                          <FiVideo size={12} />
                          Join
                        </a>
                      ) : (
                        <FiArrowRight
                          className="text-blue-500 group-hover:translate-x-1 transition-transform flex-shrink-0"
                          size={16}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spacer so last card isn't hidden behind the footer fade */}
          <div className="h-3" />
        </div>

        {/* Subtle fade at the bottom of the scroll area — hints there's more */}
        <div
          className="pointer-events-none absolute left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"
          style={{ bottom: "69px" }}
        />

        {/* ── FOOTER — pinned, never scrolls ── */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900">
          <button
            onClick={() => {
              navigate("/dashboard/jobs#my-applications-section");
              onClose();
            }}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            Go to My Applications →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors whitespace-nowrap"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
