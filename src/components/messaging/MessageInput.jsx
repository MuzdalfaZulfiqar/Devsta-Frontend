// src/components/messaging/MessageInput.jsx
import { useState, useRef } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Video,
  Loader2,
} from "lucide-react";

export default function MessageInput({ onSend, isSending }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [fileAccept, setFileAccept] = useState(""); // dynamic accept based on chosen type
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);

  const triggerFilePicker = (accept) => {
    setFileAccept(accept);
    setShowMenu(false);
    // small timeout so accept updates before click
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setFiles(selected);
    } else {
      setFiles([]);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    const hasFiles = files.length > 0;

    if (!trimmed && !hasFiles) return;

    onSend({
      text: trimmed,
      files,
    });

    setText("");
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-[#0a0a0a] rounded-b-2xl">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={fileAccept}
        multiple // allow multiple images/videos
      />

      {/* Attachment preview ABOVE input (WhatsApp style) */}
      {files.length > 0 && (
        <div className="px-3 pt-2">
          <div className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
            {files.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");
              const badgeLabel = isImage ? "IMG" : isVideo ? "VID" : "FILE";
              const badgeBg = isImage
                ? "bg-blue-500"
                : isVideo
                ? "bg-purple-500"
                : "bg-gray-500";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-[10px] font-bold text-white ${badgeBg}`}
                    >
                      {badgeLabel}
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-[220px]">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={() => {
                      setFiles((prev) =>
                        prev.filter((_, fileIdx) => fileIdx !== index)
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                <Loader2 size={14} className="animate-spin" />
                <span>Sending media…</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main input row */}
      <div className="flex items-center p-3 gap-2 relative">
        {/* Single Attach button + menu */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowMenu((prev) => !prev)}
            disabled={isSending}
          >
            <Paperclip size={18} />
          </button>

          {showMenu && (
            <div className="absolute bottom-12 left-0 mb-2 w-40 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              <button
                type="button"
                onClick={() => triggerFilePicker("image/*")}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ImageIcon size={16} />
                <span>Images</span>
              </button>
              <button
                type="button"
                onClick={() => triggerFilePicker("video/*")}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Video size={16} />
                <span>Videos</span>
              </button>
            </div>
          )}
        </div>

        {/* Text input */}
        <input
          className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isSending}
        />

        {/* Send */}
        <button
          className="ml-1 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
