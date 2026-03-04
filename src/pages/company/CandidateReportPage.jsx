
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
// import { BACKEND_URL } from "../../../config";
// import { showToast } from "../../utils/toast";
// import BackButton from "../../components/BackButton";
// import {
//   Download, Loader2, AlertCircle, Code, Users, Star,
//   Mail, Phone, Globe, Github, FileText, Target, 
//   ExternalLink
// } from "lucide-react";

// export default function CandidateReportPage() {
//   const { jobId, applicationId } = useParams();
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);

//   useEffect(() => {
//     fetchReport();
//   }, [jobId, applicationId]);

//   const fetchReport = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("companyToken");
//       const res = await fetch(
//         `${BACKEND_URL}/api/reports/${jobId}/applications/${applicationId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to load report");
//       setReport(data.report);
//     } catch (err) {
//       showToast(err.message || "Could not load candidate report", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportPDF = () => {
//     setExporting(true);
//     setTimeout(() => {
//       window.print();
//       setExporting(false);
//     }, 500);
//   };

//   if (loading) return (
//     <CompanyDashboardLayout>
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <Loader2 size={40} className="animate-spin text-primary mb-4" />
//         <p className="text-gray-500 font-medium">Generating Executive Report...</p>
//       </div>
//     </CompanyDashboardLayout>
//   );

//   if (!report) return (
//     <CompanyDashboardLayout>
//       <div className="max-w-4xl mx-auto px-4 py-10">
//         <div className="text-center py-20 bg-white border border-gray-200 rounded-lg shadow-sm">
//           <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900">Report Unavailable</h2>
//         </div>
//       </div>
//     </CompanyDashboardLayout>
//   );

//   const { candidate, job, timeline, codingAssessment, interviewAssessment } = report;

//   return (
//     <CompanyDashboardLayout>
//       <div className="max-w-6xl mx-auto px-6 py-8 font-fragment print:p-0 print:m-0 print:max-w-none [print-color-adjust:exact]">
        
//         {/* Actions Bar */}
//         <div className="flex items-center justify-between mb-8 print:hidden">
//           <BackButton to={`/company/jobs/${jobId}/first-stage-applicants`} />
//           <button
//             onClick={handleExportPDF}
//             disabled={exporting}
//             className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm shadow-sm"
//           >
//             {exporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
//             Download Executive PDF
//           </button>
//         </div>

//         <div className="space-y-6 print:space-y-4">
          
//           {/* Executive Summary Header */}
//           <header className="bg-white border-b-4 border-primary p-8 rounded-t-xl shadow-sm flex justify-between items-end print:shadow-none print:border-b-2 print:px-0">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-widest print:border print:border-primary/20">Candidate Dossier</span>
//               </div>
//               <h1 className="text-4xl font-black text-black mb-1 tracking-tight">{candidate.name}</h1>
//               <p className="text-lg text-gray-600 font-medium">{job.title}</p>
//             </div>
//             <div className="text-right block">
//               <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Report Issued</p>
//               <p className="text-gray-900 font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
//             </div>
//           </header>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
            
//             {/* Left Column: Profile & Metadata */}
//             <div className="lg:col-span-1 space-y-6 print:col-span-1">
//               <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm print:shadow-none print:bg-gray-50/30">
//                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-6 flex items-center gap-2">
//                   <Users size={16} /> Contact Information
//                 </h3>
//                 <div className="space-y-4">
//                   <ProfileItem icon={<Mail size={16}/>} label="Email" value={candidate.email} />
//                   <ProfileItem icon={<Phone size={16}/>} label="Phone" value={candidate.phone} />
//                   <ProfileItem icon={<Target size={16}/>} label="Seniority" value={candidate.experienceLevel} />
//                 </div>

//                 <div className="mt-8 pt-6 border-t border-gray-100">
//                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-4">Professional Links</h3>
//                   <div className="flex flex-col gap-3">
//                     {candidate.resumeUrl && <LinkButton icon={<FileText size={16}/>} label="Resume / CV" href={candidate.resumeUrl} />}
//                     {candidate.linkedin && <LinkButton icon={<Globe size={16}/>} label="LinkedIn Profile" href={candidate.linkedin} />}
//                     {candidate.github && <LinkButton icon={<Github size={16}/>} label="GitHub Portfolio" href={candidate.github} />}
//                   </div>
//                 </div>
//               </section>

//               <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm print:shadow-none">
//                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-4">Core Competencies</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {candidate.topSkills?.map((skill, i) => (
//                     <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded print:border print:border-gray-200">
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </section>
//             </div>

//             {/* Right Column: Assessment Data */}
//             <div className="lg:col-span-2 space-y-6 print:col-span-2">
              
