// import DevstaAvatar from "../dashboard/DevstaAvatar";

// export default function MessageBubble({ msg, currentUserId }) {
//     const isSender = msg?.sender?._id === currentUserId;

//     // Avatar for receiver messages
//     const avatarUser = !isSender ? msg.sender : null;

//     return (
//         <div className={`flex items-end mb-3 ${isSender ? "justify-end" : "justify-start"}`}>
//             {!isSender && avatarUser && (
//                 <DevstaAvatar user={avatarUser} size={36} className="mr-2" />
//             )}

//             <div className={`flex flex-col max-w-[70%] ${isSender ? "items-end" : "items-start"}`}>
//                 <div
//                     className={`px-4 py-2 rounded-2xl break-words ${isSender ? "bg-primary text-white rounded-br-none" : "bg-gray-200 text-gray-900 dark:bg-gray-800 rounded-bl-none"}`}
//                     style={{ fontSize: "0.94rem" }} // ~5% bigger than default text-sm
//                 >
//                     {msg.text}
//                 </div>
//                 <span className="text-[10px] text-gray-500 mt-1">
//                     {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </span>
//             </div>

//             {isSender && <div className="w-[36px] h-[36px] ml-2" />}
//         </div>
//     );
// }
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
      : media?.mimeType
      ? "file"
      : null);

  const [showPreview, setShowPreview] = useState(false);

  const handleMediaClick = () => {
    if (mediaType === "image" || mediaType === "video") {
      setShowPreview(true);
    }
  };

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

            {/* Media thumbnail / link */}
            {media && media.url && (
              <div className={`${msg.text ? "mt-2" : ""}`}>
                {mediaType === "image" && (
                  <img
                    src={media.url}
                    alt={media.originalName || "image"}
                    className="max-h-64 rounded-lg object-contain cursor-pointer"
                    onClick={handleMediaClick}
                  />
                )}

                {mediaType === "video" && (
                  <video
                    src={media.url}
                    className="max-h-64 rounded-lg cursor-pointer"
                    controls
                    onClick={handleMediaClick}
                  />
                )}

                {mediaType !== "image" && mediaType !== "video" && (
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                    download={media.originalName || true}
                    className="flex items-center gap-2 text-xs underline break-all"
                  >
                    📎 {media.originalName || "Download file"}
                  </a>
                )}
              </div>
            )}
          </div>

          <span className="text-[10px] text-gray-500 mt-1">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
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
