// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import MessageBubble from "../../components/messaging/MessageBubble";
// import MessageInput from "../../components/messaging/MessageInput";
// import ChatHeader from "../../components/messaging/ChatHeader";
// import UserCard from "../../components/networking/UserCard";
// import GroupCard from "../../components/messaging/GroupCard";
// import CreateGroupModal from "../../components/messaging/CreateGroupModal";
// import { useLocation } from "react-router-dom";
// import {
//   getOrCreateDirectConversation,
//   getMessages,
//   listConversations,
//   createGroupConversation,
// } from "../../api/chat";
// import { fetchConnections } from "../../api/connections";
// import { BACKEND_URL } from "../../../config";
// import GroupSettingsModal from "../../components/messaging/GroupSettingsModal";

// export default function CommunityMessaging() {
//   const [connectedUsers, setConnectedUsers] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [isSending, setIsSending] = useState(false);

//   const [showGroupModal, setShowGroupModal] = useState(false);

//   const socketRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const selectedConversationRef = useRef(null);
//   const scrollRef = useRef(null);
//   const leftContainerRef = useRef(null);

//   const location = useLocation();
//   const targetUserId = location.state?.targetUserId;

//   const currentUser = JSON.parse(localStorage.getItem("devsta_user") || "{}");
//   const currentUserId = currentUser._id?.toString();

//   const [showScrollArrow, setShowScrollArrow] = useState(false);
//   const [search, setSearch] = useState("");
//   const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);

//   // --- Effects ---
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

//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (container) container.scrollTop = container.scrollHeight;
//   }, [messages]);

//   useEffect(() => {
//     loadConnectedUsers();
//     loadConversations();
//     setupSocket();
//     return () => socketRef.current?.disconnect();
//   }, []);

//   // --- Socket ---
//   const setupSocket = async () => {
//     socketRef.current = io(BACKEND_URL, {
//       auth: { token: localStorage.getItem("devsta_token") },
//     });

//     conversations.forEach((c) => {
//       socketRef.current.emit("joinConversation", c._id);
//     });

//     socketRef.current.on("newMessage", (msg) => {
//       if (msg.conversation !== selectedConversationRef.current) return;

//       setMessages((prev) => {
//         if (prev.some((m) => m._id === msg._id)) return prev;
//         return [...prev, msg];
//       });
//     });
//   };

//   // --- Load data ---
//   const loadConnectedUsers = async () => {
//     try {
//       const data = await fetchConnections({ limit: 200 });
//       setConnectedUsers(
//         (data.items || []).filter(
//           (u) => u.connection?.connectionStatus === "accepted"
//         )
//       );
//     } catch (err) {
//       console.error("Error fetching connections:", err);
//     }
//   };

//   const loadConversations = async () => {
//     try {
//       const convos = await listConversations();
//       setConversations(convos);
//     } catch (err) {
//       console.error("Error loading conversations:", err);
//     }
//   };

//   // --- Chat helpers ---
//   const getOtherUser = () => {
//     if (!selectedConversation) return null;
//     if (selectedConversation.type === "group") return null;

//     const otherUserId = selectedConversation.participants.find(
//       (id) => id !== currentUserId
//     );
//     return connectedUsers.find((u) => u._id === otherUserId) || null;
//   };

//   const openChat = async (conversationOrUser) => {
//     try {
//       let convo;
//       if (conversationOrUser.type) {
//         // It's a group conversation
//         convo = conversationOrUser;
//       } else {
//         // It's a user -> direct chat
//         convo = await getOrCreateDirectConversation(conversationOrUser);
//       }

//       setSelectedConversation(convo);
//       socketRef.current?.emit("joinConversation", convo._id);

//       const msgs = await getMessages(convo._id);
//       setMessages(msgs);
//     } catch (err) {
//       console.error("Error opening chat:", err);
//     }
//   };

//   // Upload media to backend (Cloudinary) for images/videos
//   const uploadMessageMedia = async (file) => {
//     const token = localStorage.getItem("devsta_token");
//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch(`${BACKEND_URL}/api/upload/message-media`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (!res.ok) {
//       throw new Error("Failed to upload media");
//     }

//     return res.json(); // { url, type, mimeType, originalName, size, cloudinaryPublicId }
//   };

//   // handle text + optional multiple files
//   const handleSend = async ({ text, files }) => {
//     if (!selectedConversation) return;
//     const trimmed = text?.trim() || "";
//     const hasFiles = Array.isArray(files) && files.length > 0;

