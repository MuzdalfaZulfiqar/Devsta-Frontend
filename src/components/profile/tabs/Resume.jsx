export default function Resume({ user }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-lg font-semibold text-white">Resume</h2>

      {user.resumeUrl ? (
        <a
          href={user.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-black border border-primary/20 rounded-lg p-4 hover:border-primary transition"
        >
          <p className="text-white font-medium">View Resume</p>
        </a>
      ) : (
        <div className="bg-black border border-primary/20 p-4 rounded-lg text-gray-400">
          No resume uploaded
        </div>
      )}
    </div>
  );
}
