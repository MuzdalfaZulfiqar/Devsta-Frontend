// import { useEffect, useState } from "react";
// import CommentItem from "./CommentItem";
// import {
//   listComments,
//   addComment,
//   updateComment,
//   deleteComment,
//   toggleHideComment,
// } from "../../api/post";


// export default function CommentSection({ postId, currentUserId, postAuthorId, setCommentsCount }) {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newCommentText, setNewCommentText] = useState("");
//   const [adding, setAdding] = useState(false);

//   useEffect(() => {
//     fetchComments();
//   }, []);

//   const fetchComments = async () => {
//     try {
//       setLoading(true);
//       const res = await listComments(postId);
//       const fetchedComments = res?.items || [];
//       setComments(fetchedComments);
//       setCommentsCount?.(fetchedComments.length); // ✅ Update comment count on fetch
//     } catch (err) {
//       console.error("Failed to fetch comments:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newCommentText.trim()) return;

//     try {
//       setAdding(true);
//       const res = await addComment(postId, newCommentText.trim());
//       const newComment = res.comment;
//       if (newComment) {
//         setComments(prev => [newComment, ...prev]);
//         setCommentsCount?.(prev => prev + 1); // ✅ Increment count
//       }
//       setNewCommentText("");
//     } catch (err) {
//       console.error("Failed to add comment:", err);
//     } finally {
//       setAdding(false);
//     }
//   };

//   const handleDelete = async (commentId) => {
//     try {
//       await deleteComment(postId, commentId);
//       setComments(prev => prev.filter(c => c._id !== commentId));
//       setCommentsCount?.(prev => prev - 1); // ✅ Decrement count
//     } catch (err) {
//       console.error("Failed to delete comment:", err);
//     }
//   };

//   const handleUpdate = async (commentId, text) => {
//     try {
//       await updateComment(postId, commentId, text);
//       setComments(prev => prev.map(c => c._id === commentId ? { ...c, text } : c));
//     } catch (err) {
//       console.error("Failed to update comment:", err);
//     }
//   };
// const handleToggleHide = async (commentId, hidden) => {
//   try {
//     await toggleHideComment(postId, commentId, hidden);

//     // Remove from UI
//     setComments(prev => prev.filter(c => c._id !== commentId));

//     // Update PostCard count
//     setCommentsCount(prev => prev - 1); 
//   } catch (err) {
//     console.error("Failed to update comment visibility:", err);
//   }
// };


//   if (loading) return <p className="text-gray-500 text-sm mt-2">Loading comments...</p>;

//   return (
//     <div className="mt-4 pl-6">
//       {/* Add New Comment */}
//       <div className="flex gap-2 mb-4 items-center">
//         <input
//           type="text"
//           className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
//           placeholder="Write a comment..."
//           value={newCommentText}
//           onChange={(e) => setNewCommentText(e.target.value)}
//         />
//         <button
//           onClick={handleAddComment}
//           disabled={adding}
//           className={`px-4 py-2 rounded-full text-white text-sm font-semibold transition-colors ${
//             adding ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
//           }`}
//         >
//           {adding ? "Adding..." : "Add"}
//         </button>
//       </div>

//       {/* Existing Comments */}
//       {comments.length === 0 && <p className="text-gray-400 text-sm mt-2">No comments yet.</p>}

//       {comments.length > 0 && (
//         <div className="flex flex-col gap-3">
//           {comments.map(comment => (
//             <CommentItem
//   key={comment._id}
//   comment={comment}
//   currentUserId={currentUserId}
//   postAuthorId={postAuthorId}
//   onDelete={handleDelete}
//   onUpdate={handleUpdate}
//   onToggleHide={handleToggleHide}
// />

