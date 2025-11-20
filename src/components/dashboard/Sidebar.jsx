import {
  Home,
  Users,
  BookOpen,
  Briefcase,
  DollarSign,
  Code2,
  FileText,
  Settings,
  X,
  User,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import DevstaAvatar from "./DevstaAvatar";

export default function Sidebar({ isOpen, setIsOpen, onLogout, user }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Community", icon: Users, href: "/dashboard/community" },
    { label: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
    { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
    { label: "Monetization", icon: DollarSign, href: "/dashboard/monetization" },
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
              ${isActive
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
   

        <DevstaAvatar user={user} size={36} />

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