//     if (!trimmed && !hasFiles) return;

//     try {
//       setIsSending(true);

//       // CASE 1: Only text (no files) -> socket
//       if (!hasFiles) {
//         socketRef.current?.emit("sendMessage", {
//           conversationId: selectedConversation._id,
//           text: trimmed,
//         });
//         return;
//       }

//       // CASE 2: One or more images/videos
//       await Promise.all(
//         files.map(async (file, index) => {
//           const mime = (file.type || "").toLowerCase();
//           const isImage = mime.startsWith("image/");
//           const isVideo = mime.startsWith("video/");

//           if (!isImage && !isVideo) {
//             console.warn("Unsupported file type. Only images/videos are allowed.", file.type);
//             return;
//           }

//           const mediaFromServer = await uploadMessageMedia(file);

//           const forcedType = isImage ? "image" : "video";

//           socketRef.current?.emit("sendMessage", {
//             conversationId: selectedConversation._id,
//             // Attach text only with the first media to avoid repetition
//             text: index === 0 ? trimmed : "",
//             media: {
//               ...mediaFromServer,
//               type: forcedType, // force correct media type for client rendering
//             },
//           });
//         })
//       );
//     } catch (err) {
//       console.error("Error sending message:", err);
//       // TODO: show toast
//     } finally {
//       setIsSending(false);
//     }
//   };


//   const handleCreateGroup = async (name, memberIds) => {
//     try {
//       const newGroup = await createGroupConversation(name, memberIds);

//       // Map participant IDs → full user objects
//       newGroup.participants = newGroup.participants.map(id => {
//         return connectedUsers.find(u => u._id === id) || { _id: id };
//       });

//       setConversations((prev) => [newGroup, ...prev]);
//       setShowGroupModal(false);
//       openChat(newGroup);

//       // 🔥 Show toast after backend success
//       import("../../utils/toast").then(({ showToast }) =>
//         showToast("Group created successfully!")
//       );

//     } catch (err) {
//       console.error("Error creating group:", err);

//       import("../../utils/toast").then(({ showToast }) =>
//         showToast("Failed to create group", 3500)
//       );
//     }
//   };


//   // --- Filtered lists ---
//   const filteredUsers = connectedUsers.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const filteredConversations = conversations.filter((c) => {
//     if (c.type === "group") return c.name.toLowerCase().includes(search.toLowerCase());
//     const otherUser = c.participants.find((p) => p._id !== currentUserId);
//     return otherUser?.name.toLowerCase().includes(search.toLowerCase());
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 h-[72vh] gap-4">
//       {/* LEFT: Connections + Groups */}
//       <div
//         className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 h-[75vh] flex flex-col relative overflow-hidden"
//         ref={leftContainerRef}
//       >
//         <div className="flex justify-between items-center mb-3">
//           <h2 className="text-lg font-semibold">Your Connections</h2>
//           <button
//             className="text-primary font-semibold text-sm"
//             onClick={() => setShowGroupModal(true)}
//           >
//             + Group
//           </button>
//         </div>

//         <input
//           type="text"
//           placeholder="Search..."
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
//   {filteredConversations.map((c, idx) => {
//     const isActive = selectedConversation?._id === c._id;

//     if (c.type === "group") {
//       return (
//         <GroupCard
//           key={c._id || `group-${idx}`}
//           group={c}
//           currentUserId={currentUserId}
//           active={isActive}
//           onClick={() => openChat(c)}
//         />
//       );
//     } else {
//       // --- FIXED: map direct conversation to full user object ---
//       const otherParticipantId = c.participants.find(
//         (p) => p._id !== currentUserId
//       )?._id;

//       const otherUser = connectedUsers.find(
//         (u) => u._id === otherParticipantId
//       );

//       if (!otherUser) return null; // safeguard if user not in connections

//       return (
//         <UserCard
//           key={otherUser._id || `user-${idx}`}
//           user={otherUser} // full user object now
//           compact
//           simple
//           active={isActive}
//           onClick={() => openChat(otherUser._id)}
//         />
//       );
//     }
//   })}

//   {filteredConversations.length === 0 && (
//     <p className="text-gray-400 text-sm text-center mt-2">No results found</p>
//   )}
// </div>


//         </div>
//       </div>

