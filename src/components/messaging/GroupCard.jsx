// import { Users } from "lucide-react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";

// export default function GroupCard({ group, currentUserId, active, onClick }) {
//   // Clean participants: remove current user, duplicates, missing names
//   const uniqueParticipants = Array.from(
//     new Map(
//       group.participants
//         .filter(p => p && p._id && p._id !== currentUserId && p.name)
//         .map(p => [p._id, p])
//     ).values()
//   );

//   const visible = uniqueParticipants.slice(0, 3);
//   const extraCount = uniqueParticipants.length - visible.length;

//   const cardCls = `flex items-center p-4 rounded-2xl border border-gray-200 
//     dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md cursor-pointer min-w-0 
//     ${active ? "bg-primary/20 border-l-4 border-primary" : ""}`;

//   return (
//     <div className={cardCls} onClick={onClick}>
      
//       {/* Avatar Cluster / Fallback Icon */}
//       <div className="flex -space-x-2 mr-3">
//         {visible.length > 0 ? (
//           <>
//             {visible.map(user => (
//               <DevstaAvatar key={user._id} user={user} size={30} />
//             ))}

//             {extraCount > 0 && (
//               <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 text-xs font-semibold text-gray-800 dark:text-gray-200">
//                 +{extraCount}
//               </div>
//             )}
//           </>
//         ) : (
//           // Fallback generic group icon
//           <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
//             <Users size={18} className="text-gray-700 dark:text-gray-200" />
//           </div>
//         )}
//       </div>

//       {/* Group Name + Members Count */}
//       <div className="flex flex-col truncate flex-1 min-w-0">
//         <span className="font-semibold truncate">{group.name}</span>
//         <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
//           {group.participants.length} members
//         </span>
//       </div>
//     </div>
//   );
// }



import { Users } from "lucide-react";
import DevstaAvatar from "../dashboard/DevstaAvatar";

export default function GroupCard({
  group,
  currentUserId,
  active,
  onClick,
  unreadCount = 0,
}) {
  // Clean participants: remove current user, duplicates, missing names
  const uniqueParticipants = Array.from(
    new Map(
      group.participants
        .filter((p) => p && p._id && p._id !== currentUserId && p.name)
        .map((p) => [p._id, p])
    ).values()
  );

  const visible = uniqueParticipants.slice(0, 3);
  const extraCount = uniqueParticipants.length - visible.length;

  const cardCls = `flex items-center p-4 rounded-2xl border border-gray-200 
    dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md cursor-pointer min-w-0 
    ${active ? "bg-primary/20 border-l-4 border-primary" : ""}`;

  return (
    <div className={cardCls} onClick={onClick}>
      {/* Avatar Cluster / Fallback Icon */}
      <div className="flex -space-x-2 mr-3">
        {visible.length > 0 ? (
          <>
            {visible.map((user) => (
              <DevstaAvatar key={user._id} user={user} size={30} />
            ))}

            {extraCount > 0 && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 text-xs font-semibold text-gray-800 dark:text-gray-200">
                +{extraCount}
              </div>
            )}
          </>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <Users size={18} className="text-gray-700 dark:text-gray-200" />
          </div>
        )}
      </div>

      {/* Group Name + Members Count */}
      <div className="flex flex-col truncate flex-1 min-w-0">
        <span className="font-semibold truncate">{group.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {group.participants.length} members
        </span>
      </div>

      {/* 🔵 Unread badge */}
      {unreadCount > 0 && (
        <div className="ml-3 flex items-center justify-center">
          <span className="min-w-[20px] px-2 py-1 text-xs rounded-full bg-primary text-white text-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </div>
      )}
    </div>
  );
}
