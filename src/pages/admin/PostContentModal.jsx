import React from "react";
import { X } from "lucide-react";

export default function PostContentModal({ open, post, onClose }) {
  if (!open || !post) return null;

  const { text, mediaUrls, author, createdAt } = post;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Author & Timestamp */}
        {(author || createdAt) && (
          <div className="flex items-center gap-4 mb-4">
            {/* Placeholder avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold text-lg">
              {author?.name ? author.name[0] : "U"}
            </div>

            <div>
              {author && <p className="text-gray-900 dark:text-white font-semibold">{author.name}</p>}
              {createdAt && (
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {new Date(createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Post Body */}
        <div className="max-h-[65vh] overflow-y-auto space-y-4">
          {text && (
            <p className="text-gray-900 dark:text-white text-base md:text-lg whitespace-pre-wrap">
              {text}
            </p>
          )}

          {/* Media Preview */}
          {mediaUrls && mediaUrls.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaUrls.map((url, idx) => {
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                return isVideo ? (
                  <video
                    key={idx}
                    controls
                    className="w-full rounded-2xl bg-black shadow-md"
                  >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    key={idx}
                    src={url}
                    alt={`media-${idx}`}
                    className="w-full rounded-2xl object-cover shadow-md"
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-full font-semibold shadow-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
