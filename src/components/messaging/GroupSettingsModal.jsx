// import { useEffect, useState } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { X, UserPlus } from "lucide-react";
// import {
//   getGroupMembers,
//   promoteAdmin,
//   demoteAdmin,
//   updateGroup,
//   leaveGroup,
//   deleteGroup,
//   addMembersToGroup,
// } from "../../api/chat";
// import { showToast } from "../../utils/toast";

// export default function GroupSettingsDrawer({
//   groupId,
//   onClose,
//   refreshGroup,
//   connectedUsers,
//   onGroupUpdate
// }) {
//   const [groupName, setGroupName] = useState("");
//   const [members, setMembers] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [savingName, setSavingName] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [view, setView] = useState("settings"); // "settings" or "addMembers"
//   const [selectedNewMembers, setSelectedNewMembers] = useState([]);

//   const [isOpen, setIsOpen] = useState(false);

//   const currentUserId = JSON.parse(localStorage.getItem("devsta_user") || "{}")._id;

//   useEffect(() => {
//     if (groupId) {
//       setIsOpen(true);
//       loadMembers();
//     }
//   }, [groupId]);

//   const loadMembers = async () => {
//     if (!groupId) return;
//     setLoading(true);
//     try {
//       const res = await getGroupMembers(groupId);
//       const fetchedMembers = Array.isArray(res?.members) ? res.members : [];
//       const fetchedGroupName = res?.groupName || "";
//       setMembers(fetchedMembers);

//       const adminsList = Array.isArray(fetchedMembers)
//         ? fetchedMembers.filter((m) => m && m.isAdmin).map((m) => m._id)
//         : [];
//       setAdmins(adminsList);
//       setGroupName(fetchedGroupName);
//     } catch (err) {
//       console.error(err);
//       showToast("Failed to load group members");
//       setMembers([]);
//       setAdmins([]);
//       setGroupName("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setTimeout(onClose, 300);
//   };

//   const handleSaveGroupName = async () => {
//     if (!groupName.trim()) return;
//     setSavingName(true);
//     try {
//       await updateGroup(groupId, { name: groupName });
//       showToast("Group name updated!");
//       loadMembers();
//        onGroupUpdate?.({
//       _id: groupId,
//       groupName,
//       members,
//     });
//     } catch (err) {
//       console.error(err);
//       showToast("Failed to update group name");
//     } finally {
//       setSavingName(false);
//     }
//   };

//   const toggleAdmin = async (userId, promote) => {
//     setMembers((prev) =>
//       prev.map((m) => (m._id === userId ? { ...m, isAdmin: promote } : m))
//     );
//     try {
//       if (promote) await promoteAdmin(groupId, userId);
//       else await demoteAdmin(groupId, userId);
//       loadMembers();
//        onGroupUpdate?.({
//       _id: groupId,
//       groupName,
//       members,
//     });
//     } catch (err) {
//       console.error(err);
//       loadMembers();
//       showToast("Failed to update admin status");
//     }
//   };
// const handleRemoveMember = async (userId) => {
//   const updatedMembers = members.filter((m) => m._id !== userId);
//   setMembers(updatedMembers);
//   try {
//     await updateGroup(groupId, { removeMembers: [userId] });
//     showToast("Member removed");

//     // pass the updated array, not old state
//     onGroupUpdate?.({
//       _id: groupId,
//       groupName,
//       members: updatedMembers,
//     });
//   } catch (err) {
//     console.error(err);
//     setMembers(members); // rollback
//     showToast("Failed to remove member");
//   }
// };

//   const handleLeaveGroup = async () => {
//     try {
//       await leaveGroup(groupId);
//       handleClose();
//       refreshGroup();
//       showToast("You left the group");
//        onGroupUpdate?.({
//       _id: groupId,
//       groupName,
//       members,
//     });
//     } catch (err) {
//       console.error(err);
//       showToast("Failed to leave group");
//     }
//   };

//   const handleDeleteGroup = async () => {
//     try {
//       await deleteGroup(groupId);
//       handleClose();
//       refreshGroup();
//        onGroupUpdate?.({
//       _id: groupId,
//       groupName,
//       members,
//     });
//       showToast("Group deleted");
//     } catch (err) {
//       console.error(err);
//       showToast("Failed to delete group");
//     }
//   };

