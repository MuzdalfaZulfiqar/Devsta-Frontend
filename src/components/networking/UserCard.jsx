// import React from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { UserPlus, Check, X } from "lucide-react";
// import { useRoleMap } from "../../hooks/useRoleMap";
// import { useConnections } from "../../context/ConnectionContext";

// function getSkillColor(skill) {
//   const colors = ["#e6f4f1"];
//   let hash = 0;
//   for (let i = 0; i < skill.length; i++) {
//     hash = skill.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// }

// export default function UserCard({ user, onClick, actionButtons, compact = false, simple = false, active = false }) {
//   const { formatRole } = useRoleMap();
//   const { connections, updateConnection } = useConnections();
//   const c = connections[user._id] || user.connection || { connectionStatus: "none" };

//   const handleConnect = async (e, actionType) => {
//     e.stopPropagation();
//     try {
//       await updateConnection(user._id, actionType);
//     } catch (err) {
//       console.error("UserCard handleConnect error:", err);
//     }
//   };

//   const cardCls = (compact
//     ? "flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md cursor-pointer min-w-0"
//     : "flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-lg cursor-pointer")
//     + (active ? " bg-primary/20 border-l-4 border-primary" : "");

//   const avatarSize = compact ? 40 : 50;

//   const btnCls = compact
//     ? "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-xl shadow-sm whitespace-nowrap"
//     : "flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl shadow-md";

//   const connectBtnCls = `${btnCls} bg-primary text-white hover:bg-primary/90`;
//   const acceptBtnCls = `${btnCls} bg-green-600 text-white hover:bg-green-700`;
//   const ignoreBtnCls = `${btnCls} bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
//   const requestedBtnCls = `${btnCls} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 cursor-default`;
//   const cancelBtnCls = `${btnCls} bg-red-500 text-white hover:bg-red-600`;
//   const connectedBtnCls = compact
//     ? "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
//     : "flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default shadow-sm";

//   return (
//     <div className={cardCls}>
//       <div className="flex items-center gap-3 flex-1 min-w-0" onClick={onClick}>
//         <DevstaAvatar user={user} size={avatarSize} className="shadow-sm flex-shrink-0" />
//         <div className="flex flex-col min-w-0">
//           <h3 className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${compact ? "text-sm" : "text-[0.94rem]"}`}>
//             {user?.name || "Unknown User"}
//           </h3>
//           <p className={`text-gray-400 text-[14px] font-semibold dark:text-gray-400 truncate ${compact ? "text-xs" : "text-[0.86rem]"}`}>
//             {formatRole(user?.primaryRole)}
//           </p>
//           {!compact && !simple && Array.isArray(user?.topSkills) && user.topSkills.length > 0 && (
//             <div className="flex gap-2 flex-wrap mt-1">
//               {user.topSkills.slice(0, 5).map((skill, i) => {
//                 const clean = skill.startsWith("custom:") ? skill.replace("custom:", "").replace(/-/g, " ") : skill;
//                 return (
//                   <span
//                     key={i}
//                     className="text-[0.78rem] px-3 py-1 rounded-full font-medium"
//                     style={{ backgroundColor: getSkillColor(clean), color: "#111827" }}
//                   >
//                     {clean}
//                   </span>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="flex-shrink-0 flex gap-2">
  

//         {!simple && (
//           <div className="flex-shrink-0 flex gap-2">
//             {actionButtons ? (
//               <div className="flex gap-2">{actionButtons}</div>
//             ) : (
//               <>
//                 {["none", "cancelled", "declined"].includes(c.connectionStatus) && (
//                   <button className={connectBtnCls} onClick={(e) => handleConnect(e, "connect")}>
//                     <UserPlus size={14} /> Connect
//                   </button>
//                 )}
//                 {c.connectionStatus === "pending_sent" && (
//                   <div className="flex gap-2">
//                     <button className={requestedBtnCls} disabled>
//                       Requested
//                     </button>
//                     <button className={cancelBtnCls} onClick={(e) => handleConnect(e, "cancel")}>
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//                 {c.connectionStatus === "pending_received" && (
//                   <div className="flex gap-2">
//                     <button className={acceptBtnCls} onClick={(e) => handleConnect(e, "accept")}>
//                       <Check size={14} /> Accept
//                     </button>
//                     <button className={ignoreBtnCls} onClick={(e) => handleConnect(e, "ignore")}>
//                       <X size={14} /> Ignore
//                     </button>
//                   </div>
//                 )}
//                 {c.connectionStatus === "accepted" && (
//                   <button className={connectedBtnCls} disabled>
//                     Connected
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }


