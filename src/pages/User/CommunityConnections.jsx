// src/pages/User/CommunityConnections.jsx
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { fetchConnections } from "../../api/connections";
import UserCard from "../../components/networking/UserCard";
import { useNavigate } from "react-router-dom";
import { useConnections } from "../../context/ConnectionContext";
import { useSocket } from "../../context/SocketContext"; // ⭐ NEW

export default function CommunityConnections() {
  const navigate = useNavigate();
  const { setConnection } = useConnections();
  const { socket } = useSocket(); // ⭐ NEW
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // <-- search query state

  const goToProfile = (id) => {
    navigate(`/dashboard/community/${id}`);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchConnections({ limit: 300, t: Date.now() });
      const items = data.items || [];
      setSentRequests(items.filter((u) => u.connection?.connectionStatus === "pending_sent"));
      setReceivedRequests(items.filter((u) => u.connection?.connectionStatus === "pending_received"));
      setConnectedUsers(items.filter((u) => u.connection?.connectionStatus === "accepted"));
      items.forEach((user) => {
        if (user.connection) {
          setConnection(user._id, user.connection);
        }
      });
    } catch (err) {
      console.error("loadData error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [setConnection]);



  // ⭐ Realtime: reload connections whenever backend emits "connections:updated"
  useEffect(() => {
    if (!socket) return;

    const handleConnectionsUpdated = () => {
      loadData();
    };

    socket.on("connections:updated", handleConnectionsUpdated);

    return () => {
      socket.off("connections:updated", handleConnectionsUpdated);
    };
  }, [socket]); 

  // Filtered connected users based on search query
  const filteredUsers = connectedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Bell size={20} /> Connection Notifications
      </h1>
      {loading && <p className="text-center">Loading connections...</p>}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Section title="Your Connections" count={filteredUsers.length}>
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search connections..."
              className="w-full mb-3 px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-[#0a0a0a] dark:border-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onClick={() => goToProfile(user._id)}
              />
            ))}
          </Section>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Section title="Pending Responses" count={sentRequests.length}>
            {sentRequests.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onClick={() => goToProfile(user._id)}
              />
            ))}
          </Section>
          <Section title="Requests For You" count={receivedRequests.length}>
            {receivedRequests.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onClick={() => goToProfile(user._id)}
              />
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">
        {title} <span className="text-gray-400 text-sm">({count})</span>
      </h2>
      <div className="space-y-3">
        {count === 0 ? <p className="text-gray-400">No records found.</p> : children}
      </div>
    </div>
  );
}
