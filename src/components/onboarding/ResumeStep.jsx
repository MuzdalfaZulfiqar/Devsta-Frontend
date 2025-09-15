import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ResumeStep({ formData, setFormData, nextStep, prevStep, onDeleteResume }) {
  const handleFileChange = (e) => setFormData({ resume: e.target.files[0] });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Resume</h2>
      <p className="text-sm text-gray-400">Upload your resume to complete your profile.</p>

      <div>
        {formData.resume ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-white">{formData.resume.name}</p>
            <button
              onClick={onDeleteResume}
              className="px-3 py-1 border border-white text-white rounded hover:opacity-90"
            >
              Delete
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full bg-transparent border border-white rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 rounded border border-white text-white hover:opacity-90"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
