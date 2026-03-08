// // src/pages/company/JobsPage.jsx
// import { useState } from "react";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import AllJobsTab from "../../components/company/AllJobsTab";
// import JobDetailsTab from "../../components/company/JobDetailsTab";
// import JobDetailsModal from "../../components/company/JobDetailsModal";
// import CompanyInfoCard from "../../components/company/CompanyInfoCard"; // ← import here
// import { useAuth } from "../../context/AuthContext";
// import { getJobsByCompany, getCompanyById } from "../../api/company/publicJobs";
// import { useNavigate } from "react-router-dom";
// import MyApplicationsPage from "./MyApplicationsPage";
// import { useEffect } from "react";
// export default function JobsPage() {
//     const { user, token } = useAuth();
//     const navigate = useNavigate();

//     const [activeTab, setActiveTab] = useState("all");
//     const [selectedJobId, setSelectedJobId] = useState(null);
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [showCompanyPanel, setShowCompanyPanel] = useState(false);
//     const [showJobModal, setShowJobModal] = useState(false);
//     const [jobModalContext, setJobModalContext] = useState("browse");

//     const [companyActiveJobs, setCompanyActiveJobs] = useState([]);
//     const handleSelectJob = (jobId) => {
//         setSelectedJobId(jobId);
//         setJobModalContext("browse"); // ✅ browsing
//         setShowJobModal(true);
//     };

//     // Auto-switch tab + scroll when hash is present
//   useEffect(() => {
//     if (window.location.hash === "#my-applications-section") {
//       // Switch to My Applications tab
//       setActiveTab("applications");

//       // Wait for tab content to render, then scroll
//       setTimeout(() => {
//         const element = document.getElementById("my-applications-section");
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth", block: "start" });
         
         
//         }
//       }, 600); // 600ms delay — enough for tab switch + render
//     }
//   }, []); // Run once on mount
//     const handleSelectCompany = async (company) => {
//         try {
//             // 1️⃣ Fetch full company
//             const fullCompany = await getCompanyById(company._id);

//             // 2️⃣ Fetch company jobs
//             // const jobs = await getJobsByCompany(company._id, token);

//             const response = await getJobsByCompany(company._id, token);

//             // 3️⃣ Set state FIRST
//             setSelectedCompany(fullCompany);
//           setCompanyActiveJobs(Array.isArray(response.jobs) ? response.jobs : []);

//             // 4️⃣ THEN open panel
//             setShowCompanyPanel(true);

//         } catch (err) {
//             console.error("Failed to fetch company or jobs", err);
//             setSelectedCompany(null);
//             setCompanyActiveJobs([]);
//         }
//     };


//     const handleClosePanel = () => {
//         setShowCompanyPanel(false);
//         // Optional: clear selected company when panel closes
//         // setSelectedCompany(null);
//     };

//     // Tab Button Component
//     const Tab = ({ label, active, onClick }) => (
//         <button
//             onClick={onClick}
//             className={`
//         px-4 py-2 text-sm font-medium border-b-2 transition-colors
//         ${active ? "text-primary border-primary" : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"}
//       `}
//         >
//             {label}
//         </button>
//     );

//     return (
//         <DashboardLayout user={user}>
//             <div className="relative w-full h-full overflow-hidden">
//                 {/* Main Content */}
//                 <div
//                     className={`h-full transition-all duration-300 ease-in-out ${showCompanyPanel ? "md:mr-[420px]" : "mr-0"
//                         }`}
//                 >
//                     {/* Tabs */}
//                     <div className="flex gap-6 px-6 border-b">
//                         <Tab
//                             label="All Jobs"
//                             active={activeTab === "all"}
//                             onClick={() => setActiveTab("all")}
//                         />

//                         <Tab
//                             label="My Applications"
//                             active={activeTab === "applications"}
//                             onClick={() => setActiveTab("applications")}
//                         />


//                         {activeTab === "details" && selectedJobId && (
//                             <Tab
//                                 label="Job Details"
//                                 active={activeTab === "details"}
//                                 onClick={() => setActiveTab("details")}
//                             />
//                         )}
//                     </div>


//                     {/* Tab Content */}
//                     <main className="px-6 py-6">
//                         {activeTab === "details" && selectedJobId ? (
//                             <JobDetailsTab
//                                 jobId={selectedJobId}
//                                 onBack={() => setActiveTab("all")}
//                                 onCompanyClick={handleSelectCompany}
//                             />
//                         ) : activeTab === "applications" ? (
//                             <MyApplicationsPage
//                                 onViewJob={(jobId) => {
//                                     setSelectedJobId(jobId);
//                                     setJobModalContext("application"); // ✅ application view
//                                     setShowJobModal(true);
//                                     setActiveTab("applications");
//                                 }}
//                             />


//                         ) : (
//                             <AllJobsTab
//                                 onSelectJob={handleSelectJob}
//                                 onCompanyClick={handleSelectCompany}
//                             />
//                         )}
//                     </main>

//                 </div>

//                 {/* Right Panel - Company Info Card */}
//                 <div
//                     className={`fixed inset-y-0 right-0 z-40 w-full max-w-lg md:max-w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${showCompanyPanel ? "translate-x-0" : "translate-x-full"
//                         }`}
//                 >
//                     <CompanyInfoCard
//                         company={selectedCompany}
//                         activeJobs={companyActiveJobs}
//                         onClose={handleClosePanel}
//                         onViewJob={(jobId) => {
//                             setSelectedJobId(jobId);
//                             setJobModalContext("browse");
//                             setShowCompanyPanel(false);
//                             setShowJobModal(true);
//                         }}
//                     />