//   const handleAddMembers = async () => {
//     if (!selectedNewMembers.length) return;
//     try {
//       await addMembersToGroup(groupId, selectedNewMembers);
//       showToast("Members added successfully!");
//       setSelectedNewMembers([]);
//       setView("settings");
//       loadMembers();
//        onGroupUpdate?.({
//       _id: groupId,
//       groupName,
//       members,
//     });
//     } catch (err) {
//       console.error(err);
//       showToast("Failed to add members");
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex"
//       style={{ pointerEvents: isOpen ? "auto" : "none" }}
//     >
//       {/* Overlay */}
//       <div
//         className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0"
//         }`}
//         onClick={handleClose}
//       />

//       {/* Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0a0a0a] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* SETTINGS VIEW */}
//         {view === "settings" && (
//           <>
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//               <h2 className="text-xl font-semibold font-fragment text-primary">
//                 Group Settings
//               </h2>
//               <button
//                 className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition"
//                 onClick={handleClose}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Group Name */}
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
//               <input
//                 type="text"
//                 value={groupName}
//                 onChange={(e) => setGroupName(e.target.value)}
//                 className="flex-1 p-2 border rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 font-fragment"
//               />
//               <button
//                 className="px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
//                 onClick={handleSaveGroupName}
//                 disabled={savingName}
//               >
//                 Save
//               </button>
//             </div>

//             {/* Add Member Button */}
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//               <button
//                 className="flex items-center gap-2 px-3 py-2 border rounded-full border-primary text-primary hover:bg-primary/10 transition font-fragment"
//                 onClick={() => setView("addMembers")}
//               >
//                 <UserPlus size={18} /> Add Member
//               </button>
//             </div>

//             {/* Members List */}
//             {/* <div className="p-4 space-y-4 overflow-y-auto flex-1">
//               {members.map((m) => (
//                 <div
//                   key={m._id}
//                   className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                 >
//                   <div className="flex flex-col">
//                     <div className="flex items-center gap-2">
//                       <DevstaAvatar user={m} size={36} />
//                       <span className="font-medium font-fragment">{m.name}</span>
//                     </div>
//                     {m.isAdmin && (
//                       <span className="text-xs text-primary mt-1 border border-primary rounded-full px-2 py-0.5 w-max font-fragment">
//                         Admin
//                       </span>
//                     )}
//                   </div>

//                   {admins.includes(currentUserId) && currentUserId !== m._id && (
//                     <div className="flex gap-2">
//                       <button
//                         className={`text-xs px-2 py-1 rounded-full border font-fragment transition ${
//                           m.isAdmin
//                             ? "border-primary text-primary bg-transparent hover:bg-primary/10"
//                             : "border-primary text-white bg-primary hover:bg-primary/90"
//                         }`}
//                         onClick={() => toggleAdmin(m._id, !m.isAdmin)}
//                       >
//                         {m.isAdmin ? "Demote" : "Make Admin"}
//                       </button>
//                       <button
//                         className="text-xs px-2 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-fragment"
//                         onClick={() => handleRemoveMember(m._id)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div> */}
// {/* Members List */}
// <div className="p-4 space-y-3 overflow-y-auto flex-1">
//   {members.map((m) => (
//     <div
//       key={m._id}
//       className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
//     >
//      {/* Avatar + Name + Badge */}
// <div className="flex items-center gap-3 flex-1 min-w-0">
//   <DevstaAvatar user={m} size={48} />
//   <div className="flex flex-col min-w-0">
//     <span className="font-medium font-fragment truncate">{m.name}</span>
//     {m.isAdmin && (
//       <span className="mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary text-white font-fragment w-max">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-3 w-3"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 2l3 7h7l-5.5 4 2 7-6-4-6 4 2-7L2 9h7l3-7z"
//           />
//         </svg>
//         Admin
//       </span>
//     )}
//   </div>
// </div>


//       {/* Actions */}
//       <div className="flex gap-2 items-center">
//         {admins.includes(currentUserId) && currentUserId !== m._id && (
//           <>
//             <button
//               className={`text-xs px-3 py-1 rounded-full border font-fragment transition ${
//                 m.isAdmin
//                   ? "border-primary text-primary bg-transparent hover:bg-primary/10"
//                   : "border-primary text-white bg-primary hover:bg-primary/90"
//               }`}
//               onClick={() => toggleAdmin(m._id, !m.isAdmin)}
//             >
//               {m.isAdmin ? "Demote" : "Make Admin"}
//             </button>

