// import { useAuth } from "../../context/AuthContext";
// import ProfileLayout from "../../components/profile/ProfileLayout";

// import GeneralInfo from "../../components/profile/tabs/GeneralInfo";
// import Skills from "../../components/profile/tabs/Skills";
// import Resume from "../../components/profile/tabs/Resume";
// import GitHub from "../../components/profile/tabs/GitHub";

// export default function ProfilePage() {
//   const { user } = useAuth();

//   const renderTabContent = (activeTab) => {
//     switch (activeTab) {
//       case "general":
//         return <GeneralInfo user={user} />;
//       case "skills":
//         return <Skills user={user} />;
//       case "resume":
//         return <Resume user={user} />;
//       case "github":
//         return <GitHub user={user} />;
//       default:
//         return null;
//     }
//   };

//   return <ProfileLayout user={user}>{renderTabContent}</ProfileLayout>;
// }


import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Overview from "../../components/profile/tabs/Overview";
// import EditProfile from "../../components/profile/tabs/EditProfile";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "overview":
        return <Overview user={user} />;
      case "edit":
        // return <EditProfile user={user} />;
      default:
        return <Overview user={user} />;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col w-full h-full">
        {/* Horizontal Tab Navbar */}
        <div className="flex gap-4 px-4 py-2">
          {["overview", "edit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-primary"
              }`}
            >
              {tab === "overview" ? "Overview" : "Edit Profile"}
            </button>
          ))}
        </div>

        {/* Page content */}
        <main className="px-4 py-4">{renderTabContent(activeTab)}</main>
      </div>
    </DashboardLayout>
  );
}
