// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar, { NotificationBell } from "./Topbar";
// import { useNotifications } from "../../context/NotificationContext";

// export default function DashboardLayout({ user, children }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const { notifications, removeNotification } = useNotifications();

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
//         {/* Topbar (desktop + mobile) */}
//         <div className="sticky top-0 z-40">
//           {/* Desktop Topbar */}
//           <div className="hidden lg:block">
//             <Topbar user={user} />
//           </div>

//           {/* Mobile Topbar */}
//           <div className="bg-black border-b border-gray-800 p-4 flex items-center justify-between lg:hidden">
//             {/* Logo */}
//             <img src="/devsta-logo.png" alt="Devsta Logo" className="h-11" />

//             {/* Right side (bell + hamburger) */}
//             <div className="flex items-center gap-4">
//               {/* 🔔 Notification bell */}
//               <div className="flex items-center justify-center top-[4px]">
//                 <NotificationBell
//                   notifications={notifications}
//                   removeNotification={removeNotification}
//                 />
//               </div>

//               {/* ☰ Hamburger */}
//               <button
//                 onClick={() => setIsOpen(true)}
//                 className="text-white text-2xl leading-none flex items-center justify-center"
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
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ user, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, removeNotification } = useNotifications();
const { logoutUser } = useAuth();
  
  const handleLogout = () => {
    logoutUser(); // clears state, localStorage, and navigates to login
  };

  return (
    <div className="flex w-full min-h-screen bg-black text-white font-fragment">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLogout={handleLogout}
        user={user}
      />

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-56">
        {/* Topbar */}
        <div className="sticky top-0 z-40">
          {/* Desktop Topbar */}
          <div className="hidden lg:block">
            <Topbar user={user} />
          </div>

          {/* Mobile Topbar */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-black">
            <img src="/devsta-logo.png" alt="Devsta Logo" className="h-11" />
            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                removeNotification={removeNotification}
              />
              <button
                onClick={() => setIsOpen(true)}
                className="text-white text-2xl flex items-center justify-center"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
