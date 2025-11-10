// import React, { useEffect, useState } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { UserPlus, Check } from "lucide-react";
// import { fetchRoles } from "../../api/roles"; // ⬅ import fetchRoles
// import { useNavigate } from "react-router-dom";

// /* Generate a soft color based on skill name */
// function getSkillColor(skill) {
//   const colors = [
//     "#E0F7FA", "#FFF3E0", "#F3E5F5", "#E8F5E9",
//     "#FFFDE7", "#E1F5FE", "#FBE9E7", "#FCE4EC",
//     "#EDE7F6", "#F1F8E9"
//   ];
//   let hash = 0;
//   for (let i = 0; i < skill.length; i++) {
//     hash = skill.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// }

// export default function UserCard({ user, onConnect, onViewProfile }) {
//   const navigate = useNavigate();
//   const [roleMap, setRoleMap] = useState({});

//   // Fetch roles on mount
//   useEffect(() => {
//     fetchRoles().then((roles) => {
//       const map = {};
//       roles.forEach((r) => (map[r.key.toLowerCase()] = r.label));
//       setRoleMap(map);
//     });
//   }, []);

//   const formatRole = (role) => {
//     if (!role) return "Developer";
//     if (roleMap[role.toLowerCase()]) return roleMap[role.toLowerCase()];
//     // fallback for custom roles
//     return role.replace(/-/g, " ").replace(/^custom:/i, "");
//   };

//   const handleCardClick = () => navigate(`/community/profile/${user._id}`);
//   const handleConnect = (e) => {
//     e.stopPropagation();
//     if (onConnect) onConnect(user);
//   };
//   return (
//     <div
//       onClick={() => onViewProfile && onViewProfile(user)}
//       className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] 
//                  shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//     >
//       {/* Left: Avatar + Info */}
//       <div className="flex items-center gap-4">
//         <DevstaAvatar user={user} size={50} className="shadow-sm" />
//         <div className="flex flex-col">
//           <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[0.94rem]">
//             {user?.name || "Unknown User"}
//           </h3>
//           <p className="text-[0.86rem] text-gray-500 dark:text-gray-400 mb-1">
//             {formatRole(user?.primaryRole)}
//           </p>

//           {/* Skills */}
//           {Array.isArray(user?.topSkills) && user.topSkills.length > 0 && (
//             <div className="flex gap-2 flex-wrap mt-1">
//               {user.topSkills.slice(0, 5).map((skill, index) => {
//                 const cleanSkill = skill.startsWith("custom:")
//                   ? skill.replace("custom:", "").replace(/-/g, " ")
//                   : skill;
//                 return (
//                   <span
//                     key={index}
//                     className="text-[0.78rem] px-3 py-1 rounded-full font-medium"
//                     style={{
//                       backgroundColor: getSkillColor(cleanSkill),
//                       color: "#111827", // dark text for readability
//                     }}
//                   >
//                     {cleanSkill}
//                   </span>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right: Connect Button */}
//       {user?.isConnected ? (
//         <button
//           disabled
//           className="flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default shadow-sm"
//         >
//           <Check size={16} /> Connected
//         </button>
//       ) : (
//         <button
//           onClick={handleClick}
//           className="flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-primary text-white 
//                      hover:bg-primary/90 transition-all duration-200 shadow-md"
//         >
//           <UserPlus size={16} /> Connect
//         </button>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { UserPlus, Check } from "lucide-react";
// import { fetchRoles } from "../../api/roles";
// import { useNavigate } from "react-router-dom";

// /* Generate a soft color based on skill name */
// function getSkillColor(skill) {
//   const colors = [
//      "#e6f4f1"
//   ];
//   let hash = 0;
//   for (let i = 0; i < skill.length; i++) {
//     hash = skill.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// }

// export default function UserCard({ user, onConnect }) {
//   const navigate = useNavigate();
//   const [roleMap, setRoleMap] = useState({});

//   // Fetch roles on mount
//   useEffect(() => {
//     fetchRoles().then((roles) => {
//       const map = {};
//       roles.forEach((r) => (map[r.key.toLowerCase()] = r.label));
//       setRoleMap(map);
//     });
//   }, []);

//   const formatRole = (role) => {
//     if (!role) return "Developer";
//     if (roleMap[role.toLowerCase()]) return roleMap[role.toLowerCase()];
//     return role.replace(/-/g, " ").replace(/^custom:/i, "");
//   };

//   // Navigate to public profile when card is clicked
//   const handleCardClick = () => navigate(`/community/profile/${user._id}`);

//   // Connect button handler (stops propagation so card click doesn't trigger)
//   const handleConnect = (e) => {
//     e.stopPropagation();
//     if (onConnect) onConnect(user);
//   };

//   return (
//     <div
//       onClick={handleCardClick}
//       className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] 
//                  shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//     >
//       {/* Left: Avatar + Info */}
//       <div className="flex items-center gap-4">
//         <DevstaAvatar user={user} size={50} className="shadow-sm" />
//         <div className="flex flex-col">
//           <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[0.94rem]">
//             {user?.name || "Unknown User"}
//           </h3>
//           <p className="text-[0.86rem] text-gray-500 dark:text-gray-400 mb-1">
//             {formatRole(user?.primaryRole)}
//           </p>

