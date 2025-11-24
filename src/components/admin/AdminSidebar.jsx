import { Users, FileText, Home, Settings, X, LogOut, MessageCircle, BarChart3, Speaker } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar({ isOpen, setIsOpen, onLogout }) {
  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Posts", icon: FileText, href: "/admin/posts" },
    { label: "Reports", icon: BarChart3, href: "/admin/reports" }, // ✅ Added Reports
    { label: "Announcements", icon: Speaker, href: "/admin/announcements" }, // ✅ Added Reports
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-56 bg-white dark:bg-black border-r border-primary/20 text-black dark:text-white flex flex-col transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
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
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2 space-y-1">
        {menuItems.map(({ label, icon: Icon, href }) => (
          <NavLink
            key={label}
            to={href}
            end={href === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-[0.95rem] font-semibold relative transition-all ${
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

      {/* Logout */}
      <div
        className="border-t border-primary/20 px-4 py-4 cursor-pointer hover:bg-primary/5 transition-all mt-auto flex items-center gap-3"
        onClick={onLogout}
      >
        <LogOut size={18} />
        <span className="text-sm font-semibold text-red-500">Logout</span>
      </div>
    </div>
  );
}
