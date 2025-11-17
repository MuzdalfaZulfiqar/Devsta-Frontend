import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center p-3 bg-white rounded-b-2xl">
      <input
        className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        className="ml-3 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
        onClick={handleSend}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
