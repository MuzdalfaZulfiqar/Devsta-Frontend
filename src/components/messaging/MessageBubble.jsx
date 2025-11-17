import DevstaAvatar from "../dashboard/DevstaAvatar";

export default function MessageBubble({ msg, currentUserId }) {
    const isSender = msg?.sender?._id === currentUserId;

    // Avatar for receiver messages
    const avatarUser = !isSender ? msg.sender : null;

    return (
        <div className={`flex items-end mb-3 ${isSender ? "justify-end" : "justify-start"}`}>
            {!isSender && avatarUser && (
                <DevstaAvatar user={avatarUser} size={36} className="mr-2" />
            )}

            <div className={`flex flex-col max-w-[70%] ${isSender ? "items-end" : "items-start"}`}>
                <div
                    className={`px-4 py-2 rounded-2xl break-words ${isSender ? "bg-primary text-white rounded-br-none" : "bg-gray-200 text-gray-900 dark:bg-gray-800 rounded-bl-none"}`}
                    style={{ fontSize: "0.94rem" }} // ~5% bigger than default text-sm
                >
                    {msg.text}
                </div>
                <span className="text-[10px] text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>

            {isSender && <div className="w-[36px] h-[36px] ml-2" />}
        </div>
    );
}
