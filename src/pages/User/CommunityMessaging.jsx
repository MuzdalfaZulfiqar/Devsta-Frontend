// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import MessageBubble from "../../components/messaging/MessageBubble";
// import MessageInput from "../../components/messaging/MessageInput";
// import { fetchConnections } from "../../api/connections";
// import ChatHeader from "../../components/messaging/ChatHeader";
// import UserCard from "../../components/networking/UserCard";
// import { useLocation } from "react-router-dom";
// import {
//   getOrCreateDirectConversation,
//   getMessages,
//   listConversations,
// } from "../../api/chat";
// import { BACKEND_URL } from "../../../config";

// export default function CommunityMessaging() {
//   const [connectedUsers, setConnectedUsers] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const socketRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const selectedConversationRef = useRef(null);
//   const location = useLocation();
//   const targetUserId = location.state?.targetUserId;

//   const currentUser = JSON.parse(localStorage.getItem("devsta_user") || "{}");
//   const currentUserId = currentUser._id?.toString();

//   const scrollRef = useRef(null);
//   const leftContainerRef = useRef(null);
//   const [showScrollArrow, setShowScrollArrow] = useState(false);
//   const [search, setSearch] = useState("");


//   useEffect(() => {
//     if (targetUserId && connectedUsers.length > 0) {
//       openChat(targetUserId);
//     }
//   }, [targetUserId, connectedUsers]);
//   useEffect(() => {
//     if (scrollRef.current) {
//       setShowScrollArrow(
//         scrollRef.current.scrollTop + scrollRef.current.clientHeight <
//         scrollRef.current.scrollHeight
//       );
//     }
//   }, [connectedUsers]);


//   // Keep ref updated for socket listener
//   useEffect(() => {
//     selectedConversationRef.current = selectedConversation?._id;
//   }, [selectedConversation]);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTop = container.scrollHeight;
//     }
//   }, [messages]);

//   // Load connections and setup socket
//   useEffect(() => {
//     loadConnectedUsers();
//     setupSocket();

//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, []);
//   const getOtherUser = () => {
//     if (!selectedConversation) return null;

//     // Get the other participant's ID
//     const otherUserId = selectedConversation.participants.find(
//       (id) => id !== currentUserId
//     );

//     // Find full user object from your loaded connections
//     return connectedUsers.find((u) => u._id === otherUserId) || null;
//   };


//   const setupSocket = async () => {
//     socketRef.current = io(BACKEND_URL, {
//       auth: { token: localStorage.getItem("devsta_token") },
//     });

//     const convos = await listConversations();
//     convos.forEach((c) => {
//       socketRef.current.emit("joinConversation", c._id);
//     });

//     socketRef.current.on("newMessage", (msg) => {
//       if (msg.conversation !== selectedConversationRef.current) return;

//       setMessages((prev) => {
//         if (prev.some((m) => m._id === msg._id)) return prev;

//         const tempIndex = prev.findIndex(
//           (m) => m._id.startsWith("temp-") && m.text === msg.text
//         );
//         if (tempIndex !== -1) {
//           const newMessages = [...prev];
//           newMessages[tempIndex] = msg;
//           return newMessages;
//         }

//         return [...prev, msg];
//       });
//     });
//   };

//   const loadConnectedUsers = async () => {
//     try {
//       const data = await fetchConnections({ limit: 200 });
//       const items = data.items || [];
//       setConnectedUsers(
//         items.filter((u) => u.connection?.connectionStatus === "accepted")
//       );
//     } catch (err) {
//       console.error("Error fetching connections:", err);
//     }
//   };

//   const openChat = async (userId) => {
//     try {
//       const convo = await getOrCreateDirectConversation(userId);
//       setSelectedConversation(convo);

//       socketRef.current?.emit("joinConversation", convo._id);

//       const msgs = await getMessages(convo._id);
//       setMessages(msgs);
//     } catch (err) {
//       console.error("Error opening chat:", err);
//     }
//   };

//   const handleSend = async (text) => {
//     if (!text.trim() || !selectedConversation) return;

//     const tempId = `temp-${Date.now()}`;
//     const optimisticMsg = {
//       _id: tempId,
//       text: text.trim(),
//       sender: { _id: currentUserId },
//       createdAt: new Date(),
//       conversation: selectedConversation._id,
//     };

//     setMessages((prev) => [...prev, optimisticMsg]);

//     socketRef.current?.emit("sendMessage", {
//       conversationId: selectedConversation._id,
//       text: text.trim(),
//     });
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 h-[72vh] gap-4">
//       {/* LEFT: Connections */}

//       <div
//         className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 h-[75vh] flex flex-col relative overflow-hidden"
//         ref={leftContainerRef}
//       >
//         <h2 className="text-lg font-semibold mb-3">Your Connections</h2>

