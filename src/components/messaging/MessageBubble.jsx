

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
        className={`flex items-end mb-3 ${
          isSender ? "justify-end" : "justify-start"
        }`}
      >
        {!isSender && avatarUser && (
          <DevstaAvatar user={avatarUser} size={36} className="mr-2" />
        )}

        <div
          className={`flex flex-col max-w-[70%] ${
            isSender ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-2xl break-words ${
              isSender
                ? "bg-primary text-white rounded-br-none"
                : "bg-gray-200 text-gray-900 dark:bg-gray-800 rounded-bl-none"
            }`}
            style={{ fontSize: "0.94rem" }}
          >
            {/* Text (optional) */}
            {msg.text && <div>{msg.text}</div>}

            {/* Cloudinary media (images/videos) */}
            {media && media.url && (
              <div className={`${msg.text ? "mt-2" : ""}`}>
                {/* Images */}
                {mediaType === "image" && (
                  <img
                    src={media.url}
                    alt={media.originalName || "image"}
                    className="max-h-64 rounded-lg object-contain cursor-pointer"
                    onClick={handleMediaClick}
                  />
                )}

                {/* Videos */}
                {mediaType === "video" && (
                  <video
                    src={media.url}
                    className="max-h-64 rounded-lg cursor-pointer"
                    controls
                    onClick={handleMediaClick}
                  />
                )}
              </div>
            )}
          </div>

          {/* Time + seen/sent ticks */}
          <span
            className={`text-[10px] text-gray-500 mt-1 flex items-center gap-1 ${
              isSender ? "justify-end" : ""
            }`}
          >
            {timeStr}

            {isSender && (
              <span className="ml-1 text-[11px]">
                {/* Single tick = sent, double tick = seen */}
                {hasSeenByOthers ? "✓✓" : "✓"}
              </span>
            )}
          </span>
        </div>

        {isSender && <div className="w-[36px] h-[36px] ml-2" />}
      </div>

      {/* Full-screen preview modal (image/video) */}
      {showPreview && media && media.url && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="max-w-3xl max-h-[90vh] bg-black rounded-xl p-3"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaType === "image" && (
              <img
                src={media.url}
                alt={media.originalName || "image preview"}
                className="max-h-[80vh] max-w-full object-contain"
              />
            )}

            {mediaType === "video" && (
              <video
                src={media.url}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full"
              />
            )}

            <div className="mt-2 text-right">
              <button
                className="px-3 py-1 text-xs rounded-full bg-white/10 text-white border border-white/30"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
