import React, { useState, useRef, useEffect } from "react";
import DevstaAvatar from "../dashboard/DevstaAvatar";
import { createPost } from "../../api/post";
import { useAuth } from "../../context/AuthContext";
import { FiImage, FiVideo } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../utils/toast";


export default function CreatePostBox({ onPostCreated }) {
    const { user } = useAuth();
    const [text, setText] = useState("");
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewMedia, setPreviewMedia] = useState(null);

    const textareaRef = useRef(null);
    const photoInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // Auto resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [text]);

    // Handle submit
    //   const handleSubmit = async () => {
    //     if (!text.trim() && mediaFiles.length === 0) return;

    //     setLoading(true);
    //     try {
    //       const res = await createPost({ text, mediaFiles, visibility: "public" });

    //       setText("");
    //       setMediaFiles([]);
    //       onPostCreated?.(res.post);
    //     } catch (err) {
    //       console.error("Post failed", err);
    //     }
    //     setLoading(false);
    //   };


    const handleSubmit = async () => {
        if (!text.trim() && mediaFiles.length === 0) return;

        showToast("Uploading your post… please wait."); 

        setLoading(true);
        try {
            const res = await createPost({ text, mediaFiles, visibility: "public" });

            // Map media objects to mediaUrls
            const mediaUrls = res.post.media?.map(m => m.url) || [];

            const normalizedPost = { ...res.post, mediaUrls };

            setText("");
            setMediaFiles([]);
            onPostCreated?.(normalizedPost);  // pass normalized post
        } catch (err) {
            console.error("Post failed", err);
        }
        setLoading(false);
    };


    // const handleFileSelect = (e) => {
    //     const files = Array.from(e.target.files);
    //     setMediaFiles((prev) => [...prev, ...files]);
    // };

    const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // NEW: detect multi-files or heavy upload
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    if (files.length >= 2 || totalSize > 15 * 1024 * 1024) {
        showToast("You are Uploading multiple/large files, Posting will take a moment.");
    }

    setMediaFiles((prev) => [...prev, ...files]);
};

    const removeMedia = (index) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            {/* MODAL FOR PREVIEW */}
            {previewMedia && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-xl p-4 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col items-center">

                        {/* Close button */}
                        <button
                            className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-1 z-50 hover:bg-black"
                            onClick={() => setPreviewMedia(null)}
                        >
                            <IoClose size={26} />
                        </button>

                        {/* Media preview - auto scaled */}
                        {previewMedia.type.startsWith("image") ? (
                            <img
                                src={URL.createObjectURL(previewMedia)}
                                className="max-h-[80vh] w-auto rounded-xl object-contain"
                                alt=""
                            />
                        ) : (
                            <video
                                src={URL.createObjectURL(previewMedia)}
                                controls
                                className="max-h-[80vh] w-auto rounded-xl object-contain"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* MAIN POST BOX */}
            <div className="bg-white shadow-md rounded-2xl p-4 mb-6">
                <div className="flex gap-3">
                    <DevstaAvatar user={user} size={45} />

                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Share something with the community..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-[14px] font-semibold resize-none
                       ring-2 ring-primary/40 focus:ring-primary transition"
                    />
                </div>

                {/* PREVIEW MEDIA BOX */}
                {mediaFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                        {mediaFiles.map((file, i) => (
                            <div key={i} className="relative w-28 h-28 group">

                                {/* Remove media button */}
                                <button
                                    onClick={() => removeMedia(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md z-20"
                                >
                                    <IoClose size={16} />
                                </button>

                                {/* Clickable preview */}
                                {file.type.startsWith("image") ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        onClick={() => setPreviewMedia(file)}
                                        className="rounded-xl object-cover w-full h-full cursor-pointer hover:opacity-80"
                                    />
                                ) : (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        onClick={() => setPreviewMedia(file)}
                                        className="rounded-xl object-cover w-full h-full cursor-pointer hover:opacity-80"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-3">

                        {/* Hidden inputs */}
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

                        {/* Add Photo button */}
                        <button
                            type="button"
                            onClick={() => photoInputRef.current.click()}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/10"
                        >
                            <FiImage />
                            <span>Add Photo</span>
                        </button>

                        {/* Add Video button */}
                        <button
                            type="button"
                            onClick={() => videoInputRef.current.click()}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/10"
                        >
                            <FiVideo />
                            <span>Add Video</span>
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || (!text.trim() && mediaFiles.length === 0)}
                        className="bg-primary text-white px-5 py-2 rounded-full font-semibold text-sm disabled:opacity-50"
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </>
    );
}
