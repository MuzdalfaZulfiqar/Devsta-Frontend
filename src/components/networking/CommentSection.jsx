import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { listComments, addComment, updateComment, deleteComment } from "../../api/post";

export default function CommentSection({ postId, currentUserId, postAuthorId, setCommentsCount }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await listComments(postId);
      const fetchedComments = res?.items || [];
      setComments(fetchedComments);
      setCommentsCount?.(fetchedComments.length); // ✅ Update comment count on fetch
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      setAdding(true);
      const res = await addComment(postId, newCommentText.trim());
      const newComment = res.comment;
      if (newComment) {
        setComments(prev => [newComment, ...prev]);
        setCommentsCount?.(prev => prev + 1); // ✅ Increment count
      }
      setNewCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      setCommentsCount?.(prev => prev - 1); // ✅ Decrement count
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleUpdate = async (commentId, text) => {
    try {
      await updateComment(postId, commentId, text);
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, text } : c));
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  if (loading) return <p className="text-gray-500 text-sm mt-2">Loading comments...</p>;

  return (
    <div className="mt-4 pl-6">
      {/* Add New Comment */}
      <div className="flex gap-2 mb-4 items-center">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          placeholder="Write a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          disabled={adding}
          className={`px-4 py-2 rounded-full text-white text-sm font-semibold transition-colors ${
            adding ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Existing Comments */}
      {comments.length === 0 && <p className="text-gray-400 text-sm mt-2">No comments yet.</p>}

      {comments.length > 0 && (
        <div className="flex flex-col gap-3">
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
