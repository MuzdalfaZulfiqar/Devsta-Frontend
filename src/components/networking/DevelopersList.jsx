import UserCard from "./UserCard";

export default function DevelopersList({ loading, users, onUserClick, compact = false, simple = false, active = false }) {
  if (loading) {
    return <p className="text-gray-400">Loading developers…</p>;
  }

  if (users.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No developers found.</p>;
  }

  return (
    <div className="flex-1 min-w-0 space-y-3">

      {users.map((u) => (
        <UserCard
          key={u._id}
          user={u}
          onClick={() => onUserClick && onUserClick(u)}
          compact={compact}
          simple={simple}  // pass it here!
          active={u.active}
        />
      ))}

    </div>
  );
}