// import { useState } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { FiMessageCircle, FiMoreVertical, FiThumbsUp } from "react-icons/fi";
// import { AiFillLike } from "react-icons/ai";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";
// import CommentSection from "./CommentSection";
// import { useRoleMap } from "../../hooks/useRoleMap";
// import { likePost, unlikePost, updatePost, deletePost } from "../../api/post";
// import SuccessModal from "../SuccessModal";
// import ErrorModal from "../ErrorModal";

// export default function PostCard({ post, currentUserId, onDeletePost }) {
//   const { author, text, mediaUrls = [], createdAt, likesCount = 0, likedByCurrentUser = false, commentsCount = 0 } = post;
//   const { formatRole } = useRoleMap();

//   const formattedTime = new Date(createdAt).toLocaleString();

//   const [showComments, setShowComments] = useState(false);
//   const [likes, setLikes] = useState(likesCount);
//   const [liked, setLiked] = useState(likedByCurrentUser);
//   const [animating, setAnimating] = useState(false);
//   const [loadingLike, setLoadingLike] = useState(false);
//   const [modalIndex, setModalIndex] = useState(null);
//   const [commentsCountState, setCommentsCountState] = useState(commentsCount);
//    const [successModalOpen, setSuccessModalOpen] = useState(false);
//   const [errorModalOpen, setErrorModalOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);


//   // === Edit/Delete States ===
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedText, setEditedText] = useState(text);
//   const [savingEdit, setSavingEdit] = useState(false);

//   // === Like toggle ===
//   const handleLikeToggle = async () => {
//     if (loadingLike) return;
//     setLiked(prev => !prev);
//     setLikes(prev => (liked ? prev - 1 : prev + 1));
//     setAnimating(true);
//     setLoadingLike(true);

//     try {
//       if (liked) await unlikePost(post._id);
//       else await likePost(post._id);
//     } catch (err) {
//       console.error("Like/unlike failed:", err);
//       setLiked(prev => !prev);
//       setLikes(prev => (liked ? prev + 1 : prev - 1));
//     } finally {
//       setLoadingLike(false);
//       setTimeout(() => setAnimating(false), 300);
//     }
//   };

//   // === Save Edited Post ===
//   const handleSaveEdit = async () => {
//     if (!editedText.trim()) return;
//     try {
//       setSavingEdit(true);
//       await updatePost(post._id, { text: editedText });
//       setIsEditing(false);
//     } catch (err) {
//       console.error("Failed to update post:", err);
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   // === Delete Post ===

// const handleDeletePost = async () => {
//   const confirmDelete = window.confirm("Are you sure you want to delete this post?");
//   if (!confirmDelete) return;

//   try {
//     await deletePost(post._id);
//     setSuccessModalOpen(true); // ✅ show success modal
//     if (onDeletePost) onDeletePost(post._id); // notify parent to remove post
//   } catch (err) {
//     console.error("Failed to delete post:", err);
//     setErrorMessage(err.message || "Failed to delete post.");
//     setErrorModalOpen(true); // ✅ show error modal
//   }
// };

//   return (
//     <div className="bg-white shadow-md rounded-2xl p-5 mb-6 transition-all hover:shadow-lg">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div className="flex items-start gap-3">
//           <DevstaAvatar user={author} size={45} />
//           <div className="flex flex-col">
//             <div className="flex items-center gap-2">
//               <h3 className="font-bold text-[15px] text-gray-900">{author?.name}</h3>
//               <span className="text-gray-500 text-[11px] font-semibold">• {formattedTime}</span>
//             </div>
//             {author?.primaryRole && (
//               <p className="font-semibold text-gray-400 text-[14px] capitalize">{formatRole(author.primaryRole)}</p>
//             )}
//           </div>
//         </div>

//         {/* Edit/Delete Dropdown */}
//         {currentUserId === author._id && (
//           <div className="relative">
// <FiMoreVertical
//   className="cursor-pointer text-gray-500"
//   size={20}
//   onClick={() => setMenuOpen(prev => !prev)}
// />

//            {menuOpen && (
//   <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
//     <button
//       className="w-full text-left px-4 py-2 hover:bg-gray-100"
//       onClick={() => {
//         setIsEditing(true);  // start editing
//         setMenuOpen(false);  // close menu
//       }}
//     >
//       Edit
//     </button>
//     <button
//       className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
//       onClick={() => {
//         handleDeletePost();  // delete post
//         setMenuOpen(false);  // close menu
//       }}
//     >
//       Delete
//     </button>
//   </div>
// )}

//           </div>
//         )}
//       </div>

//       {/* Post Content */}
//       {isEditing ? (
//         <div className="mt-3 flex flex-col gap-2">
//           <textarea
//             className="w-full border border-gray-300 rounded-lg p-2 resize-none"
//             rows={3}
//             value={editedText}
//             onChange={e => setEditedText(e.target.value)}
//           />
//           <div className="flex gap-2 justify-end">
//             <button
//               className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400"
//               onClick={() => setIsEditing(false)}
//               disabled={savingEdit}
//             >
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark"
//               onClick={handleSaveEdit}
//               disabled={savingEdit}
//             >
//               {savingEdit ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </div>
//       ) : (
//         text && <p className="mt-3 text-[14px] text-gray-800 leading-relaxed font-semibold">{text}</p>
//       )}