//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search connections..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="mb-3 w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-100 dark:bg-gray-800"
//         />

//         <div
//           className="flex-1 overflow-y-auto pr-2 no-scrollbar"
//           ref={scrollRef}
//           onScroll={() => {
//             if (scrollRef.current) {
//               setShowScrollArrow(
//                 scrollRef.current.scrollTop + scrollRef.current.clientHeight <
//                 scrollRef.current.scrollHeight
//               );
//             }
//           }}
//         >
//           <div className="space-y-2">
//             {connectedUsers
//               .filter((user) =>
//                 user.name.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((user) => {
//                 const isActive = selectedConversation?.participants?.some(
//                   (p) => p._id === user._id || p === user._id
//                 );
//                 return (
//                   <UserCard
//                     key={user._id}
//                     user={user}
//                     compact
//                     simple
//                     active={isActive}
//                     onClick={() => openChat(user._id)}
//                   />
//                 );
//               })}
//             {connectedUsers.filter((user) =>
//               user.name.toLowerCase().includes(search.toLowerCase())
//             ).length === 0 && (
//                 <p className="text-gray-400 text-sm text-center mt-2">No connections found</p>
//               )}
//           </div>
//         </div>

//         {/* Soft Teal Gradient Fade */}
//         {scrollRef.current &&
//           scrollRef.current.scrollHeight > scrollRef.current.clientHeight && (
//             <div
//               className="pointer-events-none absolute bottom-0 left-0 w-full h-12 rounded-b-2xl"
//               style={{
//                 background: `linear-gradient(to top, rgba(8,105,114,0.15), rgba(8,105,114,0.05), transparent)`,
//               }}
//             />
//           )}
//       </div>


//       {/* RIGHT: Chat */}

//       <div className="md:col-span-3 bg-white dark:bg-[#0a0a0a] rounded-xl flex flex-col h-[75vh]">
//         {!selectedConversation ? (
//           <p className="text-gray-400 text-center my-auto">
//             Select a user to start chatting
//           </p>
//         ) : (
//           <>
//             {selectedConversation && <ChatHeader user={getOtherUser()} />}
//             {/* Messages container */}
//             <div
//               className="flex-1 p-3 overflow-y-auto flex flex-col space-y-3"
//               ref={messagesContainerRef}
//             >
//               {messages.map((msg, idx) => (
//                 <MessageBubble
//                   key={(msg._id || `temp-${idx}`) + "-" + idx}
//                   msg={msg}
//                   currentUserId={currentUserId}
//                   otherUser={selectedConversation.participants?.find(
//                     (p) => p._id !== currentUserId
//                   )}
//                 />
//               ))}
//             </div>

//             {/* Input stays at bottom */}
//             <div className="p-3 border-t">
//               <MessageInput onSend={handleSend} />
//             </div>
//           </>
//         )}
//       </div>

//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MessageBubble from "../../components/messaging/MessageBubble";
import MessageInput from "../../components/messaging/MessageInput";
import { fetchConnections } from "../../api/connections";
import ChatHeader from "../../components/messaging/ChatHeader";
import UserCard from "../../components/networking/UserCard";
import { useLocation } from "react-router-dom";
import {
  getOrCreateDirectConversation,
  getMessages,
  listConversations,
} from "../../api/chat";
import { BACKEND_URL } from "../../../config";

