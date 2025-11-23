
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
  
    // 🔍 Helper: compute how many chats have an unread last message for this user
    const computeUnreadChats = (convos) => {
      try {
        const stored = localStorage.getItem("devsta_user");
        const currentUserId = stored ? JSON.parse(stored)._id : null;
  
        if (!currentUserId) {
          setUnreadChatsCount(0);
          return;
        }
  
        const unseen = convos.filter((c) => {
          const last = c.lastMessage;
          if (!last) return false;
  
          // last.readBy can be an array of ids or populated docs
          const readBy = Array.isArray(last.readBy) ? last.readBy : [];
          const readIds = readBy.map((id) => {
            if (!id) return "";
            if (typeof id === "object" && id._id) {
              return id._id.toString();
            }
            return id.toString();
          });
  
          // If current user is NOT in readBy → this chat has unread messages
          return !readIds.includes(currentUserId);
        }).length;
  
        setUnreadChatsCount(unseen);
      } catch (err) {
        console.error("computeUnreadChats error:", err);
        setUnreadChatsCount(0);
      }
    };
  
    const loadConversations = useCallback(async () => {
      try {
        const convos = await listConversations();
        setConversations(convos);
        computeUnreadChats(convos);
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
  
      // Whenever any new message arrives, refresh conversations
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
  