//       {/* Media */}
//       <div className="flex flex-wrap gap-2 mt-3">
//         {mediaUrls.slice(0, 3).map((url, idx) => {
//           let basis = "100%";
//           if (mediaUrls.length === 2) basis = "calc(50% - 4px)";
//           else if (mediaUrls.length >= 3) basis = idx === 0 ? "100%" : "calc(50% - 4px)";
//           return (
//             <div
//               key={idx}
//               className="relative cursor-pointer rounded-lg border-gray-200 border-2 overflow-hidden bg-gray-50"
//               style={{ flexBasis: basis, flexGrow: 0, minHeight: "200px" }}
//               onClick={() => setModalIndex(idx)}
//             >
//               <div className="w-full h-full transform transition-transform duration-300 hover:scale-105">
//                 {url.match(/\.(mp4|webm|mov|ogg)$/i) ? (
//                   <video src={url} controls className="absolute top-0 left-0 w-full h-full object-cover" />
//                 ) : (
//                   <img src={url} alt={`media-${idx}`} className="absolute top-0 left-0 w-full h-full object-cover" />
//                 )}
//               </div>
//               {idx === 2 && mediaUrls.length > 3 && (
//                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
//                   +{mediaUrls.length - 3}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Footer */}
//       <div className="flex items-center gap-3 mt-4">
//         {/* Like */}
//         <div
//           className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer select-none relative"
//           onClick={handleLikeToggle}
//         >
//           {liked ? (
//             <AiFillLike className={`text-primary transition-transform duration-200 ${animating ? "animate-like-pop" : ""}`} size={20} />
//           ) : (
//             <FiThumbsUp className="text-gray-400" size={20} />
//           )}
//           <span className="text-sm font-semibold text-gray-700">
//             {likes} Like{likes !== 1 ? "s" : ""}
//           </span>
//         </div>

//         {/* Comment */}
//         <div
//           className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/10 transition-colors"
//           onClick={() => setShowComments(prev => !prev)}
//         >
//           <FiMessageCircle className="text-gray-700" />
//           <span className="text-gray-700 font-semibold text-sm">
//             {commentsCountState} Comment{commentsCountState !== 1 ? "s" : ""}
//           </span>
//         </div>
//       </div>

//       {showComments && <hr className="border-t border-gray-300 mt-4" />}
//       {showComments && (
//         <CommentSection
//           postId={post._id}
//           currentUserId={currentUserId}
//           postAuthorId={author._id}
//           setCommentsCount={setCommentsCountState}
//         />
//       )}

//       {/* Media Modal */}
//       {modalIndex !== null && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setModalIndex(null)}>
//           <div className="relative max-w-[90%] max-h-[90%]" onClick={e => e.stopPropagation()}>
//             {mediaUrls[modalIndex].match(/\.(mp4|webm|mov|ogg)$/i) ? (
//               <video src={mediaUrls[modalIndex]} controls className="max-h-[90vh] max-w-full object-contain rounded-lg" />
//             ) : (
//               <img src={mediaUrls[modalIndex]} className="max-h-[90vh] max-w-full object-contain rounded-lg" alt={`modal-${modalIndex}`} />
//             )}
//             <button className="fixed top-4 right-4 bg-black/50 rounded-full p-2 text-white z-50" onClick={() => setModalIndex(null)}>
//               <X size={24} />
//             </button>
//             {mediaUrls.length > 1 && (
//               <>
//                 <button
//                   className="fixed top-1/2 left-4 bg-black/50 rounded-full p-2 text-white -translate-y-1/2 z-50"
//                   onClick={() => setModalIndex((modalIndex - 1 + mediaUrls.length) % mediaUrls.length)}
//                 >
//                   <ChevronLeft size={28} />
//                 </button>
//                 <button
//                   className="fixed top-1/2 right-4 bg-black/50 rounded-full p-2 text-white -translate-y-1/2 z-50"
//                   onClick={() => setModalIndex((modalIndex + 1) % mediaUrls.length)}
//                 >
//                   <ChevronRight size={28} />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes like-pop {
//             0% { transform: scale(1); }
//             50% { transform: scale(1.6); }
//             100% { transform: scale(1); }
//           }
//           .animate-like-pop {
//             animation: like-pop 0.3s ease-out forwards;
//           }
//         `}
//       </style>

//       {/* Success Modal */}
// <SuccessModal
//   open={successModalOpen}
//   message="Post deleted successfully!"
//   onClose={() => setSuccessModalOpen(false)}
// />

// {/* Error Modal */}
// <ErrorModal
//   open={errorModalOpen}
//   message={errorMessage}
//   onClose={() => setErrorModalOpen(false)}
// />

