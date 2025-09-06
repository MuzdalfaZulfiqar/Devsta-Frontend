import { useState } from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ user, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} onLogout={handleLogout} />

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 lg:ml-56`}>
        {/* Topbar (mobile only) */}
        <div className="bg-black border-b border-gray-800 p-4 flex items-center justify-between lg:hidden">
          {/* <h1 className="font-bold text-white">DevSta</h1> */}
           <img src="/devsta-logo.png" alt="Devsta Logo" className="h-10" />
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-2xl leading-none"
          >
            ☰
          </button>
        </div>

        {/* Page content */}
        <main className="p-4 bg-gray-950 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
