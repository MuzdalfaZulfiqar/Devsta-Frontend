// export default function Topbar({ user }) {
//   return (
//     <div className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800 font-fragment">
//       <h2 className="text-xl font-semibold">Dashboard</h2>
//       <div className="flex items-center gap-3">
//         <span className="hidden md:block">{user?.name}</span>
//         {user?.avatar_url && (
//           <img
//             src={user.avatar_url}
//             alt="avatar"
//             className="w-10 h-10 rounded-full border border-gray-200"
//           />
//         )}
//       </div>
//     </div>
//   );
// }


// import { Bell, X, User } from "lucide-react";
// import { useState } from "react";
// import { useNotifications } from "../../context/NotificationContext";

// export default function Topbar({ user }) {
//   const { notifications, removeNotification } = useNotifications();
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="bg-black text-white px-6 h-16 flex justify-between items-center border-b border-gray-800 font-fragment">
//       <h2 className="text-xl font-semibold"></h2>

//       <div className="flex items-center gap-4 relative">
//         {/* 🔔 Notification Bell */}
//         <button
//           onClick={() => setOpen((p) => !p)}
//           className="relative focus:outline-none"
//         >
//           <Bell className="w-6 h-6 text-gray-300 hover:text-white" />
//           {notifications.length > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1">
//               {notifications.length}
//             </span>
//           )}
//         </button>

//         {/* 📩 Dropdown */}
//         {open && (
//           <div className="absolute right-0 top-12 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
//             {notifications.length === 0 ? (
//               <p className="p-4 text-sm text-gray-400">No notifications</p>
//             ) : (
//               <ul className="max-h-60 overflow-y-auto">
//                 {notifications.map((n) => (
//                   <li
//                     key={n.id}
//                     className="flex justify-between items-start p-3 border-b border-gray-800 text-sm"
//                   >
//                     <div className="flex-1 text-gray-200">
//                       <p>{n.message}</p>
//                       {n.action && (
//                         <button
//                           onClick={n.action.onClick}
//                           className="text-primary text-xs mt-1 hover:underline"
//                         >
//                           {n.action.label}
//                         </button>
//                       )}
//                     </div>
//                     <button
//                       onClick={() => removeNotification(n.id)}
//                       className="ml-2 text-gray-500 hover:text-white"
//                     >
//                       <X size={14} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}

//         {/* 👤 User Avatar or Default Icon */}
//         {user?.avatar_url ? (
//           <img
//             src={user.avatar_url}
//             alt="avatar"
//             className="w-10 h-10 rounded-full border border-gray-200"
//           />
//         ) : (
//           <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 bg-gray-800">
//             <User className="w-6 h-6 text-gray-400" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { Bell, X } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";

export default function Topbar() {
  const { notifications, removeNotification } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black text-white px-6 h-16 flex justify-end items-center border-b border-gray-800 font-fragment">
      <NotificationBell
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  );
}

/* 🔔 Reusable Notification Bell (for desktop + mobile) */
export function NotificationBell({ notifications, removeNotification }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative focus:outline-none"
      >
        <Bell className="w-6 h-6 text-gray-300 hover:text-white" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">No notifications</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="flex justify-between items-start p-3 border-b border-gray-800 text-sm"
                >
                  <div className="flex-1 text-gray-200">
                    <p>{n.message}</p>
                    {n.action && (
                      <button
                        onClick={n.action.onClick}
                        className="text-primary text-xs mt-1 hover:underline"
                      >
                        {n.action.label}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => removeNotification(n.id)}
                    className="ml-2 text-gray-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
