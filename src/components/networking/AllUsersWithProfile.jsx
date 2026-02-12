// src/components/networking/AllUsersWithProfile.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import DevelopersList from "./DevelopersList";
import { fetchConnections } from "../../api/connections";
import { ArrowLeft } from "lucide-react";
import { useConnections } from "../../context/ConnectionContext";

export default function AllUsersWithProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { setConnection } = useConnections();
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
      const query = [filters.name, filters.role, filters.skill].filter(Boolean).join(" ");
      const data = await fetchConnections({
        q: query,
        sort: filters.sort,
        limit: 200,
        t: Date.now(),
      });
      let filtered = data.items || [];
      if (filters.experience) {
        filtered = filtered.filter((u) => u.experienceLevel === filters.experience);
      }
      setUsers(filtered);
      // Sync connection statuses to context
      filtered.forEach((user) => {
        if (user.connection) {
          setConnection(user._id, user.connection);
        }
      });
    } catch (e) {
      console.error("loadUsers error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters, setConnection]);

  const clearFilters = () =>
    setFilters({ name: "", role: "", skill: "", experience: "", sort: "recent" });

  const onUserClick = (user) => {
    navigate(`/dashboard/community/${user._id}`);
  };

  const goBack = () => navigate("/dashboard/community");

  return (
    <div className="flex gap-6 w-full h-full">
      <aside className="flex flex-col gap-4 w-80 flex-shrink-0">
        <div className={`sticky top-4 ${userId ? "mb-6" : ""}`}>
          <DeveloperFilters
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            compact={!!userId}
          />
        </div>
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