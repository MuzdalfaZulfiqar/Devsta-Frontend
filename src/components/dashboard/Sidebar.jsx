import { Home, Github, LogOut } from "lucide-react";

export default function Sidebar({ onLogout }) {
  return (
    <div className="bg-black text-white w-64 min-h-screen p-6 flex flex-col font-fragment">
      <h1 className="text-2xl font-bold mb-8 text-primary">DevSta</h1>

      <nav className="flex-1 space-y-3">
        <a
          href="/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition"
        >
          <Home size={20} />
          <span>Dashboard</span>
        </a>
        <a
          href="/dashboard/github"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition"
        >
          <Github size={20} />
          <span>GitHub</span>
        </a>
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 p-3 rounded-xl bg-primary hover:opacity-90 transition mt-6"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
