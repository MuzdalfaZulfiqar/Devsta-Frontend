import { Github, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { BACKEND_URL } from "../../../config";

export default function GithubStep({ formData, setFormData, onNext, onBack }) {
  const handleConnect = () => {
    window.location.href = `${BACKEND_URL}/api/users/auth/github`;
  };

  const isConnected = formData.githubConnected;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Connect Your GitHub</h2>
      <p className="text-sm text-gray-400">Connect your GitHub account to showcase your projects and activity.</p>

      <div className="flex flex-col items-center justify-center gap-4 border border-white p-6 rounded-lg">
        {isConnected ? (
          <>
            <CheckCircle className="text-green-500" size={48} />
            <p className="text-green-500 font-medium">GitHub Connected</p>
          </>
        ) : (
          <>
            <Github className="text-white" size={48} />
            <button
              type="button"
              onClick={handleConnect}
              className="px-6 py-2 bg-primary text-white rounded hover:opacity-90"
            >
              Connect GitHub
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
