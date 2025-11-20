import React, { useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { X } from "lucide-react";

export default function CreateGroupModal({ connectedUsers, onCreateGroup, onClose }) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) return alert("Please enter a group name");
    if (selectedMembers.length === 0) return alert("Select at least one member");
    onCreateGroup(groupName.trim(), selectedMembers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Group</h2>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-100 dark:bg-gray-800"
        />

        {/* Members List */}
        <div className="max-h-60 overflow-y-auto mb-4">
          {connectedUsers.map((user) => {
            const isSelected = selectedMembers.includes(user._id);
            return (
              <div
                key={user._id}
                className={`flex items-center p-2 mb-1 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${isSelected ? "bg-primary/20" : ""}`}
                onClick={() => toggleMember(user._id)}
              >
                <DevstaAvatar user={user} size={36} className="mr-2" />
                <span className="text-sm">{user.name}</span>
              </div>
            );
          })}
        </div>

        <button
          className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary/90 transition"
          onClick={handleCreate}
        >
          Create Group
        </button>
      </div>
    </div>
  );
}