//     </div>
//   );
// }


// import { useState, useRef, useEffect } from "react";
// import DevstaAvatar from "../dashboard/DevstaAvatar";
// import { FiMessageCircle, FiMoreVertical, FiThumbsUp, FiImage, FiVideo } from "react-icons/fi";
// import { AiFillLike } from "react-icons/ai";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";
// import { IoClose } from "react-icons/io5";
// import CommentSection from "./CommentSection";
// import { useRoleMap } from "../../hooks/useRoleMap";
// import { likePost, unlikePost, updatePost, deletePost } from "../../api/post";
// import SuccessModal from "../SuccessModal";
// import ErrorModal from "../ErrorModal";

// export default function PostCard({ post, currentUserId, onDeletePost, onEditPost }) {
//     const { author, text, mediaUrls = [], createdAt, likesCount = 0, likedByCurrentUser = false, commentsCount = 0 } = post;
//     const { formatRole } = useRoleMap();

//     const formattedTime = new Date(createdAt).toLocaleString();

//     const [showComments, setShowComments] = useState(false);
//     const [likes, setLikes] = useState(likesCount);
//     const [liked, setLiked] = useState(likedByCurrentUser);
//     const [animating, setAnimating] = useState(false);
//     const [loadingLike, setLoadingLike] = useState(false);
//     const [modalIndex, setModalIndex] = useState(null);
//     const [previewMedia, setPreviewMedia] = useState(null);
//     const [commentsCountState, setCommentsCountState] = useState(commentsCount);
//     const [successModalOpen, setSuccessModalOpen] = useState(false);
//     const [errorModalOpen, setErrorModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [menuOpen, setMenuOpen] = useState(false);

//     // Edit states
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedText, setEditedText] = useState(text);
//     const [editedMediaFiles, setEditedMediaFiles] = useState([]);
//     const [visibleMedia, setVisibleMedia] = useState(mediaUrls);
//     const [savingEdit, setSavingEdit] = useState(false);

//     useEffect(() => {
//         setEditedText(post.text || "");
//         setVisibleMedia(post.mediaUrls || []);
//     }, [post]);

//     const photoInputRef = useRef(null);
//     const videoInputRef = useRef(null);

//     // Handle like toggle
//     const handleLikeToggle = async () => {
//         if (loadingLike) return;
//         setLiked(prev => !prev);
//         setLikes(prev => (liked ? prev - 1 : prev + 1));
//         setAnimating(true);
//         setLoadingLike(true);

//         try {
//             if (liked) await unlikePost(post._id);
//             else await likePost(post._id);
//         } catch (err) {
//             console.error("Like/unlike failed:", err);
//             setLiked(prev => !prev);
//             setLikes(prev => (liked ? prev + 1 : prev - 1));
//         } finally {
//             setLoadingLike(false);
//             setTimeout(() => setAnimating(false), 300);
//         }
//     };



//     const handleSaveEdit = async () => {
//         // Prevent saving if nothing changed
//         if (!editedText.trim() && editedMediaFiles.length === 0) return;

//         try {
//             setSavingEdit(true);

//             const formData = new FormData();
//             formData.append("text", editedText);

//             // Append new media files
//             editedMediaFiles.forEach(file => formData.append("media", file));

//             // Call backend
//             const updatedPostRes = await updatePost(post._id, formData);

//             // Safely extract post object
//             const updatedPost = updatedPostRes?.post || {};

//             // Ensure mediaUrls is always an array
//             const backendMediaUrls = Array.isArray(updatedPost.mediaUrls) ? updatedPost.mediaUrls : [];

//             // Include newly added local files for preview
//             const localMediaUrls = editedMediaFiles.map(file =>
//                 typeof file === "string" ? file : URL.createObjectURL(file)
//             );

//             const combinedMediaUrls = [...backendMediaUrls, ...localMediaUrls];

//             // Update local state
//             setVisibleMedia(combinedMediaUrls);
//             setEditedText(updatedPost.text || editedText);
//             setEditedMediaFiles([]);
//             setIsEditing(false);

//             // Notify parent
//             if (typeof onEditPost === "function") {
//                 onEditPost({
//                     ...updatedPost,
//                     mediaUrls: backendMediaUrls,
//                     text: updatedPost.text || editedText
//                 });
//             }

//         } catch (err) {
//             console.error("Failed to update post:", err);
//             setErrorMessage(err?.message || "Failed to update post.");
//             setErrorModalOpen(true);
//         } finally {
//             setSavingEdit(false);
//         }
//     };


//     // Delete post
//     const handleDeletePost = async () => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this post?");
//         if (!confirmDelete) return;

//         try {
//             await deletePost(post._id);
//             setSuccessModalOpen(true);
//             if (onDeletePost) onDeletePost(post._id);
//         } catch (err) {
//             console.error("Failed to delete post:", err);
//             setErrorMessage(err.message || "Failed to delete post.");
//             setErrorModalOpen(true);
//         }
//     };

