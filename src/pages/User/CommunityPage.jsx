import { Outlet, NavLink } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

export default function CommunityPage() {
  const { user } = useAuth();

  const Tab = ({ to, label }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 text-[14px] font-[600] border-b-2 
        ${isActive ? "text-primary border-primary" : "text-gray-500 border-transparent"}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col w-full h-full">

        {/* Tabs */}
        <div className="flex gap-6 pt-0.5 pb-0 py-1 border-b border-primary/20">

          <Tab to="/dashboard/community" label="Explore" />
          <Tab to="/dashboard/community/feed" label="Feed" />
          <Tab to="/dashboard/community/connections" label="Connections" />
          <Tab to="/dashboard/community/messaging" label="Messaging" />
          <Tab to="/dashboard/community/notifications" label="Notifications" />

        </div>

        {/* CONTENT */}
        <main className="flex-1 px-4 py-4 overflow-hidden">
          <Outlet />
        </main>

      </div>
    </DashboardLayout>
  );
}
