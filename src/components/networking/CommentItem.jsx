// import React, { useState } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import {
//   FiEdit,
//   FiTrash2,
//   FiCheck,
//   FiX,
//   FiMoreVertical,
//   FiEyeOff,
// } from "react-icons/fi";



// export default function CommentItem({ comment, currentUserId, postAuthorId, onDelete, onUpdate,onToggleHide,  }) {
//   const { author, text, createdAt, _id } = comment;
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedText, setEditedText] = useState(text);
//   const [menuOpen, setMenuOpen] = useState(false);


//   const isCommentAuthor = currentUserId === author._id;
//   const isPostAuthor = currentUserId === postAuthorId;
//   const isCommentByPostAuthor = author._id === postAuthorId;


//   const handleSave = () => {
//     if (editedText.trim() && onUpdate) {
//       onUpdate(_id, editedText.trim());
//       setIsEditing(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditedText(text);
//     setIsEditing(false);
//   };

//   const formatTimeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return "just now";
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes}m`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours}h`;
//     const days = Math.floor(hours / 24);
//     return `${days}d`;
//   };

//   return (
//     <div className="flex gap-3 mt-3">
//       <DevstaAvatar user={author} size={35} className="mt-[5px]" />
// <div className="flex-1 bg-[rgba(116,134,136,0.1)] p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow">

//         {/* Name • Time */}
//         <div className="flex items-center justify-between mb-2 flex-wrap">
//           <div className="flex items-center gap-2">
//             <span className="text-gray-900 font-semibold text-sm">{author.name}</span>
//             {isCommentByPostAuthor && (
//   <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">
//     Author
//   </span>
// )}

//             <span className="text-gray-500 font-normal text-xs">
//               • {formatTimeAgo(createdAt)}
//             </span>
//           </div>

//          {/* {isCommentAuthor && !isEditing && (
//             <div className="flex gap-2 text-gray-500">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-1 hover:text-primary transition-colors rounded-full"
//                 title="Edit"
//               >
//                 <FiEdit size={16} />
//               </button>
//               <button
//                 onClick={() => onDelete && onDelete(_id)}
//                 className="p-1 hover:text-red-500 transition-colors rounded-full"
//                 title="Delete"
//               >
//                 <FiTrash2 size={16} />
//               </button>
//             </div>
//           )} */}

//           {(isCommentAuthor || isPostAuthor) && !isEditing && (
//   <div className="relative">
//     <button
//       onClick={() => setMenuOpen(v => !v)}
//       className="p-1 hover:text-primary rounded-full"
//     >
//       <FiMoreVertical size={16} />
//     </button>

//     {menuOpen && (
//       <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-md z-10 min-w-[120px]">
//         {isCommentAuthor && (
//           <button
//             onClick={() => {
//               setIsEditing(true);
//               setMenuOpen(false);
//             }}
//             className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
//           >
//             <FiEdit size={14} /> Edit
//           </button>
//         )}

//         {(isCommentAuthor || isPostAuthor) && (
//           <button
//             onClick={() => {
//               onDelete(_id);
//               setMenuOpen(false);
//             }}
//             className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 w-full"
//           >
//             <FiTrash2 size={14} /> Delete
//           </button>
//         )}

//         {isPostAuthor && !isCommentAuthor && (
//           <button
//             onClick={() => {
//               onToggleHide(_id, true);
//               setMenuOpen(false);
//             }}
//             className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
//           >
//             <FiEyeOff size={14} /> Hide
//           </button>
//         )}
//       </div>
//     )}
//   </div>
// )}

//         </div>

//         {/* Comment text / edit input */}
//         {!isEditing ? (
//           <p className="text-gray-800 text-[14px] leading-relaxed">{text}</p>
//         ) : (
//           <div className="flex gap-2 mt-2">
//             <input
//               type="text"
//               className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               value={editedText}
//               onChange={(e) => setEditedText(e.target.value)}
//             />
//             <button
//               className="text-green-500 hover:text-green-700 p-1 rounded-full"
//               onClick={handleSave}
//               title="Save"
//             >
//               <FiCheck size={16} />
//             </button>
//             <button
//               className="text-red-500 hover:text-red-700 p-1 rounded-full"
//               onClick={handleCancel}
//               title="Cancel"
//             >
//               <FiX size={16} />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import {
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiMoreVertical,
  FiEyeOff,
  FiAlertTriangle,
} from "react-icons/fi";

export default function CommentItem({
  comment,
  currentUserId,
  postAuthorId,
  isFlagged = false,
  onDelete,
  onUpdate,
  onToggleHide,
}) {
  const { author, text, createdAt, _id } = comment;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [menuOpen, setMenuOpen] = useState(false);

  const isCommentAuthor = currentUserId === author._id;
  const isPostAuthor = currentUserId === postAuthorId;
  const isCommentByPostAuthor = author._id === postAuthorId;

  const handleSave = () => {
    if (editedText.trim() && onUpdate) {
      onUpdate(_id, editedText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="flex gap-3 mt-4">
      <DevstaAvatar user={author} size={40} className="mt-1" />

      <div className="flex-1">
        {/* Main comment container with strong flagged styling */}
       <div
    className={`
      p-5 rounded-2xl shadow transition-all duration-300
${isFlagged && isPostAuthor 
  ? "border border-amber-400 bg-amber-50/60 shadow-amber-100" 
  : "bg-gray-50/80 border border-gray-200 hover:shadow-md hover:border-gray-300"
}
    `}
    data-comment-id={_id}  // NEW: For selecting in scroll
  >
          {/* Header row */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-gray-900 text-base">
                {author.name}
              </span>

              {isCommentByPostAuthor && (
                <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-medium">
                  Author
                </span>
              )}

              <span className="text-gray-500 text-xs">
                • {formatTimeAgo(createdAt)}
              </span>
            </div>

            {/* Action menu - only for author or post author */}
            {(isCommentAuthor || isPostAuthor) && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiMoreVertical size={18} className="text-gray-600" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                    {isCommentAuthor && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FiEdit size={16} /> Edit
                      </button>
                    )}

                    {(isCommentAuthor || isPostAuthor) && (
                      <button
                        onClick={() => {
                          onDelete(_id);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                    )}

                    {isPostAuthor && !isCommentAuthor && (
                      <button
                        onClick={() => {
                          onToggleHide(_id, true);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FiEyeOff size={16} /> Hide comment
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* === VERY VISIBLE FLAGGED WARNING (only for post author) === */}
         {isFlagged && isPostAuthor && (
  <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-md text-amber-900 flex items-start gap-2.5 text-sm">
    <FiAlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-600" />
    <div>
      <p className="font-medium">Flagged for review</p>
      <p className="text-amber-700 mt-0.5">
        This comment was flagged automatically. Hide if it violates guidelines.
      </p>
    </div>
  </div>
)}

          {/* Comment text or edit input */}
          {!isEditing ? (
            <p className="text-gray-800 text-[15px] leading-relaxed break-words font-medium">
              {text}
            </p>
          ) : (
            <div className="flex gap-3 mt-3">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                autoFocus
              />
              <button
                className="text-green-600 hover:text-green-800 p-2.5 rounded-full hover:bg-green-50 transition-colors"
                onClick={handleSave}
                title="Save"
              >
                <FiCheck size={20} />
              </button>
              <button
                className="text-red-600 hover:text-red-800 p-2.5 rounded-full hover:bg-red-50 transition-colors"
                onClick={handleCancel}
                title="Cancel"
              >
                <FiX size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}