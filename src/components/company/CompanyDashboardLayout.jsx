import { useState } from "react";
import CompanySidebar from "./CompanySidebar";
import CompanyTopbar from "./CompanyTopbar";
import { useCompanyAuth } from "../../context/CompanyAuthContext";

export default function CompanyDashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useCompanyAuth();

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-fragment">
      {/* Sidebar */}
      <CompanySidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLogout={logout}
      />

      {/* Overlay */}
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
          <div className="hidden lg:block">
            <CompanyTopbar />
          </div>
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-primary/20">
            <h1 className="text-lg font-bold">Recruiter Panel</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}
