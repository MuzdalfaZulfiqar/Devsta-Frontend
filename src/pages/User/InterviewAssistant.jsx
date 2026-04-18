// // // src/pages/User/InterviewAssistant.jsx

// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import DefineGoal from "../../components/interview/tabs/DefineGoal";
// import Roadmap from "../../components/interview/tabs/Roadmap";
// import CodingChallenge from "../../components/interview/tabs/CodingChallenge";
// import ProgressDashboard from "../../components/interview/tabs/ProgressDashboard";

// export default function InterviewAssistant() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("define");
//   const [latestRoadmap, setLatestRoadmap] = useState(null);

//   const handleRoadmapGenerated = (roadmapDoc) => {
//     setLatestRoadmap(roadmapDoc);
//     setActiveTab("roadmap");
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "define":
//         return <DefineGoal onRoadmapGenerated={handleRoadmapGenerated} />;
//       case "roadmap":
//         return (
//           <Roadmap
//             roadmapData={latestRoadmap}
//             onGoToDefine={() => setActiveTab("define")}
//             userProfile={user}
//           />
//         );
//       case "challenge":
//         return <CodingChallenge />;
//       case "progress":
//         return <ProgressDashboard />;
//       default:
//         return <DefineGoal onRoadmapGenerated={handleRoadmapGenerated} />;
//     }
//   };

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col w-full h-full">
//         <h1 className="text-2xl font-bold px-4 mb-2">Interview Assistant</h1>

//         <div className="flex gap-6 px-4 border-b border-gray-200 dark:border-gray-700">
//           {[
//             { key: "define", label: "Define Goal" },
//             { key: "roadmap", label: "Roadmap" },
//             { key: "challenge", label: "Coding Challenge" },
//             { key: "progress", label: "Progress Dashboard" },
//           ].map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`py-2 text-sm font-semibold transition relative ${
//                 activeTab === tab.key
//                   ? "border-b-2 border-primary text-primary"
//                   : "text-gray-500 hover:text-primary"
//               }`}
//             >
//               {tab.label}
//               {tab.key === "roadmap" &&
//                 latestRoadmap &&
//                 activeTab !== "roadmap" && (
//                   <span className="absolute -top-0.5 -right-2 w-2 h-2 bg-green-500 rounded-full" />
//                 )}
//             </button>
//           ))}
//         </div>

//         <div className="p-4">{renderTabContent()}</div>
//       </div>
//     </DashboardLayout>
//   );
// }


import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DefineGoal from "../../components/interview/tabs/DefineGoal";
import Roadmap from "../../components/interview/tabs/Roadmap";
import CodingChallenge from "../../components/interview/tabs/CodingChallenge";
import ProgressDashboard from "../../components/interview/tabs/ProgressDashboard";
// import MockInterview from "../../components/interview/tabs/MockInterview";

export default function InterviewAssistant() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("define");
  const [latestRoadmap, setLatestRoadmap] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [refreshPhase, setRefreshPhase] = useState(null);

  const handleRoadmapGenerated = (roadmapDoc) => {
    setLatestRoadmap(roadmapDoc);
    setActiveTab("roadmap");
  };

  // const handleSolveChallenge = (challenge) => {
  //   setSelectedChallenge(challenge);
  //   setActiveTab("challenge");
  // };
  const handleSolveChallenge = (challenge) => {
  setSelectedChallenge(challenge);
  setActiveTab("challenge");
};

  const renderTabContent = () => {
    switch (activeTab) {
      case "define":
        return <DefineGoal onRoadmapGenerated={handleRoadmapGenerated} />;
      case "roadmap":
        return (
          <Roadmap
            roadmapData={latestRoadmap}
            onGoToDefine={() => setActiveTab("define")}
            userProfile={user}
            onSolveChallenge={handleSolveChallenge}
          />
        );
      // case "challenge":
      //   return (
      //     <CodingChallenge
      //       challenge={selectedChallenge}
      //       onClose={() => {
      //         setSelectedChallenge(null);
      //         setActiveTab("roadmap");
      //       }}
      //     />
      //   );
      case "challenge":
  return (
    <CodingChallenge
      challenge={selectedChallenge}
      onClose={() => {
        setSelectedChallenge(null);
        setActiveTab("roadmap");
        setRefreshPhase(selectedChallenge?.phaseTitle); // signal roadmap to re-fetch
      }}
    />
  );
  // case "mock":
  // return (
  //   <MockInterview 
  //     userProfile={user} 
  //     roadmapData={latestRoadmap} 
  //   />
  // );
      case "progress":
        return <ProgressDashboard />;
      default:
        return <DefineGoal onRoadmapGenerated={handleRoadmapGenerated} />;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col w-full h-full">
        <h1 className="text-2xl font-bold px-4 mb-2">Interview Assistant</h1>

        <div className="flex gap-6 px-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: "define", label: "Define Goal" },
            { key: "roadmap", label: "Roadmap" },
            { key: "challenge", label: "Coding Challenge" },
            { key: "progress", label: "Progress Dashboard" },
            { key: "mock", label: "Mock Interview" }  
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 text-sm font-semibold transition relative ${
                activeTab === tab.key ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-auto">{renderTabContent()}</div>
      </div>
    </DashboardLayout>
  );
}