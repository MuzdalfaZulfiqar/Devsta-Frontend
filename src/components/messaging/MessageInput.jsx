// import { useState } from "react";
// import { Send } from "lucide-react";

// export default function MessageInput({ onSend }) {
//   const [text, setText] = useState("");

//   const handleSend = () => {
//     if (!text.trim()) return;
//     onSend(text);
//     setText("");
//   };

//   return (
//     <div className="flex items-center p-3 bg-white rounded-b-2xl">
//       <input
//         className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
//         placeholder="Type a message..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && handleSend()}
//       />

//       <button
//         className="ml-3 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
//         onClick={handleSend}
//       >
//         <Send size={18} />
//       </button>
//     </div>
//   );
// }

import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() && !file) return; // nothing to send

    onSend({
      text: text.trim(),
      file,
    });

    setText("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="flex items-center p-3 bg-white dark:bg-[#0a0a0a] rounded-b-2xl gap-2">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
      />

      {/* Attach button */}
      <button
        type="button"
        className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip size={18} />
      </button>

      {/* Text input */}
      <div className="flex-1 flex flex-col">
        <input
          className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />

        {/* Small file name preview */}
        {file && (
          <span className="mt-1 text-[11px] text-gray-500 truncate">
            Attached: {file.name}
          </span>
        )}
      </div>

      {/* Send button */}
      <button
        className="ml-1 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
        onClick={handleSend}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
