// src/pages/User/CommunityExplore.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserCard from "../../components/networking/UserCard";
import { useConnections } from "../../context/ConnectionContext";
import { useSocket } from "../../context/SocketContext";
import {
  fetchExploreRecommendedUsers,
  fetchConnections,
} from "../../api/connections";

const lc = (v) => (v ?? "").toString().toLowerCase().trim();

const matchesUser = (user, q) => {
  const query = lc(q);
  if (!query) return true;

  const haystack = [
    user?.name,
    user?.primaryRole,
    user?.experienceLevel,
    ...(Array.isArray(user?.topSkills) ? user.topSkills : []),
  ]
    .map(lc)
    .join(" ");

  return haystack.includes(query);
};

function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-7 w-7 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
    </div>
  );
}

export default function CommunityExplore() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const {
    connections,
    pendingSentIds,
    setConnection,
    updateConnection,
    markOptimisticSent,
    removeOptimisticSent,
  } = useConnections();

  const [loading, setLoading] = useState(false); // only for initial explore load
  const [isSearching, setIsSearching] = useState(false); // ✅ small indicator only (no loader)
  const [query, setQuery] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [remoteResults, setRemoteResults] = useState([]);
  const [hasFetchedRemote, setHasFetchedRemote] = useState(false);

  const goToProfile = (id) => navigate(`/dashboard/community/${id}`);

  const loadExplore = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchExploreRecommendedUsers(30);
      const items = data?.items || [];

      const normalized = items.map((u) => {
        const id = String(u._id || u.userId);
        if (u?.connection) setConnection(id, u.connection);

        return {
          ...u,
          _id: id,
          userId: id,
        };
      });

      setRecommended(normalized);
    } catch (e) {
      console.error("Explore load error:", e);
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  }, [setConnection]);

  useEffect(() => {
    loadExplore();
  }, [loadExplore]);

  // ✅ Refresh explore when backend tells “connections changed”
  useEffect(() => {
    if (!socket) return;

    const onUpdated = () => loadExplore();
    socket.on("connections:updated", onUpdated);

    return () => socket.off("connections:updated", onUpdated);
  }, [socket, loadExplore]);

  // Local hide rule
  const isHiddenByLocalState = useCallback(
    (u) => {
      const id = String(u._id || u.userId);
      const c = connections[id] || u.connection;

      if (pendingSentIds?.has(id)) return true;
      if (c?.connectionStatus === "accepted") return true;
      if (c?.connectionStatus === "pending_sent") return true;
      if (c?.connectionStatus === "pending_received") return true;

      return false;
    },
    [connections, pendingSentIds]
  );

  // Local search (within recommended)
  const localVisible = useMemo(() => {
    const base = recommended.filter((u) => !isHiddenByLocalState(u));
    if (!query.trim()) return base;
    return base.filter((u) => matchesUser(u, query));
  }, [recommended, query, isHiddenByLocalState]);

  // ✅ Smart DB fallback search (NO list blinking, NO loader)
  useEffect(() => {
    const q = query.trim();

    // reset
    if (!q) {
      setRemoteResults([]);
      setHasFetchedRemote(false);
      setIsSearching(false);
      return;
    }

    // don’t search DB for 1 char
    if (q.length < 2) {
      setRemoteResults([]);
      setHasFetchedRemote(false);
      setIsSearching(false);
      return;
    }

    // If local matches exist, show them; don't hit backend
    if (localVisible.length > 0) {
      setRemoteResults([]);
      setHasFetchedRemote(false);
      setIsSearching(false);
      return;
    }

    let cancelled = false;

    // ✅ Debounce: API runs only after user stops typing
    const t = setTimeout(async () => {
      try {
        setIsSearching(true); // ✅ small indicator only (does NOT replace list)

        const data = await fetchConnections({
          q,
          limit: 20,
          sort: "recent",
          t: Date.now(),
        });

        if (cancelled) return;

        const items = Array.isArray(data?.items) ? data.items : [];

        const normalized = items.map((u) => {
          const id = String(u._id);
          if (u?.connection) setConnection(id, u.connection);
          return { ...u, _id: id, userId: id };
        });

        const filtered = normalized.filter((u) => !isHiddenByLocalState(u));
        setRemoteResults(filtered);
        setHasFetchedRemote(true);
      } catch (e) {
        if (!cancelled) {
          console.error("DB search failed:", e);
          setRemoteResults([]);
          setHasFetchedRemote(true);
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 400); // ✅ 400ms feels snappy and avoids constant calls

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, localVisible.length, setConnection, isHiddenByLocalState]);

  const q = query.trim();
  const showingRemote =
    q.length >= 2 && localVisible.length === 0 && hasFetchedRemote;

  const finalList = showingRemote ? remoteResults : localVisible;

  // Optimistic connect
  const onConnect = async (userId) => {
    const id = String(userId);

    setRecommended((prev) => prev.filter((u) => String(u._id) !== id));
    setRemoteResults((prev) => prev.filter((u) => String(u._id) !== id));

    markOptimisticSent(id);

    try {
      await updateConnection(id, "connect");
      removeOptimisticSent(id);
    } catch (e) {
      removeOptimisticSent(id);
      loadExplore();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow p-4">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-100 dark:bg-[#0a0a0a] dark:border-gray-700">
          <Search size={18} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent outline-none text-sm dark:text-white"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow p-5">
        {loading ? (
          <InlineLoader />
        ) : finalList.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            {q ? "No users found." : "No recommendations right now."}
          </div>
        ) : (
          <div className="space-y-3">
            {finalList.map((u) => (
              <UserCard
                key={u._id}
                user={u}
                onClick={() => goToProfile(u._id)}
                onConnect={() => onConnect(u._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
