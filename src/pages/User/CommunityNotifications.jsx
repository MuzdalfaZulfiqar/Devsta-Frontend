// // src/pages/User/CommunityNotifications.jsx
// import React from "react";
// import { Bell } from "lucide-react";

// export default function CommunityNotifications() {
//   // Sample notifications
//   const notifications = [
//     { id: 1, message: "John Doe started following you.", time: "2h ago" },
//     { id: 2, message: "Jane Smith liked your skill post.", time: "5h ago" },
//     { id: 3, message: "New developer added React to their profile.", time: "1d ago" },
//   ];

//   if (notifications.length === 0) {
//     return <p className="text-gray-500 text-center py-10">No notifications yet.</p>;
//   }

//   return (
//     <div className="space-y-4">
//       {notifications.map((n) => (
//         <div
//           key={n.id}
//           className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
//         >
//           <Bell size={24} className="text-primary" />
//           <div className="flex-1">
//             <p className="text-gray-700">{n.message}</p>
//             <span className="text-gray-400 text-sm">{n.time}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



// src/pages/User/CommunityNotifications.jsx
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { fetchNotifications } from "../../api/notifications";

export default function CommunityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const items = await fetchNotifications();
      setNotifications(items);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500 text-center py-10">
        Loading notifications...
      </p>
    );
  }

  if (!notifications.length) {
    return (
      <p className="text-gray-500 text-center py-10">
        No notifications yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((n) => (
        <div
          key={n._id}
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Bell size={24} className="text-primary" />
          <div className="flex-1">
            <p className="text-gray-700">{n.text}</p>
            <span className="text-gray-400 text-sm">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