//                 </div>

//                 {/* Mobile backdrop */}
//                 {showCompanyPanel && (
//                     <div
//                         className="fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity duration-300"
//                         onClick={handleClosePanel}
//                     />
//                 )}
//             </div>

//             {showJobModal && selectedJobId && (
//                 <JobDetailsModal
//                     jobId={selectedJobId}
//                     context={jobModalContext}   // ✅ USE STATE, not hardcoded
//                     onClose={() => setShowJobModal(false)}
//                     onViewCompany={(company) => {
//                         handleSelectCompany(company);
//                         setShowJobModal(false);
//                     }}
//                 />
//             )}


//         </DashboardLayout>
//     );
// }

// src/pages/company/JobsPage.jsx
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AllJobsTab from "../../components/company/AllJobsTab";
import JobDetailsTab from "../../components/company/JobDetailsTab";
import JobDetailsModal from "../../components/company/JobDetailsModal";
import CompanyInfoCard from "../../components/company/CompanyInfoCard";
import { useAuth } from "../../context/AuthContext";
import { getJobsByCompany, getCompanyById } from "../../api/company/publicJobs";
import { useNavigate } from "react-router-dom";
import MyApplicationsPage from "./MyApplicationsPage";

export default function JobsPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyPanel, setShowCompanyPanel] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobModalContext, setJobModalContext] = useState("browse");

  const [companyActiveJobs, setCompanyActiveJobs] = useState([]);

  // ── Tracks which jobs were applied to so AllJobsTab cards update instantly ──
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Called by JobDetailsModal after a successful application
  const handleJobApplied = useCallback((jobId) => {
    setAppliedJobIds((prev) => new Set([...prev, String(jobId)]));
  }, []);

  // ── Auto-switch to My Applications tab when navigated via hash ──
  useEffect(() => {
    if (window.location.hash === "#my-applications-section") {
      setActiveTab("applications");
      setTimeout(() => {
        const element = document.getElementById("my-applications-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 600);
    }
  }, []);

  const handleSelectJob = useCallback((jobId) => {
    setSelectedJobId(jobId);
    setJobModalContext("browse");
    setShowJobModal(true);
  }, []);

  const handleSelectCompany = async (company) => {
    try {
      const fullCompany = await getCompanyById(company._id);
      const response = await getJobsByCompany(company._id, token);
      setSelectedCompany(fullCompany);
      setCompanyActiveJobs(Array.isArray(response.jobs) ? response.jobs : []);
      setShowCompanyPanel(true);
    } catch (err) {
      console.error("Failed to fetch company or jobs", err);
      setSelectedCompany(null);
      setCompanyActiveJobs([]);
    }
  };

  const handleClosePanel = () => setShowCompanyPanel(false);

  const Tab = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium border-b-2 transition-colors
        ${active
          ? "text-primary border-primary"
          : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <DashboardLayout user={user}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Main Content */}
        <div
          className={`h-full transition-all duration-300 ease-in-out ${
            showCompanyPanel ? "md:mr-[420px]" : "mr-0"
          }`}
        >
          {/* Tabs */}
          <div className="flex gap-6 px-6 border-b">
            <Tab
              label="All Jobs"
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            />
            <Tab
              label="My Applications"
              active={activeTab === "applications"}
              onClick={() => setActiveTab("applications")}
            />
            {activeTab === "details" && selectedJobId && (
              <Tab
                label="Job Details"
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              />
            )}
          </div>

          {/* Tab Content */}
          <main className="px-6 py-6">
            {activeTab === "details" && selectedJobId ? (
              <JobDetailsTab
                jobId={selectedJobId}
                onBack={() => setActiveTab("all")}
                onCompanyClick={handleSelectCompany}
              />
            ) : activeTab === "applications" ? (
              <div id="my-applications-section">
                <MyApplicationsPage
                  onViewJob={(jobId) => {
                    setSelectedJobId(jobId);
                    setJobModalContext("application");
                    setShowJobModal(true);
                    setActiveTab("applications");
                  }}
                />
              </div>
            ) : (
              <AllJobsTab
                onSelectJob={handleSelectJob}
                onCompanyClick={handleSelectCompany}
                // Pass down the applied IDs so cards reflect state instantly
                appliedJobIds={appliedJobIds}
                onJobApplied={handleJobApplied}
              />
            )}
          </main>
        </div>

        {/* Right Panel — Company Info */}
        <div
          className={`fixed inset-y-0 right-0 z-40 w-full max-w-lg md:max-w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            showCompanyPanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <CompanyInfoCard
            company={selectedCompany}
            activeJobs={companyActiveJobs}
            onClose={handleClosePanel}
            onViewJob={(jobId) => {
              setSelectedJobId(jobId);
              setJobModalContext("browse");
              setShowCompanyPanel(false);
              setShowJobModal(true);
            }}
          />
        </div>

        {/* Mobile backdrop */}
        {showCompanyPanel && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity duration-300"
            onClick={handleClosePanel}
          />
        )}
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJobId && (
        <JobDetailsModal
          jobId={selectedJobId}
          context={jobModalContext}
          onClose={() => setShowJobModal(false)}
          onViewCompany={(company) => {
            handleSelectCompany(company);
            setShowJobModal(false);
          }}
          // Fires (jobId) => void after successful apply — updates cards instantly
          onApplied={handleJobApplied}
        />
      )}
    </DashboardLayout>
  );
}
