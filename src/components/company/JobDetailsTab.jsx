import { useEffect, useState } from "react";
import { getJobById } from "../../api/company/publicJobs";

export default function JobDetailsTab({ jobId, onBack, onCompanyLoaded }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    getJobById(jobId)
      .then((data) => {
        setJob(data);
        onCompanyLoaded?.(data.company);
      })
      .catch(console.error);
  }, [jobId]);

  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <button
        onClick={onBack}
        className="text-sm text-primary mb-4"
      >
        ← Back to jobs
      </button>

      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-gray-500 mt-1">
        {job.company?.companyName} • {job.location}
      </p>

      <p className="mt-4">{job.description}</p>

      {job.requiredSkills?.length > 0 && (
        <>
          <h4 className="font-semibold mt-6">Required Skills</h4>
          <div className="flex gap-2 flex-wrap mt-2">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="text-sm bg-primary/10 text-primary px-3 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
