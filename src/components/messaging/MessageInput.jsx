// src/components/messaging/MessageInput.jsx
import { useState, useRef } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Video,
} from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
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
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    } else {
      setFile(null);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !file) return;

    onSend({
      text: trimmed,
      file,
    });

    setText("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isImage = file && file.type.startsWith("image/");
  const isVideo = file && file.type.startsWith("video/");
  const badgeLabel = isImage ? "IMG" : isVideo ? "VID" : "FILE";
  const badgeBg =
    isImage ? "bg-blue-500" : isVideo ? "bg-purple-500" : "bg-gray-500";

  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-[#0a0a0a] rounded-b-2xl">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={fileAccept}
      />

      {/* Attachment preview ABOVE input (WhatsApp style) */}
      {file && (
        <div className="px-3 pt-2">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
            <div className="flex items-center gap-3 min-w-0">
              {/* Badge for image/video */}
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
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Main input row */}
      <div className="flex items-center p-3 gap-2 relative">
        {/* Single Attach button + menu */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setShowMenu((prev) => !prev)}
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
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => triggerFilePicker("video/*")}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Video size={16} />
                <span>Video</span>
              </button>
              {/* Document option removed */}
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
        />

        {/* Send */}
        <button
          className="ml-1 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
          onClick={handleSend}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
