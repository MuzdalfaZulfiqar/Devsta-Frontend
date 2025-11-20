import React, { useState, useEffect } from "react";
import CreatePostBox from "../../components/networking/CreatePostBox";
import PostCard from "../../components/networking/PostCard";
import { getPostsByUser } from "../../api/post";
import { useAuth } from "../../context/AuthContext";

export default function MyPosts() {
  const { user } = useAuth();
  const currentUserId = user?._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState(null);

  const loadPosts = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const res = await getPostsByUser(currentUserId);
      const normalizedItems = (res.items || []).map(post => ({
        ...post,
        mediaUrls: post.media?.map(m => m.url) || [],
      }));
      setPosts(normalizedItems);
    } catch (err) {
      console.error("Failed to load user's posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [currentUserId]);

  // Push newly created post to top
  useEffect(() => {
    if (newPost) setPosts(prev => [newPost, ...prev]);
  }, [newPost]);

  if (loading) return <p className="text-center py-6">Loading your posts…</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      
      {/* Heading for Add Post */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Add a New Post</h2>
        <CreatePostBox onPostCreated={setNewPost} />
      </div>

      {/* Heading for Manage Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-6">You haven't posted anything yet.</p>
        ) : (
          posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onDeletePost={(postId) => setPosts(prev => prev.filter(p => p._id !== postId))}
              onEditPost={(updatedPost) =>
                setPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)))
              }
            />
          ))
        )}
      </div>

    </div>
  );
}