//           {/* Skills */}
//           {Array.isArray(user?.topSkills) && user.topSkills.length > 0 && (
//             <div className="flex gap-2 flex-wrap mt-1">
//               {user.topSkills.slice(0, 5).map((skill, index) => {
//                 const cleanSkill = skill.startsWith("custom:")
//                   ? skill.replace("custom:", "").replace(/-/g, " ")
//                   : skill;
//                 return (
//                   <span
//                     key={index}
//                     className="text-[0.78rem] px-3 py-1 rounded-full font-medium"
//                     style={{
//                       backgroundColor: getSkillColor(cleanSkill),
//                       color: "#111827",
//                     }}
//                   >
//                     {cleanSkill}
//                   </span>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right: Connect Button */}
//       {user?.isConnected ? (
//         <button
//           disabled
//           className="flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default shadow-sm"
//         >
//           <Check size={16} /> Connected
//         </button>
//       ) : (
//         <button
//           onClick={handleConnect}
//           className="flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-primary text-white 
//                      hover:bg-primary/90 transition-all duration-200 shadow-md"
//         >
//           <UserPlus size={16} /> Connect
//         </button>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { UserPlus, Check } from "lucide-react";
// import { fetchRoles } from "../../api/roles";

// /* Generate a soft color based on skill name */
// function getSkillColor(skill) {
//   const colors = ["#e6f4f1"];
//   let hash = 0;
//   for (let i = 0; i < skill.length; i++) {
//     hash = skill.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// }

// export default function UserCard({ user, onClick, onConnect }) {
//   const [roleMap, setRoleMap] = useState({});

//   // Fetch roles on mount
//   useEffect(() => {
//     fetchRoles().then((roles) => {
//       const map = {};
//       roles.forEach((r) => (map[r.key.toLowerCase()] = r.label));
//       setRoleMap(map);
//     });
//   }, []);

//   const formatRole = (role) => {
//     if (!role) return "Developer";
//     if (roleMap[role.toLowerCase()]) return roleMap[role.toLowerCase()];
//     return role.replace(/-/g, " ").replace(/^custom:/i, "");
//   };

//   // Connect button handler (stops propagation so card click doesn't trigger)
//   const handleConnect = (e) => {
//     e.stopPropagation();
//     if (onConnect) onConnect(user);
//   };

//   return (
//     <div
//       onClick={onClick} // <-- trigger parent click
//       className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] 
//                  shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//     >
//       {/* Left: Avatar + Info */}
//       <div className="flex items-center gap-4">
//         <DevstaAvatar user={user} size={50} className="shadow-sm" />
//         <div className="flex flex-col">
//           <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[0.94rem]">
//             {user?.name || "Unknown User"}
//           </h3>
//           <p className="text-[0.86rem] text-gray-500 dark:text-gray-400 mb-1">
//             {formatRole(user?.primaryRole)}
//           </p>

//           {/* Skills */}
//           {Array.isArray(user?.topSkills) && user.topSkills.length > 0 && (
//             <div className="flex gap-2 flex-wrap mt-1">
//               {user.topSkills.slice(0, 5).map((skill, index) => {
//                 const cleanSkill = skill.startsWith("custom:")
//                   ? skill.replace("custom:", "").replace(/-/g, " ")
//                   : skill;
//                 return (
//                   <span
//                     key={index}
//                     className="text-[0.78rem] px-3 py-1 rounded-full font-medium"
//                     style={{
//                       backgroundColor: getSkillColor(cleanSkill),
//                       color: "#111827",
//                     }}
//                   >
//                     {cleanSkill}
//                   </span>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right: Connect Button */}
//       {user?.isConnected ? (
//         <button
//           disabled
//           className="flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default shadow-sm"
//         >
//           <Check size={16} /> Connected
//         </button>
//       ) : (
//         <button
//           onClick={handleConnect}
//           className="flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-primary text-white 
//                      hover:bg-primary/90 transition-all duration-200 shadow-md"
//         >
//           <UserPlus size={16} /> Connect
//         </button>
//       )}
//     </div>
//   );
// }



// src/components/networking/UserCard.jsx
import React, { useEffect, useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { UserPlus, Check } from "lucide-react";
import { useRoleMap } from "../../hooks/useRoleMap";

function getSkillColor(skill) {
  const colors = ["#e6f4f1"];
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function UserCard({ user, onClick, onConnect, compact = false }) {



  const { formatRole } = useRoleMap();

  const handleConnect = (e) => {
    e.stopPropagation();
    onConnect?.(user);
  };

  /* -------------------------------------------------
     Layout classes – compact vs full width
  ------------------------------------------------- */
  const cardCls = compact
    ? "flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-md cursor-pointer min-w-0"
    : "flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-lg cursor-pointer";

  const avatarSize = compact ? 40 : 50;
  const btnCls = compact
    ? "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-xl bg-primary text-white hover:bg-primary/90 shadow-sm whitespace-nowrap"
    : "flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-md";

  const connectedBtnCls = compact
    ? "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
    : "flex items-center gap-1 px-5 py-2.5 text-[0.92rem] font-medium rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default shadow-sm";

  return (
    <div onClick={onClick} className={cardCls}>
      {/* Avatar + Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <DevstaAvatar user={user} size={avatarSize} className="shadow-sm flex-shrink-0" />

        <div className="flex flex-col min-w-0">
          <h3
            className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${compact ? "text-sm" : "text-[0.94rem]"
              }`}
          >
            {user?.name || "Unknown User"}
          </h3>

          <p
            className={`text-gray-400 text-[14px] font-semibold dark:text-gray-400 truncate ${compact ? "text-xs" : "text-[0.86rem]"
              }`}
          >
            {formatRole(user?.primaryRole)}
          </p>

          {/* ---------- SKILLS – hidden in compact mode ---------- */}
          {!compact && Array.isArray(user?.topSkills) && user.topSkills.length > 0 && (
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

      {/* Connect / Connected button */}
      {user?.isConnected ? (
        <button disabled className={connectedBtnCls}>
          <Check size={compact ? 14 : 16} /> Connected
        </button>
      ) : (
        <button onClick={handleConnect} className={btnCls}>
          <UserPlus size={compact ? 14 : 16} /> Connect
        </button>
      )}
    </div>
  );
}