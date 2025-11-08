export default function DevstaAvatar({
  user,
  size = 40,
  className = "",
  showBorder = true,
  hoverEffect = true,
}) {
  const getInitials = (name) => {
    if (!name) return "U";
    return name.trim()[0].toUpperCase();
  };

  // Soft Pastel Colors
 const getColorClasses = () => {
  return "bg-[#e6f4f1] text-[#2b6f65]"; 
};


  const initials = getInitials(user?.name);
  const colorClasses = getColorClasses(user?.email || user?.name);

  const baseClasses = [
    "relative flex items-center justify-center rounded-full font-semibold transition-all duration-200",
    colorClasses,
    showBorder && "ring-2 ring-gray-300 shadow-sm", // darker ring for visibility
    hoverEffect && "hover:scale-105 hover:shadow-md",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const fontSize = Math.max(12, size / 2.5);

  return (
    <div
      className={baseClasses}
      style={{
        width: size,
        height: size,
        fontSize: `${fontSize}px`,
        lineHeight: 1,
      }}
      role="img"
      aria-label={user?.name ? `${user.name}'s avatar` : "User avatar"}
    >
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.name || "User"}
          className="h-full w-full rounded-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={({ currentTarget }) => {
            currentTarget.style.display = "none";
            currentTarget.nextElementSibling.style.display = "flex";
          }}
        />
      ) : null}

      <span
        className={`absolute inset-0 flex items-center justify-center ${
          user?.avatar_url ? "hidden" : ""
        }`}
      >
        {initials}
      </span>

      {user?.isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${
            user.isOnline ? "bg-green-400" : "bg-gray-400"
          } ${size <= 32 ? "h-2 w-2" : "h-3 w-3"}`}
          title={user.isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}
