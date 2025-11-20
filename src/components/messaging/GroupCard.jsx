import React from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";

export default function GroupCard({ group, currentUserId, active, onClick }) {
  // Show first 3 participant avatars excluding current user
  const otherParticipants = group.participants.filter(p => p._id !== currentUserId).slice(0, 3);

  // Card classes like UserCard
  const cardCls = `flex items-center p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md cursor-pointer min-w-0 ${
    active ? "bg-primary/20 border-l-4 border-primary" : ""
  }`;

  return (
    <div className={cardCls} onClick={onClick}>
      {/* Avatars */}
      <div className="flex -space-x-2 mr-3">
        {otherParticipants.map((user) => (
          <DevstaAvatar key={user._id} user={user} size={30} />
        ))}
      </div>

      {/* Group info */}
      <div className="flex flex-col truncate flex-1 min-w-0">
        <span className="font-semibold truncate">{group.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {group.participants.length} members
        </span>
      </div>
    </div>
  );
}
