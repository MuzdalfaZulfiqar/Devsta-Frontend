
// // src/pages/company/MyApplicationsPage.jsx
// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { getMyApplications } from "../../api/company/jobApplications";
// import { getTestSessionStatus } from "../../api/test"; // ← new
// import MyApplicationCard from "../../components/company/MyApplicationCard";
// import { showToast } from "../../utils/toast";

// export default function MyApplicationsPage({ onViewJob }) {
//   const { token } = useAuth();

//   const [applications, setApplications] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(search);

//   const LIMIT = 6;

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(search), 300);
//     return () => clearTimeout(timer);
//   }, [search]);

//   // Fetch applications + test statuses
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await getMyApplications(
//           { page, limit: LIMIT, search: debouncedSearch },
//           token
//         );

//         // Enrich each application with test session status
//         const enriched = await Promise.all(
//           data.applications.map(async (app) => {
//             if (app.status === "assessment" && app.assessment?.status === "invited") {
//               try {
//                 const statusRes = await getTestSessionStatus(app.job._id);
//                 return {
//                   ...app,
//                   testSessionStatus: statusRes, // { hasSession, status }
//                 };
//               } catch (err) {
//                 console.warn("Failed to fetch test status for job", app.job._id, err);
//                 return { ...app, testSessionStatus: { hasSession: false } };
//               }
//             }
//             return { ...app, testSessionStatus: { hasSession: false } };
//           })
//         );

//         setApplications(enriched);
//         setPagination(data.pagination);
//       } catch (err) {
//         showToast(err.message || "Failed to load applications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, debouncedSearch, token]);

//   return (
//     <div className="flex flex-col gap-5">
//       <input
//         type="text"
//         placeholder="Search jobs, company…"
//         value={search}
//         onChange={(e) => {
//           setPage(1);
//           setSearch(e.target.value);
//         }}
//         className="border rounded-lg px-4 py-2 w-full"
//       />

//       {loading ? (
//         <p className="text-gray-500 text-sm animate-pulse py-10 text-center">
//           Loading your applications…
//         </p>
//       ) : applications.length === 0 ? (
//         <div className="text-center py-16">
//           <h3 className="text-lg font-semibold">No applications yet</h3>
//           <p className="text-sm text-gray-500 mt-2">
//             When you apply to jobs, they’ll appear here.
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="grid gap-5 sm:grid-cols-2 mt-2">
//             {applications.map((app) => (
//               <MyApplicationCard
//                 key={app._id}
//                 application={app}
//                 onViewJob={onViewJob}
//               />
//             ))}
//           </div>

//           {pagination && pagination.totalPages > 1 && (
//             <div className="flex justify-center gap-2 pt-6">
//               {/* your pagination */}
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               {Array.from({ length: pagination.totalPages }).map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setPage(i + 1)}
//                   className={`px-3 py-1 rounded ${page === i + 1 ? "bg-primary text-white" : "bg-gray-200"
//                     }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button
//                 disabled={page === pagination.totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }



// src/pages/company/MyApplicationsPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyApplications } from "../../api/company/jobApplications";
import { getTestSessionStatus } from "../../api/test";
import MyApplicationCard from "../../components/company/MyApplicationCard";
import { showToast } from "../../utils/toast";

export default function MyApplicationsPage({ onViewJob }) {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const LIMIT = 6;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Memoized fetch function so we can pass it down
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyApplications(
        { page, limit: LIMIT, search: debouncedSearch },
        token
      );

      // Enrich with test session status
      const enriched = await Promise.all(
        data.applications.map(async (app) => {
          if (app.status === "assessment" && app.assessment?.status === "invited") {
            try {
              const statusRes = await getTestSessionStatus(app.job._id);
              return {
                ...app,
                testSessionStatus: statusRes,
              };
            } catch (err) {
              console.warn("Failed to fetch test status for job", app.job._id, err);
              return { ...app, testSessionStatus: { hasSession: false } };
            }
          }
          return { ...app, testSessionStatus: { hasSession: false } };
        })
      );

      setApplications(enriched);
      setPagination(data.pagination);
    } catch (err) {
      showToast(err.message || "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col gap-5">
      <input
        type="text"
        placeholder="Search jobs, company…"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="border rounded-lg px-4 py-2 w-full"
      />

      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse py-10 text-center">
          Loading your applications…
        </p>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold">No applications yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            When you apply to jobs, they’ll appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 mt-2 ">
            {applications.map((app) => (
              <MyApplicationCard
                key={app._id}
                application={app}
                onViewJob={onViewJob}
                onRefresh={fetchData}           // ← NEW: pass refresh function
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1 ? "bg-primary text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}