//               {/* Technical Performance */}
//               <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:shadow-none">
//                 <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center print:bg-white">
//                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                     <Code size={18} className="text-primary" /> Technical Assessment
//                   </h3>
//                   <span className="text-xs font-bold text-gray-500 uppercase">Stage 01</span>
//                 </div>
                
//                 <div className="p-6">
//                   <div className="grid grid-cols-2 gap-4 mb-8">
//                     <StatCard label="Overall Score" value={codingAssessment?.score != null ? `${(codingAssessment.score * 100).toFixed(0)}%` : "N/A"} color="primary" />
//                     <StatCard label="Assessment Date" value={codingAssessment?.expiresAt ? new Date(codingAssessment.expiresAt).toLocaleDateString() : "—"} />
//                   </div>

//                   <div className="space-y-4">
//                     {codingAssessment?.submissions?.map((sub, idx) => (
//                       <div key={idx} className="border border-gray-100 rounded-lg p-5 bg-white print:break-inside-avoid">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h4 className="font-bold text-gray-900">{sub.challenge}</h4>
//                             <p className="text-xs text-gray-500">{sub.language} • {sub.difficulty} Difficulty</p>
//                           </div>
//                           <p className="text-2xl font-black text-primary">{sub.score}%</p>
//                         </div>
                        
//                         {sub.evaluation && (
//                           <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg print:bg-gray-100/50">
//                             <MetricTiny label="Correctness" val={sub.evaluation.correctness} />
//                             <MetricTiny label="Performance" val={sub.evaluation.performance} />
//                             <MetricTiny label="Code Quality" val={sub.evaluation.codeQuality} />
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               {/* Interview Performance - FULL RESTORATION */}
//               <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:shadow-none print:break-inside-avoid">
//                 <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center print:bg-white">
//                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                     <Star size={18} className="text-yellow-600" /> Interview Evaluation
//                   </h3>
//                   <span className="text-xs font-bold text-gray-500 uppercase">Stage 02</span>
//                 </div>