//     // Handle file select
//     const handleFileSelect = (e) => {
//         const files = Array.from(e.target.files);
//         setEditedMediaFiles(prev => [...prev, ...files]);
//         setVisibleMedia(prev => [...prev, ...files]);
//     };

//     const removeMedia = (index) => {
//         setEditedMediaFiles(prev => prev.filter((_, i) => i !== index));
//         setVisibleMedia(prev => prev.filter((_, i) => i !== index));
//     };

//     return (
//         <div className="bg-white shadow-md rounded-2xl p-5 mb-6 transition-all hover:shadow-lg">
//             {/* Header */}
//             <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-3">
//                     <DevstaAvatar user={author} size={45} />
//                     <div className="flex flex-col">
//                         <div className="flex items-center gap-2">
//                             <h3 className="font-bold text-[15px] text-gray-900">{author?.name}</h3>
//                             <span className="text-gray-500 text-[11px] font-semibold">• {formattedTime}</span>
//                         </div>
//                         {author?.primaryRole && (
//                             <p className="font-semibold text-gray-400 text-[14px] capitalize">{formatRole(author.primaryRole)}</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Edit/Delete Dropdown */}
//                 {currentUserId === author._id && (
//                     <div className="relative">
//                         <FiMoreVertical
//                             className="cursor-pointer text-gray-500"
//                             size={20}
//                             onClick={() => setMenuOpen(prev => !prev)}
//                         />
//                         {menuOpen && (
//                             <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
//                                 <button
//                                     className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                                     onClick={() => {
//                                         setIsEditing(true);
//                                         setMenuOpen(false);
//                                     }}
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
//                                     onClick={() => {
//                                         handleDeletePost();
//                                         setMenuOpen(false);
//                                     }}
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Post Content & Media */}
//             {isEditing ? (
//                 <div className="mt-3 flex flex-col gap-2">
//                     {/* === EDIT MODE === */}
//                     <textarea
//                         className="w-full border border-gray-300 rounded-lg p-2 resize-none"
//                         rows={3}
//                         value={editedText}
//                         onChange={e => setEditedText(e.target.value)}
//                     />
//                     {/* Hidden inputs */}
//                     <input type="file" accept="image/*" ref={photoInputRef} className="hidden" multiple onChange={handleFileSelect} />
//                     <input type="file" accept="video/*" ref={videoInputRef} className="hidden" multiple onChange={handleFileSelect} />
//                     <div className="flex gap-2 mt-2">
//                         <button type="button" onClick={() => photoInputRef.current.click()} className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-primary/10">
//                             <FiImage /> Photo
//                         </button>
//                         <button type="button" onClick={() => videoInputRef.current.click()} className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-primary/10">
//                             <FiVideo /> Video
//                         </button>
//                     </div>
//                     <div className="flex gap-2 justify-end mt-2">
//                         <button
//                             className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400"
//                             onClick={() => {
//                                 setIsEditing(false);
//                                 setEditedText(post.text);
//                                 setEditedMediaFiles([]);
//                                 setVisibleMedia(post.mediaUrls || []);
//                             }}
//                             disabled={savingEdit}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark"
//                             onClick={handleSaveEdit}
//                             disabled={savingEdit}
//                         >
//                             {savingEdit ? "Saving..." : "Save"}
//                         </button>
//                     </div>

//                     {/* Edit Mode: Media Preview */}
//                     {visibleMedia.length > 0 && (
//                         <div className="mt-3 grid grid-cols-3 gap-2">
//                             {visibleMedia.map((item, i) => {
//                                 const isFile = item instanceof File;
//                                 const url = isFile ? URL.createObjectURL(item) : item;
//                                 const isVideo = isFile ? item.type.startsWith("video") : url.match(/\.(mp4|webm|mov|ogg)$/i);

