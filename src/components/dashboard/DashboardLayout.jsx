import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ user, children }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
