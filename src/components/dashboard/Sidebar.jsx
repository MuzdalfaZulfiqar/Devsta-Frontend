// import {
//   Home,
//   Users,
//   BookOpen,
//   Briefcase,
//   DollarSign,
//   Trophy,
//   Code2,
//   FileText,
//   X,
//   User,
//   LogOut,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Sidebar({ isOpen, setIsOpen, onLogout, user }) {
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const menuItems = [
//     { label: "Dashboard", icon: Home, href: "/dashboard" },
//     { label: "Community", icon: Users, href: "/dashboard/community" },
//     { label: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
//     { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
//     { label: "Monetization", icon: DollarSign, href: "/dashboard/monetization" },
//     { label: "Hackathons", icon: Trophy, href: "/dashboard/hackathons" },
//     { label: "Interview Prep", icon: Code2, href: "/dashboard/interview" },
//     { label: "Portfolio", icon: FileText, href: "/dashboard/portfolio" },
//   ];

//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-56 bg-black text-white flex flex-col 
//         border-r border-gray-800
//         transform transition-transform duration-300 z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         lg:translate-x-0`}
//     >
//       {/* Close button for mobile */}
//       <button
//         className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
//         onClick={() => setIsOpen(false)}
//       >
//         <X size={22} />
//       </button>

//       {/* Logo */}
//       <div className="px-5 h-16 flex items-center border-b border-gray-800">
//         <img src="/devsta-logo.png" alt="Devsta Logo" className="h-[4.5rem] w-auto" />
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 mt-4">
//   {menuItems.map(({ label, icon: Icon, href }) => (
//     <NavLink
//       key={label}
//       to={href}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-4 py-2 text-sm font-medium relative ${
//           isActive
//             ? "bg-primary/10 text-primary"
//             : "text-gray-400 hover:text-white hover:bg-gray-800"
//         }`
//       }
//       onClick={(e) => {
//         e.preventDefault(); // ⛔ block navigation
//         setIsOpen(false);   // ✅ still close sidebar on mobile
//       }}
//     >
//       {({ isActive }) => (
//         <>
//           {isActive && (
//             <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md"></span>
//           )}
//           <Icon
//             size={18}
//             className={isActive ? "text-primary" : "text-gray-400"}
//           />
//           <span>{label}</span>
//         </>
//       )}
//     </NavLink>
//   ))}
// </nav>


//       {/* User Avatar + Dropdown */}
//       {/* User Avatar + Dropdown */}
// <div className="border-t border-gray-800 px-4 py-4 relative">
//   <button
//     onClick={() => setUserMenuOpen((p) => !p)}
//     className="flex items-center gap-2 w-full text-sm px-2 py-2 rounded-md hover:bg-gray-800"
//   >
//     {user?.avatar_url ? (
//       <img
//         src={user.avatar_url}
//         alt="avatar"
//         className="w-8 h-8 rounded-full border border-gray-200"
//       />
//     ) : (
//       <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 bg-gray-800">
//         <User size={18} className="text-gray-400" />
//       </div>
//     )}
//     <span>{user?.name || "Account"}</span>
//   </button>

//   {/* {userMenuOpen && (
//     <div className="absolute bottom-16 left-4 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
//       <button
//         className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
//         onClick={() => console.log("Go to profile")}
//       >
//         Profile
//       </button>
//       <button
//         className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
//         onClick={onLogout}
//       >
//         Logout
//       </button>
//     </div>
//   )} */}
//   {userMenuOpen && (
//     <div className="absolute bottom-16 left-4 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
//       <button
//         className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
//         onClick={() => {
//           setUserMenuOpen(false);
//           navigate("/dashboard/profile"); // <-- use navigate
//         }}
//       >
//         Profile
//       </button>
//       <button
//         className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
//         onClick={onLogout}
//       >
//         Logout
//       </button>
//     </div>
//   )}

// </div>

//     </div>
//   );
// }




// import {
//   Home,
//   Users,
//   BookOpen,
//   Briefcase,
//   DollarSign,
//   Trophy,
//   Code2,
//   FileText,
//   Settings,
//   X,
//   User,
//   LogOut,
// } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function Sidebar({ isOpen, setIsOpen, onLogout, user }) {
//   const navigate = useNavigate();

//   const menuItems = [
//     { label: "Dashboard", icon: Home, href: "/dashboard" },
//     { label: "Community", icon: Users, href: "/dashboard/community" },
//     { label: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
//     { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
//     { label: "Monetization", icon: DollarSign, href: "/dashboard/monetization" },
//     { label: "Hackathons", icon: Trophy, href: "/dashboard/hackathons" },
//     { label: "Interview Prep", icon: Code2, href: "/dashboard/interview" },
//     { label: "Portfolio", icon: FileText, href: "/dashboard/portfolio" },
//     { label: "Profile", icon: User, href: "/dashboard/profile" }, // ✅ Added above Settings
//     { label: "Settings", icon: Settings, href: "/dashboard/settings" },
//   ];

//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-56 
//         bg-white dark:bg-black 
//         border-r border-primary/20 
//         text-black dark:text-white flex flex-col
//         transform transition-transform duration-300 z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         lg:translate-x-0`}
//     >
//       {/* Close button for mobile */}
//       <button
//         className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-primary"
//         onClick={() => setIsOpen(false)}
//       >
//         <X size={22} />
//       </button>

//       {/* Logo */}
//       <div className="px-5 h-16 flex items-center border-b border-primary/20">
//         <img
//           src="/devsta-logo.png"
//           alt="Devsta Logo"
//           className="h-[4.5rem] w-auto"
//         />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 mt-4">
//         {menuItems.map(({ label, icon: Icon, href }) => (
//        <NavLink
//   key={label}
//   to={href}
//   className={({ isActive }) =>
//     `flex items-center gap-3 px-4 py-2 text-[0.95rem] font-semibold relative transition-all
//     ${
//       isActive
//         ? "bg-primary text-white font-bold shadow-sm rounded-none"
//         : "text-gray-800 dark:text-gray-200 hover:bg-primary/10 hover:text-primary rounded-md"
//     }`
//   }
//   onClick={() => setIsOpen(false)}
// >
//   <Icon size={18} className="opacity-90" />
//   <span>{label}</span>
// </NavLink>


//         ))}
//       </nav>

//       {/* ✅ User Profile Section (Kept at bottom) */}
//       <div
//         className="border-t border-primary/20 px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-all"
//         onClick={() => navigate("/dashboard/profile")}
//       >
//         {user?.avatar_url ? (
//           <img
//             src={user.avatar_url}
//             alt="avatar"
//             className="w-9 h-9 rounded-full border border-primary/30"
//           />
//         ) : (
//           <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 bg-primary/10">
//             <User size={18} className="text-primary" />
//           </div>
//         )}
//         <div className="flex flex-col leading-tight">
//           <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
//             {user?.name || "User"}
//           </span>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onLogout();
//             }}
//             className="text-xs text-red-500 hover:underline text-left"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import {
//   Home,
//   Users,
//   BookOpen,
//   Briefcase,
//   DollarSign,
//   Trophy,
//   Code2,
//   FileText,
//   Settings,
//   X,
//   User,
//   LogOut,
// } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function Sidebar({ isOpen, setIsOpen, onLogout, user }) {
//   const navigate = useNavigate();

//   const menuItems = [
//     { label: "Dashboard", icon: Home, href: "/dashboard" },
//     { label: "Community", icon: Users, href: "/dashboard/community" },
//     { label: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
//     { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
//     { label: "Monetization", icon: DollarSign, href: "/dashboard/monetization" },
//     { label: "Hackathons", icon: Trophy, href: "/dashboard/hackathons" },
//     { label: "Interview Prep", icon: Code2, href: "/dashboard/interview" },
//     { label: "Portfolio", icon: FileText, href: "/dashboard/portfolio" },
//     { label: "Profile", icon: User, href: "/dashboard/profile" }, // Above Settings
//     { label: "Settings", icon: Settings, href: "/dashboard/settings" },
//   ];

//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-56 
//         bg-white dark:bg-black 
//         border-r border-primary/20 
//         text-black dark:text-white flex flex-col
//         transform transition-transform duration-300 z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         lg:translate-x-0`}
//     >
//       {/* Close button for mobile */}
//       <button
//         className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-primary"
//         onClick={() => setIsOpen(false)}
//       >
//         <X size={22} />
//       </button>

//       {/* Logo */}
//       <div className="px-5 h-16 flex items-center border-b border-primary/20">
//         <img
//           src="/devsta-logo.png"
//           alt="Devsta Logo"
//           className="h-[4.5rem] w-auto"
//         />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 mt-4 px-2"> {/* Added padding for rounded look */}
//         {menuItems.map(({ label, icon: Icon, href }) => (
//           <NavLink
//             key={label}
//             to={href}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-2 text-[0.95rem] font-semibold relative transition-all
//               ${
//                 isActive
//                   ? "bg-primary text-white font-bold shadow-sm rounded-md" // active highlight
//                   : "text-gray-800 dark:text-gray-200 hover:bg-primary/10 hover:text-primary rounded-md"
//               }`
//             }
//             onClick={() => setIsOpen(false)}
//           >
//             <Icon size={18} className="opacity-90" />
//             <span>{label}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* User Profile Section */}
//       <div
//         className="border-t border-primary/20 px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-all mt-auto"
//         onClick={() => navigate("/dashboard/profile")}
//       >
//         {user?.avatar_url ? (
//           <img
//             src={user.avatar_url}
//             alt="avatar"
//             className="w-9 h-9 rounded-full border border-primary/30"
//           />
//         ) : (
//           <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 bg-primary/10">
//             <User size={18} className="text-primary" />
//           </div>
//         )}
//         <div className="flex flex-col leading-tight">
//           <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
//             {user?.name || "User"}
//           </span>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onLogout();
//             }}
//             className="text-xs text-red-500 hover:underline text-left"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import {
  Home,
  Users,
  BookOpen,
  Briefcase,
  DollarSign,
  Trophy,
  Code2,
  FileText,
  Settings,
  X,
  User,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ isOpen, setIsOpen, onLogout, user }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Community", icon: Users, href: "/dashboard/community" },
    { label: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
    { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
    { label: "Monetization", icon: DollarSign, href: "/dashboard/monetization" },
    { label: "Hackathons", icon: Trophy, href: "/dashboard/hackathons" },
    { label: "Interview Prep", icon: Code2, href: "/dashboard/interview" },
    { label: "Portfolio", icon: FileText, href: "/dashboard/portfolio" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-56 
        bg-white dark:bg-black 
        border-r border-primary/20 
        text-black dark:text-white flex flex-col
        transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
    >
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-primary"
        onClick={() => setIsOpen(false)}
      >
        <X size={22} />
      </button>

      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-primary/20">
        <img
          src="/devsta-logo.png"
          alt="Devsta Logo"
          className="h-[4.5rem] w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2">
        {menuItems.map(({ label, icon: Icon, href }) => (
          <NavLink
            key={label}
            to={href}
            end={href === "/dashboard"} // exact match only for main dashboard
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-[0.95rem] font-semibold relative transition-all
              ${
                isActive
                  ? "bg-primary text-white font-bold shadow-sm rounded-md"
                  : "text-gray-800 dark:text-gray-200 hover:bg-primary/10 hover:text-primary rounded-md"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <Icon size={18} className="opacity-90" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div
        className="border-t border-primary/20 px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-all mt-auto"
        onClick={() => navigate("/dashboard/profile")}
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="avatar"
            className="w-9 h-9 rounded-full border border-primary/30"
          />
        ) : (
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 bg-primary/10">
            <User size={18} className="text-primary" />
          </div>
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {user?.name || "User"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            className="text-xs text-red-500 hover:underline text-left"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
