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


// src/components/messaging/MessageBubble.jsx
import { useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { BACKEND_URL } from "../../../config";

// helper: what kind of doc is this?
function getDocKind(mimeType, name = "") {
  const lowerName = (name || "").toLowerCase();
  const mt = (mimeType || "").toLowerCase();

  // PDF
  if (mt.includes("pdf") || lowerName.endsWith(".pdf")) {
    return "pdf";
  }

  // Word
  if (
    mt.includes("word") ||
    mt.includes("officedocument.wordprocessingml") ||
    lowerName.endsWith(".doc") ||
    lowerName.endsWith(".docx")
  ) {
    return "word";
  }

  // Excel
  if (
    mt.includes("excel") ||
    mt.includes("spreadsheet") ||
    mt.includes("officedocument.spreadsheetml") ||
    lowerName.endsWith(".xls") ||
    lowerName.endsWith(".xlsx")
  ) {
    return "excel";
  }

  // PowerPoint
  if (
    mt.includes("powerpoint") ||
    mt.includes("presentation") ||
    mt.includes("officedocument.presentationml") ||
    lowerName.endsWith(".ppt") ||
    lowerName.endsWith(".pptx")
  ) {
    return "ppt";
  }

  return "other";
}

export default function MessageBubble({ msg, currentUserId }) {
  const isSender = msg?.sender?._id === currentUserId;
  const avatarUser = !isSender ? msg.sender : null;
  const media = msg.media;
  const attachment = msg.attachment;

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

  const mediaDocKind =
    mediaType === "file"
      ? getDocKind(media?.mimeType, media?.originalName)
      : null;

  // doc kind for attachment-based files (local uploads)
  const attachmentDocKind = attachment
    ? getDocKind(attachment.mimeType, attachment.originalName)
    : null;

  // backend download URL for attachment
  const attachmentDownloadUrl = attachment
    ? `${BACKEND_URL}/api/files/download/${msg._id}`
    : null;

  return (
    <>
      <div
        className={`flex items-end mb-3 ${isSender ? "justify-end" : "justify-start"
          }`}
      >
        {!isSender && avatarUser && (
          <DevstaAvatar user={avatarUser} size={36} className="mr-2" />
        )}

        <div
          className={`flex flex-col max-w-[70%] ${isSender ? "items-end" : "items-start"
            }`}
        >
          <div
            className={`px-4 py-2 rounded-2xl break-words ${isSender
                ? "bg-primary text-white rounded-br-none"
                : "bg-gray-200 text-gray-900 dark:bg-gray-800 rounded-bl-none"
              }`}
            style={{ fontSize: "0.94rem" }}
          >
            {/* Text (optional) */}
            {msg.text && <div>{msg.text}</div>}

            {/* Cloudinary media (images/videos/files) */}
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

                {/* Documents / other files via Cloudinary */}
                {mediaType === "file" && (
                  <a
                    href={media.url}
                    download={media.originalName || true}
                    className="flex items-center gap-3 text-xs break-all bg-white/10 rounded-lg px-3 py-2 mt-1"
                  >
                    {/* Icon badge */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-[10px] font-bold text-white ${mediaDocKind === "pdf"
                          ? "bg-red-500"
                          : mediaDocKind === "word"
                            ? "bg-blue-500"
                            : mediaDocKind === "excel"
                              ? "bg-green-500"
                              : mediaDocKind === "ppt"
                                ? "bg-orange-500"
                                : "bg-gray-500"
                        }`}
                    >
                      {mediaDocKind === "pdf"
                        ? "PDF"
                        : mediaDocKind === "word"
                          ? "DOC"
                          : mediaDocKind === "excel"
                            ? "XLS"
                            : mediaDocKind === "ppt"
                              ? "PPT"
                              : "FILE"}
                    </div>

                    {/* File name + hint */}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate max-w-[160px]">
                        {media.originalName || "Download file"}
                      </span>
                      <span className="text-[10px] opacity-70">
                        Click to download
                      </span>
                    </div>
                  </a>
                )}
              </div>
            )}

            {/* Local attachment documents (PDF/Word/Excel/PPT stored on server) */}
            {attachment && (
              <div className={`${msg.text || media ? "mt-2" : ""}`}>
                <a
                  href={attachmentDownloadUrl}
                  className="flex items-center gap-3 text-xs break-all bg-white/10 rounded-lg px-3 py-2 mt-1"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-[10px] font-bold text-white ${attachmentDocKind === "pdf"
                        ? "bg-red-500"
                        : attachmentDocKind === "word"
                          ? "bg-blue-500"
                          : attachmentDocKind === "excel"
                            ? "bg-green-500"
                            : attachmentDocKind === "ppt"
                              ? "bg-orange-500"
                              : "bg-gray-500"
                      }`}
                  >
                    {attachmentDocKind === "pdf"
                      ? "PDF"
                      : attachmentDocKind === "word"
                        ? "DOC"
                        : attachmentDocKind === "excel"
                          ? "XLS"
                          : attachmentDocKind === "ppt"
                            ? "PPT"
                            : "FILE"}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="truncate max-w-[160px]">
                      {attachment.originalName || "Download file"}
                    </span>
                    <span className="text-[10px] opacity-70">
                      Click to download
                    </span>
                  </div>
                </a>
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