//                 <div className="p-6">
//                   {interviewAssessment?.score ? (
//                     <div className="space-y-6">
//                       <div className="flex items-center gap-8 print:gap-4 mb-6">
//                         <div className="text-center p-6 bg-black text-white rounded-xl min-w-[140px] print:min-w-[100px] print:p-4">
//                           <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Final Rating</p>
//                           <p className="text-4xl font-black">{interviewAssessment.score}<span className="text-lg opacity-40">/100</span></p>
//                         </div>
//                         {interviewAssessment.notes && (
//                           <div className="flex-1">
//                             <h4 className="text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">Interviewer Notes</h4>
//                           </div>
//                         )}
//                         <div className="flex-1">
                          
                          
//                           {interviewAssessment.notes && (
//                             <p className="text-gray-700 leading-relaxed italic border-l-2 border-primary pl-4 print:text-sm">
//                               "{interviewAssessment.notes}"
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       {/* RESTORED SCORECARD BREAKDOWN */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {interviewAssessment.scorecard?.map((item, i) => (
//                           <div key={i} className="p-4 border border-gray-100 rounded-lg bg-gray-50/30">
//                             <div className="flex justify-between items-center mb-1">
//                               <span className="font-bold text-gray-800 text-sm">{item.label}</span>
//                               <span className="text-sm font-black text-primary">{item.score}/{item.maxScore}</span>
//                             </div>
//                             {}
//                             <p className="text-[11px] text-gray-500 leading-tight">{item.notes}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-gray-400 font-medium italic py-10 text-center">Interview phase has not been completed.</p>
//                   )}
//                 </div>
//               </section>
//             </div>
//           </div>

//           <footer className="pt-8 pb-12 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] print:fixed print:bottom-0 print:w-full print:bg-white print:pb-4">
//             <div>System Generated Report • Confidential</div>
//             <div className="text-right">
//               Applied: {new Date(timeline.appliedAt).toLocaleDateString()} <span className="mx-2">|</span> 
//               Updated: {new Date(timeline.updatedAt).toLocaleDateString()}
//             </div>
//           </footer>
//         </div>
//       </div>
//     </CompanyDashboardLayout>
//   );
// }

// // ─── Helper Components ────────────────────────────────────────

// function ProfileItem({ icon, label, value }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="text-gray-400 print:hidden">{icon}</div>
//       <div>
//         <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">{label}</p>
//         <p className="text-sm font-bold text-gray-900 leading-none">{value || "—"}</p>
//       </div>
//     </div>
//   );
// }

// function LinkButton({ icon, label, href }) {
//   return (
//     <a 
//       href={href} 
//       target="_blank" 
//       rel="noreferrer" 
//       className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all group print:border-none print:p-0 print:text-primary"
//     >
//       <div className="flex items-center gap-3">
//         <span className="print:hidden">{icon}</span>
//         <span className="text-sm font-bold">{label}</span>
//       </div>
//       <ExternalLink size={14} className="text-gray-300 group-hover:text-primary print:hidden" />
//     </a>
//   );
// }

// function StatCard({ label, value, color }) {
//   return (
//     <div className="bg-white border border-gray-100 p-4 rounded-xl print:border-gray-200">
//       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">{label}</p>
//       <p className={`text-xl font-black ${color === 'primary' ? 'text-primary' : 'text-gray-900'}`}>
//         {value}
//       </p>
//     </div>
//   );
// }

// function MetricTiny({ label, val }) {
//   // Cleanly separate the display from the bar calculation
//   const numericValue = val || 0;
//   return (
//     <div>
//       <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{label}</p>
//       <div className="flex items-center gap-2">
//         <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//           <div 
//             className="h-full bg-primary" 
//             style={{ width: `${numericValue * 10}%` }}
//           />
//         </div>
//         <span className="text-xs font-black text-gray-900">{numericValue}/10</span>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { BACKEND_URL } from "../../../config";
import { showToast } from "../../utils/toast";
import BackButton from "../../components/BackButton";
import {
  Download, Loader2, AlertCircle, Code, Users, Star,
  Mail, Phone, Globe, Github, FileText, Target,
  ExternalLink
} from "lucide-react";

export default function CandidateReportPage() {
  const { jobId, applicationId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [jobId, applicationId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("companyToken");
      const res = await fetch(
        `${BACKEND_URL}/api/reports/${jobId}/applications/${applicationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load report");
      setReport(data.report);
    } catch (err) {
      showToast(err.message || "Could not load candidate report", 5000);
    } finally {
      setLoading(false);
    }
  };

  // ── Same resume viewer function as in FirstStageApplicantsPage ──
  const handleViewResume = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      // We need developer ID — assuming backend now includes it in report.candidate
      // If not, replace with correct ID source or change endpoint to use applicationId
      const developerId = report?.candidate?.developerId; // ← Add this in backend if missing

      if (!developerId) {
        showToast("Developer ID not available", 5000);
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/company/jobs/${jobId}/${developerId}/resume`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch resume");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      showToast(err.message || "Failed to view resume", 5000);
    }
  };

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      window.print();
      setExporting(false);
    }, 500);
  };

  if (loading) return (
    <CompanyDashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium">Generating Executive Report...</p>
      </div>
    </CompanyDashboardLayout>
  );

  if (!report) return (
    <CompanyDashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-20 bg-white border border-gray-200 rounded-lg shadow-sm">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Report Unavailable</h2>
        </div>
      </div>
    </CompanyDashboardLayout>
  );

  const { candidate, job, timeline, codingAssessment, interviewAssessment } = report;

  return (
    <CompanyDashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-8 font-fragment print:p-0 print:m-0 print:max-w-none [print-color-adjust:exact]">
       
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <BackButton to={`/company/jobs/${jobId}/first-stage-applicants`} />
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm shadow-sm"
          >
            {exporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            Download Executive PDF
          </button>
        </div>

        <div className="space-y-6 print:space-y-4">
         
          {/* Executive Summary Header */}
          <header className="bg-white border-b-4 border-primary p-8 rounded-t-xl shadow-sm flex justify-between items-end print:shadow-none print:border-b-2 print:px-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-widest print:border print:border-primary/20">Candidate Dossier</span>
              </div>
              <h1 className="text-4xl font-black text-black mb-1 tracking-tight">{candidate.name}</h1>
              <p className="text-lg text-gray-600 font-medium">{job.title}</p>
            </div>
            <div className="text-right block">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Report Issued</p>
              <p className="text-gray-900 font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
           
            {/* Left Column: Profile & Metadata */}
            <div className="lg:col-span-1 space-y-6 print:col-span-1">
              <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm print:shadow-none print:bg-gray-50/30">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <Users size={16} /> Contact Information
                </h3>
                <div className="space-y-4">
                  <ProfileItem icon={<Mail size={16}/>} label="Email" value={candidate.email} />
                  <ProfileItem icon={<Phone size={16}/>} label="Phone" value={candidate.phone} />
                  <ProfileItem icon={<Target size={16}/>} label="Seniority" value={candidate.experienceLevel} />
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-4">Professional Links</h3>
                  <div className="flex flex-col gap-3">
                    {/* ── Changed from <a> to <button> with your working resume viewer ── */}
                    {candidate.resumeUrl && (
                      <button
                        onClick={handleViewResume}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all group print:border-none print:p-0 print:text-primary w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="print:hidden"><FileText size={16}/></span>
                          <span className="text-sm font-bold">Resume / CV</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-300 group-hover:text-primary print:hidden" />
                      </button>
                    )}

                    {candidate.linkedin && <LinkButton icon={<Globe size={16}/>} label="LinkedIn Profile" href={candidate.linkedin} />}
                    {candidate.github && <LinkButton icon={<Github size={16}/>} label="GitHub Portfolio" href={candidate.github} />}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm print:shadow-none">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-4">Core Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.topSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded print:border print:border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Assessment Data */}
            <div className="lg:col-span-2 space-y-6 print:col-span-2">
             
              {/* Technical Performance */}
              <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:shadow-none">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center print:bg-white">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Code size={18} className="text-primary" /> Technical Assessment
                  </h3>
                  <span className="text-xs font-bold text-gray-500 uppercase">Stage 01</span>
                </div>
               
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <StatCard label="Overall Score" value={codingAssessment?.score != null ? `${(codingAssessment.score * 100).toFixed(0)}%` : "N/A"} color="primary" />
                    <StatCard label="Assessment Date" value={codingAssessment?.expiresAt ? new Date(codingAssessment.expiresAt).toLocaleDateString() : "—"} />
                  </div>
                  <div className="space-y-4">
                    {codingAssessment?.submissions?.map((sub, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-lg p-5 bg-white print:break-inside-avoid">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900">{sub.challenge}</h4>
                            <p className="text-xs text-gray-500">{sub.language} • {sub.difficulty} Difficulty</p>
                          </div>
                          <p className="text-2xl font-black text-primary">{sub.score}%</p>
                        </div>
                       
                        {sub.evaluation && (
                          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg print:bg-gray-100/50">
                            <MetricTiny label="Correctness" val={sub.evaluation.correctness} />
                            <MetricTiny label="Performance" val={sub.evaluation.performance} />
                            <MetricTiny label="Code Quality" val={sub.evaluation.codeQuality} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Interview Performance - FULL RESTORATION */}
              <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:shadow-none print:break-inside-avoid">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center print:bg-white">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Star size={18} className="text-yellow-600" /> Interview Evaluation
                  </h3>
                  <span className="text-xs font-bold text-gray-500 uppercase">Stage 02</span>
                </div>

                <div className="p-6">
                  {interviewAssessment?.score ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-8 print:gap-4 mb-6">
                        <div className="text-center p-6 bg-black text-white rounded-xl min-w-[140px] print:min-w-[100px] print:p-4">
                          <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Final Rating</p>
                          <p className="text-4xl font-black">{interviewAssessment.score}<span className="text-lg opacity-40">/100</span></p>
                        </div>
                        {interviewAssessment.notes && (
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">Interviewer Notes</h4>
                          </div>
                        )}
                        <div className="flex-1">
                         
                         
                          {interviewAssessment.notes && (
                            <p className="text-gray-700 leading-relaxed italic border-l-2 border-primary pl-4 print:text-sm">
                              "{interviewAssessment.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RESTORED SCORECARD BREAKDOWN */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {interviewAssessment.scorecard?.map((item, i) => (
                          <div key={i} className="p-4 border border-gray-100 rounded-lg bg-gray-50/30">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                              <span className="text-sm font-black text-primary">{item.score}/{item.maxScore}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-tight">{item.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 font-medium italic py-10 text-center">Interview phase has not been completed.</p>
                  )}
                </div>
              </section>
            </div>
          </div>

          <footer className="pt-8 pb-12 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] print:fixed print:bottom-0 print:w-full print:bg-white print:pb-4">
            <div>System Generated Report • Confidential</div>
            <div className="text-right">
              Applied: {new Date(timeline.appliedAt).toLocaleDateString()} <span className="mx-2">|</span>
              Updated: {new Date(timeline.updatedAt).toLocaleDateString()}
            </div>
          </footer>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}

// ─── Helper Components ────────────────────────────────────────
function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400 print:hidden">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900 leading-none">{value || "—"}</p>
      </div>
    </div>
  );
}

function LinkButton({ icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all group print:border-none print:p-0 print:text-primary"
    >
      <div className="flex items-center gap-3">
        <span className="print:hidden">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <ExternalLink size={14} className="text-gray-300 group-hover:text-primary print:hidden" />
    </a>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl print:border-gray-200">
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">{label}</p>
      <p className={`text-xl font-black ${color === 'primary' ? 'text-primary' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

function MetricTiny({ label, val }) {
  const numericValue = val || 0;
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${numericValue * 10}%` }}
          />
        </div>
        <span className="text-xs font-black text-gray-900">{numericValue}/10</span>
      </div>
    </div>
  );
}