//             <button
//               className="text-xs px-3 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-fragment"
//               onClick={() => handleRemoveMember(m._id)}
//             >
//               Remove
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   ))}
// </div>


//             {/* Footer */}
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
//               <button
//                 className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition font-fragment"
//                 onClick={handleLeaveGroup}
//               >
//                 Leave
//               </button>
//               {admins.includes(currentUserId) && (
//                 <button
//                   className="flex-1 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-fragment"
//                   onClick={handleDeleteGroup}
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           </>
//         )}

//         {/* ADD MEMBERS VIEW */}
//        {/* ADD MEMBERS VIEW */}
// {view === "addMembers" && (
//   <>
//     {/* Header */}
//     <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
//       <button
//         className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full hover:bg-primary/90 transition font-fragment"
//         onClick={() => setView("settings")}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//         Back
//       </button>
//       <h2 className="text-xl font-semibold font-fragment text-primary flex-1 text-center">
//         Add Members
//       </h2>
//     </div>

//     {/* User List */}
//     <div className="flex-1 overflow-y-auto p-4 space-y-3">
//       {connectedUsers
//         .filter((u) => !members.some((m) => m._id === u._id))
//         .map((u) => {
//           const isSelected = selectedNewMembers.includes(u._id);
//           return (
//             <div
//               key={u._id}
//               className={`flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer ${
//                 isSelected ? "bg-primary/20" : ""
//               }`}
//               onClick={() =>
//                 setSelectedNewMembers((prev) =>
//                   prev.includes(u._id)
//                     ? prev.filter((id) => id !== u._id)
//                     : [...prev, u._id]
//                 )
//               }
//             >
//               {/* Avatar + Name */}
//               <div className="flex items-center gap-3 flex-1 min-w-0">
//                 <DevstaAvatar user={u} size={48} />
//                 <span className="font-medium font-fragment truncate">
//                   {u.name}
//                 </span>
//               </div>

//               {/* Selection badge */}
//               {isSelected && (
//                 <span className="text-green-500 font-semibold text-sm px-2 py-0.5 rounded-full">
//                   Selected
//                 </span>
//               )}
//             </div>
//           );
//         })}
//     </div>

//     {/* Footer */}
//     {selectedNewMembers.length > 0 && (
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <button
//           className="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition font-fragment"
//           onClick={handleAddMembers}
//         >
//           Add Selected
//         </button>
//       </div>
//     )}
//   </>
// )}

//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { X, UserPlus } from "lucide-react";
import {
    getGroupMembers,
    promoteAdmin,
    demoteAdmin,
    updateGroup,
    leaveGroup,
    deleteGroup,
    addMembersToGroup,
} from "../../api/chat";
import { showToast } from "../../utils/toast";