import React from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { UserPlus, Check, X } from "lucide-react";
import { useRoleMap } from "../../hooks/useRoleMap";
import { useConnections } from "../../context/ConnectionContext";

function getSkillColor(skill) {
  const colors = ["#e6f4f1"];
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function UserCard({
  user,
  onClick,
  actionButtons,
  compact = false,
  simple = false,
  active = false,
  unreadCount = 0, // ✅ NEW: unread count (for messaging)
}) {
  const { formatRole } = useRoleMap();
  const { connections, updateConnection } = useConnections();
  const c =
    connections[user._id] || user.connection || { connectionStatus: "none" };

  const handleConnect = async (e, actionType) => {
    e.stopPropagation();
    try {
      await updateConnection(user._id, actionType);
    } catch (err) {
      console.error("UserCard handleConnect error:", err);
    }
  };

  const cardCls =
    (compact
      ? "flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md cursor-pointer min-w-0"
      : "flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-lg cursor-pointer") +
    (active ? " bg-primary/20 border-l-4 border-primary" : "");

  const avatarSize = compact ? 40 : 50;

  const btnCls = compact
    ? "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-xl shadow-sm whitespace-nowrap"
    : "flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl shadow-md";

  const connectBtnCls = `${btnCls} bg-primary text-white hover:bg-primary/90`;
  const acceptBtnCls = `${btnCls} bg-green-600 text-white hover:bg-green-700`;
  const ignoreBtnCls = `${btnCls} bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
  const requestedBtnCls = `${btnCls} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 cursor-default`;
  const cancelBtnCls = `${btnCls} bg-red-500 text-white hover:bg-red-600`;
  const connectedBtnCls = compact
    ? "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
    : "flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default shadow-sm";

  return (
    <div className={cardCls}>
      {/* Left: avatar + name + skills */}
      <div className="flex items-center gap-3 flex-1 min-w-0" onClick={onClick}>
        <DevstaAvatar
          user={user}
          size={avatarSize}
          className="shadow-sm flex-shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <h3
            className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${
              compact ? "text-sm" : "text-[0.94rem]"
            }`}
          >
            {user?.name || "Unknown User"}
          </h3>
          <p
            className={`text-gray-400 text-[14px] font-semibold dark:text-gray-400 truncate ${
              compact ? "text-xs" : "text-[0.86rem]"
            }`}
          >
            {formatRole(user?.primaryRole)}
          </p>

          {!compact &&
            !simple &&
            Array.isArray(user?.topSkills) &&
            user.topSkills.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-1">
                {user.topSkills.slice(0, 5).map((skill, i) => {
                  const clean = skill.startsWith("custom:")
                    ? skill.replace("custom:", "").replace(/-/g, " ")
                    : skill;
                  return (
                    <span
                      key={i}
                      className="text-[0.78rem] px-3 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: getSkillColor(clean),
                        color: "#111827",
                      }}
                    >
                      {clean}
                    </span>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Right: unread badge + connection buttons */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* ✅ Unread badge (used in messaging list) */}
        {unreadCount > 0 && (
          <span className="min-w-[20px] px-2 py-[2px] text-[11px] rounded-full bg-primary text-white text-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Connection buttons (hidden when `simple` = true, e.g. in messaging) */}
        {!simple && (
          <div className="flex-shrink-0 flex gap-2">
            {actionButtons ? (
              <div className="flex gap-2">{actionButtons}</div>
            ) : (
              <>
                {["none", "cancelled", "declined"].includes(
                  c.connectionStatus
                ) && (
                  <button
                    className={connectBtnCls}
                    onClick={(e) => handleConnect(e, "connect")}
                  >
                    <UserPlus size={14} /> Connect
                  </button>
                )}

                {c.connectionStatus === "pending_sent" && (
                  <div className="flex gap-2">
                    <button className={requestedBtnCls} disabled>
                      Requested
                    </button>
                    <button
                      className={cancelBtnCls}
                      onClick={(e) => handleConnect(e, "cancel")}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {c.connectionStatus === "pending_received" && (
                  <div className="flex gap-2">
                    <button
                      className={acceptBtnCls}
                      onClick={(e) => handleConnect(e, "accept")}
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      className={ignoreBtnCls}
                      onClick={(e) => handleConnect(e, "ignore")}
                    >
                      <X size={14} /> Ignore
                    </button>
                  </div>
                )}

                {c.connectionStatus === "accepted" && (
                  <button className={connectedBtnCls} disabled>
                    Connected
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
