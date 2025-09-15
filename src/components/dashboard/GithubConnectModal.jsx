// // export default GithubConnectModal;
// import { Github, X } from "lucide-react";
// import { BACKEND_URL } from "../../../config";
// import { useState } from "react";

// const GithubConnectModal = () => {
//   const [isOpen, setIsOpen] = useState(true);

//   const handleConnect = () => {
//     window.location.href = `${BACKEND_URL}/api/users/auth/github`;
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
//       <div className="relative bg-black border border-white/30 rounded-2xl shadow-lg p-8 max-w-md w-full text-center font-fragment">
//         {/* Close button */}
//         <button
//           onClick={() => setIsOpen(false)}
//           className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
//         >
//           <X size={20} />
//         </button>

//         <Github className="mx-auto mb-4 text-white" size={48} />
//         <h2 className="text-2xl font-bold mb-2 text-white">Connect GitHub</h2>
//         <p className="text-gray-300 mb-6">
//           To access your DevSta dashboard, please connect your GitHub account.
//         </p>
//         <button
//           onClick={handleConnect}
//           className="bg-primary text-white px-6 py-2 rounded-xl hover:opacity-90 transition"
//         >
//           Connect GitHub
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GithubConnectModal;


import { Github, X } from "lucide-react";
import { BACKEND_URL } from "../../../config";
import { useState } from "react";
const GithubConnectModal = ({ open, onClose }) => {
  if (!open) return null;

  const handleConnect = () => {
    window.location.href = `${BACKEND_URL}/api/users/auth/github`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="relative bg-black border border-white/30 rounded-2xl shadow-lg p-8 max-w-md w-full text-center font-fragment">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <Github className="mx-auto mb-4 text-white" size={48} />
        <h2 className="text-2xl font-bold mb-2 text-white">Connect GitHub</h2>
        <p className="text-gray-300 mb-6">
          To access your DevSta dashboard, please connect your GitHub account.
        </p>
        <button
          onClick={handleConnect}
          className="bg-primary text-white px-6 py-2 rounded-xl hover:opacity-90 transition"
        >
          Connect GitHub
        </button>
      </div>
    </div>
  );
};

export default GithubConnectModal;
