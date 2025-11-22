// src/context/SocketContext.jsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
  } from "react";
  import { io } from "socket.io-client";
  import { BACKEND_URL } from "../../config";
  import { listConversations } from "../api/chat";
  
  const SocketContext = createContext(null);
  
  export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
  
    const [conversations, setConversations] = useState([]);
    const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  
    const loadConversations = useCallback(async () => {
      try {
        const convos = await listConversations();
        setConversations(convos);
  
        const unseen = convos.filter((c) => (c.unreadCount || 0) > 0).length;
        setUnreadChatsCount(unseen);
      } catch (err) {
        console.error("SocketContext loadConversations error:", err);
      }
    }, []);
  
    useEffect(() => {
      const token = localStorage.getItem("devsta_token");
      if (!token) return;
  
      const s = io(BACKEND_URL, {
        auth: { token },
      });
  
      setSocket(s);
  
      s.on("connect", () => {
        setIsConnected(true);
        loadConversations(); // initial fetch
      });
  
      s.on("disconnect", () => {
        setIsConnected(false);
      });
  
      // When any message arrives (for any convo), refresh
      s.on("newMessage", () => {
        loadConversations();
      });
  
      return () => {
        s.off("newMessage");
        s.disconnect();
      };
    }, [loadConversations]);
  
    const value = {
      socket,
      isConnected,
      conversations,
      setConversations,
      unreadChatsCount,
      reloadConversations: loadConversations,
    };
  
    return (
      <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    );
  }
  
  export function useSocket() {
    return useContext(SocketContext);
  }
  