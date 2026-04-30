

// src/components/messaging/MessageBubble.jsx
import { useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";

export default function MessageBubble({ msg, currentUserId }) {
  const isSender = msg?.sender?._id === currentUserId;
  const avatarUser = !isSender ? msg.sender : null;
  const media = msg.media;

  const mediaType =
    media?.type ||
    (media?.mimeType?.startsWith("image/")
      ? "image"
      : media?.mimeType?.startsWith("video/")
      ? "video"
      : null);

  const [showPreview, setShowPreview] = useState(false);

  const handleMediaClick = () => {
    if (mediaType === "image" || mediaType === "video") {
      setShowPreview(true);
    }
  };

  // ---- Time + read status logic ----
  const createdAt = msg?.createdAt ? new Date(msg.createdAt) : null;
  const timeStr = createdAt
    ? createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  let readBy = Array.isArray(msg.readBy) ? msg.readBy : [];

  // Normalize ids; readBy can be ObjectIds (string) or populated objects
  const othersWhoRead = readBy
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === "string") return entry;
      if (entry._id) return entry._id.toString();
      return null;
    })
    .filter(
      (id) => id && id !== currentUserId // exclude myself
    );

  const hasSeenByOthers = othersWhoRead.length > 0;

  return (
    <>
      <div
        className={`flex items-end mb-4 gap-2 ${
          isSender ? "justify-end" : "justify-start"
        }`}
      >
        {!isSender && avatarUser && (
          <DevstaAvatar user={avatarUser} size={38} className="flex-shrink-0" />
        )}

        <div
          className={`flex flex-col max-w-[65%] ${
            isSender ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`px-4 py-2.5 rounded-lg break-words transition-all ${
              isSender
                ? "bg-primary text-white rounded-br-sm"
                : "bg-gray-100 text-gray-900 dark:bg-gray-700/80 dark:text-gray-50 rounded-bl-sm"
            }`}
            style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
          >
            {/* Text (optional) */}
            {msg.text && <div>{msg.text}</div>}

            {/* Cloudinary media (images/videos) */}
            {media && media.url && (
              <div className={`${msg.text ? "mt-2.5" : ""}`}>
                {/* Images */}
                {mediaType === "image" && (
                  <img
                    src={media.url}
                    alt={media.originalName || "image"}
                    className="max-h-72 rounded-lg object-contain cursor-pointer hover:brightness-95 transition-all duration-200"
                    onClick={handleMediaClick}
                  />
                )}

                {/* Videos */}
                {mediaType === "video" && (
                  <video
                    src={media.url}
                    className="max-h-72 rounded-lg cursor-pointer hover:brightness-95 transition-all duration-200"
                    controls
                    onClick={handleMediaClick}
                  />
                )}
              </div>
            )}
          </div>

          {/* Time + seen/sent ticks */}
          <div
            className={`text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1.5 px-1 ${
              isSender ? "justify-end" : ""
            }`}
          >
            <span>{timeStr}</span>

            {isSender && (
              <span className={`text-sm ${hasSeenByOthers ? "text-blue-500" : "text-gray-400"}`}>
                {hasSeenByOthers ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>

        {isSender && <div className="w-9 h-9 flex-shrink-0" />}
      </div>

      {/* Full-screen preview modal (image/video) */}
      {showPreview && media && media.url && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaType === "image" && (
              <img
                src={media.url}
                alt={media.originalName || "image preview"}
                className="w-full h-full max-h-[85vh] object-contain"
              />
            )}

            {mediaType === "video" && (
              <video
                src={media.url}
                controls
                autoPlay
                className="w-full h-full max-h-[85vh] object-contain"
              />
            )}

            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 border border-white/20"
              onClick={() => setShowPreview(false)}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
