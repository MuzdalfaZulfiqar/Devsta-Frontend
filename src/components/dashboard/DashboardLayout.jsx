// import { useState } from "react";
// import Sidebar from "./Sidebar";

// export default function DashboardLayout({ user, children }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Sidebar */}
//       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} onLogout={handleLogout} />

//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//       {/* Main content */}
//       <div className={`flex-1 transition-all duration-300 lg:ml-56`}>
//         {/* Topbar (mobile only) */}
//         <div className="bg-black border-b border-gray-800 p-4 flex items-center justify-between lg:hidden">
//           {/* <h1 className="font-bold text-white">DevSta</h1> */}
//            <img src="/devsta-logo.png" alt="Devsta Logo" className="h-10" />
//           <button
//             onClick={() => setIsOpen(true)}
//             className="text-white text-2xl leading-none"
//           >
//             ☰
//           </button>
//         </div>

//         {/* Page content */}
//         <main className="p-4 bg-gray-950 min-h-screen">{children}</main>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar, { NotificationBell } from "./Topbar"; // 👈 import NotificationBell
// import { useNotifications } from "../../context/NotificationContext";

// export default function DashboardLayout({ user, children }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const { notifications, removeNotification } = useNotifications(); // 👈 get notifications for bell

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={isOpen}
//         setIsOpen={setIsOpen}
//         onLogout={handleLogout}
//         user={user}
//       />

//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Main content area */}
//       <div className={`flex-1 transition-all duration-300 lg:ml-56`}>
//         {/* ✅ Topbar (desktop + mobile) */}
//         <div className="sticky top-0 z-40">
//           {/* Desktop Topbar */}
//           <div className="hidden lg:block">
//             <Topbar user={user} />
//           </div>

//           {/* Mobile Topbar */}
//           <div className="bg-black border-b border-gray-800 p-4 flex items-center justify-between lg:hidden">
//             {/* Logo */}
//             <img src="/devsta-logo.png" alt="Devsta Logo" className="h-10" />

//             {/* Right side (notifications + menu) */}
//             <div className="flex items-center gap-4">
//               {/* 🔔 Notification bell (with red badge if count > 0) */}
//               <NotificationBell
//                 notifications={notifications}
//                 removeNotification={removeNotification}
//               />

//               {/* ☰ Menu toggle */}
//               <button
//                 onClick={() => setIsOpen(true)}
//                 className="text-white text-2xl leading-none"
//               >
//                 ☰
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Page content */}
//         <main className="p-4 bg-gray-950 min-h-screen">{children}</main>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar, { NotificationBell } from "./Topbar";
import { useNotifications } from "../../context/NotificationContext";

export default function DashboardLayout({ user, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, removeNotification } = useNotifications();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLogout={handleLogout}
        user={user}
      />

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 lg:ml-56`}>
        {/* ✅ Topbar (desktop + mobile) */}
        <div className="sticky top-0 z-40">
          {/* Desktop Topbar */}
          <div className="hidden lg:block">
            <Topbar user={user} />
          </div>

          {/* ✅ Mobile Topbar */}
<div className="bg-black border-b border-gray-800 p-4 flex items-center justify-between lg:hidden">
  {/* Logo */}
  <img src="/devsta-logo.png" alt="Devsta Logo" className="h-11" />

  {/* Right side (bell + hamburger) */}
  <div className="flex items-center gap-4">
    {/* 🔔 Notification bell */}
    <div className="flex items-center justify-center top-[4px]">
      <NotificationBell
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>

    {/* ☰ Hamburger */}
    <button
      onClick={() => setIsOpen(true)}
      className="text-white text-2xl leading-none flex items-center justify-center"
    >
      ☰
    </button>
  </div>
</div>

        </div>

        {/* Page content */}
        <main className="p-4 bg-gray-950 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
