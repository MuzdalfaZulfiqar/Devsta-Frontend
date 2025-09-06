import {
  Home,
  Users,
  BookOpen,
  Briefcase,
  DollarSign,
  Trophy,
  Code2,
  FileText,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen, onLogout }) {
  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Community", icon: Users, href: "/dashboard/community" },
    { label: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
    { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
    { label: "Monetization", icon: DollarSign, href: "/dashboard/monetization" },
    { label: "Hackathons", icon: Trophy, href: "/dashboard/hackathons" },
    { label: "Interview Prep", icon: Code2, href: "/dashboard/interview" },
    { label: "Portfolio", icon: FileText, href: "/dashboard/portfolio" },
  ];

  return (
   <div
  className={`fixed top-0 left-0 h-full w-56 bg-black text-white flex flex-col 
    border-r border-gray-800
    transform transition-transform duration-300 z-50
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0`}
>

      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
        onClick={() => setIsOpen(false)}
      >
        <X size={22} />
      </button>

      {/* Logo */}
    {/* Logo */}
<div className="px-6 py-2 border-b border-gray-800 flex items-center justify-left">
  <img 
    src="/devsta-logo.png" 
    alt="Devsta Logo" 
    className="h-16 w-auto" 
  />
</div>


      {/* Nav */}
      <nav className="flex-1 mt-4">
        {menuItems.map(({ label, icon: Icon, href }) => (
          <NavLink
            key={label}
            to={href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm font-medium relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md"></span>
                )}
                <Icon
                  size={18}
                  className={isActive ? "text-primary" : "text-gray-400"}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 px-4 py-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full text-sm px-2 py-2 rounded-md transition text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