export default function CommunityMessaging() {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const location = useLocation();
  const targetUserId = location.state?.targetUserId;

  const currentUser = JSON.parse(localStorage.getItem("devsta_user") || "{}");
  const currentUserId = currentUser._id?.toString();

  const scrollRef = useRef(null);
  const leftContainerRef = useRef(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (targetUserId && connectedUsers.length > 0) {
      openChat(targetUserId);
    }
  }, [targetUserId, connectedUsers]);

  useEffect(() => {
    if (scrollRef.current) {
      setShowScrollArrow(
        scrollRef.current.scrollTop + scrollRef.current.clientHeight <
          scrollRef.current.scrollHeight
      );
    }
  }, [connectedUsers]);

  // Keep ref updated for socket listener
  useEffect(() => {
    selectedConversationRef.current = selectedConversation?._id;
  }, [selectedConversation]);

  // Auto-scroll to latest message
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Load connections and setup socket
  useEffect(() => {
    loadConnectedUsers();
    setupSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const getOtherUser = () => {
    if (!selectedConversation) return null;

    const otherUserId = selectedConversation.participants.find(
      (id) => id !== currentUserId && id?._id !== currentUserId
    );

    return (
      connectedUsers.find((u) => u._id === otherUserId || u._id === otherUserId?._id) ||
      null
    );
  };

  const setupSocket = async () => {
    socketRef.current = io(BACKEND_URL, {
      auth: { token: localStorage.getItem("devsta_token") },
    });

    const convos = await listConversations();
    convos.forEach((c) => {
      socketRef.current.emit("joinConversation", c._id);
    });

    socketRef.current.on("newMessage", (msg) => {
      if (msg.conversation !== selectedConversationRef.current) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;

        const tempIndex = prev.findIndex(
          (m) => m._id?.toString().startsWith("temp-") && m.text === msg.text
        );
        if (tempIndex !== -1) {
          const newMessages = [...prev];
          newMessages[tempIndex] = msg;
          return newMessages;
        }

        return [...prev, msg];
      });
    });
  };

  const loadConnectedUsers = async () => {
    try {
      const data = await fetchConnections({ limit: 200 });
      const items = data.items || [];
      setConnectedUsers(
        items.filter((u) => u.connection?.connectionStatus === "accepted")
      );
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  const openChat = async (userId) => {
    try {
      const convo = await getOrCreateDirectConversation(userId);
      setSelectedConversation(convo);

      socketRef.current?.emit("joinConversation", convo._id);

      const msgs = await getMessages(convo._id);
      setMessages(msgs);
    } catch (err) {
      console.error("Error opening chat:", err);
    }
  };

  // Helper: upload media to backend (Cloudinary)
  const uploadMessageMedia = async (file) => {
    const token = localStorage.getItem("devsta_token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BACKEND_URL}/api/upload/message-media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload media");
    }

    return res.json(); // { url, type, mimeType, originalName, size, cloudinaryPublicId }
  };

  // UPDATED: handle text + optional file
  const handleSend = async ({ text, file }) => {
    if (!selectedConversation) return;
    if (!text?.trim() && !file) return;

    let media = null;

    try {
      if (file) {
        media = await uploadMessageMedia(file);
      }

      const tempId = `temp-${Date.now()}`;
      const optimisticMsg = {
        _id: tempId,
        text: text?.trim() || "",
        media,
        sender: { _id: currentUserId },
        createdAt: new Date().toISOString(),
        conversation: selectedConversation._id,
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      socketRef.current?.emit("sendMessage", {
        conversationId: selectedConversation._id,
        text: text?.trim() || "",
        media,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      // TODO: show toast / error state
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-[72vh] gap-4">
      {/* LEFT: Connections */}
      <div
        className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 h-[75vh] flex flex-col relative overflow-hidden"
        ref={leftContainerRef}
      >
        <h2 className="text-lg font-semibold mb-3">Your Connections</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search connections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-100 dark:bg-gray-800"
        />

        <div
          className="flex-1 overflow-y-auto pr-2 no-scrollbar"
          ref={scrollRef}
          onScroll={() => {
            if (scrollRef.current) {
              setShowScrollArrow(
                scrollRef.current.scrollTop +
                  scrollRef.current.clientHeight <
                  scrollRef.current.scrollHeight
              );
            }
          }}
        >
          <div className="space-y-2">
            {connectedUsers
              .filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => {
                const isActive = selectedConversation?.participants?.some(
                  (p) => p._id === user._id || p === user._id
                );
                return (
                  <UserCard
                    key={user._id}
                    user={user}
                    compact
                    simple
                    active={isActive}
                    onClick={() => openChat(user._id)}
                  />
                );
              })}
            {connectedUsers.filter((user) =>
              user.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-2">
                No connections found
              </p>
            )}
          </div>
        </div>

        {/* Soft Teal Gradient Fade */}
        {scrollRef.current &&
          scrollRef.current.scrollHeight > scrollRef.current.clientHeight && (
            <div
              className="pointer-events-none absolute bottom-0 left-0 w-full h-12 rounded-b-2xl"
              style={{
                background:
                  "linear-gradient(to top, rgba(8,105,114,0.15), rgba(8,105,114,0.05), transparent)",
              }}
            />
          )}
      </div>

      {/* RIGHT: Chat */}
      <div className="md:col-span-3 bg-white dark:bg-[#0a0a0a] rounded-xl flex flex-col h-[75vh]">
        {!selectedConversation ? (
          <p className="text-gray-400 text-center my-auto">
            Select a user to start chatting
          </p>
        ) : (
          <>
            {selectedConversation && <ChatHeader user={getOtherUser()} />}
            {/* Messages container */}
            <div
              className="flex-1 p-3 overflow-y-auto flex flex-col space-y-3"
              ref={messagesContainerRef}
            >
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={(msg._id || `temp-${idx}`) + "-" + idx}
                  msg={msg}
                  currentUserId={currentUserId}
                />
              ))}
            </div>

            {/* Input stays at bottom */}
            <div className="p-3 border-t">
              <MessageInput onSend={handleSend} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