//                                 return (
//                                     <div key={i} className="relative group">
//                                         <button
//                                             onClick={() => removeMedia(i)}
//                                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-10"
//                                         >
//                                             <IoClose size={14} />
//                                         </button>
//                                         {isVideo ? (
//                                             <video src={url} controls className="w-full h-32 object-cover rounded-lg" />
//                                         ) : (
//                                             <img src={url} alt="" className="w-full h-32 object-cover rounded-lg" />
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             ) : (
//                 <>
//                     {/* === VIEW MODE === */}
//                     {text && <p className="mt-3 text-[14px] text-gray-800 leading-relaxed font-semibold">{text}</p>}

//                     {/* Media Grid */}
//                     {/* Media Grid - Original Style: Max 3, with +N overlay */}
//                     {mediaUrls.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mt-3">
//                             {mediaUrls.slice(0, 3).map((url, idx) => {
//                                 let basis = "100%";
//                                 if (mediaUrls.length === 2) {
//                                     basis = "calc(50% - 4px)";
//                                 } else if (mediaUrls.length >= 3) {
//                                     basis = idx === 0 ? "100%" : "calc(50% - 4px)";
//                                 }

//                                 const isVideo = url.match(/\.(mp4|webm|mov|ogg)$/i);

//                                 return (
//                                     <div
//                                         key={idx}
//                                         className="relative cursor-pointer rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50"
//                                         style={{ flexBasis: basis, flexGrow: 0, minHeight: "200px" }}
//                                         onClick={() => setPreviewMedia(url)}
//                                     >
//                                         <div className="w-full h-full transition-transform duration-300 hover:scale-105">
//                                             {isVideo ? (
//                                                 <video
//                                                     src={url}
//                                                     controls={false}
//                                                     className="absolute top-0 left-0 w-full h-full object-cover"
//                                                 />
//                                             ) : (
//                                                 <img
//                                                     src={url}
//                                                     alt={`media-${idx}`}
//                                                     className="absolute top-0 left-0 w-full h-full object-cover"
//                                                 />
//                                             )}
//                                         </div>

//                                         {/* Overlay: +N if more than 3 */}
//                                         {idx === 2 && mediaUrls.length > 3 && (
//                                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
//                                                 +{mediaUrls.length - 3}
//                                             </div>
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </>
//             )}

//             {/* Footer */}
//             <div className="flex items-center gap-3 mt-4">
//                 <div
//                     className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer select-none relative"
//                     onClick={handleLikeToggle}
//                 >
//                     {liked ? (
//                         <AiFillLike className={`text-primary transition-transform duration-200 ${animating ? "animate-like-pop" : ""}`} size={20} />
//                     ) : (
//                         <FiThumbsUp className="text-gray-400" size={20} />
//                     )}
//                     <span className="text-sm font-semibold text-gray-700">
//                         {likes} Like{likes !== 1 ? "s" : ""}
//                     </span>
//                 </div>

//                 <div
//                     className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/10 transition-colors"
//                     onClick={() => setShowComments(prev => !prev)}
//                 >
//                     <FiMessageCircle className="text-gray-700" />
//                     <span className="text-gray-700 font-semibold text-sm">
//                         {commentsCountState} Comment{commentsCountState !== 1 ? "s" : ""}
//                     </span>
//                 </div>
//             </div>

//             {showComments && <hr className="border-t border-gray-300 mt-4" />}
//             {showComments && (
//                 <CommentSection
//                     postId={post._id}
//                     currentUserId={currentUserId}
//                     postAuthorId={author._id}
//                     setCommentsCount={setCommentsCountState}
//                 />
//             )}

//             {/* Preview modal */}
//             {previewMedia && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//                     <div className="relative bg-white rounded-xl p-4 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col items-center">
//                         <button
//                             className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-1 z-50 hover:bg-black"
//                             onClick={() => setPreviewMedia(null)}
//                         >
//                             <IoClose size={26} />
//                         </button>
//                         {typeof previewMedia === "string" && previewMedia.match(/\.(mp4|webm|mov|ogg)$/i) ? (
//                             <video
//                                 src={previewMedia}
//                                 controls
//                                 className="max-h-[80vh] w-auto rounded-xl object-contain"
//                             />
//                         ) : previewMedia.type?.startsWith("image") || typeof previewMedia === "string" ? (
//                             <img
//                                 src={typeof previewMedia === "string" ? previewMedia : URL.createObjectURL(previewMedia)}
//                                 className="max-h-[80vh] w-auto rounded-xl object-contain"
//                                 alt=""
//                             />
//                         ) : (
//                             <video
//                                 src={URL.createObjectURL(previewMedia)}
//                                 controls
//                                 className="max-h-[80vh] w-auto rounded-xl object-contain"
//                             />
//                         )}
//                     </div>
//                 </div>
//             )}

//             <style>
//                 {`
//                     @keyframes like-pop {
//                         0% { transform: scale(1); }
//                         50% { transform: scale(1.6); }
//                         100% { transform: scale(1); }
//                     }
//                     .animate-like-pop {
//                         animation: like-pop 0.3s ease-out forwards;
//                     }
//                 `}
//             </style>

//             {/* Success Modal */}
//             <SuccessModal
//                 open={successModalOpen}
//                 message="Post deleted successfully!"
//                 onClose={() => setSuccessModalOpen(false)}
//             />

//             {/* Error Modal */}
//             <ErrorModal
//                 open={errorModalOpen}
//                 message={errorMessage}
//                 onClose={() => setErrorModalOpen(false)}
//             />
//         </div>
//     );
// }


import { useState, useRef, useEffect } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import {
  FiMessageCircle,
  FiMoreVertical,
  FiThumbsUp,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import { AiFillLike } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CommentSection from "./CommentSection";
import { useRoleMap } from "../../hooks/useRoleMap";
import {
  likePost,
  unlikePost,
  updatePost,
  deletePost,
} from "../../api/post";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import { Link } from "react-router-dom";
import ConfirmModal from "../ConfirmModal";
import { showToast } from "../../utils/toast";

export default function PostCard({
  post,
  currentUserId,
  onDeletePost,
  onEditPost,
}) {
  const {
    author,
    text,
    mediaUrls = [],
    createdAt,
    likesCount = 0,
    likedByCurrentUser = false,
    commentsCount = 0,
  } = post;
  const { formatRole } = useRoleMap();

  const formattedTime = new Date(createdAt).toLocaleString();

  /* ---------- UI state ---------- */
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [liked, setLiked] = useState(likedByCurrentUser);
  const [animating, setAnimating] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [commentsCountState, setCommentsCountState] = useState(commentsCount);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------- Edit state ---------- */
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [editedMediaFiles, setEditedMediaFiles] = useState([]);
  const [visibleMedia, setVisibleMedia] = useState(mediaUrls);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletedMediaUrls, setDeletedMediaUrls] = useState([]);
const [confirmOpen, setConfirmOpen] = useState(false);

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  /* ---------- Lightbox state ---------- */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  /* ---------- Sync post → local edit state ---------- */
//   useEffect(() => {
//     setEditedText(post.text || "");
//     setVisibleMedia(post.mediaUrls || []);
//   }, [post]);

  /* ---------- Like handling ---------- */
//   const handleLikeToggle = async () => {
//     if (loadingLike) return;
//     const willLike = !liked;
//     setLiked(willLike);
//     setLikes((c) => (willLike ? c + 1 : c - 1));
//     setAnimating(true);
//     setLoadingLike(true);
//     try {
//       if (willLike) await likePost(post._id);
//       else await unlikePost(post._id);
//     } catch (err) {
//       console.error("Like/unlike failed:", err);
//       setLiked(!willLike);
//       setLikes((c) => (willLike ? c - 1 : c + 1));
//     } finally {
//       setLoadingLike(false);
//       setTimeout(() => setAnimating(false), 300);
//     }
//   };
const handleLikeToggle = async () => {
  if (loadingLike) return;

  const willLike = !liked;
  const previousLiked = liked;
  const previousLikes = likes;

  // Optimistic update
  setLiked(willLike);
  setLikes(willLike ? likes + 1 : likes - 1);
  setAnimating(true);
  setLoadingLike(true);

  try {
    let response;
    if (willLike) {
      response = await likePost(post._id);
    } else {
      response = await unlikePost(post._id);
    }

    // If backend says "already liked", revert
    if (willLike && response.alreadyLiked) {
      setLiked(false);
      setLikes(previousLikes);
      return;
    }

    // Success: keep optimistic state
  } catch (err) {
    console.error("Like/unlike failed:", err);
    // Revert on error
    setLiked(previousLiked);
    setLikes(previousLikes);
  } finally {
    setLoadingLike(false);
    setTimeout(() => setAnimating(false), 300);
  }
};
  /* ---------- Edit handling ---------- */
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setEditedMediaFiles((prev) => [...prev, ...files]);
    setVisibleMedia((prev) => [...prev, ...files]);
  };

const removeMedia = (index) => {
  const item = visibleMedia[index];

  // If it's an existing media URL, track it for deletion
  if (typeof item === "string") {
    setDeletedMediaUrls(prev => [...prev, item]);
  }

  setEditedMediaFiles(prev => prev.filter((_, i) => i !== index));
  setVisibleMedia(prev => prev.filter((_, i) => i !== index));
};

//   const handleSaveEdit = async () => {
//     if (!editedText.trim() && editedMediaFiles.length === 0) return;

//     try {
//       setSavingEdit(true);
//       const formData = new FormData();
//       formData.append("text", editedText);
//       editedMediaFiles.forEach((f) => formData.append("media", f));

//       const updatedPostRes = await updatePost(post._id, formData);
//       const updatedPost = updatedPostRes?.post || {};

//       const backendMediaUrls = Array.isArray(updatedPost.mediaUrls)
//         ? updatedPost.mediaUrls
//         : [];

//       // local preview URLs for newly added files
//       const localMediaUrls = editedMediaFiles.map((f) =>
//         typeof f === "string" ? f : URL.createObjectURL(f)
//       );

//       const combined = [...backendMediaUrls, ...localMediaUrls];

//       setVisibleMedia(combined);
//       setEditedText(updatedPost.text || editedText);
//       setEditedMediaFiles([]);
//       setIsEditing(false);

//       if (typeof onEditPost === "function") {
//         onEditPost({
//   ...updatedPost,
//   mediaUrls: backendMediaUrls,
//   text: editedText,  // ← USE editedText, NOT updatedPost.text
// });
//       }
//     } catch (err) {
//       console.error("Failed to update post:", err);
//       setErrorMessage(err?.message || "Failed to update post.");
//       setErrorModalOpen(true);
//     } finally {
//       setSavingEdit(false);
//     }
//   };

const handleSaveEdit = async () => {
  if (!editedText.trim() && editedMediaFiles.length === 0 && deletedMediaUrls.length === 0) return;

  try {
    setSavingEdit(true);
    const formData = new FormData();
    formData.append("text", editedText);

    // Add new files
    editedMediaFiles.forEach((f) => formData.append("media", f));

    // Add URLs to delete — BUT send as `removePublicIds` and extract public_id
   // === DELETE MEDIA ===
deletedMediaUrls.forEach((url) => {
  const publicId = (() => {
    try {
      const afterUpload = url.split('/upload/')[1];
      if (!afterUpload) return null;
      const parts = afterUpload.split('/');
      return parts.slice(1).join('/').split('.')[0]; // skip v123, take folder/file
    } catch {
      return null;
    }
  })();

  if (publicId) {
    formData.append("removePublicIds", publicId);
  }
});

    const updatedPostRes = await updatePost(post._id, formData);
    const updatedPost = updatedPostRes?.post || updatedPostRes;

    // Use updated mediaUrls from backend
    const backendMediaUrls = Array.isArray(updatedPost.mediaUrls)
      ? updatedPost.mediaUrls
      : [];

    setVisibleMedia(backendMediaUrls);
    setEditedText(updatedPost.text || editedText);
    setEditedMediaFiles([]);
    setDeletedMediaUrls([]);
    setIsEditing(false);

    if (typeof onEditPost === "function") {
      onEditPost({
        ...updatedPost,
        mediaUrls: backendMediaUrls,
        text: editedText,  // ← Use your local editedText
      });
    }
  } catch (err) {
    console.error("Failed to update post:", err);
    setErrorMessage(err?.message || "Failed to update post.");
    setErrorModalOpen(true);
  } finally {
    setSavingEdit(false);
  }
};


const handleDelete = async () => {
  setConfirmOpen(false);
  try {
    await deletePost(post._id);
    if (onDeletePost) onDeletePost(post._id);

    // Show success toast
    showToast("Post deleted successfully!", 3000);
  } catch (err) {
    // Show error toast
    showToast(err?.message || "Failed to delete post.", 3000);
    console.error("Delete error:", err);
  }
};



  /* ---------- Lightbox helpers ---------- */
  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const goPrev = () =>
    setLightboxIndex((i) => (i - 1 + mediaUrls.length) % mediaUrls.length);
  const goNext = () =>
    setLightboxIndex((i) => (i + 1) % mediaUrls.length);

  // keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  /* ---------- Render ---------- */
  return (
    <div className="bg-white shadow-md rounded-2xl p-5 mb-6 transition-all hover:shadow-lg">
      {/* ---------- Header ---------- */}
     <div className="flex items-start justify-between">
  <div className="flex items-start gap-3">
    {/* Clickable Avatar */}
    <Link to={`/dashboard/community/${author?._id}`}>
      <DevstaAvatar user={author} size={45} className="cursor-pointer transition-opacity hover:opacity-80" />
    </Link>

    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {/* Clickable Name */}
        <Link
          to={`/dashboard/community/${author?._id}`}
          className="font-bold text-[15px] text-gray-900 hover:text-primary transition-colors duration-200"
        >
          {author?.name}
        </Link>
        <span className="text-gray-500 text-[11px] font-semibold">
          • {formattedTime}
        </span>
      </div>

      {author?.primaryRole && (
        <p className="font-semibold text-gray-400 text-[14px] capitalize">
          {formatRole(author.primaryRole)}
        </p>
      )}
    </div>
  </div>

  {/* Edit/Delete Menu — Prevent Navigation */}
  {currentUserId === author._id && (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <FiMoreVertical
        className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
        size={20}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
      />
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setEditedText(post.text || "");
              setVisibleMedia(post.mediaUrls || []);
              setEditedMediaFiles([]);
              setDeletedMediaUrls([]);
              setMenuOpen(false);
            }}
          >
            Edit
          </button>
          <button
  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 transition-colors"
  onClick={(e) => {
    e.stopPropagation();
    setConfirmOpen(true);
    setMenuOpen(false);
  }}
>
  Delete
</button>

        </div>
      )}
    </div>
  )}
