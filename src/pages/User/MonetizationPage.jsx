// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import MonetizationInput from "../../components/monetization/MonetizationInput";
// import MonetizationProgress from "../../components/monetization/MonetizationProgress";
// import MonetizationResults from "../../components/monetization/MonetizationResults";
// import MonetizationHistory from "../../components/monetization/MonetizationHistory";
// import { ingestGitHub, ingestUpload, getResults, downloadReport } from "../../api/monetizationApi";
// import { useJobProgress } from "../../hooks/useJobProgress";
// import { TrendingUp, RotateCcw } from "lucide-react";

// export default function MonetizationPage() {
//   const { user } = useAuth();

//   const [step, setStep]                   = useState("input");   // "input" | "progress" | "results" | "history"
//   const [jobId, setJobId]                 = useState(null);
//   const [result, setResult]               = useState(null);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [submitError, setSubmitError]     = useState(null);

//   const { status, progress, error: wsError, isDone, isFailed } = useJobProgress(jobId);

//   useEffect(() => {
//     if (isDone && jobId) {
//       getResults(jobId)
//         .then((data) => {
//           setResult(data);
//           setStep("results");
//         })
//         .catch((err) => {
//           setSubmitError(err.message);
//           setStep("input");
//         });
//     }
//   }, [isDone, jobId]);

//   const handleSubmit = async ({ type, url, file }) => {
//     setSubmitError(null);
//     setSubmitLoading(true);
//     try {
//       const data = type === "github"
//         ? await ingestGitHub(url)
//         : await ingestUpload(file);
//       setJobId(data.job_id);
//       setStep("progress");
//     } catch (err) {
//       setSubmitError(err.message);
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDownload = async (format) => {
//     try {
//       const blob = await downloadReport(jobId, format);
//       if (blob) {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `monetization_report_${jobId.slice(0, 8)}.${format}`;
//         a.click();
//         URL.revokeObjectURL(url);
//       }
//     } catch (e) {
//       alert("Download failed: " + e.message);
//     }
//   };

//   const handleReset = () => {
//     setStep("input");
//     setJobId(null);
//     setResult(null);
//     setSubmitError(null);
//   };

//   // Called from MonetizationHistory when user clicks "View" on a past job
//   const handleViewHistoricResult = (historicJobId, historicResult) => {
//     setJobId(historicJobId);
//     setResult(historicResult);
//     setStep("results");
//   };

//   const TABS = [
//     { key: "input",    label: "Configure"  },
//     { key: "progress", label: "Processing" },
//     { key: "results",  label: "Results"    },
//     { key: "history",  label: "History"    },
//   ];

//   return (
//     <DashboardLayout user={user}>
//       <div className="flex flex-col w-full h-full">

//         {/* Page header */}
//         <div className="flex items-center justify-between px-4 mb-2">
//           <div className="flex items-center gap-2">
//             <TrendingUp size={20} className="text-primary" />
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//               AI Monetization Audit
//             </h1>
//           </div>

//           {step !== "input" && step !== "history" && (
//             <button
//               onClick={handleReset}
//               className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//             >
//               <RotateCcw size={13} />
//               New Analysis
//             </button>
//           )}
//         </div>

//         {/* Tab bar */}
//         <div className="flex gap-6 px-4 border-b border-gray-200 dark:border-gray-700 mb-0">
//           {TABS.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => {
//                 if (tab.key === "input")   handleReset();
//                 else if (tab.key === "history")  setStep("history");
//                 else if (tab.key === "results" && result) setStep("results");
//                 else if (tab.key === "progress" && jobId && !isDone) setStep("progress");
//               }}
//               className={`py-2 text-sm font-semibold transition relative ${
//                 step === tab.key
//                   ? "border-b-2 border-primary text-primary"
//                   : "text-gray-500 hover:text-primary"
//               }`}
//             >
//               {tab.label}
//               {tab.key === "results" && result && step !== "results" && (
//                 <span className="absolute -top-0.5 -right-2 w-1.5 h-1.5 bg-primary rounded-full" />
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex-1 p-4 overflow-auto">
//           {step === "input" && (
//             <MonetizationInput
//               onSubmit={handleSubmit}
//               loading={submitLoading}
//               error={submitError}
//             />
//           )}

//           {step === "progress" && (
//             <MonetizationProgress
//               status={status}
//               progress={progress}
//               error={wsError}
//             />
//           )}

//           {step === "results" && result && (
//             <MonetizationResults
//               result={result}
//               jobId={jobId}
//               onDownload={handleDownload}
//             />
//           )}

//           {step === "history" && (
//             <MonetizationHistory onViewResults={handleViewHistoricResult} />
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }


import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import MonetizationInput from "../../components/monetization/MonetizationInput";
import MonetizationProgress from "../../components/monetization/MonetizationProgress";
import MonetizationResults from "../../components/monetization/MonetizationResults";
import MonetizationHistory from "../../components/monetization/MonetizationHistory";
import { ingestGitHub, ingestUpload, getResults, downloadReport } from "../../api/monetizationApi";
import { useJobProgress } from "../../hooks/useJobProgress";
import { TrendingUp, RotateCcw } from "lucide-react";

export default function MonetizationPage() {
  const { user } = useAuth();

  const [step, setStep]                   = useState("input");   // "input" | "progress" | "results" | "history"
  const [jobId, setJobId]                 = useState(null);
  const [result, setResult]               = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError]     = useState(null);

  // const { status, progress, error: wsError, isDone, isFailed } = useJobProgress(jobId);
  const { status, progress, error: wsError, isDone, isFailed } = useJobProgress(jobId, user?._id);

  useEffect(() => {
    if (isDone && jobId) {
      getResults(jobId)
        .then((data) => {
          setResult(data);
          setStep("results");
        })
        .catch((err) => {
          setSubmitError(err.message);
          setStep("input");
        });
    }
  }, [isDone, jobId]);

  const handleSubmit = async ({ type, url, file }) => {
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      const data = type === "github"
        ? await ingestGitHub(url)
        : await ingestUpload(file);
      setJobId(data.job_id);
      setStep("progress");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      const blob = await downloadReport(jobId, format);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `monetization_report_${jobId.slice(0, 8)}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      alert("Download failed: " + e.message);
    }
  };

  const handleReset = () => {
    setStep("input");
    setJobId(null);
    setResult(null);
    setSubmitError(null);
  };

  // Called from MonetizationHistory when user clicks "View" on a past job
  const handleViewHistoricResult = (historicJobId, historicResult) => {
    setJobId(historicJobId);
    setResult(historicResult);
    setStep("results");
  };

  const TABS = [
    { key: "input",    label: "Configure"  },
    { key: "progress", label: "Processing" },
    { key: "results",  label: "Results"    },
    { key: "history",  label: "History"    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col w-full h-full">

        {/* Page header */}
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Monetization Audit
            </h1>
          </div>

          {step !== "input" && step !== "history" && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <RotateCcw size={13} />
              New Analysis
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-6 px-4 border-b border-gray-200 dark:border-gray-700 mb-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === "input")   handleReset();
                else if (tab.key === "history")  setStep("history");
                else if (tab.key === "results" && result) setStep("results");
                else if (tab.key === "progress" && jobId && !isDone) setStep("progress");
              }}
              className={`py-2 text-sm font-semibold transition relative ${
                step === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {tab.label}
              {tab.key === "results" && result && step !== "results" && (
                <span className="absolute -top-0.5 -right-2 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {step === "input" && (
            <MonetizationInput
              onSubmit={handleSubmit}
              loading={submitLoading}
              error={submitError}
            />
          )}

          {step === "progress" && (
            <MonetizationProgress
              status={status}
              progress={progress}
              error={wsError}
            />
          )}

          {step === "results" && result && (
            <MonetizationResults
              result={result}
              jobId={jobId}
              onDownload={handleDownload}
            />
          )}

          {step === "history" && (
            <MonetizationHistory onViewResults={handleViewHistoricResult} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
