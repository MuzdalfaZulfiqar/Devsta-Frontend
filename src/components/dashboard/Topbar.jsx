export default function Topbar({ user }) {
  return (
    <div className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800 font-fragment">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex items-center gap-3">
        <span className="hidden md:block">{user?.name}</span>
        {user?.avatar_url && (
          <img
            src={user.avatar_url}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}
