import React, { createContext, useContext, useState, useCallback } from "react";
import {
  sendRequest,
  acceptRequest,
  declineRequest,
  cancelRequest,
} from "../api/connections";

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connections, setConnections] = useState({}); // { userId: { connectionStatus, requestId, direction } }

  const updateConnection = useCallback(async (userId, actionType) => {
    const previousConnections = { ...connections };
    const current = connections[userId] || { connectionStatus: "none" };

    try {
      let newConnection = { ...current };

      if (actionType === "connect" && ["none", "cancelled", "declined"].includes(current.connectionStatus)) {
        // Optimistic update
        newConnection = { connectionStatus: "pending_sent", direction: "outgoing" };
        setConnections((prev) => ({ ...prev, [userId]: newConnection }));
        const newRequest = await sendRequest(userId);
        newConnection = {
          connectionStatus: newRequest.autoAcceptedFromInverse ? "accepted" : "pending_sent",
          requestId: newRequest.request._id,
          direction: "outgoing",
        };
      } else if (actionType === "accept" && current.connectionStatus === "pending_received") {
        newConnection = { connectionStatus: "accepted", requestId: current.requestId, direction: current.direction };
        setConnections((prev) => ({ ...prev, [userId]: newConnection }));
        await acceptRequest(current.requestId);
      } else if (actionType === "ignore" && current.connectionStatus === "pending_received") {
        newConnection = { connectionStatus: "declined", requestId: current.requestId, direction: current.direction };
        setConnections((prev) => ({ ...prev, [userId]: newConnection }));
        await declineRequest(current.requestId);
      } else if (actionType === "cancel" && current.connectionStatus === "pending_sent") {
        newConnection = { connectionStatus: "cancelled", requestId: current.requestId, direction: current.direction };
        setConnections((prev) => ({ ...prev, [userId]: newConnection }));
        await cancelRequest(current.requestId);
      }

      setConnections((prev) => ({ ...prev, [userId]: newConnection }));
      return newConnection;
    } catch (err) {
      console.error("updateConnection error:", err);
      setConnections(previousConnections);
      throw err;
    }
  }, [connections]);

  const setConnection = useCallback((userId, connection) => {
    setConnections((prev) => ({ ...prev, [userId]: connection }));
  }, []);

  return (
    <ConnectionContext.Provider value={{ connections, updateConnection, setConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnections must be used within a ConnectionProvider");
  }
  return context;
};