//       {/* RIGHT: Chat */}
//       <div className="md:col-span-3 bg-white dark:bg-[#0a0a0a] rounded-xl flex flex-col h-[75vh]">
//         {!selectedConversation ? (
//           <p className="text-gray-400 text-center my-auto">
//             Select a user or group to start chatting
//           </p>
//         ) : (
//           <>
//             {selectedConversation && (
//               <ChatHeader
//                 user={getOtherUser()}
//                 group={selectedConversation.type === "group" ? selectedConversation : null}
//                 onOpenGroupSettings={() => setShowGroupSettingsModal(true)}
//               />

//             )}
//             <div
//               className="flex-1 p-3 overflow-y-auto flex flex-col space-y-3"
//               ref={messagesContainerRef}
//             >
//               {messages.map((msg, idx) => (
//                 <MessageBubble
//                   key={(msg._id || `temp-${idx}`) + "-" + idx}
//                   msg={msg}
//                   currentUserId={currentUserId}
//                 />
//               ))}
//             </div>
//             <div className="p-3 border-t">
//               <MessageInput onSend={handleSend} isSending={isSending} />
//             </div>
//           </>
//         )}
//       </div>
//       {showGroupSettingsModal && selectedConversation?.type === "group" && (
//         <GroupSettingsModal
//           groupId={selectedConversation._id}
//           onClose={() => setShowGroupSettingsModal(false)}
//           connectedUsers={connectedUsers}
//           onGroupUpdate={(updatedGroup) => {
//             // Update selected conversation
//             setSelectedConversation((prev) => ({
//               ...prev,
//               name: updatedGroup.groupName,
//               participants: updatedGroup.members,
//             }));

//             // Update the conversation list
//             setConversations((prev) =>
//               prev.map((c) =>
//                 c._id === updatedGroup._id
//                   ? { ...c, name: updatedGroup.groupName, participants: updatedGroup.members }
//                   : c
//               )
//             );
           
//           }}

//           refreshGroup={loadConversations}
//         />
//       )}


//       {showGroupModal && connectedUsers.length > 0 && (
//         <CreateGroupModal
//           connectedUsers={connectedUsers}
//           onCreateGroup={handleCreateGroup}
//           onClose={() => setShowGroupModal(false)}
//         />
//       )}

//     </div>
//   );
// }

// src/pages/User/CommunityMessaging.jsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MessageBubble from "../../components/messaging/MessageBubble";
import MessageInput from "../../components/messaging/MessageInput";
import ChatHeader from "../../components/messaging/ChatHeader";
import UserCard from "../../components/networking/UserCard";
import GroupCard from "../../components/messaging/GroupCard";
import CreateGroupModal from "../../components/messaging/CreateGroupModal";
import { useLocation } from "react-router-dom";
import {
  getOrCreateDirectConversation,
  getMessages,
  listConversations,
  createGroupConversation,
  markConversationAsRead, // ✅
} from "../../api/chat";
import { fetchConnections } from "../../api/connections";
import { BACKEND_URL } from "../../../config";
import GroupSettingsModal from "../../components/messaging/GroupSettingsModal";

