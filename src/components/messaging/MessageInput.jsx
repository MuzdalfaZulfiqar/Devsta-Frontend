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
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={fileAccept}
        multiple
      />

      {/* Attachment preview */}
      {files.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-2">
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
                  className="flex items-center justify-between min-w-0 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-[10px] font-bold text-white flex-shrink-0 ${badgeBg}`}
                    >
                      {badgeLabel}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:text-red-600 ml-2 flex-shrink-0 transition-colors"
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
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Loader2 size={14} className="animate-spin" />
                <span>Sending…</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main input row */}
      <div className="flex items-end p-3.5 gap-3">
        {/* Attach button + menu */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            onClick={() => setShowMenu((prev) => !prev)}
            disabled={isSending}
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          {showMenu && (
            <div className="absolute bottom-14 left-0 w-44 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
              <button
                type="button"
                onClick={() => triggerFilePicker("image/*")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ImageIcon size={18} className="text-blue-500" />
                <span>Images</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700" />
              <button
                type="button"
                onClick={() => triggerFilePicker("video/*")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Video size={18} className="text-purple-500" />
                <span>Videos</span>
              </button>
            </div>
          )}
        </div>

        {/* Text input */}
        <input
          className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isSending}
        />

        {/* Send button */}
        <button
          className="flex-shrink-0 p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={isSending}
          title="Send message"
        >
          {isSending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
