// import React, { useEffect, useState } from "react";
// import DeveloperFilters from "./DeveloperFilters";
// import DevelopersList from "./DevelopersList";
// import PublicProfile from "../../pages/User/PublicProfilePage";
// import { fetchConnections } from "../../api/connections";

// export default function AllUsersWithProfile() {
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Lifted state from AllUsers
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     name: "",
//     role: "",
//     skill: "",
//     experience: "",
//     sort: "recent",
//   });

//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       const query = [filters.name, filters.role, filters.skill]
//         .filter(Boolean)
//         .join(" ");

//       const data = await fetchConnections({
//         q: query,
//         sort: filters.sort,
//         limit: 200,
//       });

//       let filtered = data.items || [];
//       if (filters.experience) {
//         filtered = filtered.filter((u) => u.experienceLevel === filters.experience);
//       }

//       setUsers(filtered);
//     } catch (err) {
//       console.error("Failed to load users", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadUsers();
//   }, [filters]);

//   const clearFilters = () =>
//     setFilters({ name: "", role: "", skill: "", experience: "", sort: "recent" });

//   return (
//     <div className="flex gap-6 w-full">
//       {/* Left Panel */}
//       <div
//         className={`flex-shrink-0 flex flex-col gap-4 transition-all duration-500 ease-in-out
//           ${selectedUser ? "w-1/2 translate-x-[-20%] opacity-70" : "w-1/2"}`}
//       >
//         <DeveloperFilters
//           filters={filters}
//           setFilters={setFilters}
//           clearFilters={clearFilters}
//           minimal={!!selectedUser}
//         />
//         <DevelopersList
//           users={users}
//           loading={loading}
//           onUserClick={(u) => setSelectedUser(u)}
//         />
//       </div>

//       {/* Right Panel */}
//       <div className={`flex-grow transition-all duration-500 ease-in-out`}>
//         {!selectedUser ? (
//           <p className="text-gray-500 dark:text-gray-400">Select a developer to view profile</p>
//         ) : (
//           <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl shadow-lg">
//             <button
//               onClick={() => setSelectedUser(null)}
//               className="mb-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
//             >
//               ← Back to list
//             </button>
//             <PublicProfile user={selectedUser} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// // src/components/networking/AllUsersWithProfile.jsx
// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate, useParams } from "react-router-dom";
// import DeveloperFilters from "./DeveloperFilters";
// import DevelopersList from "./DevelopersList";
// import { fetchConnections } from "../../api/connections";

// export default function AllUsersWithProfile() {
//   const navigate = useNavigate();
//   const { userId } = useParams(); // present when a profile is open

//   // ------------------- state -------------------
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     name: "",
//     role: "",
//     skill: "",
//     experience: "",
//     sort: "recent",
//   });

//   // ------------------- load users -------------------
//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       const query = [filters.name, filters.role, filters.skill]
//         .filter(Boolean)
//         .join(" ");
//       const data = await fetchConnections({ q: query, sort: filters.sort, limit: 200 });
//       let filtered = data.items || [];
//       if (filters.experience) {
//         filtered = filtered.filter(u => u.experienceLevel === filters.experience);
//       }
//       setUsers(filtered);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, [filters]);

//   // ------------------- helpers -------------------
//   const clearFilters = () =>
//     setFilters({ name: "", role: "", skill: "", experience: "", sort: "recent" });

//   const onUserClick = (user) =>
//     navigate(`${user._id}`, { relative: true }); // relative navigation to nested route

//   const goBack = () => navigate("/dashboard/community/all-users");

//   // ------------------- render -------------------
//   return (
//     <div className="flex gap-6 w-full h-full">
//       {/* ---------- LEFT: FILTERS ---------- */}
//       <aside className="w-64 flex-shrink-0">
//         <DeveloperFilters
//           filters={filters}
//           setFilters={setFilters}
//           clearFilters={clearFilters}
//         />
//       </aside>

//       {/* ---------- RIGHT: LIST OR PROFILE ---------- */}
//       <div className="flex-1 overflow-hidden">
//         {!userId ? (
//           // No profile open → show developers list
//           <DevelopersList
//             loading={loading}
//             users={users}
//             onUserClick={onUserClick}
//           />
//         ) : (
//           // Profile open → nested route renders here
//           <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg p-4 h-full overflow-y-auto">
//             <button
//               onClick={goBack}
//               className="mb-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
//             >
//               ← Back to list
//             </button>
//             <Outlet />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import DeveloperFilters from "./DeveloperFilters";
import DevelopersList from "./DevelopersList";
import { fetchConnections } from "../../api/connections";
import { ArrowLeft } from "lucide-react";

export default function AllUsersWithProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    skill: "",
    experience: "",
    sort: "recent",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const query = [filters.name, filters.role, filters.skill]
        .filter(Boolean)
        .join(" ");
      const data = await fetchConnections({
        q: query,
        sort: filters.sort,
        limit: 200,
      });
      let filtered = data.items || [];
      if (filters.experience) {
        filtered = filtered.filter((u) => u.experienceLevel === filters.experience);
      }
      setUsers(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const clearFilters = () =>
    setFilters({ name: "", role: "", skill: "", experience: "", sort: "recent" });

  //   const onUserClick = (user) => navigate(`${user._id}`, { relative: "path" });

  const onUserClick = (user) => {
    // Always navigate to absolute path to avoid duplicating IDs
    navigate(`/dashboard/community/${user._id}`);
  };

  const goBack = () => navigate("/dashboard/community");

  return (
    <div className="flex gap-6 w-full h-full">
      {/* LEFT: FILTERS + (optional) compact list */}
      {/* LEFT: FILTERS + (optional) compact list */}
      <aside className="flex flex-col gap-4 w-80 flex-shrink-0">
        {/* Filters – always sticky */}
        <div className={`
    sticky top-4
    ${userId ? "mb-6" : ""}   /* ← ADD MARGIN-BOTTOM when list is below */
  `}>
          <DeveloperFilters
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            compact={!!userId}
          />
        </div>

        {/* Compact list – only when profile is open */}
        {userId && (
          <div className="flex-1 overflow-y-auto pr-2">
            <DevelopersList
              loading={loading}
              users={users}
              onUserClick={onUserClick}
              compact={true}
            />
          </div>
        )}
      </aside>
      {/* RIGHT: Full list OR profile */}
      <main className="flex-1 overflow-hidden">
        {!userId ? (
          <DevelopersList
            loading={loading}
            users={users}
            onUserClick={onUserClick}
            compact={false}
          />
        ) : (
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg p-4 h-full overflow-y-auto">
            <button
              onClick={goBack}
              className="mb-4 flex items-center gap-1 text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}