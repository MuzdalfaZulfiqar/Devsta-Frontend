// import { useState } from "react";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import AllDevelopers from "../../components/networking/AllUsersWithProfile";
// import { useAuth } from "../../context/AuthContext";

// export default function CommunityPage() {
//      const { user } = useAuth(); // ⬅ get logged-in user
//   const [activeTab, setActiveTab] = useState("allDevelopers");

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "allDevelopers":
//         return <AllDevelopers />;
//       // future tabs
//       // case "connections":
//       //   return <Connections />;
//       // case "invites":
//       //   return <Invites />;
//       default:
//         return <AllDevelopers />;
//     }
//   };

//   return (
//    <DashboardLayout user={user}> 
//       <div className="flex flex-col w-full h-full">
//         {/* Internal Tabs */}
//         <div className="flex gap-4 px-4 py-2 border-b border-primary/20">
//           <button
//             onClick={() => setActiveTab("allDevelopers")}
//             className={`px-2 py-1 font-[14px] font-[700] transition-colors duration-200 ${
//               activeTab === "allDevelopers"
//                 ? "border-b-2 border-primary text-primary"
//                 : "text-gray-500 dark:text-gray-400 hover:text-primary"
//             }`}
//           >
//             All Developers
//           </button>
//           {/* future tabs */}
//           {/* <button onClick={() => setActiveTab("connections")} ...>Connections</button> */}
//         </div>

//         {/* Page content */}
//         <main className="px-4 py-4">{renderTabContent()}</main>
//       </div>
//     </DashboardLayout>
//   );
// }



// // src/pages/User/CommunityPage.jsx
// import { Outlet } from "react-router-dom";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";

// export default function CommunityPage() {
//   const { user } = useAuth();

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col w-full h-full">
//         {/* Tabs */}
//         <div className="flex gap-4 px-4 py-2 border-b border-primary/20">
//           <button className="px-2 py-1 font-[14px] font-[700] border-b-2 border-primary text-primary">
//             All Developers
//           </button>
//         </div>

//         {/* Content from nested routes */}
//         <main className="flex-1 px-4 py-4 overflow-hidden">
//           <Outlet />   {/* ← Renders AllUsersWithProfile */}
//         </main>
//       </div>
//     </DashboardLayout>
//   );
// }


// // src/pages/User/CommunityPage.jsx
// import { Outlet, useNavigate } from "react-router-dom";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";
// import { useState } from "react";
// import { Users, Bell, Compass } from "lucide-react"; // optional icons

// export default function CommunityPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("all"); // default tab

//   const tabs = [
//     { key: "all", label: "All Developers", icon: <Users size={16} /> },
//     { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
//     { key: "Feed", label: "Feed", icon: <Compass size={16} /> },
//   ];

//   const handleTabClick = (tabKey) => {
//     setActiveTab(tabKey);
//     switch(tabKey){
//       case "all":
//         navigate("/dashboard/community");
//         break;
//       case "notifications":
//         navigate("/dashboard/community/notifications");
//         break;
//       case "feed":
//         navigate("/dashboard/community/feed");
//         break;
//       default:
//         break;
//     }
//   }

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col w-full h-full">

//         {/* Tabs */}
//         <div className="flex gap-4 px-4 py-2 border-b border-primary/20">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => handleTabClick(tab.key)}
//               className={`flex items-center gap-1 px-3 py-1 font-semibold text-sm ${
//                 activeTab === tab.key
//                   ? "border-b-2 border-primary text-primary"
//                   : "text-gray-500 hover:text-primary"
//               }`}
//             >
//               {tab.icon} {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <main className="flex-1 px-4 py-4 overflow-hidden">
//           <Outlet />
//         </main>
//       </div>
//     </DashboardLayout>
//   );
// }


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
        <div className="flex gap-6 px-4 py-2 border-b border-primary/20">

          <Tab to="/dashboard/community" label="All Developers" />
          <Tab to="/dashboard/community/feed" label="Feed" />
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