//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useModerationRefresh } from '../../hooks/useModerationRefresh';
import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import {
  listComments,
  addComment,
  updateComment,
  deleteComment,
  toggleHideComment,
} from "../../api/post";
import { useModeration } from '../../hooks/useModeration';
import { FiAlertTriangle, FiX , FiEyeOff} from "react-icons/fi";
export default function CommentSection({ postId, currentUserId, postAuthorId, setCommentsCount, onFlaggedCountChange }) {

  const { moderateContent } = useModeration();
  const { refreshModerationAlerts } = useModerationRefresh();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [adding, setAdding] = useState(false);
  const [flaggedCommentIds, setFlaggedCommentIds] = useState(new Set());
  const [removedCommentAlert, setRemovedCommentAlert] = useState(null);
  const [hiddenBreakdown, setHiddenBreakdown] = useState(null);
  useEffect(() => {
    fetchComments();
  }, []);

  // const fetchComments = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await listComments(postId);
  //     const fetchedComments = res?.items || [];
  //     setComments(fetchedComments);
  //     setCommentsCount?.(fetchedComments.length);
  //   } catch (err) {
  //     console.error("Failed to fetch comments:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchComments = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await listComments(postId);
  //     const fetchedComments = res?.items || [];
  //     setComments(fetchedComments);
  //     setCommentsCount?.(fetchedComments.length);

  //     // NEW: Set flagged from fetched isFlagged
  //     const flaggedIds = fetchedComments
  //       .filter(c => c.isFlagged)
  //       .map(c => c._id);
  //     setFlaggedCommentIds(new Set(flaggedIds));
  //   } catch (err) {
  //     console.error("Failed to fetch comments:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (onFlaggedCountChange) {
      onFlaggedCountChange(flaggedCommentIds.size);
    }
  }, [flaggedCommentIds, onFlaggedCountChange]);

  // ✅ Simple toast notification (no external library needed)
  const showToast = (message, type = 'info') => {
    // You can replace this with your toast library if you have one
    // For now, we'll use console + optional browser alert
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Optional: Show alert (remove if you have a better toast system)
    if (type === 'error') {
      alert(message);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await listComments(postId);
      const fetchedComments = res?.items || [];
      setComments(fetchedComments);
      setCommentsCount?.(res.total || fetchedComments.length);

      // Flagged IDs
      const flaggedIds = fetchedComments.filter(c => c.isFlagged).map(c => c._id);
      setFlaggedCommentIds(new Set(flaggedIds));

      // Hidden breakdown (only present if current user is post author)
      if (res.hiddenBreakdown) {
        setHiddenBreakdown(res.hiddenBreakdown);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };


  //   const handleAddComment = async () => {
  //     if (!newCommentText.trim()) return;

  //     try {
  //       setAdding(true);

  //       // Step 1: Create comment
  //       const res = await addComment(postId, newCommentText.trim());
  //       const newComment = res.comment;

  //       if (newComment) {
  //         // Step 2: Add to UI immediately
  //         setComments(prev => [newComment, ...prev]);
  //         setCommentsCount?.(prev => prev + 1);
  //         setNewCommentText("");

  //         // Step 3: Moderate in background (don't block UI)
  //         try {
  //           const modResult = await moderateContent('comment', newComment._id, newCommentText.trim());
  //           console.log('✅ Moderation result:', modResult);

  //           // Step 4: Handle moderation decision
  //           if (modResult.decision === 'auto_hide') {
  //             // Remove from UI
  //             setComments(prev => prev.filter(c => c._id !== newComment._id));
  //             setCommentsCount?.(prev => Math.max(0, prev - 1));
  //             showToast('Your comment was removed for violating community guidelines', 'error');
  //           } 
  //           else if (modResult.decision === 'flag_review') {
  //             // Show warning but keep visible
  //             showToast('Your comment has been flagged for review by our moderation team', 'warning');
  //           }
  //           // If 'allow', do nothing - comment stays visible
  //         } catch (modErr) {
  //           console.error('❌ Moderation check failed:', modErr);
  //           // Don't remove comment if moderation fails
  //           // This prevents false negatives
  //         }
  //         // Inside handleAddComment → after moderation result
  // if (modResult?.decision === 'flag_review' && currentUserId === postAuthorId) {
  //   setFlaggedCommentIds(prev => new Set([...prev, newComment._id]));
  // }
  //       }
  //     } catch (err) {
  //       console.error("Failed to add comment:", err);
  //       showToast('Failed to add comment', 'error');
  //     } finally {
  //       setAdding(false);
  //     }
  //   };

  // const handleAddComment = async () => {
  //   if (!newCommentText.trim()) return;

  //   try {
  //     setAdding(true);

  //     // Step 1: Create comment
  //     const res = await addComment(postId, newCommentText.trim());
  //     const newComment = res.comment;

  //     if (newComment) {
  //       // Step 2: Optimistically add to UI
  //       setComments((prev) => [newComment, ...prev]);
  //       setCommentsCount?.((prev) => prev + 1);
  //       setNewCommentText("");

  //       // Step 3: Moderate in background
  //       try {
  //         const modResult = await moderateContent('comment', newComment._id, newCommentText.trim());
  //         console.log('✅ Moderation result:', modResult);

  //         // Step 4: Handle moderation outcome
  //         if (modResult.decision === 'auto_hide') {
  //           // Remove from UI if auto-hidden
  //           setComments((prev) => prev.filter((c) => c._id !== newComment._id));
  //           setCommentsCount?.((prev) => Math.max(0, prev - 1));
  //           showToast('Your comment was removed for violating community guidelines', 'error');
  //         } else if (modResult.decision === 'flag_review') {
  //           // Notify commenter
  //           showToast('Your comment has been flagged for review by our moderation team', 'warning');

  //           // ──── IMPORTANT PART ────
  //           // Flag it visually ONLY if current user is the POST AUTHOR
  //           if (currentUserId === postAuthorId) {
  //             setFlaggedCommentIds((prev) => new Set([...prev, newComment._id]));
  //           }
  //         }
  //         // 'allow' → do nothing, stays visible
  //       } catch (modErr) {
  //         console.error('❌ Moderation check failed:', modErr);
  //         // Important: we DO NOT remove the comment here
  //         // Better to leave potentially bad comment visible than risk removing good ones
  //         // due to network/ML failure
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Failed to add comment:", err);
  //     showToast('Failed to add comment', 'error');
  //   } finally {
  //     setAdding(false);
  //   }
  // };



  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      setAdding(true);
      const commentText = newCommentText.trim();

      // Step 1: Create comment
      const res = await addComment(postId, commentText);
      const newComment = res.comment;

      if (newComment) {
        // Step 2: Add to UI immediately (optimistic)
        setComments((prev) => [newComment, ...prev]);
        setCommentsCount?.((prev) => prev + 1);
        setNewCommentText("");

        // Step 3: After ML has had time to run (it's async on server),
        // re-fetch this specific comment to see if it got auto-hidden.
        // ML via HuggingFace typically completes in 1–3s.
        setTimeout(async () => {
          try {
            const refreshed = await listComments(postId, 1, 50);
            const stillExists = refreshed.items?.find(
              (c) => String(c._id) === String(newComment._id)
            );

            if (!stillExists) {
              // Comment was auto-hidden by ML — remove from UI and notify user
              setComments((prev) =>
                prev.filter((c) => String(c._id) !== String(newComment._id))
              );
              setCommentsCount?.((prev) => Math.max(0, prev - 1));

              // Show a clear in-UI toast/banner
              setRemovedCommentAlert(
                "Your comment was automatically removed for violating community guidelines."
              );
              // Auto-clear the alert after 8 seconds
              setTimeout(() => setRemovedCommentAlert(null), 8000);
            } else if (stillExists.isFlagged) {
              // Flagged but still visible — update flagged set
              if (currentUserId === postAuthorId) {
                setFlaggedCommentIds((prev) => new Set([...prev, newComment._id]));
              }
            }
          } catch (err) {
            // Silent fail — don't disrupt UX if polling fails
            console.warn("[CommentSection] post-add sync failed:", err);
          }
        }, 4000); // 4s gives ML time to complete
      }
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
      setCommentsCount?.(prev => Math.max(0, prev - 1));


      // ✅ NEW: Refresh dashboard alerts since we just deleted a comment
      setTimeout(() => {
        refreshModerationAlerts();
      }, 500);
    } catch (err) {

      console.error("Failed to delete comment:", err);
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleUpdate = async (commentId, text) => {
    try {
      await updateComment(postId, commentId, text);
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, text } : c));
    } catch (err) {
      console.error("Failed to update comment:", err);
      showToast('Failed to update comment', 'error');
    }
  };

  const handleToggleHide = async (commentId, hidden) => {
    try {
      await toggleHideComment(postId, commentId, hidden);
      // Remove from UI
      setComments(prev => prev.filter(c => c._id !== commentId));
      // Update PostCard count
      setCommentsCount(prev => Math.max(0, prev - 1));


      // ✅ NEW: Refresh dashboard alerts since we just hid a flagged comment
      setTimeout(() => {
        refreshModerationAlerts();
      }, 500);
    } catch (err) {
      console.error("Failed to update comment visibility:", err);
      showToast('Failed to update comment visibility', 'error');
    }
  };

  if (loading) return <p className="text-gray-500 text-sm mt-2">Loading comments...</p>;

  return (
    <div className="mt-4 pl-6">
      {/* Add New Comment */}
      {hiddenBreakdown && hiddenBreakdown.total > 0 && (
  <div className="mb-4 flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
    <FiEyeOff className="flex-shrink-0 mt-0.5 text-slate-400" size={16} />
    <div>
      <p className="font-semibold text-slate-800">
        {hiddenBreakdown.total} hidden comment{hiddenBreakdown.total !== 1 ? "s" : ""} on this post
      </p>
      <p className="text-slate-500 mt-0.5 text-xs">
        {hiddenBreakdown.system > 0 && (
          <span>{hiddenBreakdown.system} automatically removed by our moderation system</span>
        )}
        {hiddenBreakdown.system > 0 && hiddenBreakdown.manual > 0 && <span> · </span>}
        {hiddenBreakdown.manual > 0 && (
          <span>{hiddenBreakdown.manual} hidden by you</span>
        )}
      </p>
    </div>
  </div>
)}
      <div className="flex gap-2 mb-4 items-center">
        {removedCommentAlert && (
          <div className="mb-3 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 animate-in fade-in duration-300">
            <FiAlertTriangle className="flex-shrink-0 mt-0.5 text-red-500" size={16} />
            <span>{removedCommentAlert}</span>
            <button
              onClick={() => setRemovedCommentAlert(null)}
              className="ml-auto flex-shrink-0 text-red-400 hover:text-red-700"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          placeholder="Write a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          disabled={adding}
        />
        <button
          onClick={handleAddComment}
          disabled={adding || !newCommentText.trim()}
          className={`px-4 py-2 rounded-full text-white text-sm font-semibold transition-colors ${adding || !newCommentText.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
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
              isFlagged={flaggedCommentIds.has(comment._id)}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onToggleHide={handleToggleHide}
            />
          ))}
        </div>
      )}
    </div>
  );
}
