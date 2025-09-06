import { Github } from "lucide-react";
import { BACKEND_URL } from "../../../config";

const GithubConnectModal = () => {
  const handleConnect = () => {
      window.location.href = `${BACKEND_URL}/api/users/auth/github`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-100 rounded-2xl shadow-lg p-8 max-w-md w-full text-center font-fragment">
        <Github className="mx-auto mb-4 text-primary" size={48} />
        <h2 className="text-2xl font-bold mb-2 text-black">Connect GitHub</h2>
        <p className="text-gray-600 mb-6">
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
