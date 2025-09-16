// import { X, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function ProfileSidebar({ isOpen, setIsOpen, activeTab, setActiveTab, onLogout }) {
//   const navigate = useNavigate();

//   const menuItems = [
//     { label: "General Info", key: "general" },
//     { label: "Skills", key: "skills" },
//     { label: "Resume", key: "resume" },
//     { label: "GitHub", key: "github" },
//   ];

//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-56 bg-black text-white flex flex-col 
//         border-r border-gray-800
//         transform transition-transform duration-300 z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         lg:translate-x-0`}
//     >
//       {/* Close button for mobile */}
//       <button
//         className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
//         onClick={() => setIsOpen(false)}
//       >
//         <X size={22} />
//       </button>

//       {/* Logo */}
//       <div className="px-5 h-16 flex items-center border-b border-gray-800">
//         <img src="/devsta-logo.png" alt="Devsta Logo" className="h-[4.5rem] w-auto" />
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 mt-4">
//         {menuItems.map(({ label, key }) => (
//           <button
//             key={key}
//             onClick={() => {
//               setActiveTab(key);
//               setIsOpen(false);
//             }}
//             className={`flex items-center gap-3 px-4 py-2 text-sm font-medium relative w-full text-left ${
//               activeTab === key
//                 ? "bg-primary/10 text-primary"
//                 : "text-gray-400 hover:text-white hover:bg-gray-800"
//             }`}
//           >
//             {activeTab === key && <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md"></span>}
//             <span>{label}</span>
//           </button>
//         ))}
//       </nav>

//       {/* Bottom buttons */}
//       <div className="border-t border-gray-800 px-4 py-4 flex flex-col gap-2">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 w-full text-sm px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
//         >
//           <ArrowLeft size={16} />
//           Back to Dashboard
//         </button>

//         <button
//           onClick={onLogout}
//           className="flex items-center gap-2 w-full text-sm px-4 py-2 rounded-md text-red-500 hover:bg-red-500/10"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }


import { X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileSidebar({ isOpen, setIsOpen, activeTab, setActiveTab, onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "General Info", key: "general" },
    { label: "Skills", key: "skills" },
    { label: "Resume", key: "resume" },
    { label: "GitHub", key: "github" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-56 bg-black text-white flex flex-col 
          border-r border-gray-800 transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-gray-800">
          <img src="/devsta-logo.png" alt="Devsta Logo" className="h-[4.5rem] w-auto" />
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-4">
          {menuItems.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 text-sm font-medium relative w-full text-left ${
                activeTab === key
                  ? "bg-primary/10 text-primary"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {activeTab === key && (
                <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md"></span>
              )}
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom buttons */}
        <div className="border-t border-gray-800 px-4 py-4 flex flex-col gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 w-full text-sm px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full text-sm px-4 py-2 rounded-md text-red-500 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
