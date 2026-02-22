import { useEffect, useState, useRef } from "react";

export default function AssessmentGuard({ onViolation }) {
  const [violationCount, setViolationCount] = useState(0);
  const [lastReason, setLastReason] = useState("");
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const violationRef = useRef(violationCount);

  useEffect(() => {
    violationRef.current = violationCount;
  }, [violationCount]);

  // ───────────────────────────────────────────────
  // Fullscreen – zero tolerance
  // ───────────────────────────────────────────────
  const enterFullscreen = async () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      try {
        await (elem.requestFullscreen?.() ||
                elem.webkitRequestFullscreen?.() ||
                elem.msRequestFullscreen?.());
        setShowFullscreenModal(false);
      } catch (err) {
        console.warn("Fullscreen failed:", err);
      }
    }
  };

  const checkFullscreen = () => {
    if (showFullscreenModal) return;

    if (!document.fullscreenElement) {
      setViolationCount(1);
      setLastReason("Exited fullscreen mode");
      setShowFullscreenModal(true);
    }
  };

  useEffect(() => {
    enterFullscreen();

    const onChange = () => checkFullscreen();

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    document.addEventListener("mozfullscreenchange", onChange);
    document.addEventListener("MSFullscreenChange", onChange);

    const interval = setInterval(checkFullscreen, 1000); // aggressive check

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
      document.removeEventListener("mozfullscreenchange", onChange);
      document.removeEventListener("MSFullscreenChange", onChange);
      clearInterval(interval);
    };
  }, [showFullscreenModal]);

  // ───────────────────────────────────────────────
  // Block EVERYTHING suspicious
  // ───────────────────────────────────────────────
  useEffect(() => {
    const blockAll = (e) => {
      e.preventDefault();
      setViolationCount(1);
      setLastReason(`Forbidden action: ${e.type}`);
      setShowFullscreenModal(true);
    };

    document.addEventListener("copy", blockAll, true);
    document.addEventListener("cut", blockAll, true);
    document.addEventListener("paste", blockAll, true);
    document.addEventListener("contextmenu", blockAll, true);

    const blockPrint = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setViolationCount(1);
        setLastReason("Print attempt");
        setShowFullscreenModal(true);
      }
    };
    document.addEventListener("keydown", blockPrint, true);

    const handleVisibility = () => {
      if (document.hidden) {
        setViolationCount(1);
        setLastReason("Tab switched or minimized");
        setShowFullscreenModal(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("copy", blockAll, true);
      document.removeEventListener("cut", blockAll, true);
      document.removeEventListener("paste", blockAll, true);
      document.removeEventListener("contextmenu", blockAll, true);
      document.removeEventListener("keydown", blockPrint, true);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // ───────────────────────────────────────────────
  // Auto-submit on ANY violation
  // ───────────────────────────────────────────────
  useEffect(() => {
    if (violationCount >= 1) {
      alert(
        `Violation detected (${lastReason}).\n` +
        `Test auto-submitted immediately.`
      );
      onViolation(lastReason);
    }
  }, [violationCount]);

  return (
    <>
      {showFullscreenModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] text-white">
          <div className="bg-gray-900 p-16 rounded-3xl text-center border-4 border-red-700 max-w-2xl shadow-2xl">
            <h2 className="text-5xl font-extrabold mb-10 text-red-500">
              TEST LOCKED
            </h2>
            <p className="text-2xl mb-10 font-bold">
              You exited fullscreen or performed a forbidden action.<br />
              This ends the test immediately.
            </p>
            <p className="text-xl mb-12 text-gray-300">
              No further coding is allowed.
            </p>
            <button
              onClick={() => onViolation(lastReason)}
              className="bg-red-700 hover:bg-red-900 px-20 py-8 rounded-2xl text-3xl font-bold transition"
            >
              END TEST NOW
            </button>
          </div>
        </div>
      )}
    </>
  );
}