</div>

      {/* ---------- Content & Media ---------- */}
      {isEditing ? (
        /* ---------- EDIT MODE ---------- */
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 resize-none"
            rows={3}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          {/* hidden file inputs */}
          <input
            type="file"
            accept="image/*"
            ref={photoInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => photoInputRef.current.click()}
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-primary/10"
            >
              <FiImage /> Photo
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current.click()}
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-primary/10"
            >
              <FiVideo /> Video
            </button>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button
  className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400"
  onClick={() => {
    setIsEditing(false);
    setEditedText(post.text || "");           // Reset to current
    setEditedMediaFiles([]);
    setVisibleMedia(post.mediaUrls || []);
  }}
  disabled={savingEdit}
>
  Cancel
</button>
            <button
              className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark"
              onClick={handleSaveEdit}
              disabled={savingEdit}
            >
              {savingEdit ? "Saving..." : "Save"}
            </button>
          </div>

          {/* preview of current + newly added files */}
          {visibleMedia.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {visibleMedia.map((item, i) => {
                const isFile = item instanceof File;
                const url = isFile ? URL.createObjectURL(item) : item;
                const isVideo = isFile
                  ? item.type.startsWith("video")
                  : url.match(/\.(mp4|webm|mov|ogg)$/i);

                return (
                  <div key={i} className="relative group">
                    <button
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-10"
                    >
                      <IoClose size={14} />
                    </button>
                    {isVideo ? (
                      <video
                        src={url}
                        controls
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={url}
                        alt=""
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ---------- VIEW MODE ---------- */
        <>
          {text && (
            <p className="mt-3 text-[14px] text-gray-800 leading-relaxed font-semibold">
              {text}
            </p>
          )}

          {/* ---------- THUMBNAIL GRID (max 3) ---------- */}
          {mediaUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {mediaUrls.slice(0, 3).map((url, idx) => {
                let basis = "100%";
                if (mediaUrls.length === 2) {
                  basis = "calc(50% - 4px)";
                } else if (mediaUrls.length >= 3) {
                  basis = idx === 0 ? "100%" : "calc(50% - 4px)";
                }

                const isVideo = url.match(/\.(mp4|webm|mov|ogg)$/i);

                return (
                  <div
                    key={idx}
                    className="relative cursor-pointer rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50"
                    style={{
                      flexBasis: basis,
                      flexGrow: 0,
                      minHeight: "200px",
                    }}
                    onClick={() => openLightbox(idx)}
                  >
                    <div className="w-full h-full transition-transform duration-300 hover:scale-105">
                      {isVideo ? (
                        <video
                          src={url}
                          controls={false}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`media-${idx}`}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* +N overlay */}
                    {idx === 2 && mediaUrls.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
                        +{mediaUrls.length - 3}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ---------- Footer (like / comment) ---------- */}
      <div className="flex items-center gap-3 mt-4">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer select-none relative"
          onClick={handleLikeToggle}
        >
          {liked ? (
            <AiFillLike
              className={`text-primary transition-transform duration-200 ${
                animating ? "animate-like-pop" : ""
              }`}
              size={20}
            />
          ) : (
            <FiThumbsUp className="text-gray-400" size={20} />
          )}
          <span className="text-sm font-semibold text-gray-700">
            {likes} Like{likes !== 1 ? "s" : ""}
          </span>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => setShowComments((v) => !v)}
        >
          <FiMessageCircle className="text-gray-700" />
          <span className="text-gray-700 font-semibold text-sm">
            {commentsCountState} Comment
            {commentsCountState !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {showComments && <hr className="border-t border-gray-300 mt-4" />}
      {showComments && (
        <CommentSection
          postId={post._id}
          currentUserId={currentUserId}
          postAuthorId={author._id}
          setCommentsCount={setCommentsCountState}
        />
      )}


     {/* ---------- LIGHTBOX (Arrows work, background click closes) ---------- */}
{lightboxOpen && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    onClick={closeLightbox} // ← Closes only on background
  >
    {/* Media Container — stops click from bubbling */}
    <div
      className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
      onClick={(e) => e.stopPropagation()} // ← Prevents close on media/inside
    >
      {/* Media */}
      {mediaUrls[lightboxIndex].match(/\.(mp4|webm|mov|ogg)$/i) ? (
        <video
          src={mediaUrls[lightboxIndex]}
          controls
          autoPlay
          className="max-h-[90vh] w-auto mx-auto rounded-xl object-contain"
        />
      ) : (
        <img
          src={mediaUrls[lightboxIndex]}
          alt=""
          className="max-h-[90vh] w-auto mx-auto rounded-xl object-contain"
        />
      )}
    </div>

    {/* Close Button */}
    <button
      className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 z-50 hover:bg-black"
      onClick={closeLightbox}
    >
      <IoClose size={26} />
    </button>

    {/* Navigation Arrows — Outside container, always clickable */}
    {mediaUrls.length > 1 && (
      <>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-3 hover:bg-black transition-all z-50"
          onClick={(e) => {
            e.stopPropagation(); // ← Critical: prevent close
            goPrev();
          }}
          style={{ left: "1rem" }}
        >
          <ChevronLeft size={36} />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-3 hover:bg-black transition-all z-50"
          onClick={(e) => {
            e.stopPropagation(); // ← Critical: prevent close
            goNext();
          }}
          style={{ right: "1rem" }}
        >
          <ChevronRight size={36} />
        </button>
      </>
    )}
  </div>
)}

      {/* ---------- Like animation ---------- */}
      <style>
        {`
          @keyframes like-pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.6); }
            100% { transform: scale(1); }
          }
          .animate-like-pop {
            animation: like-pop 0.3s ease-out forwards;
          }
        `}
      </style>

      {/* ---------- Modals ---------- */}
      <SuccessModal
        open={successModalOpen}
        message="Post deleted successfully!"
        onClose={() => setSuccessModalOpen(false)}
      />
      <ErrorModal
        open={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
<ConfirmModal
  open={confirmOpen}
  title="Delete Post?"
  message="This post will be permanently removed. This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={() => setConfirmOpen(false)}
/>


    </div>
  );
}