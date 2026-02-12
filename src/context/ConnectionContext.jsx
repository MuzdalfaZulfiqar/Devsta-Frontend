// src/context/ConnectionContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { sendRequest, acceptRequest, declineRequest, cancelRequest } from "../api/connections";

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connections, setConnections] = useState({});
  const [pendingSentIds, setPendingSentIds] = useState(() => new Set());

  const setConnection = useCallback((userId, connection) => {
    setConnections((prev) => ({ ...prev, [userId]: connection }));
  }, []);

  const markOptimisticSent = useCallback((userId) => {
    setPendingSentIds((prev) => new Set([...prev, String(userId)]));
  }, []);

  const removeOptimisticSent = useCallback((userId) => {
    setPendingSentIds((prev) => {
      const next = new Set(prev);
      next.delete(String(userId));
      return next;
    });
  }, []);

  const updateConnection = useCallback(async (userId, actionType) => {
    const uid = String(userId);

    // snapshot for rollback (per user)
    let prevConn;
    setConnections((prev) => {
      prevConn = prev[uid] || { connectionStatus: "none" };
      return prev;
    });

    try {
      if (actionType === "connect") {
        // optimistic
        setConnections((prev) => ({
          ...prev,
          [uid]: { connectionStatus: "pending_sent", direction: "outgoing" },
        }));
        markOptimisticSent(uid);

        const newRequest = await sendRequest(uid);

        const accepted = !!newRequest?.autoAcceptedFromInverse;
        const requestId = newRequest?.request?._id;

        setConnections((prev) => ({
          ...prev,
          [uid]: {
            connectionStatus: accepted ? "accepted" : "pending_sent",
            requestId,
            direction: "outgoing",
          },
        }));

        if (accepted) removeOptimisticSent(uid);
        return;
      }

      if (actionType === "accept") {
        const current = connections[uid];
        if (!current?.requestId) return;

        setConnections((prev) => ({
          ...prev,
          [uid]: { ...prev[uid], connectionStatus: "accepted" },
        }));
        await acceptRequest(current.requestId);
        return;
      }

      if (actionType === "ignore") {
        const current = connections[uid];
        if (!current?.requestId) return;

        setConnections((prev) => ({
          ...prev,
          [uid]: { ...prev[uid], connectionStatus: "declined" },
        }));
        await declineRequest(current.requestId);
        return;
      }

      if (actionType === "cancel") {
        const current = connections[uid];
        if (!current?.requestId) return;

        setConnections((prev) => ({
          ...prev,
          [uid]: { ...prev[uid], connectionStatus: "cancelled" },
        }));
        await cancelRequest(current.requestId);
        removeOptimisticSent(uid);
        return;
      }
    } catch (err) {
      console.error("updateConnection error:", err);

      // rollback only this user
      setConnections((prev) => ({ ...prev, [uid]: prevConn }));
      removeOptimisticSent(uid);
      throw err;
    }
  }, [connections, markOptimisticSent, removeOptimisticSent]);

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        pendingSentIds,
        setConnection,
        updateConnection,
        markOptimisticSent,
        removeOptimisticSent,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = () => {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnections must be used within a ConnectionProvider");
  return ctx;
};
