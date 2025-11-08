// components/networking/AllUsers.jsx
import React, { useEffect, useState } from "react";
import { fetchConnections } from "../../api/connections";
import DeveloperFilters from "./DeveloperFilters";
import DevelopersList from "./DevelopersList";

export default function FindDevelopers() {
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
        filtered = filtered.filter(
          (u) => u.experienceLevel === filters.experience
        );
      }

      setUsers(filtered);
    } catch (err) {
      console.error("Failed to load users", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      name: "",
      role: "",
      skill: "",
      experience: "",
      sort: "recent",
    });
  };

  return (
    <div className="flex min-w-0 gap-6 pb-4">
      {/* Reusable Filter Component */}
      <DeveloperFilters
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
      />

      {/* Reusable List Component */}
      <DevelopersList loading={loading} users={users} />
    </div>
  );
}


