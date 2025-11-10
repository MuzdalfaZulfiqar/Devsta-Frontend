// src/hooks/useRoleMap.js
import { useState, useEffect } from "react";
import { fetchRoles } from "../api/roles";

let cachedRoles = null; // 🌟 simple global cache

export function useRoleMap() {
  const [roleMap, setRoleMap] = useState(cachedRoles || {});

  useEffect(() => {
    if (!cachedRoles) {
      fetchRoles().then((roles) => {
        const map = {};
        roles.forEach((r) => (map[r.key.toLowerCase()] = r.label));
        cachedRoles = map; // cache globally
        setRoleMap(map);
      });
    }
  }, []);

  const formatRole = (role) => {
    if (!role) return "Developer";
    if (roleMap[role.toLowerCase()]) return roleMap[role.toLowerCase()];
    return role.replace(/-/g, " ").replace(/^custom:/i, "");
  };

  return { formatRole };
}
