import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Overview from "../../components/profile/tabs/Overview";
import EditProfile from "../../components/profile/tabs/EditProfile";
import MyPosts from "../../components/networking/MyPosts";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "overview":
        return <Overview user={user} />;
      case "edit":
        return <EditProfile user={user} />;
      case "myPosts":
        return <MyPosts />;
      default:
        return <Overview user={user} />;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col w-full h-full">
        {/* Horizontal Tab Navbar */}
        <div className="flex gap-4 px-4 py-2">
          {["overview", "edit", "myPosts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 font-[14px] font-[700] transition-colors duration-200 ${activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 dark:text-gray-400 hover:text-primary"
                }`}
            >
             {tab === "overview"
                ? "Overview"
                : tab === "edit"
                ? "Edit Profile"
                : "Manage Posts"}
            </button>
          ))}
        </div>

        {/* Page content */}
        <main className="px-4 py-4">{renderTabContent(activeTab)}</main>
      </div>
    </DashboardLayout>
  );
}