export default function CommunityMessaging({ onUnreadCountChange }) {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const [showGroupModal, setShowGroupModal] = useState(false);

  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const scrollRef = useRef(null);
  const leftContainerRef = useRef(null);

  const location = useLocation();
  const targetUserId = location.state?.targetUserId;

  const currentUser = JSON.parse(localStorage.getItem("devsta_user") || "{}");
  const currentUserId = currentUser._id?.toString();

  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [search, setSearch] = useState("");
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);

  // --- Effects ---
  useEffect(() => {
    loadConnectedUsers();
    loadConversations();
    setupSocket();
    return () => socketRef.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open chat when navigated with targetUserId
  useEffect(() => {
    if (targetUserId && connectedUsers.length > 0) {
      openChat(targetUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, connectedUsers]);

  useEffect(() => {
    if (scrollRef.current) {
      setShowScrollArrow(
        scrollRef.current.scrollTop + scrollRef.current.clientHeight <
          scrollRef.current.scrollHeight
      );
    }
  }, [connectedUsers]);

  // Keep ref updated so socket handler knows which convo is open
  useEffect(() => {
    selectedConversationRef.current = selectedConversation?._id?.toString();
  }, [selectedConversation]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  // Join rooms whenever conversation list changes
  useEffect(() => {
    if (!socketRef.current) return;
    conversations.forEach((c) => {
      socketRef.current.emit("joinConversation", c._id);
    });
  }, [conversations]);

  // ✅ Report unread chat count to parent (for Messaging tab badge)
  useEffect(() => {
    if (!onUnreadCountChange) return;
    const unseenChats = conversations.filter(
      (c) => (c.unreadCount || 0) > 0
    ).length;
    onUnreadCountChange(unseenChats);
  }, [conversations, onUnreadCountChange]);

  // --- Socket ---
  const setupSocket = () => {
    socketRef.current = io(BACKEND_URL, {
      auth: { token: localStorage.getItem("devsta_token") },
    });

    socketRef.current.on("newMessage", (msg) => {
      // Always refresh conversation list → updates ordering + unread badges
      loadConversations();

      const convoId =
        typeof msg.conversation === "object" && msg.conversation._id
          ? msg.conversation._id.toString()
          : msg.conversation?.toString?.() || msg.conversation;

      // If message is not for currently open conversation, only badges update
      if (convoId !== selectedConversationRef.current) {
        return;
      }

      // Append message in current thread
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      // Mark as read when the conversation is open
      markConversationAsRead(convoId).catch(() => {});
    });
  };

  // --- Load data ---
  const loadConnectedUsers = async () => {
    try {
      const data = await fetchConnections({ limit: 200 });
      setConnectedUsers(
        (data.items || []).filter(
          (u) => u.connection?.connectionStatus === "accepted"
        )
      );
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  const loadConversations = async () => {
    try {
      const convos = await listConversations();
      setConversations(convos);
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  // --- Helpers to deal with populated OR id-only participants ---
  const getOtherParticipant = (conversation) => {
    if (!conversation || conversation.type === "group") return null;
    const participants = conversation.participants || [];

    const other = participants.find((p) => {
      const id =
        typeof p === "string"
          ? p
          : p && p._id
          ? p._id.toString()
          : p?.toString?.();
      return id && id !== currentUserId;
    });

    return other || null;
  };

  const getDisplayUserForConversation = (conversation) => {
    const other = getOtherParticipant(conversation);
    if (!other) return null;

    const otherId =
      typeof other === "string"
        ? other
        : other && other._id
        ? other._id.toString()
        : other?.toString?.();

    // Prefer full user from connections
    const fromConnections =
      connectedUsers.find((u) => u._id === otherId) || null;

    if (fromConnections) return fromConnections;

    // Fall back to the participant object itself if it has name/avatar
    if (typeof other === "object" && other.name) return other;

    return null;
  };

  // --- Chat helpers ---
  const getOtherUser = () => {
    if (!selectedConversation) return null;
    if (selectedConversation.type === "group") return null;
    return getDisplayUserForConversation(selectedConversation);
  };

  const openChat = async (conversationOrUser) => {
    try {
      let convo;

      if (conversationOrUser && conversationOrUser.type) {
        // It's a full conversation (group) from listConversations
        convo = conversationOrUser;
      } else {
        // It's a userId → direct chat
        convo = await getOrCreateDirectConversation(conversationOrUser);
      }

      setSelectedConversation(convo);
      socketRef.current?.emit("joinConversation", convo._id);

      const msgs = await getMessages(convo._id);
      setMessages(msgs);

      // Mark as read and refresh convo list
      markConversationAsRead(convo._id).catch(() => {});
      loadConversations();
    } catch (err) {
      console.error("Error opening chat:", err);
    }
  };

  // Upload media to backend (Cloudinary) for images/videos
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

  // handle text + optional multiple files
  const handleSend = async ({ text, files }) => {
    if (!selectedConversation) return;
    const trimmed = text?.trim() || "";
    const hasFiles = Array.isArray(files) && files.length > 0;

    if (!trimmed && !hasFiles) return;

    try {
      setIsSending(true);

      // CASE 1: Only text (no files) -> socket
      if (!hasFiles) {
        socketRef.current?.emit("sendMessage", {
          conversationId: selectedConversation._id,
          text: trimmed,
        });
        return;
      }

      // CASE 2: One or more images/videos
      await Promise.all(
        files.map(async (file, index) => {
          const mime = (file.type || "").toLowerCase();
          const isImage = mime.startsWith("image/");
          const isVideo = mime.startsWith("video/");

          if (!isImage && !isVideo) {
            console.warn(
              "Unsupported file type. Only images/videos are allowed.",
              file.type
            );
            return;
          }

          const mediaFromServer = await uploadMessageMedia(file);
          const forcedType = isImage ? "image" : "video";

          socketRef.current?.emit("sendMessage", {
            conversationId: selectedConversation._id,
            // Attach text only with the first media to avoid repetition
            text: index === 0 ? trimmed : "",
            media: {
              ...mediaFromServer,
              type: forcedType,
            },
          });
        })
      );
    } catch (err) {
      console.error("Error sending message:", err);
      // TODO: show toast
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateGroup = async (name, memberIds) => {
    try {
      const newGroup = await createGroupConversation(name, memberIds);

      // Map participant IDs → full user objects
      newGroup.participants = newGroup.participants.map((id) => {
        return connectedUsers.find((u) => u._id === id) || { _id: id };
      });

      setConversations((prev) => [newGroup, ...prev]);
      setShowGroupModal(false);
      openChat(newGroup);

      import("../../utils/toast").then(({ showToast }) =>
        showToast("Group created successfully!")
      );
    } catch (err) {
      console.error("Error creating group:", err);

      import("../../utils/toast").then(({ showToast }) =>
        showToast("Failed to create group", 3500)
      );
    }
  };

  // --- Filtered conversations list ---
  const filteredConversations = conversations.filter((c) => {
    if (c.type === "group") {
      return (c.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    }

    const otherUser = getDisplayUserForConversation(c);
    return (otherUser?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-[72vh] gap-4">
      {/* LEFT: Connections + Groups */}
      <div
        className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 h-[75vh] flex flex-col relative overflow-hidden"
        ref={leftContainerRef}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Your Connections</h2>
          <button
            className="text-primary font-semibold text-sm"
            onClick={() => setShowGroupModal(true)}
          >
            + Group
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
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
                scrollRef.current.scrollTop + scrollRef.current.clientHeight <
                  scrollRef.current.scrollHeight
              );
            }
          }}
        >
          <div className="space-y-2">
            {filteredConversations.map((c, idx) => {
              const isActive = selectedConversation?._id === c._id;

              if (c.type === "group") {
                return (
                  <GroupCard
                    key={c._id || `group-${idx}`}
                    group={c}
                    currentUserId={currentUserId}
                    active={isActive}
                    onClick={() => openChat(c)}
                    unreadCount={c.unreadCount || 0}
                  />
                );
              } else {
                const otherUser = getDisplayUserForConversation(c);
                if (!otherUser) return null;

                return (
                  <UserCard
                    key={otherUser._id || `user-${idx}`}
                    user={otherUser}
                    compact
                    simple
                    active={isActive}
                    onClick={() => openChat(otherUser._id)}
                    unreadCount={c.unreadCount || 0}
                  />
                );
              }
            })}

            {filteredConversations.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-2">
                No results found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Chat */}
      <div className="md:col-span-3 bg-white dark:bg-[#0a0a0a] rounded-xl flex flex-col h-[75vh]">
        {!selectedConversation ? (
          <p className="text-gray-400 text-center my-auto">
            Select a user or group to start chatting
          </p>
        ) : (
          <>
            {selectedConversation && (
              <ChatHeader
                user={getOtherUser()}
                group={
                  selectedConversation.type === "group"
                    ? selectedConversation
                    : null
                }
                onOpenGroupSettings={() => setShowGroupSettingsModal(true)}
              />
            )}
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
            <div className="p-3 border-t">
              <MessageInput onSend={handleSend} isSending={isSending} />
            </div>
          </>
        )}
      </div>

      {showGroupSettingsModal && selectedConversation?.type === "group" && (
        <GroupSettingsModal
          groupId={selectedConversation._id}
          onClose={() => setShowGroupSettingsModal(false)}
          connectedUsers={connectedUsers}
          onGroupUpdate={(updatedGroup) => {
            setSelectedConversation((prev) => ({
              ...prev,
              name: updatedGroup.groupName,
              participants: updatedGroup.members,
            }));

            setConversations((prev) =>
              prev.map((c) =>
                c._id === updatedGroup._id
                  ? {
                      ...c,
                      name: updatedGroup.groupName,
                      participants: updatedGroup.members,
                    }
                  : c
              )
            );
          }}
          refreshGroup={loadConversations}
        />
      )}

      {showGroupModal && connectedUsers.length > 0 && (
        <CreateGroupModal
          connectedUsers={connectedUsers}
          onCreateGroup={handleCreateGroup}
          onClose={() => setShowGroupModal(false)}
        />
      )}
    </div>
  );
}
