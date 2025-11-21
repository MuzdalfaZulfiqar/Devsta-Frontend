import React, { useEffect, useState, useMemo } from "react";
import AdminDashboardLayout from "../../components/admin/AdminDashboardLayout";
import {
  fetchAllPosts,
  hidePost,
  unhidePost,
  deletePost,
  fetchAllComments,
  hideComment,
  unhideComment,
  deleteComment,
} from "../../api/admin";
import { showToast } from "../../utils/toast";
import ConfirmModal from "../../components/ConfirmModal";
import PostContentModal from "./PostContentModal";
import {
  Eye,
  EyeOff,
  Trash2,
  MessageCircle,
  AlertCircle,
  Search,
  Filter,
  FileText,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
import { formatDistanceToNow } from "date-fns";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, visible, hidden, hasComments
  const [selectedUser, setSelectedUser] = useState(null); // { _id, name }
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalData, setModalData] = useState({ action: null, targetId: null, type: "post" });

  const token = localStorage.getItem("adminToken");

  const loadPosts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchAllPosts(token);
      setPosts(data || []);
    } catch (err) {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [token]);

  // Extract unique authors
  const authors = useMemo(() => {
    const map = new Map();
    posts.forEach((post) => {
      if (post.author && post.author._id) {
        map.set(post.author._id, post.author);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name?.localeCompare(b.name));
  }, [posts]);

  // Filtered authors in dropdown
  const filteredAuthors = useMemo(() => {
    if (!userSearch) return authors;
    return authors.filter((u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [authors, userSearch]);

  // Final filtered posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.text?.toLowerCase().includes(term) ||
          post.author?.name?.toLowerCase().includes(term) ||
          post.author?.username?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filter === "visible") filtered = filtered.filter((p) => !p.hidden);
    if (filter === "hidden") filtered = filtered.filter((p) => p.hidden);
    if (filter === "hasComments") filtered = filtered.filter((p) => (p.comments?.length || 0) > 0);

    // User filter
    if (selectedUser) {
      filtered = filtered.filter((p) => p.author?._id === selectedUser._id);
    }

    return filtered;
  }, [posts, searchTerm, filter, selectedUser]);

  const toggleComments = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }

    const post = posts.find((p) => p._id === postId);
    if (!post.comments || post.comments.length === 0) {
      try {
        const allComments = await fetchAllComments(token);
        // const postComments = allComments.filter((c) => c.postId === postId);
        const postComments = allComments.filter((c) => c.postId === postId || c.postId?._id === postId || String(c.postId) === String(postId));

        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, comments: postComments } : p))
        );
      } catch (err) {
        showToast("Failed to load comments", "error");
      }
    }
    setExpandedPost(postId);
  };

  const openConfirmModal = (action, id, type = "post") => {
    setModalData({ action, targetId: id, type });
  };

  const closeConfirmModal = () => setModalData({ action: null, targetId: null, type: "post" });

  const handleConfirm = async () => {
    const { action, targetId, type } = modalData;
    try {
      if (type === "post") {
        if (action === "hide") await hidePost(targetId, token);
        if (action === "unhide") await unhidePost(targetId, token);
        if (action === "delete") await deletePost(targetId, token);

        setPosts((prev) =>
          action === "delete"
            ? prev.filter((p) => p._id !== targetId)
            : prev.map((p) => (p._id === targetId ? { ...p, hidden: action === "hide" } : p))
        );
      } else {
        if (action === "hide") await hideComment(targetId, token);
        if (action === "unhide") await unhideComment(targetId, token);
        if (action === "delete") await deleteComment(targetId, token);

        setPosts((prev) =>
          prev.map((post) => ({
            ...post,
            comments:
              post.comments
                ?.map((c) =>
                  c._id === targetId
                    ? action === "delete"
                      ? null
                      : { ...c, hidden: action === "hide" }
                    : c
                )
                .filter(Boolean) || [],
          }))
        );
      }
      showToast("Success", "success");
    } catch (err) {
      showToast("Action failed", "error");
    } finally {
      closeConfirmModal();
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Moderate posts and comments</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-gray-600 dark:text-gray-400">Total Posts:</span>
            <span className="text-2xl font-bold text-primary">{posts.length}</span>
            {(searchTerm || filter !== "all" || selectedUser) && (
              <span className="text-gray-500 dark:text-gray-400">
                → Showing {filteredPosts.length}
              </span>
            )}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-5">
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons + User Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                  filter === "all"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilter("visible")}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                  filter === "visible"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Visible
              </button>
              <button
                onClick={() => setFilter("hidden")}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                  filter === "hidden"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Hidden
              </button>
              <button
                onClick={() => setFilter("hasComments")}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                  filter === "hasComments"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                With Comments
              </button>
            </div>

            {/* Filter by User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                  selectedUser
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <User size={16} />
                {selectedUser ? selectedUser.name : "Filter by User"}
                <ChevronDown size={16} className={`transition ${showUserDropdown ? "rotate-180" : ""}`} />
              </button>

              {showUserDropdown && (
                <div className="absolute top-full mt-2 w-80 left-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredAuthors.length === 0 ? (
                      <p className="px-4 py-6 text-center text-gray-500 text-sm">No users found</p>
                    ) : (
                      filteredAuthors.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDropdown(false);
                            setUserSearch("");
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                        >
                          <DevstaAvatar user={user} size={32} />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                            {user.username && (
                              <div className="text-xs text-gray-500">@{user.username}</div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  {selectedUser && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setSelectedUser(null);
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2"
                      >
                        <X size={16} /> Clear user filter
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest of your table (unchanged except filteredPosts) */}
        <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* ... same thead as before ... */}
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Comments</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  Array(6).fill().map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-6"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96"></div></td>
                      <td className="px-6 py-6"><div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800"></div></td>
                      <td className="px-6 py-6"><div className="h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div></td>
                      <td className="px-6 py-6"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div></td>
                      <td className="px-6 py-6"><div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div></td>
                    </tr>
                  ))
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-500 dark:text-gray-400">
                        No posts match your filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <React.Fragment key={post._id}>
                      {/* Your existing post row + comments expansion */}
                      {/* ... (same as before) */}
                      <tr className={`hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all ${post.hidden ? "bg-red-50/40 dark:bg-red-900/10" : ""}`}>
                        <td className="px-6 py-5 cursor-pointer max-w-lg" onClick={() => setSelectedPost(post)}>
                          <p className={`font-medium text-gray-900 dark:text-white ${post.hidden ? "line-through opacity-70" : ""}`}>
                            {post.text?.slice(0, 90) || "No content"}{post.text?.length > 90 ? "..." : ""}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <DevstaAvatar user={post.author} size={36} />
                            <span className="font-medium text-gray-900 dark:text-white">{post.author?.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${post.hidden ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                            {post.hidden ? "HIDDEN" : "VISIBLE"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button onClick={() => toggleComments(post._id)} className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition">
                            <MessageCircle size={18} />
                            <span>{post.comments?.length || 0}</span>
                            <span className="text-xs">{expandedPost === post._id ? "Up" : "Down"}</span>
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {post.hidden ? (
                              <button onClick={() => openConfirmModal("unhide", post._id, "post")} className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-sm" title="Unhide">
                                <Eye size={16} />
                              </button>
                            ) : (
                              <button onClick={() => openConfirmModal("hide", post._id, "post")} className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-sm" title="Hide">
                                <EyeOff size={16} />
                              </button>
                            )}
                            <button onClick={() => openConfirmModal("delete", post._id, "post")} className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded comments row — unchanged */}
                      {expandedPost === post._id && (
                        <tr>
                          <td colSpan={5} className="bg-gray-50 dark:bg-gray-900/30 px-6 py-5 border-t border-gray-300 dark:border-gray-700">
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {post.comments?.length > 0 ? (
                                post.comments.map((comment) => (
                                  <div
                                    key={comment._id}
                                    className={`flex gap-4 p-4 rounded-xl border ${
                                      comment.hidden
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                    }`}
                                  >
                                    <DevstaAvatar user={comment.authorId} size={36} />
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-gray-900 dark:text-white">
                                            {comment.authorId?.name || "User"}
                                          </span>
                                          {post.author?._id === comment.authorId?._id && (
                                            <span className="text-xs px-2 py-0.5 bg-primary text-white rounded-full font-bold">OP</span>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          {comment.hidden ? (
                                            <button
                                              onClick={() => openConfirmModal("unhide", comment._id, "comment")}
                                              className="text-xs px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium"
                                            >
                                              Unhide
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => openConfirmModal("hide", comment._id, "comment")}
                                              className="text-xs px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium"
                                            >
                                              Hide
                                            </button>
                                          )}
                                          <button
                                            onClick={() => openConfirmModal("delete", comment._id, "comment")}
                                            className="text-xs p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>
                                      <p className={`text-sm ${comment.hidden ? "line-through text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>
                                        {comment.text}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 italic py-6">No comments yet</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <PostContentModal open={!!selectedPost} post={selectedPost} onClose={() => setSelectedPost(null)} />

        {modalData.action && (
          <ConfirmModal
            open={true}
            title={`Confirm ${modalData.action} ${modalData.type}?`}
            message={
              <div className="space-y-2">
                {modalData.action === "delete" ? (
                  <span>This action <strong className="text-red-600">cannot be undone</strong>.</span>
                ) : (
                  <span>This will update visibility of the {modalData.type}.</span>
                )}
              </div>
            }
            confirmLabel={modalData.action === "delete" ? "Delete Forever" : "Confirm"}
            cancelLabel="Cancel"
            onConfirm={handleConfirm}
            onCancel={closeConfirmModal}
            destructive={modalData.action === "delete"}
            confirmButtonClass={modalData.action === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"}
          />
        )}
      </div>
    </AdminDashboardLayout>
  );
}