export default function GroupSettingsDrawer({
    groupId,
    onClose,
    refreshGroup,
    connectedUsers,
    onGroupUpdate
}) {
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [savingName, setSavingName] = useState(false);
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState("settings"); // "settings" or "addMembers"
    const [selectedNewMembers, setSelectedNewMembers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(""); // will store action type like "saveName", "removeMember", etc.

    const isLoading = (action) => loadingAction === action;
    const currentUserId = JSON.parse(localStorage.getItem("devsta_user") || "{}")._id;

    useEffect(() => {
        if (groupId) {
            setIsOpen(true);
            loadMembers();
        }
    }, [groupId]);

    const loadMembers = async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const res = await getGroupMembers(groupId);
            const fetchedMembers = Array.isArray(res?.members) ? res.members : [];
            setMembers(fetchedMembers);
            setGroupName(res?.groupName || "");

            const adminsList = fetchedMembers.filter((m) => m?.isAdmin).map((m) => m._id);
            setAdmins(adminsList);

            // Pass updated group to parent
            onGroupUpdate?.({
                _id: groupId,
                groupName: res?.groupName || "",
                members: fetchedMembers,
            });
        } catch (err) {
            console.error(err);
            showToast("Failed to load group members");
            setMembers([]);
            setAdmins([]);
            setGroupName("");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };

    const handleSaveGroupName = async () => {
        if (!groupName.trim()) return;
        setSavingName(true);
        setLoadingAction("saveName"); // start spinner

        try {
            await updateGroup(groupId, { name: groupName });
            showToast("Group name updated!");
            loadMembers();
        } catch (err) {
            console.error(err);
            showToast("Failed to update group name");
        } finally {
            setSavingName(false);
            setLoadingAction(""); // stop spinner
        }
    };

    const toggleAdmin = async (userId, promote) => {
        setLoadingAction("toggleAdmin-" + userId);
        setMembers(prev =>
            prev.map(m => m._id === userId ? { ...m, isAdmin: promote } : m)
        );

        try {
            if (promote) await promoteAdmin(groupId, userId);
            else await demoteAdmin(groupId, userId);

            // Refresh members after server update
            const res = await getGroupMembers(groupId);
            const updatedMembers = res.members || [];
            setMembers(updatedMembers);

            onGroupUpdate?.({
                _id: groupId,
                groupName: res.groupName || groupName,
                members: updatedMembers,
            });
        } catch (err) {
            console.error(err);
            showToast("Failed to update admin status");
            loadMembers();
        }
        finally {
            setLoadingAction("");
        }
    };

    const handleRemoveMember = async (userId) => {
        setLoadingAction("removeMember-" + userId);
        try {
            // Locally remove the member from UI
            const updated = members.filter(m => m._id !== userId);
            setMembers(updated);

            await updateGroup(groupId, { removeMembers: [userId] });

            // Send updated group to parent
            onGroupUpdate?.({
                _id: groupId,
                groupName,
                members: updated,
            });


            showToast("Member removed");
        } catch (err) {
            console.error(err);
            showToast("Failed to remove member");
            loadMembers();
        }
        finally {
            setLoadingAction("");
        }
    };

    const handleLeaveGroup = async () => {
        setLoadingAction("leaveGroup");
        try {
            await leaveGroup(groupId);
            handleClose();
            refreshGroup();
            showToast("You left the group");
        } catch (err) {
            console.error(err);
            showToast("Failed to leave group");
        }
        finally {
            setLoadingAction("");
        }
    };

    const handleDeleteGroup = async () => {
        setLoadingAction("deleteGroup");
        try {
            await deleteGroup(groupId);
            handleClose();
            refreshGroup();
            showToast("Group deleted");
        } catch (err) {
            console.error(err);
            showToast("Failed to delete group");
        }
        finally {
            setLoadingAction("");
        }
    };

    const handleAddMembers = async () => {
        if (!selectedNewMembers.length) return;
        setLoadingAction("addMembers");
        try {
            await addMembersToGroup(groupId, selectedNewMembers);

            // Add members locally
            const newMembersObjects = connectedUsers.filter(u => selectedNewMembers.includes(u._id));
            setMembers(prev => [...prev, ...newMembersObjects]);

            // Update parent
            onGroupUpdate?.({
                _id: groupId,
                groupName,
                members: [...members, ...newMembersObjects],
            });

            showToast("Members added successfully!");
            setSelectedNewMembers([]);
            setView("settings");
        } catch (err) {
            console.error(err);
            showToast("Failed to add members");
        }
        finally {
            setLoadingAction("");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex" style={{ pointerEvents: isOpen ? "auto" : "none" }}>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0a0a0a] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* SETTINGS VIEW */}
                {view === "settings" && (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold font-fragment text-primary">Group Settings</h2>
                            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition" onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>



                        {/* Group Name */}
                        {admins.includes(currentUserId) ? (
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="flex-1 p-2 border rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 font-fragment"
                                />
                                {/* <button
                                    className="px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
                                    onClick={handleSaveGroupName}
                                    disabled={savingName}
                                >
                                    Save
                                </button> */}
                                <button
                                    className="px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2"
                                    onClick={handleSaveGroupName}
                                    disabled={savingName || loadingAction === "saveName"}
                                >
                                    {loadingAction === "saveName" && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                    )}
                                    Save
                                </button>

                            </div>
                        ) : (
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <span className="font-fragment font-medium">{groupName}</span>
                            </div>
                        )}


                        {/* Add Member Button */}
                        {/* <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <button
                                className="flex items-center gap-2 px-3 py-2 border rounded-full border-primary text-primary hover:bg-primary/10 transition font-fragment"
                                onClick={() => setView("addMembers")}
                            >
                                <UserPlus size={18} /> Add Member
                            </button>
                        </div> */}

                        {/* Add Member Button */}
                        {admins.includes(currentUserId) && (
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <button
                                    className="flex items-center gap-2 px-3 py-2 border rounded-full border-primary text-primary hover:bg-primary/10 transition font-fragment"
                                    onClick={() => setView("addMembers")}
                                >
                                    <UserPlus size={18} /> Add Member
                                </button>
                            </div>
                        )}


                        {/* Members List */}
                        <div className="p-4 space-y-3 overflow-y-auto flex-1">
                            {members.map((m) => (
                                <div key={m._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <DevstaAvatar user={m} size={48} />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium font-fragment truncate">{m.name}</span>
                                            {m.isAdmin && (
                                                <span className="mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary text-white font-fragment w-max">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        {admins.includes(currentUserId) && currentUserId !== m._id && (
                                            <>
                                               
                                                <button
                                                    className={`text-xs px-3 py-1 rounded-full border font-fragment transition ${m.isAdmin ? "border-primary text-primary bg-transparent hover:bg-primary/10" : "border-primary text-white bg-primary hover:bg-primary/90"}`}
                                                    onClick={() => toggleAdmin(m._id, !m.isAdmin)}
                                                    disabled={isLoading("toggleAdmin-" + m._id)}
                                                >
                                                    {isLoading("toggleAdmin-" + m._id) && (
                                                        <svg className="animate-spin h-3 w-3 mr-1 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                        </svg>
                                                    )}
                                                    {m.isAdmin ? "Demote" : "Make Admin"}
                                                </button>
                                                <button
                                                    className="text-xs px-3 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-fragment"
                                                    onClick={() => handleRemoveMember(m._id)}
                                                    disabled={isLoading("removeMember-" + m._id)}
                                                >
                                                    {isLoading("removeMember-" + m._id) ? "Removing..." : "Remove"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                            {/* <button
                                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition font-fragment"
                                onClick={handleLeaveGroup}
                            >
                                Leave
                            </button>
                            {admins.includes(currentUserId) && (
                                <button
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-fragment"
                                    onClick={handleDeleteGroup}
                                >
                                    Delete
                                </button>
                            )} */}

                            <button
                                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition font-fragment"
                                onClick={handleLeaveGroup}
                                disabled={isLoading("leaveGroup")}
                            >
                                {isLoading("leaveGroup") ? "Leaving..." : "Leave"}
                            </button>
                            {admins.includes(currentUserId) && (
                                <button
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-fragment"
                                    onClick={handleDeleteGroup}
                                    disabled={isLoading("deleteGroup")}
                                >
                                    {isLoading("deleteGroup") ? "Deleting..." : "Delete"}
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* ADD MEMBERS VIEW */}
                {view === "addMembers" && (
                    <>
                        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
                            <button
                                className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full hover:bg-primary/90 transition font-fragment"
                                onClick={() => setView("settings")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <h2 className="text-xl font-semibold font-fragment text-primary flex-1 text-center">Add Members</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {connectedUsers.filter(u => !members.some(m => m._id === u._id)).map(u => {
                                const isSelected = selectedNewMembers.includes(u._id);
                                return (
                                    <div
                                        key={u._id}
                                        className={`flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer ${isSelected ? "bg-primary/20" : ""}`}
                                        onClick={() =>
                                            setSelectedNewMembers(prev =>
                                                prev.includes(u._id)
                                                    ? prev.filter(id => id !== u._id)
                                                    : [...prev, u._id]
                                            )
                                        }
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <DevstaAvatar user={u} size={48} />
                                            <span className="font-medium font-fragment truncate">{u.name}</span>
                                        </div>
                                        {isSelected && (
                                            <span className="text-green-500 font-semibold text-sm px-2 py-0.5 rounded-full">
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {selectedNewMembers.length > 0 && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                {/* <button
                                    className="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition font-fragment"
                                    onClick={handleAddMembers}
                                >
                                    Add Selected
                                </button> */}
                                <button
                                    className="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition font-fragment flex items-center justify-center gap-2"
                                    onClick={handleAddMembers}
                                    disabled={isLoading("addMembers")}
                                >
                                    {isLoading("addMembers") && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                    )}
                                    {isLoading("addMembers") ? "Adding..." : "Add Selected"}
                                </button>

                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
