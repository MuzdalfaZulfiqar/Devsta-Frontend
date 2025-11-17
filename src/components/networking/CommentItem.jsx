import React, { useState } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";

export default function CommentItem({ comment, currentUserId, postAuthorId, onDelete, onUpdate }) {
  const { author, text, createdAt, _id } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const isCommentAuthor = currentUserId === author._id;
  const isPostAuthor = author._id === postAuthorId;

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
    <div className="flex gap-3 mt-3">
      <DevstaAvatar user={author} size={35} className="mt-[5px]" />
<div className="flex-1 bg-[rgba(116,134,136,0.1)] p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow">

        {/* Name • Time */}
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-semibold text-sm">{author.name}</span>
            {isPostAuthor && (
              <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">
                Author
              </span>
            )}
            <span className="text-gray-500 font-normal text-xs">
              • {formatTimeAgo(createdAt)}
            </span>
          </div>

          {isCommentAuthor && !isEditing && (
            <div className="flex gap-2 text-gray-500">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:text-primary transition-colors rounded-full"
                title="Edit"
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => onDelete && onDelete(_id)}
                className="p-1 hover:text-red-500 transition-colors rounded-full"
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Comment text / edit input */}
        {!isEditing ? (
          <p className="text-gray-800 text-[14px] leading-relaxed">{text}</p>
        ) : (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <button
              className="text-green-500 hover:text-green-700 p-1 rounded-full"
              onClick={handleSave}
              title="Save"
            >
              <FiCheck size={16} />
            </button>
            <button
              className="text-red-500 hover:text-red-700 p-1 rounded-full"
              onClick={handleCancel}
              title="Cancel"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

