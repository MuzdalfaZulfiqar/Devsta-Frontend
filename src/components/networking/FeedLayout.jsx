import React, { useState } from "react";
import CreatePostBox from "./CreatePostBox";
import PostsList from "./PostsList";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import { useAuth } from "../../context/AuthContext";

export default function FeedLayout() {
  const [newPost, setNewPost] = useState(null);

    const { user } = useAuth();
  const currentUserId = user?._id;
  return (
    <div className="grid grid-cols-12 gap-6 w-full">
      
      {/* MAIN FEED (Left 8 columns) */}
      <div className="col-span-12 md:col-span-8">
        <CreatePostBox onPostCreated={setNewPost} />
         <PostsList newPost={newPost} currentUserId={currentUserId} />
      </div>

      {/* RIGHT SIDEBAR (Hidden on mobile) */}
      <div className="hidden md:block col-span-4 space-y-4">
        <PeopleYouMayKnow />
      </div>
    </div>
  );
}
