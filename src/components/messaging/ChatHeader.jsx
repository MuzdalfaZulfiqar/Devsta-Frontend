// import React from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { useRoleMap } from "../../hooks/useRoleMap";
// import { useNavigate } from "react-router-dom";

// export default function ChatHeader({ user, group }) {
//   const { formatRole } = useRoleMap();
//   const navigate = useNavigate();

//   if (!user && !group) return null;

//   // Direct chat click
//   const goToPublicProfile = () => {
//     if (user) navigate(`/dashboard/community/${user._id}`);
//   };

//   return (
//     <div
//       className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] sticky top-0 z-10 cursor-pointer"
//       onClick={goToPublicProfile}
//     >
//       {/* Avatar(s) */}
//       {user && <DevstaAvatar user={user} size={50} className="flex-shrink-0" />}

//       {group && (
//   <div className="flex -space-x-2">
//     {group.participants
//       .filter((p) => p._id !== JSON.parse(localStorage.getItem("devsta_user") || "{}")._id)
//       .slice(0, 3)
//       .map((member) => (
//         <DevstaAvatar key={member._id} user={member} size={40} />
//       ))}

//     {group.participants.length - 1 > 3 && (
//       <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-semibold text-gray-900 dark:text-gray-200">
//         +{group.participants.length - 4}
//       </div>
//     )}
//   </div>
// )}


//       {/* Name and info */}
//       <div className="flex flex-col min-w-0">
//         <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
//           {user ? user.name : group.name}
//         </span>
//         <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
//           {user
//             ? formatRole(user.primaryRole)
//             : `${group.participants.length} member${group.participants.length > 1 ? "s" : ""}`}
//         </span>
//       </div>
//     </div>
//   );
// }


import React from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { useRoleMap } from "../../hooks/useRoleMap";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi"; // Using react-icons for settings

export default function ChatHeader({ user, group, onOpenGroupSettings }) {
  const { formatRole } = useRoleMap();
  const navigate = useNavigate();

  if (!user && !group) return null;

  // Direct chat click
  const goToPublicProfile = () => {
    if (user) navigate(`/dashboard/community/${user._id}`);
  };

  return (
    <div
      className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] sticky top-0 z-10 cursor-pointer"
      onClick={goToPublicProfile}
    >
      {/* Avatar(s) */}
      {user && <DevstaAvatar user={user} size={50} className="flex-shrink-0" />}

      {group && (
        <div className="flex -space-x-2">
          {group.participants
            .filter(
              (p) =>
                p._id !==
                JSON.parse(localStorage.getItem("devsta_user") || "{}")._id
            )
            .slice(0, 3)
            .map((member) => (
              <DevstaAvatar key={member._id} user={member} size={40} />
            ))}

          {group.participants.length - 1 > 3 && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-semibold text-gray-900 dark:text-gray-200">
              +{group.participants.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Name and info */}
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
          {user ? user.name : group.name}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
          {user
            ? formatRole(user.primaryRole)
            : `${group.participants.length} member${
                group.participants.length > 1 ? "s" : ""
              }`}
        </span>
      </div>

      {/* Settings button */}
      {group && (
        <button
          className="ml-auto p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering goToPublicProfile
            onOpenGroupSettings?.();
          }}
        >
          <FiSettings size={20} />
        </button>
      )}
    </div>
  );
}
