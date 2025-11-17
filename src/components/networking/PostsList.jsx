import { useEffect, useState } from "react";
import { getFeed } from "../../api/post";
import PostCard from "./PostCard";

export default function PostsList({ newPost, currentUserId }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);          // Current page
    const [hasMore, setHasMore] = useState(true); // Whether more posts are available
    const limit = 10; // Number of posts per page (adjust if needed)
    // Load feed
    const loadFeed = async (pageNumber = 1) => {
        try {
            const res = await getFeed(pageNumber, limit);

            const normalizedItems = res.items.map(post => ({
                ...post,
                mediaUrls: post.media?.map(m => m.url) || []
            }));

            if (pageNumber === 1) {
                setPosts(normalizedItems);
            } else {
                setPosts(prev => [...prev, ...normalizedItems]);
            }

            setHasMore(res.items.length === limit);
            setPage(pageNumber);
        } catch (err) {
            console.error("Failed to load feed:", err);
        } finally {
            setLoading(false);
        }
    };


    // Initial load
    useEffect(() => {
        loadFeed(1);
    }, []);

    // Push new post to top
    useEffect(() => {
        if (newPost) {
            setPosts((prev) => [newPost, ...prev]);
        }
    }, [newPost]);

    if (loading) return <p className="text-gray-500">Loading feed...</p>;

    return (
        <div>
            {posts.length === 0 ? (
                <p className="text-gray-500">No posts available.</p>
            ) : (
                <>
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            currentUserId={currentUserId}
                            onDeletePost={(postId) => {
                                setPosts(prev => prev.filter(p => p._id !== postId));
                            }}
                            onEditPost={(updatedPost) => {
                                setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
                            }}
                        />
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
