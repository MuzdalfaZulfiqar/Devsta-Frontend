
// import React, { useState } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import {
//   FiEdit,
//   FiTrash2,
//   FiCheck,
//   FiX,
//   FiMoreVertical,
//   FiEyeOff,
//   FiAlertTriangle,
// } from "react-icons/fi";

// export default function CommentItem({
//   comment,
//   currentUserId,
//   postAuthorId,
//   isFlagged = false,
//   onDelete,
//   onUpdate,
//   onToggleHide,
// }) {
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
//     <div className="flex gap-3 mt-4">
//       <DevstaAvatar user={author} size={40} className="mt-1" />

//       <div className="flex-1">
//         {/* Main comment container with strong flagged styling */}
//        <div
//     className={`
//       p-5 rounded-2xl shadow transition-all duration-300
// ${isFlagged && isPostAuthor 
//   ? "border border-amber-400 bg-amber-50/60 shadow-amber-100" 
//   : "bg-gray-50/80 border border-gray-200 hover:shadow-md hover:border-gray-300"
// }
//     `}
//     data-comment-id={_id}  // NEW: For selecting in scroll
//   >
//           {/* Header row */}
//           <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
//             <div className="flex items-center gap-2.5">
//               <span className="font-semibold text-gray-900 text-base">
//                 {author.name}
//               </span>

//               {isCommentByPostAuthor && (
//                 <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-medium">
//                   Author
//                 </span>
//               )}

//               <span className="text-gray-500 text-xs">
//                 • {formatTimeAgo(createdAt)}
//               </span>
//             </div>

//             {/* Action menu - only for author or post author */}
//             {(isCommentAuthor || isPostAuthor) && !isEditing && (
//               <div className="relative">
//                 <button
//                   onClick={() => setMenuOpen((v) => !v)}
//                   className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <FiMoreVertical size={18} className="text-gray-600" />
//                 </button>

//                 {menuOpen && (
//                   <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
//                     {isCommentAuthor && (
//                       <button
//                         onClick={() => {
//                           setIsEditing(true);
//                           setMenuOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
//                       >
//                         <FiEdit size={16} /> Edit
//                       </button>
//                     )}

//                     {(isCommentAuthor || isPostAuthor) && (
//                       <button
//                         onClick={() => {
//                           onDelete(_id);
//                           setMenuOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                       >
//                         <FiTrash2 size={16} /> Delete
//                       </button>
//                     )}

//                     {isPostAuthor && !isCommentAuthor && (
//                       <button
//                         onClick={() => {
//                           onToggleHide(_id, true);
//                           setMenuOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
//                       >
//                         <FiEyeOff size={16} /> Hide comment
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* === VERY VISIBLE FLAGGED WARNING (only for post author) === */}
//          {isFlagged && isPostAuthor && (
//   <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-md text-amber-900 flex items-start gap-2.5 text-sm">
//     <FiAlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-600" />
//     <div>
//       <p className="font-medium">Flagged for review</p>
//       <p className="text-amber-700 mt-0.5">
//         This comment was flagged automatically. Hide if it violates guidelines.
//       </p>
//     </div>
//   </div>
// )}

//           {/* Comment text or edit input */}
//           {!isEditing ? (
//             <p className="text-gray-800 text-[15px] leading-relaxed break-words font-medium">
//               {text}
//             </p>
//           ) : (
//             <div className="flex gap-3 mt-3">
//               <input
//                 type="text"
//                 className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={editedText}
//                 onChange={(e) => setEditedText(e.target.value)}
//                 autoFocus
//               />
//               <button
//                 className="text-green-600 hover:text-green-800 p-2.5 rounded-full hover:bg-green-50 transition-colors"
//                 onClick={handleSave}
//                 title="Save"
//               >
//                 <FiCheck size={20} />
//               </button>
//               <button
//                 className="text-red-600 hover:text-red-800 p-2.5 rounded-full hover:bg-red-50 transition-colors"
//                 onClick={handleCancel}
//                 title="Cancel"
//               >
//                 <FiX size={20} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import {
  FiEdit3,
  FiTrash2,
  FiMoreHorizontal,
  FiEyeOff,
  FiAlertCircle,
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
    if (seconds < 60) return "now";
    const units = [
      { l: "d", s: 86400 },
      { l: "h", s: 3600 },
      { l: "m", s: 60 },
    ];
    for (let u of units) {
      const diff = Math.floor(seconds / u.s);
      if (diff >= 1) return `${diff}${u.l}`;
    }
    return "now";
  };

  return (
    <div 
      className="group relative flex gap-4 py-6 first:pt-2"
      data-comment-id={_id}
    >
      {/* Avatar - Minimalist with no border */}
      <div className="flex-shrink-0">
        <DevstaAvatar user={author} size={36} className="rounded-full grayscale-[0.2] hover:grayscale-0 transition-all" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-black tracking-tight">
              {author.name}
            </span>
            
            {isCommentByPostAuthor && (
              <span className="text-[11px] font-medium text-blue-600 tracking-tight">
                Author
              </span>
            )}

            <span className="text-[13px] text-gray-400 font-light">
              {formatTimeAgo(createdAt)}
            </span>
          </div>

          {/* Action Menu - Pure Ghost Style */}
          {(isCommentAuthor || isPostAuthor) && !isEditing && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 text-gray-300 hover:text-black transition-colors"
              >
                <FiMoreHorizontal size={16} />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    {isCommentAuthor && (
                      <button onClick={() => { setIsEditing(true); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <FiEdit3 size={14} className="text-gray-400" /> Edit
                      </button>
                    )}
                    {isPostAuthor && !isCommentAuthor && (
                      <button onClick={() => { onToggleHide(_id, true); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <FiEyeOff size={14} className="text-gray-400" /> Hide
                      </button>
                    )}
                    <button onClick={() => { onDelete(_id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 flex items-center gap-3">
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative">
          {!isEditing ? (
            <div className="space-y-3">
              <p className="text-[15px] leading-relaxed text-gray-700 break-words font-normal">
                {text}
              </p>
              
              {/* Ultra-subtle Flagged indicator */}
              {isFlagged && isPostAuthor && (
                <div className="flex items-center gap-2 py-1 text-orange-500">
                  <FiAlertCircle size={14} />
                  <span className="text-[12px] font-medium italic">Pending review</span>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <textarea
                className="w-full bg-transparent border-b border-gray-200 py-2 text-[15px] text-gray-800 focus:border-black outline-none transition-all resize-none"
                rows="1"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                autoFocus
              />
              <div className="flex justify-end gap-4 mt-3">
                <button onClick={handleCancel} className="text-[13px] font-medium text-gray-400 hover:text-black">
                  Cancel
                </button>
                <button onClick={handleSave} className="text-[13px] font-bold text-black border-b border-black">
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}