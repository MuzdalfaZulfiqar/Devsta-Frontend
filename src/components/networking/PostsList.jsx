import { useEffect, useState } from "react";
import { getFeed } from "../../api/post";
import PostCard from "./PostCard";
import { useLocation, useParams } from "react-router-dom";
import { getFlaggedPostIdsForUser } from "../../api/post";

export default function PostsList({ newPost, currentUserId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedMode, setFeedMode] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const [flaggedPostIds, setFlaggedPostIds] = useState(new Set());

  const { postId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchFlagged = async () => {
      const ids = await getFlaggedPostIdsForUser();
      setFlaggedPostIds(new Set(ids));
    };

    fetchFlagged();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetPostId = params.get("post") || postId;

    if (targetPostId) {
      setTimeout(() => {
        const postEl = document.querySelector(`[data-post-id="${targetPostId}"]`);
        if (postEl) {
          postEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [location, postId, posts]);

  const normalizePost = (post) => ({
    ...post,
    mediaUrls: post.media?.map((m) => m.url) || post.mediaUrls || [],
  });

  const loadFeed = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);

      const res = await getFeed(pageNumber, limit);

      const normalizedItems = (res.items || []).map(normalizePost);

      if (pageNumber === 1) {
        setPosts(normalizedItems);
      } else {
        setPosts((prev) => [...prev, ...normalizedItems]);
      }

      setFeedMode(res.mode || "");
      setHasMore(normalizedItems.length === limit);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to load personalized feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed(1);
  }, []);

  useEffect(() => {
    if (newPost) {
      const normalizedNewPost = normalizePost(newPost);

      setPosts((prev) => {
        const exists = prev.some((p) => p._id === normalizedNewPost._id);
        if (exists) return prev;
        return [normalizedNewPost, ...prev];
      });
    }
  }, [newPost]);

  if (loading) {
    return <p className="text-gray-500">Loading personalized feed...</p>;
  }

  return (
    <div>
      {feedMode === "personalized" && posts.length > 0 && (
        <p className="mb-3 text-xs font-medium text-gray-400">
          Personalized for your skills, role, and interests
        </p>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available.</p>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post._id} data-post-id={post._id}>
              <PostCard
                post={post}
                currentUserId={currentUserId}
                onDeletePost={(postId) => {
                  setPosts((prev) => prev.filter((p) => p._id !== postId));
                }}
                onEditPost={(updatedPost) => {
                  const normalizedUpdated = normalizePost(updatedPost);

                  setPosts((prev) =>
                    prev.map((p) =>
                      p._id === normalizedUpdated._id ? normalizedUpdated : p
                    )
                  );
                }}
                isFlaggedBySystem={flaggedPostIds.has(post._id)}
              />
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => loadFeed(page + 1)}
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}